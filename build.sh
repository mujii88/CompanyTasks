#!/bin/bash

echo "🏗️  Building Task Management Application for Production"
echo "======================================================"

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Please run this script from the project root directory"
    exit 1
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm install

echo "📦 Installing backend dependencies..."
cd server && npm install && cd ..

echo "📦 Installing frontend dependencies..."
cd client && npm install && cd ..

# Build frontend for production
echo "🔨 Building frontend for production..."
cd client
npm run build
cd ..

# Create production directory
echo "📁 Creating production directory..."
mkdir -p production
cp -r server production/
cp -r client/build production/client
cp package.json production/
cp README.md production/

# Create production environment file
echo "⚙️  Creating production environment file..."
cat > production/server/.env << EOF
PORT=5000
MONGODB_URI=mongodb://localhost:27017/task-management
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
NODE_ENV=production
EOF

# Create production start script
echo "📝 Creating production start script..."
cat > production/start.sh << 'EOF'
#!/bin/bash

echo "🚀 Starting Task Management Application in Production Mode"

# Check if MongoDB is running
if ! pgrep -x "mongod" > /dev/null; then
    echo "❌ MongoDB is not running. Please start MongoDB first:"
    echo "   sudo systemctl start mongod"
    exit 1
fi

# Start the server
cd server
npm start
EOF

chmod +x production/start.sh

# Create PM2 ecosystem file for process management
echo "📝 Creating PM2 ecosystem file..."
cat > production/ecosystem.config.js << 'EOF'
module.exports = {
  apps: [{
    name: 'task-management-api',
    script: './server/index.js',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'production',
      PORT: 5000
    }
  }]
};
EOF

echo ""
echo "🎉 Production build completed!"
echo ""
echo "📁 Production files are in the 'production' directory"
echo ""
echo "To deploy:"
echo "1. Copy the 'production' directory to your server"
echo "2. Install PM2: npm install -g pm2"
echo "3. Start the application: cd production && pm2 start ecosystem.config.js"
echo ""
echo "Or start manually: cd production && ./start.sh"
