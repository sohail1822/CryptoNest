import React from 'react';
import { motion } from 'framer-motion';
import { HiOutlineUserGroup, HiOutlineGlobe, HiOutlineShieldCheck, HiOutlineSparkles } from 'react-icons/hi';
import Navbar from '../Components/Navbar';
import Sidebar from '../Components/Sidebar';
import { useAuth } from '../context/AuthContext';

const About = () => {
  const { isAuthenticated } = useAuth();

  const content = (
    <div className="max-w-4xl mx-auto py-12 px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-16"
      >
        <h1 className="text-4xl font-bold text-[var(--text-primary)] mb-4">About CryptoNest</h1>
        <p className="text-lg text-[var(--text-secondary)]">Empowering the next generation of crypto investors with institutional-grade tools.</p>
      </motion.div>

      <div className="grid md:grid-cols-2 gap-12 mb-20">
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-[var(--text-primary)]">Our Mission</h2>
          <p className="text-[var(--text-secondary)] leading-relaxed">
            CryptoNest was founded with a simple goal: to make professional-grade cryptocurrency portfolio management accessible to everyone. We believe that tracking your digital assets should be as intuitive as it is powerful.
          </p>
          <p className="text-[var(--text-secondary)] leading-relaxed">
            Whether you're just starting your crypto journey or you're a seasoned trader, our platform provides the insights you need to make informed decisions without the complexity of traditional finance tools.
          </p>
        </div>
        <div className="bg-gradient-to-br from-[var(--accent-primary)]/10 to-indigo-500/10 rounded-2xl p-8 border border-[var(--border-base)] flex items-center justify-center">
          <HiOutlineSparkles className="text-8xl text-[var(--accent-primary)] animate-pulse" />
        </div>
      </div>

      <div className="grid sm:grid-cols-3 gap-8 mb-20">
        {[
          { icon: <HiOutlineGlobe />, title: 'Global Reach', desc: 'Real-time data from over 100+ global exchanges.' },
          { icon: <HiOutlineShieldCheck />, title: 'Security First', desc: 'Your data privacy is our top priority.' },
          { icon: <HiOutlineUserGroup />, title: 'Community', desc: 'Built for a growing community of 50k+ users.' },
        ].map((item, i) => (
          <div key={i} className="text-center p-6 ent-card">
            <div className="text-3xl text-[var(--accent-primary)] mb-4 flex justify-center">{item.icon}</div>
            <h3 className="font-bold text-[var(--text-primary)] mb-2">{item.title}</h3>
            <p className="text-sm text-[var(--text-secondary)]">{item.desc}</p>
          </div>
        ))}
      </div>

      <div className="ent-card p-10 bg-gray-50 dark:bg-gray-800/20 text-center">
        <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-4">Ready to start?</h2>
        <p className="text-[var(--text-secondary)] mb-8 max-w-lg mx-auto">Join thousands of users who are already taking control of their crypto portfolios with CryptoNest.</p>
        <a href="/signup" className="btn-ent-primary px-8 py-3">Get Started for Free</a>
      </div>
    </div>
  );

  if (isAuthenticated) {
    return (
      <div className="min-h-screen bg-[var(--bg-main)]">
        <Sidebar />
        <Navbar />
        <div className="lg:ml-64 transition-all duration-300">
          {content}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--bg-main)]">
      {/* Simple header for public view */}
      <nav className="border-b border-[var(--border-base)] bg-white/80 dark:bg-black/20 backdrop-blur-md sticky top-0 z-[100]">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <a href="/" className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-md bg-[var(--accent-primary)] flex items-center justify-center text-white font-bold shadow-sm">C</div>
            <span className="font-bold text-xl tracking-tight text-[var(--text-primary)]">CryptoNest</span>
          </a>
          <a href="/login" className="btn-ent-primary px-6">Sign In</a>
        </div>
      </nav>
      {content}
    </div>
  );
};

export default About;
