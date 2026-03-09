// account.js
(function() {
  // ========== Допоміжні функції ==========
  const qs = (sel, ctx) => (ctx || document).querySelector(sel);
  const qsa = (sel, ctx) => Array.from((ctx || document).querySelectorAll(sel));

  // ========== Перевірка авторизації ==========
  const token = window.auth?.getToken?.();
  if (!token) {
    window.location.href = 'login.html';
    return; // редірект, контент не покажеться
  }

  // Якщо токен є — показуємо контент і ховаємо спінер
  document.getElementById('loading-spinner').style.display = 'none';
  document.getElementById('app-content').style.display = 'block';

  // ... далі твій код без змін


  // ========== Поточні дані ==========
  let favorites = [];
  let bookings = [];

  // ========== Завантаження даних з сервера ==========
  async function loadData() {
    try {
      // Завантажуємо улюблені
      const favResult = await window.auth.getFavorites();
      favorites = favResult || [];
      
      // Завантажуємо бронювання
      const bookResult = await window.auth.getBookings();
      bookings = bookResult || [];
      
      updateStats();
    } catch (error) {
      console.error('Помилка завантаження даних:', error);
      showToast('Помилка завантаження даних', 'error');
    }
  }

  // ========== Оновлення статистики ==========
  function updateStats() {
    const bookedCount = bookings.length;
    const favCount = favorites.length;
    const total = bookedCount + favCount;
    qs('#bookedCount').textContent = bookedCount;
    qs('#favoritesCount').textContent = favCount;
    qs('#totalTrips').textContent = total;
  }

  // ========== Завантаження даних профілю ==========
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

  // ========== Функція створення HTML картки з даних ==========
  function createCardFromItem(item, type) {
    const chipsHtml = (item.chips || []).map(chip => `<span class="chip">${chip}</span>`).join('');
    const badge = item.badge || (type === 'booked' ? '✅ Заброньовано' : '❤️ Улюблене');

    const dateInfo = item.bookingDate ? `<p style="margin-top: 0.5rem; color: #0f4c81;">Заїзд: ${item.bookingDate}</p>` : '';

    return `
      <article class="card" data-category="${item.category || ''}" data-id="${item.id || item.title}">
        <div class="card-img-wrap">
          <img class="card-img" src="${item.image}" alt="${item.title}" />
          <span class="badge">${badge}</span>
          ${type === 'favorite' 
            ? '<button class="fav active" title="Видалити з улюблених"></button>' 
            : ''}
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
                ? '<button class="btn-outline cancel-booking">Скасувати бронювання</button>' 
                : '<button class="btn-primary book-again">Забронювати знову</button>'}
            </div>
            <div class="right-actions">
              ${type === 'favorite' 
                ? '<button class="btn-outline remove-fav">Видалити</button>' 
                : ''}
            </div>
          </div>
        </div>
      </article>
    `;
  }

  // ========== Відображення заброньованих ==========
  function renderBooked() {
    const container = qs('#bookedList');
    if (!container) return;

    if (bookings.length === 0) {
      container.innerHTML = '<p class="empty-message">У вас поки немає заброньованих турів.</p>';
      return;
    }

    container.innerHTML = bookings.map(item => createCardFromItem(item, 'booked')).join('');

    qsa('.cancel-booking').forEach((btn) => {
      btn.addEventListener('click', async (e) => {
        e.preventDefault();
        const card = btn.closest('.card');
        const title = qs('.card-title', card)?.textContent?.trim();
        if (title && confirm(`Скасувати бронювання "${title}"?`)) {
          const result = await window.auth.deleteBooking(title);
          if (result.success) {
            await loadData();
            renderBooked();
            renderFavorites();
            showToast('Бронювання скасовано', 'info');
          } else {
            showToast('Помилка скасування', 'error');
          }
        }
      });
    });
  }

  // ========== Відображення улюблених ==========
  function renderFavorites() {
    const container = qs('#favoritesList');
    if (!container) return;

    if (favorites.length === 0) {
      container.innerHTML = '<p class="empty-message">У вас поки немає улюблених турів.</p>';
      return;
    }

    container.innerHTML = favorites.map(item => createCardFromItem(item, 'favorite')).join('');

    qsa('.remove-fav').forEach((btn) => {
      btn.addEventListener('click', async (e) => {
        e.preventDefault();
        const card = btn.closest('.card');
        const title = qs('.card-title', card)?.textContent?.trim();
        if (title) {
          const result = await window.auth.toggleFavorite({ title });
          if (result.success) {
            await loadData();
            renderFavorites();
            showToast('Видалено з улюблених', 'info');
          } else {
            showToast('Помилка видалення', 'error');
          }
        }
      });
    });

    qsa('.book-again').forEach((btn) => {
      btn.addEventListener('click', async (e) => {
        e.preventDefault();
        const card = btn.closest('.card');
        const title = qs('.card-title', card)?.textContent?.trim();
        const item = favorites.find(f => f.title === title);
        if (item) {
          const bookingItem = { 
            ...item, 
            bookingDate: new Date().toLocaleDateString('uk-UA') 
          };
          const result = await window.auth.addBooking(bookingItem);
          if (result.success) {
            await loadData();
            renderBooked();
            showToast(`Тур "${title}" заброньовано!`, 'success');
          } else {
            showToast('Помилка бронювання', 'error');
          }
        }
      });
    });
  }

  // ========== Повне оновлення сторінки ==========
  async function refresh() {
    await loadData();
    renderBooked();
    renderFavorites();
  }

  // ========== Перемикання вкладок з анімацією ==========
  function initTabs() {
    const tabs = qsa('.tab-btn');
    const contents = qsa('.tab-content');

    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        const targetId = tab.dataset.tab;

        contents.forEach(c => {
          if (c.classList.contains('active')) {
            c.style.opacity = '0';
            setTimeout(() => {
              c.classList.remove('active');
              c.style.opacity = '';
            }, 150);
          }
        });

        setTimeout(() => {
          tabs.forEach(t => t.classList.remove('active'));
          tab.classList.add('active');

          const target = document.getElementById(targetId);
          target.classList.add('active');
          target.style.opacity = '0';
          setTimeout(() => {
            target.style.opacity = '1';
          }, 20);
        }, 150);
      });
    });
  }

  // ========== Налаштування + кнопка виходу ==========
  function initSettings() {
    const saveBtn = qs('.save-settings');
    const nameInput = qs('#settingsName');
    const emailInput = qs('#settingsEmail');
    const phoneInput = qs('#settingsPhone');
    const passwordInput = qs('#settingsPassword');
    const messageDiv = qs('.settings-message');

    if (saveBtn) {
      saveBtn.addEventListener('click', (e) => {
        e.preventDefault();
        messageDiv.textContent = 'Функція зміни даних тимчасово недоступна';
        messageDiv.classList.add('success');
        setTimeout(() => {
          messageDiv.textContent = '';
          messageDiv.classList.remove('success');
        }, 3000);
      });
    }

    // Додаємо кнопку виходу
    const settingsForm = qs('.settings-form');
    if (settingsForm) {
const logoutBtn = document.createElement('button');
logoutBtn.textContent = 'Вийти';
logoutBtn.classList.add('btn-outline', 'logout-btn'); // додано другий клас
logoutBtn.addEventListener('click', () => {
  window.auth?.logout();
});
settingsForm.appendChild(logoutBtn);
    }
  }

  // ========== Toast-повідомлення ==========
  function showToast(msg, type = 'success') {
    const oldToast = qs('.toast-notification');
    if (oldToast) oldToast.remove();

    const toast = document.createElement('div');
    toast.className = `toast-notification ${type}`;
    toast.textContent = msg;
    document.body.appendChild(toast);

    setTimeout(() => toast.classList.add('show'), 10);
    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => toast.remove(), 300);
    }, 3000);
  }

  // ========== Ініціалізація при завантаженні ==========
  window.addEventListener('DOMContentLoaded', async () => {
    await loadUserProfile();
    initTabs();
    initSettings();
    await refresh();
  });
  // Після ініціалізації вкладок
const urlParams = new URLSearchParams(window.location.search);
const tabParam = urlParams.get('tab');
if (tabParam) {
  const targetTab = document.querySelector(`.tab-btn[data-tab="${tabParam}"]`);
  if (targetTab) targetTab.click();
}
function updateStats() {
  const bookedCount = bookings.length;
  const favCount = favorites.length;
  const total = bookedCount + favCount;
  
  // Приблизна сума (якщо є ціна)
  const totalSpent = bookings.reduce((sum, b) => {
    const price = parseInt(b.price?.replace(/\D/g, '')) || 0;
    return sum + price;
  }, 0);
  
  // Найчастіша категорія в улюблених
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
  // Мапінг категорій на емодзі
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
<div style="text-align: center; margin: 2rem 0;">
  <a href="settings.html" class="btn-outline">⚙️ Налаштування профілю</a>
</div>
})();