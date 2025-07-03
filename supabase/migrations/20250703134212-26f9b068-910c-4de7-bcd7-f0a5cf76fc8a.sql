
-- Create payment_proofs table for storing payment proof images
CREATE TABLE IF NOT EXISTS payment_proofs (
  id TEXT PRIMARY KEY DEFAULT (gen_random_uuid())::text,
  purchase_id TEXT NOT NULL,
  proof_image_url TEXT NOT NULL,
  uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'verified', 'rejected')),
  verified_by TEXT,
  verified_at TIMESTAMP WITH TIME ZONE,
  notes TEXT
);

-- Add payment-related columns to purchases table
ALTER TABLE purchases 
ADD COLUMN IF NOT EXISTS payment_status TEXT DEFAULT 'pending' CHECK (payment_status IN ('pending', 'uploaded', 'verified', 'failed')),
ADD COLUMN IF NOT EXISTS payment_deadline TIMESTAMP WITH TIME ZONE DEFAULT (NOW() + INTERVAL '24 hours'),
ADD COLUMN IF NOT EXISTS payment_proof_id TEXT;

-- Create storage bucket for payment proofs
INSERT INTO storage.buckets (id, name, public) 
VALUES ('payment-proofs', 'payment-proofs', false)
ON CONFLICT (id) DO NOTHING;

-- Enable RLS on payment_proofs table
ALTER TABLE payment_proofs ENABLE ROW LEVEL SECURITY;

-- RLS policies for payment_proofs
CREATE POLICY "Users can view their own payment proofs" ON payment_proofs
FOR SELECT USING (
  purchase_id IN (
    SELECT id FROM purchases WHERE user_id = auth.uid()
  )
);

CREATE POLICY "Users can insert their own payment proofs" ON payment_proofs
FOR INSERT WITH CHECK (
  purchase_id IN (
    SELECT id FROM purchases WHERE user_id = auth.uid()
  )
);

CREATE POLICY "Admins can view all payment proofs" ON payment_proofs
FOR SELECT USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update payment proofs" ON payment_proofs
FOR UPDATE USING (has_role(auth.uid(), 'admin'::app_role));

-- Storage policies for payment-proofs bucket
CREATE POLICY "Users can upload payment proofs" ON storage.objects 
FOR INSERT WITH CHECK (
  bucket_id = 'payment-proofs' AND 
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can view their own payment proofs" ON storage.objects 
FOR SELECT USING (
  bucket_id = 'payment-proofs' AND 
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Admins can view all payment proofs" ON storage.objects 
FOR SELECT USING (
  bucket_id = 'payment-proofs' AND 
  has_role(auth.uid(), 'admin'::app_role)
);
