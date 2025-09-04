export const login = async (email, password) => {
  try {
    console.log('🔐 login: надсилаємо запит...');
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include', // 🔹 щоб бекенд міг встановити cookie
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status} ${response.statusText}`);
    }

    const responseData = await response.json();
    console.log('✅ login: responseData:', responseData);

    // Перевіряємо, чи є дані користувача в відповіді
    let userData = null;

    if (responseData.data) {
      console.log('✅ login: знайдено дані користувача в responseData.data');
      userData = responseData.data;
    } else if (responseData.user) {
      console.log('✅ login: знайдено дані користувача в responseData.user');
      userData = responseData.user;
    } else {
      console.warn('⚠️ login: дані користувача відсутні, створюємо базові дані');

      // Створюємо базові дані користувача на основі email
      userData = {
        name: email.split('@')[0], // Беремо частину до @ як ім'я
        role: 'admin', // За замовчуванням admin
        email: email,
        id: Date.now(), // Унікальний ID
      };

      console.log('✅ login: створені базові дані користувача:', userData);
    }

    // Зберігаємо дані користувача в localStorage
    if (userData) {
      localStorage.setItem('inharmony_user', JSON.stringify(userData));
      console.log('💾 login: зберегли користувача в localStorage');
    }

    return { success: true, data: userData };
  } catch (error) {
    console.error('❌ login: помилка:', error);
    return { success: false, reason: `API помилка: ${error.message}` };
  }
};

export const logout = async () => {
  try {
    console.log('🔐 logout: надсилаємо запит...');
    const response = await fetch('/api/auth/logout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
    });

    if (response.status === 204 || response.status === 403 || response.ok) {
      console.log('✅ logout: успішно або вже розлогінений');
      return { success: true };
    }

    throw new Error(`API returned unexpected status: ${response.status}`);
  } catch (error) {
    console.error('❌ logout: помилка:', error);
    return { success: false, reason: `API помилка: ${error.message}` };
  }
};
export const getCurrentUser = async () => {
  try {
    const storedUser = localStorage.getItem('inharmony_user');
    if (storedUser) {
      return { success: true, data: JSON.parse(storedUser) };
    }
    return { success: false, data: null, reason: 'Користувач не знайдений у localStorage' };
  } catch (error) {
    return { success: false, data: null, reason: `Помилка читання localStorage: ${error.message}` };
  }
};
