import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import toast from 'react-hot-toast';

const TaskContext = createContext();

export const useTask = () => {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error('useTask must be used within a TaskProvider');
  }
  return context;
};

export const TaskProvider = ({ children }) => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  // Load tasks from localStorage
  useEffect(() => {
    const loadTasks = () => {
      const storedTasks = JSON.parse(localStorage.getItem('companytasks_tasks') || '[]');
      setTasks(storedTasks);
    };
    loadTasks();
  }, []);

  // Save tasks to localStorage
  const saveTasks = (updatedTasks) => {
    localStorage.setItem('companytasks_tasks', JSON.stringify(updatedTasks));
    setTasks(updatedTasks);
  };

  // Get tasks based on user role
  const getTasks = () => {
    if (!user) return [];
    
    if (user.role === 'manager') {
      return tasks; // Managers see all tasks
    } else {
      return tasks.filter(task => task.assignee === user.id); // Employees see only their tasks
    }
  };

  // Create new task (managers only)
  const createTask = async (taskData) => {
    try {
      if (user.role !== 'manager') {
        toast.error('Only managers can create tasks');
        return { success: false, message: 'Only managers can create tasks' };
      }

      const newTask = {
        _id: Date.now().toString(),
        title: taskData.title,
        description: taskData.description,
        assignee: taskData.assignee,
        assignedBy: user.id,
        progress: 0,
        status: 'pending',
        priority: taskData.priority || 'medium',
        deadline: taskData.deadline,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      const updatedTasks = [...tasks, newTask];
      saveTasks(updatedTasks);
      
      toast.success('Task created successfully!');
      return { success: true, task: newTask };
    } catch (error) {
      toast.error('Failed to create task');
      return { success: false, message: 'Failed to create task' };
    }
  };

  // Update task
  const updateTask = async (taskId, updates) => {
    try {
      const taskIndex = tasks.findIndex(task => task._id === taskId);
      if (taskIndex === -1) {
        toast.error('Task not found');
        return { success: false, message: 'Task not found' };
      }

      const task = tasks[taskIndex];
      
      // Check permissions
      if (user.role === 'employee' && task.assignee !== user.id) {
        toast.error('You can only update your own tasks');
        return { success: false, message: 'Access denied' };
      }

      // Handle auto-completion when progress reaches 100%
      if (updates.progress >= 100) {
        updates.status = 'completed';
        updates.completedAt = new Date().toISOString();
      }

      const updatedTask = {
        ...task,
        ...updates,
        updatedAt: new Date().toISOString()
      };

      const updatedTasks = [...tasks];
      updatedTasks[taskIndex] = updatedTask;
      saveTasks(updatedTasks);

      toast.success('Task updated successfully!');
      return { success: true, task: updatedTask };
    } catch (error) {
      toast.error('Failed to update task');
      return { success: false, message: 'Failed to update task' };
    }
  };

  // Delete task (managers only)
  const deleteTask = async (taskId) => {
    try {
      if (user.role !== 'manager') {
        toast.error('Only managers can delete tasks');
        return { success: false, message: 'Only managers can delete tasks' };
      }

      const updatedTasks = tasks.filter(task => task._id !== taskId);
      saveTasks(updatedTasks);
      
      toast.success('Task deleted successfully!');
      return { success: true };
    } catch (error) {
      toast.error('Failed to delete task');
      return { success: false, message: 'Failed to delete task' };
    }
  };

  // Get task statistics
  const getTaskStats = () => {
    const userTasks = getTasks();
    const total = userTasks.length;
    const completed = userTasks.filter(task => task.status === 'completed').length;
    const pending = userTasks.filter(task => task.status === 'pending').length;
    const inProgress = userTasks.filter(task => task.status === 'in-progress').length;
    
    const now = new Date();
    const overdue = userTasks.filter(task => 
      new Date(task.deadline) < now && task.status !== 'completed'
    ).length;

    const activeTasks = userTasks.filter(task => task.status !== 'completed');
    const highPriority = activeTasks.filter(task => task.priority === 'high').length;
    const mediumPriority = activeTasks.filter(task => task.priority === 'medium').length;
    const lowPriority = activeTasks.filter(task => task.priority === 'low').length;

    return {
      total,
      completed,
      pending,
      inProgress,
      overdue,
      byPriority: {
        high: highPriority,
        medium: mediumPriority,
        low: lowPriority
      }
    };
  };

  // Get employees (for managers to assign tasks)
  const getEmployees = () => {
    const users = JSON.parse(localStorage.getItem('companytasks_users') || '[]');
    return users.filter(user => user.role === 'employee');
  };

  const value = {
    tasks: getTasks(),
    loading,
    createTask,
    updateTask,
    deleteTask,
    getTaskStats,
    getEmployees
  };

  return (
    <TaskContext.Provider value={value}>
      {children}
    </TaskContext.Provider>
  );
};
