import React, { useEffect, useState } from 'react';
import { useApi } from '../hooks/useApi';
import { BarChart3, TrendingUp, CheckCircle } from 'lucide-react';

const Reports = () => {
  const { get } = useApi();
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const [projectsData, tasksData] = await Promise.all([
        get('/projects'),
        get('/tasks'),
      ]);
      setProjects(Array.isArray(projectsData) ? projectsData : []);
      setTasks(Array.isArray(tasksData) ? tasksData : []);
    } catch (error) {
      console.error('Failed to fetch reports:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const getProjectStats = (projectId) => {
    const projectTasks = tasks.filter((t) => t.projectId === projectId);
    const completed = projectTasks.filter((t) => t.status === 'done').length;
    const total = projectTasks.length;
    const percentage = total === 0 ? 0 : Math.round((completed / total) * 100);
    return { completed, total, percentage };
  };

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.status === 'done').length;
  const inProgressTasks = tasks.filter((t) => t.status === 'in-progress').length;
  const todoTasks = tasks.filter((t) => t.status === 'todo').length;
  const completionRate = totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100);

  return (
    <div>
      <h1 className="text-4xl font-bold text-[#e8eaf0] mb-2">Analytics & Reports</h1>
      <p className="text-[#9aa3b8] mb-8">Team performance and project insights</p>

      {loading ? (
        <div className="text-center py-12">
          <p className="text-[#9aa3b8]">Loading reports...</p>
        </div>
      ) : (
        <>
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="rounded-lg p-6" style={{backgroundColor: '#1a1e28', border: '1px solid rgba(255, 255, 255, 0.07)'}}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[#9aa3b8] text-sm">Total Tasks</p>
                  <p className="text-3xl font-bold text-[#6c8cff] mt-1">{totalTasks}</p>
                </div>
                <BarChart3 className="text-[#6c8cff]" size={32} />
              </div>
            </div>
            <div className="rounded-lg p-6" style={{backgroundColor: '#1a1e28', border: '1px solid rgba(255, 255, 255, 0.07)'}}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[#9aa3b8] text-sm">Completed</p>
                  <p className="text-3xl font-bold text-[#34d399] mt-1">{completedTasks}</p>
                </div>
                <CheckCircle className="text-[#34d399]" size={32} />
              </div>
            </div>
            <div className="rounded-lg p-6" style={{backgroundColor: '#1a1e28', border: '1px solid rgba(255, 255, 255, 0.07)'}}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[#9aa3b8] text-sm">In Progress</p>
                  <p className="text-3xl font-bold text-[#fb923c] mt-1">{inProgressTasks}</p>
                </div>
                <TrendingUp className="text-[#fb923c]" size={32} />
              </div>
            </div>
            <div className="rounded-lg p-6" style={{backgroundColor: '#1a1e28', border: '1px solid rgba(255, 255, 255, 0.07)'}}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[#9aa3b8] text-sm">Completion Rate</p>
                  <p className="text-3xl font-bold text-[#a78bfa] mt-1">{completionRate}%</p>
                </div>
                <BarChart3 className="text-[#a78bfa]" size={32} />
              </div>
            </div>
          </div>

          {/* Status Distribution */}
          <div className="rounded-lg p-6 mb-8" style={{backgroundColor: '#1a1e28', border: '1px solid rgba(255, 255, 255, 0.07)'}}>
            <h2 className="text-xl font-bold text-[#e8eaf0] mb-6">Task Status Distribution</h2>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-4xl font-bold text-[#9aa3b8]">{todoTasks}</div>
                <p className="text-[#9aa3b8] mt-2">To Do</p>
                <div className="mt-3 rounded-full h-2" style={{backgroundColor: 'rgba(255, 255, 255, 0.06)'}}>
                  <div
                    className="rounded-full h-2 transition"
                    style={{width: `${(todoTasks / totalTasks) * 100 || 0}%`, backgroundColor: '#6c8cff'}}
                  />
                </div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-[#fb923c]">{inProgressTasks}</div>
                <p className="text-[#9aa3b8] mt-2">In Progress</p>
                <div className="mt-3 rounded-full h-2" style={{backgroundColor: 'rgba(255, 255, 255, 0.06)'}}>
                  <div
                    className="rounded-full h-2 transition"
                    style={{width: `${(inProgressTasks / totalTasks) * 100 || 0}%`, backgroundColor: '#fb923c'}}
                  />
                </div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-[#34d399]">{completedTasks}</div>
                <p className="text-[#9aa3b8] mt-2">Completed</p>
                <div className="mt-3 rounded-full h-2" style={{backgroundColor: 'rgba(255, 255, 255, 0.06)'}}>
                  <div
                    className="rounded-full h-2 transition"
                    style={{width: `${(completedTasks / totalTasks) * 100 || 0}%`, backgroundColor: '#34d399'}}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Project Completion */}
          <div className="rounded-lg p-6" style={{backgroundColor: '#1a1e28', border: '1px solid rgba(255, 255, 255, 0.07)'}}>
            <h2 className="text-xl font-bold text-[#e8eaf0] mb-6">Project Completion Rates</h2>
            {projects.length === 0 ? (
              <p className="text-[#9aa3b8]">No projects available</p>
            ) : (
              <div className="space-y-4">
                {projects.map((project) => {
                  const stats = getProjectStats(project.id);
                  return (
                    <div key={project.id} className="rounded-lg p-4" style={{backgroundColor: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.07)'}}>
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-bold text-[#e8eaf0]">{project.title}</h3>
                        <span className="text-sm font-bold text-[#34d399]">{stats.percentage}%</span>
                      </div>
                      <div className="rounded-full h-3" style={{backgroundColor: 'rgba(255, 255, 255, 0.06)'}}>
                        <div
                          className="rounded-full h-3 transition"
                          style={{width: `${stats.percentage}%`, background: 'linear-gradient(90deg, #6c8cff, #34d399)'}}
                        />
                      </div>
                      <p className="text-xs text-[#9aa3b8] mt-2">
                        {stats.completed} of {stats.total} tasks completed
                      </p>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default Reports;
