
-- Fix storage policies for payment-proofs bucket
-- First, drop existing policies to avoid conflicts
DROP POLICY IF EXISTS "Users can upload payment proofs" ON storage.objects;
DROP POLICY IF EXISTS "Users can view their own payment proof files" ON storage.objects;
DROP POLICY IF EXISTS "Admins can view all payment proof files" ON storage.objects;

-- Create more permissive policies for payment-proofs bucket
CREATE POLICY "Users can upload payment proofs" ON storage.objects 
FOR INSERT WITH CHECK (
  bucket_id = 'payment-proofs' AND 
  auth.uid() IS NOT NULL
);

CREATE POLICY "Users can view their own payment proofs" ON storage.objects 
FOR SELECT USING (
  bucket_id = 'payment-proofs' AND 
  (auth.uid()::text = (storage.foldername(name))[1] OR auth.uid() IS NOT NULL)
);

CREATE POLICY "Admins can view all payment proofs" ON storage.objects 
FOR SELECT USING (
  bucket_id = 'payment-proofs' AND 
  has_role(auth.uid(), 'admin'::app_role)
);

-- Also ensure the payment_proofs table policies are correct
-- Drop and recreate the insert policy to be more permissive
DROP POLICY IF EXISTS "Users can insert their own payment proofs" ON payment_proofs;

CREATE POLICY "Users can insert their own payment proofs" ON payment_proofs
FOR INSERT WITH CHECK (
  auth.uid() IS NOT NULL AND
  purchase_id IN (
    SELECT id FROM purchases WHERE user_id = auth.uid()
  )
);
