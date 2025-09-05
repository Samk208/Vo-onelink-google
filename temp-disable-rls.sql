-- TEMPORARY FIX: Disable RLS for testing (NOT for production!)
-- Apply in Supabase Dashboard > SQL Editor

-- Temporarily disable RLS on tables for testing
ALTER TABLE users DISABLE ROW LEVEL SECURITY;
ALTER TABLE products DISABLE ROW LEVEL SECURITY;
ALTER TABLE shops DISABLE ROW LEVEL SECURITY;

-- Add test data
INSERT INTO users (id, email, name, role, verified) VALUES 
('550e8400-e29b-41d4-a716-446655440001', 'supplier@test.com', 'Test Supplier', 'supplier', true)
ON CONFLICT (id) DO NOTHING;

INSERT INTO products (
  title, description, price, images, category, region,
  in_stock, stock_count, commission, active, supplier_id, sku
) VALUES 
('Wireless Headset', 'Premium wireless gaming headset', 149.99, ARRAY['https://images.unsplash.com/photo-1524678606370-a47ad25cb82a?w=500'], 'Electronics', ARRAY['US'], true, 25, 15.00, true, '550e8400-e29b-41d4-a716-446655440001', 'TEST-001'),
('Cotton T-Shirt', 'Premium cotton t-shirt', 39.99, ARRAY['https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500'], 'Fashion', ARRAY['US'], true, 100, 20.00, true, '550e8400-e29b-41d4-a716-446655440001', 'TEST-002'),
('Fitness Tracker', 'Smart fitness tracker', 99.99, ARRAY['https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?w=500'], 'Sports', ARRAY['US'], true, 50, 18.00, true, '550e8400-e29b-41d4-a716-446655440001', 'TEST-003')
ON CONFLICT (supplier_id, sku) DO NOTHING;

-- Test query
SELECT COUNT(*) as product_count FROM products WHERE active = true;

-- WARNING: Remember to re-enable RLS later for security:
-- ALTER TABLE users ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE products ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE shops ENABLE ROW LEVEL SECURITY;
