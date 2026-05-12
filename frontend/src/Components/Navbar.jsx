import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import { motion, AnimatePresence } from "framer-motion";
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
  HiMenu,
  HiX,
} from "react-icons/hi";

const Navbar = () => {
  const { isAuthenticated, logout, user } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [mobileOpen, setMobileOpen] = useState(false);

  const menuVariants = {
    closed: { opacity: 0, y: -20, pointerEvents: "none" },
    open: { opacity: 1, y: 0, pointerEvents: "auto" },
  };

  return (
    <>
      {/* Mobile Top Header */}
      <nav className="lg:hidden fixed top-0 left-0 right-0 z-[60] bg-[var(--bg-sidebar)] border-b border-[var(--border-base)] px-4 py-3 flex items-center justify-between shadow-sm">
        <NavLink to="/" className="flex items-center gap-2">
          <div className="w-7 h-7 rounded bg-[var(--accent-primary)] flex items-center justify-center text-white font-bold text-sm">
            C
          </div>
          <span className="font-bold text-[var(--text-primary)]">
            CryptoNest
          </span>
        </NavLink>

        <div className="flex items-center gap-2">
          <button
            onClick={toggleTheme}
            className="w-9 h-9 flex items-center justify-center rounded-md border border-[var(--border-base)] text-xl"
          >
            {theme === "dark" ? <HiOutlineSun /> : <HiOutlineMoon />}
          </button>
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="w-9 h-9 flex items-center justify-center rounded-md bg-gray-100 dark:bg-gray-800 text-xl"
          >
            {mobileOpen ? <HiX /> : <HiMenu />}
          </button>
        </div>

        {/* Mobile Slide Menu */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial="closed"
              animate="open"
              exit="closed"
              variants={menuVariants}
              className="absolute top-full left-0 right-0 bg-[var(--bg-sidebar)] border-b border-[var(--border-base)] shadow-xl p-4 flex flex-col gap-1"
            >
              {isAuthenticated && user && (
                <div className="flex items-center gap-3 px-3 py-4 mb-2 border-b border-[var(--border-base)]/50">
                  <div className="w-10 h-10 rounded-full bg-[var(--accent-primary)] flex items-center justify-center text-white font-bold text-lg">
                    {user.firstName ? user.firstName.charAt(0).toUpperCase() : (user.email ? user.email.charAt(0).toUpperCase() : 'U')}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-bold text-[var(--text-primary)]">
                      {(user.firstName || user.lastName) 
                        ? `${user.firstName || ''} ${user.lastName || ''}`.trim() 
                        : (user.email ? user.email.split('@')[0] : 'User Account')}
                    </span>
                    <span className="text-[10px] text-gray-400">
                      {user.email}
                    </span>
                  </div>
                </div>
              )}
              {isAuthenticated ? (
                <>
                  <NavLink
                    to="/dashboard"
                    onClick={() => setMobileOpen(false)}
                    className="ent-nav-link"
                  >
                    <HiOutlineHome className="text-xl" />
                    <span>Overview</span>
                  </NavLink>
                  <NavLink
                    to="/market"
                    onClick={() => setMobileOpen(false)}
                    className="ent-nav-link"
                  >
                    <HiOutlineChartBar className="text-xl" />
                    <span>Market</span>
                  </NavLink>
                  <NavLink
                    to="/holdings"
                    onClick={() => setMobileOpen(false)}
                    className="ent-nav-link"
                  >
                    <HiOutlineBriefcase className="text-xl" />
                    <span>Holdings</span>
                  </NavLink>
                  <NavLink
                    to="/watchlist"
                    onClick={() => setMobileOpen(false)}
                    className="ent-nav-link"
                  >
                    <HiOutlineStar className="text-xl" />
                    <span>Watchlist</span>
                  </NavLink>
                  <NavLink
                    to="/news"
                    onClick={() => setMobileOpen(false)}
                    className="ent-nav-link"
                  >
                    <HiOutlineNewspaper className="text-xl" />
                    <span>News</span>
                  </NavLink>
                  <button
                    onClick={() => {
                      logout();
                      setMobileOpen(false);
                    }}
                    className="ent-nav-link text-rose-500 mt-2"
                  >
                    <HiOutlineLogout className="text-xl" />
                    <span>Sign Out</span>
                  </button>
                </>
              ) : (
                <>
                  <NavLink
                    to="/"
                    onClick={() => setMobileOpen(false)}
                    className="ent-nav-link"
                  >
                    <HiOutlineHome className="text-xl" />
                    <span>Home</span>
                  </NavLink>
                  <NavLink
                    to="/login"
                    onClick={() => setMobileOpen(false)}
                    className="btn-ent-primary mt-2 flex items-center justify-center gap-2"
                  >
                    <HiOutlineLogin />
                    <span>Sign In</span>
                  </NavLink>
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Header Spacer for Mobile */}
      <div className="lg:hidden h-14" />
    </>
  );
};

export default Navbar;
