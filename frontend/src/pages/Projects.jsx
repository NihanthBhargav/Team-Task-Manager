import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApi } from '../hooks/useApi';
import { useAuth } from '../hooks/useAuth';
import { Plus, FolderOpen, Trash2 } from 'lucide-react';

const Projects = () => {
  const { get, post, delete: deleteProject } = useApi();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ title: '', description: '' });

  const fetchProjects = async () => {
    try {
      const data = await get('/projects');
      setProjects(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Failed to fetch projects:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleCreateProject = async (e) => {
    e.preventDefault();
    try {
      await post('/projects', formData);
      setFormData({ title: '', description: '' });
      setShowForm(false);
      fetchProjects();
    } catch (error) {
      console.error('Failed to create project:', error);
    }
  };

  const handleDeleteProject = async (id) => {
    if (confirm('Are you sure you want to delete this project?')) {
      try {
        await deleteProject(`/projects/${id}`);
        fetchProjects();
      } catch (error) {
        console.error('Failed to delete project:', error);
      }
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-4xl font-bold text-[#e8eaf0]">Projects</h1>
        {user?.role === 'admin' && (
          <button
            onClick={() => setShowForm(!showForm)}
            className="flex items-center gap-2 text-white px-4 py-2 rounded-lg transition"
            style={{backgroundColor: '#6c8cff'}}
            onMouseEnter={(e) => e.target.style.backgroundColor = '#5a7aee'}
            onMouseLeave={(e) => e.target.style.backgroundColor = '#6c8cff'}
          >
            <Plus size={20} />
            New Project
          </button>
        )}
      </div>

      {/* Create Project Form */}
      {showForm && (
        <div className="mb-8 rounded-lg p-6" style={{backgroundColor: '#1a1e28', border: '1px solid rgba(255, 255, 255, 0.07)'}}>
          <h2 className="text-xl font-bold text-[#e8eaf0] mb-4">Create New Project</h2>
          <form onSubmit={handleCreateProject} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[#e8eaf0] mb-2">Project Title</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Enter project title"
                style={{backgroundColor: '#13161e', borderColor: 'rgba(255, 255, 255, 0.1)', color: '#e8eaf0'}}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#6c8cff] focus:border-[#6c8cff]"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#e8eaf0] mb-2">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Enter project description"
                style={{backgroundColor: '#13161e', borderColor: 'rgba(255, 255, 255, 0.1)', color: '#e8eaf0'}}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#6c8cff] focus:border-[#6c8cff]"
                rows="4"
              />
            </div>
            <div className="flex gap-2">
              <button
                type="submit"
                className="text-white px-4 py-2 rounded-lg transition"
                style={{backgroundColor: '#6c8cff'}}
                onMouseEnter={(e) => e.target.style.backgroundColor = '#5a7aee'}
                onMouseLeave={(e) => e.target.style.backgroundColor = '#6c8cff'}
              >
                Create Project
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="text-[#e8eaf0] px-4 py-2 rounded-lg transition"
                style={{backgroundColor: 'rgba(255, 255, 255, 0.1)'}}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Projects List */}
      {loading ? (
        <div className="text-center py-12">
          <p className="text-[#9aa3b8]">Loading projects...</p>
        </div>
      ) : projects.length === 0 ? (
        <div className="rounded-lg p-12 text-center" style={{backgroundColor: '#1a1e28', border: '1px solid rgba(255, 255, 255, 0.07)'}}>
          <FolderOpen className="mx-auto mb-4" style={{color: '#6c8cff'}} size={48} />
          <p className="text-[#e8eaf0] text-lg">No projects yet</p>
          {user?.role === 'admin' && (
            <p className="text-[#9aa3b8] mt-2">Click "New Project" to create one</p>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <div
              key={project.id}
              className="rounded-lg transition"
              style={{backgroundColor: '#1a1e28', border: '1px solid rgba(255, 255, 255, 0.07)'}}
            >
              <div 
                className="p-6 cursor-pointer transition"
                onClick={() => navigate(`/projects/${project.id}`)}
                style={{borderRadius: '12px 12px 0 0'}}
              >
                <h3 className="text-lg font-bold text-[#e8eaf0] mb-2">{project.title}</h3>
                <p className="text-[#9aa3b8] text-sm mb-4 line-clamp-3">{project.description || 'No description'}</p>
                <p className="text-xs text-[#6c8cff]">👉 Click to view & manage members</p>
              </div>
              {user?.role === 'admin' && (
                <div className="flex gap-2 mt-4 pt-4 px-6 pb-6" style={{borderTop: '1px solid rgba(255, 255, 255, 0.07)'}}>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteProject(project.id);
                    }}
                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded transition"
                    style={{backgroundColor: 'rgba(255, 107, 107, 0.1)', color: '#ff6b6b'}}
                  >
                    <Trash2 size={16} />
                    Delete
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Projects;
