import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { WatchlistProvider } from './context/WatchlistContext';
import Sidebar from './Components/Sidebar';
import Navbar from './Components/Navbar';
import Home from './Pages/Home';
import Login from './Pages/Login';
import Signup from './Pages/Signup';
import Dashboard from './Pages/Dashboard';
import Market from './Pages/Market';
import CoinDetail from './Pages/CoinDetail';
import CoinSell from './Pages/CoinSell';
import Holdings from './Pages/Holdings';
import News from './Pages/News';
import Watchlist from './Pages/Watchlist';
import History from './Pages/History';
import Profile from './Pages/Profile';
import Intelligence from './Pages/Intelligence';
import About from './Pages/About';
import Privacy from './Pages/Privacy';
import Terms from './Pages/Terms';

// Layout with sidebar for authenticated pages
const AppLayout = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-primary dark:bg-dark-950 flex items-center justify-center">
        <div className="w-12 h-12 rounded-full border-4 border-dark-300 dark:border-dark-600 border-t-primary-500 animate-spin"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return (
    <div className="min-h-screen bg-primary dark:bg-dark-950 bg-gradient-bubble transition-colors duration-300">
      <Sidebar />
      <Navbar />
      <div className="lg:ml-64 transition-all duration-300">
        {children}
      </div>
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <WatchlistProvider>
          <Router>
            <ToastContainer
              position="top-right"
              autoClose={3000}
              hideProgressBar={false}
              theme="dark"
              toastStyle={{
                backgroundColor: '#1e2235',
                border: '1px solid rgba(100, 116, 139, 0.2)',
                borderRadius: '16px',
              }}
            />
            <Routes>
              {/* Public pages */}
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/about" element={<About />} />
              <Route path="/privacy" element={<Privacy />} />
              <Route path="/terms" element={<Terms />} />

              {/* Protected App pages */}
              <Route path="/dashboard" element={<AppLayout><Dashboard /></AppLayout>} />
              <Route path="/market" element={<AppLayout><Market /></AppLayout>} />
              <Route path="/coin/:coinId" element={<AppLayout><CoinDetail /></AppLayout>} />
              <Route path="/dashboard/sell/:coinId" element={<AppLayout><CoinSell /></AppLayout>} />
              <Route path="/holdings" element={<AppLayout><Holdings /></AppLayout>} />
              <Route path="/news" element={<AppLayout><News /></AppLayout>} />
              <Route path="/watchlist" element={<AppLayout><Watchlist /></AppLayout>} />
              <Route path="/history" element={<AppLayout><History /></AppLayout>} />
              <Route path="/profile" element={<AppLayout><Profile /></AppLayout>} />
              <Route path="/intelligence" element={<AppLayout><Intelligence /></AppLayout>} />
              
              {/* Catch all redirect */}
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </Router>
        </WatchlistProvider>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;
