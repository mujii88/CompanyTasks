#!/bin/bash

echo "🚀 FREE DEPLOYMENT SETUP FOR TASK MANAGEMENT APP"
echo "================================================"
echo ""

# Check if git is installed
if ! command -v git &> /dev/null; then
    echo "❌ Git is not installed. Please install git first."
    exit 1
fi

# Check if we're in a git repository
if [ ! -d ".git" ]; then
    echo "📁 Initializing git repository..."
    git init
    git add .
    git commit -m "Initial commit - Task Management Application"
    echo "✅ Git repository initialized"
    echo ""
fi

echo "📋 DEPLOYMENT OPTIONS:"
echo "1. Render.com (Recommended - Most generous free tier)"
echo "2. Railway.app (Good alternative)"
echo "3. Vercel + MongoDB Atlas (Separate frontend/backend)"
echo ""

read -p "Choose deployment option (1-3): " choice

case $choice in
    1)
        echo ""
        echo "🎯 RENDER.COM DEPLOYMENT"
        echo "========================"
        echo ""
        echo "✅ Your app is ready for Render.com deployment!"
        echo ""
        echo "📋 Next Steps:"
        echo "1. Push your code to GitHub:"
        echo "   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git"
        echo "   git push -u origin main"
        echo ""
        echo "2. Go to https://render.com and sign up"
        echo "3. Click 'New +' → 'Blueprint'"
        echo "4. Connect your GitHub repository"
        echo "5. Render will auto-detect render.yaml and deploy everything"
        echo ""
        echo "🎉 You'll get:"
        echo "   • Backend API: https://your-app-name.onrender.com"
        echo "   • Frontend: https://your-frontend-name.onrender.com"
        echo "   • Database: Free PostgreSQL (1GB)"
        echo "   • SSL Certificate: Automatic HTTPS"
        echo ""
        ;;
    2)
        echo ""
        echo "🌐 RAILWAY.APP DEPLOYMENT"
        echo "========================="
        echo ""
        echo "✅ Your app is ready for Railway deployment!"
        echo ""
        echo "📋 Next Steps:"
        echo "1. Push your code to GitHub:"
        echo "   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git"
        echo "   git push -u origin main"
        echo ""
        echo "2. Go to https://railway.app and sign up with GitHub"
        echo "3. Click 'New Project' → 'Deploy from GitHub repo'"
        echo "4. Select your repository"
        echo "5. Add PostgreSQL database: 'New' → 'Database' → 'PostgreSQL'"
        echo ""
        echo "🎉 You'll get:"
        echo "   • Backend API: https://your-app-name.railway.app"
        echo "   • Database: Free PostgreSQL (included in $5 credit)"
        echo "   • Automatic deployments"
        echo ""
        ;;
    3)
        echo ""
        echo "🔧 VERCEL + MONGODB ATLAS DEPLOYMENT"
        echo "===================================="
        echo ""
        echo "✅ Your app is ready for Vercel + MongoDB Atlas deployment!"
        echo ""
        echo "📋 Next Steps:"
        echo "1. Push your code to GitHub:"
        echo "   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git"
        echo "   git push -u origin main"
        echo ""
        echo "2. Deploy Frontend on Vercel:"
        echo "   • Go to https://vercel.com"
        echo "   • Import your GitHub repository"
        echo "   • Set build command: cd client && npm install && npm run build"
        echo "   • Set output directory: client/build"
        echo ""
        echo "3. Deploy Backend on Railway/Render (see options 1 or 2)"
        echo ""
        echo "4. Set up MongoDB Atlas:"
        echo "   • Go to https://mongodb.com/atlas"
        echo "   • Create free account and cluster (512MB)"
        echo "   • Get connection string and add to backend env vars"
        echo ""
        echo "🎉 You'll get:"
        echo "   • Frontend: https://your-app.vercel.app"
        echo "   • Backend: https://your-backend-url.com"
        echo "   • Database: Free MongoDB Atlas (512MB)"
        echo ""
        ;;
    *)
        echo "❌ Invalid choice. Please run the script again."
        exit 1
        ;;
esac

echo ""
echo "🔧 PREPARATION CHECKLIST:"
echo "========================="
echo ""

# Check if render.yaml exists
if [ -f "render.yaml" ]; then
    echo "✅ render.yaml found (for Render.com deployment)"
else
    echo "❌ render.yaml not found"
fi

# Check if package.json exists
if [ -f "package.json" ]; then
    echo "✅ Root package.json found"
else
    echo "❌ Root package.json not found"
fi

# Check if server/package.json exists
if [ -f "server/package.json" ]; then
    echo "✅ Server package.json found"
else
    echo "❌ Server package.json not found"
fi

# Check if client/package.json exists
if [ -f "client/package.json" ]; then
    echo "✅ Client package.json found"
else
    echo "❌ Client package.json not found"
fi

echo ""
echo "📚 DOCUMENTATION:"
echo "================="
echo "• Free Deployment Guide: FREE_DEPLOYMENT.md"
echo "• Main README: README.md"
echo "• Deployment Guide: DEPLOYMENT.md"
echo ""

echo "🎯 READY TO DEPLOY!"
echo "==================="
echo "Your Task Management Application is configured for free deployment."
echo "Follow the steps above to get your app live on the internet!"
echo ""
echo "Need help? Check the documentation files listed above."
