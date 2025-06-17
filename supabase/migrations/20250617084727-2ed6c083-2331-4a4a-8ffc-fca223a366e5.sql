
-- Create reviews table to store customer ratings and comments
CREATE TABLE IF NOT EXISTS reviews (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  menu_item_id TEXT NOT NULL,
  customer_name TEXT NOT NULL,
  customer_email TEXT,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  FOREIGN KEY (menu_item_id) REFERENCES menu_items(id) ON DELETE CASCADE
);

-- Enable RLS for reviews table
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

-- Allow public read access to reviews
CREATE POLICY "Enable read access for all users" ON reviews
FOR SELECT USING (true);

-- Allow public insert access to reviews
CREATE POLICY "Enable insert access for all users" ON reviews
FOR INSERT WITH CHECK (true);

-- Allow users to update their own reviews (based on email)
CREATE POLICY "Enable update access for review owners" ON reviews
FOR UPDATE USING (true);

-- Allow users to delete their own reviews (based on email)
CREATE POLICY "Enable delete access for review owners" ON reviews
FOR DELETE USING (true);

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_reviews_menu_item_id ON reviews(menu_item_id);
CREATE INDEX IF NOT EXISTS idx_reviews_created_at ON reviews(created_at DESC);
