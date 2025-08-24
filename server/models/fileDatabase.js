const fs = require('fs').promises;
const path = require('path');
const bcrypt = require('bcryptjs');

class FileDatabase {
  constructor() {
    this.dbPath = path.join(__dirname, '../data');
    this.usersFile = path.join(this.dbPath, 'users.json');
    this.tasksFile = path.join(this.dbPath, 'tasks.json');
    this.users = [];
    this.tasks = [];
  }

  async initialize() {
    try {
      // Create data directory if it doesn't exist
      await fs.mkdir(this.dbPath, { recursive: true });
      
      // Load existing data
      await this.loadUsers();
      await this.loadTasks();
      
      console.log('File-based database initialized successfully');
    } catch (error) {
      console.error('Error initializing file database:', error);
      throw error;
    }
  }

  async loadUsers() {
    try {
      const data = await fs.readFile(this.usersFile, 'utf8');
      this.users = JSON.parse(data);
    } catch (error) {
      // File doesn't exist, start with empty array
      this.users = [];
      await this.saveUsers();
    }
  }

  async loadTasks() {
    try {
      const data = await fs.readFile(this.tasksFile, 'utf8');
      this.tasks = JSON.parse(data);
    } catch (error) {
      // File doesn't exist, start with empty array
      this.tasks = [];
      await this.saveTasks();
    }
  }

  async saveUsers() {
    await fs.writeFile(this.usersFile, JSON.stringify(this.users, null, 2));
  }

  async saveTasks() {
    await fs.writeFile(this.tasksFile, JSON.stringify(this.tasks, null, 2));
  }

  generateId() {
    return Date.now().toString() + Math.random().toString(36).substr(2, 9);
  }

  // User methods
  async createUser(userData) {
    const { name, email, password, role, department } = userData;
    
    // Check if user exists
    const existingUser = this.users.find(u => u.email === email);
    if (existingUser) {
      throw new Error('User already exists');
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = {
      _id: this.generateId(),
      name,
      email,
      password: hashedPassword,
      role: role || 'employee',
      department,
      createdAt: new Date().toISOString()
    };

    this.users.push(user);
    await this.saveUsers();
    
    // Return user without password
    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  async findUserByEmail(email) {
    return this.users.find(u => u.email === email);
  }

  async findUserById(id) {
    return this.users.find(u => u._id === id);
  }

  async updateUser(id, updates) {
    const userIndex = this.users.findIndex(u => u._id === id);
    if (userIndex === -1) {
      throw new Error('User not found');
    }

    this.users[userIndex] = { ...this.users[userIndex], ...updates };
    await this.saveUsers();
    
    const { password: _, ...userWithoutPassword } = this.users[userIndex];
    return userWithoutPassword;
  }

  async findEmployees() {
    return this.users
      .filter(u => u.role === 'employee')
      .map(({ password, ...user }) => user);
  }

  async findAllUsers() {
    return this.users.map(({ password, ...user }) => user);
  }

  // Task methods
  async createTask(taskData) {
    const task = {
      _id: this.generateId(),
      ...taskData,
      progress: taskData.progress || 0,
      status: taskData.status || 'pending',
      priority: taskData.priority || 'medium',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    this.tasks.push(task);
    await this.saveTasks();
    return task;
  }

  async findTasks(query = {}) {
    let filteredTasks = this.tasks;

    if (query.assignee) {
      filteredTasks = filteredTasks.filter(t => t.assignee === query.assignee);
    }

    return filteredTasks.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }

  async findTaskById(id) {
    return this.tasks.find(t => t._id === id);
  }

  async updateTask(id, updates) {
    const taskIndex = this.tasks.findIndex(t => t._id === id);
    if (taskIndex === -1) {
      throw new Error('Task not found');
    }

    // Handle auto-completion
    if (updates.progress >= 100) {
      updates.status = 'completed';
      updates.completedAt = new Date().toISOString();
    }

    this.tasks[taskIndex] = { 
      ...this.tasks[taskIndex], 
      ...updates, 
      updatedAt: new Date().toISOString() 
    };
    
    await this.saveTasks();
    return this.tasks[taskIndex];
  }

  async deleteTask(id) {
    const taskIndex = this.tasks.findIndex(t => t._id === id);
    if (taskIndex === -1) {
      throw new Error('Task not found');
    }

    const deletedTask = this.tasks.splice(taskIndex, 1)[0];
    await this.saveTasks();
    return deletedTask;
  }

  async getTaskStats() {
    const total = this.tasks.length;
    const completed = this.tasks.filter(t => t.status === 'completed').length;
    const pending = this.tasks.filter(t => t.status === 'pending').length;
    const inProgress = this.tasks.filter(t => t.status === 'in-progress').length;
    
    const now = new Date();
    const overdue = this.tasks.filter(t => 
      new Date(t.deadline) < now && t.status !== 'completed'
    ).length;

    const activeTasks = this.tasks.filter(t => t.status !== 'completed');
    const highPriority = activeTasks.filter(t => t.priority === 'high').length;
    const mediumPriority = activeTasks.filter(t => t.priority === 'medium').length;
    const lowPriority = activeTasks.filter(t => t.priority === 'low').length;

    return {
      total,
      completed,
      pending,
      inProgress: inProgress,
      overdue,
      byPriority: {
        high: highPriority,
        medium: mediumPriority,
        low: lowPriority
      }
    };
  }

  async comparePassword(plainPassword, hashedPassword) {
    return bcrypt.compare(plainPassword, hashedPassword);
  }
}

module.exports = new FileDatabase();
