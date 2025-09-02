'use client';

import React from 'react';
import Button from '../ui/Button';
import styles from './Header.module.css';

const Header = () => {
  // TODO: замінити на реальні дані користувача
  const user = {
    name: 'Адміністратор',
    email: 'admin@inharmony.org',
    role: 'Admin',
  };

  const handleLogout = () => {
    // TODO: реалізувати логаут
    console.log('Logout clicked');
  };

  return (
    <header className={styles.header}>
      <div className={styles.left}>
        <h1 className={styles.title}>Панель управління</h1>
      </div>

      <div className={styles.right}>
        <div className={styles.userInfo}>
          <span className={styles.userName}>{user.name}</span>
          <span className={styles.userRole}>{user.role}</span>
        </div>

        <Button variant="outline" size="small" onClick={handleLogout}>
          Вийти
        </Button>
      </div>
    </header>
  );
};

export default Header;
