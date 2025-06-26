@echo off
echo 🚀 Community Events Board - Quick Setup
echo.

:: Check if Node.js is installed
node --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Node.js is not installed. Please install Node.js first.
    echo Download from: https://nodejs.org/
    pause
    exit /b 1
)

:: Check if PostgreSQL is running
pg_isready >nul 2>&1
if errorlevel 1 (
    echo ⚠️  PostgreSQL doesn't seem to be running.
    echo Please make sure PostgreSQL is installed and running.
    echo.
)

echo ✅ Node.js found
echo.

:: Install backend dependencies
echo 📦 Installing backend dependencies...
cd backend
if not exist node_modules (
    call npm install
    if errorlevel 1 (
        echo ❌ Failed to install backend dependencies
        pause
        exit /b 1
    )
) else (
    echo ✅ Backend dependencies already installed
)

:: Check for .env file
if not exist .env (
    echo.
    echo ⚠️  .env file not found!
    echo Please copy .env.example to .env and configure your database settings:
    echo.
    echo    copy .env.example .env
    echo.
    echo Then edit .env with your PostgreSQL credentials.
    pause
    exit /b 1
)

:: Setup database
echo.
echo 🛠️  Setting up database and seeding data...
call npm run db:init
if errorlevel 1 (
    echo ❌ Database setup failed
    pause
    exit /b 1
)

:: Install frontend dependencies
echo.
echo 📦 Installing frontend dependencies...
cd ..\frontend
if not exist node_modules (
    call npm install
    if errorlevel 1 (
        echo ❌ Failed to install frontend dependencies
        pause
        exit /b 1
    )
) else (
    echo ✅ Frontend dependencies already installed
)

echo.
echo 🎉 Setup completed successfully!
echo.
echo 📚 To start the application:
echo.
echo 1. Start the backend:
echo    cd backend
echo    npm run dev
echo.
echo 2. In another terminal, start the frontend:
echo    cd frontend
echo    npm start
echo.
echo 3. Open http://localhost:3000 in your browser
echo.
echo 🔑 Test user credentials:
echo    Email: test@example.com
echo    Password: password123
echo.
pause
