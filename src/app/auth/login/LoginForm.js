'use client';

import styles from './LoginForm.module.css';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

export default function LoginForm() {
  const router = useRouter();
  const { login: setUser } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError: setFormError,
  } = useForm();

  const handleLogin = async data => {
    try {
      await setUser({ email: data.email, password: data.password });
      router.push('/dashboard');
    } catch (error) {
      setFormError('root', {
        type: 'manual',
        message: error.message || 'Невірні дані для входу',
      });
    }
  };

  return (
    <form onSubmit={handleSubmit(handleLogin)} className={styles.form}>
      <h2 className={styles.title}>Вхід до адмін-панелі</h2>

      <label>
        Email
        <input
          type="email"
          {...register('email', {
            required: "Email обов'язковий",
            pattern: {
              value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
              message: 'Введіть коректний email',
            },
          })}
          className={styles.input}
        />
        {errors.email && <div className={styles.error}>{errors.email.message}</div>}
      </label>

      <label>
        Пароль
        <input
          type="password"
          {...register('password', {
            required: "Пароль обов'язковий",
            minLength: { value: 6, message: 'Мінімум 6 символів' },
          })}
          className={styles.input}
        />
        {errors.password && <div className={styles.error}>{errors.password.message}</div>}
      </label>

      {errors.root && <div className={styles.error}>{errors.root.message}</div>}

      <button type="submit" className={styles.button}>
        Увійти
      </button>
    </form>
  );
}
