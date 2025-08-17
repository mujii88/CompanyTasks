#!/bin/bash

echo "🚀 Task Management Application Setup"
echo "====================================="

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    echo "Visit: https://nodejs.org/"
    exit 1
fi

echo "✅ Node.js is installed: $(node --version)"

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm first."
    exit 1
fi

echo "✅ npm is installed: $(npm --version)"

# Install dependencies
echo ""
echo "📦 Installing dependencies..."
npm install

echo "📦 Installing backend dependencies..."
cd server && npm install && cd ..

echo "📦 Installing frontend dependencies..."
cd client && npm install && cd ..

# Check if MongoDB is running
echo ""
echo "🔍 Checking MongoDB status..."

if command -v mongod &> /dev/null; then
    if pgrep -x "mongod" > /dev/null; then
        echo "✅ MongoDB is running"
    else
        echo "⚠️  MongoDB is installed but not running"
        echo "   Starting MongoDB..."
        sudo systemctl start mongod 2>/dev/null || echo "   Please start MongoDB manually: sudo systemctl start mongod"
    fi
else
    echo "⚠️  MongoDB is not installed"
    echo "   You can install MongoDB using:"
    echo "   sudo apt update && sudo apt install -y mongodb-org"
    echo "   sudo systemctl start mongod"
    echo "   sudo systemctl enable mongod"
    echo ""
    echo "   Or use MongoDB Atlas (cloud):"
    echo "   1. Go to https://www.mongodb.com/atlas"
    echo "   2. Create a free cluster"
    echo "   3. Get your connection string"
    echo "   4. Update server/config.env with your MONGODB_URI"
fi

echo ""
echo "🎉 Setup complete!"
echo ""
echo "To start the application:"
echo "1. Make sure MongoDB is running"
echo "2. Start the backend: cd server && npm run dev"
echo "3. Start the frontend: cd client && npm start"
echo ""
echo "Or use the convenience script: npm run dev"
echo ""
echo "The application will be available at:"
echo "   Frontend: http://localhost:3000"
echo "   Backend API: http://localhost:5000"
