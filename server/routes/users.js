const express = require('express');
const User = require('../models/User');
const { authenticateToken, requireManager } = require('../middleware/auth');

const router = express.Router();

// Get all employees (managers only)
router.get('/employees', authenticateToken, requireManager, async (req, res) => {
  try {
    const employees = await User.find({ role: 'employee' })
      .select('name email department createdAt')
      .sort({ name: 1 });

    res.json({ employees });
  } catch (error) {
    console.error('Get employees error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all users (managers only)
router.get('/', authenticateToken, requireManager, async (req, res) => {
  try {
    const users = await User.find()
      .select('name email role department createdAt')
      .sort({ name: 1 });

    res.json({ users });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get user by ID (managers only)
router.get('/:id', authenticateToken, requireManager, async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .select('name email role department createdAt');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ user });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
