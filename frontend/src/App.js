import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AuthProvider } from './features/auth/context/AuthContext';
import Login from './features/auth/pages/Login';
import Signup from './features/auth/pages/Signup';
import Home from './features/home/pages/Home';
import CoinDetail from './features/market/pages/CoinDetail';
import Market from './features/market/pages/Market';
import News from './features/news/pages/News';
import CoinSell from './features/portfolio/pages/CoinSell';
import Dashboard from './features/portfolio/pages/Dashboard';
import History from './features/portfolio/pages/History';
import Holdings from './features/portfolio/pages/Holdings';
import Intelligence from './features/profile/pages/Intelligence';
import Profile from './features/profile/pages/Profile';
import { WatchlistProvider } from './features/watchlist/context/WatchlistContext';
import Watchlist from './features/watchlist/pages/Watchlist';
import About from './features/legal/pages/About';
import Privacy from './features/legal/pages/Privacy';
import Terms from './features/legal/pages/Terms';
import AppLayout from './app/layout/AppLayout';
import { ThemeProvider, useTheme } from './shared/context/ThemeContext';
import { ROUTES, ROUTE_PATTERNS } from './shared/constants/routes';
import ProtectedRoute from './shared/routing/ProtectedRoute';

const AppContent = () => {
  const { theme } = useTheme();

  return (
    <WatchlistProvider>
      <Router>
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          theme={theme}
          toastStyle={{
            backgroundColor: 'var(--bg-elevated)',
            border: '1px solid var(--border-base)',
            borderRadius: 'var(--radius-card)',
            color: 'var(--text-primary)',
            boxShadow: 'var(--shadow-raised)',
          }}
        />
        <Routes>
          {/* Public pages */}
          <Route path={ROUTES.home} element={<Home />} />
          <Route path={ROUTES.login} element={<Login />} />
          <Route path={ROUTES.signup} element={<Signup />} />
          <Route path={ROUTES.about} element={<About />} />
          <Route path={ROUTES.privacy} element={<Privacy />} />
          <Route path={ROUTES.terms} element={<Terms />} />

          {/* Protected App pages */}
          <Route element={<ProtectedRoute />}>
            <Route element={<AppLayout />}>
              <Route path={ROUTES.dashboard} element={<Dashboard />} />
              <Route path={ROUTES.market} element={<Market />} />
              <Route path={ROUTE_PATTERNS.coin} element={<CoinDetail />} />
              <Route path={ROUTE_PATTERNS.sell} element={<CoinSell />} />
              <Route path={ROUTES.holdings} element={<Holdings />} />
              <Route path={ROUTES.news} element={<News />} />
              <Route path={ROUTES.watchlist} element={<Watchlist />} />
              <Route path={ROUTES.history} element={<History />} />
              <Route path={ROUTES.profile} element={<Profile />} />
              <Route path={ROUTES.intelligence} element={<Intelligence />} />
            </Route>
          </Route>

          {/* Catch all redirect */}
          <Route path="*" element={<Navigate to={ROUTES.home} replace />} />
        </Routes>
      </Router>
    </WatchlistProvider>
  );
};

function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <AppContent />
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;
