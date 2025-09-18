-- ===================================================================
-- COMPLETE SUPABASE MARKETPLACE DATABASE FIX
-- Based on best practices from official Supabase docs and working examples
-- ===================================================================

-- STEP 1: Fix Foreign Key Relationships (Point to auth.users instead of public.users)
-- Your diagnostics showed all FKs currently point to public.users - this is wrong

-- Products table FK fix
ALTER TABLE public.products
  DROP CONSTRAINT IF EXISTS products_supplier_id_fkey,
  ADD CONSTRAINT products_supplier_id_fkey
    FOREIGN KEY (supplier_id) REFERENCES auth.users(id) ON DELETE CASCADE;

-- Shops table FK fix  
ALTER TABLE public.shops
  DROP CONSTRAINT IF EXISTS shops_influencer_id_fkey,
  ADD CONSTRAINT shops_influencer_id_fkey
    FOREIGN KEY (influencer_id) REFERENCES auth.users(id) ON DELETE CASCADE;

-- Orders table FK fix
ALTER TABLE public.orders
  DROP CONSTRAINT IF EXISTS orders_customer_id_fkey,
  ADD CONSTRAINT orders_customer_id_fkey
    FOREIGN KEY (customer_id) REFERENCES auth.users(id) ON DELETE CASCADE;

-- Influencer shop products FK fix
ALTER TABLE public.influencer_shop_products
  DROP CONSTRAINT IF EXISTS influencer_shop_products_influencer_id_fkey,
  ADD CONSTRAINT influencer_shop_products_influencer_id_fkey
    FOREIGN KEY (influencer_id) REFERENCES auth.users(id) ON DELETE CASCADE;

-- Commissions table FK fixes
ALTER TABLE public.commissions
  DROP CONSTRAINT IF EXISTS commissions_influencer_id_fkey,
  ADD CONSTRAINT commissions_influencer_id_fkey
    FOREIGN KEY (influencer_id) REFERENCES auth.users(id) ON DELETE SET NULL,
  DROP CONSTRAINT IF EXISTS commissions_supplier_id_fkey,
  ADD CONSTRAINT commissions_supplier_id_fkey
    FOREIGN KEY (supplier_id) REFERENCES auth.users(id) ON DELETE CASCADE;

-- STEP 2: Ensure profiles table properly references auth.users (standard pattern)
-- This should already be correct based on your schema, but let's verify/fix
ALTER TABLE public.profiles
  DROP CONSTRAINT IF EXISTS profiles_id_fkey,
  ADD CONSTRAINT profiles_id_fkey
    FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE;

-- STEP 3: Create trigger to auto-populate profiles when users sign up
-- This is the official Supabase pattern from the docs
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, name, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'name', NEW.raw_user_meta_data->>'full_name', 'User'),
    'customer'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop existing trigger if exists and create new one
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- STEP 4: Seed with minimal test data to get your shop working

-- First, create a test user via Supabase Auth (you'll need to do this in the dashboard)
-- For now, let's insert a test auth user manually (ONLY for development)
-- In production, users should be created via the Auth API

-- Insert test auth user (replace with actual signup via dashboard for production)
INSERT INTO auth.users (
  id,
  instance_id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at,
  raw_user_meta_data
) VALUES (
  '12345678-1234-1234-1234-123456789012'::uuid,
  '00000000-0000-0000-0000-000000000000'::uuid,
  'authenticated',
  'authenticated',
  'supplier@example.com',
  crypt('password123', gen_salt('bf')),
  now(),
  now(),
  now(),
  '{"name":"Test Supplier","role":"supplier"}'::jsonb
) ON CONFLICT (id) DO NOTHING;

-- The trigger should automatically create a profile, but let's ensure it exists
INSERT INTO public.profiles (id, name, role, verified) VALUES (
  '12345678-1234-1234-1234-123456789012'::uuid,
  'Test Supplier',
  'supplier',
  true
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  role = EXCLUDED.role,
  verified = EXCLUDED.verified;

-- Now seed some products that will show in your main shop
INSERT INTO public.products (
  title,
  description,
  price,
  original_price,
  images,
  category,
  region,
  in_stock,
  stock_count,
  commission,
  active,
  supplier_id,
  sku
) VALUES 
(
  'Premium Headphones',
  'High-quality wireless headphones with noise cancellation',
  299.99,
  399.99,
  ARRAY['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500'],
  'Electronics',
  ARRAY['US', 'Canada'],
  true,
  50,
  15.0,
  true,  -- CRITICAL: Must be true to show in shop
  '12345678-1234-1234-1234-123456789012'::uuid,
  'HP-001'
),
(
  'Stylish Backpack',
  'Durable backpack perfect for travel and daily use',
  79.99,
  99.99,
  ARRAY['https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500'],
  'Fashion',
  ARRAY['US', 'Europe'],
  true,
  25,
  12.0,
  true,  -- CRITICAL: Must be true to show in shop
  '12345678-1234-1234-1234-123456789012'::uuid,
  'BP-002'
),
(
  'Smart Watch',
  'Feature-rich smartwatch with health tracking',
  249.99,
  299.99,
  ARRAY['https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500'],
  'Electronics',
  ARRAY['Worldwide'],
  true,
  30,
  20.0,
  true,  -- CRITICAL: Must be true to show in shop
  '12345678-1234-1234-1234-123456789012'::uuid,
  'SW-003'
);

-- Create a test influencer shop
INSERT INTO public.shops (
  influencer_id,
  handle,
  name,
  description,
  logo,
  banner
) VALUES (
  '12345678-1234-1234-1234-123456789012'::uuid,
  'techreviews',
  'Tech Reviews Shop',
  'Curated tech products reviewed and recommended',
  'https://images.unsplash.com/photo-1556075798-4825dfaaf498?w=200',
  'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=800'
);

-- Link some products to the influencer shop
INSERT INTO public.influencer_shop_products (
  influencer_id,
  product_id,
  published
) 
SELECT 
  '12345678-1234-1234-1234-123456789012'::uuid,
  p.id,
  true  -- CRITICAL: Must be true to show in influencer shop
FROM public.products p 
WHERE p.title IN ('Premium Headphones', 'Smart Watch');

-- STEP 5: Verify everything works
-- Check that products show up with proper relationships
SELECT 
  p.title,
  p.price,
  p.active,
  p.in_stock,
  p.stock_count,
  prof.name as supplier_name,
  prof.role as supplier_role
FROM public.products p
JOIN public.profiles prof ON p.supplier_id = prof.id
WHERE p.active = true;

-- Check influencer shop setup
SELECT 
  s.name as shop_name,
  s.handle,
  p.title as product_title,
  isp.published
FROM public.shops s
JOIN public.influencer_shop_products isp ON s.influencer_id = isp.influencer_id
JOIN public.products p ON isp.product_id = p.id
WHERE isp.published = true;

-- ===================================================================
-- IMPORTANT NOTES:
-- 1. The test auth.users insert is ONLY for development
-- 2. In production, create users via Supabase Auth UI or API
-- 3. Your RLS policies are correctly set up
-- 4. Products must have active=true, in_stock=true, stock_count>0 to show
-- 5. Influencer products must have published=true to show
-- ===================================================================