import clsx from 'clsx';

// Утиліта для об'єднання CSS класів
export const cn = clsx;

// Форматування дати
export const formatDate = date => {
  if (!date) return '';
  return new Date(date).toLocaleDateString('uk-UA');
};

// Форматування грошей
export const formatMoney = (amount, currency = 'UAH') => {
  if (!amount) return '0 ₴';
  return new Intl.NumberFormat('uk-UA', {
    style: 'currency',
    currency: currency === 'UAH' ? 'UAH' : 'USD',
  }).format(amount);
};

// Валідація email
export const isValidEmail = email => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Генерація унікального ID
export const generateId = () => {
  return Math.random().toString(36).substr(2, 9);
};
