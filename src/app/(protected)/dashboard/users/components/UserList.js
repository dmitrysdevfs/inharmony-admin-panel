'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { fetchUsers, deleteUser, updateUser } from '@/services/userService';
import Table from '@/components/ui/Table';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import {
  PencilIcon,
  TrashIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  PlusIcon,
  CheckIcon,
  XIcon,
  EyeIcon,
  EyeOffIcon,
} from '@heroicons/react/outline';
import { cn } from '@/lib/utils';
import styles from './UserList.module.css';

const UserList = () => {
  const router = useRouter();
  const { user, loading: authLoading, isAdmin } = useAuth();
  const [users, setUsers] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [editingUser, setEditingUser] = useState(null);
  const [editFormData, setEditFormData] = useState({});
  const [saving, setSaving] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 6,
    total: 0,
  });
  const [sortConfig, setSortConfig] = useState({
    key: 'name',
    direction: 'asc',
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError('');

        if (authLoading) {
          return;
        }

        if (!isAdmin) {
          setError('У вас немає доступу до списку користувачів.');
          setLoading(false);
          return;
        }

        const usersArray = await fetchUsers();
        setUsers(usersArray);
        setPagination(prev => ({
          ...prev,
          total: usersArray.length,
        }));
      } catch (err) {
        setError(`Помилка: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    if (!authLoading && isAdmin) {
      fetchData();
    }
  }, [authLoading, isAdmin]);

  const handleSort = key => {
    setSortConfig(prevConfig => {
      if (prevConfig.key === key) {
        return {
          key,
          direction: prevConfig.direction === 'asc' ? 'desc' : 'asc',
        };
      }
      return { key, direction: 'asc' };
    });
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const sortUsers = users => {
    if (!sortConfig.key) return users;

    return [...users].sort((a, b) => {
      const aValue = a[sortConfig.key] || '';
      const bValue = b[sortConfig.key] || '';

      if (aValue < bValue) {
        return sortConfig.direction === 'asc' ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortConfig.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });
  };

  const getCurrentPageUsers = () => {
    const sortedUsers = sortUsers(users);
    const startIndex = (pagination.page - 1) * pagination.limit;
    const endIndex = startIndex + pagination.limit;
    return sortedUsers.slice(startIndex, endIndex);
  };

  const handleRowClick = user => {
    if (editingUser && editingUser._id === user._id) {
      return; // Don't navigate if editing this user
    }
    setEditingUser(user);
    setEditFormData({
      name: user.name || '',
      email: user.email || '',
      role: user.role || 'editor',
      password: '********',
    });
  };

  const handleCreateNew = () => {
    router.push('/dashboard/users/create');
  };

  const handleEdit = (e, user) => {
    e.stopPropagation();
    setEditingUser(user);
    setEditFormData({
      name: user.name || '',
      email: user.email || '',
      role: user.role || 'editor',
      password: '********',
    });
  };

  const handleSave = async (e, user) => {
    e.stopPropagation();
    try {
      setSaving(true);
      setError('');

      const updateData = {
        name: editFormData.name,
        email: editFormData.email,
        role: editFormData.role,
      };

      // Only include password if it's not the default asterisks
      if (editFormData.password && editFormData.password !== '********') {
        updateData.password = editFormData.password;
      }

      const response = await updateUser(user._id, updateData);

      if (response.data) {
        setUsers(prev => prev.map(u => (u._id === user._id ? { ...u, ...response.data } : u)));
        setEditingUser(null);
        setEditFormData({});
        setShowPassword(false);
      } else if (response) {
        setUsers(prev => prev.map(u => (u._id === user._id ? { ...u, ...response } : u)));
        setEditingUser(null);
        setEditFormData({});
        setShowPassword(false);
      } else {
        setError('Не вдалося зберегти зміни');
      }
    } catch (err) {
      setError(`Помилка збереження: ${err.message}`);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = (e, user) => {
    e.stopPropagation();
    setEditingUser(null);
    setEditFormData({});
    setShowPassword(false);
  };

  const handleInputChange = (field, value) => {
    setEditFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const togglePasswordVisibility = () => {
    setShowPassword(prev => !prev);
  };

  const handleDelete = async (e, user) => {
    e.stopPropagation();

    if (!confirm(`Ви впевнені, що хочете видалити користувача "${user.name}"?`)) {
      return;
    }

    try {
      await deleteUser(user._id);
      setUsers(prev => prev.filter(u => u._id !== user._id));
      setPagination(prev => ({
        ...prev,
        total: prev.total - 1,
      }));
    } catch (err) {
      setError(`Помилка видалення: ${err.message}`);
    }
  };

  const columns = [
    {
      key: 'name',
      label: "Ім'я",
      sortable: true,
      render: (value, user) => {
        if (editingUser && editingUser._id === user._id) {
          return (
            <Input
              type="text"
              value={editFormData.name}
              onChange={e => handleInputChange('name', e.target.value)}
              className={styles.inlineInput}
            />
          );
        }
        return <span className={styles.nameCell}>{value || 'Без імені'}</span>;
      },
    },
    {
      key: 'email',
      label: 'Email',
      sortable: true,
      render: (value, user) => {
        if (editingUser && editingUser._id === user._id) {
          return (
            <Input
              type="email"
              value={editFormData.email}
              onChange={e => handleInputChange('email', e.target.value)}
              className={styles.inlineInput}
            />
          );
        }
        return <span className={styles.emailCell}>{value || 'Без email'}</span>;
      },
    },
    {
      key: 'password',
      label: 'Пароль',
      sortable: false,
      render: (value, user) => {
        if (editingUser && editingUser._id === user._id) {
          return (
            <div className={styles.passwordInputContainer}>
              <Input
                type={showPassword ? 'text' : 'password'}
                value={editFormData.password}
                onChange={e => handleInputChange('password', e.target.value)}
                className={styles.inlineInput}
                placeholder="********"
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className={styles.passwordToggle}
                title={showPassword ? 'Приховати пароль' : 'Показати пароль'}
              >
                {showPassword ? (
                  <EyeOffIcon className={styles.eyeIcon} />
                ) : (
                  <EyeIcon className={styles.eyeIcon} />
                )}
              </button>
            </div>
          );
        }
        return <span className={styles.passwordCell}>********</span>;
      },
    },
    {
      key: 'role',
      label: 'Роль',
      sortable: true,
      render: (value, user) => {
        if (editingUser && editingUser._id === user._id) {
          return (
            <select
              value={editFormData.role}
              onChange={e => handleInputChange('role', e.target.value)}
              className={styles.inlineSelect}
            >
              <option value="editor">Редактор</option>
              <option value="admin">Адміністратор</option>
            </select>
          );
        }
        return (
          <span className={`${styles.role} ${styles[value]}`}>
            {value === 'admin' ? 'Адміністратор' : 'Редактор'}
          </span>
        );
      },
    },
    {
      key: 'actions',
      label: 'Дії',
      sortable: false,
      render: (value, user) => {
        if (editingUser && editingUser._id === user._id) {
          return (
            <div className={styles.actions}>
              <Button
                size="small"
                variant="primary"
                onClick={e => handleSave(e, user)}
                disabled={saving}
                className={styles.iconButton}
              >
                <CheckIcon className={styles.icon} />
              </Button>
              <Button
                size="small"
                variant="secondary"
                onClick={e => handleCancel(e, user)}
                disabled={saving}
                className={styles.iconButton}
              >
                <XIcon className={styles.icon} />
              </Button>
            </div>
          );
        }
        return (
          <div className={styles.actions}>
            <Button
              size="small"
              variant="secondary"
              onClick={e => handleEdit(e, user)}
              className={styles.iconButton}
            >
              <PencilIcon className={styles.icon} />
            </Button>
            <Button
              size="small"
              variant="danger"
              onClick={e => handleDelete(e, user)}
              className={styles.iconButton}
            >
              <TrashIcon className={styles.icon} />
            </Button>
          </div>
        );
      },
    },
  ];

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.header}>
          <div className={styles.headerLeft}>
            <h2>Користувачі</h2>
          </div>
        </div>
        <div className={styles.loading}>Завантаження...</div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className={styles.container}>
        <div className={styles.header}>
          <div className={styles.headerLeft}>
            <h2>Користувачі</h2>
          </div>
        </div>
        <div className={styles.error}>У вас немає доступу до списку користувачів.</div>
      </div>
    );
  }

  return (
    <div>
      <div className={styles.container}>
        <div className={styles.header}>
          <div className={styles.headerLeft}>
            <h2>Користувачі</h2>
          </div>
          <button className={styles.creationBtn} onClick={handleCreateNew}>
            Створити користувача
          </button>
        </div>

        {error && <div className={styles.error}>{error}</div>}

        <Table
          columns={columns}
          data={getCurrentPageUsers()}
          onSort={handleSort}
          sortConfig={sortConfig}
          onRowClick={handleRowClick}
          className={styles.usersTable}
        />

        {users.length === 0 && !loading && (
          <div className={styles.emptyState}>Немає користувачів для відображення</div>
        )}
      </div>
      {Math.ceil(users.length / pagination.limit) > 1 && (
        <div className={styles.pagination}>
          <button
            className={cn(styles.paginationButton, { [styles.disabled]: pagination.page === 1 })}
            disabled={pagination.page === 1}
            onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
          >
            <ChevronLeftIcon className={styles.paginationIcon} />
            Попередня
          </button>

          <span className={styles.paginationInfo}>
            Сторінка {pagination.page} з {Math.ceil(users.length / pagination.limit)}
          </span>

          <button
            className={cn(styles.paginationButton, {
              [styles.disabled]: pagination.page >= Math.ceil(users.length / pagination.limit),
            })}
            disabled={pagination.page >= Math.ceil(users.length / pagination.limit)}
            onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
          >
            Наступна
            <ChevronRightIcon className={styles.paginationIcon} />
          </button>
        </div>
      )}
    </div>
  );
};

export default UserList;
