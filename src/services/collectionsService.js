import { adaptCollection } from '../lib/adapters';

const handleResponse = async response => {
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data?.error || `Request failed: ${response.statusText}`);
  }
  return data;
};

// 🔍 Отримати список зборів
export const fetchCollections = async (locale = 'ua', page = 1, limit = 10) => {
  const res = await fetch(`/api/collections/${locale}`, {
    credentials: 'include',
  });
  const data = await handleResponse(res);

  const all = [...data.data.activeCollections, ...data.data.closedCollections];
  const adapted = all.map(adaptCollection);
  const paginated = adapted.slice((page - 1) * limit, page * limit);

  return {
    data: paginated,
    total: adapted.length,
    page,
    limit,
  };
};

// 📁 Отримати один збір
export const fetchCollectionById = async (locale = 'ua', id) => {
  const res = await fetch(`/api/collections/${locale}/${id}`, {
    credentials: 'include',
  });
  const data = await handleResponse(res);
  return { data: adaptCollection(data.data) };
};

// 🆕 Створити новий збір
export const createCollection = async (locale = 'ua', payload) => {
  const res = await fetch(`/api/collections/${locale}/new`, {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  const data = await handleResponse(res);
  return { data: adaptCollection(data.data) };
};

// ✏️ Отримати збір для редагування
export const fetchCollectionForEdit = async (locale = 'ua', id) => {
  const res = await fetch(`/api/collections/${locale}/edit/${id}`, {
    credentials: 'include',
  });
  const data = await handleResponse(res);
  return { data: adaptCollection(data.data) };
};

// 🔄 Оновити збір
export const updateCollectionViaEdit = async (locale = 'ua', id, payload) => {
  const res = await fetch(`/api/collections/${locale}/edit/${id}`, {
    method: 'PUT',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  const data = await handleResponse(res);
  return { data: adaptCollection(data.data) };
};

// 🗑️ Видалити збір
export const deleteCollection = async (locale = 'ua', id) => {
  const res = await fetch(`/api/collections/${locale}/${id}`, {
    method: 'DELETE',
    credentials: 'include',
  });
  await handleResponse(res);
  return { success: true };
};
