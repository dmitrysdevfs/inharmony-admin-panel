'use client';

import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { useMemo } from 'react';
import Image from 'next/image';
import styles from './DashboardLayout.module.css';

export default function DashboardLayout({ children }) {
  const { user, loading, logout, isAdmin } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = async () => {
    await logout();
  };

  const navigation = useMemo(
    () => [
      { name: 'Збори', href: '/dashboard/collections', icon: '📊' },
      { name: 'Звіти', href: '/dashboard/reports', icon: '📈' },
      ...(isAdmin ? [{ name: 'Користувачі', href: '/dashboard/users', icon: '👥' }] : []),
      { name: 'Профіль', href: '/dashboard/users/profile', icon: '👤' },
      ...(isAdmin ? [{ name: 'Мерч', href: '/dashboard/merch', icon: '🛍️' }] : []),
    ],
    [isAdmin]
  );

  if (loading) {
    return (
      <div className={styles.dashboardContainer}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            width: '100%',
            height: '100vh',
          }}
        >
          <div>Завантаження...</div>
        </div>
      </div>
    );
  }

  if (!user && !loading) {
    return (
      <div className={styles.dashboardContainer}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            width: '100%',
            height: '100vh',
          }}
        >
          <div>Перенаправлення на сторінку входу...</div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.dashboardContainer}>
      {/* Sidebar */}
      <aside className={styles.sidebar}>
        <div className={styles.logo}>
          <Image
            src="/logo.png" 
            alt="InHarmony Logo"
            width={73}
            height={73}
          />
        </div>
        <nav className={styles.nav}>
          {navigation.map(item => {
            const isActive = pathname.startsWith(item.href);
            const isProfilePage = pathname === '/dashboard/users/profile';
            const isUsersItem = item.href === '/dashboard/users';

            return (
              <Link
                key={item.name}
                href={item.href}
                className={`${styles.navItem} ${isActive ? styles.active : ''} ${
                  isActive && isProfilePage && isUsersItem ? styles['profile-active'] : ''
                }`}
              >
                <span className={styles.icon}>{item.icon}</span>
                <span className={styles.name}>{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Main content */}
      <div className={styles.mainContent}>
        <header className={styles.header}>
          <h1>Панель управління</h1>
          <div className={styles.userSection}>
            <div className={styles.userInfo}>
              <span className={styles.userName}>{user.name || 'Користувач'}</span>
              <span className={styles.userRole}>{user.role || 'Роль'}</span>
            </div>
            <button className={styles.logoutBtn} onClick={handleLogout}>
              Вийти
            </button>
          </div>
        </header>
        <main className={styles.main}>{children}</main>
      </div>
    </div>
  );
}
