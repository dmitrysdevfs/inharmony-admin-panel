'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { fetchCollections, deleteCollection } from '@/services/collectionsService';
import Table from '@/components/ui/Table';
import Button from '@/components/ui/Button';
import { formatDate, formatMoney, cn } from '@/lib/utils';
import styles from './CollectionList.module.css';
import { PencilIcon, TrashIcon } from '@heroicons/react/outline';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/outline'; // Іконки для стрілочок

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

  const loadCollections = useCallback(async () => {
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
  }, [locale, pagination.page, pagination.limit]);

  useEffect(() => {
    loadCollections();
  }, [loadCollections]);

  const handleDelete = async id => {
    if (confirm('Ви впевнені, що хочете видалити цей збір? Цю дію неможливо скасувати.')) {
      try {
        await deleteCollection(locale, id);
        loadCollections();
        alert('Збір успішно видалено');
      } catch (error) {
        console.error('Error deleting collection:', error);
        alert('Помилка при видаленні збору. Спробуйте ще раз.');
      }
    }
  };

  const columns = [
    {
      key: 'title',
      label: 'Назва і дата збору',
      render: (value, row) => {
        const truncatedTitle = value && value.length > 30 ? `${value.substring(0, 30)}...` : value;
        const formattedDate = formatDate(row.createdAt, 'dd-MM.yyyy');

        return (
          <div className={styles.titleCell} onClick={() => router.push(`${BASE_ROUTE}/${row.id}`)}>
            <div className={styles.titleRow}>
              <strong>{truncatedTitle}</strong>
            </div>
            <div className={styles.dateRow}>{formattedDate}</div>
          </div>
        );
      },
    },
    {
      key: 'status',
      label: 'Статус',
      render: value => (
        <span className={cn(styles.status, styles[value])}>
          {value === 'active' ? 'Активний' : 'Завершений'}
        </span>
      ),
    },
    {
      key: 'progress',
      label: 'Заповнено',
      render: (_, row) => {
        const percentage = row.target > 0 ? Math.round((row.raised / row.target) * 100) : 0;
        return (
          <div className={styles.progressCell}>
            <span className={styles.percentage}>{percentage}%</span>
          </div>
        );
      },
    },
    {
      key: 'raised',
      label: 'Зібрано',
      render: value => formatMoney(value),
    },
    {
      key: 'goal',
      label: 'Ціль',
      render: value => formatMoney(value),
    },
    {
      key: 'peopleDonate',
      label: 'Донори',
      render: value => value || 0,
    },
    {
      key: 'actions',
      label: 'Дії',
      render: (_, row) => (
        <div className={styles.actions}>
          <Button
            size="small"
            variant="secondary"
            onClick={() => router.push(`${BASE_ROUTE}/edit/${row.id}`)}
            className={styles.iconButton}
          >
            <PencilIcon className={styles.icon} />
          </Button>

          <Button
            size="small"
            variant="danger"
            onClick={() => handleDelete(row.id)}
            className={styles.iconButton}
          >
            <TrashIcon className={styles.icon} />
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
    <div>
      <div className={styles.container}>
        <div className={styles.header}>
          <h2>Збори коштів</h2>
          <button className={styles.creationBtn} onClick={() => router.push(`${BASE_ROUTE}/new`)}>
            Створити новий збір
          </button>
        </div>

        {fallback && (
          <div className={styles.fallbackWarning}>
            Використовуються тестові дані
            {fallbackReason && <span className={styles.fallbackReason}> ({fallbackReason})</span>}
          </div>
        )}

        <Table
          columns={columns}
          data={collections}
          onRowClick={row => router.push(`${BASE_ROUTE}/${row.id}`)}
        />

        {collections.length === 0 && !loading && (
          <div className={styles.emptyState}>Немає зборів для відображення</div>
        )}
      </div>
      {totalPages > 1 && (
        <div className={styles.pagination}>
          <button
            className={cn(styles.paginationButton, { [styles.disabled]: pagination.page === 1 })}
            disabled={pagination.page === 1}
            onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
          >
            <ChevronLeftIcon className={styles.iconArrow} />
          </button>

          <div className={styles.pageDots}>
            {Array.from({ length: totalPages }, (_, index) => (
              <button
                key={index}
                className={cn(styles.pageDot, {
                  [styles.active]: pagination.page === index + 1,
                })}
                onClick={() => setPagination(prev => ({ ...prev, page: index + 1 }))}
              ></button>
            ))}
          </div>

          <button
            className={cn(styles.paginationButton, {
              [styles.disabled]: pagination.page === totalPages,
            })}
            disabled={pagination.page === totalPages}
            onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
          >
            <ChevronRightIcon className={styles.iconArrow} />
          </button>
        </div>
      )}
    </div>
  );
};

export default CollectionList;
