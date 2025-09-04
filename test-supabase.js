#!/usr/bin/env node

// Test script to verify Supabase configuration
require('dotenv').config({ path: '.env.local' })

console.log('🔍 Testing Environment Variables...\n')

const requiredVars = [
  'NEXT_PUBLIC_SUPABASE_URL',
  'NEXT_PUBLIC_SUPABASE_ANON_KEY',
  'SUPABASE_SERVICE_ROLE_KEY'
]

requiredVars.forEach(varName => {
  const value = process.env[varName]
  console.log(`${varName}: ${value ? '✅ Present' : '❌ Missing'}`)
  if (value) {
    console.log(`  Preview: ${value.substring(0, 30)}...`)
  }
  console.log()
})

console.log('🔧 Testing Supabase Client Creation...\n')

try {
  const { createClient } = require('@supabase/supabase-js')
  
  // Test regular client
  const client = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  )
  console.log('✅ Regular Supabase client created successfully')
  
  // Test admin client
  if (process.env.SUPABASE_SERVICE_ROLE_KEY) {
    const adminClient = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY,
      { auth: { persistSession: false } }
    )
    console.log('✅ Admin Supabase client created successfully')
  } else {
    console.log('❌ Cannot create admin client - missing service role key')
  }
  
} catch (error) {
  console.error('❌ Error creating Supabase clients:', error.message)
}

console.log('\n🎯 Recommendations:')
console.log('1. Ensure all environment variables are present')
console.log('2. Restart your Next.js development server after changes')
console.log('3. Use client-side supabase for browser operations')
console.log('4. Use admin client only in server-side API routes')
