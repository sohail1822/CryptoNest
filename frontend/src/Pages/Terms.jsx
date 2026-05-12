import React from 'react';
import { motion } from 'framer-motion';
import { HiOutlineScale, HiOutlineExclamationCircle, HiOutlineBadgeCheck, HiOutlineClipboardList } from 'react-icons/hi';
import Navbar from '../Components/Navbar';
import Sidebar from '../Components/Sidebar';
import { useAuth } from '../context/AuthContext';

const Terms = () => {
  const { isAuthenticated } = useAuth();

  const content = (
    <div className="max-w-4xl mx-auto py-12 px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-12"
      >
        <div className="flex items-center gap-3 mb-4 text-[var(--accent-primary)]">
          <HiOutlineScale className="text-3xl" />
          <h1 className="text-4xl font-bold text-[var(--text-primary)]">Terms of Service</h1>
        </div>
        <p className="text-lg text-[var(--text-secondary)]">Please read these terms carefully before using the CryptoNest platform.</p>
        <p className="text-sm text-[var(--text-muted)] mt-2">Last Updated: May 2026</p>
      </motion.div>

      <div className="space-y-12">
        <section className="ent-card p-8">
          <div className="flex items-center gap-3 mb-6">
            <HiOutlineClipboardList className="text-2xl text-[var(--accent-primary)]" />
            <h2 className="text-xl font-bold text-[var(--text-primary)]">1. Acceptance of Terms</h2>
          </div>
          <p className="text-[var(--text-secondary)] leading-relaxed">
            By accessing or using CryptoNest, you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using or accessing this site.
          </p>
        </section>

        <section className="ent-card p-8">
          <div className="flex items-center gap-3 mb-6">
            <HiOutlineExclamationCircle className="text-2xl text-rose-500" />
            <h2 className="text-xl font-bold text-[var(--text-primary)]">2. No Financial Advice</h2>
          </div>
          <p className="text-[var(--text-secondary)] leading-relaxed">
            <strong>CryptoNest is an educational and portfolio tracking tool.</strong> All information provided on the platform, including AI signals and market data, does not constitute financial, investment, or trading advice. You should consult with a professional financial advisor before making any investment decisions. We are not responsible for any financial losses incurred.
          </p>
        </section>

        <section className="ent-card p-8">
          <div className="flex items-center gap-3 mb-6">
            <HiOutlineBadgeCheck className="text-2xl text-[var(--accent-primary)]" />
            <h2 className="text-xl font-bold text-[var(--text-primary)]">3. User Responsibilities</h2>
          </div>
          <div className="space-y-4 text-[var(--text-secondary)] leading-relaxed">
            <p>Users are responsible for:</p>
            <ul className="list-disc ml-6 space-y-2">
              <li>Maintaining the confidentiality of their account credentials.</li>
              <li>Ensuring that their use of the platform complies with local laws.</li>
              <li>Providing accurate information for account registration.</li>
            </ul>
          </div>
        </section>

        <section className="ent-card p-8">
          <div className="flex items-center gap-3 mb-6">
            <HiOutlineScale className="text-2xl text-[var(--accent-primary)]" />
            <h2 className="text-xl font-bold text-[var(--text-primary)]">4. Limitation of Liability</h2>
          </div>
          <p className="text-[var(--text-secondary)] leading-relaxed">
            In no event shall CryptoNest or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on CryptoNest's website.
          </p>
        </section>

        <div className="text-center py-8">
          <p className="text-[var(--text-muted)] text-sm mb-4">Questions about our terms?</p>
          <a href="mailto:legal@cryptonest.com" className="text-[var(--accent-primary)] font-bold hover:underline">Contact Legal Team</a>
        </div>
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

export default Terms;
