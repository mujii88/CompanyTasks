# Deployment Guide

This guide covers multiple deployment options for the Task Management Application.

## Prerequisites

- Node.js 18+ and npm
- MongoDB (local or cloud)
- Git

## Option 1: Local Development Deployment

### Quick Start
```bash
# Clone the repository
git clone <repository-url>
cd task-management-app

# Run the setup script
./setup.sh

# Start the application
npm run dev
```

### Manual Setup
```bash
# Install dependencies
npm install
cd server && npm install && cd ..
cd client && npm install && cd ..

# Start MongoDB (if not already running)
sudo systemctl start mongod

# Create demo data
cd server && node demo-data.js && cd ..

# Start backend
cd server && npm run dev

# Start frontend (in another terminal)
cd client && npm start
```

## Option 2: Production Build

### Using the Build Script
```bash
# Run the production build script
./build.sh

# The production files will be in the 'production' directory
cd production

# Start the application
./start.sh
```

### Manual Production Build
```bash
# Install dependencies
npm install
cd server && npm install && cd ..
cd client && npm install && cd ..

# Build frontend for production
cd client && npm run build && cd ..

# Set up production environment
cp server/config.env server/.env
# Edit server/.env with your production settings

# Start the server
cd server && npm start
```

## Option 3: Docker Deployment

### Using Docker Compose (Recommended)
```bash
# Build and start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

### Using Docker Only
```bash
# Build the image
docker build -t task-management-app .

# Run with MongoDB
docker run -d --name mongo mongo:7.0
docker run -d --name app --link mongo -p 5000:5000 task-management-app
```

## Option 4: Cloud Deployment

### Heroku
```bash
# Install Heroku CLI
curl https://cli-assets.heroku.com/install.sh | sh

# Login to Heroku
heroku login

# Create Heroku app
heroku create your-task-management-app

# Add MongoDB addon
heroku addons:create mongolab:sandbox

# Deploy
git push heroku main

# Open the app
heroku open
```

### Railway
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login to Railway
railway login

# Initialize project
railway init

# Deploy
railway up
```

### DigitalOcean App Platform
1. Connect your GitHub repository
2. Choose Node.js as the runtime
3. Set environment variables:
   - `NODE_ENV=production`
   - `MONGODB_URI=your-mongodb-connection-string`
   - `JWT_SECRET=your-secret-key`
4. Deploy

## Option 5: VPS Deployment

### Ubuntu/Debian Server
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install MongoDB
wget -qO - https://www.mongodb.org/static/pgp/server-7.0.asc | sudo apt-key add -
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/7.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-7.0.list
sudo apt update
sudo apt install -y mongodb-org
sudo systemctl start mongod
sudo systemctl enable mongod

# Clone and deploy application
git clone <repository-url>
cd task-management-app
./build.sh

# Install PM2 for process management
sudo npm install -g pm2

# Start the application
cd production
pm2 start ecosystem.config.js
pm2 startup
pm2 save
```

### Using Nginx as Reverse Proxy
```bash
# Install Nginx
sudo apt install nginx

# Create Nginx configuration
sudo nano /etc/nginx/sites-available/task-management

# Add the following configuration:
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}

# Enable the site
sudo ln -s /etc/nginx/sites-available/task-management /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

## Environment Variables

Create a `.env` file in the server directory with the following variables:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/task-management
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
NODE_ENV=production
```

### MongoDB Connection Strings

- **Local MongoDB**: `mongodb://localhost:27017/task-management`
- **MongoDB Atlas**: `mongodb+srv://username:password@cluster.mongodb.net/task-management`
- **Docker MongoDB**: `mongodb://mongo:27017/task-management`

## Security Considerations

### Production Checklist
- [ ] Change default JWT secret
- [ ] Use HTTPS in production
- [ ] Set up proper firewall rules
- [ ] Configure MongoDB authentication
- [ ] Use environment variables for sensitive data
- [ ] Set up regular backups
- [ ] Monitor application logs
- [ ] Set up rate limiting
- [ ] Configure CORS properly

### JWT Secret Generation
```bash
# Generate a secure JWT secret
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

## Monitoring and Maintenance

### PM2 Commands
```bash
# View application status
pm2 status

# View logs
pm2 logs

# Restart application
pm2 restart task-management-api

# Stop application
pm2 stop task-management-api

# Delete application
pm2 delete task-management-api
```

### MongoDB Maintenance
```bash
# Connect to MongoDB shell
mongosh

# Show databases
show dbs

# Use task management database
use task-management

# Show collections
show collections

# Backup database
mongodump --db task-management --out /backup

# Restore database
mongorestore --db task-management /backup/task-management
```

## Troubleshooting

### Common Issues

1. **MongoDB Connection Error**
   - Check if MongoDB is running: `sudo systemctl status mongod`
   - Verify connection string in environment variables
   - Check firewall settings

2. **Port Already in Use**
   - Check what's using the port: `sudo lsof -i :5000`
   - Kill the process or change the port

3. **Build Errors**
   - Clear node_modules and reinstall: `rm -rf node_modules && npm install`
   - Check Node.js version: `node --version`

4. **CORS Errors**
   - Verify CORS configuration in server/index.js
   - Check frontend proxy settings

### Logs and Debugging
```bash
# View application logs
pm2 logs task-management-api

# View MongoDB logs
sudo journalctl -u mongod

# View Nginx logs
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log
```

## Support

For deployment issues:
1. Check the logs for error messages
2. Verify all prerequisites are installed
3. Ensure environment variables are set correctly
4. Test the application locally first
5. Create an issue in the repository with detailed error information
