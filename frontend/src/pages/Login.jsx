import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Mail, Lock, AlertCircle, Eye, EyeOff } from 'lucide-react';

const Login = () => {
  const [emailOrUsername, setEmailOrUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(emailOrUsername, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{background: 'linear-gradient(135deg, #0d0f14 0%, #1a1e28 100%)'}}>
      <div className="w-full max-w-md rounded-lg p-8" style={{backgroundColor: '#1a1e28', border: '1px solid rgba(255, 255, 255, 0.07)'}}>
        <h1 className="text-3xl font-bold text-[#6c8cff] mb-2 text-center">Task Manager</h1>
        <p className="text-[#9aa3b8] text-center mb-8">Sign in to your account</p>

        {error && (
          <div className="mb-6 p-4 rounded-lg flex items-center gap-3" style={{backgroundColor: 'rgba(255, 107, 107, 0.1)', border: '1px solid rgba(255, 107, 107, 0.2)'}}>
            <AlertCircle className="text-[#ff6b6b]" size={20} />
            <p className="text-[#ff6b6b] text-sm">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-[#e8eaf0] mb-2">Email or Username</label>
            <div className="relative">
              <Mail className="absolute left-3 top-3.5 text-[#9aa3b8]" size={20} />
              <input
                type="text"
                value={emailOrUsername}
                onChange={(e) => setEmailOrUsername(e.target.value)}
                placeholder="your@email.com or username"
                style={{backgroundColor: '#13161e', borderColor: 'rgba(255, 255, 255, 0.1)', color: '#e8eaf0'}}
                className="w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#6c8cff] focus:border-[#6c8cff]"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-[#e8eaf0] mb-2">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-3.5 text-[#9aa3b8]" size={20} />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                style={{backgroundColor: '#13161e', borderColor: 'rgba(255, 255, 255, 0.1)', color: '#e8eaf0'}}
                className="w-full pl-10 pr-12 py-3 border rounded-lg focus:ring-2 focus:ring-[#6c8cff] focus:border-[#6c8cff]"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3.5 text-[#9aa3b8] hover:text-[#e8eaf0] transition"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full text-white font-medium py-3 rounded-lg transition disabled:opacity-50"
            style={{backgroundColor: '#6c8cff'}}
            onMouseEnter={(e) => e.target.style.backgroundColor = '#5a7aee'}
            onMouseLeave={(e) => e.target.style.backgroundColor = '#6c8cff'}
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <p className="text-center text-[#9aa3b8] mt-6">
          Don't have an account?{' '}
          <Link to="/register" className="text-[#6c8cff] hover:underline font-medium">
            Sign up here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
