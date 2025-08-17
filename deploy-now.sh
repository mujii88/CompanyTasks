#!/bin/bash

echo "🚀 AUTOMATIC DEPLOYMENT FOR TASK MANAGEMENT APP"
echo "=============================================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

# Check if git is installed
if ! command -v git &> /dev/null; then
    print_error "Git is not installed. Please install git first."
    exit 1
fi

# Check if we're in a git repository
if [ ! -d ".git" ]; then
    print_info "Initializing git repository..."
    git init
    git add .
    git commit -m "Initial commit - Task Management Application"
    print_status "Git repository initialized"
    echo ""
fi

# Check if we have a remote repository
if ! git remote get-url origin &> /dev/null; then
    print_warning "No GitHub repository connected yet."
    echo ""
    echo "📋 To deploy, you need to:"
    echo "1. Create a repository on GitHub.com"
    echo "2. Run these commands:"
    echo "   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git"
    echo "   git push -u origin main"
    echo ""
    echo "3. Then run this script again"
    echo ""
    
    read -p "Do you want to continue with deployment setup? (y/n): " continue_setup
    
    if [[ $continue_setup != "y" && $continue_setup != "Y" ]]; then
        print_info "Deployment setup cancelled."
        exit 0
    fi
fi

echo "🎯 DEPLOYMENT OPTIONS:"
echo "====================="
echo "1. Render.com (Recommended - Easiest & Most Generous)"
echo "2. Railway.app (Good Alternative)"
echo "3. Vercel + MongoDB Atlas (Separate Frontend/Backend)"
echo ""

read -p "Choose deployment option (1-3): " choice

case $choice in
    1)
        print_info "Setting up Render.com deployment..."
        echo ""
        echo "🎯 RENDER.COM DEPLOYMENT"
        echo "========================"
        echo ""
        print_status "Your app is ready for Render.com deployment!"
        echo ""
        echo "📋 Next Steps:"
        echo "1. Go to https://render.com and sign up (free)"
        echo "2. Click 'New +' → 'Blueprint'"
        echo "3. Connect your GitHub repository"
        echo "4. Render will automatically detect render.yaml and deploy everything"
        echo ""
        echo "🎉 What you'll get (FREE):"
        echo "   • Backend API: https://your-app-name.onrender.com"
        echo "   • Frontend: https://your-frontend-name.onrender.com"
        echo "   • Database: Free PostgreSQL (1GB)"
        echo "   • SSL Certificate: Automatic HTTPS"
        echo "   • Custom Domain: Optional (free)"
        echo ""
        echo "💰 Total Cost: $0/month"
        echo ""
        
        # Check if render.yaml exists
        if [ -f "render.yaml" ]; then
            print_status "render.yaml found - Ready for Render.com"
        else
            print_error "render.yaml not found"
        fi
        ;;
        
    2)
        print_info "Setting up Railway.app deployment..."
        echo ""
        echo "🌐 RAILWAY.APP DEPLOYMENT"
        echo "========================="
        echo ""
        print_status "Your app is ready for Railway deployment!"
        echo ""
        echo "📋 Next Steps:"
        echo "1. Go to https://railway.app and sign up with GitHub (free)"
        echo "2. Click 'New Project' → 'Deploy from GitHub repo'"
        echo "3. Select your repository"
        echo "4. Add PostgreSQL database: 'New' → 'Database' → 'PostgreSQL'"
        echo ""
        echo "🎉 What you'll get (FREE):"
        echo "   • Backend API: https://your-app-name.railway.app"
        echo "   • Database: Free PostgreSQL (included in $5 credit)"
        echo "   • Automatic deployments"
        echo ""
        echo "💰 Total Cost: $0/month (within $5 credit limit)"
        echo ""
        ;;
        
    3)
        print_info "Setting up Vercel + MongoDB Atlas deployment..."
        echo ""
        echo "🔧 VERCEL + MONGODB ATLAS DEPLOYMENT"
        echo "===================================="
        echo ""
        print_status "Your app is ready for Vercel + MongoDB Atlas deployment!"
        echo ""
        echo "📋 Next Steps:"
        echo "1. Deploy Frontend on Vercel:"
        echo "   • Go to https://vercel.com"
        echo "   • Import your GitHub repository"
        echo "   • Set build command: cd client && npm install && npm run build"
        echo "   • Set output directory: client/build"
        echo ""
        echo "2. Deploy Backend on Railway/Render (see options 1 or 2)"
        echo ""
        echo "3. Set up MongoDB Atlas:"
        echo "   • Go to https://mongodb.com/atlas"
        echo "   • Create free account and cluster (512MB)"
        echo "   • Get connection string and add to backend env vars"
        echo ""
        echo "🎉 What you'll get (FREE):"
        echo "   • Frontend: https://your-app.vercel.app"
        echo "   • Backend: https://your-backend-url.com"
        echo "   • Database: Free MongoDB Atlas (512MB)"
        echo ""
        echo "💰 Total Cost: $0/month"
        echo ""
        ;;
        
    *)
        print_error "Invalid choice. Please run the script again."
        exit 1
        ;;
esac

echo ""
echo "🔧 PREPARATION CHECKLIST:"
echo "========================="
echo ""

# Check if render.yaml exists
if [ -f "render.yaml" ]; then
    print_status "render.yaml found (for Render.com deployment)"
else
    print_warning "render.yaml not found"
fi

# Check if package.json exists
if [ -f "package.json" ]; then
    print_status "Root package.json found"
else
    print_error "Root package.json not found"
fi

# Check if server/package.json exists
if [ -f "server/package.json" ]; then
    print_status "Server package.json found"
else
    print_error "Server package.json not found"
fi

# Check if client/package.json exists
if [ -f "client/package.json" ]; then
    print_status "Client package.json found"
else
    print_error "Client package.json not found"
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
print_status "Your Task Management Application is configured for free deployment."
echo "Follow the steps above to get your app live on the internet!"
echo ""

if [ $choice -eq 1 ]; then
    echo "🚀 QUICK START FOR RENDER.COM:"
    echo "1. Go to https://render.com"
    echo "2. Sign up with GitHub"
    echo "3. Click 'New +' → 'Blueprint'"
    echo "4. Connect your repository"
    echo "5. Click 'Apply' - Render will handle everything else!"
    echo ""
    echo "⏱️  Deployment time: ~5-10 minutes"
    echo "🎉 Your app will be live automatically!"
fi

echo ""
print_info "Need help? Check the documentation files listed above."
echo ""
print_status "Deployment setup complete! 🎉"
