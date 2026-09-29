import React, { createContext, useCallback, useContext, useEffect, useState } from "react";
import authService from "../services/authService";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const clearAuthState = useCallback(() => {
    setUser(null);
  }, []);

  useEffect(() => {
    // Check if user is logged in on mount
    const checkAuth = async () => {
      if (authService.isAuthenticated()) {
        const userData = authService.getUser();
        setUser(userData);

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
    window.addEventListener('cryptonest:auth-expired', clearAuthState);
    checkAuth();

    return () => window.removeEventListener('cryptonest:auth-expired', clearAuthState);
  }, [clearAuthState]);

  const login = async (email, password) => {
    const response = await authService.login(email, password);
    if (response.success) {
      authService.setUser(response.data);
      const userData = authService.getUser();
      setUser(userData);
    }
    return response;
  };

  const signup = async (userData) => {
    const response = await authService.signup(userData);
    if (response.success) {
      authService.setUser(response.data);
      const userData = authService.getUser();
      setUser(userData);
    }
    return response;
  };

  const logout = () => {
    authService.logout();
    clearAuthState();
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

  const value = {
    user,
    isAuthenticated: Boolean(user),
    loading,
    login,
    signup,
    logout,
    updateUser,
  };

  return (
    <AuthContext.Provider
      value={value}
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
