import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, LayoutDashboard, FolderOpen, CheckSquare, Users, BarChart3, LogOut } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

export const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <>
      {/* Mobile menu button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-[#6c8cff] text-white rounded"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 h-screen w-64 bg-[#13161e] text-white p-6 transform transition-transform duration-300 ease-in-out z-40 border-r border-opacity-[0.07] border-white ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Logo */}
        <div className="mb-8 mt-12 lg:mt-0">
          <h1 className="text-2xl font-bold text-[#6c8cff]">Task Manager</h1>
          <p className="text-sm text-[#9aa3b8] mt-1">{user?.name}</p>
        </div>

        {/* Navigation */}
        <nav className="space-y-2">
          <Link
            to="/dashboard"
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-[#9aa3b8] hover:bg-white hover:bg-opacity-5 transition border-l-3 border-transparent hover:border-[#6c8cff] hover:text-[#6c8cff]"
            onClick={() => setIsOpen(false)}
          >
            <LayoutDashboard size={20} />
            <span>Dashboard</span>
          </Link>

          <Link
            to="/projects"
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-[#9aa3b8] hover:bg-white hover:bg-opacity-5 transition border-l-3 border-transparent hover:border-[#6c8cff] hover:text-[#6c8cff]"
            onClick={() => setIsOpen(false)}
          >
            <FolderOpen size={20} />
            <span>Projects</span>
          </Link>

          <Link
            to="/tasks"
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-[#9aa3b8] hover:bg-white hover:bg-opacity-5 transition border-l-3 border-transparent hover:border-[#6c8cff] hover:text-[#6c8cff]"
            onClick={() => setIsOpen(false)}
          >
            <CheckSquare size={20} />
            <span>My Tasks</span>
          </Link>

          {user?.role === 'admin' && (
            <>
              <Link
                to="/users"
                className="flex items-center gap-3 px-4 py-3 rounded-lg text-[#9aa3b8] hover:bg-white hover:bg-opacity-5 transition border-l-3 border-transparent hover:border-[#6c8cff] hover:text-[#6c8cff]"
                onClick={() => setIsOpen(false)}
              >
                <Users size={20} />
                <span>Users</span>
              </Link>

              <Link
                to="/reports"
                className="flex items-center gap-3 px-4 py-3 rounded-lg text-[#9aa3b8] hover:bg-white hover:bg-opacity-5 transition border-l-3 border-transparent hover:border-[#6c8cff] hover:text-[#6c8cff]"
                onClick={() => setIsOpen(false)}
              >
                <BarChart3 size={20} />
                <span>Reports</span>
              </Link>
            </>
          )}
        </nav>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="absolute bottom-6 left-6 right-6 flex items-center gap-3 px-4 py-3 bg-transparent border border-red-opacity-30 rounded-lg text-[#ff6b6b] hover:bg-red-opacity-10 transition w-52"
          style={{borderColor: 'rgba(255, 107, 107, 0.3)'}}
        >
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      </aside>

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
};
