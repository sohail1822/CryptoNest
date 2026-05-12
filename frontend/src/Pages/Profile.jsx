import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import cryptoService from '../services/cryptoService';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';
import { 
  HiOutlineUser, 
  HiOutlineKey, 
  HiOutlineShieldCheck, 
  HiOutlineCreditCard,
  HiOutlineCheckCircle,
  HiOutlineBadgeCheck,
  HiOutlineSparkles
} from 'react-icons/hi';

const Profile = () => {
  const { user, updateUser } = useAuth();
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [passwords, setPasswords] = useState({ current: '', new: '', confirm: '' });
  const [changingPassword, setChangingPassword] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await cryptoService.getProfile();
        if (response.success) {
          setProfileData(response.data);
        }
      } catch (error) {
        toast.error('Failed to load profile');
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (passwords.new !== passwords.confirm) {
      return toast.error('Passwords do not match');
    }
    try {
      setChangingPassword(true);
      const response = await cryptoService.changePassword(passwords.current, passwords.new);
      if (response.success) {
        toast.success('Password updated successfully');
        setPasswords({ current: '', new: '', confirm: '' });
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update password');
    } finally {
      setChangingPassword(false);
    }
  };

  const pricingModels = [
    {
      name: 'Basic',
      price: 'Free',
      features: ['Real-time prices', 'Portfolio tracking', 'Standard watchlist', 'Community access'],
      icon: <HiOutlineCheckCircle className="text-gray-400" />,
      tier: 'basic'
    },
    {
      name: 'Pro',
      price: '₹999/mo',
      features: ['Advanced Analytics', 'Intelligence Page Access', 'Priority Support', 'Custom Alerts', 'Zero Trading Fees'],
      icon: <HiOutlineBadgeCheck className="text-[var(--accent-primary)]" />,
      tier: 'pro',
      popular: true
    },
    {
      name: 'Elite',
      price: '₹2,499/mo',
      features: ['AI Trade Signals', 'Institutional Reports', 'Dedicated Account Manager', 'Early Access to New Features', 'API Access'],
      icon: <HiOutlineSparkles className="text-amber-500" />,
      tier: 'elite'
    }
  ];

  const handleUpgrade = async (tier) => {
    try {
      const response = await cryptoService.updateSubscription(tier);
      if (response.success) {
        toast.success(`Successfully upgraded to ${tier} plan!`);
        setProfileData(prev => ({ ...prev, subscription: tier }));
        updateUser({ subscription: tier });
      }
    } catch (error) {
      toast.error('Failed to update subscription');
    }
  };

  if (loading) return <div className="page-container animate-pulse">Loading...</div>;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="page-container space-y-8"
    >
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-[var(--text-primary)]">User Profile</h1>
        <p className="text-[var(--text-muted)]">Manage your account settings and subscription</p>
      </header>

      <div className="space-y-8">
        {/* Profile Info and Security row */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Profile Info */}
          <div className="ent-card p-6">
            <div className="flex flex-col items-center text-center mb-6">
              <div className="w-24 h-24 rounded-full bg-[var(--accent-primary)] flex items-center justify-center text-white text-4xl font-bold mb-4 shadow-xl border-4 border-white dark:border-gray-800">
                {profileData?.first_name?.charAt(0)}
              </div>
              <h2 className="text-xl font-bold text-[var(--text-primary)]">{profileData?.first_name} {profileData?.last_name}</h2>
              <p className="text-sm text-[var(--text-muted)]">{profileData?.email}</p>
              <div className="mt-4 px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-[var(--accent-primary)] text-xs font-bold rounded-full uppercase tracking-wider">
                {profileData?.subscription || 'Basic'} Member
              </div>
            </div>

            <div className="space-y-4 pt-6 border-t border-[var(--border-base)]">
              <div className="flex items-center gap-3">
                <HiOutlineUser className="text-gray-400" />
                <div>
                  <p className="text-[10px] uppercase font-bold text-gray-400">Phone</p>
                  <p className="text-sm text-[var(--text-primary)]">{profileData?.phone}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <HiOutlineShieldCheck className="text-gray-400" />
                <div>
                  <p className="text-[10px] uppercase font-bold text-gray-400">Address</p>
                  <p className="text-sm text-[var(--text-primary)]">{profileData?.address}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="ent-card p-6">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
              <HiOutlineKey className="text-[var(--accent-primary)]" /> Security
            </h3>
            <form onSubmit={handlePasswordChange} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-gray-400 uppercase mb-1 block">Current Password</label>
                <input 
                  type="password" 
                  className="ent-input" 
                  value={passwords.current}
                  onChange={e => setPasswords({...passwords, current: e.target.value})}
                  required
                />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-400 uppercase mb-1 block">New Password</label>
                <input 
                  type="password" 
                  className="ent-input" 
                  value={passwords.new}
                  onChange={e => setPasswords({...passwords, new: e.target.value})}
                  required
                />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-400 uppercase mb-1 block">Confirm New Password</label>
                <input 
                  type="password" 
                  className="ent-input" 
                  value={passwords.confirm}
                  onChange={e => setPasswords({...passwords, confirm: e.target.value})}
                  required
                />
              </div>
              <button 
                type="submit" 
                disabled={changingPassword}
                className="btn-ent-primary w-full"
              >
                {changingPassword ? 'Updating...' : 'Change Password'}
              </button>
            </form>
          </div>
        </div>

        {/* Subscriptions - Full Width */}
        <div className="ent-card p-8">
          <h3 className="text-xl font-bold mb-2 flex items-center gap-2">
            <HiOutlineCreditCard className="text-[var(--accent-primary)]" /> Subscription Plans
          </h3>
          <p className="text-[var(--text-muted)] text-sm mb-8">Choose the plan that fits your trading style</p>

          <div className="grid md:grid-cols-3 gap-8">
            {pricingModels.map((model) => (
              <div 
                key={model.name}
                className={`relative p-6 rounded-xl border-2 transition-all ${
                  (profileData?.subscription || 'basic').toLowerCase() === model.tier.toLowerCase()
                  ? 'border-[var(--accent-primary)] bg-blue-50/50 dark:bg-blue-900/10' 
                  : 'border-[var(--border-base)] hover:border-gray-400'
                } ${model.popular ? 'shadow-lg scale-105 z-10' : ''}`}
              >
                {model.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[var(--accent-primary)] text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase">
                    Most Popular
                  </div>
                )}
                <div className="text-3xl mb-4">{model.icon}</div>
                <h4 className="text-xl font-bold mb-1">{model.name}</h4>
                <p className="text-2xl font-bold text-[var(--text-primary)] mb-6">{model.price}</p>
                
                <ul className="space-y-3 mb-8">
                  {model.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-xs text-[var(--text-secondary)]">
                      <HiOutlineCheckCircle className="text-emerald-500 mt-0.5 shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                <button 
                  onClick={() => (profileData?.subscription || 'basic').toLowerCase() !== model.tier.toLowerCase() && handleUpgrade(model.tier)}
                  className={`w-full py-2 rounded-md font-bold text-sm transition-all ${
                    (profileData?.subscription || 'basic').toLowerCase() === model.tier.toLowerCase()
                    ? 'bg-emerald-500 text-white cursor-default'
                    : 'btn-ent-secondary'
                  }`}
                >
                  {(profileData?.subscription || 'basic').toLowerCase() === model.tier.toLowerCase() ? 'Current Plan' : 'Upgrade'}
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Profile;
