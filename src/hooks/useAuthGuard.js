import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';

export const useAuthGuard = (requiredRole = null) => {
  const { user, loading } = useAuth();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    if (loading) {
      setIsChecking(true);
      return;
    }

    if (!user) {
      setIsAuthorized(false);
      setIsChecking(false);
      return;
    }

    if (requiredRole && user.role !== requiredRole) {
      setIsAuthorized(false);
      setIsChecking(false);
      return;
    }

    setIsAuthorized(true);
    setIsChecking(false);
  }, [user, loading, requiredRole]);

  return {
    isAuthorized,
    isChecking,
    user,
  };
};
