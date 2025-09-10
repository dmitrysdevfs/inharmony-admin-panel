'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { updateUser, fetchCurrentUser, fetchUserById } from '@/services/userService';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { cn } from '@/lib/utils';
import styles from './UserProfile.module.css';
import { ArrowLeftIcon, PencilIcon, CheckIcon, XIcon } from '@heroicons/react/outline';

const UserProfile = ({ userId = null, user: propUser = null, isEditable = false }) => {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'editor',
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError('');

        // If user is passed as prop, use it directly
        if (propUser) {
          setUser(propUser);
          setFormData({
            name: propUser.name || '',
            email: propUser.email || '',
            role: propUser.role || 'editor',
          });
          setLoading(false);
          return;
        }

        // Get current user to check permissions
        const currentUserResponse = await fetchCurrentUser();
        const currentUserData = currentUserResponse.data;
        setCurrentUser(currentUserData);

        // If userId is provided, we're editing another user (admin only)
        // Otherwise, we're viewing/editing current user's profile
        let userData;
        if (userId && currentUserData.role === 'admin') {
          // Fetch the specific user by ID
          const userResponse = await fetchUserById(userId);
          userData = userResponse.data;
        } else {
          userData = currentUserData;
        }

        if (userData) {
          setUser(userData);
          setFormData({
            name: userData.name || '',
            email: userData.email || '',
            role: userData.role || 'editor',
          });
        }
      } catch (error) {
        setError('Помилка завантаження профілю користувача');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [userId, propUser, router]);

  const handleInputChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setError('');

      const targetUserId = userId || user?._id;
      if (!targetUserId) {
        setError('ID користувача не знайдено');
        return;
      }

      const response = await updateUser(targetUserId, formData);
      if (response.data) {
        setUser(response.data);
        setEditing(false);
      }
    } catch (error) {
      setError('Помилка збереження профілю');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      name: user?.name || '',
      email: user?.email || '',
      role: user?.role || 'editor',
    });
    setEditing(false);
    setError('');
  };

  const canEdit = () => {
    if (!user) return false;

    // If isEditable prop is passed, use it
    if (isEditable !== undefined) return isEditable;

    if (!currentUser) return false;

    // Admin can edit anyone
    if (currentUser.role === 'admin') return true;

    // User can edit their own profile
    return currentUser._id === user._id;
  };

  const canChangeRole = () => {
    return currentUser?.role === 'admin' && userId; // Only admin can change roles, and only for other users
  };

  if (loading) {
    return <div className={styles.loading}>Завантаження...</div>;
  }

  if (error && !user) {
    return <div className={styles.error}>{error}</div>;
  }

  if (!user) {
    return <div className={styles.error}>Користувач не знайдено</div>;
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <Button variant="outline" onClick={() => router.back()} className={styles.backButton}>
          <ArrowLeftIcon className={styles.icon} />
          Назад
        </Button>

        <h2>Профіль користувача</h2>

        {canEdit() && !editing && (
          <Button
            variant="secondary"
            onClick={() => setEditing(true)}
            className={styles.editButton}
          >
            <PencilIcon className={styles.icon} />
            Редагувати
          </Button>
        )}
      </div>

      {error && <div className={styles.errorMessage}>{error}</div>}

      <div className={styles.profileCard}>
        <div className={styles.field}>
          <label className={styles.label}>Ім&apos;я</label>
          {editing ? (
            <Input
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Введіть ім'я"
              className={styles.input}
            />
          ) : (
            <div className={styles.value}>{user.name || 'Не вказано'}</div>
          )}
        </div>

        <div className={styles.field}>
          <label className={styles.label}>Email</label>
          {editing ? (
            <Input
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="Введіть email"
              className={styles.input}
            />
          ) : (
            <div className={styles.value}>{user.email}</div>
          )}
        </div>

        <div className={styles.field}>
          <label className={styles.label}>Роль</label>
          {editing && canChangeRole() ? (
            <select
              name="role"
              value={formData.role}
              onChange={handleInputChange}
              className={styles.select}
            >
              <option value="editor">Редактор</option>
              <option value="admin">Адміністратор</option>
            </select>
          ) : (
            <div className={styles.value}>
              <span className={cn(styles.role, styles[user.role])}>
                {user.role === 'admin' ? 'Адміністратор' : 'Редактор'}
              </span>
            </div>
          )}
        </div>

        {editing && (
          <div className={styles.actions}>
            <Button
              variant="primary"
              onClick={handleSave}
              disabled={saving}
              className={styles.saveButton}
            >
              <CheckIcon className={styles.icon} />
              {saving ? 'Збереження...' : 'Зберегти'}
            </Button>

            <Button
              variant="outline"
              onClick={handleCancel}
              disabled={saving}
              className={styles.cancelButton}
            >
              <XIcon className={styles.icon} />
              Скасувати
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserProfile;
