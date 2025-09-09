'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { fetchReports, deleteReport } from '@/services/reportsService';
import Table from '@/components/ui/Table';
import Button from '@/components/ui/Button';
import {
  PencilIcon,
  TrashIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ExternalLinkIcon,
} from '@heroicons/react/outline';
import { cn } from '@/lib/utils';
import styles from './ReportList.module.css';

const ReportList = () => {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [reports, setReports] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 6,
    total: 0,
  });
  const [sortConfig, setSortConfig] = useState({
    key: 'year',
    direction: 'desc',
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError('');

        if (authLoading) {
          return;
        }

        const reportsArray = await fetchReports();
        setReports(reportsArray);
        setPagination(prev => ({
          ...prev,
          total: reportsArray.length,
        }));
      } catch (err) {
        setError(`Помилка: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    if (!authLoading) {
      fetchData();
    }
  }, [authLoading]);

  const handleSort = key => {
    setSortConfig(prevConfig => {
      if (prevConfig.key === key) {
        return {
          key,
          direction: prevConfig.direction === 'asc' ? 'desc' : 'asc',
        };
      }
      return { key, direction: 'asc' };
    });
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const sortReports = reports => {
    if (!sortConfig.key) return reports;

    // Ukrainian months mapping for proper sorting
    const monthOrder = {
      Січень: 1,
      Лютий: 2,
      Березень: 3,
      Квітень: 4,
      Травень: 5,
      Червень: 6,
      Липень: 7,
      Серпень: 8,
      Вересень: 9,
      Жовтень: 10,
      Листопад: 11,
      Грудень: 12,
    };

    return [...reports].sort((a, b) => {
      let aValue = a[sortConfig.key];
      let bValue = b[sortConfig.key];

      // For year sorting, convert to numbers for proper comparison
      if (sortConfig.key === 'year') {
        aValue = parseInt(aValue) || 0;
        bValue = parseInt(bValue) || 0;
      }

      // For month sorting, use month order mapping
      if (sortConfig.key === 'month') {
        aValue = monthOrder[aValue] || 0;
        bValue = monthOrder[bValue] || 0;
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

  // Default chronological sorting (year desc, then month desc)
  const getChronologicallySortedReports = reports => {
    const monthOrder = {
      Січень: 1,
      Лютий: 2,
      Березень: 3,
      Квітень: 4,
      Травень: 5,
      Червень: 6,
      Липень: 7,
      Серпень: 8,
      Вересень: 9,
      Жовтень: 10,
      Листопад: 11,
      Грудень: 12,
    };

    return [...reports].sort((a, b) => {
      const aYear = parseInt(a.year) || 0;
      const bYear = parseInt(b.year) || 0;
      const aMonth = monthOrder[a.month] || 0;
      const bMonth = monthOrder[b.month] || 0;

      // First sort by year (desc - newest first)
      if (aYear !== bYear) {
        return bYear - aYear; // desc order
      }

      // If years are equal, sort by month (desc - latest month first)
      return bMonth - aMonth; // desc order
    });
  };

  const getCurrentPageReports = () => {
    // Use chronological sorting by default, or custom sorting if user clicked on column
    const sortedReports =
      sortConfig.key === 'year' && sortConfig.direction === 'desc'
        ? getChronologicallySortedReports(reports)
        : sortReports(reports);

    const startIndex = (pagination.page - 1) * pagination.limit;
    const endIndex = startIndex + pagination.limit;
    return sortedReports.slice(startIndex, endIndex);
  };

  const handleDelete = async reportId => {
    if (confirm('Ви впевнені, що хочете видалити цей звіт? Цю дію неможливо скасувати.')) {
      try {
        await deleteReport(reportId);
        // Reload reports after successful deletion
        const reportsArray = await fetchReports();
        setReports(reportsArray);
        setPagination(prev => ({
          ...prev,
          total: reportsArray.length,
        }));
        alert('Звіт успішно видалено');
      } catch (error) {
        // Show specific error message based on status code
        let errorMessage = 'Помилка при видаленні звіту. Спробуйте ще раз.';

        if (error.status === 400) {
          errorMessage = 'Некоректний ID звіту';
        } else if (error.status === 403) {
          errorMessage = 'У вас немає прав для видалення цього звіту';
        } else if (error.status === 404) {
          errorMessage = 'Звіт не знайдено';
        }

        alert(errorMessage);
      }
    }
  };

  const handleEdit = reportId => {
    // TODO: Implement edit report navigation
    alert('Функція редагування буде реалізована пізніше');
  };

  const handleCreateNew = () => {
    // TODO: Implement create new report navigation
    alert('Функція створення нового звіту буде реалізована пізніше');
  };

  const truncateUrl = (url, maxLength = 58) => {
    if (!url) return '';
    if (url.length <= maxLength) return url;

    // Try to find a good breaking point (after a slash or before a query parameter)
    const breakPoint = url.lastIndexOf('/', maxLength);
    if (breakPoint > maxLength * 0.7) {
      return url.substring(0, breakPoint) + '...';
    }

    return url.substring(0, maxLength) + '...';
  };

  const columns = [
    {
      key: 'month',
      label: 'Місяць',
      sortable: true,
      sortKey: 'month',
      width: '15%',
    },
    {
      key: 'year',
      label: 'Рік',
      sortable: true,
      sortKey: 'year',
      width: '10%',
    },
    {
      key: 'url',
      label: 'Посилання',
      width: '55%',
      render: value => (
        <a
          href={value}
          target="_blank"
          rel="noopener noreferrer"
          className={styles.link}
          title={value} // Show full URL on hover
        >
          <span className={styles.urlText}>{truncateUrl(value)}</span>
          <ExternalLinkIcon className={styles.externalIcon} />
        </a>
      ),
    },
    {
      key: 'actions',
      label: 'Дії',
      width: '20%',
      render: (_, row) => (
        <div className={styles.actions}>
          <Button
            size="small"
            variant="secondary"
            onClick={e => {
              e.stopPropagation();
              handleEdit(row._id);
            }}
            className={styles.iconButton}
          >
            <PencilIcon className={styles.icon} />
          </Button>

          <Button
            size="small"
            variant="danger"
            onClick={e => {
              e.stopPropagation();
              handleDelete(row._id);
            }}
            className={styles.iconButton}
          >
            <TrashIcon className={styles.icon} />
          </Button>
        </div>
      ),
    },
  ];

  const handleRowClick = report => {
    window.open(report.url, '_blank', 'noopener,noreferrer');
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.header}>
          <h2>Звіти</h2>
        </div>
        <div className={styles.loading}>Завантаження...</div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <h2>Звіти</h2>
        </div>
        <button className={styles.creationBtn} onClick={handleCreateNew}>
          Створити новий звіт
        </button>
      </div>

      {error && <div className={styles.error}>{error}</div>}

      <div className={styles.tableWrapper}>
        <Table
          columns={columns}
          data={getCurrentPageReports()}
          onSort={handleSort}
          sortConfig={sortConfig}
          onRowClick={handleRowClick}
        />
      </div>

      {reports.length === 0 && !loading && (
        <div className={styles.emptyState}>Немає звітів для відображення</div>
      )}

      {Math.ceil(reports.length / pagination.limit) > 1 && (
        <div className={styles.pagination}>
          <button
            className={cn(styles.paginationButton, { [styles.disabled]: pagination.page === 1 })}
            disabled={pagination.page === 1}
            onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
          >
            <ChevronLeftIcon className={styles.iconArrow} />
          </button>

          <div className={styles.pageDots}>
            {Array.from({ length: Math.ceil(reports.length / pagination.limit) }, (_, index) => (
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
              [styles.disabled]: pagination.page === Math.ceil(reports.length / pagination.limit),
            })}
            disabled={pagination.page === Math.ceil(reports.length / pagination.limit)}
            onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
          >
            <ChevronRightIcon className={styles.iconArrow} />
          </button>
        </div>
      )}
    </div>
  );
};

export default ReportList;
