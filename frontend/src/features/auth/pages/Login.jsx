import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';
import { ROUTES } from '../../../shared/constants/routes';
import { getApiErrorMessage } from '../../../shared/utils/apiErrors';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const response = await login(email, password);
      if (response.success) {
        toast.success('Successfully logged in');
        const destination = location.state?.from?.pathname || ROUTES.dashboard;
        navigate(destination, { replace: true });
      } else {
        const message = response.message || 'Invalid credentials';
        setError(message);
        toast.error(message);
      }
    } catch (err) {
      const message = getApiErrorMessage(err, 'Login failed. Please try again.');
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--bg-main)] flex flex-col items-center justify-center px-4 relative overflow-hidden">
      
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
          <p className="text-sm text-[var(--text-secondary)] font-medium">Log in to your CryptoNest account</p>
        </div>

        <div className="ent-card p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && <div role="alert" className="rounded-md border border-[var(--negative)] bg-[var(--negative-soft)] px-3 py-2 text-sm text-[var(--negative)]">{error}</div>}
            <div>
              <label className="text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-widest mb-2 block">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => { setEmail(e.target.value); setError(''); }}
                placeholder="name@email.com"
                className="ent-input py-3"
                required
              />
            </div>

            <div>
              <label className="text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-widest mb-2 block">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => { setPassword(e.target.value); setError(''); }}
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
            <p className="text-sm text-[var(--text-secondary)]">
              Don't have an account?{' '}
              <Link to={ROUTES.signup} className="text-[var(--accent-primary)] font-bold hover:underline">
                Create Account
              </Link>
            </p>
          </div>
        </div>

        <p className="mt-8 text-center text-[10px] text-[var(--text-muted)] font-bold uppercase tracking-[0.2em]">
          CryptoNest © {new Date().getFullYear()}
        </p>
      </motion.div>
    </div>
  );
};

export default Login;
