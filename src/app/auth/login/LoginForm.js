'use client';

import styles from './LoginForm.module.css';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { login } from '@/services/authService';

export default function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async e => {
    e.preventDefault();
    setError('');

    const res = await login(email, password);

    if (res.success) {
      // Дані користувача автоматично зберігаються в authService.login
      router.push('/dashboard');
    } else {
      setError(res.reason || 'Невірні дані для входу');
    }
  };

  return (
    <form onSubmit={handleLogin} className={styles.form}>
      <h2 className={styles.title}>Вхід до адмін-панелі</h2>

      <label>
        Email
        <input
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
          className={styles.input}
        />
      </label>

      <label>
        Пароль
        <input
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
          className={styles.input}
        />
      </label>

      {error && <div className={styles.error}>{error}</div>}

      <button type="submit" className={styles.button}>
        Увійти
      </button>
    </form>
  );
}
