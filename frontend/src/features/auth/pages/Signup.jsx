import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';
import { ROUTES } from '../../../shared/constants/routes';
import { getApiErrorMessage } from '../../../shared/utils/apiErrors';

const Signup = () => {
  const [formData, setFormData] = useState({
    first_name: '', last_name: '', email: '',
    password: '', phone: '', address: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }
    setLoading(true);
    try {
      const response = await signup(formData);
      if (response.success) {
        toast.success('Account created successfully');
        navigate(ROUTES.dashboard, { replace: true });
      } else {
        const message = response.message || 'Signup failed';
        setError(message);
        toast.error(message);
      }
    } catch (err) {
      const message = getApiErrorMessage(err, 'Signup failed. Please try again.');
      setError(message);
      toast.error(message);
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
          <p className="text-sm text-[var(--text-secondary)] font-medium">Join CryptoNest to start tracking crypto</p>
        </div>

        <div className="ent-card p-8 md:p-10">
          <form onSubmit={handleSubmit}>
            {error && <div role="alert" className="mb-6 rounded-md border border-[var(--negative)] bg-[var(--negative-soft)] px-3 py-2 text-sm text-[var(--negative)]">{error}</div>}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
              {fields.map((field) => (
                <div key={field.name} className={field.full ? 'sm:col-span-2' : ''}>
                  <label className="text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-widest mb-2 block">
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
                    {...(field.type === 'password' ? { minLength: 8 } : {})}
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
            <p className="text-sm text-[var(--text-secondary)]">
              Already have an account?{' '}
              <Link to={ROUTES.login} className="text-[var(--accent-primary)] font-bold hover:underline">
                Sign In
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

export default Signup;
