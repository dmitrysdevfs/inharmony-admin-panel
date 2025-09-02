'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import Button from '../ui/Button';
import Input from '../ui/Input';
import styles from './CollectionForm.module.css';

const CollectionForm = ({ collection, onSubmit, loading = false }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: collection || {
      title: '',
      description: '',
      goal: '',
      status: 'active',
    },
  });

  const handleFormSubmit = data => {
    onSubmit(data);
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className={styles.form}>
      <div className={styles.formGroup}>
        <Input
          label="Назва збору"
          {...register('title', {
            required: "Назва обов'язкова",
            minLength: { value: 3, message: 'Мінімум 3 символи' },
          })}
          error={errors.title?.message}
          placeholder="Введіть назву збору коштів"
        />
      </div>

      <div className={styles.formGroup}>
        <Input
          label="Опис"
          {...register('description', {
            required: "Опис обов'язковий",
            minLength: { value: 10, message: 'Мінімум 10 символів' },
          })}
          error={errors.description?.message}
          placeholder="Опишіть мету збору коштів"
        />
      </div>

      <div className={styles.formGroup}>
        <Input
          label="Цільова сума (UAH)"
          type="number"
          {...register('goal', {
            required: "Цільова сума обов'язкова",
            min: { value: 1, message: 'Сума має бути більше 0' },
          })}
          error={errors.goal?.message}
          placeholder="1000"
        />
      </div>

      <div className={styles.formGroup}>
        <label className={styles.label}>Статус</label>
        <select {...register('status')} className={styles.select}>
          <option value="active">Активний</option>
          <option value="completed">Завершено</option>
          <option value="draft">Чернетка</option>
        </select>
      </div>

      <div className={styles.formActions}>
        <Button type="submit" variant="primary" disabled={loading}>
          {loading ? 'Збереження...' : collection ? 'Оновити' : 'Створити'}
        </Button>

        <Button type="button" variant="outline" onClick={() => window.history.back()}>
          Скасувати
        </Button>
      </div>
    </form>
  );
};

export default CollectionForm;
