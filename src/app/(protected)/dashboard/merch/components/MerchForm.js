'use client';

import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import Input from '@/components/ui/Input';
import { updateMerchSettings } from '@/services/merchService';
import styles from './MerchForm.module.css';

const MerchForm = ({ initialData, onDataChange }) => {
  const [loading, setLoading] = useState({ ua: false, en: false });
  const [errors, setErrors] = useState({ ua: '', en: '' });
  const [success, setSuccess] = useState({ ua: false, en: false });

  const {
    register: registerUa,
    handleSubmit: handleSubmitUa,
    formState: { errors: errorsUa },
    watch: watchUa,
    setValue: setValueUa,
  } = useForm({
    defaultValues: {
      status: initialData.ua.status,
      content: initialData.ua.content,
      link: initialData.ua.link,
    },
  });

  const {
    register: registerEn,
    handleSubmit: handleSubmitEn,
    formState: { errors: errorsEn },
    watch: watchEn,
    setValue: setValueEn,
  } = useForm({
    defaultValues: {
      status: initialData.en.status,
      content: initialData.en.content,
      link: initialData.en.link,
    },
  });

  const handleLocaleSubmit = async (locale, data, resetFormData) => {
    try {
      setLoading(prev => ({ ...prev, [locale]: true }));
      setErrors(prev => ({ ...prev, [locale]: '' }));
      setSuccess(prev => ({ ...prev, [locale]: false }));

      const response = await updateMerchSettings(locale, data);

      if (response.data) {
        setSuccess(prev => ({ ...prev, [locale]: true }));
        // Update parent component data
        onDataChange(prev => ({
          ...prev,
          [locale]: { ...prev[locale], ...data },
        }));

        // Reset form data to match saved data
        if (resetFormData) {
          resetFormData({
            status: data.status,
            content: data.content,
            link: data.link,
          });
        }

        // Clear success message after 3 seconds
        setTimeout(() => {
          setSuccess(prev => ({ ...prev, [locale]: false }));
        }, 3000);
      }
    } catch (error) {
      setErrors(prev => ({
        ...prev,
        [locale]: error.message || 'Помилка збереження налаштувань',
      }));
    } finally {
      setLoading(prev => ({ ...prev, [locale]: false }));
    }
  };

  // Update forms when initialData changes
  useEffect(() => {
    setValueUa('status', initialData.ua.status);
    setValueUa('content', initialData.ua.content);
    setValueUa('link', initialData.ua.link);
  }, [initialData.ua, setValueUa]);

  useEffect(() => {
    setValueEn('status', initialData.en.status);
    setValueEn('content', initialData.en.content);
    setValueEn('link', initialData.en.link);
  }, [initialData.en, setValueEn]);

  const LocaleForm = ({ locale, register, handleSubmit, errors, watch, setValue, onSubmit }) => {
    const [formData, setFormData] = useState({
      status: initialData[locale].status,
      content: initialData[locale].content,
      link: initialData[locale].link,
    });
    const [hasChanges, setHasChanges] = useState(false);

    const isActive = formData.status === 'on';
    const localeName = locale === 'ua' ? 'Українська версія' : 'English version';
    const isUa = locale === 'ua';

    // Update form data when initialData changes
    useEffect(() => {
      const newFormData = {
        status: initialData[locale].status,
        content: initialData[locale].content,
        link: initialData[locale].link,
      };
      setFormData(newFormData);
      // Also update React Hook Form
      setValue('status', newFormData.status);
      setValue('content', newFormData.content);
      setValue('link', newFormData.link);
    }, [initialData, locale, setValue]);

    // Check for changes
    useEffect(() => {
      const changed =
        formData.status !== initialData[locale].status ||
        formData.content !== initialData[locale].content ||
        formData.link !== initialData[locale].link;
      setHasChanges(changed);
    }, [formData, initialData, locale]);

    return (
      <div className={styles.localeSection}>
        <div className={styles.localeHeader}>
          <div>
            <h3>{localeName}</h3>
            <div className={styles.statusIndicator}>
              Статус:{' '}
              <span className={isActive ? styles.statusOn : styles.statusOff}>
                {isActive ? 'Включено' : 'Вимкнено'}
              </span>
            </div>
          </div>
          {success[locale] && (
            <div className={styles.successMessage}>✅ Налаштування збережено</div>
          )}
        </div>

        <form onSubmit={handleSubmit(data => onSubmit(data, setFormData))} className={styles.form}>
          {/* Status Toggle */}
          <div className={styles.formGroup}>
            <label className={styles.label}>Статус кнопки</label>
            <div className={styles.toggleContainer}>
              <label className={styles.toggle}>
                <input
                  type="checkbox"
                  checked={isActive}
                  onChange={e => {
                    const newStatus = e.target.checked ? 'on' : 'off';
                    setFormData(prev => ({ ...prev, status: newStatus }));
                    setValue('status', newStatus);
                  }}
                />
                <span className={styles.slider}></span>
              </label>
              <span className={styles.toggleLabel}>{isActive ? 'Включено' : 'Вимкнено'}</span>
            </div>
          </div>

          {/* Content */}
          <div className={styles.formGroup}>
            <Input
              label="Текст кнопки *"
              {...register('content', {
                required: "Текст кнопки обов'язковий",
                maxLength: { value: 50, message: 'Максимум 50 символів' },
                onChange: e => {
                  const value = e.target.value;
                  setFormData(prev => ({ ...prev, content: value }));
                  setValue('content', value);
                },
              })}
              error={errors.content?.message}
              placeholder={isUa ? 'Наш мерч' : 'Merch store'}
              disabled={!isActive}
            />
          </div>

          {/* Link */}
          <div className={styles.formGroup}>
            <Input
              label="Посилання *"
              type="url"
              {...register('link', {
                required: "Посилання обов'язкове",
                pattern: {
                  value: /^https?:\/\/.+/,
                  message: 'Посилання має починатися з http:// або https://',
                },
                onChange: e => {
                  const value = e.target.value;
                  setFormData(prev => ({ ...prev, link: value }));
                  setValue('link', value);
                },
              })}
              error={errors.link?.message}
              placeholder="https://example.com/merch"
              disabled={!isActive}
            />
          </div>

          {/* Error Message */}
          {errors[locale] && <div className={styles.errorMessage}>{errors[locale]}</div>}

          {/* Submit Button */}
          <div className={styles.formActions}>
            <button
              type="submit"
              className={styles.saveButton}
              disabled={loading[locale] || !hasChanges}
            >
              {loading[locale] ? 'Збереження...' : 'Зберегти налаштування'}
            </button>
          </div>
        </form>
      </div>
    );
  };

  return (
    <div className={styles.container}>
      <LocaleForm
        locale="ua"
        register={registerUa}
        handleSubmit={handleSubmitUa}
        errors={errorsUa}
        watch={watchUa}
        setValue={setValueUa}
        onSubmit={(data, resetFormData) => handleLocaleSubmit('ua', data, resetFormData)}
      />

      <LocaleForm
        locale="en"
        register={registerEn}
        handleSubmit={handleSubmitEn}
        errors={errorsEn}
        watch={watchEn}
        setValue={setValueEn}
        onSubmit={(data, resetFormData) => handleLocaleSubmit('en', data, resetFormData)}
      />
    </div>
  );
};

export default MerchForm;
