import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await login(email, password);
      if (response.success) {
        toast.success('Successfully logged in');
        setTimeout(() => navigate('/dashboard'), 1000);
      } else {
        toast.error(response.message || 'Invalid credentials');
      }
    } catch (err) {
      toast.error('Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--bg-main)] flex flex-col items-center justify-center px-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] dark:bg-grid-slate-900/20 dark:[mask-image:linear-gradient(0deg,rgba(0,0,0,0.1),rgba(0,0,0,0.5))] -z-10" />
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="flex flex-col items-center mb-10">
          <div className="w-12 h-12 rounded-lg bg-[var(--accent-primary)] flex items-center justify-center text-white font-black text-2xl shadow-xl shadow-blue-500/20 mb-6">
            C
          </div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)] tracking-tight">Sign In</h1>
          <p className="text-sm text-gray-500 font-medium">Log in to your CryptoNest account</p>
        </div>

        <div className="ent-card p-8 bg-white dark:bg-[#161b22] shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2 block">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@email.com"
                className="ent-input py-3"
                required
              />
            </div>

            <div>
              <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2 block">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="ent-input py-3"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-ent-primary w-full py-3.5 text-base shadow-lg shadow-blue-500/20 disabled:opacity-50"
            >
              {loading ? 'Logging in...' : 'Sign In'}
            </button>
          </form>

          <div className="mt-8 pt-8 border-t border-[var(--border-base)] text-center">
            <p className="text-sm text-gray-500">
              Don't have an account?{' '}
              <Link to="/signup" className="text-[var(--accent-primary)] font-bold hover:underline">
                Create Account
              </Link>
            </p>
          </div>
        </div>

        <p className="mt-8 text-center text-[10px] text-gray-400 font-bold uppercase tracking-[0.2em]">
          CryptoNest © {new Date().getFullYear()}
        </p>
      </motion.div>
    </div>
  );
};

export default Login;
