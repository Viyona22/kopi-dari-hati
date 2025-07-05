
-- Check the current constraint on purchases table for payment_method
SELECT conname, pg_get_constraintdef(oid) 
FROM pg_constraint 
WHERE conrelid = 'purchases'::regclass 
AND contype = 'c';

-- Drop the existing check constraint if it exists
ALTER TABLE purchases DROP CONSTRAINT IF EXISTS purchases_payment_method_check;

-- Add the correct check constraint that matches our payment method constants
ALTER TABLE purchases ADD CONSTRAINT purchases_payment_method_check 
CHECK (payment_method IN ('qris', 'bank_transfer', 'ewallet'));
