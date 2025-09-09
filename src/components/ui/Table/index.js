import React from 'react';
import { cn } from '@/lib/utils';
import { ChevronUpIcon, ChevronDownIcon } from '@heroicons/react/outline';
import styles from './Table.module.css';

const Table = ({ columns = [], data = [], className, onRowClick, onSort, sortConfig }) => {
  const handleSort = column => {
    if (column.sortable && onSort) {
      onSort(column.sortKey || column.key);
    }
  };

  return (
    <div className={styles.tableContainer}>
      <table className={cn(styles.table, className)}>
        <thead>
          <tr>
            {columns.map(column => (
              <th
                key={column.key}
                className={cn(styles.th, column.sortable && styles.sortable)}
                onClick={() => handleSort(column)}
              >
                <div className={styles.thContent}>
                  <span>{column.label}</span>
                  {column.sortable && (
                    <div className={styles.sortIcons}>
                      <ChevronUpIcon
                        className={cn(
                          styles.sortIcon,
                          sortConfig?.key === (column.sortKey || column.key) &&
                            sortConfig?.direction === 'asc' &&
                            styles.active
                        )}
                      />
                      <ChevronDownIcon
                        className={cn(
                          styles.sortIcon,
                          sortConfig?.key === (column.sortKey || column.key) &&
                            sortConfig?.direction === 'desc' &&
                            styles.active
                        )}
                      />
                    </div>
                  )}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, index) => (
            <tr
              key={row.id || index}
              className={cn(styles.tr, onRowClick && styles.clickable)}
              onClick={() => onRowClick && onRowClick(row)}
            >
              {columns.map(column => (
                <td key={column.key} className={styles.td}>
                  {column.render ? column.render(row[column.key], row) : row[column.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      {data.length === 0 && <div className={styles.emptyState}>Немає даних для відображення</div>}
    </div>
  );
};

export default Table;
