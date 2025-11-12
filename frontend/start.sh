#!/bin/bash
# Quick Start Guide for Frontend-Only Expense Tracker

echo "=========================================="
echo "Expense Tracker - Frontend Only Setup"
echo "=========================================="
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install it first:"
    echo "   Visit: https://nodejs.org/"
    exit 1
fi

echo "✅ Node.js version: $(node --version)"
echo "✅ npm version: $(npm --version)"
echo ""

# Navigate to frontend directory
cd "$(dirname "$0")" || exit

echo "📦 Installing dependencies..."
npm install

if [ $? -eq 0 ]; then
    echo "✅ Dependencies installed successfully"
else
    echo "❌ Failed to install dependencies"
    exit 1
fi

echo ""
echo "🚀 Starting development server..."
echo ""
echo "The app will open at: http://localhost:3001"
echo "If port 3001 is busy, it will use another available port"
echo ""
echo "To stop the server, press Ctrl+C"
echo ""

npm run dev
