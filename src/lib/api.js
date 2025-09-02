import axios from 'axios';
import { API_CONFIG, validateConfig } from './config';

if (!validateConfig()) {
  throw new Error('API конфігурація не налаштована! Перевірте .env.local файл');
}

const api = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    'User-Agent': 'InHarmony-Admin-Panel/1.0.0',
  },
  withCredentials: true,
  maxRedirects: 5,
});

export default api;
