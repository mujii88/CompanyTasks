const sequelize = require('../config/database');
const User = require('./User')(sequelize);
const Task = require('./Task')(sequelize);

// Define associations
Task.belongsTo(User, { as: 'assignee', foreignKey: 'assigneeId' });
Task.belongsTo(User, { as: 'assignedBy', foreignKey: 'assignedById' });
User.hasMany(Task, { as: 'assignedTasks', foreignKey: 'assigneeId' });
User.hasMany(Task, { as: 'createdTasks', foreignKey: 'assignedById' });

// Initialize database
const initializeDatabase = async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connection established successfully.');
    
    // Sync models with database
    await sequelize.sync({ alter: true });
    console.log('Database models synchronized.');
    
  } catch (error) {
    console.error('Database connection error:', error);
    process.exit(1);
  }
};

module.exports = {
  sequelize,
  User,
  Task,
  initializeDatabase
};
