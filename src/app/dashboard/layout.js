'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { getCurrentUser, logout } from '@/services/authService';
import Button from '@/components/ui/Button';
import styles from './DashboardLayout.module.css';

export default function DashboardLayout({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        const res = await getCurrentUser();
        if (res.success) {
          setUser(res.data);
        } else {
          console.warn('⚠️ Не вдалося отримати користувача:', res.reason);
          // Якщо користувача немає — перенаправляємо на логін
          router.push('/auth/login');
        }
      } catch (error) {
        console.error('❌ Помилка при отриманні користувача:', error);
        router.push('/auth/login');
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [router]);

  const handleLogout = async () => {
    const res = await logout();
    if (res.success) {
      // localStorage автоматично очищається в logout функції
      router.push('/auth/login');
    } else {
      console.error('❌ Помилка при виході:', res.reason);
    }
  };

  const navigation = [
    { name: 'Збори', href: '/dashboard/collections', icon: '📊' },
    { name: 'Звіти', href: '/dashboard/reports', icon: '📈' },
    { name: 'Користувачі', href: '/dashboard/users', icon: '👥' },
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
