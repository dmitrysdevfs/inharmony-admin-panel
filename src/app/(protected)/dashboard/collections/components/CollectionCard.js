import React from 'react';
import Image from 'next/image';
import { API_CONFIG } from '@/lib/config';
import { formatDate, formatMoney, cn } from '@/lib/utils';
import styles from './CollectionCard.module.css';

const CollectionCard = ({ collection }) => {
  if (!collection) {
    return <div className={styles.notFound}>Збір не знайдено</div>;
  }

  const collected = parseFloat(collection.collected);
  const target = parseFloat(collection.target);

  const progress = target !== 0 ? (collected / target) * 100 : 0;

  const importanceMap = {
    urgent: 'Терміново',
    important: 'Важливий',
    'non-urgent': 'Не терміново',
    permanent: 'Постійний',
  };

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
                <Image
                  key={img._id}
                  src={`${API_CONFIG.BASE_URL}/images/all/${imageName}`}
                  alt={collection.alt}
                  className={styles.collectionImage}
                  width={300}
                  height={200}
                  priority={false}
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              );
            })}
        </div>

        {collection.long_desc && (
          <div className={styles.longDesc}>
            {Object.entries(collection.long_desc)
              .filter(([key]) => key !== '_id')
              .map(([key, text], i) => (
                <p key={key}>{text}</p>
              ))}
          </div>
        )}

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

          <div className={styles.stat}>
            <span className={styles.label}>Важливість:</span>
            <p className={styles.value}>
              {importanceMap[collection.importance] || collection.importance}
            </p>
          </div>

          <div className={styles.stat}>
            <span className={styles.label}>Кількість донорів:</span>
            <p className={styles.value}>{collection.peopleDonate}</p>
          </div>

          <div className={styles.stat}>
            <span className={styles.label}>Термін реалізації (днів):</span>
            <p className={styles.value}>{collection.days}</p>
          </div>

          <div className={styles.stat}>
            <span className={styles.label}>Кількість відгуків:</span>
            <p className={styles.value}>{collection.quantity}</p>
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
