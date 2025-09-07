'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import CollectionForm from '../components/CollectionForm';
import { createCollection } from '@/services/collectionsService';
import styles from './page.module.css';

export default function NewCollectionPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async data => {
    try {
      setLoading(true);
      setError('');

      const result = await createCollection('ua', data);

      if (result.data) {
        router.push('/dashboard/collections');
      } else {
        setError('Помилка створення збору');
      }
    } catch (error) {
      setError(error.message || 'Помилка створення збору');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Створити новий збір коштів</h1>
        <p>Заповніть форму для створення нового збору коштів</p>
      </div>

      {error && <div className={styles.error}>{error}</div>}

      <CollectionForm onSubmit={handleSubmit} loading={loading} locale="ua" />
    </div>
  );
}
