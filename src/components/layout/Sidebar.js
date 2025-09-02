'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '../../lib/utils';
import styles from './Sidebar.module.css';

const Sidebar = () => {
  const pathname = usePathname();

  const navigation = [
    {
      name: 'Збори',
      href: '/collections',
      icon: '📊',
    },
    {
      name: 'Звіти',
      href: '/reports',
      icon: '📈',
    },
    {
      name: 'Користувачі',
      href: '/users',
      icon: '👥',
    },
    {
      name: 'Налаштування',
      href: '/settings',
      icon: '⚙️',
    },
  ];

  return (
    <aside className={styles.sidebar}>
      <div className={styles.logo}>
        <h2>InHarmony</h2>
      </div>

      <nav className={styles.nav}>
        {navigation.map(item => {
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(styles.navItem, isActive && styles.active)}
            >
              <span className={styles.icon}>{item.icon}</span>
              <span className={styles.name}>{item.name}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
};

export default Sidebar;
