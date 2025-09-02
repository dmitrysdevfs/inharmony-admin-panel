import axios from 'axios';
import { API_CONFIG, validateConfig, isApiConfigured } from './config.js';

// Валідуємо конфігурацію при імпорті
if (!validateConfig()) {
  throw new Error('API конфігурація не налаштована! Перевірте .env.local файл');
}

// Базовий axios інстанс
const api = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
});

// Collections API
export const collectionsApi = {
  // Отримання списку зборів з пагінацією
  getCollections: async (locale = 'ua', page = 1, limit = API_CONFIG.DEFAULT_PAGE_SIZE) => {
    // Перевіряємо чи API налаштований
    if (!isApiConfigured()) {
      console.error('API не налаштований, використовуються мокові дані');
      const { mockCollections } = await import('./mockData.js');
      const start = (page - 1) * limit;
      const end = start + limit;
      const data = mockCollections.slice(start, end);

      return {
        data,
        total: mockCollections.length,
        page,
        limit,
        fallback: true,
        reason: 'API не налаштований',
      };
    }

    try {
      console.log(`Getting collections for locale: ${locale}, page: ${page}, limit: ${limit}`);

      const response = await api.get(`/collections/${locale}`);

      if (response.data.status === 200) {
        const { activeCollections, closedCollections } = response.data.data;

        // Об'єднуємо активні та закриті збори
        const allCollections = [...activeCollections, ...closedCollections];

        // Адаптуємо структуру даних під наш інтерфейс
        const adaptedCollections = allCollections.map(collection => ({
          id: collection._id,
          title: collection.title,
          description: collection.desc || '',
          goal: collection.target || 0,
          raised: collection.collected || 0,
          status: collection.status,
          createdAt: collection.createdAt,
          updatedAt: collection.createdAt, // API не має updatedAt
          peopleDonate: collection.peopleDonate || 0,
          importance: collection.importance || 'normal',
          image: collection.image?.[0]?.url || null,
        }));

        // Пагінація (API повертає всі збори, тому робимо клієнтську пагінацію)
        const start = (page - 1) * limit;
        const end = start + limit;
        const paginatedCollections = adaptedCollections.slice(start, end);

        return {
          data: paginatedCollections,
          total: adaptedCollections.length,
          page,
          limit,
        };
      } else {
        throw new Error(`API returned status: ${response.data.status}`);
      }
    } catch (error) {
      console.error('Error fetching collections from API:', error);

      // Fallback на мокові дані при помилці API
      console.log('Falling back to mock data...');
      const { mockCollections } = await import('./mockData.js');
      const start = (page - 1) * limit;
      const end = start + limit;
      const data = mockCollections.slice(start, end);

      return {
        data,
        total: mockCollections.length,
        page,
        limit,
        fallback: true,
        reason: `API помилка: ${error.message}`,
      };
    }
  },

  // Отримання деталей збору
  getCollection: async (locale = 'ua', id) => {
    // Перевіряємо чи API налаштований
    if (!isApiConfigured()) {
      console.error('API не налаштований, використовуються мокові дані');
      const { mockCollections } = await import('./mockData.js');
      const data = mockCollections.find(c => c.id === parseInt(id));

      return {
        data,
        fallback: true,
        reason: 'API не налаштований',
      };
    }

    try {
      console.log(`Getting collection ${id} for locale: ${locale}`);

      const response = await api.get(`/collections/${locale}`);

      if (response.data.status === 200) {
        const { activeCollections, closedCollections } = response.data.data;
        const allCollections = [...activeCollections, ...closedCollections];

        const collection = allCollections.find(c => c._id === id);

        if (collection) {
          // Адаптуємо структуру даних
          return {
            data: {
              id: collection._id,
              title: collection.title,
              description: collection.desc || '',
              goal: collection.target || 0,
              raised: collection.collected || 0,
              status: collection.status,
              createdAt: collection.createdAt,
              updatedAt: collection.createdAt,
              peopleDonate: collection.peopleDonate || 0,
              importance: collection.importance || 'normal',
              image: collection.image?.[0]?.url || null,
              long_desc: collection.long_desc || {},
            },
          };
        } else {
          throw new Error(`Collection with id ${id} not found`);
        }
      } else {
        throw new Error(`API returned status: ${response.data.status}`);
      }
    } catch (error) {
      console.error('Error fetching collection from API:', error);

      // Fallback на мокові дані при помилці API
      console.log('Falling back to mock data...');
      const { mockCollections } = await import('./mockData.js');
      const data = mockCollections.find(c => c.id === parseInt(id));

      return {
        data,
        fallback: true,
        reason: `API помилка: ${error.message}`,
      };
    }
  },
};

export default api;
