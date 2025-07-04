
-- Create app_settings table for storing application settings
CREATE TABLE public.app_settings (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  setting_key TEXT UNIQUE NOT NULL,
  setting_value JSONB NOT NULL,
  category TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS for app_settings
ALTER TABLE public.app_settings ENABLE ROW LEVEL SECURITY;

-- Create policies for app_settings (admin only)
CREATE POLICY "Admins can view all settings" 
  ON public.app_settings 
  FOR SELECT 
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can insert settings" 
  ON public.app_settings 
  FOR INSERT 
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update settings" 
  ON public.app_settings 
  FOR UPDATE 
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete settings" 
  ON public.app_settings 
  FOR DELETE 
  USING (has_role(auth.uid(), 'admin'::app_role));

-- Create storage bucket for cafe assets
INSERT INTO storage.buckets (id, name, public) 
VALUES ('cafe-assets', 'cafe-assets', true);

-- Create storage policy for cafe-assets bucket (admin only can upload)
CREATE POLICY "Admins can upload cafe assets" 
  ON storage.objects 
  FOR INSERT 
  WITH CHECK (
    bucket_id = 'cafe-assets' 
    AND has_role(auth.uid(), 'admin'::app_role)
  );

CREATE POLICY "Anyone can view cafe assets" 
  ON storage.objects 
  FOR SELECT 
  USING (bucket_id = 'cafe-assets');

CREATE POLICY "Admins can update cafe assets" 
  ON storage.objects 
  FOR UPDATE 
  USING (
    bucket_id = 'cafe-assets' 
    AND has_role(auth.uid(), 'admin'::app_role)
  );

CREATE POLICY "Admins can delete cafe assets" 
  ON storage.objects 
  FOR DELETE 
  USING (
    bucket_id = 'cafe-assets' 
    AND has_role(auth.uid(), 'admin'::app_role)
  );

-- Insert default settings
INSERT INTO public.app_settings (setting_key, setting_value, category) VALUES
('cafe_name', '"Kopi dari Hati"', 'branding'),
('cafe_tagline', '"Kamu Obsesi Paling Indah dari Hati"', 'branding'),
('cafe_description', '"Pengalaman kopi dan camilan autentik dengan cita rasa Bangka yang tak terlupakan"', 'branding'),
('cafe_logo', 'null', 'branding'),
('contact_email', '"admin@kopidarhati.com"', 'contact'),
('contact_whatsapp', '"+62812345678"', 'contact'),
('contact_instagram', '"@kopidarhati"', 'contact'),
('contact_facebook', '"Kopi dari Hati Bangka"', 'contact'),
('payment_qris_enabled', 'true', 'payment'),
('payment_bank_enabled', 'true', 'payment'),
('payment_ewallet_enabled', 'false', 'payment'),
('payment_qris_value', '"https://example.com/qris"', 'payment'),
('payment_bank_account', '{"bank": "BCA", "account_number": "1234567890", "account_name": "Kopi dari Hati"}', 'payment'),
('payment_ewallet_options', '{"gopay": false, "ovo": false, "dana": false}', 'payment'),
('atmosphere_images', '["https://cdn.builder.io/api/v1/image/assets/6881c5c08f454e4a8f857991aba7c465/ff4315eb0da02eb482b73b7cdf84a06c67a301e2", "https://cdn.builder.io/api/v1/image/assets/6881c5c08f454e4a8f857991aba7c465/eedabfc471dd01fb886ab3e7cd5be0c6759d4d3d"]', 'content');
