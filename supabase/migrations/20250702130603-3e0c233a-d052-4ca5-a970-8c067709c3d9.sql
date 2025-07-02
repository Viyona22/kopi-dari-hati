
-- Fix the handle_new_user function to properly handle the app_role enum
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = 'public'
AS $$
BEGIN
  -- Insert into profiles table
  INSERT INTO public.profiles (id, email, full_name, created_at, updated_at)
  VALUES (
    NEW.id, 
    NEW.email, 
    COALESCE(NEW.raw_user_meta_data ->> 'full_name', NEW.email),
    NOW(),
    NOW()
  );
  
  -- Assign role based on user metadata, default to customer
  INSERT INTO public.user_roles (user_id, role, created_at)
  VALUES (
    NEW.id, 
    CASE 
      WHEN NEW.raw_user_meta_data ->> 'role' = 'admin' THEN 'admin'::public.app_role
      WHEN NEW.raw_user_meta_data ->> 'role' = 'customer' THEN 'customer'::public.app_role
      ELSE 'customer'::public.app_role
    END,
    NOW()
  );
  
  RETURN NEW;
EXCEPTION WHEN OTHERS THEN
  -- Log the error but don't block user creation
  RAISE LOG 'Error in handle_new_user: %', SQLERRM;
  RETURN NEW;
END;
$$;

-- Drop and recreate the trigger to ensure it uses the updated function
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Insert records for existing users who don't have profiles yet
INSERT INTO public.profiles (id, email, full_name, created_at, updated_at)
SELECT 
  id, 
  email, 
  COALESCE(raw_user_meta_data ->> 'full_name', email),
  created_at,
  NOW()
FROM auth.users 
WHERE id NOT IN (SELECT id FROM public.profiles);

-- Insert roles for existing users who don't have roles yet
INSERT INTO public.user_roles (user_id, role, created_at)
SELECT 
  id,
  CASE 
    WHEN raw_user_meta_data ->> 'role' = 'admin' THEN 'admin'::public.app_role
    WHEN raw_user_meta_data ->> 'role' = 'customer' THEN 'customer'::public.app_role
    ELSE 'customer'::public.app_role
  END,
  created_at
FROM auth.users 
WHERE id NOT IN (SELECT user_id FROM public.user_roles);

-- Grant necessary permissions to ensure the function can execute properly
GRANT USAGE ON SCHEMA public TO supabase_auth_admin;
GRANT ALL ON public.profiles TO supabase_auth_admin;
GRANT ALL ON public.user_roles TO supabase_auth_admin;
GRANT EXECUTE ON FUNCTION public.handle_new_user() TO supabase_auth_admin;
