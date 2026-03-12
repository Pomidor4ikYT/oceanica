// public/js/admin.js
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
      console.log('👤 Дані користувача в admin.js:', userData);
      
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
      showToast('⚠️ Помилка перевірки прав', 'error');
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

    const categorySelect = qs('#category');
    if (categorySelect) {
      categorySelect.innerHTML = '<option value="">Оберіть категорію</option>' +
        config.categories.map(c => `<option value="${c.value}">${c.label}</option>`).join('');
    }

    const badgeSelect = qs('#badge');
    if (badgeSelect) {
      badgeSelect.innerHTML = '<option value="">Оберіть бейдж</option>' +
        config.badges.map(b => `<option value="${b.value}">${b.label}</option>`).join('');
    }

    const tagsSelect = qs('#tags-select');
    if (tagsSelect) {
      tagsSelect.innerHTML = '<option value="">Оберіть тег</option>' +
        config.tags.map(t => `<option value="${t}">${t}</option>`).join('');
    }
  }

   // Завантаження даних за типом
  async function loadItems(type) {
    console.log(`🔍 Завантаження даних для типу: ${type}`);
    
    try {
      const token = window.auth.getToken();
      const response = await fetch(`/api/admin/${type}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.success && data.items) {
        console.log(`✅ Отримано ${data.items.length} карток з сервера для ${type}`);
        renderItems(type, data.items);
      } else {
        console.log(`❌ Немає даних для ${type}`);
        renderItems(type, []);
      }
    } catch (error) {
      console.error('❌ Помилка завантаження:', error);
      showToast('❌ Помилка завантаження даних з сервера', 'error');
      renderItems(type, []);
    }
  }

  // Відображення карток
  function renderItems(type, items) {
    console.log(`🔄 renderItems для типу: ${type}, елементів:`, items?.length);
    
    // Правильні ID для кожної категорії
    let gridId;
    switch(type) {
      case 'tour':
        gridId = 'tours-grid';
        break;
      case 'cruise':
        gridId = 'cruises-grid';
        break;
      case 'island':
        gridId = 'islands-grid';
        break;
      case 'hot':
        gridId = 'hot-grid';
        break;
      default:
        gridId = `${type}-grid`;
    }
    
    const grid = qs(`#${gridId}`);
    if (!grid) {
      console.error(`❌ Елемент з ID #${gridId} не знайдено!`);
      return;
    }

    const typeName = typeConfig[type]?.name || type;
    const typeNamePlural = type === 'tour' ? 'турів' : 
                          type === 'cruise' ? 'круїзів' : 
                          type === 'island' ? 'островів' : 'путівок';

    // Картка для додавання
    let html = `<div class="add-card" onclick="openAddModal('${type}')" style="cursor: pointer; border: 2px dashed #0f4c81; background: #f0f7ff; border-radius: 16px; min-height: 320px; display: flex; align-items: center; justify-content: center;">
      <div class="add-card-content" style="display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 2rem;">
        <span class="add-icon" style="font-size: 4rem; line-height: 1; color: #0f4c81;">➕</span>
        <span class="add-text" style="font-size: 1.2rem; font-weight: 600; color: #0f4c81; margin-top: 1rem;">Створити новий ${typeName}</span>
        <span style="font-size: 0.9rem; color: #64748b; margin-top: 0.5rem;">Натисніть, щоб додати</span>
      </div>
    </div>`;

    if (items && items.length > 0) {
      html += items.map(item => {
        const chips = item.chips || [];
        const price = item.price || '0 грн';
        let imagePath = item.image || 'images/placeholder.jpg';
        
        return `
          <div class="admin-card" data-id="${item.id}" style="background: #f8fafc; border-radius: 16px; overflow: hidden; border: 1px solid #e2e8f0;">
            <div class="admin-card-image" style="background-image: url('${imagePath}'); background-size: cover; background-position: center; height: 150px; position: relative;">
              <span class="admin-card-badge" style="position: absolute; top: 10px; left: 10px; background: #0f4c81; color: white; padding: 0.2rem 0.8rem; border-radius: 40px; font-size: 0.8rem;">${item.badge || typeName}</span>
            </div>
            <div class="admin-card-body" style="padding: 1rem;">
              <h3 class="admin-card-title" style="font-weight: 700; margin-bottom: 0.5rem; color: #0f4c81;">${item.title}</h3>
              <div class="admin-card-price" style="font-weight: 700; color: #005e00; margin-bottom: 0.5rem;">${price}</div>
              <div class="admin-card-meta" style="font-size: 0.85rem; color: #64748b; margin-bottom: 0.5rem;">${item.meta || item.duration || ''}</div>
              <div class="admin-card-chips" style="display: flex; flex-wrap: wrap; gap: 0.3rem; margin-bottom: 1rem;">
                ${chips.slice(0, 3).map(chip => `<span class="admin-chip" style="background: #e2e8f0; padding: 0.2rem 0.5rem; border-radius: 40px; font-size: 0.7rem;">${chip}</span>`).join('')}
              </div>
              <div class="admin-card-actions" style="display: flex; gap: 0.5rem; justify-content: flex-end;">
                <button class="btn-outline" onclick="editItem('${type}', ${item.id})" style="padding: 0.5rem 1rem; border: 1px solid #0f4c81; background: transparent; color: #0f4c81; border-radius: 40px; cursor: pointer;">✏️ Редагувати</button>
                <button class="btn-danger" onclick="deleteItem('${type}', ${item.id})" style="padding: 0.5rem 1rem; background: #dc2626; color: white; border: none; border-radius: 40px; cursor: pointer;">🗑️ Видалити</button>
              </div>
            </div>
          </div>
        `;
      }).join('');
    } else {
      html += `<div class="empty-message" style="grid-column: 1 / -1; text-align: center; padding: 3rem; background: #f8fafc; border-radius: 24px; border: 2px dashed #cbd5e1;">
        <p style="font-size: 1.1rem; color: #94a3b8;">Немає ${typeNamePlural}. Натисніть кнопку "Створити", щоб додати перший ${typeName}.</p>
      </div>`;
    }

    grid.innerHTML = html;
  }

  // Відкриття модального вікна для додавання
  window.openAddModal = function(type) {
    const modal = qs('#itemModal');
    const form = qs('#itemForm');
    
    qs('#modalTitle').textContent = `➕ Додати новий ${typeConfig[type]?.name || type}`;
    qs('#itemType').value = type;
    qs('#itemId').value = '';
    
    updateSelectsForType(type);
    
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
      const response = await fetch(`/api/admin/${type}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      let item = null;
      
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          item = data.items.find(i => i.id == id);
        }
      }
      
      if (item) {
        fillEditForm(type, item);
      } else {
        showToast('Елемент не знайдено', 'error');
      }
    } catch (error) {
      console.error('Помилка:', error);
      showToast('Помилка завантаження даних', 'error');
    }
  };

  // Заповнення форми для редагування
  function fillEditForm(type, item) {
    const modal = qs('#itemModal');
    
    qs('#modalTitle').textContent = `✏️ Редагувати ${typeConfig[type]?.name || type}`;
    qs('#itemType').value = type;
    qs('#itemId').value = item.id;
    
    updateSelectsForType(type);
    
    qs('#title').value = item.title || '';
    
    const priceValue = item.price ? item.price.replace(' грн', '').replace(/\s/g, '') : '';
    qs('#price').value = priceValue;
    
    const durationValue = item.duration ? item.duration.replace(' ночей', '').replace(' днів', '') : '';
    qs('#duration').value = durationValue;
    
    const groupValue = item.groupSize ? item.groupSize.replace(' осіб', '') : '';
    qs('#groupSize').value = groupValue;
    
    const accomValue = item.accommodation ? item.accommodation.replace('Готель ', '').replace('*', '') : '';
    qs('#accommodation').value = accomValue;
    
    qs('#badge').value = item.badge || '';
    qs('#category').value = item.category || '';
    qs('#meta').value = item.meta || '';
    qs('#image').value = item.image || '';
    qs('#description').value = item.description || '';
    
    currentDates = item.departureDates || [];
    updateDatesDisplay();
    
    currentTags = item.chips || [];
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
        <button type="button" class="btn-outline add-date" style="padding: 0.5rem 1rem;">+ Додати дату</button>
      </div>
    `;

    container.innerHTML = html;

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
      <span class="tag-item" style="background: #0f4c81; color: white; padding: 4px 12px; border-radius: 30px; display: inline-flex; align-items: center; gap: 6px; margin: 2px;">
        ${tag}
        <span class="remove-tag" onclick="removeTag(${index})" style="cursor: pointer; opacity: 0.8;">✕</span>
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
      const response = await fetch(`/api/admin/${type}/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          showToast('✅ Запис видалено', 'success');
          loadItems(type);
          return;
        }
      }
      
      showToast('❌ Помилка видалення', 'error');
      
    } catch (error) {
      console.error('❌ Помилка:', error);
      showToast('❌ Помилка видалення', 'error');
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
      price: price.toString().includes('грн') ? price : price + ' грн',
      duration: formattedDuration,
      groupSize: formattedGroup,
      accommodation: formattedAccom,
      badge: qs('#badge').value,
      category: qs('#category').value,
      meta: qs('#meta').value,
      image: qs('#image').value || 'images/placeholder.jpg',
      description: qs('#description').value || '',
      departureDates: currentDates,
      chips: currentTags
    };

    // Перевірка обов'язкових полів
    if (!formData.title || !price) {
      showToast('❌ Назва та ціна обов\'язкові', 'error');
      return;
    }

    console.log('📝 Відправляємо дані:', formData);

    try {
      const token = window.auth.getToken();
      const url = isEdit ? `/api/admin/${type}/${id}` : `/api/admin/${type}`;
      const method = isEdit ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });
      
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          showToast(isEdit ? '✅ Запис оновлено' : '✅ Запис додано', 'success');
          closeModal();
          loadItems(type);
        } else {
          showToast(data.message || '❌ Помилка', 'error');
        }
      } else {
        showToast(`❌ Помилка сервера: ${response.status}`, 'error');
      }
      
    } catch (error) {
      console.error('❌ Помилка:', error);
      showToast('❌ Помилка з\'єднання з сервером', 'error');
    }
  });

  // Завантаження користувачів
  async function loadUsers() {
    try {
      const token = window.auth.getToken();
      const response = await fetch('/api/admin/users', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          renderUsers(data.users);
          return;
        }
      }
      
      showToast('❌ Помилка завантаження користувачів', 'error');
      
    } catch (error) {
      console.error('Помилка завантаження користувачів:', error);
      showToast('❌ Помилка завантаження користувачів', 'error');
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
      <table style="width: 100%; border-collapse: collapse;">
        <thead>
          <tr style="background: #f1f5f9;">
            <th style="padding: 1rem; text-align: left;">ID</th>
            <th style="padding: 1rem; text-align: left;">Ім'я</th>
            <th style="padding: 1rem; text-align: left;">Email</th>
            <th style="padding: 1rem; text-align: left;">Телефон</th>
            <th style="padding: 1rem; text-align: left;">Дата реєстрації</th>
            <th style="padding: 1rem; text-align: left;">Роль</th>
            <th style="padding: 1rem; text-align: left;">Дії</th>
          </tr>
        </thead>
        <tbody>
          ${users.map(user => `
            <tr style="border-bottom: 1px solid #e2e8f0;">
              <td style="padding: 1rem;">${user.id}</td>
              <td style="padding: 1rem;">${user.name}</td>
              <td style="padding: 1rem;">${user.email}</td>
              <td style="padding: 1rem;">${user.phone || '-'}</td>
              <td style="padding: 1rem;">${user.registered}</td>
              <td style="padding: 1rem;">
                <span class="role-badge ${user.role === 'admin' ? 'admin' : ''}" style="background: ${user.role === 'admin' ? '#0f4c81' : '#e2e8f0'}; color: ${user.role === 'admin' ? 'white' : '#334155'}; padding: 0.2rem 0.8rem; border-radius: 40px;">${user.role}</span>
              </td>
              <td style="padding: 1rem;">
                <select class="role-select" onchange="changeUserRole(${user.id}, this.value)" style="padding: 0.3rem; border-radius: 8px; border: 1px solid #cbd5e1;">
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
      const response = await fetch(`/api/admin/users/${userId}/role`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ role: newRole })
      });
      
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          showToast('✅ Роль оновлено', 'success');
          return;
        }
      }
      
      showToast('❌ Помилка оновлення ролі', 'error');
      
    } catch (error) {
      console.error('Помилка:', error);
      showToast('❌ Помилка оновлення ролі', 'error');
    }
  };

  // Завантаження всіх бронювань
  async function loadAllBookings() {
    try {
      const token = window.auth.getToken();
      const response = await fetch('/api/admin/bookings/all', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          renderBookings(data.bookings);
          return;
        }
      }
      
      showToast('❌ Помилка завантаження бронювань', 'error');
      
    } catch (error) {
      console.error('Помилка завантаження бронювань:', error);
      showToast('❌ Помилка завантаження бронювань', 'error');
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
      <table style="width: 100%; border-collapse: collapse;">
        <thead>
          <tr style="background: #f1f5f9;">
            <th style="padding: 1rem; text-align: left;">ID</th>
            <th style="padding: 1rem; text-align: left;">Користувач</th>
            <th style="padding: 1rem; text-align: left;">Email</th>
            <th style="padding: 1rem; text-align: left;">Тур</th>
            <th style="padding: 1rem; text-align: left;">Ціна</th>
            <th style="padding: 1rem; text-align: left;">Дата заїзду</th>
            <th style="padding: 1rem; text-align: left;">Категорія</th>
          </tr>
        </thead>
        <tbody>
          ${bookings.map(booking => `
            <tr style="border-bottom: 1px solid #e2e8f0;">
              <td style="padding: 1rem;">${booking.id}</td>
              <td style="padding: 1rem;">${booking.user_name}</td>
              <td style="padding: 1rem;">${booking.user_email}</td>
              <td style="padding: 1rem;">${booking.title}</td>
              <td style="padding: 1rem;">${booking.price || '-'}</td>
              <td style="padding: 1rem;">${booking.bookingdate || '-'}</td>
              <td style="padding: 1rem;">${booking.category || '-'}</td>
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
    const tagsSelect = qs('#tags-select');
    if (tagsSelect) {
      tagsSelect.addEventListener('change', () => {
        if (tagsSelect.value) {
          addTag(tagsSelect.value);
          tagsSelect.value = '';
        }
      });
    }

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
    console.log('🚀 admin.js завантажено');

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