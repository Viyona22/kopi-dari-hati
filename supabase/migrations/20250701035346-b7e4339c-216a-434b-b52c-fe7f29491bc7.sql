
-- Make the id column auto-generate using gen_random_uuid() as default
ALTER TABLE menu_items ALTER COLUMN id SET DEFAULT gen_random_uuid()::text;
