const BASE_URL = '/api/auth';

export const login = async credentials => {
  const res = await fetch(`${BASE_URL}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials),
    credentials: 'include',
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || 'Login failed');
  }

  const data = await res.json();
  return data;
};

export const logout = async () => {
  const res = await fetch(`${BASE_URL}/logout`, {
    method: 'POST',
    credentials: 'include',
  });
  if (!res.ok) throw new Error('Logout failed');
};

export const getCurrentUser = async () => {
  const res = await fetch(`${BASE_URL}/users/current`, {
    method: 'GET',
    credentials: 'include',
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || 'Failed to fetch current user');
  }

  const data = await res.json();
  return data;
};

export const getUsers = async () => {
  const res = await fetch(`${BASE_URL}/users`, {
    method: 'GET',
    credentials: 'include',
  });
  if (!res.ok) throw new Error('Failed to fetch users');
  return await res.json();
};

export const registerUser = async userData => {
  const res = await fetch(`${BASE_URL}/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userData),
    credentials: 'include',
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || 'Registration failed');
  }
  return await res.json();
};

export const updateUser = async (userId, updates) => {
  const res = await fetch(`${BASE_URL}/users/${userId}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updates),
    credentials: 'include',
  });
  if (!res.ok) throw new Error('Failed to update user');
  return await res.json();
};

export const deleteUser = async userId => {
  const res = await fetch(`${BASE_URL}/users/${userId}`, {
    method: 'DELETE',
    credentials: 'include',
  });
  if (!res.ok) throw new Error('Failed to delete user');
};
