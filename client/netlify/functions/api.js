const express = require('express');
const serverless = require('serverless-http');
const cors = require('cors');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config({ path: '../../../server/config.env' });

// Import routes
const authRoutes = require('../../../server/routes/auth');
const taskRoutes = require('../../../server/routes/tasks');
const userRoutes = require('../../../server/routes/users');

// Database initialization
const { initializeDatabase } = require('../../../server/models');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/users', userRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Task Management API is running' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

// Initialize database
let dbInitialized = false;
const initDB = async () => {
  if (!dbInitialized) {
    try {
      await initializeDatabase();
      dbInitialized = true;
      console.log('Database initialized for serverless function');
    } catch (error) {
      console.error('Database initialization failed:', error);
    }
  }
};

// Wrap the app with serverless
const handler = serverless(app);

module.exports.handler = async (event, context) => {
  // Initialize database on cold start
  await initDB();
  
  // Handle the request
  return await handler(event, context);
};
