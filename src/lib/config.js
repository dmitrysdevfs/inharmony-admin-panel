export const API_CONFIG = {
  BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL,
  TIMEOUT: parseInt(process.env.NEXT_PUBLIC_API_TIMEOUT) || 10000,
  DEFAULT_PAGE_SIZE: 6,
  SUPPORTED_LOCALES: ['ua', 'en'],
};

export const validateConfig = () => !!API_CONFIG.BASE_URL;
