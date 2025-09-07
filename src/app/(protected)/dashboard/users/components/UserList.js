'use client';

import React, { useEffect, useState } from 'react';
import { useAuthGuard } from '@/hooks/useAuthGuard';
import { fetchUsers } from '@/services/userService';
import UserProfile from './UserProfile';
import styles from './UserList.module.css';

const UserList = () => {
  const { isAuthorized, isChecking, user } = useAuthGuard('admin');
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError('');

        if (!isAuthorized) {
          setError('У вас немає доступу до списку користувачів.');
          setLoading(false);
          return;
        }

        const usersArray = await fetchUsers();
        setUsers(usersArray);
      } catch (err) {
        setError(`Помилка: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    if (!isChecking && isAuthorized) {
      fetchData();
    }
  }, [isChecking, isAuthorized]);

  const handleSelect = user => {
    setSelectedUser(user);
  };

  if (isChecking || loading) {
    return (
      <div className={styles.container}>
        <div className={styles.header}>
          <h2>Користувачі</h2>
        </div>
        <div className={styles.loading}>Завантаження...</div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2>Користувачі</h2>
      </div>

      {error && <div className={styles.error}>{error}</div>}

      {users.length > 0 ? (
        <ul className={styles.userList}>
          {users.map((user, index) => (
            <li
              key={user._id || index}
              className={styles.userItem}
              onClick={() => handleSelect(user)}
            >
              <div className={styles.userInfo}>
                <p className={styles.nameCell}>
                  <strong>Ім&apos;я:</strong> {user.name || 'Без імені'}
                </p>
                <p className={styles.emailCell}>
                  <strong>Email:</strong> {user.email || 'Без email'}
                </p>
                <p>
                  <strong>Роль:</strong>
                  <span className={`${styles.role} ${styles[user.role]}`}>
                    {user.role === 'admin' ? 'Адміністратор' : 'Редактор'}
                  </span>
                </p>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <div className={styles.emptyState}>Немає користувачів для відображення</div>
      )}

      {selectedUser && (
        <div className={styles.selectedUser}>
          <h3>Профіль користувача</h3>
          <UserProfile user={selectedUser} isEditable={true} />
        </div>
      )}
    </div>
  );
};

export default UserList;
