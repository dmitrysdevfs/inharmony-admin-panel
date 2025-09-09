'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import CollectionCard from '../components/CollectionCard';
import Button from '@/components/ui/Button';
import { adaptCollection } from '@/lib/adapters';
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
          if (res.status === 404) {
            // Collection not found, redirect to collections list
            router.push('/dashboard/collections');
            return;
          }
          throw new Error(`Failed to fetch collection: ${res.status}`);
        }
        const data = await res.json();
        const adaptedCollection = adaptCollection(data.data);
        setCollection(adaptedCollection);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [id, router]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!collection) return <p>Collection not found</p>;

  return (
    <>
      <Button
        size="large"
        variant="outline"
        onClick={() => router.push('/dashboard/collections')}
        className={styles.backButton}
      >
        Назад до списку
      </Button>

      <CollectionCard collection={collection} />
    </>
  );
}
