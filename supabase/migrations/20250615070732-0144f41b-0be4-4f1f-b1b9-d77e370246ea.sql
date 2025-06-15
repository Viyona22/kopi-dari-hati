
-- Drop existing foreign key constraint if exists
ALTER TABLE purchases DROP CONSTRAINT IF EXISTS fk_menu_items_category;

-- Drop and recreate purchases table with complete transaction details
DROP TABLE IF EXISTS purchases;

CREATE TABLE purchases (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  customer_name TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  customer_address TEXT,
  order_items JSONB NOT NULL, -- Store array of ordered items with details
  total_amount INTEGER NOT NULL, -- Store as integer (cents/rupiah)
  payment_method TEXT NOT NULL CHECK (payment_method IN ('cod', 'qris', 'transfer')),
  status TEXT NOT NULL DEFAULT 'Diproses' CHECK (status IN ('Diproses', 'Selesai', 'Dibatalkan')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS for purchases table
ALTER TABLE purchases ENABLE ROW LEVEL SECURITY;

-- Allow public read access to purchases
CREATE POLICY "Enable read access for all users" ON purchases
FOR SELECT USING (true);

-- Allow public insert access to purchases
CREATE POLICY "Enable insert access for all users" ON purchases
FOR INSERT WITH CHECK (true);

-- Allow public update access to purchases
CREATE POLICY "Enable update access for all users" ON purchases
FOR UPDATE USING (true);

-- Allow public delete access to purchases
CREATE POLICY "Enable delete access for all users" ON purchases
FOR DELETE USING (true);
