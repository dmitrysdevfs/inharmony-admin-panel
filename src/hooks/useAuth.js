// hooks/useAuth.js
import { useState, useEffect, useCallback } from 'react';
import { login, logout, getCurrentUser } from '@/services/authService';

export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  // Ініціалізація при завантаженні
  useEffect(() => {
    const result = getCurrentUser();
    if (result.success && result.data) {
      setUser(result.data);
      setIsAuthenticated(true);
    } else {
      setUser(null);
      setIsAuthenticated(false);
    }
    setLoading(false);
  }, []);

  // 🔑 Логін
  const handleLogin = useCallback(async (email, password) => {
    const result = await login(email, password);
    if (result.success) {
      setUser(result.data);
      setIsAuthenticated(true);
    }
    return result;
  }, []);

  // 🚪 Логаут
  const handleLogout = useCallback(async () => {
    const result = await logout();
    if (result.success) {
      setUser(null);
      setIsAuthenticated(false);
    }
    return result;
  }, []);

  return {
    user,
    isAuthenticated,
    loading,
    login: handleLogin,
    logout: handleLogout,
  };
};
