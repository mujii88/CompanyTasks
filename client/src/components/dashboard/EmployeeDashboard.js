import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { CheckCircle, Clock, AlertTriangle, BarChart3 } from 'lucide-react';
import TaskCard from '../common/TaskCard';
import TaskModal from '../tasks/TaskModal';
import LoadingSpinner from '../common/LoadingSpinner';

const EmployeeDashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingTask, setEditingTask] = useState(null);
  const [showTaskModal, setShowTaskModal] = useState(false);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await axios.get('/api/tasks');
      setTasks(response.data.tasks);
    } catch (error) {
      console.error('Error fetching tasks:', error);
      toast.error('Failed to load tasks');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateTask = async (taskData) => {
    try {
      const response = await axios.put(`/api/tasks/${editingTask._id}`, taskData);
      setTasks(tasks.map(task => 
        task._id === editingTask._id ? response.data.task : task
      ));
      setEditingTask(null);
      setShowTaskModal(false);
      toast.success('Task updated successfully!');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update task');
    }
  };

  const handleEditTask = (task) => {
    setEditingTask(task);
    setShowTaskModal(true);
  };

  const getTaskStats = () => {
    const total = tasks.length;
    const completed = tasks.filter(task => task.status === 'completed').length;
    const inProgress = tasks.filter(task => task.status === 'in-progress').length;
    const overdue = tasks.filter(task => 
      new Date(task.deadline) < new Date() && task.status !== 'completed'
    ).length;

    return { total, completed, inProgress, overdue };
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  const stats = getTaskStats();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">My Tasks</h1>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <BarChart3 className="h-6 w-6 text-gray-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Total Tasks</dt>
                  <dd className="text-lg font-medium text-gray-900">{stats.total}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <CheckCircle className="h-6 w-6 text-green-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Completed</dt>
                  <dd className="text-lg font-medium text-gray-900">{stats.completed}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Clock className="h-6 w-6 text-blue-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">In Progress</dt>
                  <dd className="text-lg font-medium text-gray-900">{stats.inProgress}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <AlertTriangle className="h-6 w-6 text-red-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Overdue</dt>
                  <dd className="text-lg font-medium text-gray-900">{stats.overdue}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tasks Section */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">My Assigned Tasks</h2>
        </div>
        <div className="p-6">
          {tasks.length === 0 ? (
            <div className="text-center py-12">
              <BarChart3 className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No tasks assigned</h3>
              <p className="mt-1 text-sm text-gray-500">You don't have any tasks assigned yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {tasks.map(task => (
                <TaskCard
                  key={task._id}
                  task={task}
                  onEdit={handleEditTask}
                  showActions={false}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Task Modal for Progress Update */}
      {showTaskModal && (
        <TaskModal
          task={editingTask}
          isEmployee={true}
          onSubmit={handleUpdateTask}
          onClose={() => {
            setShowTaskModal(false);
            setEditingTask(null);
          }}
        />
      )}
    </div>
  );
};

export default EmployeeDashboard;
