'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import Image from 'next/image';
import Input from '@/components/ui/Input';
import styles from './CollectionForm.module.css';

const CollectionForm = ({ collection, onSubmit, loading = false, locale = 'ua' }) => {
  const [imagePreview, setImagePreview] = useState(collection?.image || null);
  const [imageFile, setImageFile] = useState(null);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: collection || {
      title: '',
      desc: '',
      target: '',
      collected: 0,
      alt: '',
      peopleDonate: 0,
      peopleDonate_title: 'донорів',
      days: '',
      period: 'днів',
      quantity: 0,
      status: 'active',
      value: '',
      importance: 'important',
      // language: locale, // API не приймає це поле
      long_desc: {
        section1: '',
        section2: '',
        section3: '',
      },
    },
  });

  // Validate file before upload
  const validateFile = file => {
    const maxSize = 5 * 1024 * 1024; // 5MB
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];

    if (file.size > maxSize) {
      throw new Error('Файл занадто великий (максимум 5MB)');
    }
    if (!allowedTypes.includes(file.type)) {
      throw new Error('Непідтримуваний формат файлу (JPG, PNG, WebP)');
    }
  };

  // Convert file to base64 format as backend expects string ($binary)
  const convertFileToBase64 = file => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });
  };

  const handleFormSubmit = async data => {
    const formData = {
      ...data,
      target: Number(data.target),
      collected: Number(data.collected),
      peopleDonate: Number(data.peopleDonate),
      days: data.days ? Number(data.days) : 0,
      quantity: Number(data.quantity),
    };

    // Convert file to base64 as backend expects string ($binary)
    if (imageFile) {
      formData.image = await convertFileToBase64(imageFile);
    }

    onSubmit(formData);
  };

  const handleImageChange = e => {
    const file = e.target.files[0];
    if (file) {
      try {
        validateFile(file);
        setImageFile(file);

        const reader = new FileReader();
        reader.onload = e => {
          setImagePreview(e.target.result);
        };
        reader.readAsDataURL(file);
      } catch (error) {
        alert(error.message);
        e.target.value = '';
      }
    }
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className={styles.form}>
      {/* Лівий блок - описи та основна інформація */}
      <div className={styles.formLeft}>
        {/* Назва збору */}
        <div className={styles.formGroup}>
          <Input
            label="Назва збору *"
            {...register('title', {
              required: "Назва обов'язкова",
              maxLength: { value: 48, message: 'Максимум 48 символів' },
            })}
            error={errors.title?.message}
            placeholder="Введіть назву збору коштів"
          />
        </div>

        {/* Короткий опис */}
        <div className={styles.formGroup}>
          <label className={styles.label}>Короткий опис *</label>
          <textarea
            {...register('desc', {
              required: "Короткий опис обов'язковий",
              maxLength: { value: 144, message: 'Максимум 144 символи' },
            })}
            className={styles.textareaWide}
            placeholder="Короткий опис збору коштів..."
            rows={2}
          />
          {errors.desc && <span className={styles.error}>{errors.desc.message}</span>}
          <small className={styles.helpText}>Максимум 144 символи</small>
        </div>

        {/* Важливість збору */}
        <div className={styles.formGroup}>
          <label className={styles.label}>Важливість збору *</label>
          <select {...register('importance')} className={styles.select}>
            <option value="urgent">Терміново</option>
            <option value="important">Важливий</option>
            <option value="non-urgent">Не терміново</option>
            <option value="permanent">Постійний</option>
          </select>
        </div>

        {/* Розширений опис */}
        <div className={styles.formGroup}>
          <label className={styles.label}>Розширений опис *</label>
          <div className={styles.longDescContainer}>
            <div className={styles.formGroup}>
              <label className={styles.label}>Секція 1 *</label>
              <textarea
                {...register('long_desc.section1', {
                  required: "Перша секція обов'язкова",
                })}
                className={styles.textareaWide}
                placeholder="Основна інформація про збір..."
                rows={2}
              />
              {errors.long_desc?.section1 && (
                <span className={styles.error}>{errors.long_desc.section1.message}</span>
              )}
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Секція 2</label>
              <textarea
                {...register('long_desc.section2')}
                className={styles.textareaWide}
                placeholder="Додаткова інформація..."
                rows={2}
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Секція 3</label>
              <textarea
                {...register('long_desc.section3')}
                className={styles.textareaWide}
                placeholder="Додаткова інформація..."
                rows={2}
              />
            </div>
          </div>
        </div>

        {/* Кількість відгуків та статус */}
        <div className={`${styles.numbersGroup} ${styles.alignedWithRight}`}>
          <div className={styles.formGroup}>
            <Input
              label="Кількість відгуків"
              type="number"
              {...register('quantity', {
                min: {
                  value: 0,
                  message: 'Кількість відгуків не може бути відʼємною',
                },
              })}
              error={errors.quantity?.message}
              placeholder="12"
            />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.label}>Статус</label>
            <select {...register('status')} className={styles.select}>
              <option value="active">Активний</option>
              <option value="closed">Закритий</option>
            </select>
          </div>
        </div>
      </div>

      {/* Правий блок - технічні поля та налаштування */}
      <div className={styles.formRight}>
        {/* Зображення */}
        <div className={styles.formGroup}>
          <label className={styles.label}>Зображення збору *</label>
          <div className={styles.imageUpload}>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className={styles.fileInput}
              id="image-upload"
            />

            <label htmlFor="image-upload" className={styles.fileLabel}>
              {imagePreview ? (
                <div className={styles.imagePreviewContainer}>
                  <Image
                    src={imagePreview}
                    alt="Превʼю зображення збору"
                    width={300}
                    height={200}
                    className={styles.previewImage}
                  />
                  <div className={styles.overlayText}>Змінити зображення</div>
                </div>
              ) : (
                <>
                  <Image src="/camera.png" alt="camera icon" width={50} height={48} />
                  Перетягніть сюди або оберіть файл
                </>
              )}
            </label>
          </div>
        </div>

        {/* Опис зображення та Унікальний тег */}
        <div className={styles.numbersGroup}>
          <div className={styles.formGroup}>
            <Input
              label="Опис зображення *"
              {...register('alt', {
                required: "Опис зображення обов'язковий",
                maxLength: { value: 24, message: 'Максимум 24 символи' },
              })}
              error={errors.alt?.message}
              placeholder="Фото дітей"
            />
            <small className={styles.helpText}>Короткий опис зображення для доступності</small>
          </div>
          <div className={styles.formGroup}>
            <Input
              label="Унікальний тег *"
              {...register('value', {
                required: "Унікальний тег обов'язковий",
                maxLength: { value: 48, message: 'Максимум 48 символів' },
                minLength: { value: 3, message: 'Мінімум 3 символи' },
                pattern: {
                  value: /^[a-z0-9-]+$/,
                  message: 'Тільки малі літери, цифри та дефіси',
                },
              })}
              error={errors.value?.message}
              placeholder="help-for-children"
            />
            <small className={styles.helpText}>
              Унікальний ідентифікатор збору (3-48 символів, тільки малі літери, цифри та дефіси)
            </small>
          </div>
        </div>

        {/* Фінансові поля */}
        <div className={styles.numbersGroup}>
          <div className={styles.formGroup}>
            <Input
              label="Цільова сума (грн) *"
              type="number"
              {...register('target', {
                required: "Цільова сума обов'язкова",
                min: { value: 0, message: 'Сума не може бути відʼємною' },
              })}
              error={errors.target?.message}
              placeholder="50000"
            />
          </div>
          <div className={styles.formGroup}>
            <Input
              label="Зібрана сума (грн) *"
              type="number"
              {...register('collected', {
                required: "Зібрана сума обов'язкова",
                min: { value: 0, message: 'Сума не може бути відʼємною' },
              })}
              error={errors.collected?.message}
              placeholder="15000"
            />
          </div>
        </div>

        {/* Донори */}
        <div className={styles.numbersGroup}>
          <div className={styles.formGroup}>
            <Input
              label="Кількість донорів *"
              type="number"
              {...register('peopleDonate', {
                required: "Кількість донорів обов'язкова",
                min: { value: 0, message: 'Кількість не може бути відʼємною' },
              })}
              error={errors.peopleDonate?.message}
              placeholder="156"
            />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.label}>Текст для донорів *</label>
            <select {...register('peopleDonate_title')} className={styles.select}>
              <option value="донорів">донорів</option>
              <option value="донори">донори</option>
              <option value="донор">донор</option>
              <option value="donor">donor</option>
              <option value="donors">donors</option>
            </select>
          </div>
        </div>

        {/* Кількість днів та період */}
        <div className={styles.numbersGroup}>
          <div className={styles.formGroup}>
            <Input
              label="Кількість днів"
              type="number"
              {...register('days', {
                min: {
                  value: 0,
                  message: 'Кількість днів не може бути відʼємною',
                },
              })}
              error={errors.days?.message}
              placeholder="30"
            />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.label}>Період *</label>
            <select {...register('period')} className={styles.select}>
              <option value="day">day</option>
              <option value="days">days</option>
              <option value="день">день</option>
              <option value="дні">дні</option>
              <option value="днів">днів</option>
            </select>
          </div>
        </div>

        <div className={styles.formActions}>
          <button className={styles.applyBtn} type="submit" disabled={loading}>
            {loading ? 'Збереження...' : collection ? 'Оновити збір' : 'Створити збір'}
          </button>

          <button className={styles.cancelBtn} type="button" onClick={() => window.history.back()}>
            Скасувати
          </button>
        </div>
      </div>
    </form>
  );
};

export default CollectionForm;
