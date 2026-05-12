import React, { createContext, useContext, useState, useEffect } from "react";
import authService from "../services/authService";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in on mount
    const checkAuth = async () => {
      // Cleanup legacy bad data
      if (localStorage.getItem('first_name') === 'undefined') localStorage.removeItem('first_name');
      if (localStorage.getItem('last_name') === 'undefined') localStorage.removeItem('last_name');
      if (localStorage.getItem('firstName') === 'undefined') localStorage.removeItem('firstName');
      if (localStorage.getItem('lastName') === 'undefined') localStorage.removeItem('lastName');

      if (authService.isAuthenticated()) {
        const userData = authService.getUser();
        setUser(userData);
        setToken(userData.token);
        setIsAuthenticated(true);

        try {
          // Fetch fresh profile data to ensure we have the name and latest info
          const response = await authService.getProfile();
          if (response.success) {
            authService.setUser(response.data);
            const freshUser = authService.getUser();
            setUser(freshUser);
          }
        } catch (error) {
          console.error("Failed to fetch profile:", error);
        }
      }
      setLoading(false);
    };
    checkAuth();
  }, []);

  const login = async (email, password) => {
    const response = await authService.login(email, password);
    if (response.success) {
      authService.setUser(response.data);
      const userData = authService.getUser();
      setUser(userData);
      setToken(userData.token);
      setIsAuthenticated(true);
    }
    return response;
  };

  const signup = async (userData) => {
    const response = await authService.signup(userData);
    if (response.success) {
      authService.setUser(response.data);
      const userData = authService.getUser();
      setUser(userData);
      setToken(userData.token);
      setIsAuthenticated(true);
    }
    return response;
  };

  const logout = () => {
    authService.logout();
    setUser(null);
    setToken(null);
    setIsAuthenticated(false);
  };

  const updateUser = (newData) => {
    // Normalize field names to ensure camelCase is used in state
    const normalizedData = { ...newData };
    if (newData.first_name) normalizedData.firstName = newData.first_name;
    if (newData.last_name) normalizedData.lastName = newData.last_name;
    
    const updatedUser = { ...user, ...normalizedData };
    setUser(updatedUser);
    authService.setUser(updatedUser);
  };

  return (
    <AuthContext.Provider
      value={{ user, token, isAuthenticated, loading, login, signup, logout, updateUser }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export default AuthContext;
