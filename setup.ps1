# Community Events Board - Quick Setup Script (PowerShell)

Write-Host "🚀 Community Events Board - Quick Setup" -ForegroundColor Cyan
Write-Host ""

# Check if Node.js is installed
try {
    $nodeVersion = node --version 2>$null
    Write-Host "✅ Node.js found: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Node.js is not installed. Please install Node.js first." -ForegroundColor Red
    Write-Host "Download from: https://nodejs.org/" -ForegroundColor Yellow
    Read-Host "Press Enter to exit"
    exit 1
}

# Check if PostgreSQL is accessible
try {
    $pgReady = pg_isready 2>$null
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ PostgreSQL is running" -ForegroundColor Green
    } else {
        Write-Host "⚠️  PostgreSQL doesn't seem to be running." -ForegroundColor Yellow
        Write-Host "Please make sure PostgreSQL is installed and running." -ForegroundColor Yellow
    }
} catch {
    Write-Host "⚠️  Could not check PostgreSQL status." -ForegroundColor Yellow
    Write-Host "Please make sure PostgreSQL is installed and running." -ForegroundColor Yellow
}

Write-Host ""

# Install backend dependencies
Write-Host "📦 Installing backend dependencies..." -ForegroundColor Cyan
Set-Location backend

if (!(Test-Path "node_modules")) {
    npm install
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Failed to install backend dependencies" -ForegroundColor Red
        Read-Host "Press Enter to exit"
        exit 1
    }
} else {
    Write-Host "✅ Backend dependencies already installed" -ForegroundColor Green
}

# Check for .env file
if (!(Test-Path ".env")) {
    Write-Host ""
    Write-Host "⚠️  .env file not found!" -ForegroundColor Yellow
    Write-Host "Please copy .env.example to .env and configure your database settings:" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "    Copy-Item .env.example .env" -ForegroundColor White
    Write-Host ""
    Write-Host "Then edit .env with your PostgreSQL credentials." -ForegroundColor Yellow
    Read-Host "Press Enter to exit"
    exit 1
}

# Setup database
Write-Host ""
Write-Host "🛠️  Setting up database and seeding data..." -ForegroundColor Cyan
npm run db:init
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Database setup failed" -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}

# Install frontend dependencies
Write-Host ""
Write-Host "📦 Installing frontend dependencies..." -ForegroundColor Cyan
Set-Location ../frontend

if (!(Test-Path "node_modules")) {
    npm install
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Failed to install frontend dependencies" -ForegroundColor Red
        Read-Host "Press Enter to exit"
        exit 1
    }
} else {
    Write-Host "✅ Frontend dependencies already installed" -ForegroundColor Green
}

Write-Host ""
Write-Host "🎉 Setup completed successfully!" -ForegroundColor Green
Write-Host ""
Write-Host "📚 To start the application:" -ForegroundColor Cyan
Write-Host ""
Write-Host "1. Start the backend:" -ForegroundColor White
Write-Host "   Set-Location backend" -ForegroundColor Gray
Write-Host "   npm run dev" -ForegroundColor Gray
Write-Host ""
Write-Host "2. In another terminal, start the frontend:" -ForegroundColor White
Write-Host "   Set-Location frontend" -ForegroundColor Gray
Write-Host "   npm start" -ForegroundColor Gray
Write-Host ""
Write-Host "3. Open http://localhost:3000 in your browser" -ForegroundColor White
Write-Host ""
Write-Host "🔑 Test user credentials:" -ForegroundColor Cyan
Write-Host "   Email: test@example.com" -ForegroundColor Yellow
Write-Host "   Password: password123" -ForegroundColor Yellow
Write-Host ""

Read-Host "Press Enter to exit"
