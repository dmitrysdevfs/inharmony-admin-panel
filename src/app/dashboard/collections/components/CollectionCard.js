import React from 'react';
import { formatDate, formatMoney, cn } from '@/lib/utils';
import styles from './CollectionCard.module.css';

const CollectionCard = ({ collection }) => {
  if (!collection) {
    return <div className={styles.notFound}>Збір не знайдено</div>;
  }

  const collected = parseFloat(collection.collected);
  const target = parseFloat(collection.target);

  const progress = target !== 0 ? (collected / target) * 100 : 0;

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <h1 className={styles.title}>{collection.title}</h1>
        <span className={cn(styles.status, styles[collection.status])}>
          {collection.status === 'active' ? 'Активний' : 'Завершено'}
        </span>
      </div>

      <div className={styles.content}>
        <p className={styles.description}>{collection.desc}</p>

        <div className={styles.images}>
          {collection.image &&
            collection.image.map(img => {
              const imageName = img.url.split('/').pop();

              return (
                <img
                  key={img._id}
                  src={`https://inharmony-v3.h.goit.study/images/all/${imageName}`}
                  alt={collection.alt}
                  className={styles.collectionImage}
                />
              );
            })}
        </div>

        <div className={styles.stats}>
          <div className={styles.stat}>
            <span className={styles.label}>Ціль:</span>
            <span className={styles.value}>{formatMoney(collection.target)}</span>
          </div>

          <div className={styles.stat}>
            <span className={styles.label}>Зібрано:</span>
            <span className={styles.value}>{formatMoney(collection.collected)}</span>
          </div>

          <div className={styles.stat}>
            <span className={styles.label}>Прогрес:</span>
            <div className={styles.progressBar}>
              <div
                className={styles.progressFill}
                style={{ width: `${(collection.collected / collection.target) * 100}%` }}
              />
            </div>
            <span className={styles.progressText}>{Math.round(progress)}%</span>
          </div>
        </div>

        <div className={styles.meta}>
          <div className={styles.metaItem}>
            <span className={styles.metaLabel}>Створено:</span>
            <span className={styles.metaValue}>{formatDate(collection.createdAt)}</span>
          </div>

          {collection.updatedAt && (
            <div className={styles.metaItem}>
              <span className={styles.metaLabel}>Оновлено:</span>
              <span className={styles.metaValue}>{formatDate(collection.updatedAt)}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CollectionCard;