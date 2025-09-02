// API Configuration
export const API_CONFIG = {
  // Основний API URL (обов'язково налаштувати)
  BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL,

  // Fallback API URL (опціонально)
  FALLBACK_URL: process.env.NEXT_PUBLIC_API_FALLBACK_URL,

  // API Timeout (в мілісекундах)
  TIMEOUT: parseInt(process.env.NEXT_PUBLIC_API_TIMEOUT) || 10000,

  // Локалізації
  SUPPORTED_LOCALES: ['ua', 'en'],

  // Пагінація за замовчуванням
  DEFAULT_PAGE_SIZE: 6,
};

// Перевірка конфігурації
export const validateConfig = () => {
  if (!API_CONFIG.BASE_URL) {
    console.error('❌ NEXT_PUBLIC_API_BASE_URL не налаштований!');
    console.error('Створіть .env.local файл з NEXT_PUBLIC_API_BASE_URL');
    return false;
  }

  console.log('✅ API конфігурація налаштована правильно');
  return true;
};

// Перевірка чи API доступний
export const isApiConfigured = () => {
  return !!API_CONFIG.BASE_URL;
};
