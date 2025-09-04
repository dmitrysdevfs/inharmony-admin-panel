'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { fetchCollections } from '@/services/collectionsService';
import Table from '@/components/ui/Table';
import Button from '@/components/ui/Button';
import { formatDate, formatMoney, cn } from '@/lib/utils';
import styles from './CollectionList.module.css';

const CollectionList = ({ locale = 'ua' }) => {
  const router = useRouter();

  // 🔧 Константа для базового роуту колекцій
  const BASE_ROUTE = '/dashboard/collections';

  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fallback, setFallback] = useState(false);
  const [fallbackReason, setFallbackReason] = useState('');
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 6,
    total: 0,
  });

  useEffect(() => {
    loadCollections();
  }, [locale, pagination.page]);

  const loadCollections = async () => {
    try {
      setLoading(true);
      setFallback(false);
      setFallbackReason('');

      const response = await fetchCollections(locale, pagination.page, pagination.limit);

      setCollections(response.data || []);
      setFallback(response.fallback || false);
      setFallbackReason(response.reason || '');
      setPagination(prev => ({
        ...prev,
        total: response.total || 0,
      }));
    } catch (error) {
      setFallback(true);
      setFallbackReason('Помилка завантаження');
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      key: 'title',
      label: 'Назва',
      render: (value, row) => (
        <div className={styles.titleCell}>
          <strong>{value}</strong>
          <span className={styles.description}>{row.description}</span>
        </div>
      ),
    },
    {
      key: 'goal',
      label: 'Ціль',
      render: value => formatMoney(value),
    },
    {
      key: 'raised',
      label: 'Зібрано',
      render: value => formatMoney(value),
    },
    {
      key: 'status',
      label: 'Статус',
      render: value => (
        <span className={cn(styles.status, styles[value])}>
          {value === 'active' ? 'Активний' : 'Завершено'}
        </span>
      ),
    },
    {
      key: 'createdAt',
      label: 'Створено',
      render: value => formatDate(value),
    },
    {
      key: 'actions',
      label: 'Дії',
      render: (_, row) => (
        <div className={styles.actions}>
          <Button
            size="small"
            variant="outline"
            onClick={() => router.push(`${BASE_ROUTE}/${row.id}`)}
          >
            Переглянути
          </Button>
          <Button
            size="small"
            variant="secondary"
            onClick={() => router.push(`${BASE_ROUTE}/edit/${row.id}`)}
          >
            Редагувати
          </Button>
        </div>
      ),
    },
  ];

  const totalPages = Math.ceil(pagination.total / pagination.limit);

  if (loading) {
    return <div className={styles.loading}>Завантаження...</div>;
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2>Збори коштів</h2>
        <Button variant="primary" onClick={() => router.push(`${BASE_ROUTE}/new`)}>
          Створити новий збір
        </Button>
      </div>

      {fallback && (
        <div className={styles.fallbackWarning}>
          ⚠️ Використовуються тестові дані
          {fallbackReason && <span className={styles.fallbackReason}> ({fallbackReason})</span>}
        </div>
      )}

      <Table
        columns={columns}
        data={collections}
        onRowClick={row => console.log('Row clicked:', row)}
      />

      {collections.length === 0 && !loading && (
        <div className={styles.emptyState}>Немає зборів для відображення</div>
      )}

      {totalPages > 1 && (
        <div className={styles.pagination}>
          <Button
            variant="outline"
            disabled={pagination.page === 1}
            onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
          >
            Попередня
          </Button>

          <span className={styles.pageInfo}>
            Сторінка {pagination.page} з {totalPages}
          </span>

          <Button
            variant="outline"
            disabled={pagination.page === totalPages}
            onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
          >
            Наступна
          </Button>
        </div>
      )}
    </div>
  );
};

export default CollectionList;
