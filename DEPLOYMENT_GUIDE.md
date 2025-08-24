# CompanyTasks Deployment Guide

## Quick Deployment Options

### Option 1: Railway (Recommended - Easiest)

1. Go to [Railway.app](https://railway.app)
2. Sign up with GitHub
3. Click "Deploy from GitHub repo"
4. Connect your GitHub account and select this repository
5. Railway will automatically detect and deploy both frontend and backend
6. Your app will be live at: `https://your-app-name.railway.app`

### Option 2: Render (Free Tier Available)

1. Go to [Render.com](https://render.com)
2. Sign up and connect GitHub
3. Create a "Web Service" from your GitHub repo
4. Use these settings:
   - Build Command: `npm run install-all && npm run build`
   - Start Command: `npm start`
   - Environment: Node
5. Add environment variables from `server/config.env`

### Option 3: Heroku

1. Install Heroku CLI
2. Run these commands:
```bash
heroku create your-app-name
git add .
git commit -m "Deploy to Heroku"
git push heroku main
```

### Option 4: Netlify + Backend Hosting

**Frontend (Netlify):**
1. Go to [Netlify.com](https://netlify.com)
2. Drag and drop the `client/build` folder
3. Your frontend will be live instantly

**Backend (Railway/Render):**
1. Deploy the `server` folder to Railway or Render
2. Update the API URL in the frontend

## Local Network Sharing (Immediate Solution)

If you want to share immediately with your client on the same network:

1. Find your local IP address:
```bash
ip addr show | grep inet
```

2. Start the application:
```bash
npm run dev
```

3. Share this URL with your client:
```
http://YOUR_LOCAL_IP:3000
```

## Environment Variables for Production

Make sure to set these in your hosting platform:
- `JWT_SECRET`: A secure random string
- `MONGODB_URI`: Your MongoDB connection string
- `NODE_ENV`: production

## Files Ready for Deployment

✅ `netlify.toml` - Netlify configuration
✅ `vercel.json` - Vercel configuration  
✅ `package.json` - Updated with deployment scripts
✅ File database fallback - Works without MongoDB
✅ Production build - Ready to deploy

Your application is fully prepared for deployment on any major hosting platform!
