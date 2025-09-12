'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { fetchCollections, deleteCollection } from '@/services/collectionsService';
import Table from '@/components/ui/Table';
import Button from '@/components/ui/Button';
import { formatDate, formatMoney, cn } from '@/lib/utils';
import styles from './CollectionList.module.css';
import { PencilIcon, TrashIcon, SearchIcon, XIcon } from '@heroicons/react/outline';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/outline';

const CollectionList = ({ locale = 'ua' }) => {
  const router = useRouter();

  const BASE_ROUTE = '/dashboard/collections';

  const [allCollections, setAllCollections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fallback, setFallback] = useState(false);
  const [fallbackReason, setFallbackReason] = useState('');
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 6,
    total: 0,
  });
  const [sortConfig, setSortConfig] = useState({
    key: 'createdAt',
    direction: 'desc',
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const loadCollections = useCallback(async () => {
    try {
      setLoading(true);
      setFallback(false);
      setFallbackReason('');

      const response = await fetchCollections(locale, 1, 50);

      setAllCollections(response.data || []);
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
  }, [locale]);

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
        alert('Помилка при видаленні збору. Спробуйте ще раз.');
      }
    }
  };

  const handleSort = key => {
    setSortConfig(prevConfig => ({
      key,
      direction: prevConfig.key === key && prevConfig.direction === 'asc' ? 'desc' : 'asc',
    }));
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const handleSearch = value => {
    setSearchTerm(value);
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const clearSearch = () => {
    setSearchTerm('');
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const handleStatusFilter = status => {
    setStatusFilter(status);
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const sortCollections = collections => {
    if (!sortConfig.key) return collections;

    return [...collections].sort((a, b) => {
      let aValue = a[sortConfig.key];
      let bValue = b[sortConfig.key];

      if (sortConfig.key === 'createdAt') {
        aValue = new Date(aValue);
        bValue = new Date(bValue);
      }

      if (sortConfig.key === 'progress') {
        aValue = a.target > 0 ? Math.round((a.raised / a.target) * 100) : 0;
        bValue = b.target > 0 ? Math.round((b.raised / b.target) * 100) : 0;
      }

      if (['raised', 'goal', 'peopleDonate'].includes(sortConfig.key)) {
        aValue = Number(aValue) || 0;
        bValue = Number(bValue) || 0;
      }

      if (aValue < bValue) {
        return sortConfig.direction === 'asc' ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortConfig.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });
  };

  const filterCollections = collections => {
    let filtered = collections;

    if (statusFilter !== 'all') {
      filtered = filtered.filter(collection => {
        if (statusFilter === 'active') {
          return collection.status === 'active';
        } else if (statusFilter === 'closed') {
          return collection.status === 'closed';
        }
        return true;
      });
    }

    if (searchTerm.trim()) {
      filtered = filtered.filter(collection =>
        collection.title.toLowerCase().includes(searchTerm.toLowerCase().trim())
      );
    }

    return filtered;
  };

  const getCurrentPageCollections = () => {
    const filteredCollections = filterCollections(allCollections);
    const sortedCollections = sortCollections(filteredCollections);
    const startIndex = (pagination.page - 1) * pagination.limit;
    const endIndex = startIndex + pagination.limit;
    return sortedCollections.slice(startIndex, endIndex);
  };

  const columns = [
    {
      key: 'title',
      label: 'Назва і дата збору',
      sortable: true,
      sortKey: 'createdAt',
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
      sortable: true,
      sortKey: 'progress',
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
      sortable: true,
      render: value => formatMoney(value),
    },
    {
      key: 'goal',
      label: 'Ціль',
      sortable: true,
      render: value => formatMoney(value),
    },
    {
      key: 'peopleDonate',
      label: 'Донори',
      sortable: true,
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
            onClick={e => {
              e.stopPropagation();
              router.push(`${BASE_ROUTE}/edit/${row.id}`);
            }}
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

  const filteredCollections = filterCollections(allCollections);
  const totalPages = Math.ceil(filteredCollections.length / pagination.limit);

  if (loading) {
    return <div className={styles.loading}>Завантаження...</div>;
  }

  return (
    <div>
      <div className={styles.container}>
        <div className={styles.header}>
          <div className={styles.headerLeft}>
            <h2>Збори коштів</h2>
            {/* Поле пошуку та фільтр статусу - тільки на клієнті */}
            {isClient && (
              <div className={styles.filtersContainer}>
                <div className={styles.searchContainer}>
                  <div className={styles.searchInputWrapper}>
                    <SearchIcon className={styles.searchIcon} />
                    <input
                      type="text"
                      placeholder="Пошук по назві збору..."
                      value={searchTerm}
                      onChange={e => handleSearch(e.target.value)}
                      className={styles.searchInput}
                    />
                    {searchTerm && (
                      <button
                        onClick={clearSearch}
                        className={styles.clearButton}
                        title="Очистити пошук"
                      >
                        <XIcon className={styles.clearIcon} />
                      </button>
                    )}
                  </div>
                </div>

                <div className={styles.statusFilterContainer}>
                  <div className={styles.statusFilter}>
                    <button
                      className={cn(styles.statusButton, statusFilter === 'all' && styles.active)}
                      onClick={() => handleStatusFilter('all')}
                    >
                      Всі
                    </button>
                    <button
                      className={cn(
                        styles.statusButton,
                        statusFilter === 'active' && styles.active
                      )}
                      onClick={() => handleStatusFilter('active')}
                    >
                      Активні
                    </button>
                    <button
                      className={cn(
                        styles.statusButton,
                        statusFilter === 'closed' && styles.active
                      )}
                      onClick={() => handleStatusFilter('closed')}
                    >
                      Завершені
                    </button>
                  </div>
                </div>

                {(searchTerm || statusFilter !== 'all') && (
                  <div className={styles.searchResults}>
                    Знайдено {filteredCollections.length} з {allCollections.length} зборів
                  </div>
                )}
              </div>
            )}
          </div>
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
          data={getCurrentPageCollections()}
          onRowClick={row => router.push(`${BASE_ROUTE}/${row.id}`)}
          onSort={handleSort}
          sortConfig={sortConfig}
        />

        {allCollections.length === 0 && !loading && (
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
