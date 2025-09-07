'use client';

import React, { useEffect, useState } from 'react';
import { useAuthGuard } from '@/hooks/useAuthGuard';
import { fetchUsers } from '@/services/userService';
import UserProfile from './UserProfile';

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

        const usersResponse = await fetchUsers();
        setUsers(usersResponse.data);
      } catch (err) {
        setError(`Помилка: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    if (!isChecking) {
      fetchData();
    }
  }, [isAuthorized, isChecking, user]);

  const handleSelect = user => {
    setSelectedUser(user);
  };

  if (isChecking || loading) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Користувачі</h1>
        <p>Завантаження...</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Користувачі</h1>
      {error && <p className="text-red-500">{error}</p>}

      {users.length === 0 && !error && (
        <p className="text-gray-500">Немає користувачів для відображення</p>
      )}

      <ul className="space-y-2">
        {users.map(user => (
          <li
            key={user._id}
            className="border p-4 rounded-md hover:bg-gray-50 cursor-pointer"
            onClick={() => handleSelect(user)}
          >
            <p>
              <strong>Ім&apos;я:</strong> {user.name || 'Без імені'}
            </p>
            <p>
              <strong>Email:</strong> {user.email}
            </p>
            <p>
              <strong>Роль:</strong> {user.role === 'admin' ? 'Адміністратор' : 'Редактор'}
            </p>
          </li>
        ))}
      </ul>

      {selectedUser && (
        <div className="mt-6">
          <h2 className="text-xl font-semibold mb-2">Профіль користувача</h2>
          <UserProfile user={selectedUser} isEditable={true} />
        </div>
      )}
    </div>
  );
};

export default UserList;
