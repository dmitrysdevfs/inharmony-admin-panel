export const fetchJson = async (url, options = {}) => {
  const response = await fetch(url, {
    credentials: 'include', // 🔐 для надсилання cookie
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      ...options.headers,
    },
    ...options,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data?.error || `Request failed: ${response.statusText}`);
  }

  return data;
};
