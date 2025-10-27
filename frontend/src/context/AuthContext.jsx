import { createContext, useState, useContext, useEffect } from "react";
import { authService } from "../api/authService";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const userData = await authService.getProfile();
      setUser(userData);
    } catch (error) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (credentials) => {
    const data = await authService.login(credentials);
    if (data.success) {
      setUser(data.user);
    }
    return data;
  };

  const signup = async (userData) => {
    const data = await authService.signup(userData);
    if (data.success) {
      setUser(data.user);
    }
    return data;
  };

  const logout = async () => {
    await authService.logout();
    setUser(null);
  };

  const value = {
    user,
    login,
    signup,
    logout,
    loading,
    checkAuth,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};
