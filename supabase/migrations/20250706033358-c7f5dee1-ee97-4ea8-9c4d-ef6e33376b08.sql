
-- 1. CREATE INDEXES FOR BETTER QUERY PERFORMANCE
-- Index untuk menu_items filtering by category
CREATE INDEX IF NOT EXISTS idx_menu_items_category ON menu_items(category);

-- Index untuk menu_items sorting dan filtering
CREATE INDEX IF NOT EXISTS idx_menu_items_created_at ON menu_items(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_menu_items_featured ON menu_items(is_featured) WHERE is_featured = true;

-- Index untuk purchases filtering by user dan status
CREATE INDEX IF NOT EXISTS idx_purchases_user_id ON purchases(user_id);
CREATE INDEX IF NOT EXISTS idx_purchases_payment_status ON purchases(payment_status);
CREATE INDEX IF NOT EXISTS idx_purchases_created_at ON purchases(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_purchases_user_status ON purchases(user_id, payment_status);

-- Index untuk reservations
CREATE INDEX IF NOT EXISTS idx_reservations_user_id ON reservations(user_id);
CREATE INDEX IF NOT EXISTS idx_reservations_date ON reservations(date);
CREATE INDEX IF NOT EXISTS idx_reservations_status ON reservations(status);
CREATE INDEX IF NOT EXISTS idx_reservations_user_date ON reservations(user_id, date);

-- Index untuk reviews aggregation
CREATE INDEX IF NOT EXISTS idx_reviews_menu_item_rating ON reviews(menu_item_id, rating);

-- Index untuk payment_proofs
CREATE INDEX IF NOT EXISTS idx_payment_proofs_purchase_id ON payment_proofs(purchase_id);
CREATE INDEX IF NOT EXISTS idx_payment_proofs_status ON payment_proofs(status);

-- 2. CREATE DATABASE FUNCTIONS FOR BUSINESS LOGIC
-- Function untuk calculate menu analytics secara efisien
CREATE OR REPLACE FUNCTION calculate_menu_analytics(item_id TEXT)
RETURNS TABLE(
  total_favorites INTEGER,
  total_reviews INTEGER,
  average_rating NUMERIC,
  total_orders INTEGER
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    COALESCE((SELECT COUNT(*)::INTEGER FROM favorites WHERE menu_item_id = item_id), 0) as total_favorites,
    COALESCE((SELECT COUNT(*)::INTEGER FROM reviews WHERE menu_item_id = item_id), 0) as total_reviews,
    COALESCE((SELECT ROUND(AVG(rating), 2) FROM reviews WHERE menu_item_id = item_id), 0::NUMERIC) as average_rating,
    COALESCE((
      SELECT COUNT(*)::INTEGER 
      FROM purchases p, jsonb_array_elements(p.order_items) as item
      WHERE item->>'id' = item_id
    ), 0) as total_orders;
END;
$$ LANGUAGE plpgsql STABLE;

-- Function untuk check reservation availability
CREATE OR REPLACE FUNCTION check_reservation_availability(
  reservation_date TEXT,
  reservation_time TEXT,
  guest_count INTEGER
)
RETURNS BOOLEAN AS $$
DECLARE
  existing_reservations INTEGER;
  max_capacity INTEGER := 50; -- Asumsi kapasitas maksimal
BEGIN
  -- Hitung total guests untuk tanggal dan waktu yang sama
  SELECT COALESCE(SUM(guests), 0) INTO existing_reservations
  FROM reservations 
  WHERE date = reservation_date 
    AND time = reservation_time 
    AND status NOT IN ('Batal');
  
  -- Return true jika masih ada kapasitas
  RETURN (existing_reservations + guest_count) <= max_capacity;
END;
$$ LANGUAGE plpgsql STABLE;

-- Function untuk update menu stock after purchase
CREATE OR REPLACE FUNCTION update_menu_stock_after_purchase()
RETURNS TRIGGER AS $$
DECLARE
  item JSONB;
BEGIN
  -- Loop through order items and update stock
  FOR item IN SELECT * FROM jsonb_array_elements(NEW.order_items)
  LOOP
    UPDATE menu_items 
    SET stock_quantity = GREATEST(0, stock_quantity - (item->>'quantity')::INTEGER)
    WHERE id = item->>'id';
  END LOOP;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger untuk auto update stock
DROP TRIGGER IF EXISTS trigger_update_stock_after_purchase ON purchases;
CREATE TRIGGER trigger_update_stock_after_purchase
  AFTER INSERT ON purchases
  FOR EACH ROW
  WHEN (NEW.status = 'Selesai')
  EXECUTE FUNCTION update_menu_stock_after_purchase();

-- 3. IMPROVED MENU ANALYTICS UPDATE FUNCTION
CREATE OR REPLACE FUNCTION update_menu_analytics_improved()
RETURNS TRIGGER AS $$
DECLARE
  target_menu_item_id TEXT;
BEGIN
  -- Determine which menu item to update
  IF TG_TABLE_NAME = 'favorites' THEN
    target_menu_item_id = COALESCE(NEW.menu_item_id, OLD.menu_item_id);
  ELSIF TG_TABLE_NAME = 'reviews' THEN
    target_menu_item_id = COALESCE(NEW.menu_item_id, OLD.menu_item_id);
  ELSIF TG_TABLE_NAME = 'purchases' THEN
    -- Handle purchases - update analytics for all items in the order
    IF NEW.status = 'Selesai' THEN
      -- Update analytics for each item in the purchase
      WITH order_items AS (
        SELECT DISTINCT item->>'id' as menu_item_id
        FROM jsonb_array_elements(NEW.order_items) as item
      )
      UPDATE menu_analytics 
      SET 
        total_orders = (
          SELECT COUNT(*)
          FROM purchases p, jsonb_array_elements(p.order_items) as item
          WHERE item->>'id' = menu_analytics.menu_item_id
            AND p.status = 'Selesai'
        ),
        last_updated = NOW()
      WHERE menu_item_id IN (SELECT menu_item_id FROM order_items);
      
      RETURN NEW;
    END IF;
  END IF;

  -- Update analytics for favorites and reviews
  IF target_menu_item_id IS NOT NULL THEN
    INSERT INTO menu_analytics (menu_item_id, total_favorites, total_reviews, average_rating, total_orders)
    SELECT 
      target_menu_item_id,
      COALESCE(f.favorite_count, 0),
      COALESCE(r.review_count, 0),
      COALESCE(r.avg_rating, 0),
      COALESCE(o.order_count, 0)
    FROM (SELECT target_menu_item_id as id) base
    LEFT JOIN (
      SELECT COUNT(*) as favorite_count 
      FROM favorites 
      WHERE menu_item_id = target_menu_item_id
    ) f ON true
    LEFT JOIN (
      SELECT COUNT(*) as review_count, ROUND(AVG(rating), 2) as avg_rating
      FROM reviews 
      WHERE menu_item_id = target_menu_item_id
    ) r ON true
    LEFT JOIN (
      SELECT COUNT(*) as order_count
      FROM purchases p, jsonb_array_elements(p.order_items) as item
      WHERE item->>'id' = target_menu_item_id
        AND p.status = 'Selesai'
    ) o ON true
    ON CONFLICT (menu_item_id) 
    DO UPDATE SET 
      total_favorites = EXCLUDED.total_favorites,
      total_reviews = EXCLUDED.total_reviews,
      average_rating = EXCLUDED.average_rating,
      total_orders = EXCLUDED.total_orders,
      last_updated = NOW();
  END IF;

  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Update triggers to use improved function
DROP TRIGGER IF EXISTS favorites_analytics_trigger ON favorites;
DROP TRIGGER IF EXISTS reviews_analytics_trigger ON reviews;

CREATE TRIGGER favorites_analytics_trigger
  AFTER INSERT OR DELETE ON favorites
  FOR EACH ROW EXECUTE FUNCTION update_menu_analytics_improved();

CREATE TRIGGER reviews_analytics_trigger
  AFTER INSERT OR UPDATE OR DELETE ON reviews
  FOR EACH ROW EXECUTE FUNCTION update_menu_analytics_improved();

CREATE TRIGGER purchases_analytics_trigger
  AFTER UPDATE ON purchases
  FOR EACH ROW EXECUTE FUNCTION update_menu_analytics_improved();

-- 4. CREATE MATERIALIZED VIEW FOR DASHBOARD METRICS
CREATE MATERIALIZED VIEW IF NOT EXISTS dashboard_metrics AS
SELECT 
  'today' as period,
  COUNT(*) FILTER (WHERE DATE(created_at) = CURRENT_DATE) as today_orders,
  SUM(total_amount) FILTER (WHERE DATE(created_at) = CURRENT_DATE) as today_revenue,
  COUNT(*) FILTER (WHERE DATE(created_at) >= CURRENT_DATE - INTERVAL '7 days') as week_orders,
  SUM(total_amount) FILTER (WHERE DATE(created_at) >= CURRENT_DATE - INTERVAL '7 days') as week_revenue,
  COUNT(*) FILTER (WHERE DATE(created_at) >= CURRENT_DATE - INTERVAL '30 days') as month_orders,
  SUM(total_amount) FILTER (WHERE DATE(created_at) >= CURRENT_DATE - INTERVAL '30 days') as month_revenue
FROM purchases
WHERE status = 'Selesai';

-- Create unique index on materialized view
CREATE UNIQUE INDEX IF NOT EXISTS idx_dashboard_metrics_period ON dashboard_metrics(period);

-- Function to refresh dashboard metrics
CREATE OR REPLACE FUNCTION refresh_dashboard_metrics()
RETURNS VOID AS $$
BEGIN
  REFRESH MATERIALIZED VIEW CONCURRENTLY dashboard_metrics;
END;
$$ LANGUAGE plpgsql;

-- 5. CREATE AUDIT LOG TABLE FOR IMPORTANT CHANGES
CREATE TABLE IF NOT EXISTS audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  table_name TEXT NOT NULL,
  operation TEXT NOT NULL,
  old_data JSONB,
  new_data JSONB,
  user_id UUID,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on audit_logs
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- Only admins can view audit logs
CREATE POLICY "Admins can view audit logs" ON audit_logs
  FOR SELECT USING (has_role(auth.uid(), 'admin'::app_role));

-- Create index for audit logs
CREATE INDEX IF NOT EXISTS idx_audit_logs_timestamp ON audit_logs(timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_audit_logs_table_operation ON audit_logs(table_name, operation);

-- Function for audit logging
CREATE OR REPLACE FUNCTION audit_trigger_function()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO audit_logs (table_name, operation, old_data, new_data, user_id)
  VALUES (
    TG_TABLE_NAME,
    TG_OP,
    CASE WHEN TG_OP = 'DELETE' THEN row_to_json(OLD) ELSE NULL END,
    CASE WHEN TG_OP IN ('INSERT', 'UPDATE') THEN row_to_json(NEW) ELSE NULL END,
    auth.uid()
  );
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Add audit triggers for important tables
CREATE TRIGGER audit_purchases_trigger
  AFTER INSERT OR UPDATE OR DELETE ON purchases
  FOR EACH ROW EXECUTE FUNCTION audit_trigger_function();

CREATE TRIGGER audit_menu_items_trigger
  AFTER INSERT OR UPDATE OR DELETE ON menu_items
  FOR EACH ROW EXECUTE FUNCTION audit_trigger_function();

-- 6. OPTIMIZE RLS POLICIES WITH BETTER PERFORMANCE
-- Drop and recreate more efficient policies for purchases
DROP POLICY IF EXISTS "Users can view their own purchases or admins can view all" ON purchases;
DROP POLICY IF EXISTS "Users can update their own purchases or admins can update all" ON purchases;

-- More efficient policies using indexes
CREATE POLICY "Users can view their own purchases or admins can view all" ON purchases
  FOR SELECT USING (
    user_id = auth.uid() OR 
    has_role(auth.uid(), 'admin'::app_role)
  );

CREATE POLICY "Users can update their own purchases or admins can update all" ON purchases
  FOR UPDATE USING (
    user_id = auth.uid() OR 
    has_role(auth.uid(), 'admin'::app_role)
  );

-- Similar optimization for reservations
DROP POLICY IF EXISTS "Users can view their own reservations or admins can view all" ON reservations;
DROP POLICY IF EXISTS "Users can update their own reservations or admins can update al" ON reservations;

CREATE POLICY "Users can view their own reservations or admins can view all" ON reservations
  FOR SELECT USING (
    user_id = auth.uid() OR 
    has_role(auth.uid(), 'admin'::app_role)
  );

CREATE POLICY "Users can update their own reservations or admins can update all" ON reservations
  FOR UPDATE USING (
    user_id = auth.uid() OR 
    has_role(auth.uid(), 'admin'::app_role)
  );
