import React from 'react';
import { motion } from 'framer-motion';
import { HiOutlineShieldCheck, HiOutlineLockClosed, HiOutlineEyeOff, HiOutlineDocumentText } from 'react-icons/hi';
import Navbar from '../Components/Navbar';
import Sidebar from '../Components/Sidebar';
import { useAuth } from '../context/AuthContext';

const Privacy = () => {
  const { isAuthenticated } = useAuth();

  const content = (
    <div className="max-w-4xl mx-auto py-12 px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-12"
      >
        <div className="flex items-center gap-3 mb-4 text-[var(--accent-primary)]">
          <HiOutlineShieldCheck className="text-3xl" />
          <h1 className="text-4xl font-bold text-[var(--text-primary)]">Privacy Policy</h1>
        </div>
        <p className="text-lg text-[var(--text-secondary)]">Your privacy is paramount. Learn how we protect and manage your data.</p>
        <p className="text-sm text-[var(--text-muted)] mt-2">Last Updated: May 2026</p>
      </motion.div>

      <div className="space-y-12">
        <section className="ent-card p-8">
          <div className="flex items-center gap-3 mb-6">
            <HiOutlineDocumentText className="text-2xl text-[var(--accent-primary)]" />
            <h2 className="text-xl font-bold text-[var(--text-primary)]">1. Information We Collect</h2>
          </div>
          <div className="space-y-4 text-[var(--text-secondary)] leading-relaxed">
            <p>We collect information to provide better services to all our users. This includes:</p>
            <ul className="list-disc ml-6 space-y-2">
              <li><strong>Account Information:</strong> Name, email address, and password when you register.</li>
              <li><strong>Portfolio Data:</strong> Cryptocurrencies you track and transaction history within the app.</li>
              <li><strong>Usage Data:</strong> Information about how you interact with our platform for performance monitoring.</li>
            </ul>
          </div>
        </section>

        <section className="ent-card p-8">
          <div className="flex items-center gap-3 mb-6">
            <HiOutlineLockClosed className="text-2xl text-[var(--accent-primary)]" />
            <h2 className="text-xl font-bold text-[var(--text-primary)]">2. How We Use Information</h2>
          </div>
          <div className="space-y-4 text-[var(--text-secondary)] leading-relaxed">
            <p>We use the information we collect to:</p>
            <ul className="list-disc ml-6 space-y-2">
              <li>Provide, maintain, and improve our services.</li>
              <li>Personalize your experience and provide relevant market insights.</li>
              <li>Communicate with you about updates, security alerts, and support.</li>
              <li>Protect the security and integrity of our platform.</li>
            </ul>
          </div>
        </section>

        <section className="ent-card p-8">
          <div className="flex items-center gap-3 mb-6">
            <HiOutlineEyeOff className="text-2xl text-[var(--accent-primary)]" />
            <h2 className="text-xl font-bold text-[var(--text-primary)]">3. Data Sharing & Security</h2>
          </div>
          <div className="space-y-4 text-[var(--text-secondary)] leading-relaxed">
            <p><strong>We do not sell your personal data to third parties.</strong> Data is only shared when necessary to provide our services (e.g., with cloud infrastructure providers) or when required by law.</p>
            <p>We implement industry-standard security measures, including encryption and secure authentication, to safeguard your information against unauthorized access.</p>
          </div>
        </section>

        <div className="text-center py-8">
          <p className="text-[var(--text-muted)] text-sm mb-4">Have questions about our privacy practices?</p>
          <a href="mailto:support@cryptonest.com" className="text-[var(--accent-primary)] font-bold hover:underline">Contact Privacy Team</a>
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

export default Privacy;
