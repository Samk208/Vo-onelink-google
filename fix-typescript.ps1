# TypeScript Fix Script for Windows PowerShell
# Run this script to fix all TypeScript errors systematically

Write-Host "🔧 Starting TypeScript fixes..." -ForegroundColor Green

# Create backup
Write-Host "📦 Creating backup..." -ForegroundColor Yellow
git add -A
git commit -m "Backup before TypeScript fixes - $(Get-Date -Format 'yyyy-MM-dd-HHmmss')" 2>$null
git tag "fix-backup-$(Get-Date -Format 'yyyy-MM-dd-HHmmss')"
Write-Host "✅ Backup created" -ForegroundColor Green

# Counter for fixed files
$fixedCount = 0

# Function to fix .single() to .maybeSingle() in a file
function Fix-SingleToMaybe {
    param($FilePath)
    
    $content = Get-Content $FilePath -Raw
    if ($content -match '\.single\(\)') {
        $newContent = $content -replace '\.single\(\)', '.maybeSingle()'
        Set-Content -Path $FilePath -Value $newContent -NoNewline
        Write-Host "  ✓ Fixed .single() in $($FilePath)" -ForegroundColor Cyan
        $script:fixedCount++
        return $true
    }
    return $false
}

# Function to remove problematic type assertions
function Fix-TypeAssertions {
    param($FilePath)
    
    $content = Get-Content $FilePath -Raw
    $modified = $false
    
    # Remove QueryResult type assertions
    if ($content -match 'as QueryResult<') {
        $newContent = $content -replace ' as QueryResult<[^>]+>', ''
        Set-Content -Path $FilePath -Value $newContent -NoNewline
        Write-Host "  ✓ Removed QueryResult assertion in $($FilePath)" -ForegroundColor Cyan
        $modified = $true
    }
    
    # Remove QueryData type declarations that are unused
    if ($content -match 'type \w+Query = QueryData<typeof query>') {
        $newContent = $content -replace 'type \w+Query = QueryData<typeof query>\r?\n\s*', ''
        Set-Content -Path $FilePath -Value $newContent -NoNewline
        Write-Host "  ✓ Removed unused QueryData type in $($FilePath)" -ForegroundColor Cyan
        $modified = $true
    }
    
    return $modified
}

Write-Host "`n📝 Fixing API routes..." -ForegroundColor Yellow

# Fix all TypeScript files in app/api
Get-ChildItem -Path "app\api" -Filter "*.ts" -Recurse | ForEach-Object {
    $fixed = Fix-SingleToMaybe -FilePath $_.FullName
    $fixed2 = Fix-TypeAssertions -FilePath $_.FullName
    if ($fixed -or $fixed2) {
        $fixedCount++
    }
}

Write-Host "`n📝 Fixing lib files..." -ForegroundColor Yellow

# Fix specific lib files
$libFiles = @(
    "lib\auth-helpers.ts",
    "lib\auth-context.tsx",
    "middleware.ts"
)

foreach ($file in $libFiles) {
    if (Test-Path $file) {
        Fix-TypeAssertions -FilePath $file
    }
}

Write-Host "`n📝 Fixing hooks..." -ForegroundColor Yellow

# Fix hooks files
Get-ChildItem -Path "hooks" -Filter "*.ts" -File | ForEach-Object {
    Fix-SingleToMaybe -FilePath $_.FullName
}

Write-Host "`n✅ Total files processed: $fixedCount" -ForegroundColor Green

Write-Host "`n🔍 Running type check..." -ForegroundColor Yellow
pnpm typecheck

Write-Host "`n✅ Fix script complete!" -ForegroundColor Green
