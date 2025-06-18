
-- Phase 1: Database Schema Updates

-- 1. Extend menu_items table with additional fields
ALTER TABLE menu_items 
ADD COLUMN IF NOT EXISTS badge_type TEXT CHECK (badge_type IN ('terlaris', 'baru')),
ADD COLUMN IF NOT EXISTS stock_quantity INTEGER DEFAULT 50,
ADD COLUMN IF NOT EXISTS is_featured BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS sort_order INTEGER DEFAULT 0;

-- 2. Create favorites table for customer favorites
CREATE TABLE IF NOT EXISTS favorites (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  customer_email TEXT NOT NULL,
  menu_item_id TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  FOREIGN KEY (menu_item_id) REFERENCES menu_items(id) ON DELETE CASCADE,
  UNIQUE(customer_email, menu_item_id)
);

-- Enable RLS for favorites table
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;

-- RLS policies for favorites
CREATE POLICY "Users can view all favorites" ON favorites
FOR SELECT USING (true);

CREATE POLICY "Users can insert their own favorites" ON favorites
FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can delete their own favorites" ON favorites
FOR DELETE USING (true);

-- 3. Create menu_analytics table for tracking data
CREATE TABLE IF NOT EXISTS menu_analytics (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  menu_item_id TEXT NOT NULL UNIQUE,
  total_favorites INTEGER DEFAULT 0,
  total_orders INTEGER DEFAULT 0,
  average_rating DECIMAL(3,2) DEFAULT 0,
  total_reviews INTEGER DEFAULT 0,
  last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  FOREIGN KEY (menu_item_id) REFERENCES menu_items(id) ON DELETE CASCADE
);

-- Enable RLS for menu_analytics table
ALTER TABLE menu_analytics ENABLE ROW LEVEL SECURITY;

-- RLS policies for menu_analytics (read-only for public, admin can manage)
CREATE POLICY "Public can view menu analytics" ON menu_analytics
FOR SELECT USING (true);

CREATE POLICY "Allow insert for menu analytics" ON menu_analytics
FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow update for menu analytics" ON menu_analytics
FOR UPDATE USING (true);

-- 4. Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_favorites_customer_email ON favorites(customer_email);
CREATE INDEX IF NOT EXISTS idx_favorites_menu_item_id ON favorites(menu_item_id);
CREATE INDEX IF NOT EXISTS idx_menu_items_badge_type ON menu_items(badge_type);
CREATE INDEX IF NOT EXISTS idx_menu_items_stock_quantity ON menu_items(stock_quantity);
CREATE INDEX IF NOT EXISTS idx_menu_items_sort_order ON menu_items(sort_order);

-- 5. Create function to update menu analytics automatically
CREATE OR REPLACE FUNCTION update_menu_analytics()
RETURNS TRIGGER AS $$
BEGIN
  -- Update analytics when favorites are added/removed
  IF TG_TABLE_NAME = 'favorites' THEN
    INSERT INTO menu_analytics (menu_item_id, total_favorites)
    VALUES (COALESCE(NEW.menu_item_id, OLD.menu_item_id), 0)
    ON CONFLICT (menu_item_id) 
    DO UPDATE SET 
      total_favorites = (
        SELECT COUNT(*) FROM favorites 
        WHERE menu_item_id = COALESCE(NEW.menu_item_id, OLD.menu_item_id)
      ),
      last_updated = NOW();
  END IF;

  -- Update analytics when reviews are added/updated
  IF TG_TABLE_NAME = 'reviews' THEN
    INSERT INTO menu_analytics (menu_item_id, average_rating, total_reviews)
    VALUES (COALESCE(NEW.menu_item_id, OLD.menu_item_id), 0, 0)
    ON CONFLICT (menu_item_id)
    DO UPDATE SET 
      average_rating = (
        SELECT COALESCE(AVG(rating), 0) FROM reviews 
        WHERE menu_item_id = COALESCE(NEW.menu_item_id, OLD.menu_item_id)
      ),
      total_reviews = (
        SELECT COUNT(*) FROM reviews 
        WHERE menu_item_id = COALESCE(NEW.menu_item_id, OLD.menu_item_id)
      ),
      last_updated = NOW();
  END IF;

  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- 6. Create triggers to automatically update analytics
CREATE TRIGGER favorites_analytics_trigger
  AFTER INSERT OR DELETE ON favorites
  FOR EACH ROW EXECUTE FUNCTION update_menu_analytics();

CREATE TRIGGER reviews_analytics_trigger
  AFTER INSERT OR UPDATE OR DELETE ON reviews
  FOR EACH ROW EXECUTE FUNCTION update_menu_analytics();

-- 7. Initialize analytics for existing menu items
INSERT INTO menu_analytics (menu_item_id, total_favorites, total_orders, average_rating, total_reviews)
SELECT 
  mi.id,
  COALESCE(f.favorite_count, 0) as total_favorites,
  0 as total_orders,
  COALESCE(r.avg_rating, 0) as average_rating,
  COALESCE(r.review_count, 0) as total_reviews
FROM menu_items mi
LEFT JOIN (
  SELECT menu_item_id, COUNT(*) as favorite_count 
  FROM favorites 
  GROUP BY menu_item_id
) f ON mi.id = f.menu_item_id
LEFT JOIN (
  SELECT menu_item_id, AVG(rating) as avg_rating, COUNT(*) as review_count
  FROM reviews 
  GROUP BY menu_item_id
) r ON mi.id = r.menu_item_id
ON CONFLICT (menu_item_id) DO NOTHING;
