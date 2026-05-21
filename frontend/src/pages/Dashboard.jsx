import React, { useEffect, useState } from 'react';
import { useApi } from '../hooks/useApi';
import { useAuth } from '../hooks/useAuth';
import { FolderOpen, CheckSquare, AlertCircle, Users } from 'lucide-react';

const Dashboard = () => {
  const { get } = useApi();
  const { user } = useAuth();
  const [stats, setStats] = useState({
    projects: 0,
    tasks: 0,
    completed: 0,
    overdue: 0,
    inProgress: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [projects, tasks, overdue] = await Promise.all([
          get('/projects'),
          get('/tasks'),
          get('/tasks/overdue/list'),
        ]);

        const completed = tasks.filter((t) => t.status === 'done').length;
        const inProgress = tasks.filter((t) => t.status === 'in-progress').length;

        setStats({
          projects: Array.isArray(projects) ? projects.length : 0,
          tasks: Array.isArray(tasks) ? tasks.length : 0,
          completed,
          inProgress,
          overdue: Array.isArray(overdue) ? overdue.length : 0,
        });
      } catch (error) {
        console.error('Failed to fetch stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [get]);

  const StatCard = ({ icon: Icon, title, value, color }) => (
    <div className={`rounded-lg p-6 border-l-4 ${color}`} style={{backgroundColor: '#1a1e28', borderColor: color === 'border-blue-500' ? '#6c8cff' : color === 'border-green-500' ? '#34d399' : color === 'border-emerald-500' ? '#34d399' : color === 'border-yellow-500' ? '#fb923c' : '#ff6b6b'}}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[#9aa3b8] text-sm font-medium">{title}</p>
          <p className="text-3xl font-bold text-[#e8eaf0] mt-2">{value}</p>
        </div>
        <Icon className="text-[#6c8cff]" size={40} />
      </div>
    </div>
  );

  return (
    <div>
      <h1 className="text-4xl font-bold text-[#e8eaf0] mb-2">Welcome, {user?.name}!</h1>
      <p className="text-[#9aa3b8] mb-8">Here's your task management overview</p>

      {loading ? (
        <div className="text-center py-12">
          <p className="text-[#9aa3b8]">Loading dashboard...</p>
        </div>
      ) : (
        <>
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
            <StatCard
              icon={FolderOpen}
              title="Projects"
              value={stats.projects}
              color="border-blue-500"
            />
            <StatCard
              icon={CheckSquare}
              title="Total Tasks"
              value={stats.tasks}
              color="border-green-500"
            />
            <StatCard
              icon={CheckSquare}
              title="Completed"
              value={stats.completed}
              color="border-emerald-500"
            />
            <StatCard
              icon={CheckSquare}
              title="In Progress"
              value={stats.inProgress}
              color="border-yellow-500"
            />
            <StatCard
              icon={AlertCircle}
              title="Overdue"
              value={stats.overdue}
              color="border-red-500"
            />
          </div>

          {/* Task Status Breakdown */}
          <div className="rounded-lg p-6" style={{backgroundColor: '#1a1e28', border: '1px solid rgba(255, 255, 255, 0.07)'}}>
            <h2 className="text-xl font-bold text-[#e8eaf0] mb-6">Task Status Breakdown</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 rounded-lg" style={{backgroundColor: 'rgba(108, 140, 255, 0.1)'}}>
                <div className="text-3xl font-bold text-[#6c8cff]">{stats.tasks - stats.completed - stats.inProgress}</div>
                <p className="text-[#9aa3b8] mt-2">To Do</p>
              </div>
              <div className="text-center p-4 rounded-lg" style={{backgroundColor: 'rgba(251, 146, 60, 0.1)'}}>
                <div className="text-3xl font-bold text-[#fb923c]">{stats.inProgress}</div>
                <p className="text-[#9aa3b8] mt-2">In Progress</p>
              </div>
              <div className="text-center p-4 rounded-lg" style={{backgroundColor: 'rgba(52, 211, 153, 0.1)'}}>
                <div className="text-3xl font-bold text-[#34d399]">{stats.completed}</div>
                <p className="text-[#9aa3b8] mt-2">Completed</p>
              </div>
            </div>
          </div>

          {/* Overdue Alert */}
          {stats.overdue > 0 && (
            <div className="mt-8 rounded-lg p-6" style={{backgroundColor: 'rgba(255, 107, 107, 0.1)', border: '1px solid rgba(255, 107, 107, 0.2)'}}>
              <div className="flex items-center gap-3">
                <AlertCircle className="text-[#ff6b6b]" size={24} />
                <div>
                  <h3 className="font-bold text-[#ff6b6b]">⚠️ Overdue Tasks Alert</h3>
                  <p className="text-[#9aa3b8] mt-1">You have {stats.overdue} overdue tasks. Please review and update them!</p>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Dashboard;
