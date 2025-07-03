
-- Update the payment-proofs bucket to be public
UPDATE storage.buckets 
SET public = true 
WHERE id = 'payment-proofs';

-- Ensure RLS policies are properly configured for storage.objects
-- Allow admins to view all payment proof files
CREATE POLICY IF NOT EXISTS "Admins can view all payment proof files" ON storage.objects 
FOR SELECT USING (
  bucket_id = 'payment-proofs' AND 
  has_role(auth.uid(), 'admin'::app_role)
);

-- Allow users to view their own payment proof files
CREATE POLICY IF NOT EXISTS "Users can view their own payment proof files" ON storage.objects 
FOR SELECT USING (
  bucket_id = 'payment-proofs' AND 
  auth.uid()::text = (storage.foldername(name))[1]
);
