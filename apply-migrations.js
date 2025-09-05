#!/usr/bin/env node

// Script to apply database migrations and fix RLS policies
// You can run this or apply the migrations manually through Supabase dashboard

const { createClient } = require('@supabase/supabase-js')
const fs = require('fs')
const path = require('path')
require('dotenv').config({ path: '.env.local' })

async function applyMigrations() {
  console.log('🔧 Applying database fixes and test data...\n')
  
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
    console.error('❌ SUPABASE_SERVICE_ROLE_KEY is required for migrations')
    process.exit(1)
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
    { auth: { persistSession: false } }
  )

  try {
    // Read and execute RLS fix
    console.log('📝 Applying RLS recursion fix...')
    const rlsFix = fs.readFileSync(
      path.join(__dirname, 'supabase', 'migrations', '20250103_fix_rls_recursion.sql'), 
      'utf8'
    )
    
    const { error: rlsError } = await supabase.rpc('exec_sql', { sql: rlsFix })
    if (rlsError) {
      console.error('❌ Error applying RLS fix:', rlsError.message)
    } else {
      console.log('✅ RLS policies fixed successfully')
    }

    // Read and execute test data
    console.log('📝 Adding test data...')
    const testData = fs.readFileSync(
      path.join(__dirname, 'supabase', 'migrations', '20250103_test_data.sql'), 
      'utf8'
    )
    
    const { error: dataError } = await supabase.rpc('exec_sql', { sql: testData })
    if (dataError) {
      console.error('❌ Error adding test data:', dataError.message)
    } else {
      console.log('✅ Test data added successfully')
    }

    // Test the connection
    console.log('🔍 Testing database connection...')
    const { data, error, count } = await supabase
      .from('products')
      .select('id, title, price', { count: 'exact' })
      .eq('active', true)
      .limit(5)

    if (error) {
      console.error('❌ Database test failed:', error.message)
    } else {
      console.log(`✅ Database connection successful! Found ${count} products`)
      if (data && data.length > 0) {
        console.log('📊 Sample products:')
        data.forEach(product => {
          console.log(`  - ${product.title}: $${product.price}`)
        })
      }
    }

  } catch (error) {
    console.error('❌ Migration failed:', error.message)
  }

  console.log('\n🎯 Next steps:')
  console.log('1. Refresh your browser')
  console.log('2. Visit http://localhost:3000/shop')
  console.log('3. You should now see products loading!')
}

// Note: This requires a custom SQL function in Supabase
// Alternative: Apply migrations manually through Supabase dashboard
console.log('⚠️  Manual Migration Required')
console.log('Please apply the following migrations through your Supabase dashboard:')
console.log('1. supabase/migrations/20250103_fix_rls_recursion.sql')
console.log('2. supabase/migrations/20250103_test_data.sql')
console.log('')
console.log('Or use Supabase CLI: supabase db push')

// Uncomment to run automated migration (requires SQL execution function)
// applyMigrations()
