import React from 'react';
import { format } from 'date-fns';
import { Calendar, User, AlertTriangle } from 'lucide-react';
import ProgressBar from './ProgressBar';

const TaskCard = ({ task, onEdit, onDelete, showActions = true }) => {
  const isOverdue = new Date(task.deadline) < new Date() && task.status !== 'completed';
  
  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'in-progress': return 'bg-blue-100 text-blue-800';
      case 'pending': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className={`bg-white rounded-lg shadow-md p-6 border-l-4 ${
      isOverdue ? 'border-red-500' : 
      task.status === 'completed' ? 'border-green-500' : 
      'border-primary-500'
    }`}>
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">{task.title}</h3>
          <p className="text-gray-600 text-sm mb-3">{task.description}</p>
        </div>
        {isOverdue && (
          <AlertTriangle className="h-5 w-5 text-red-500 flex-shrink-0" />
        )}
      </div>

      <div className="space-y-3 mb-4">
        <div className="flex items-center text-sm text-gray-600">
          <User className="h-4 w-4 mr-2" />
          <span>Assigned to: {task.assignee.name}</span>
        </div>
        
        <div className="flex items-center text-sm text-gray-600">
          <Calendar className="h-4 w-4 mr-2" />
          <span>Deadline: {format(new Date(task.deadline), 'MMM dd, yyyy')}</span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600">Progress:</span>
            <span className="text-sm font-medium">{task.progress}%</span>
          </div>
          <div className="flex space-x-2">
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(task.priority)}`}>
              {task.priority}
            </span>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(task.status)}`}>
              {task.status}
            </span>
          </div>
        </div>

        <ProgressBar progress={task.progress} />
      </div>

      {showActions && (
        <div className="flex justify-end space-x-2">
          <button
            onClick={() => onEdit(task)}
            className="px-3 py-1 text-sm bg-primary-600 text-white rounded hover:bg-primary-700 transition-colors"
          >
            Edit
          </button>
          {onDelete && (
            <button
              onClick={() => onDelete(task._id)}
              className="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
            >
              Delete
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default TaskCard;
