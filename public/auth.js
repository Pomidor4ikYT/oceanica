// public/auth.js
(function() {
  const API_URL = ''; // відносний шлях

  // ========== Робота з токеном ==========
  function setToken(token) {
    if (token) {
      localStorage.setItem('oceanica_token', token);
    } else {
      localStorage.removeItem('oceanica_token');
    }
  }

  function getToken() {
    return localStorage.getItem('oceanica_token');
  }

  // ========== Робота з email ==========
  function setUserEmail(email) {
    if (email) {
      localStorage.setItem('oceanica_user_email', email);
    } else {
      localStorage.removeItem('oceanica_user_email');
    }
  }

  function getUserEmail() {
    return localStorage.getItem('oceanica_user_email');
  }

  // ========== Отримання поточного користувача з токена ==========
  function getUserFromToken() {
    const token = getToken();
    if (!token) return null;
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const payload = JSON.parse(atob(base64));
      // перевірка терміну дії (exp)
      if (payload.exp && Date.now() >= payload.exp * 1000) {
        logout(); // токен прострочений
        return null;
      }
      return { name: payload.name || 'Користувач', email: payload.email };
    } catch {
      return null;
    }
  }

  // ========== Реєстрація ==========
  async function register(name, email, phone, password) {
    try {
      const response = await fetch(`${API_URL}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, phone, password })
      });
      const data = await response.json();
      if (data.success && data.token) {
        setToken(data.token);
        setUserEmail(data.user?.email || email);
        return { success: true, user: data.user };
      } else {
        return { success: false, message: data.message || 'Помилка реєстрації' };
      }
    } catch (error) {
      console.error(error);
      return { success: false, message: 'Помилка з\'єднання з сервером' };
    }
  }

  // ========== Вхід ==========
  async function login(email, password) {
    try {
      const response = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await response.json();
      if (data.success && data.token) {
        setToken(data.token);
        setUserEmail(data.user?.email || email);
        return { success: true, user: data.user };
      } else {
        return { success: false, message: data.message || 'Невірний email або пароль' };
      }
    } catch (error) {
      console.error(error);
      return { success: false, message: 'Помилка з\'єднання з сервером' };
    }
  }

  // ========== Вихід ==========
  function logout() {
    setToken(null);
    setUserEmail(null);
    window.location.href = 'index.html';
  }

  // ========== Отримати дані користувача ==========
  async function getUserData() {
    const token = getToken();
    if (!token) return null;
    try {
      const response = await fetch(`${API_URL}/user`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.status === 401) {
        logout();
        return null;
      }
      const data = await response.json();
      return data.success ? data.user : null;
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  // ========== Перевірка авторизації ==========
  function requireAuth() {
    const user = getUserFromToken();
    if (!user) {
      logout();
      return false;
    }
    return true;
  }

  // ========== Функції для роботи з улюбленими ==========
  async function getFavorites() {
    const token = getToken();
    if (!token) return [];
    try {
      const response = await fetch(`${API_URL}/favorites`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.status === 401) {
        logout();
        return [];
      }
      const data = await response.json();
      return data.success ? data.favorites : [];
    } catch (error) {
      console.error(error);
      return [];
    }
  }

  async function toggleFavorite(item) {
    const token = getToken();
    if (!token) return { success: false, message: 'Не авторизовано' };
    try {
      const response = await fetch(`${API_URL}/favorites`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(item)
      });
      if (response.status === 401) {
        logout();
        return { success: false, message: 'Термін сесії вичерпано' };
      }
      return await response.json();
    } catch (error) {
      console.error(error);
      return { success: false, message: 'Помилка з\'єднання' };
    }
  }

  // ========== Функції для роботи з бронюваннями ==========
  async function getBookings() {
    const token = getToken();
    if (!token) return [];
    try {
      const response = await fetch(`${API_URL}/bookings`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.status === 401) {
        logout();
        return [];
      }
      const data = await response.json();
      return data.success ? data.bookings : [];
    } catch (error) {
      console.error(error);
      return [];
    }
  }

  async function addBooking(booking) {
    const token = getToken();
    if (!token) return { success: false, message: 'Не авторизовано' };
    try {
      const response = await fetch(`${API_URL}/bookings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(booking)
      });
      if (response.status === 401) {
        logout();
        return { success: false, message: 'Термін сесії вичерпано' };
      }
      return await response.json();
    } catch (error) {
      console.error(error);
      return { success: false, message: 'Помилка з\'єднання' };
    }
  }

  async function deleteBooking(id) {
    const token = getToken();
    if (!token) return { success: false, message: 'Не авторизовано' };
    try {
      const response = await fetch(`${API_URL}/bookings/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.status === 401) {
        logout();
        return { success: false, message: 'Термін сесії вичерпано' };
      }
      return await response.json();
    } catch (error) {
      console.error(error);
      return { success: false, message: 'Помилка з\'єднання' };
    }
  }

  // ========== Оновлення даних користувача ==========
  async function updateUser(updates) {
    const token = getToken();
    if (!token) return { success: false, message: 'Не авторизовано' };
    try {
      const response = await fetch(`${API_URL}/user`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(updates)
      });
      if (response.status === 401) {
        logout();
        return { success: false, message: 'Термін сесії вичерпано' };
      }
      return await response.json();
    } catch (error) {
      console.error(error);
      return { success: false, message: 'Помилка з\'єднання' };
    }
  }

  // Експорт
  window.auth = {
    getToken,
    getUserEmail,
    getUserFromToken,
    logout,
    requireAuth,
    register,
    login,
    getUserData,
    getFavorites,
    toggleFavorite,
    getBookings,
    addBooking,
    deleteBooking,
    updateUser
  };
})();