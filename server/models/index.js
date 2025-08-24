const mongoose = require('mongoose');
const fileDatabase = require('./fileDatabase');

// Import models
const User = require('./User');
const Task = require('./Task');

let usingFileDatabase = false;

const initializeDatabase = async () => {
  try {
    // Try MongoDB Atlas first, then local MongoDB, then fallback to file database
    let mongoUri = process.env.MONGODB_URI;
    
    // If Atlas connection fails, try local MongoDB
    if (!mongoUri || mongoUri.includes('mongodb.net')) {
      console.log('Attempting local MongoDB connection...');
      mongoUri = 'mongodb://localhost:27017/taskmanagement';
    }
    
    try {
      await mongoose.connect(mongoUri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
        connectTimeoutMS: 10000, // Give up initial connection after 10s
      });
      
      console.log(`Connected to MongoDB successfully: ${mongoUri.includes('localhost') ? 'Local' : 'Atlas'}`);
      
      // Create indexes for better performance
      await User.createIndexes();
      await Task.createIndexes();
      console.log('Database indexes created');
      
    } catch (mongoError) {
      console.log('MongoDB connection failed, falling back to local MongoDB...');
      
      try {
        // Final fallback to local MongoDB with different settings
        await mongoose.connect('mongodb://127.0.0.1:27017/taskmanagement', {
          useNewUrlParser: true,
          useUnifiedTopology: true,
          serverSelectionTimeoutMS: 3000,
        });
        
        console.log('Connected to local MongoDB successfully');
        
        // Create indexes for better performance
        await User.createIndexes();
        await Task.createIndexes();
        console.log('Database indexes created');
        
      } catch (localMongoError) {
        console.log('Local MongoDB also failed, using file-based database...');
        
        // Use file-based database as final fallback
        await fileDatabase.initialize();
        usingFileDatabase = true;
        console.log('File-based database initialized successfully');
      }
    }
    
  } catch (error) {
    console.error('All database connection attempts failed:', error.message);
    
    // Final attempt with file database
    try {
      await fileDatabase.initialize();
      usingFileDatabase = true;
      console.log('Using file-based database as fallback');
    } catch (fileError) {
      console.error('File database initialization failed:', fileError);
      throw error;
    }
  }
};

// Handle connection events
mongoose.connection.on('error', (err) => {
  console.error('MongoDB connection error:', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('MongoDB disconnected');
});

// Graceful shutdown
process.on('SIGINT', async () => {
  try {
    await mongoose.connection.close();
    console.log('MongoDB connection closed through app termination');
    process.exit(0);
  } catch (error) {
    console.error('Error during database shutdown:', error);
    process.exit(1);
  }
});

module.exports = {
  initializeDatabase,
  User,
  Task,
  fileDatabase,
  usingFileDatabase: () => usingFileDatabase
};
