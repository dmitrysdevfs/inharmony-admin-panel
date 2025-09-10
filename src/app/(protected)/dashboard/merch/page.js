'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { fetchMerchSettings, organizeMerchByLocale } from '@/services/merchService';
import MerchForm from './components/MerchForm';
import styles from './page.module.css';

export default function MerchPage() {
  const { user, isAdmin } = useAuth();
  const [loading, setLoading] = useState(true);
  const [merchData, setMerchData] = useState({
    ua: { status: 'off', content: '', link: '', _id: null },
    en: { status: 'off', content: '', link: '', _id: null },
  });
  const [error, setError] = useState('');

  useEffect(() => {
    const loadMerchSettings = async () => {
      try {
        setLoading(true);
        setError('');
        const data = await fetchMerchSettings();
        const organized = organizeMerchByLocale(data);
        setMerchData(organized);
      } catch (err) {
        setError('Помилка завантаження налаштувань мерчу');
        console.error('Error loading merch settings:', err);
      } finally {
        setLoading(false);
      }
    };

    loadMerchSettings();
  }, []);

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>Завантаження налаштувань мерчу...</div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <h1>Управління кнопкою мерчу</h1>
        </div>
      </div>

      <p className={styles.description}>Керування кнопкою мерчу на головному сайті</p>

      {error && <div className={styles.errorMessage}>{error}</div>}

      <MerchForm initialData={merchData} onDataChange={setMerchData} />
    </div>
  );
}
