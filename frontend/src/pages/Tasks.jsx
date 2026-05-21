import React, { useEffect, useState } from 'react';
import { useApi } from '../hooks/useApi';
import { useAuth } from '../hooks/useAuth';
import { CheckSquare, AlertCircle, Calendar } from 'lucide-react';

const Tasks = () => {
  const { get, put } = useApi();
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  const fetchTasks = async () => {
    try {
      const data = await get('/tasks');
      setTasks(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Failed to fetch tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleStatusUpdate = async (taskId, newStatus) => {
    try {
      const task = tasks.find((t) => t.id === taskId);
      await put(`/tasks/${taskId}`, { ...task, status: newStatus });
      fetchTasks();
    } catch (error) {
      console.error('Failed to update task:', error);
    }
  };

  const filteredTasks = filter === 'all' 
    ? tasks 
    : tasks.filter((t) => t.status === filter);

  const getStatusColor = (status) => {
    switch (status) {
      case 'done':
        return {backgroundColor: 'rgba(52,211,153,0.12)', color: '#34d399'};
      case 'in-progress':
        return {backgroundColor: 'rgba(251,146,60,0.12)', color: '#fb923c'};
      default:
        return {backgroundColor: 'rgba(154,163,184,0.12)', color: '#9aa3b8'};
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return {backgroundColor: 'rgba(255,107,107,0.15)', color: '#ff6b6b'};
      case 'medium':
        return {backgroundColor: 'rgba(251,146,60,0.15)', color: '#fb923c'};
      default:
        return {backgroundColor: 'rgba(52,211,153,0.15)', color: '#34d399'};
    }
  };

  return (
    <div>
      <h1 className="text-4xl font-bold text-[#e8eaf0] mb-2">My Tasks</h1>
      <p className="text-[#9aa3b8] mb-8">Manage your assigned tasks</p>

      {/* Filter */}
      <div className="flex gap-3 mb-8">
        {['all', 'todo', 'in-progress', 'done'].map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className="px-4 py-2 rounded-lg font-medium transition"
            style={{
              backgroundColor: filter === status ? '#6c8cff' : 'rgba(255, 255, 255, 0.05)',
              color: filter === status ? 'white' : '#e8eaf0',
              border: filter === status ? 'none' : '1px solid rgba(255, 255, 255, 0.1)'
            }}
            onMouseEnter={(e) => {
              if (filter !== status) e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.08)';
            }}
            onMouseLeave={(e) => {
              if (filter !== status) e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.05)';
            }}
          >
            {status.charAt(0).toUpperCase() + status.slice(1).replace('-', ' ')}
          </button>
        ))}
      </div>

      {/* Tasks List */}
      {loading ? (
        <div className="text-center py-12">
          <p className="text-[#9aa3b8]">Loading tasks...</p>
        </div>
      ) : filteredTasks.length === 0 ? (
        <div className="rounded-lg p-12 text-center" style={{backgroundColor: '#1a1e28', border: '1px solid rgba(255, 255, 255, 0.07)'}}>
          <CheckSquare className="mx-auto mb-4" style={{color: '#6c8cff'}} size={48} />
          <p className="text-[#e8eaf0] text-lg">No {filter === 'all' ? '' : filter} tasks</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredTasks.map((task) => (
            <div key={task.id} className="rounded-lg p-6 hover:shadow-lg transition" style={{backgroundColor: '#1a1e28', border: '1px solid rgba(255, 255, 255, 0.07)'}}>
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-[#e8eaf0]">{task.title}</h3>
                  <p className="text-[#9aa3b8] text-sm mt-1">{task.description}</p>
                </div>
                <div className="flex gap-2 ml-4">
                  <span className="text-xs font-bold px-3 py-1 rounded-full" style={getPriorityColor(task.priority)}>
                    {task.priority.toUpperCase()}
                  </span>
                  <span className="text-xs font-bold px-3 py-1 rounded-full" style={getStatusColor(task.status)}>
                    {task.status.toUpperCase()}
                  </span>
                </div>
              </div>

              {task.dueDate && (
                <div className="flex items-center gap-2 text-sm text-[#9aa3b8] mb-4">
                  <Calendar size={16} />
                  <span>Due: {new Date(task.dueDate).toLocaleDateString()}</span>
                </div>
              )}

              {/* Status Update */}
              <div className="flex gap-2 mt-4 pt-4" style={{borderTop: '1px solid rgba(255, 255, 255, 0.07)'}}>
                {['todo', 'in-progress', 'done'].map((status) => (
                  <button
                    key={status}
                    onClick={() => handleStatusUpdate(task.id, status)}
                    className="flex-1 py-2 rounded-lg font-medium transition text-sm"
                    style={{
                      backgroundColor: task.status === status ? '#6c8cff' : 'rgba(255, 255, 255, 0.05)',
                      color: task.status === status ? 'white' : '#e8eaf0'
                    }}
                    onMouseEnter={(e) => {
                      if (task.status !== status) e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.08)';
                    }}
                    onMouseLeave={(e) => {
                      if (task.status !== status) e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.05)';
                    }}
                  >
                    {status.charAt(0).toUpperCase() + status.slice(1).replace('-', ' ')}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Tasks;
