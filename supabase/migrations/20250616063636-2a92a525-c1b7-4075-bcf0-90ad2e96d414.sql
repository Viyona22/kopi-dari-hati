
-- Add phone, email, and special_requests columns to reservations table
ALTER TABLE reservations 
ADD COLUMN phone TEXT,
ADD COLUMN email TEXT,
ADD COLUMN special_requests TEXT;
