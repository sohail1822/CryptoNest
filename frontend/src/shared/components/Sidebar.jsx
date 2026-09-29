import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../features/auth/context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import { ROUTES } from "../constants/routes";
import { motion } from "framer-motion";
import {
  HiOutlineHome,
  HiOutlineChartBar,
  HiOutlineBriefcase,
  HiOutlineStar,
  HiOutlineNewspaper,
  HiOutlineLogout,
  HiOutlineLogin,
  HiOutlineSun,
  HiOutlineMoon,
  HiOutlineClock,
  HiOutlineLightningBolt,
  HiOutlineUserCircle
} from "react-icons/hi";

const Sidebar = () => {
  const { isAuthenticated, logout, user } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate(ROUTES.home, { replace: true });
  };

  const navItems = [
    { path: ROUTES.dashboard, label: "Overview", icon: <HiOutlineHome />, tooltip: "Portfolio overview & stats" },
    { path: ROUTES.market, label: "Market", icon: <HiOutlineChartBar />, tooltip: "Live crypto market data" },
    { path: ROUTES.holdings, label: "Holdings", icon: <HiOutlineBriefcase />, tooltip: "Manage your assets" },
    { path: ROUTES.watchlist, label: "Watchlist", icon: <HiOutlineStar />, tooltip: "Tracked coins" },
    { path: ROUTES.intelligence, label: "Intelligence", icon: <HiOutlineLightningBolt className="text-amber-500" />, tooltip: "Pro AI Signals", pro: true },
    { path: ROUTES.history, label: "Activity", icon: <HiOutlineClock />, tooltip: "Transaction history" },
    { path: ROUTES.news, label: "News", icon: <HiOutlineNewspaper />, tooltip: "Market news" },
  ];

  const publicItems = [
    { path: ROUTES.home, label: "Home", icon: <HiOutlineHome /> },
    { path: ROUTES.market, label: "Market", icon: <HiOutlineChartBar /> },
  ];

  const items = isAuthenticated ? navItems : publicItems;

  return (
    <motion.aside
      initial={{ x: -260 }}
      animate={{ x: 0 }}
      className="fixed left-0 top-0 h-screen w-[var(--sidebar-width)] bg-[var(--bg-sidebar)] border-r border-[var(--border-base)] z-50 flex flex-col lg:flex hidden"
    >
      {/* Brand Section */}
      <NavLink to={ROUTES.home} className="p-6 border-b border-[var(--border-base)] flex items-center gap-3 hover:opacity-80 transition-opacity">
        <div className="w-8 h-8 rounded-md bg-[var(--accent-primary)] flex items-center justify-center text-white font-bold text-lg shadow-sm">
          C
        </div>
        <h1 className="text-lg font-bold tracking-tight text-[var(--text-primary)]">
          Crypto<span className="text-[var(--accent-primary)]">Nest</span>
        </h1>
      </NavLink>

      {/* Navigation */}
      <nav className="flex-1 py-4 px-3 flex flex-col gap-1">
        <div className="px-3 mb-2">
          <p className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest">
            Main Menu
          </p>
        </div>
        {items.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `ent-nav-link group ${isActive ? "active" : ""}`
            }
          >
            <span className="text-xl opacity-70 group-hover:scale-110 transition-transform">
              {item.icon}
            </span>
            <span className="flex-1">{item.label}</span>
            {item.pro && (
              <span className="text-[9px] bg-amber-500 text-white px-2 py-0.5 rounded-sm font-black tracking-tighter uppercase">Pro</span>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Bottom Profile/Theme Area */}
      <div className="p-4 border-t border-[var(--border-base)] bg-[var(--bg-subtle)]">
        {isAuthenticated && user && (
          <NavLink
            to={ROUTES.profile}
            className="flex items-center gap-3 px-3 py-4 mb-2 border-b border-[var(--border-base)] hover:bg-[var(--bg-elevated)] rounded-md transition-colors group"
          >
            <div className="w-10 h-10 rounded-full bg-[var(--accent-primary)] flex items-center justify-center text-white dark:text-slate-950 font-bold text-lg border-2 border-[var(--bg-sidebar)]">
              {user.firstName ? user.firstName.charAt(0).toUpperCase() : (user.email ? user.email.charAt(0).toUpperCase() : 'U')}
            </div>
            <div className="flex flex-col overflow-hidden flex-1">
              <div className="flex items-center justify-between mb-0.5">
                <span className="text-sm font-bold text-[var(--text-primary)] truncate">
                  {(user.firstName || user.lastName)
                    ? `${user.firstName || ''} ${user.lastName || ''}`.trim()
                    : (user.email ? user.email.split('@')[0] : 'User Account')}
                </span>
                <span className={`text-[8px] px-1.5 py-0.5 rounded font-black uppercase tracking-tighter border ${(user.subscription || '').toLowerCase() === 'elite' ? 'bg-amber-100 text-amber-600 border-amber-200' :
                  (user.subscription || '').toLowerCase() === 'pro' ? 'bg-blue-100 text-blue-600 border-blue-200' :
                    'bg-[var(--bg-muted)] text-[var(--text-secondary)] border-[var(--border-base)]'
                  }`}>
                  {user.subscription || 'Basic'}
                </span>
              </div>
              <span className="text-[10px] text-[var(--text-muted)] truncate">
                View Profile
              </span>
            </div>
            <HiOutlineUserCircle className="text-xl text-[var(--text-muted)] opacity-0 group-hover:opacity-100 transition-opacity" />
          </NavLink>
        )}

        <button
          onClick={toggleTheme}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium text-[var(--text-secondary)] hover:bg-[var(--bg-elevated)] border border-transparent hover:border-[var(--border-base)] transition-colors mb-3"
          aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
        >
          <span className="text-xl">
            {theme === "dark" ? <HiOutlineSun /> : <HiOutlineMoon />}
          </span>
          <span>{theme === "dark" ? "Light Mode" : "Dark Mode"}</span>
        </button>

        {isAuthenticated ? (
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium text-[var(--negative)] hover:bg-[var(--negative-soft)] transition-colors group"
          >
            <span className="text-xl group-hover:translate-x-1 transition-transform">
              <HiOutlineLogout />
            </span>
            <span>Sign Out</span>
          </button>
        ) : (
          <NavLink
            to={ROUTES.login}
            className="btn-ent-primary w-full flex items-center justify-center gap-2"
          >
            <HiOutlineLogin />
            <span>Sign In</span>
          </NavLink>
        )}
      </div>
    </motion.aside>
  );
};

export default Sidebar;
