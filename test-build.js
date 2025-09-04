#!/usr/bin/env node

const { execSync } = require('child_process')
const path = require('path')

console.log('🧪 Testing Build Fix...\n')

// Change to project directory
process.chdir('C:\\Users\\LENOVO\\Desktop\\Workspce\\vo-onelink-google')

try {
  console.log('1. Running TypeScript Check...')
  const typecheckOutput = execSync('pnpm typecheck', { encoding: 'utf-8', timeout: 60000 })
  console.log('✅ TypeScript check passed!')
  console.log(typecheckOutput)
  
} catch (error) {
  console.log('❌ TypeScript check failed:')
  console.log(error.stdout || error.message)
  console.log('\nTrying to continue with build test...\n')
}

try {
  console.log('2. Testing Next.js Build...')
  const buildOutput = execSync('pnpm build', { encoding: 'utf-8', timeout: 120000 })
  console.log('✅ Build successful!')
  
} catch (error) {
  console.log('❌ Build failed:')
  console.log(error.stdout || error.message)
  
  // Try to identify specific issues
  const errorString = error.stdout || error.message
  if (errorString.includes('next/headers')) {
    console.log('\n🔍 Still has next/headers import issue')
  }
  if (errorString.includes('Duplicate export')) {
    console.log('\n🔍 Still has duplicate export issue')
  }
  if (errorString.includes('cookies().getAll()')) {
    console.log('\n🔍 Still has async cookie issue')
  }
}
