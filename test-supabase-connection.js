// Test script to verify Supabase connection
// Run with: node test-supabase-connection.js

const { createClient } = require('@supabase/supabase-js')

// Load environment variables
require('dotenv').config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

console.log('🔍 Testing Supabase Connection...')
console.log('=====================================')

// Check environment variables
console.log('\n📋 Environment Variables:')
console.log('SUPABASE_URL:', supabaseUrl ? '✅ Set' : '❌ Missing')
console.log('SUPABASE_ANON_KEY:', supabaseAnonKey ? '✅ Set' : '❌ Missing')
console.log('SUPABASE_SERVICE_ROLE_KEY:', supabaseServiceKey ? '✅ Set' : '❌ Missing')

if (!supabaseUrl || !supabaseAnonKey) {
    console.log('\n❌ Missing required environment variables!')
    console.log('Please check your .env.local file.')
    process.exit(1)
}

// Test connection with anon key
async function testConnection() {
    try {
        const supabase = createClient(supabaseUrl, supabaseAnonKey)

        console.log('\n🔌 Testing Connection...')
        console.log('URL:', supabaseUrl)

        // Test basic connection by fetching auth settings
        const { data, error } = await supabase.auth.getSession()

        if (error) {
            console.log('❌ Connection Error:', error.message)
            return false
        }

        console.log('✅ Connection successful!')
        console.log('📊 Session status:', data.session ? 'Authenticated' : 'Not authenticated')

        // Test database access (try to get a simple table info)
        const { data: tables, error: tablesError } = await supabase
            .from('information_schema.tables')
            .select('table_name')
            .eq('table_schema', 'public')
            .limit(5)

        if (tablesError) {
            console.log('⚠️  Database access test failed:', tablesError.message)
            console.log('This might be normal if RLS is enabled and you\'re not authenticated.')
        } else {
            console.log('✅ Database access successful!')
            console.log('📋 Available tables:', tables?.length || 0)
        }

        return true

    } catch (err) {
        console.log('❌ Unexpected error:', err.message)
        return false
    }
}

// Run the test
testConnection()
    .then(success => {
        if (success) {
            console.log('\n🎉 Supabase connection test completed successfully!')
        } else {
            console.log('\n💥 Supabase connection test failed!')
        }
    })
    .catch(err => {
        console.log('\n💥 Test failed with error:', err.message)
    })
