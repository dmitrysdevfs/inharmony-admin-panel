import { fetchJson } from '../lib/fetchJson';

const USER_KEY = 'inharmony_user';

// 🔑 Логін
export const login = async (email, password) => {
  try {
    const responseData = await fetchJson('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });

    const userData = responseData.data ||
      responseData.user || {
        name: email.split('@')[0],
        email,
        role: 'admin',
        id: Date.now(),
      };

    localStorage.setItem(USER_KEY, JSON.stringify(userData));
    return { success: true, data: userData };
  } catch (error) {
    console.error('❌ login:', error);
    return { success: false, reason: error.message };
  }
};

// 🚪 Логаут
export const logout = async () => {
  try {
    await fetchJson('/api/auth/logout', { method: 'POST' });
    localStorage.removeItem(USER_KEY);
    return { success: true };
  } catch (error) {
    console.error('❌ logout:', error);
    return { success: false, reason: error.message };
  }
};

// 👤 Отримати поточного користувача
export const getCurrentUser = () => {
  try {
    const storedUser = localStorage.getItem(USER_KEY);
    if (storedUser) {
      return { success: true, data: JSON.parse(storedUser) };
    }
    return { success: false, data: null, reason: 'Користувач не знайдений у localStorage' };
  } catch (error) {
    return { success: false, data: null, reason: `Помилка читання localStorage: ${error.message}` };
  }
};
