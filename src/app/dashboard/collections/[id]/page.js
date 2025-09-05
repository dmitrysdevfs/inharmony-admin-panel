'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import CollectionCard from '../components/CollectionCard';
import styles from './CollectionPage.module.css';

export default function CollectionPage() {
  const { id } = useParams();
  const [collection, setCollection] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

  useEffect(() => {
    if (!id) return;

    async function fetchData() {
      try {
        const locale = 'ua';
        const res = await fetch(`/api/collections/${locale}/${id}`);
        if (!res.ok) {
          throw new Error(`Failed to fetch collection: ${res.status}`);
        }
        const data = await res.json();
        setCollection(data.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [id]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!collection) return <p>Collection not found</p>;

  return (
    <>
      <button className={styles.backButton} onClick={() => router.push('/dashboard/collections')}>
        ← Назад до списку
      </button>

      <CollectionCard collection={collection} />
    </>
  );
}
