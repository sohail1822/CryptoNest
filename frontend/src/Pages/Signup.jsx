import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';

const Signup = () => {
  const [formData, setFormData] = useState({
    first_name: '', last_name: '', email: '',
    password: '', phone: '', address: '',
  });
  const [loading, setLoading] = useState(false);
  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await signup(formData);
      if (response.success) {
        toast.success('Account created successfully');
        setTimeout(() => navigate('/dashboard'), 1000);
      } else {
        toast.error(response.data?.message || 'Signup failed');
      }
    } catch (err) {
      toast.error('Signup failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const fields = [
    { name: 'first_name', label: 'First Name', type: 'text', placeholder: 'John' },
    { name: 'last_name', label: 'Last Name', type: 'text', placeholder: 'Doe' },
    { name: 'email', label: 'Email Address', type: 'email', placeholder: 'name@email.com', full: true },
    { name: 'phone', label: 'Phone Number', type: 'tel', placeholder: '9876543210' },
    { name: 'address', label: 'Address', type: 'text', placeholder: 'Mumbai, India' },
    { name: 'password', label: 'Password', type: 'password', placeholder: '••••••••', full: true },
  ];

  return (
    <div className="min-h-screen bg-[var(--bg-main)] flex flex-col items-center justify-center px-4 py-12 relative overflow-hidden">
      <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] dark:bg-grid-slate-900/20 dark:[mask-image:linear-gradient(0deg,rgba(0,0,0,0.1),rgba(0,0,0,0.5))] -z-10" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-xl"
      >
        <div className="flex flex-col items-center mb-8">
          <div className="w-12 h-12 rounded-lg bg-[var(--accent-primary)] flex items-center justify-center text-white font-black text-2xl shadow-xl shadow-blue-500/20 mb-6">
            C
          </div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)] tracking-tight">Create Account</h1>
          <p className="text-sm text-gray-500 font-medium">Join CryptoNest to start tracking crypto</p>
        </div>

        <div className="ent-card p-8 md:p-10 bg-white dark:bg-[#161b22] shadow-2xl">
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
              {fields.map((field) => (
                <div key={field.name} className={field.full ? 'sm:col-span-2' : ''}>
                  <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2 block">
                    {field.label}
                  </label>
                  <input
                    type={field.type}
                    name={field.name}
                    value={formData[field.name]}
                    onChange={handleChange}
                    placeholder={field.placeholder}
                    className="ent-input py-2.5"
                    required
                    {...(field.type === 'tel' ? { pattern: '[0-9]{10}' } : {})}
                  />
                </div>
              ))}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-ent-primary w-full py-3.5 text-base shadow-lg shadow-blue-500/20 disabled:opacity-50"
            >
              {loading ? 'Creating Account...' : 'Sign Up'}
            </button>
          </form>

          <div className="mt-8 pt-8 border-t border-[var(--border-base)] text-center">
            <p className="text-sm text-gray-500">
              Already have an account?{' '}
              <Link to="/login" className="text-[var(--accent-primary)] font-bold hover:underline">
                Sign In
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

export default Signup;
