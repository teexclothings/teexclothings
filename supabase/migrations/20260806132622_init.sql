-- 1. UTILITY FUNCTIONS & TRIGGER FUNCTIONS

-- Automatically update updated_at timestamp helper
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS trigger AS $$
BEGIN
  NEW.updated_at = timezone('utc'::text, now());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;


-- 2. PROFILE CREATION ON USER SIGNUP

-- Table to store administrator profiles linked with auth.users
CREATE TABLE public.profiles (
  id uuid REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  full_name text,
  avatar_url text,
  email text NOT NULL,
  role text NOT NULL DEFAULT 'viewer' CONSTRAINT role_check CHECK (role IN ('admin', 'viewer')),
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Function to handle auto-creation of a profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, email, role, avatar_url)
  VALUES (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', ''),
    new.email,
    'admin', -- Defaults to admin for initial users in this admin-only environment
    coalesce(new.raw_user_meta_data->>'avatar_url', '')
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Trigger to execute user profile creation
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();


-- 3. SCHEMA TABLES DEFINITIONS

-- Categories table
CREATE TABLE public.categories (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  slug text NOT NULL UNIQUE,
  active boolean DEFAULT true NOT NULL,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Products table
CREATE TABLE public.products (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  title text NOT NULL,
  slug text NOT NULL UNIQUE,
  description text,
  price numeric(10,2) NOT NULL CONSTRAINT price_check CHECK (price >= 0),
  category_id uuid REFERENCES public.categories(id) ON DELETE RESTRICT NOT NULL,
  sizes text[] DEFAULT '{}'::text[] NOT NULL,
  colors text[] DEFAULT '{}'::text[] NOT NULL,
  featured boolean DEFAULT false NOT NULL,
  active boolean DEFAULT true NOT NULL,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Hero Banners table
CREATE TABLE public.hero_banners (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  title text,
  subtitle text,
  media_url text NOT NULL,
  media_type text NOT NULL CONSTRAINT media_type_check CHECK (media_type IN ('image', 'video')),
  button_text text,
  button_link text,
  active boolean DEFAULT true NOT NULL,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Centralized Settings table (Enforced Singleton)
CREATE TABLE public.settings (
  id boolean DEFAULT true PRIMARY KEY CONSTRAINT singleton_row CHECK (id = true),
  shop_name text NOT NULL,
  logo text,
  email text,
  phone text,
  whatsapp text,
  instagram text,
  facebook text,
  address text,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Shipping Charges table
CREATE TABLE public.shipping_charges (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  state_name text NOT NULL UNIQUE,
  shipping_charge numeric(10,2) NOT NULL CONSTRAINT shipping_charge_check CHECK (shipping_charge >= 0),
  is_active boolean DEFAULT true NOT NULL,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);


-- 4. TIMESTAMPS REFRESH TRIGGERS

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_categories_updated_at BEFORE UPDATE ON public.categories FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON public.products FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_hero_banners_updated_at BEFORE UPDATE ON public.hero_banners FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_settings_updated_at BEFORE UPDATE ON public.settings FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_shipping_charges_updated_at BEFORE UPDATE ON public.shipping_charges FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


-- 5. ACCESS CONTROL & SECURITY FUNCTION

-- Safe admin check function (SECURITY DEFINER bypasses infinite policy recursion on profiles query)
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean AS $$
BEGIN
  RETURN (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;


-- 6. ROW LEVEL SECURITY (RLS) & POLICIES

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hero_banners ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.shipping_charges ENABLE ROW LEVEL SECURITY;

-- Profiles Policies
CREATE POLICY "Users can view their own profile or admins can view all"
  ON public.profiles FOR SELECT USING (auth.uid() = id OR public.is_admin());

CREATE POLICY "Users can update their own profile or admins can update all"
  ON public.profiles FOR UPDATE USING (auth.uid() = id OR public.is_admin()) WITH CHECK (auth.uid() = id OR public.is_admin());

CREATE POLICY "Admins can insert profiles"
  ON public.profiles FOR INSERT WITH CHECK (public.is_admin());

CREATE POLICY "Admins can delete profiles"
  ON public.profiles FOR DELETE USING (public.is_admin());

-- Categories Policies
CREATE POLICY "Allow public read active categories or admin read all"
  ON public.categories FOR SELECT USING (active = true OR public.is_admin());

CREATE POLICY "Admins have full write control on categories"
  ON public.categories FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());

-- Products Policies
CREATE POLICY "Allow public read active products or admin read all"
  ON public.products FOR SELECT USING (active = true OR public.is_admin());

CREATE POLICY "Admins have full write control on products"
  ON public.products FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());

-- Hero Banners Policies
CREATE POLICY "Allow public read active banners or admin read all"
  ON public.hero_banners FOR SELECT USING (active = true OR public.is_admin());

CREATE POLICY "Admins have full write control on banners"
  ON public.hero_banners FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());

-- Settings Policies
CREATE POLICY "Allow public read settings"
  ON public.settings FOR SELECT USING (true);

CREATE POLICY "Admins have full write control on settings"
  ON public.settings FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());

-- Shipping Charges Policies
CREATE POLICY "Allow public read active shipping charges or admin read all"
  ON public.shipping_charges FOR SELECT USING (is_active = true OR public.is_admin());

CREATE POLICY "Admins have full write control on shipping charges"
  ON public.shipping_charges FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());


-- 7. PERFORMANCE INDEXES (Excluding implicit PRIMARY / UNIQUE constraint indexes)

-- Categories Indexing
CREATE INDEX idx_categories_active ON public.categories (active) WHERE active = true;

-- Products Indexing
CREATE INDEX idx_products_category_id ON public.products (category_id);
CREATE INDEX idx_products_active ON public.products (active) WHERE active = true;
CREATE INDEX idx_products_featured ON public.products (featured) WHERE featured = true;

-- Shipping Charges Indexing
CREATE INDEX idx_shipping_charges_active ON public.shipping_charges (is_active) WHERE is_active = true;


-- 8. STORAGE BUCKETS CONFIGURATION

-- Initialize buckets directly in storage schema
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES 
  ('products', 'products', true, 10485760, ARRAY['image/png', 'image/jpeg', 'image/webp', 'image/heic']),
  ('banners', 'banners', true, 52428800, ARRAY['image/png', 'image/jpeg', 'image/webp', 'image/gif', 'video/mp4', 'video/quicktime']),
  ('settings', 'settings', true, 5242880, ARRAY['image/png', 'image/jpeg', 'image/webp', 'image/svg+xml'])
ON CONFLICT (id) DO NOTHING;

-- Storage Read Policies (Public select)
CREATE POLICY "Public read access for products bucket" ON storage.objects FOR SELECT USING (bucket_id = 'products');
CREATE POLICY "Public read access for banners bucket" ON storage.objects FOR SELECT USING (bucket_id = 'banners');
CREATE POLICY "Public read access for settings bucket" ON storage.objects FOR SELECT USING (bucket_id = 'settings');

-- Storage Write Policies (Admin only upload, update, delete)
CREATE POLICY "Admin write access for products bucket" 
  ON storage.objects FOR ALL TO authenticated 
  USING (bucket_id = 'products' AND public.is_admin()) 
  WITH CHECK (bucket_id = 'products' AND public.is_admin());

CREATE POLICY "Admin write access for banners bucket" 
  ON storage.objects FOR ALL TO authenticated 
  USING (bucket_id = 'banners' AND public.is_admin()) 
  WITH CHECK (bucket_id = 'banners' AND public.is_admin());

CREATE POLICY "Admin write access for settings bucket" 
  ON storage.objects FOR ALL TO authenticated 
  USING (bucket_id = 'settings' AND public.is_admin()) 
  WITH CHECK (bucket_id = 'settings' AND public.is_admin());
