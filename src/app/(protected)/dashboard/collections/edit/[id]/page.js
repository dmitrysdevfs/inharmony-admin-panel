'use client';

import { useRouter, useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import CollectionForm from '@/app/(protected)/dashboard/collections/components/CollectionForm';
import { fetchCollections, updateCollection } from '@/services/collectionsService';
import styles from './page.module.css';

export default function EditCollectionPage() {
  const router = useRouter();
  const params = useParams();
  const { id } = params;

  const [collection, setCollection] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    const loadCollection = async () => {
      try {
        setFetching(true);
        const response = await fetchCollections('ua');
        const found = response.data.find(item => item.id === id);
        if (found) {
          setCollection(found);
        } else {
          setError('Збір не знайдено');
        }
      } catch (err) {
        setError('Помилка завантаження даних');
      } finally {
        setFetching(false);
      }
    };

    if (id) {
      loadCollection();
    }
  }, [id]);

  const handleSubmit = async data => {
    try {
      setLoading(true);
      setError('');

      const result = await updateCollection('ua', id, data);

      if (result.data) {
        router.push('/dashboard/collections');
      } else {
        setError('Помилка оновлення збору');
      }
    } catch (error) {
      setError(error.message || 'Помилка оновлення збору');
    } finally {
      setLoading(false);
    }
  };

  if (fetching) return <div className={styles.loading}>Завантаження...</div>;
  if (error) return <div className={styles.error}>{error}</div>;

  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        <div className={styles.header}>
          <h1>Редагувати збір</h1>
          <p>Внесіть зміни у форму і збережіть</p>
        </div>

        <CollectionForm
          collection={collection}
          onSubmit={handleSubmit}
          loading={loading}
          locale="ua"
        />
      </div>
    </div>
  );
}
