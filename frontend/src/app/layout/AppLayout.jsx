import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../../shared/components/Navbar';
import Sidebar from '../../shared/components/Sidebar';

const AppLayout = () => (
  <div className="min-h-screen bg-[var(--bg-main)] transition-colors duration-200">
    <Sidebar />
    <Navbar />
    <main className="lg:ml-[var(--sidebar-width)] transition-all duration-300">
      <Outlet />
    </main>
  </div>
);

export default AppLayout;
