import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApi } from '../hooks/useApi';
import { useAuth } from '../hooks/useAuth';
import { ArrowLeft, Plus, Trash2, Users as UsersIcon, X, AlertCircle } from 'lucide-react';

const ProjectDetail = () => {
  const { id } = useParams();
  const { get, post, put, delete: deleteTask } = useApi();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [showMemberForm, setShowMemberForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'medium',
    status: 'todo',
    dueDate: '',
    assignedTo: '',
  });
  const [memberFormData, setMemberFormData] = useState('');
  const [users, setUsers] = useState([]);
  const [members, setMembers] = useState([]);
  const [pageError, setPageError] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    setPageError(null);
    try {
      console.log('🔄 Fetching project:', id);
      const projectData = await get(`/projects/${id}`);
      console.log('✅ Project data:', projectData);
      
      if (!projectData) {
        setPageError('Project not found');
        setLoading(false);
        return;
      }

      setProject(projectData);
      setTasks(projectData.Tasks || projectData.tasks || []);
      setMembers(projectData.members || []);

      if (user?.role === 'admin') {
        const usersData = await get('/users');
        console.log('✅ Users data:', usersData);
        setUsers(Array.isArray(usersData) ? usersData : []);
      }
    } catch (error) {
      console.error('❌ Failed to fetch data:', error);
      setPageError(error.message || 'Failed to load project');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchData();
    }
  }, [id]);

  const handleCreateTask = async (e) => {
    e.preventDefault();
    try {
      await post('/tasks', {
        ...formData,
        projectId: parseInt(id),
        assignedTo: formData.assignedTo ? parseInt(formData.assignedTo) : null,
      });
      setFormData({
        title: '',
        description: '',
        priority: 'medium',
        status: 'todo',
        dueDate: '',
        assignedTo: '',
      });
      setShowTaskForm(false);
      fetchData();
    } catch (error) {
      console.error('Failed to create task:', error);
    }
  };

  const handleAddMember = async (e) => {
    e.preventDefault();
    try {
      await post(`/projects/${id}/members`, { userId: parseInt(memberFormData) });
      setMemberFormData('');
      setShowMemberForm(false);
      fetchData();
    } catch (error) {
      console.error('Failed to add member:', error);
    }
  };

  const handleRemoveMember = async (memberId) => {
    if (confirm('Remove this member from project?')) {
      try {
        await post(`/projects/${id}/members/remove`, { userId: memberId });
        fetchData();
      } catch (error) {
        console.error('Failed to remove member:', error);
      }
    }
  };

  const handleUpdateTask = async (taskId, newStatus) => {
    try {
      const task = tasks.find((t) => t.id === taskId);
      await put(`/tasks/${taskId}`, { ...task, status: newStatus });
      fetchData();
    } catch (error) {
      console.error('Failed to update task:', error);
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (confirm('Are you sure you want to delete this task?')) {
      try {
        await deleteTask(`/tasks/${taskId}`);
        fetchData();
      } catch (error) {
        console.error('Failed to delete task:', error);
      }
    }
  };

  if (loading) {
    return (
      <div>
        <button
          onClick={() => navigate('/projects')}
          className="flex items-center gap-2 text-[#6c8cff] hover:underline mb-8"
        >
          <ArrowLeft size={20} />
          Back to Projects
        </button>
        <div className="text-center py-12">
          <p className="text-[#9aa3b8]">Loading project...</p>
        </div>
      </div>
    );
  }

  if (pageError) {
    return (
      <div>
        <button
          onClick={() => navigate('/projects')}
          className="flex items-center gap-2 text-[#6c8cff] hover:underline mb-8"
        >
          <ArrowLeft size={20} />
          Back to Projects
        </button>
        <div className="rounded-lg p-4 flex items-center gap-2" style={{backgroundColor: 'rgba(255, 107, 107, 0.1)', border: '1px solid rgba(255, 107, 107, 0.2)'}}>
          <AlertCircle size={20} className="text-[#ff6b6b]" />
          <span className="text-[#ff6b6b]">{pageError}</span>
        </div>
      </div>
    );
  }

  return (
    <div>
      <button
        onClick={() => navigate('/projects')}
        className="flex items-center gap-2 text-[#6c8cff] hover:underline mb-6"
      >
        <ArrowLeft size={20} />
        Back to Projects
      </button>

      {project && (
        <>
          {/* Project Header */}
          <div className="text-white rounded-lg p-8 mb-8" style={{background: 'linear-gradient(135deg, #6c8cff 0%, #5a7aee 100%)'}}>
            <h1 className="text-5xl font-bold mb-4">{project.title}</h1>
            <p className="text-lg text-blue-100">{project.description || 'No description provided'}</p>
          </div>

          {/* Members Section */}
          <div className="rounded-lg p-6 mb-8" style={{backgroundColor: '#1a1e28', border: '1px solid rgba(255, 255, 255, 0.07)'}}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-[#e8eaf0] flex items-center gap-2">
                <UsersIcon size={24} style={{color: '#6c8cff'}} />
                Project Members ({members.length})
              </h2>
              {user?.role === 'admin' && (
                <button
                  onClick={() => setShowMemberForm(!showMemberForm)}
                  className="flex items-center gap-2 text-white px-4 py-2 rounded-lg transition"
                  style={{backgroundColor: '#6c8cff'}}
                  onMouseEnter={(e) => e.target.style.backgroundColor = '#5a7aee'}
                  onMouseLeave={(e) => e.target.style.backgroundColor = '#6c8cff'}
                >
                  <Plus size={20} />
                  Add Member
                </button>
              )}
            </div>

            {/* Add Member Form */}
            {showMemberForm && user?.role === 'admin' && (
              <form onSubmit={handleAddMember} className="mb-6 p-4 rounded-lg" style={{backgroundColor: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.07)'}}>
                <div className="flex gap-2">
                  <select
                    value={memberFormData}
                    onChange={(e) => setMemberFormData(e.target.value)}
                    style={{backgroundColor: '#13161e', borderColor: 'rgba(255, 255, 255, 0.1)', color: '#e8eaf0'}}
                    className="flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#6c8cff] focus:border-[#6c8cff]"
                    required
                  >
                    <option value="">Select a member to add</option>
                    {users.filter(u => !members.find(m => m.id === u.id)).map((u) => (
                      <option key={u.id} value={u.id}>
                        {u.name} ({u.email})
                      </option>
                    ))}
                  </select>
                  <button
                    type="submit"
                    className="text-white px-4 py-2 rounded-lg transition"
                    style={{backgroundColor: '#6c8cff'}}
                    onMouseEnter={(e) => e.target.style.backgroundColor = '#5a7aee'}
                    onMouseLeave={(e) => e.target.style.backgroundColor = '#6c8cff'}
                  >
                    Add
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowMemberForm(false)}
                    className="text-[#e8eaf0] px-4 py-2 rounded-lg transition"
                    style={{backgroundColor: 'rgba(255, 255, 255, 0.1)'}}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}

            {/* Members List */}
            {members.length === 0 ? (
              <p className="text-[#9aa3b8]">No members added yet</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {members.map((member) => (
                  <div
                    key={member.id}
                    className="p-4 rounded-lg flex items-center justify-between"
                    style={{backgroundColor: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.07)'}}
                  >
                    <div>
                      <p className="font-bold text-[#e8eaf0]">{member.name}</p>
                      <p className="text-sm text-[#9aa3b8]">{member.email}</p>
                    </div>
                    {user?.role === 'admin' && (
                      <button
                        onClick={() => handleRemoveMember(member.id)}
                        className="text-[#ff6b6b] hover:text-[#ff7d7d] transition"
                      >
                        <X size={20} />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Tasks Section */}
          <div className="rounded-lg p-6" style={{backgroundColor: '#1a1e28', border: '1px solid rgba(255, 255, 255, 0.07)'}}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-[#e8eaf0]">Project Tasks</h2>
              {user?.role === 'admin' && (
                <button
                  onClick={() => setShowTaskForm(!showTaskForm)}
                  className="flex items-center gap-2 text-white px-4 py-2 rounded-lg transition"
                  style={{backgroundColor: '#6c8cff'}}
                  onMouseEnter={(e) => e.target.style.backgroundColor = '#5a7aee'}
                  onMouseLeave={(e) => e.target.style.backgroundColor = '#6c8cff'}
                >
                  <Plus size={20} />
                  New Task
                </button>
              )}
            </div>

            {/* Create Task Form */}
            {showTaskForm && user?.role === 'admin' && (
              <form onSubmit={handleCreateTask} className="mb-8 p-6 rounded-lg border" style={{backgroundColor: 'rgba(255, 255, 255, 0.03)', borderColor: 'rgba(255, 255, 255, 0.07)'}}>
                <h3 className="text-xl font-bold text-[#e8eaf0] mb-4">Create New Task</h3>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-[#e8eaf0] mb-2">Task Title</label>
                      <input
                        type="text"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        placeholder="Enter task title"
                        style={{backgroundColor: '#13161e', borderColor: 'rgba(255, 255, 255, 0.1)', color: '#e8eaf0'}}
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#6c8cff] focus:border-[#6c8cff]"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#e8eaf0] mb-2">Assign To</label>
                      <select
                        value={formData.assignedTo}
                        onChange={(e) => setFormData({ ...formData, assignedTo: e.target.value })}
                        style={{backgroundColor: '#13161e', borderColor: 'rgba(255, 255, 255, 0.1)', color: '#e8eaf0'}}
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#6c8cff] focus:border-[#6c8cff]"
                      >
                        <option value="">Unassigned</option>
                        {members.map((member) => (
                          <option key={member.id} value={member.id}>
                            {member.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#e8eaf0] mb-2">Description</label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="Enter task description"
                      style={{backgroundColor: '#13161e', borderColor: 'rgba(255, 255, 255, 0.1)', color: '#e8eaf0'}}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#6c8cff] focus:border-[#6c8cff]"
                      rows="3"
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-[#e8eaf0] mb-2">Priority</label>
                      <select
                        value={formData.priority}
                        onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                        style={{backgroundColor: '#13161e', borderColor: 'rgba(255, 255, 255, 0.1)', color: '#e8eaf0'}}
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#6c8cff] focus:border-[#6c8cff]"
                      >
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#e8eaf0] mb-2">Status</label>
                      <select
                        value={formData.status}
                        onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                        style={{backgroundColor: '#13161e', borderColor: 'rgba(255, 255, 255, 0.1)', color: '#e8eaf0'}}
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#6c8cff] focus:border-[#6c8cff]"
                      >
                        <option value="todo">To Do</option>
                        <option value="in-progress">In Progress</option>
                        <option value="done">Done</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#e8eaf0] mb-2">Due Date</label>
                      <input
                        type="date"
                        value={formData.dueDate}
                        onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                        style={{backgroundColor: '#13161e', borderColor: 'rgba(255, 255, 255, 0.1)', color: '#e8eaf0'}}
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#6c8cff] focus:border-[#6c8cff]"
                      />
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="submit"
                      className="text-white px-6 py-2 rounded-lg transition font-medium"
                      style={{backgroundColor: '#6c8cff'}}
                      onMouseEnter={(e) => e.target.style.backgroundColor = '#5a7aee'}
                      onMouseLeave={(e) => e.target.style.backgroundColor = '#6c8cff'}
                    >
                      Create Task
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowTaskForm(false)}
                      className="text-[#e8eaf0] px-6 py-2 rounded-lg transition font-medium"
                      style={{backgroundColor: 'rgba(255, 255, 255, 0.1)'}}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </form>
            )}

            {/* Tasks List */}
            {tasks.length === 0 ? (
              <div className="text-center py-12 rounded-lg" style={{backgroundColor: 'rgba(255, 255, 255, 0.03)'}}>
                <p className="text-[#9aa3b8]">No tasks yet. Create one to get started!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {tasks.map((task) => (
                  <div
                    key={task.id}
                    className="p-6 rounded-lg hover:shadow-md transition"
                    style={{backgroundColor: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.07)'}}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h3 className="text-lg font-bold text-[#e8eaf0]">{task.title}</h3>
                        <p className="text-[#9aa3b8] text-sm mt-1">{task.description}</p>
                      </div>
                      {user?.role === 'admin' && (
                        <button
                          onClick={() => handleDeleteTask(task.id)}
                          className="ml-4 text-[#ff6b6b] hover:text-[#ff7d7d] transition"
                        >
                          <Trash2 size={20} />
                        </button>
                      )}
                    </div>

                    {/* Task Meta */}
                    <div className="flex flex-wrap gap-3 mb-4">
                      <span
                        className="text-xs font-bold px-3 py-1 rounded-full"
                        style={{
                          backgroundColor: task.priority === 'high' ? 'rgba(255,107,107,0.15)' : task.priority === 'medium' ? 'rgba(251,146,60,0.15)' : 'rgba(52,211,153,0.15)',
                          color: task.priority === 'high' ? '#ff6b6b' : task.priority === 'medium' ? '#fb923c' : '#34d399'
                        }}
                      >
                        {task.priority.toUpperCase()}
                      </span>
                      <span
                        className="text-xs font-bold px-3 py-1 rounded-full"
                        style={{
                          backgroundColor: task.status === 'done' ? 'rgba(52,211,153,0.12)' : task.status === 'in-progress' ? 'rgba(251,146,60,0.12)' : 'rgba(154,163,184,0.12)',
                          color: task.status === 'done' ? '#34d399' : task.status === 'in-progress' ? '#fb923c' : '#9aa3b8'
                        }}
                      >
                        {task.status.toUpperCase()}
                      </span>
                      {task.dueDate && (
                        <span className="text-xs text-[#9aa3b8]" style={{backgroundColor: 'rgba(255, 255, 255, 0.05)', padding: '0.25rem 0.75rem', borderRadius: '9999px'}}>
                          Due: {new Date(task.dueDate).toLocaleDateString()}
                        </span>
                      )}
                    </div>

                    {/* Status Update */}
                    <div className="flex gap-2 flex-wrap">
                      {['todo', 'in-progress', 'done'].map((status) => (
                        <button
                          key={status}
                          onClick={() => handleUpdateTask(task.id, status)}
                          className="px-4 py-2 rounded-lg font-medium transition text-sm"
                          style={{
                            backgroundColor: task.status === status ? '#6c8cff' : 'rgba(255, 255, 255, 0.05)',
                            color: task.status === status ? 'white' : '#e8eaf0'
                          }}
                          onMouseEnter={(e) => {
                            if (task.status !== status) {
                              e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.08)';
                            }
                          }}
                          onMouseLeave={(e) => {
                            if (task.status !== status) {
                              e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.05)';
                            }
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
        </>
      )}
    </div>
  );
};

export default ProjectDetail;
