import React, { createContext, useContext, useState, useEffect } from 'react';
import { STORAGE_KEYS } from '../constants/storage';

const ThemeContext = createContext();

const getInitialTheme = () => {
  const savedTheme = window.localStorage.getItem(STORAGE_KEYS.theme)
    || window.localStorage.getItem(STORAGE_KEYS.legacyTheme);
  if (savedTheme === 'light' || savedTheme === 'dark') return savedTheme;

  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
};

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(getInitialTheme);

  useEffect(() => {
    const root = window.document.documentElement;
    const themeColor = window.document.querySelector('meta[name="theme-color"]');

    root.classList.remove('light', 'dark');
    root.classList.add(theme);
    root.dataset.theme = theme;
    root.style.colorScheme = theme;
    window.localStorage.setItem(STORAGE_KEYS.theme, theme);
    window.localStorage.removeItem(STORAGE_KEYS.legacyTheme);
    themeColor?.setAttribute('content', theme === 'dark' ? '#0d1117' : '#f5f7fa');
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
