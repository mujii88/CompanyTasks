# Use Node.js 18 Alpine as base image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./
COPY server/package*.json ./server/
COPY client/package*.json ./client/

# Install dependencies
RUN npm install
RUN cd server && npm install
RUN cd client && npm install

# Copy source code
COPY . .

# Build frontend
RUN cd client && npm run build

# Create production environment
RUN echo "PORT=5000" > server/.env && \
    echo "MONGODB_URI=mongodb://mongo:27017/task-management" >> server/.env && \
    echo "JWT_SECRET=your-super-secret-jwt-key-change-this-in-production" >> server/.env && \
    echo "NODE_ENV=production" >> server/.env

# Expose port
EXPOSE 5000

# Start the application
CMD ["npm", "start"]
