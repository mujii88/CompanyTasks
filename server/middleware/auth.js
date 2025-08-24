const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { fileDatabase, usingFileDatabase } = require('../models');

// Middleware to verify JWT token
const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      return res.status(401).json({ message: 'Access token required' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    let user;
    
    if (usingFileDatabase()) {
      user = await fileDatabase.findUserById(decoded.userId);
    } else {
      user = await User.findById(decoded.userId);
    }

    if (!user) {
      return res.status(401).json({ message: 'Invalid token' });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(403).json({ message: 'Invalid token' });
  }
};

// Middleware to check if user is manager
const requireManager = (req, res, next) => {
  if (req.user.role !== 'manager') {
    return res.status(403).json({ message: 'Manager access required' });
  }
  next();
};

// Middleware to check if user is employee
const requireEmployee = (req, res, next) => {
  if (req.user.role !== 'employee') {
    return res.status(403).json({ message: 'Employee access required' });
  }
  next();
};

// Middleware to check if user can access task (manager or assigned employee)
const canAccessTask = async (req, res, next) => {
  try {
    const taskId = req.params.id;
    let task;
    
    if (usingFileDatabase()) {
      task = await fileDatabase.findTaskById(taskId);
    } else {
      const Task = require('../models/Task');
      task = await Task.findById(taskId);
    }

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Managers can access all tasks, employees can only access their assigned tasks
    if (req.user.role === 'manager' || task.assignee.toString() === req.user._id.toString()) {
      req.task = task;
      next();
    } else {
      return res.status(403).json({ message: 'Access denied' });
    }
  } catch (error) {
    return res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  authenticateToken,
  requireManager,
  requireEmployee,
  canAccessTask
};
