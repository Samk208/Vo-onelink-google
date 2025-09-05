-- WORKING FIX: Simple RLS policies that don't cause recursion
-- Apply this in Supabase Dashboard > SQL Editor

-- 1. Drop all existing problematic policies
DROP POLICY IF EXISTS "Admins can view all users" ON users;
DROP POLICY IF EXISTS "Users can view own profile" ON users;
DROP POLICY IF EXISTS "Users can update own profile" ON users;

-- 2. Create simple, working policies for users table
-- Allow users to see their own profile and public profiles
CREATE POLICY "Users can view profiles" ON users 
FOR SELECT USING (
  -- Users can see their own profile
  auth.uid() = id 
  OR 
  -- Anyone can see verified users (suppliers/influencers) - needed for product queries
  verified = true
);

-- Allow users to update their own profile
CREATE POLICY "Users can update own profile" ON users 
FOR UPDATE USING (auth.uid() = id);

-- Allow users to insert their own profile (for registration)
CREATE POLICY "Users can insert own profile" ON users 
FOR INSERT WITH CHECK (auth.uid() = id);

-- 3. Fix products policies
DROP POLICY IF EXISTS "Suppliers can manage own products" ON products;
DROP POLICY IF EXISTS "Anyone can view active products" ON products;

-- Allow anyone to view active products (needed for shop page)
CREATE POLICY "Anyone can view active products" ON products 
FOR SELECT USING (active = true);

-- Allow suppliers to manage their own products
CREATE POLICY "Suppliers can manage own products" ON products 
FOR ALL USING (supplier_id = auth.uid());

-- 4. Fix shops policies  
DROP POLICY IF EXISTS "Anyone can view active shops" ON shops;
DROP POLICY IF EXISTS "Influencers can manage own shops" ON shops;

CREATE POLICY "Anyone can view active shops" ON shops 
FOR SELECT USING (active = true);

CREATE POLICY "Influencers can manage own shops" ON shops 
FOR ALL USING (influencer_id = auth.uid());

-- 5. Fix orders policies
DROP POLICY IF EXISTS "Customers can view own orders" ON orders;
DROP POLICY IF EXISTS "Admins can view all orders" ON orders;
DROP POLICY IF EXISTS "Customers can create orders" ON orders;

CREATE POLICY "Customers can view own orders" ON orders 
FOR SELECT USING (customer_id = auth.uid());

CREATE POLICY "Customers can create orders" ON orders 
FOR INSERT WITH CHECK (customer_id = auth.uid());

-- 6. Fix commissions policies
DROP POLICY IF EXISTS "Users can view own commissions" ON commissions;

CREATE POLICY "Users can view own commissions" ON commissions 
FOR SELECT USING (
  influencer_id = auth.uid() OR supplier_id = auth.uid()
);

-- 7. Add some test data
INSERT INTO users (id, email, name, role, verified) VALUES 
('550e8400-e29b-41d4-a716-446655440001', 'supplier@test.com', 'Test Supplier', 'supplier', true),
('550e8400-e29b-41d4-a716-446655440002', 'influencer@test.com', 'Test Influencer', 'influencer', true)
ON CONFLICT (id) DO NOTHING;

-- Add test products
INSERT INTO products (
  title, description, price, images, category, region, 
  in_stock, stock_count, commission, active, supplier_id, sku
) VALUES 
(
  'Wireless Gaming Headset',
  'Premium wireless headset with noise cancellation and long battery life',
  149.99,
  ARRAY['https://images.unsplash.com/photo-1524678606370-a47ad25cb82a?w=500'],
  'Electronics',
  ARRAY['US', 'EU'],
  true,
  25,
  15.00,
  true,
  '550e8400-e29b-41d4-a716-446655440001',
  'HEADSET-001'
),
(
  'Premium Cotton T-Shirt',
  'Ultra-soft premium cotton t-shirt with modern fit',
  39.99,
  ARRAY['https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500'],
  'Fashion',
  ARRAY['US', 'EU', 'UK'],
  true,
  100,
  20.00,
  true,
  '550e8400-e29b-41d4-a716-446655440001',
  'TSHIRT-001'
),
(
  'Smart Fitness Tracker',
  'Advanced fitness tracker with heart rate monitoring and sleep tracking',
  99.99,
  ARRAY['https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?w=500'],
  'Sports',
  ARRAY['US', 'CA'],
  true,
  50,
  18.00,
  true,
  '550e8400-e29b-41d4-a716-446655440001',
  'FITNESS-001'
),
(
  'Organic Face Moisturizer',
  'Luxurious organic moisturizer with natural ingredients for all skin types',
  49.99,
  ARRAY['https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=500'],
  'Beauty',
  ARRAY['US', 'EU'],
  true,
  75,
  25.00,
  true,
  '550e8400-e29b-41d4-a716-446655440001',
  'BEAUTY-001'
),
(
  'Yoga Mat Premium',
  'High-quality yoga mat with excellent grip and eco-friendly materials',
  69.99,
  ARRAY['https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=500'],
  'Sports',
  ARRAY['US', 'EU', 'UK'],
  true,
  40,
  22.00,
  true,
  '550e8400-e29b-41d4-a716-446655440001',
  'YOGA-001'
),
(
  'LED Desk Lamp',
  'Modern LED desk lamp with adjustable brightness and wireless charging',
  89.99,
  ARRAY['https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=500'],
  'Home & Garden',
  ARRAY['US', 'CA'],
  true,
  30,
  16.00,
  true,
  '550e8400-e29b-41d4-a716-446655440001',
  'LAMP-001'
)
ON CONFLICT (supplier_id, sku) DO NOTHING;

-- Test the fix by selecting products
SELECT id, title, price, category FROM products WHERE active = true LIMIT 3;
