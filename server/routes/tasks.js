const express = require('express');
const { body, validationResult } = require('express-validator');
const Task = require('../models/Task');
const User = require('../models/User');
const { authenticateToken, requireManager, canAccessTask } = require('../middleware/auth');

const router = express.Router();

// Get all tasks (managers see all, employees see only their tasks)
router.get('/', authenticateToken, async (req, res) => {
  try {
    let query = {};
    
    // Employees can only see their assigned tasks
    if (req.user.role === 'employee') {
      query.assignee = req.user._id;
    }

    const tasks = await Task.find(query)
      .populate('assignee', 'name email department')
      .populate('assignedBy', 'name email')
      .sort({ createdAt: -1 });

    res.json({ tasks });
  } catch (error) {
    console.error('Get tasks error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get single task
router.get('/:id', authenticateToken, canAccessTask, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id)
      .populate('assignee', 'name email department')
      .populate('assignedBy', 'name email');

    res.json({ task });
  } catch (error) {
    console.error('Get task error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create new task (managers only)
router.post('/', authenticateToken, requireManager, [
  body('title').trim().isLength({ min: 1 }).withMessage('Title is required'),
  body('description').trim().isLength({ min: 1 }).withMessage('Description is required'),
  body('assignee').isMongoId().withMessage('Valid assignee ID is required'),
  body('deadline').isISO8601().withMessage('Valid deadline is required'),
  body('priority').optional().isIn(['low', 'medium', 'high']).withMessage('Priority must be low, medium, or high')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { title, description, assignee, deadline, priority } = req.body;

    // Check if assignee exists and is an employee
    const assigneeUser = await User.findById(assignee);
    if (!assigneeUser) {
      return res.status(400).json({ message: 'Assignee not found' });
    }

    if (assigneeUser.role !== 'employee') {
      return res.status(400).json({ message: 'Can only assign tasks to employees' });
    }

    const task = new Task({
      title,
      description,
      assignee,
      assignedBy: req.user._id,
      deadline: new Date(deadline),
      priority: priority || 'medium'
    });

    await task.save();

    const populatedTask = await Task.findById(task._id)
      .populate('assignee', 'name email department')
      .populate('assignedBy', 'name email');

    res.status(201).json({
      message: 'Task created successfully',
      task: populatedTask
    });
  } catch (error) {
    console.error('Create task error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update task (managers can update all fields, employees can only update progress)
router.put('/:id', authenticateToken, canAccessTask, [
  body('title').optional().trim().isLength({ min: 1 }).withMessage('Title cannot be empty'),
  body('description').optional().trim().isLength({ min: 1 }).withMessage('Description cannot be empty'),
  body('progress').optional().isInt({ min: 0, max: 100 }).withMessage('Progress must be between 0 and 100'),
  body('priority').optional().isIn(['low', 'medium', 'high']).withMessage('Priority must be low, medium, or high'),
  body('deadline').optional().isISO8601().withMessage('Valid deadline is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { title, description, progress, priority, deadline } = req.body;
    const updates = {};

    // Managers can update all fields
    if (req.user.role === 'manager') {
      if (title) updates.title = title;
      if (description) updates.description = description;
      if (priority) updates.priority = priority;
      if (deadline) updates.deadline = new Date(deadline);
    }

    // Both managers and employees can update progress
    if (progress !== undefined) {
      updates.progress = progress;
    }

    // Handle auto-completion when progress reaches 100%
    if (updates.progress >= 100) {
      updates.status = 'completed';
      updates.completedAt = Date.now();
    }

    const task = await Task.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true, runValidators: true }
    ).populate('assignee', 'name email department')
     .populate('assignedBy', 'name email');

    res.json({
      message: 'Task updated successfully',
      task
    });
  } catch (error) {
    console.error('Update task error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete task (managers only)
router.delete('/:id', authenticateToken, requireManager, async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);
    
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    res.json({ message: 'Task deleted successfully' });
  } catch (error) {
    console.error('Delete task error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get tasks statistics (managers only)
router.get('/stats/overview', authenticateToken, requireManager, async (req, res) => {
  try {
    const totalTasks = await Task.countDocuments();
    const completedTasks = await Task.countDocuments({ status: 'completed' });
    const pendingTasks = await Task.countDocuments({ status: 'pending' });
    const inProgressTasks = await Task.countDocuments({ status: 'in-progress' });
    
    // Overdue tasks
    const overdueTasks = await Task.countDocuments({
      deadline: { $lt: new Date() },
      status: { $ne: 'completed' }
    });

    // Tasks by priority
    const highPriorityTasks = await Task.countDocuments({ priority: 'high', status: { $ne: 'completed' } });
    const mediumPriorityTasks = await Task.countDocuments({ priority: 'medium', status: { $ne: 'completed' } });
    const lowPriorityTasks = await Task.countDocuments({ priority: 'low', status: { $ne: 'completed' } });

    res.json({
      stats: {
        total: totalTasks,
        completed: completedTasks,
        pending: pendingTasks,
        inProgress: inProgressTasks,
        overdue: overdueTasks,
        byPriority: {
          high: highPriorityTasks,
          medium: mediumPriorityTasks,
          low: lowPriorityTasks
        }
      }
    });
  } catch (error) {
    console.error('Stats error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
