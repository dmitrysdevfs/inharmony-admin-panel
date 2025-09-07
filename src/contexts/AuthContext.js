'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { fetchCurrentUser } from '@/services/userService';
import { logout as logoutService } from '@/services/authService';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Check if user is authenticated on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        setLoading(true);
        const response = await fetchCurrentUser();
        setUser(response.data);
      } catch (error) {
        setUser(null);

        // Clear invalid cookies
        if (typeof document !== 'undefined') {
          document.cookie = 'accessToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
          document.cookie = 'refreshToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
        }
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async credentials => {
    try {
      setLoading(true);
      // Import login service dynamically to avoid circular dependency
      const { login: loginService } = await import('@/services/authService');
      await loginService(credentials);

      // Fetch user data after successful login
      const userResponse = await fetchCurrentUser();
      setUser(userResponse.data);
      return { success: true };
    } catch (error) {
      setUser(null);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await logoutService();
      setUser(null);
      router.push('/auth/login');
    } catch (error) {
      // Even if logout service fails, clear user state and redirect
      setUser(null);
      router.push('/auth/login');
    }
  };

  const value = {
    user,
    loading,
    login,
    logout,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin',
    isEditor: user?.role === 'editor',
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
