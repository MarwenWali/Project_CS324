@echo off
REM Quick Start Guide for Frontend-Only Expense Tracker (Windows)

echo ==========================================
echo Expense Tracker - Frontend Only Setup
echo ==========================================
echo.

REM Check if Node.js is installed
node --version >nul 2>&1
if errorlevel 1 (
    echo [X] Node.js is not installed. Please install it first:
    echo    Visit: https://nodejs.org/
    pause
    exit /b 1
)

echo [OK] Node.js version:
node --version

echo [OK] npm version:
npm --version
echo.

echo [*] Installing dependencies...
call npm install

if errorlevel 1 (
    echo [X] Failed to install dependencies
    pause
    exit /b 1
)

echo [OK] Dependencies installed successfully
echo.

echo [*] Starting development server...
echo.
echo The app will open at: http://localhost:3001
echo If port 3001 is busy, it will use another available port
echo.
echo To stop the server, press Ctrl+C
echo.

call npm run dev

pause
