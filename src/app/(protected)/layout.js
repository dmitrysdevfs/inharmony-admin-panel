'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function ProtectedLayout({ children }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Only redirect if we're sure the user is not authenticated
    // Add a small delay to prevent race conditions during navigation
    if (!loading && !user) {
      const timer = setTimeout(() => {
        router.push('/auth/login');
      }, 100);

      return () => clearTimeout(timer);
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
          fontSize: '18px',
        }}
      >
        Завантаження...
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect to login
  }

  return children;
}
