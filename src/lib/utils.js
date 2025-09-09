import clsx from 'clsx';

export const cn = clsx;

export const formatDate = (date, format = 'uk-UA') => {
  if (!date) return '';

  if (format === 'dd-MM.yyyy') {
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    return `${day}-${month}.${year}`;
  }

  return new Date(date).toLocaleDateString('uk-UA');
};

export const formatMoney = (amount, currency = 'UAH') => {
  if (!amount) amount = 0;

  const formattedNumber = new Intl.NumberFormat('uk-UA', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);

  return currency === 'UAH' ? `${formattedNumber} ₴` : `$${formattedNumber}`;
};

export const isValidEmail = email => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const generateId = () => {
  return Math.random().toString(36).substr(2, 9);
};
