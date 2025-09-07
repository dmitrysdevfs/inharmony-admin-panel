const handleResponse = async response => {
  let data;

  try {
    const text = await response.text();
    data = text ? JSON.parse(text) : {};
  } catch (error) {
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

// Get all users (admin only)
export const fetchUsers = async () => {
  const res = await fetch('/api/auth/users', {
    credentials: 'include',
  });
  const data = await handleResponse(res);

  // Normalize response to always return an array
  if (Array.isArray(data)) {
    return data;
  } else if (data && Array.isArray(data.data)) {
    return data.data;
  } else if (data && Array.isArray(data.users)) {
    return data.users;
  } else {
    return [];
  }
};

// Get current user profile
export const fetchCurrentUser = async () => {
  const res = await fetch('/api/auth/users/current', {
    credentials: 'include',
  });
  const data = await handleResponse(res);
  return { data: data.data || data.user || data || null };
};

// Create new user (admin only)
export const createUser = async userData => {
  const res = await fetch('/api/auth/register', {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userData),
  });
  const data = await handleResponse(res);
  return { data: data.data || data.user || null };
};

// Update user (admin only)
export const updateUser = async (userId, userData) => {
  const res = await fetch(`/api/auth/users/${userId}`, {
    method: 'PATCH',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userData),
  });
  const data = await handleResponse(res);
  return { data: data.data || data.user || null };
};

// Delete user (admin only)
export const deleteUser = async userId => {
  const res = await fetch(`/api/auth/users/${userId}`, {
    method: 'DELETE',
    credentials: 'include',
  });
  await handleResponse(res);
  return { success: true };
};
