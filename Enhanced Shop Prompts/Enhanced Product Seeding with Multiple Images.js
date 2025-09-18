// Enhanced seed script based on Vercel Commerce patterns
// Save as scripts/seed-enhanced-products.mjs

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Rich product data with multiple images per product
const productsData = [
  {
    sku: 'TECH-001',
    name: 'Premium Wireless Headphones',
    description: 'Experience crystal-clear audio with our premium wireless headphones featuring active noise cancellation, 30-hour battery life, and premium comfort padding.',
    price: 29900, // $299.00
    commission: 15.0,
    images: [
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&h=600&fit=crop',
      'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=600&h=600&fit=crop',
      'https://images.unsplash.com/photo-1545127398-14699f92334b?w=600&h=600&fit=crop'
    ],
    category: 'Electronics',
    region: ['US', 'CA', 'EU'],
    in_stock: true,
    stock_count: 50,
    active: true
  },
  {
    sku: 'TECH-002', 
    name: 'Smart Fitness Watch',
    description: 'Track your health and fitness goals with advanced monitoring, GPS tracking, water resistance, and 7-day battery life.',
    price: 24900, // $249.00
    commission: 12.0,
    images: [
      'https://images.unsplash.com/photo-1434494878577-86c23bcb06b9?w=600&h=600&fit=crop',
      'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=600&h=600&fit=crop',
      'https://images.unsplash.com/photo-1579586337278-3f436f25d4d1?w=600&h=600&fit=crop'
    ],
    category: 'Wearables',
    region: ['US', 'CA', 'EU', 'AU'],
    in_stock: true,
    stock_count: 75,
    active: true
  },
  {
    sku: 'HOME-001',
    name: 'Minimalist Desk Lamp',
    description: 'Elegant LED desk lamp with adjustable brightness, USB charging port, and modern minimalist design perfect for any workspace.',
    price: 8900, // $89.00
    commission: 20.0,
    images: [
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=600&fit=crop',
      'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600&h=600&fit=crop',
      'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=600&h=600&fit=crop'
    ],
    category: 'Home & Office',
    region: ['US', 'CA', 'EU'],
    in_stock: true,
    stock_count: 30,
    active: true
  },
  {
    sku: 'FASHION-001',
    name: 'Premium Leather Backpack',
    description: 'Handcrafted genuine leather backpack with laptop compartment, multiple pockets, and timeless design for professionals.',
    price: 15900, // $159.00
    commission: 25.0,
    images: [
      'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&h=600&fit=crop',
      'https://images.unsplash.com/photo-1581605405669-fcdf81165afa?w=600&h=600&fit=crop',
      'https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?w=600&h=600&fit=crop'
    ],
    category: 'Fashion',
    region: ['US', 'CA', 'EU'],
    in_stock: true,
    stock_count: 25,
    active: true
  },
  {
    sku: 'SPORT-001',
    name: 'Yoga Mat Premium',
    description: 'Eco-friendly yoga mat with superior grip, extra cushioning, and alignment guide marks for perfect practice sessions.',
    price: 6900, // $69.00
    commission: 18.0,
    images: [
      'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=600&h=600&fit=crop',
      'https://images.unsplash.com/photo-1593811167562-9cef47bfc4a7?w=600&h=600&fit=crop',
      'https://images.unsplash.com/photo-1506629905077-bda2ba771e3b?w=600&h=600&fit=crop'
    ],
    category: 'Sports & Fitness',
    region: ['US', 'CA', 'EU', 'AU'],
    in_stock: true,
    stock_count: 40,
    active: true
  },
  {
    sku: 'BEAUTY-001',
    name: 'Organic Skincare Set',
    description: 'Complete organic skincare routine with cleanser, toner, serum, and moisturizer made from natural ingredients.',
    price: 12900, // $129.00
    commission: 22.0,
    images: [
      'https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?w=600&h=600&fit=crop',
      'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&h=600&fit=crop',
      'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=600&h=600&fit=crop'
    ],
    category: 'Beauty & Personal Care',
    region: ['US', 'CA', 'EU'],
    in_stock: true,
    stock_count: 60,
    active: true
  }
];

async function seedEnhancedProducts() {
  console.log('=== Seeding Enhanced Products ===');
  
  try {
    // Get supplier user
    const { data: supplier, error: supplierError } = await supabase
      .from('profiles')
      .select('id')
      .eq('email', 'supplier@example.com')
      .eq('role', 'supplier')
      .single();
      
    if (supplierError || !supplier) {
      console.error('❌ Supplier not found. Run base seed script first.');
      return;
    }
    
    // Get influencer user
    const { data: influencer, error: influencerError } = await supabase
      .from('profiles')
      .select('id')
      .eq('email', 'influencer@example.com')
      .eq('role', 'influencer')
      .single();
      
    if (influencerError || !influencer) {
      console.error('❌ Influencer not found. Run base seed script first.');
      return;
    }
    
    // Clear existing products
    await supabase.from('influencer_shop_products').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    await supabase.from('products').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    
    console.log('✅ Cleared existing products');
    
    // Insert enhanced products
    for (const productData of productsData) {
      const { error: productError } = await supabase
        .from('products')
        .insert({
          ...productData,
          supplier_id: supplier.id
        });
        
      if (productError) {
        console.error(`❌ Error creating product ${productData.sku}:`, productError);
      } else {
        console.log(`✅ Created product: ${productData.name}`);
      }
    }
    
    // Link products to influencer shop
    const { data: products, error: productsError } = await supabase
      .from('products')
      .select('id, name')
      .eq('supplier_id', supplier.id);
      
    if (productsError) {
      console.error('❌ Error fetching products:', productsError);
      return;
    }
    
    // Link first 3 products to influencer shop with custom pricing
    const productsToLink = products.slice(0, 3);
    
    for (const [index, product] of productsToLink.entries()) {
      const { error: linkError } = await supabase
        .from('influencer_shop_products')
        .insert({
          influencer_id: influencer.id,
          product_id: product.id,
          sale_price: index === 0 ? 27900 : null, // Custom price for first product
          custom_title: index === 1 ? `${product.name} - Influencer Special` : null,
          is_featured: index === 0
        });
        
      if (linkError) {
        console.error(`❌ Error linking product ${product.name}:`, linkError);
      } else {
        console.log(`✅ Linked product to influencer shop: ${product.name}`);
      }
    }
    
    console.log('\n✅ Enhanced seeding complete!');
    console.log(`📊 Created ${productsData.length} products with multiple images`);
    console.log(`🔗 Linked ${productsToLink.length} products to influencer shop`);
    console.log('\n🌐 Test URLs:');
    console.log('  - Main catalog: http://localhost:3000/shop');
    console.log('  - Influencer shop: http://localhost:3000/shop/example-handle');
    console.log('  - Main influencer shop: http://localhost:3000/shop/main');
    
  } catch (error) {
    console.error('❌ Seeding failed:', error);
  }
}

seedEnhancedProducts();