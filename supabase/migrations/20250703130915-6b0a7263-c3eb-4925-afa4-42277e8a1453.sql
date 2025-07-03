
-- Remove the old check constraint that only allows specific categories
ALTER TABLE menu_items DROP CONSTRAINT IF EXISTS menu_items_category_check;

-- The foreign key constraint from the migration will handle category validation
-- No need for additional check constraints since we have a proper foreign key relationship
