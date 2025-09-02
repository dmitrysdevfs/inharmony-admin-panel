import { adaptCollection } from '../lib/adapters';
import { API_CONFIG } from '../lib/config';
import { mockCollections } from '../lib/mockData';

export const fetchCollections = async (
  locale = 'ua',
  page = 1,
  limit = API_CONFIG.DEFAULT_PAGE_SIZE
) => {
  try {
    console.log('🔍 fetchCollections: починаємо запит...');
    // Використовуємо локальний API route замість прямого зовнішнього API
    const response = await fetch(`/api/collections/${locale}`);
    console.log('📡 fetchCollections: отримали відповідь:', response);

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status} ${response.statusText}`);
    }

    const responseData = await response.json();
    console.log('📊 fetchCollections: responseData:', responseData);

    if (responseData.status !== 200) {
      throw new Error(`API returned status ${responseData.status}`);
    }

    const all = [...responseData.data.activeCollections, ...responseData.data.closedCollections];
    const adapted = all.map(adaptCollection);
    const paginated = adapted.slice((page - 1) * limit, page * limit);

    return {
      data: paginated,
      total: adapted.length,
      page,
      limit,
    };
  } catch (error) {
    console.error('❌ fetchCollections: помилка:', error);
    console.error('❌ fetchCollections: stack:', error.stack);

    const fallback = mockCollections.slice((page - 1) * limit, page * limit);
    return {
      data: fallback,
      total: mockCollections.length,
      page,
      limit,
      fallback: true,
      reason: `API помилка: ${error.message}`,
    };
  }
};

export const fetchCollectionById = async (locale = 'ua', id) => {
  try {
    console.log('🔍 fetchCollectionById: починаємо запит...', { locale, id });
    // Використовуємо локальний API route замість прямого зовнішнього API
    const response = await fetch(`/api/collections/${locale}`);
    console.log('📡 fetchCollectionById: отримали відповідь:', response);

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status} ${response.statusText}`);
    }

    const responseData = await response.json();
    console.log('📊 fetchCollectionById: responseData:', responseData);

    if (responseData.status !== 200) {
      throw new Error(`API returned status ${responseData.status}`);
    }

    const all = [...responseData.data.activeCollections, ...responseData.data.closedCollections];
    const found = all.find(c => c._id === id);

    if (!found) throw new Error(`Collection with id ${id} not found`);

    return { data: adaptCollection(found) };
  } catch (error) {
    console.error('❌ fetchCollectionById: помилка:', error);
    console.error('❌ fetchCollectionById: stack:', error.stack);

    const fallback = mockCollections.find(c => c.id === parseInt(id));
    return {
      data: fallback,
      fallback: true,
      reason: `API помилка: ${error.message}`,
    };
  }
};
