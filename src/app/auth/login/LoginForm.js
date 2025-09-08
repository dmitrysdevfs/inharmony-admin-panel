'use client';

import styles from './LoginForm.module.css';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import InputGroup from '@/components/ui/InputGroup/InputGroup';

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
    <div className={styles.container}>
      <h2 className={styles.title}>Увійти в адмін - панель</h2>
      <p className={styles.subtitle}>Будь ласка, введіть свої дані для входу.</p>
      <form onSubmit={handleSubmit(handleLogin)} className={styles.form}>
        <InputGroup
          id="email"
          label="Email"
          type="email"
          error={errors.email?.message}
          {...register('email', {
            required: "Email обов'язковий",
            pattern: {
              value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
              message: 'Введіть коректний email',
            },
          })}
        />

        <InputGroup
          id="password"
          label="Пароль"
          type="password"
          showToggle
          error={errors.password?.message}
          {...register('password', {
            required: "Пароль обов'язковий",
            minLength: { value: 6, message: 'Мінімум 6 символів' },
          })}
        />

        {errors.root && <div className={styles.error}>{errors.root.message}</div>}

        <button type="submit" className={styles.button}>
          Увійти
        </button>
      </form>
    </div>
  );
}
