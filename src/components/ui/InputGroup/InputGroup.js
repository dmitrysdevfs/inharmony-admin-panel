'use client';

import { EyeIcon, EyeOffIcon } from '@heroicons/react/outline';
import styles from './InputGroup.module.css';
import { useState } from 'react';

export default function InputGroup({
  id,
  label,
  type = 'text',
  error,
  showToggle,
  onToggle,
  ...props
}) {
  const [showPassword, setShowPassword] = useState(false);

  const handleToggle = () => {
    setShowPassword(prev => !prev);
    if (onToggle) onToggle();
  };

  return (
    <div className={styles.inputGroup}>
      <input
        id={id}
        type={showToggle && showPassword ? 'text' : type}
        placeholder=" "
        className={`${styles.input} ${error ? styles.inputError : ''}`}
        {...props}
      />
      <label htmlFor={id} className={styles.label}>
        {label}
      </label>

      {showToggle && (
        <button type="button" className={styles.toggle} onClick={handleToggle}>
          {showPassword ? (
            <EyeOffIcon className={styles.icon} />
          ) : (
            <EyeIcon className={styles.icon} />
          )}
        </button>
      )}

      {error && <span className={styles.errorMsg}>{error}</span>}
    </div>
  );
}
