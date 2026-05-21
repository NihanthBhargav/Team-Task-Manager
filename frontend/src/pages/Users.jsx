import React, { useEffect, useState } from 'react';
import { useApi } from '../hooks/useApi';
import { Users as UsersIcon, Shield, User } from 'lucide-react';

const Users = () => {
  const { get, put } = useApi();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    try {
      const data = await get('/users');
      setUsers(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Failed to fetch users:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleRoleChange = async (userId, newRole) => {
    try {
      await put(`/users/${userId}/role`, { role: newRole });
      fetchUsers();
    } catch (error) {
      console.error('Failed to update user role:', error);
    }
  };

  return (
    <div>
      <h1 className="text-4xl font-bold text-[#e8eaf0] mb-2">User Management</h1>
      <p className="text-[#9aa3b8] mb-8">Manage team members and their roles</p>

      {loading ? (
        <div className="text-center py-12">
          <p className="text-[#9aa3b8]">Loading users...</p>
        </div>
      ) : (
        <div className="rounded-lg overflow-hidden" style={{backgroundColor: '#1a1e28', border: '1px solid rgba(255, 255, 255, 0.07)'}}>
          <table className="w-full">
            <thead style={{backgroundColor: '#13161e', borderBottom: '1px solid rgba(255, 255, 255, 0.07)'}}>
              <tr>
                <th className="px-6 py-3 text-left text-sm font-bold text-[#9aa3b8]">Name</th>
                <th className="px-6 py-3 text-left text-sm font-bold text-[#9aa3b8]">Email</th>
                <th className="px-6 py-3 text-left text-sm font-bold text-[#9aa3b8]">Role</th>
                <th className="px-6 py-3 text-left text-sm font-bold text-[#9aa3b8]">Action</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="transition" style={{borderBottom: '1px solid rgba(255, 255, 255, 0.07)'}} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.03)'} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{backgroundColor: 'rgba(108, 140, 255, 0.2)'}}>
                        <User className="text-[#6c8cff]" size={20} />
                      </div>
                      <span className="font-medium text-[#e8eaf0]">{user.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-[#9aa3b8]">{user.email}</td>
                  <td className="px-6 py-4">
                    <span
                      className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-bold"
                      style={{
                        backgroundColor: user.role === 'admin' ? 'rgba(108, 140, 255, 0.15)' : 'rgba(52, 211, 153, 0.15)',
                        color: user.role === 'admin' ? '#6c8cff' : '#34d399'
                      }}
                    >
                      {user.role === 'admin' ? (
                        <>
                          <Shield size={16} />
                          Admin
                        </>
                      ) : (
                        <>
                          <User size={16} />
                          Member
                        </>
                      )}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <select
                      value={user.role}
                      onChange={(e) => handleRoleChange(user.id, e.target.value)}
                      className="px-3 py-2 border rounded-lg text-sm font-medium focus:ring-2 focus:ring-[#6c8cff] focus:border-[#6c8cff]"
                      style={{backgroundColor: '#13161e', borderColor: 'rgba(255, 255, 255, 0.1)', color: '#e8eaf0'}}
                    >
                      <option value="admin">Make Admin</option>
                      <option value="member">Make Member</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Users;
