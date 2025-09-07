'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { createUser } from '@/services/userService';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import styles from './UserForm.module.css';
import { ArrowLeftIcon, PlusIcon } from '@heroicons/react/outline';

const UserForm = () => {
  const router = useRouter();
  const { user: currentUser, isAdmin } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'editor',
  });
  const [validationErrors, setValidationErrors] = useState({});

  useEffect(() => {
    if (!isAdmin) {
      router.push('/dashboard/users');
      return;
    }
    setLoading(false);
  }, [isAdmin, router]);

  const handleInputChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));

    // Clear validation error for this field
    if (validationErrors[name]) {
      setValidationErrors(prev => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const validateForm = () => {
    const errors = {};

    if (!formData.name.trim()) {
      errors.name = 'Ім&apos;я обов&apos;язкове';
    } else if (formData.name.trim().length > 100) {
      errors.name = 'Ім&apos;я не може перевищувати 100 символів';
    }

    if (!formData.email.trim()) {
      errors.email = 'Email обов&apos;язковий';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Невірний формат email';
    }

    if (!formData.password) {
      errors.password = 'Пароль обов&apos;язковий';
    } else if (formData.password.length < 6) {
      errors.password = 'Пароль має містити мінімум 6 символів';
    }

    if (!formData.confirmPassword) {
      errors.confirmPassword = 'Підтвердження пароля обов&apos;язкове';
    } else if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Паролі не співпадають';
    }

    if (!['admin', 'editor'].includes(formData.role)) {
      errors.role = 'Невірна роль';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async e => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      setSaving(true);
      setError('');

      const userData = {
        name: formData.name.trim(),
        email: formData.email.trim(),
        password: formData.password,
        role: formData.role,
      };

      const response = await createUser(userData);
      if (response.data) {
        router.push('/dashboard/users');
      }
    } catch (error) {
      setError('Помилка створення користувача');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className={styles.loading}>Завантаження...</div>;
  }

  if (!currentUser || currentUser.role !== 'admin') {
    return <div className={styles.error}>Недостатньо прав для створення користувача</div>;
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <Button variant="outline" onClick={() => router.back()} className={styles.backButton}>
          <ArrowLeftIcon className={styles.icon} />
          Назад
        </Button>

        <h2>Створити користувача</h2>
      </div>

      {error && <div className={styles.errorMessage}>{error}</div>}

      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.field}>
          <label htmlFor="name" className={styles.label}>
            Ім&apos;я *
          </label>
          <Input
            id="name"
            name="name"
            type="text"
            value={formData.name}
            onChange={handleInputChange}
            placeholder="Введіть ім'я користувача"
            className={styles.input}
            error={validationErrors.name}
          />
          {validationErrors.name && (
            <div className={styles.fieldError}>{validationErrors.name}</div>
          )}
        </div>

        <div className={styles.field}>
          <label htmlFor="email" className={styles.label}>
            Email *
          </label>
          <Input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleInputChange}
            placeholder="Введіть email користувача"
            className={styles.input}
            error={validationErrors.email}
          />
          {validationErrors.email && (
            <div className={styles.fieldError}>{validationErrors.email}</div>
          )}
        </div>

        <div className={styles.field}>
          <label htmlFor="password" className={styles.label}>
            Пароль *
          </label>
          <Input
            id="password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleInputChange}
            placeholder="Введіть пароль"
            className={styles.input}
            error={validationErrors.password}
          />
          {validationErrors.password && (
            <div className={styles.fieldError}>{validationErrors.password}</div>
          )}
        </div>

        <div className={styles.field}>
          <label htmlFor="confirmPassword" className={styles.label}>
            Підтвердження пароля *
          </label>
          <Input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            value={formData.confirmPassword}
            onChange={handleInputChange}
            placeholder="Підтвердіть пароль"
            className={styles.input}
            error={validationErrors.confirmPassword}
          />
          {validationErrors.confirmPassword && (
            <div className={styles.fieldError}>{validationErrors.confirmPassword}</div>
          )}
        </div>

        <div className={styles.field}>
          <label htmlFor="role" className={styles.label}>
            Роль *
          </label>
          <select
            id="role"
            name="role"
            value={formData.role}
            onChange={handleInputChange}
            className={styles.select}
          >
            <option value="editor">Редактор</option>
            <option value="admin">Адміністратор</option>
          </select>
          {validationErrors.role && (
            <div className={styles.fieldError}>{validationErrors.role}</div>
          )}
        </div>

        <div className={styles.actions}>
          <Button type="submit" variant="primary" disabled={saving} className={styles.submitButton}>
            <PlusIcon className={styles.icon} />
            {saving ? 'Створення...' : 'Створити користувача'}
          </Button>

          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
            disabled={saving}
            className={styles.cancelButton}
          >
            Скасувати
          </Button>
        </div>
      </form>
    </div>
  );
};

export default UserForm;
