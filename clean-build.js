#!/usr/bin/env node

const fs = require('fs')
const path = require('path')

console.log('🧹 Cleaning build cache...\n')

const projectPath = 'C:\\Users\\LENOVO\\Desktop\\Workspce\\vo-onelink-google'
const nextPath = path.join(projectPath, '.next')
const tsbuildInfoPath = path.join(projectPath, 'tsconfig.tsbuildinfo')

// Function to delete directory recursively
function deleteDirectory(dirPath) {
  if (fs.existsSync(dirPath)) {
    try {
      fs.rmSync(dirPath, { recursive: true, force: true })
      console.log(`✅ Deleted: ${dirPath}`)
    } catch (error) {
      console.log(`❌ Could not delete ${dirPath}: ${error.message}`)
    }
  } else {
    console.log(`ℹ️  Directory doesn't exist: ${dirPath}`)
  }
}

// Function to delete file
function deleteFile(filePath) {
  if (fs.existsSync(filePath)) {
    try {
      fs.unlinkSync(filePath)
      console.log(`✅ Deleted: ${filePath}`)
    } catch (error) {
      console.log(`❌ Could not delete ${filePath}: ${error.message}`)
    }
  } else {
    console.log(`ℹ️  File doesn't exist: ${filePath}`)
  }
}

// Clean up build artifacts
deleteDirectory(nextPath)
deleteFile(tsbuildInfoPath)

console.log('\n🎯 Cache cleaning complete!')
console.log('👉 Now run "pnpm build" to test the fixes')
