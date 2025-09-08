import React from 'react';
import { cn } from '@/lib/utils';
import styles from './Table.module.css';

const Table = ({ columns = [], data = [], className, onRowClick }) => {
  return (
    <div className={styles.tableContainer}>
      <table className={cn(styles.table, className)}>
        <thead>
          <tr>
            {columns.map(column => (
              <th key={column.key} className={styles.th}>
                {column.label}
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
