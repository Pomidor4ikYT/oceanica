// admin.js
(function() {
  const qs = (sel) => document.querySelector(sel);
  const qsa = (sel) => Array.from(document.querySelectorAll(sel));

  // Поточні теги
  let currentTags = [];
  // Поточні дати
  let currentDates = [];
  // Поточний тип
  let currentType = 'tour';

  // Конфігурація для різних типів
  const typeConfig = {
    tour: {
      name: 'тур',
      categories: [
        { value: 'beach', label: '🏖️ Пляжний' },
        { value: 'excursion', label: '🏛️ Екскурсійний' },
        { value: 'mountain', label: '⛰️ Гірський' }
      ],
      badges: [
        { value: '🏖️ Пляжний', label: '🏖️ Пляжний' },
        { value: '🏛️ Екскурсійний', label: '🏛️ Екскурсійний' },
        { value: '⛰️ Гірський', label: '⛰️ Гірський' },
        { value: '🔥 Гаряча пропозиція', label: '🔥 Гаряча пропозиція' },
        { value: '-20%', label: '-20%' },
        { value: '-15%', label: '-15%' },
        { value: '-10%', label: '-10%' }
      ],
      tags: [
        '🏖️ Пляжі', '🏛️ Античність', '⛰️ Гори', '🤿 Дайвінг', '💆 SPA',
        '🚌 Екскурсії', '💕 Романтика', '🧗 Пригоди', '🍹 All Inclusive',
        '🍳 Сніданки', '🏡 Вілли', '🌊 Лагуна', '🐠 Рифи', '🛕 Храми'
      ]
    },
    cruise: {
      name: 'круїз',
      categories: [
        { value: 'warm', label: '☀️ Теплі води' },
        { value: 'cold', label: '❄️ Холодні води' },
        { value: 'temperate', label: '🌊 Помірні води' }
      ],
      badges: [
        { value: '☀️ Теплі води', label: '☀️ Теплі води' },
        { value: '❄️ Холодні води', label: '❄️ Холодні води' },
        { value: '🌊 Помірні води', label: '🌊 Помірні води' },
        { value: '🔥 Гаряча пропозиція', label: '🔥 Гаряча пропозиція' },
        { value: '-20%', label: '-20%' },
        { value: '-15%', label: '-15%' }
      ],
      tags: [
        '🌊 Океан', '🚢 Лайнер', '🏝️ Острови', '🍽️ Ресторани',
        '🎭 Шоу', '🏊 Бассейн', '🍹 Коктейлі', '🤿 Снорклінг'
      ]
    },
    island: {
      name: 'острів',
      categories: [
        { value: 'tropical', label: '🏝️ Тропічний' },
        { value: 'volcanic', label: '🌋 Вулканічний' },
        { value: 'exotic', label: '✨ Екзотичний' }
      ],
      badges: [
        { value: '🏝️ Тропічний', label: '🏝️ Тропічний' },
        { value: '🌋 Вулканічний', label: '🌋 Вулканічний' },
        { value: '✨ Екзотичний', label: '✨ Екзотичний' },
        { value: '🔥 Гаряча пропозиція', label: '🔥 Гаряча пропозиція' },
        { value: '-20%', label: '-20%' }
      ],
      tags: [
        '🏝️ Пляж', '🌴 Пальми', '🐠 Рифи', '🤿 Снорклінг',
        '🌋 Вулкан', '💆 SPA', '🏡 Бунгало', '🌅 Захід сонця'
      ]
    },
    hot: {
      name: 'гаряча путівка',
      categories: [
        { value: 'beach', label: '🏖️ Пляжний' },
        { value: 'excursion', label: '🏛️ Екскурсійний' },
        { value: 'mountain', label: '⛰️ Гірський' },
        { value: 'tropical', label: '🏝️ Тропічний' }
      ],
      badges: [
        { value: '-20%', label: '-20%' },
        { value: '-15%', label: '-15%' },
        { value: '-10%', label: '-10%' },
        { value: '-25%', label: '-25%' },
        { value: '-30%', label: '-30%' },
        { value: '🔥 Гаряча пропозиція', label: '🔥 Гаряча пропозиція' }
      ],
      tags: [
        '🔥 Гаряче', '💯 Знижка', '🎁 Спецпропозиція',
        '✈️ Швидко', '🏨 Готель', '🍹 All Inclusive'
      ]
    }
  };

  // Перевірка авторизації та прав адміністратора
  async function checkAdminAccess() {
    const token = window.auth?.getToken();
    if (!token) {
      window.location.href = 'login.html';
      return false;
    }

    try {
      const userData = await window.auth.getUserData();
      if (!userData || userData.role !== 'admin') {
        showToast('❌ Доступ заборонено. Потрібні права адміністратора', 'error');
        setTimeout(() => {
          window.location.href = 'index.html';
        }, 2000);
        return false;
      }
      return true;
    } catch (error) {
      console.error('Помилка перевірки прав:', error);
      showToast('Помилка перевірки прав доступу', 'error');
      return false;
    }
  }

  // Показ повідомлень
  function showToast(msg, type = 'success') {
    const old = document.querySelector('.toast-notification');
    if (old) old.remove();

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

  // Оновлення селектів відповідно до типу
  function updateSelectsForType(type) {
    const config = typeConfig[type] || typeConfig.tour;
    currentType = type;

    // Оновлюємо селект категорій
    const categorySelect = qs('#category');
    if (categorySelect) {
      categorySelect.innerHTML = '<option value="">Оберіть категорію</option>' +
        config.categories.map(c => `<option value="${c.value}">${c.label}</option>`).join('');
    }

    // Оновлюємо селект бейджів
    const badgeSelect = qs('#badge');
    if (badgeSelect) {
      badgeSelect.innerHTML = '<option value="">Оберіть бейдж</option>' +
        config.badges.map(b => `<option value="${b.value}">${b.label}</option>`).join('');
    }

    // Оновлюємо селект тегів
    const tagsSelect = qs('#tags-select');
    if (tagsSelect) {
      tagsSelect.innerHTML = '<option value="">Оберіть тег</option>' +
        config.tags.map(t => `<option value="${t}">${t}</option>`).join('');
    }
  }

  // Завантаження даних за типом
  async function loadItems(type) {
    try {
      const token = window.auth.getToken();
      const response = await fetch(`/admin/${type}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      
      if (data.success) {
        renderItems(type, data.items);
      } else {
        showToast('Помилка завантаження даних', 'error');
      }
    } catch (error) {
      console.error('Помилка:', error);
      showToast('Помилка з\'єднання', 'error');
    }
  }

  // Відображення карток
  function renderItems(type, items) {
    const grid = qs(`#${type}-grid`);
    if (!grid) return;

    const typeName = typeConfig[type]?.name || type;

    let html = `<div class="add-card" onclick="openAddModal('${type}')">
      <div class="add-card-content">
        <span class="add-icon">+</span>
        <span class="add-text">Додати ${typeName}</span>
      </div>
    </div>`;

    if (items && items.length > 0) {
      html += items.map(item => {
        const chips = item.chips ? (typeof item.chips === 'string' ? JSON.parse(item.chips) : item.chips) : [];
        
        return `
          <div class="admin-card" data-id="${item.id}">
            <div class="admin-card-image" style="background-image: url('${item.image || 'images/placeholder.jpg'}')">
              <span class="admin-card-badge">${item.badge || typeName}</span>
            </div>
            <div class="admin-card-body">
              <h3 class="admin-card-title">${item.title}</h3>
              <div class="admin-card-price">${item.price}</div>
              <div class="admin-card-meta">${item.meta || item.duration || ''}</div>
              <div class="admin-card-chips">
                ${chips.slice(0, 3).map(chip => `<span class="admin-chip">${chip}</span>`).join('')}
              </div>
              <div class="admin-card-actions">
                <button class="btn-outline" onclick="editItem('${type}', ${item.id})">✏️ Редагувати</button>
                <button class="btn-danger" onclick="deleteItem('${type}', ${item.id})">🗑️ Видалити</button>
              </div>
            </div>
          </div>
        `;
      }).join('');
    }

    grid.innerHTML = html;
  }

  // Відкриття модального вікна для додавання
  window.openAddModal = function(type) {
    const modal = qs('#itemModal');
    const form = qs('#itemForm');
    
    qs('#modalTitle').textContent = `Додати ${typeConfig[type]?.name || type}`;
    qs('#itemType').value = type;
    qs('#itemId').value = '';
    
    // Оновлюємо селекти
    updateSelectsForType(type);
    
    // Очищаємо форму
    form.reset();
    currentTags = [];
    currentDates = [];
    updateSelectedTagsDisplay();
    updateDatesDisplay();
    
    modal.classList.add('active');
  };

  // Редагування елемента
  window.editItem = async function(type, id) {
    try {
      const token = window.auth.getToken();
      const response = await fetch(`/admin/${type}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      
      if (data.success) {
        const item = data.items.find(i => i.id == id);
        if (item) {
          fillEditForm(type, item);
        }
      }
    } catch (error) {
      console.error('Помилка:', error);
      showToast('Помилка завантаження даних', 'error');
    }
  };

  // Заповнення форми для редагування
  function fillEditForm(type, item) {
    const modal = qs('#itemModal');
    
    qs('#modalTitle').textContent = `Редагувати ${typeConfig[type]?.name || type}`;
    qs('#itemType').value = type;
    qs('#itemId').value = item.id;
    
    // Оновлюємо селекти
    updateSelectsForType(type);
    
    // Заповнюємо поля
    qs('#title').value = item.title || '';
    
    // Видаляємо "грн" з ціни для редагування
    const priceValue = item.price ? item.price.replace(' грн', '') : '';
    qs('#price').value = priceValue;
    
    // Видаляємо "ночей" з тривалості
    const durationValue = item.duration ? item.duration.replace(' ночей', '').replace(' днів', '') : '';
    qs('#duration').value = durationValue;
    
    // Видаляємо "осіб" з розміру групи
    const groupValue = item.groupSize ? item.groupSize.replace(' осіб', '') : '';
    qs('#groupSize').value = groupValue;
    
    // Видаляємо "Готель" з проживання, якщо це число
    const accomValue = item.accommodation ? item.accommodation.replace('Готель ', '').replace('*', '') : '';
    qs('#accommodation').value = accomValue;
    
    qs('#badge').value = item.badge || '';
    qs('#category').value = item.category || '';
    qs('#meta').value = item.meta || '';
    qs('#image').value = item.image || '';
    qs('#description').value = item.description || '';
    
    // Дати
    currentDates = item.departuredates ? (typeof item.departuredates === 'string' ? JSON.parse(item.departuredates) : item.departuredates) : [];
    updateDatesDisplay();
    
    // Теги
    currentTags = item.chips ? (typeof item.chips === 'string' ? JSON.parse(item.chips) : item.chips) : [];
    updateSelectedTagsDisplay();
    
    modal.classList.add('active');
  }

  // Оновлення відображення дат
  function updateDatesDisplay() {
    const container = qs('#datesContainer');
    if (!container) return;

    let html = '';
    currentDates.forEach((date, index) => {
      html += `
        <div class="date-input-row" style="display: flex; gap: 10px; margin-bottom: 10px;">
          <input type="text" class="form-input date-input" value="${date}" placeholder="ДД.ММ.РРРР">
          <button type="button" class="btn-outline remove-date" data-index="${index}" style="padding: 0.5rem 1rem;">✕</button>
        </div>
      `;
    });

    html += `
      <div class="date-input-row" style="display: flex; gap: 10px; margin-bottom: 10px;">
        <input type="text" class="form-input date-input" placeholder="ДД.ММ.РРРР">
        <button type="button" class="btn-outline add-date" style="padding: 0.5rem 1rem;">+</button>
      </div>
    `;

    container.innerHTML = html;

    // Додаємо обробники
    container.querySelectorAll('.add-date').forEach(btn => {
      btn.addEventListener('click', () => {
        const row = btn.closest('.date-input-row');
        const input = row.querySelector('.date-input');
        if (input.value.trim()) {
          currentDates.push(input.value.trim());
          updateDatesDisplay();
        }
      });
    });

    container.querySelectorAll('.remove-date').forEach(btn => {
      btn.addEventListener('click', () => {
        const index = btn.dataset.index;
        if (index !== undefined) {
          currentDates.splice(index, 1);
          updateDatesDisplay();
        }
      });
    });
  }

  // Оновлення відображення вибраних тегів
  function updateSelectedTagsDisplay() {
    const container = qs('#selected-tags');
    if (!container) return;

    if (currentTags.length === 0) {
      container.innerHTML = '';
      return;
    }

    container.innerHTML = currentTags.map((tag, index) => `
      <span class="tag-item">
        ${tag}
        <span class="remove-tag" onclick="removeTag(${index})">✕</span>
      </span>
    `).join('');
  }

  // Видалення тегу
  window.removeTag = function(index) {
    currentTags.splice(index, 1);
    updateSelectedTagsDisplay();
  };

  // Додавання тегу
  function addTag(tag) {
    if (tag && !currentTags.includes(tag)) {
      currentTags.push(tag);
      updateSelectedTagsDisplay();
    }
  }

  // Закриття модального вікна
  window.closeModal = function() {
    qs('#itemModal').classList.remove('active');
  };

  // Видалення елемента
  window.deleteItem = async function(type, id) {
    if (!confirm('Ви впевнені, що хочете видалити цей запис?')) return;
    
    try {
      const token = window.auth.getToken();
      const response = await fetch(`/admin/${type}/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      
      if (data.success) {
        showToast('Запис видалено', 'success');
        loadItems(type);
      } else {
        showToast(data.message || 'Помилка видалення', 'error');
      }
    } catch (error) {
      console.error('Помилка:', error);
      showToast('Помилка з\'єднання', 'error');
    }
  };

  // Збереження форми
  qs('#itemForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const type = qs('#itemType').value;
    const id = qs('#itemId').value;
    const isEdit = !!id;

    // Додаємо тег з поля вводу, якщо є
    const chipsInput = qs('#chipsInput');
    if (chipsInput.value.trim()) {
      addTag(chipsInput.value.trim());
      chipsInput.value = '';
    }

    // Форматуємо дані
    const price = qs('#price').value;
    const duration = qs('#duration').value;
    const groupSize = qs('#groupSize').value;
    const accommodation = qs('#accommodation').value;

    // Форматуємо тривалість
    let formattedDuration = duration;
    if (duration && !isNaN(duration)) {
      formattedDuration = duration + (type === 'tour' || type === 'island' ? ' ночей' : ' днів');
    }

    // Форматуємо розмір групи
    let formattedGroup = groupSize;
    if (groupSize && !isNaN(groupSize)) {
      formattedGroup = groupSize + ' осіб';
    }

    // Форматуємо проживання
    let formattedAccom = accommodation;
    if (accommodation && !isNaN(accommodation)) {
      formattedAccom = 'Готель ' + accommodation + '*';
    }

    // Збираємо дані
    const formData = {
      title: qs('#title').value,
      price: price,
      duration: formattedDuration,
      groupSize: formattedGroup,
      accommodation: formattedAccom,
      badge: qs('#badge').value,
      category: qs('#category').value,
      meta: qs('#meta').value,
      image: qs('#image').value,
      description: qs('#description').value,
      departureDates: currentDates,
      chips: currentTags
    };

    // Перевірка обов'язкових полів
    if (!formData.title || !formData.price) {
      showToast('Назва та ціна обов\'язкові', 'error');
      return;
    }

    console.log('Відправляємо дані:', formData);

    try {
      const token = window.auth.getToken();
      const url = isEdit ? `/admin/${type}/${id}` : `/admin/${type}`;
      const method = isEdit ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });
      
      const data = await response.json();
      console.log('Відповідь сервера:', data);
      
      if (data.success) {
        showToast(isEdit ? 'Запис оновлено' : 'Запис додано', 'success');
        closeModal();
        loadItems(type);
      } else {
        showToast(data.message || 'Помилка збереження', 'error');
      }
    } catch (error) {
      console.error('Помилка:', error);
      showToast('Помилка з\'єднання: ' + error.message, 'error');
    }
  });

  // Завантаження користувачів
  async function loadUsers() {
    try {
      const token = window.auth.getToken();
      const response = await fetch('/admin/users', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      
      if (data.success) {
        renderUsers(data.users);
      }
    } catch (error) {
      console.error('Помилка завантаження користувачів:', error);
    }
  }

  // Відображення користувачів
  function renderUsers(users) {
    const grid = qs('#users-grid');
    if (!grid) return;

    if (!users || users.length === 0) {
      grid.innerHTML = '<p class="empty-message">Немає користувачів</p>';
      return;
    }

    grid.innerHTML = `
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Ім'я</th>
            <th>Email</th>
            <th>Телефон</th>
            <th>Дата реєстрації</th>
            <th>Роль</th>
            <th>Дії</th>
          </tr>
        </thead>
        <tbody>
          ${users.map(user => `
            <tr>
              <td>${user.id}</td>
              <td>${user.name}</td>
              <td>${user.email}</td>
              <td>${user.phone || '-'}</td>
              <td>${user.registered}</td>
              <td>
                <span class="role-badge ${user.role === 'admin' ? 'admin' : ''}">${user.role}</span>
              </td>
              <td>
                <select class="role-select" onchange="changeUserRole(${user.id}, this.value)">
                  <option value="user" ${user.role === 'user' ? 'selected' : ''}>Користувач</option>
                  <option value="admin" ${user.role === 'admin' ? 'selected' : ''}>Адмін</option>
                </select>
              </td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    `;
  }

  // Зміна ролі користувача
  window.changeUserRole = async function(userId, newRole) {
    try {
      const token = window.auth.getToken();
      const response = await fetch(`/admin/users/${userId}/role`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ role: newRole })
      });
      
      const data = await response.json();
      if (data.success) {
        showToast('Роль оновлено', 'success');
      } else {
        showToast(data.message || 'Помилка', 'error');
      }
    } catch (error) {
      console.error('Помилка:', error);
      showToast('Помилка з\'єднання', 'error');
    }
  };

  // Завантаження всіх бронювань
  async function loadAllBookings() {
    try {
      const token = window.auth.getToken();
      const response = await fetch('/admin/bookings/all', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      
      if (data.success) {
        renderBookings(data.bookings);
      }
    } catch (error) {
      console.error('Помилка завантаження бронювань:', error);
    }
  }

  // Відображення бронювань
  function renderBookings(bookings) {
    const grid = qs('#bookings-grid');
    if (!grid) return;

    if (!bookings || bookings.length === 0) {
      grid.innerHTML = '<p class="empty-message">Немає бронювань</p>';
      return;
    }

    grid.innerHTML = `
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Користувач</th>
            <th>Email</th>
            <th>Тур</th>
            <th>Ціна</th>
            <th>Дата заїзду</th>
            <th>Категорія</th>
          </tr>
        </thead>
        <tbody>
          ${bookings.map(booking => `
            <tr>
              <td>${booking.id}</td>
              <td>${booking.user_name}</td>
              <td>${booking.user_email}</td>
              <td>${booking.title}</td>
              <td>${booking.price || '-'}</td>
              <td>${booking.bookingdate || '-'}</td>
              <td>${booking.category || '-'}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    `;
  }

  // Ініціалізація вкладок
  function initTabs() {
    const tabs = qsa('.admin-tab');
    const contents = qsa('.tab-content');

    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        const tabName = tab.dataset.tab;
        
        tabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        
        contents.forEach(c => c.classList.remove('active'));
        qs(`#${tabName}-tab`).classList.add('active');
        
        // Завантажуємо дані для відповідної вкладки
        if (['tours', 'cruises', 'islands', 'hot'].includes(tabName)) {
          const type = tabName === 'tours' ? 'tour' : 
                      tabName === 'cruises' ? 'cruise' :
                      tabName === 'islands' ? 'island' : 'hot';
          loadItems(type);
        } else if (tabName === 'users') {
          loadUsers();
        } else if (tabName === 'bookings') {
          loadAllBookings();
        }
      });
    });
  }

  // Додаємо обробники
  function setupEventListeners() {
    // Додавання тегу з випадаючого списку
    const tagsSelect = qs('#tags-select');
    if (tagsSelect) {
      tagsSelect.addEventListener('change', () => {
        if (tagsSelect.value) {
          addTag(tagsSelect.value);
          tagsSelect.value = '';
        }
      });
    }

    // Додавання тегу з поля вводу
    const addTagBtn = qs('#addTagBtn');
    if (addTagBtn) {
      addTagBtn.addEventListener('click', () => {
        const input = qs('#chipsInput');
        if (input.value.trim()) {
          addTag(input.value.trim());
          input.value = '';
        }
      });
    }

    // Додавання тегу через Enter
    const chipsInput = qs('#chipsInput');
    if (chipsInput) {
      chipsInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          if (chipsInput.value.trim()) {
            addTag(chipsInput.value.trim());
            chipsInput.value = '';
          }
        }
      });
    }

    // Попередній перегляд зображення
    const imageFile = qs('#imageFile');
    if (imageFile) {
      imageFile.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = (event) => {
            qs('#image').value = event.target.result;
            const preview = qs('#imagePreview');
            preview.style.display = 'block';
            preview.querySelector('img').src = event.target.result;
          };
          reader.readAsDataURL(file);
        }
      });
    }
  }

  // Ініціалізація
  window.addEventListener('DOMContentLoaded', async () => {
    const hasAccess = await checkAdminAccess();
    if (!hasAccess) return;

    qs('#loading-spinner').style.display = 'none';
    qs('#app-content').style.display = 'block';

    initTabs();
    setupEventListeners();
    
    // Завантажуємо тури за замовчуванням
    loadItems('tour');
  });
})();