
-- Create a categories table to store dynamic menu categories
CREATE TABLE IF NOT EXISTS categories (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  display_name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default categories
INSERT INTO categories (id, name, display_name) VALUES 
  ('kopi', 'kopi', 'Kopi Special'),
  ('cemilan', 'cemilan', 'Cemilan Favorite'),
  ('makanan', 'makanan', 'Makan Kenyang')
ON CONFLICT (id) DO NOTHING;

-- Add foreign key constraint to menu_items table to reference categories
ALTER TABLE menu_items 
ADD CONSTRAINT fk_menu_items_category 
FOREIGN KEY (category) REFERENCES categories(id) 
ON UPDATE CASCADE ON DELETE RESTRICT;

-- Enable RLS for categories table
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

-- Allow public read access to categories
CREATE POLICY "Enable read access for all users" ON categories
FOR SELECT USING (true);

-- Allow public insert/update/delete access to categories (for admin)
CREATE POLICY "Enable insert access for all users" ON categories
FOR INSERT WITH CHECK (true);

CREATE POLICY "Enable update access for all users" ON categories
FOR UPDATE USING (true);

CREATE POLICY "Enable delete access for all users" ON categories
FOR DELETE USING (true);
