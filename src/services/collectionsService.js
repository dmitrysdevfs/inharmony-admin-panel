import { adaptCollection } from '../lib/adapters';

const handleResponse = async response => {
  let data;

  try {
    // Try to parse JSON response
    const text = await response.text();
    data = text ? JSON.parse(text) : {};
  } catch (error) {
    // If JSON parsing fails, create error object
    data = {
      error: 'Invalid JSON response',
      details: `Server returned non-JSON response: ${response.statusText}`,
    };
  }

  if (!response.ok) {
    const errorMessage =
      data?.error || data?.details || data?.message || `Request failed: ${response.statusText}`;
    throw new Error(errorMessage);
  }

  return data;
};

// Get collections list
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

// Get single collection
export const fetchCollectionById = async (locale = 'ua', id) => {
  const res = await fetch(`/api/collections/${locale}/${id}`, {
    credentials: 'include',
  });
  const data = await handleResponse(res);
  return { data: adaptCollection(data.data) };
};

// Create new collection
export const createCollection = async (locale = 'ua', payload) => {
  const res = await fetch(`/api/collections/${locale}/new`, {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  const data = await handleResponse(res);

  // API returns collection object directly, not wrapped in data
  return { data: adaptCollection(data) };
};

// Get collection for editing
export const fetchCollectionForEdit = async (locale = 'ua', id) => {
  const res = await fetch(`/api/collections/${locale}/edit/${id}`, {
    credentials: 'include',
  });
  const data = await handleResponse(res);
  return { data: adaptCollection(data.data) };
};

// Update collection
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

// Delete collection
export const deleteCollection = async (locale = 'ua', id) => {
  const res = await fetch(`/api/collections/${locale}/${id}`, {
    method: 'DELETE',
    credentials: 'include',
  });
  await handleResponse(res);
  return { success: true };
};
