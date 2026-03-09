// public/auth.js
(function() {
  // Використовуємо відносний шлях – так буде працювати і локально, і на Render
  const API_URL = '';


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

  // ========== Отримання поточного користувача ==========
  function getCurrentUser() {
    // Спочатку перевіряємо збережений email
    const storedEmail = getUserEmail();
    if (storedEmail) return storedEmail;

    // Якщо немає, пробуємо отримати з токена і зберегти
    const token = getToken();
    if (!token) return null;
    
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const payload = JSON.parse(atob(base64));
      if (payload.email) {
        setUserEmail(payload.email); // зберігаємо на майбутнє
        return payload.email;
      }
    } catch (error) {
      console.error('Помилка декодування токена:', error);
    }
    return null;
  }

  // ========== Реєстрація ==========
  async function register(name, email, phone, password) {
    try {
      console.log('Відправка запиту на реєстрацію:', { name, email, phone, password });
      const response = await fetch(`${API_URL}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, phone, password })
      });
      
      const data = await response.json();
      console.log('Відповідь сервера:', data);
      
      if (data.success && data.token) {
        setToken(data.token);
        setUserEmail(data.user?.email || email);
        return { success: true, user: data.user };
      } else {
        return { success: false, message: data.message || 'Помилка реєстрації' };
      }
    } catch (error) {
      console.error('Помилка реєстрації:', error);
      return { success: false, message: 'Помилка з\'єднання з сервером' };
    }
  }

  // ========== Вхід ==========
  async function login(email, password) {
    console.log('=== ПОЧАТОК ВХОДУ ===');
    console.log('Email:', email);
    
    try {
      console.log('Відправка запиту на:', `${API_URL}/login`);
      
      const response = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });
      
      console.log('Статус відповіді:', response.status);
      
      const textResponse = await response.text();
      console.log('Текст відповіді:', textResponse);
      
      let data;
      try {
        data = JSON.parse(textResponse);
        console.log('Розпарсений JSON:', data);
      } catch (e) {
        console.error('Помилка парсингу JSON:', e);
        return { success: false, message: 'Невірний формат відповіді сервера' };
      }
      
      if (data.success && data.token) {
        console.log('Вхід успішний, токен отримано');
        setToken(data.token);
        setUserEmail(data.user?.email || email);
        return { success: true, user: data.user };
      } else {
        console.log('Вхід невдалий:', data.message);
        return { success: false, message: data.message || 'Невірний email або пароль' };
      }
    } catch (error) {
      console.error('Помилка при запиті:', error);
      return { success: false, message: 'Помилка з\'єднання з сервером' };
    } finally {
      console.log('=== КІНЕЦЬ ВХОДУ ===');
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
      const data = await response.json();
      return data.success ? data.user : null;
    } catch (error) {
      console.error('Помилка отримання даних:', error);
      return null;
    }
  }

  // ========== Перевірка авторизації ==========
  function requireAuth() {
    if (!getToken()) {
      window.location.href = 'login.html';
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
      const data = await response.json();
      return data.success ? data.favorites : [];
    } catch (error) {
      console.error('Помилка отримання улюблених:', error);
      return [];
    }
  }

  async function toggleFavorite(item) {
    const token = getToken();
    if (!token) {
      return { success: false, message: 'Не авторизовано' };
    }
    
    try {
      const response = await fetch(`${API_URL}/favorites`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(item)
      });
      return await response.json();
    } catch (error) {
      console.error('Помилка додавання в улюблені:', error);
      return { success: false, message: 'Помилка з\'єднання з сервером' };
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
      const data = await response.json();
      return data.success ? data.bookings : [];
    } catch (error) {
      console.error('Помилка отримання бронювань:', error);
      return [];
    }
  }

  async function addBooking(booking) {
    const token = getToken();
    if (!token) {
      return { success: false, message: 'Не авторизовано' };
    }
    
    try {
      const response = await fetch(`${API_URL}/bookings`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(booking)
      });
      return await response.json();
    } catch (error) {
      console.error('Помилка бронювання:', error);
      return { success: false, message: 'Помилка з\'єднання з сервером' };
    }
  }

  async function deleteBooking(title) {
    const token = getToken();
    if (!token) {
      return { success: false, message: 'Не авторизовано' };
    }
    
    try {
      const response = await fetch(`${API_URL}/bookings/${encodeURIComponent(title)}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      return await response.json();
    } catch (error) {
      console.error('Помилка видалення бронювання:', error);
      return { success: false, message: 'Помилка з\'єднання з сервером' };
    }
  }
function getUserFromToken() {
  const token = getToken();
  if (!token) return null;
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const payload = JSON.parse(atob(base64));
    return { name: payload.name || 'Користувач', email: payload.email };
  } catch {
    return null;
  }
}
  // Експорт
  window.auth = {
    getCurrentUser,
    logout,
    requireAuth,
    register,
    login,
    getUserData,
    getToken,
    getFavorites,
    toggleFavorite,
    getBookings,
    addBooking,
    deleteBooking
  };
})();