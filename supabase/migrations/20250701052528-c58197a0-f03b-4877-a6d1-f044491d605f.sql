
-- Create profiles table to store additional user information
CREATE TABLE public.profiles (
  id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  email text,
  full_name text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  PRIMARY KEY (id)
);

-- Create enum for user roles
CREATE TYPE public.app_role AS ENUM ('admin', 'customer');

-- Create user_roles table
CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  created_at timestamp with time zone DEFAULT now(),
  UNIQUE (user_id, role)
);

-- Enable RLS on profiles table
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Enable RLS on user_roles table
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Create security definer function to check user roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- Create function to handle new user registration
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''
AS $$
BEGIN
  -- Insert into profiles table
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (
    NEW.id, 
    NEW.email, 
    COALESCE(NEW.raw_user_meta_data ->> 'full_name', NEW.email)
  );
  
  -- Assign default role as 'customer' for new users
  -- Admin role will be assigned manually
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'customer');
  
  RETURN NEW;
END;
$$;

-- Create trigger for new user registration
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- RLS policies for profiles
CREATE POLICY "Users can view their own profile" 
  ON public.profiles 
  FOR SELECT 
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" 
  ON public.profiles 
  FOR UPDATE 
  USING (auth.uid() = id);

-- RLS policies for user_roles
CREATE POLICY "Users can view their own roles" 
  ON public.user_roles 
  FOR SELECT 
  USING (auth.uid() = user_id);

-- Update purchases table to include user_id
ALTER TABLE public.purchases ADD COLUMN user_id uuid REFERENCES auth.users(id);

-- Update reservations table to include user_id  
ALTER TABLE public.reservations ADD COLUMN user_id uuid REFERENCES auth.users(id);

-- Update RLS policies for purchases to filter by user_id
DROP POLICY IF EXISTS "Enable read access for all users" ON purchases;
DROP POLICY IF EXISTS "Enable insert access for all users" ON purchases;
DROP POLICY IF EXISTS "Enable update access for all users" ON purchases;
DROP POLICY IF EXISTS "Enable delete access for all users" ON purchases;

CREATE POLICY "Users can view their own purchases or admins can view all" 
  ON public.purchases 
  FOR SELECT 
  USING (
    auth.uid() = user_id OR 
    public.has_role(auth.uid(), 'admin')
  );

CREATE POLICY "Authenticated users can create purchases" 
  ON public.purchases 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own purchases or admins can update all" 
  ON public.purchases 
  FOR UPDATE 
  USING (
    auth.uid() = user_id OR 
    public.has_role(auth.uid(), 'admin')
  );

CREATE POLICY "Admins can delete purchases" 
  ON public.purchases 
  FOR DELETE 
  USING (public.has_role(auth.uid(), 'admin'));

-- Update RLS policies for reservations to filter by user_id
DROP POLICY IF EXISTS "Enable read access for all users" ON reservations;
DROP POLICY IF EXISTS "Enable insert access for all users" ON reservations;
DROP POLICY IF EXISTS "Enable update access for all users" ON reservations;
DROP POLICY IF EXISTS "Enable delete access for all users" ON reservations;

CREATE POLICY "Users can view their own reservations or admins can view all" 
  ON public.reservations 
  FOR SELECT 
  USING (
    auth.uid() = user_id OR 
    public.has_role(auth.uid(), 'admin')
  );

CREATE POLICY "Authenticated users can create reservations" 
  ON public.reservations 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own reservations or admins can update all" 
  ON public.reservations 
  FOR UPDATE 
  USING (
    auth.uid() = user_id OR 
    public.has_role(auth.uid(), 'admin')
  );

CREATE POLICY "Admins can delete reservations" 
  ON public.reservations 
  FOR DELETE 
  USING (public.has_role(auth.uid(), 'admin'));

-- Insert admin role for existing admin email
INSERT INTO public.user_roles (user_id, role)
SELECT id, 'admin'::app_role
FROM auth.users 
WHERE email = 'kopidarihati@gmail.com'
ON CONFLICT (user_id, role) DO NOTHING;
