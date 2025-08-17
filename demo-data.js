const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Import models
const User = require('./server/models/User');
const Task = require('./server/models/Task');

// Connect to MongoDB
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/task-management';

async function createDemoData() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Task.deleteMany({});
    console.log('Cleared existing data');

    // Create demo users
    const manager = new User({
      name: 'John Manager',
      email: 'manager@example.com',
      password: 'password123',
      role: 'manager',
      department: 'Management'
    });

    const employee1 = new User({
      name: 'Alice Johnson',
      email: 'alice@example.com',
      password: 'password123',
      role: 'employee',
      department: 'Development'
    });

    const employee2 = new User({
      name: 'Bob Smith',
      email: 'bob@example.com',
      password: 'password123',
      role: 'employee',
      department: 'Design'
    });

    const employee3 = new User({
      name: 'Carol Davis',
      email: 'carol@example.com',
      password: 'password123',
      role: 'employee',
      department: 'Marketing'
    });

    await User.insertMany([manager, employee1, employee2, employee3]);
    console.log('Created demo users');

    // Get user IDs for task creation
    const users = await User.find();
    const managerUser = users.find(u => u.role === 'manager');
    const employees = users.filter(u => u.role === 'employee');

    // Create demo tasks
    const tasks = [
      {
        title: 'Design New Website',
        description: 'Create a modern, responsive website design for the company homepage',
        assignee: employees[1]._id, // Bob (Design)
        assignedBy: managerUser._id,
        progress: 75,
        priority: 'high',
        deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
        status: 'in-progress'
      },
      {
        title: 'Implement User Authentication',
        description: 'Add secure user authentication system with JWT tokens',
        assignee: employees[0]._id, // Alice (Development)
        assignedBy: managerUser._id,
        progress: 100,
        priority: 'high',
        deadline: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
        status: 'completed',
        completedAt: new Date()
      },
      {
        title: 'Create Marketing Campaign',
        description: 'Develop a comprehensive marketing campaign for Q4 product launch',
        assignee: employees[2]._id, // Carol (Marketing)
        assignedBy: managerUser._id,
        progress: 30,
        priority: 'medium',
        deadline: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days from now
        status: 'in-progress'
      },
      {
        title: 'Database Optimization',
        description: 'Optimize database queries and improve performance',
        assignee: employees[0]._id, // Alice (Development)
        assignedBy: managerUser._id,
        progress: 0,
        priority: 'low',
        deadline: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000), // 21 days from now
        status: 'pending'
      },
      {
        title: 'Logo Redesign',
        description: 'Redesign company logo to match new brand guidelines',
        assignee: employees[1]._id, // Bob (Design)
        assignedBy: managerUser._id,
        progress: 90,
        priority: 'medium',
        deadline: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
        status: 'in-progress'
      },
      {
        title: 'Social Media Strategy',
        description: 'Develop comprehensive social media marketing strategy',
        assignee: employees[2]._id, // Carol (Marketing)
        assignedBy: managerUser._id,
        progress: 100,
        priority: 'medium',
        deadline: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
        status: 'completed',
        completedAt: new Date()
      }
    ];

    await Task.insertMany(tasks);
    console.log('Created demo tasks');

    console.log('\n🎉 Demo data created successfully!');
    console.log('\nDemo Users:');
    console.log('Manager: manager@example.com / password123');
    console.log('Employee 1: alice@example.com / password123');
    console.log('Employee 2: bob@example.com / password123');
    console.log('Employee 3: carol@example.com / password123');
    console.log('\nYou can now login with any of these accounts to test the application.');

    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');

  } catch (error) {
    console.error('Error creating demo data:', error);
    process.exit(1);
  }
}

createDemoData();
