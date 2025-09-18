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

-- Development/test data has been removed from this production migration.
-- Use the dedicated dev seed file instead: supabase/seed-dev-data.sql

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