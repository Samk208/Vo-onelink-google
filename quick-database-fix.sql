-- QUICK FIX: Apply this in Supabase Dashboard > SQL Editor

-- 1. Fix the infinite recursion by dropping problematic policies
DROP POLICY IF EXISTS "Admins can view all users" ON users;

-- 2. Create a simple, working policy for users
CREATE POLICY "Users can view profiles" ON users FOR SELECT USING (true);

-- 3. Add a few test products directly
INSERT INTO users (id, email, name, role, verified) VALUES 
('550e8400-e29b-41d4-a716-446655440001', 'supplier@test.com', 'Test Supplier', 'supplier', true)
ON CONFLICT (id) DO NOTHING;

INSERT INTO products (title, description, price, images, category, in_stock, stock_count, commission, active, supplier_id, sku) VALUES 
('Wireless Headset', 'High-quality wireless headset perfect for gaming and calls', 99.99, ARRAY['https://images.unsplash.com/photo-1524678606370-a47ad25cb82a?w=500'], 'Electronics', true, 50, 15.00, true, '550e8400-e29b-41d4-a716-446655440001', 'TEST-001'),
('Cotton T-Shirt', 'Premium cotton t-shirt with comfortable fit', 29.99, ARRAY['https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500'], 'Fashion', true, 100, 25.00, true, '550e8400-e29b-41d4-a716-446655440001', 'TEST-002'),
('Smart Plant Monitor', 'Monitor your plants with smart technology', 49.99, ARRAY['https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=500'], 'Home & Garden', true, 35, 30.00, true, '550e8400-e29b-41d4-a716-446655440001', 'TEST-003')
ON CONFLICT (supplier_id, sku) DO NOTHING;
