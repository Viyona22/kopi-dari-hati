
-- 1. Fix RLS policy for audit_logs table
-- Allow system triggers to insert audit logs without authentication
DROP POLICY IF EXISTS "Admins can view audit logs" ON audit_logs;

-- Create policy that allows system functions to insert audit logs
CREATE POLICY "System can insert audit logs" ON audit_logs
  FOR INSERT WITH CHECK (true);

-- Admins can view audit logs
CREATE POLICY "Admins can view audit logs" ON audit_logs
  FOR SELECT USING (has_role(auth.uid(), 'admin'::app_role));

-- 2. Fix permissions for refresh_dashboard_metrics function
-- Make it security definer so it can refresh the materialized view
CREATE OR REPLACE FUNCTION refresh_dashboard_metrics()
RETURNS VOID 
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  REFRESH MATERIALIZED VIEW CONCURRENTLY dashboard_metrics;
EXCEPTION WHEN OTHERS THEN
  -- If concurrent refresh fails, try regular refresh
  REFRESH MATERIALIZED VIEW dashboard_metrics;
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION refresh_dashboard_metrics() TO authenticated;

-- 3. Update audit trigger function to be security definer
CREATE OR REPLACE FUNCTION audit_trigger_function()
RETURNS TRIGGER 
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Only insert audit log if user is authenticated
  IF auth.uid() IS NOT NULL THEN
    INSERT INTO audit_logs (table_name, operation, old_data, new_data, user_id)
    VALUES (
      TG_TABLE_NAME,
      TG_OP,
      CASE WHEN TG_OP = 'DELETE' THEN row_to_json(OLD) ELSE NULL END,
      CASE WHEN TG_OP IN ('INSERT', 'UPDATE') THEN row_to_json(NEW) ELSE NULL END,
      auth.uid()
    );
  END IF;
  RETURN COALESCE(NEW, OLD);
EXCEPTION WHEN OTHERS THEN
  -- Log error but don't fail the main operation
  RAISE LOG 'Audit trigger failed: %', SQLERRM;
  RETURN COALESCE(NEW, OLD);
END;
$$;

-- 4. Update RLS policies for purchases to be more explicit about admin permissions
DROP POLICY IF EXISTS "Admins can delete purchases" ON purchases;

CREATE POLICY "Admins can delete purchases" ON purchases
  FOR DELETE USING (
    has_role(auth.uid(), 'admin'::app_role)
  );

-- 5. Create a function to safely delete purchases with proper error handling
CREATE OR REPLACE FUNCTION delete_purchase_safely(purchase_id TEXT)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Check if user is admin
  IF NOT has_role(auth.uid(), 'admin'::app_role) THEN
    RAISE EXCEPTION 'Unauthorized: Only admins can delete purchases';
  END IF;
  
  -- Delete the purchase
  DELETE FROM purchases WHERE id = purchase_id;
  
  -- Check if deletion was successful
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Purchase not found or could not be deleted';
  END IF;
  
  RETURN TRUE;
EXCEPTION WHEN OTHERS THEN
  RAISE LOG 'Error deleting purchase %: %', purchase_id, SQLERRM;
  RETURN FALSE;
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION delete_purchase_safely(TEXT) TO authenticated;

-- 6. Ensure materialized view has proper permissions
GRANT SELECT ON dashboard_metrics TO authenticated;
