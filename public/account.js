// public/account.js
(function() {
  const qs = (sel) => document.querySelector(sel);
  const qsa = (sel) => Array.from(document.querySelectorAll(sel));

  // Перевірка авторизації
  if (!window.auth?.getToken()) {
    window.location.href = 'login.html';
    return;
  }

  // Показуємо контент
  document.getElementById('loading-spinner').style.display = 'none';
  document.getElementById('app-content').style.display = 'block';

  let favorites = [];
  let bookings = [];

  // Завантаження даних з сервера
  async function loadData() {
    try {
      favorites = await window.auth.getFavorites();
      bookings = await window.auth.getBookings();
      updateStats();
      renderBooked();
      renderFavorites();
    } catch (error) {
      console.error('Помилка завантаження даних:', error);
      showToast('Помилка завантаження даних', 'error');
    }
  }

  // Оновлення статистики
  function updateStats() {
    const bookedCount = bookings.length;
    const favCount = favorites.length;
    const total = bookedCount + favCount;

    // Сума витрат
    const totalSpent = bookings.reduce((sum, b) => {
      const price = parseInt(b.price?.replace(/\D/g, '')) || 0;
      return sum + price;
    }, 0);

    // Найчастіша категорія
    const categoryCount = {};
    favorites.forEach(f => {
      const cat = f.category || 'інше';
      categoryCount[cat] = (categoryCount[cat] || 0) + 1;
    });
    let favCat = '—';
    let max = 0;
    for (const [cat, count] of Object.entries(categoryCount)) {
      if (count > max) {
        max = count;
        favCat = cat;
      }
    }
    const catEmoji = {
      beach: '🏖️',
      excursion: '🏛️',
      mountain: '⛰️',
      tropical: '🏝️',
      volcanic: '🌋',
      exotic: '✨',
      warm: '☀️',
      cold: '❄️',
      temperate: '🌊'
    };
    favCat = catEmoji[favCat] || favCat;

    qs('#bookedCount').textContent = bookedCount;
    qs('#favoritesCount').textContent = favCount;
    qs('#totalTrips').textContent = total;
    qs('#totalSpent').textContent = totalSpent.toLocaleString() + ' грн';
    qs('#favCategory').textContent = favCat;
  }

  // Завантаження профілю
  async function loadUserProfile() {
    try {
      const userData = await window.auth.getUserData();
      if (userData) {
        qs('.profile-info h3').textContent = userData.name;
        qs('.profile-info p:nth-child(2)').textContent = userData.email;
        qs('.profile-info p:nth-child(3)').textContent = userData.phone || 'не вказано';
        qs('.profile-info p:nth-child(4)').textContent = `Дата реєстрації: ${userData.registered}`;
        qs('.avatar-large').textContent = userData.name.charAt(0).toUpperCase();
      }
    } catch (error) {
      console.error('Помилка завантаження профілю:', error);
    }
  }

  // Функція створення картки
  function createCardFromItem(item, type) {
    const chipsHtml = (item.chips || []).map(chip => `<span class="chip">${chip}</span>`).join('');
    const badge = item.badge || (type === 'booked' ? '✅ Заброньовано' : '❤️ Улюблене');
    const dateInfo = item.bookingDate ? `<p style="margin-top: 0.5rem; color: #0f4c81;">Заїзд: ${item.bookingDate}</p>` : '';

    return `
      <article class="card" data-category="${item.category || ''}" data-id="${item.id || item.title}">
        <div class="card-img-wrap">
          <img class="card-img" src="${item.image}" alt="${item.title}" />
          <span class="badge">${badge}</span>
          ${type === 'favorite' ? '<button class="fav active" title="Видалити з улюблених"></button>' : ''}
        </div>
        <div class="card-body">
          <h3 class="card-title">${item.title}</h3>
          <span class="card-meta">${item.meta || ''}</span>
          <span class="card-price">${item.price || ''}</span>
          <div class="chips">${chipsHtml}</div>
          ${dateInfo}
          <div class="card-actions">
            <div class="left-actions">
              ${type === 'booked' 
                ? '<button class="btn-outline cancel-booking" data-id="' + item.id + '">Скасувати бронювання</button>' 
                : '<button class="btn-primary book-again">Забронювати знову</button>'}
            </div>
            <div class="right-actions">
              ${type === 'favorite' ? '<button class="btn-outline remove-fav">Видалити</button>' : ''}
            </div>
          </div>
        </div>
      </article>
    `;
  }

  // Відображення заброньованих
  function renderBooked() {
    const container = qs('#bookedList');
    if (!container) return;

    if (bookings.length === 0) {
      container.innerHTML = '<p class="empty-message">У вас поки немає заброньованих турів.</p>';
      return;
    }

    container.innerHTML = bookings.map(item => createCardFromItem(item, 'booked')).join('');

    qsa('.cancel-booking').forEach(btn => {
      btn.addEventListener('click', async (e) => {
        e.preventDefault();
        const id = btn.dataset.id;
        if (!id) return;
        if (confirm('Скасувати бронювання?')) {
          const result = await window.auth.deleteBooking(id);
          if (result.success) {
            await loadData();
            showToast('Бронювання скасовано', 'info');
          } else {
            showToast(result.message || 'Помилка скасування', 'error');
          }
        }
      });
    });
  }

  // Відображення улюблених
  function renderFavorites() {
    const container = qs('#favoritesList');
    if (!container) return;

    if (favorites.length === 0) {
      container.innerHTML = '<p class="empty-message">У вас поки немає улюблених турів.</p>';
      return;
    }

    container.innerHTML = favorites.map(item => createCardFromItem(item, 'favorite')).join('');

    qsa('.remove-fav').forEach(btn => {
      btn.addEventListener('click', async (e) => {
        e.preventDefault();
        const card = btn.closest('.card');
        const title = qs('.card-title', card)?.textContent?.trim();
        if (title) {
          const result = await window.auth.toggleFavorite({ title });
          if (result.success) {
            await loadData();
            showToast('Видалено з улюблених', 'info');
          } else {
            showToast('Помилка видалення', 'error');
          }
        }
      });
    });

    qsa('.book-again').forEach(btn => {
      btn.addEventListener('click', async (e) => {
        e.preventDefault();
        const card = btn.closest('.card');
        const title = qs('.card-title', card)?.textContent?.trim();
        const item = favorites.find(f => f.title === title);
        if (item) {
          const bookingItem = { ...item, bookingDate: new Date().toLocaleDateString('uk-UA') };
          const result = await window.auth.addBooking(bookingItem);
          if (result.success) {
            await loadData();
            showToast(`Тур "${title}" заброньовано!`, 'success');
          } else {
            showToast('Помилка бронювання', 'error');
          }
        }
      });
    });
  }

  // Ініціалізація вкладок
  function initTabs() {
    const tabs = qsa('.tab-btn');
    const contents = qsa('.tab-content');

    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        const targetId = tab.dataset.tab;
        tabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        contents.forEach(c => {
          c.classList.remove('active');
          if (c.id === targetId) c.classList.add('active');
        });
      });
    });
  }

  // Налаштування
  function initSettings() {
    const saveBtn = qs('.save-settings');
    const nameInput = qs('#settingsName');
    const emailInput = qs('#settingsEmail');
    const phoneInput = qs('#settingsPhone');
    const passwordInput = qs('#settingsPassword');
    const messageDiv = qs('.settings-message');

    saveBtn.addEventListener('click', async (e) => {
      e.preventDefault();
      const updates = {};
      if (nameInput.value.trim()) updates.name = nameInput.value.trim();
      if (emailInput.value.trim()) updates.email = emailInput.value.trim();
      if (phoneInput.value.trim()) updates.phone = phoneInput.value.trim();
      if (passwordInput.value) updates.password = passwordInput.value;

      const result = await window.auth.updateUser(updates);
      if (result.success) {
        messageDiv.textContent = 'Дані успішно оновлено!';
        messageDiv.classList.add('success');
        if (result.token) {
          // оновити токен
          localStorage.setItem('oceanica_token', result.token);
        }
        loadUserProfile(); // оновити профіль
      } else {
        messageDiv.textContent = result.message || 'Помилка оновлення';
        messageDiv.classList.add('error');
      }
      setTimeout(() => {
        messageDiv.textContent = '';
        messageDiv.classList.remove('success', 'error');
      }, 3000);
    });

    // Кнопка виходу
    const settingsForm = qs('.settings-form');
    const logoutBtn = document.createElement('button');
    logoutBtn.textContent = 'Вийти';
    logoutBtn.classList.add('btn-outline', 'logout-btn');
    logoutBtn.addEventListener('click', () => window.auth.logout());
    settingsForm.appendChild(logoutBtn);
  }

  function showToast(msg, type) {
    window.utils?.showToast(msg, type);
  }

  // Ініціалізація при завантаженні
  window.addEventListener('DOMContentLoaded', async () => {
    await loadUserProfile();
    initTabs();
    initSettings();
    await loadData();

    const urlParams = new URLSearchParams(window.location.search);
    const tabParam = urlParams.get('tab');
    if (tabParam) {
      const targetTab = document.querySelector(`.tab-btn[data-tab="${tabParam}"]`);
      if (targetTab) targetTab.click();
    }
  });
})();