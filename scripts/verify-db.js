#!/usr/bin/env node
/*
  Schema + RLS smoke checks for Supabase
  Requirements (env):
  - NEXT_PUBLIC_SUPABASE_URL
  - NEXT_PUBLIC_SUPABASE_ANON_KEY
  - SUPABASE_SERVICE_ROLE_KEY
*/

import fs from 'fs'
import path from 'path'
import dotenv from 'dotenv'
import { createClient } from '@supabase/supabase-js'

// Prefer .env.local (Next.js convention), fallback to .env
const root = process.cwd()
const envLocal = path.join(root, '.env.local')
if (fs.existsSync(envLocal)) {
  dotenv.config({ path: envLocal })
} else {
  dotenv.config()
}

const url = process.env.NEXT_PUBLIC_SUPABASE_URL
const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const serviceRole = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!url || !anon || !serviceRole) {
  console.error('Missing env: NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY / SUPABASE_SERVICE_ROLE_KEY')
  process.exit(1)
}

const admin = createClient(url, serviceRole, {
  auth: { autoRefreshToken: false, persistSession: false },
})
const anonClient = createClient(url, anon)

function ok(label) { console.log(`✅ ${label}`) }
function warn(label) { console.warn(`⚠️  ${label}`) }
function fail(label, err) { console.error(`❌ ${label}`, err || '') }

// Behavioral FK test: attempt to insert invalid FKs and expect failure
async function expectFKViolation() {
  // invalid supplier_id on products
  const badId = cryptoRandomUUID()
  const insert = await admin.from('products').insert({
    title: 'fk-test', description: 'x', price: 1, category: 'x', region: [],
    in_stock: true, stock_count: 1, commission: 1, active: true, supplier_id: badId
  })
  return !!insert.error
}

// View check: attempt to select from view
async function checkUserAdminView() {
  const res = await admin.from('user_admin_view').select('id').limit(1)
  return !res.error
}

function cryptoRandomUUID() {
  // minimal uuid generator for Node 18+ has crypto.randomUUID, but fallback simple
  if (typeof globalThis.crypto?.randomUUID === 'function') return globalThis.crypto.randomUUID()
  const tpl = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'
  return tpl.replace(/[xy]/g, c => {
    const r = (Math.random() * 16) | 0
    const v = c === 'x' ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}

async function run() {
  let failures = 0

  console.log('\n=== Schema checks (behavioral) ===')
  const fkOk = await expectFKViolation()
  if (fkOk) ok('FKs enforced (invalid supplier_id insert rejected)')
  else { fail('FKs not enforced (invalid supplier_id insert accepted)'); failures++ }

  const viewOk = await checkUserAdminView()
  if (viewOk) ok('view present: public.user_admin_view (select works)')
  else warn('view missing or not selectable: public.user_admin_view')

  console.log('\n=== RLS smoke checks (anon) ===')
  try {
    const products = await anonClient.from('products').select('*', { head: true, count: 'exact' }).eq('active', true)
    if (products.error) { fail('anon can read active products', products.error); failures++ }
    else ok('anon can read active products')

    const shops = await anonClient.from('shops').select('*', { head: true, count: 'exact' })
    if (shops.error) { fail('anon can read shops', shops.error); failures++ }
    else ok('anon can read shops')

    const profiles = await anonClient.from('profiles').select('*', { head: true, count: 'exact' })
    if (profiles.error) { fail('anon can read profiles (public)', profiles.error); failures++ }
    else ok('anon can read profiles (public)')
  } catch (e) {
    fail('anon smoke checks failed', e); failures++
  }

  console.log('\n=== Authenticated smoke checks ===')
  const email = `tester_${Date.now()}@example.com`
  const password = 'P@ssw0rd1234'
  let createdUserId = null
  try {
    const { data: created, error: createErr } = await admin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { name: 'Smoke Tester', role: 'customer' },
    })
    if (createErr || !created?.user) {
      throw createErr || new Error('createUser returned no user')
    }
    createdUserId = created.user.id
    ok('created test user')

    const authClient = createClient(url, anon)
    const signIn = await authClient.auth.signInWithPassword({ email, password })
    if (signIn.error) throw signIn.error
    ok('signed in as test user')

    const me = await authClient.from('profiles').select('id, role').eq('id', createdUserId).maybeSingle()
    if (me.error || !me.data) { fail('authed user can read own profile (and trigger created it)', me.error); failures++ }
    else ok('authed user can read own profile (trigger worked)')

    // Ensure cannot write products unless supplier/admin (should fail for customer)
    const insert = await authClient.from('products').insert({ title: 'x', description: 'x', price: 1, category: 'x', region: [], in_stock: true, stock_count: 1, commission: 1, active: true, supplier_id: createdUserId })
    if (!insert.error) { fail('customer should NOT be able to insert products but insert succeeded'); failures++ }
    else ok('customer cannot insert products (expected)')
  } catch (e) {
    fail('authenticated checks failed', e)
    failures++
  } finally {
    if (createdUserId) {
      await admin.auth.admin.deleteUser(createdUserId)
      ok('cleaned up test user')
    }
  }

  console.log('\n=== Result ===')
  if (failures > 0) {
    console.error(`Completed with ${failures} failure(s).`)
    process.exit(1)
  } else {
    console.log('All checks passed!')
  }
}

run().catch((e) => { fail('unexpected error', e); process.exit(1) })
