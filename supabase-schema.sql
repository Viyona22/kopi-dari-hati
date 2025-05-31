
-- Create menu_items table
CREATE TABLE IF NOT EXISTS menu_items (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  price INTEGER NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('kopi', 'cemilan', 'makanan')),
  description TEXT,
  image TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create reservations table
CREATE TABLE IF NOT EXISTS reservations (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  date TEXT NOT NULL,
  guests INTEGER NOT NULL,
  time TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('Menunggu', 'Dalam Proses', 'Selesai', 'Batal')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create purchases table
CREATE TABLE IF NOT EXISTS purchases (
  id TEXT PRIMARY KEY,
  date TEXT NOT NULL,
  product TEXT NOT NULL,
  total TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('Diproses', 'Selesai', 'Dibatalkan')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create images storage bucket
INSERT INTO storage.buckets (id, name, public) 
VALUES ('images', 'images', true)
ON CONFLICT (id) DO NOTHING;

-- Set up Row Level Security policies
ALTER TABLE menu_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE reservations ENABLE ROW LEVEL SECURITY;
ALTER TABLE purchases ENABLE ROW LEVEL SECURITY;

-- Allow public read access to menu_items
CREATE POLICY "Enable read access for all users" ON menu_items
FOR SELECT USING (true);

-- Allow public insert/update/delete access to menu_items (for admin)
CREATE POLICY "Enable insert access for all users" ON menu_items
FOR INSERT WITH CHECK (true);

CREATE POLICY "Enable update access for all users" ON menu_items
FOR UPDATE USING (true);

CREATE POLICY "Enable delete access for all users" ON menu_items
FOR DELETE USING (true);

-- Similar policies for reservations and purchases
CREATE POLICY "Enable read access for all users" ON reservations
FOR SELECT USING (true);

CREATE POLICY "Enable insert access for all users" ON reservations
FOR INSERT WITH CHECK (true);

CREATE POLICY "Enable update access for all users" ON reservations
FOR UPDATE USING (true);

CREATE POLICY "Enable delete access for all users" ON reservations
FOR DELETE USING (true);

CREATE POLICY "Enable read access for all users" ON purchases
FOR SELECT USING (true);

CREATE POLICY "Enable insert access for all users" ON purchases
FOR INSERT WITH CHECK (true);

CREATE POLICY "Enable update access for all users" ON purchases
FOR UPDATE USING (true);

CREATE POLICY "Enable delete access for all users" ON purchases
FOR DELETE USING (true);

-- Storage policies for images bucket
CREATE POLICY "Public Access" ON storage.objects FOR SELECT USING (bucket_id = 'images');
CREATE POLICY "Public Upload" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'images');
CREATE POLICY "Public Update" ON storage.objects FOR UPDATE USING (bucket_id = 'images');
CREATE POLICY "Public Delete" ON storage.objects FOR DELETE USING (bucket_id = 'images');
