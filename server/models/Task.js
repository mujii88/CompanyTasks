const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Task = sequelize.define('Task', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    progress: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      validate: {
        min: 0,
        max: 100
      }
    },
    status: {
      type: DataTypes.ENUM('pending', 'in-progress', 'completed'),
      defaultValue: 'pending'
    },
    priority: {
      type: DataTypes.ENUM('low', 'medium', 'high'),
      defaultValue: 'medium'
    },
    deadline: {
      type: DataTypes.DATE,
      allowNull: false
    },
    completedAt: {
      type: DataTypes.DATE,
      allowNull: true
    }
  }, {
    tableName: 'tasks',
    timestamps: true,
    hooks: {
      beforeSave: async (task) => {
        // Auto-complete when progress reaches 100%
        if (task.progress >= 100 && task.status !== 'completed') {
          task.status = 'completed';
          task.completedAt = new Date();
        }
      }
    }
  });

  // Virtual for checking if task is overdue
  Task.prototype.isOverdue = function() {
    return this.deadline < new Date() && this.status !== 'completed';
  };

  return Task;
};
