'use client';

import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import Button from '@/components/ui/Button';
import styles from './DashboardLayout.module.css';

export default function DashboardLayout({ children }) {
  const { user, loading, logout, isAdmin } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = async () => {
    await logout();
  };

  const navigation = [
    { name: 'Збори', href: '/dashboard/collections', icon: '📊' },
    { name: 'Звіти', href: '/dashboard/reports', icon: '📈' },
    ...(isAdmin ? [{ name: 'Користувачі', href: '/dashboard/users', icon: '👥' }] : []),
    { name: 'Профіль', href: '/dashboard/users/profile', icon: '👤' },
    { name: 'Налаштування', href: '/dashboard/settings', icon: '⚙️' },
  ];

  // Показуємо loading поки завантажується користувач
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

  // Якщо користувача немає після завантаження, показуємо повідомлення
  if (!user) {
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
          <h2>InHarmony</h2>
        </div>
        <nav className={styles.nav}>
          {navigation.map(item => {
            const isActive = pathname.startsWith(item.href);
            return (
              <a
                key={item.name}
                href={item.href}
                className={`${styles.navItem} ${isActive ? styles.active : ''}`}
              >
                <span className={styles.icon}>{item.icon}</span>
                <span className={styles.name}>{item.name}</span>
              </a>
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
            <Button variant="outline" size="small" onClick={handleLogout}>
              Вийти
            </Button>
          </div>
        </header>
        <main className={styles.main}>{children}</main>
      </div>
    </div>
  );
}
