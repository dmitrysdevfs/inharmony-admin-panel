import axios from 'axios';

// Базовий axios інстанс
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api',
  withCredentials: true, // для httpOnly cookies
});

// Collections API
export const collectionsApi = {
  // Отримання списку зборів з пагінацією
  getCollections: async (locale = 'ua', page = 1, limit = 10) => {
    // TODO: реалізувати API запит
    console.log(`Getting collections for locale: ${locale}, page: ${page}, limit: ${limit}`);

    // Використовуємо мок дані для тестування
    const { mockCollections } = await import('./mockData.js');
    const start = (page - 1) * limit;
    const end = start + limit;
    const data = mockCollections.slice(start, end);

    return {
      data,
      total: mockCollections.length,
      page,
      limit,
    };
  },

  // Отримання деталей збору
  getCollection: async (locale = 'ua', id) => {
    // TODO: реалізувати API запит
    console.log(`Getting collection ${id} for locale: ${locale}`);

    // Використовуємо мок дані для тестування
    const { mockCollections } = await import('./mockData.js');
    const data = mockCollections.find(c => c.id === parseInt(id));

    return { data };
  },
};

export default api;
