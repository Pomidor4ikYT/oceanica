// admin.js
(function() {
  const qs = (sel) => document.querySelector(sel);
  const qsa = (sel) => Array.from(document.querySelectorAll(sel));

  // Поточні теги
  let currentTags = [];

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

    // Зберігаємо картку додавання
    const addCard = grid.querySelector('.add-card');
    
    if (!items || items.length === 0) {
      grid.innerHTML = addCard ? addCard.outerHTML : '';
      return;
    }

    let html = '';
    if (addCard) {
      html = addCard.outerHTML;
    } else {
      html = `<div class="add-card" onclick="openAddModal('${type}')">
        <div class="add-card-content">
          <span class="add-icon">+</span>
          <span class="add-text">Додати ${getTypeName(type)}</span>
        </div>
      </div>`;
    }

    html += items.map(item => {
      const chips = item.chips ? JSON.parse(item.chips) : [];
      
      return `
        <div class="admin-card" data-id="${item.id}">
          <div class="admin-card-image" style="background-image: url('${item.image || 'images/placeholder.jpg'}')">
            <span class="admin-card-badge">${item.badge || 'Тур'}</span>
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

    grid.innerHTML = html;
  }

  // Відкриття модального вікна для додавання
  window.openAddModal = function(type) {
    const modal = qs('#itemModal');
    const form = qs('#itemForm');
    
    qs('#modalTitle').textContent = `Додати ${getTypeName(type)}`;
    qs('#itemType').value = type;
    qs('#itemId').value = '';
    form.reset();
    currentTags = [];
    updateSelectedTagsDisplay();
    
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
    
    qs('#modalTitle').textContent = `Редагувати ${getTypeName(type)}`;
    qs('#itemType').value = type;
    qs('#itemId').value = item.id;
    qs('#title').value = item.title || '';
    qs('#price').value = item.price || '';
    qs('#duration').value = item.duration || '';
    qs('#groupSize').value = item.groupSize || '';
    qs('#accommodation').value = item.accommodation || '';
    qs('#badge').value = item.badge || '';
    qs('#category').value = item.category || '';
    qs('#meta').value = item.meta || '';
    qs('#image').value = item.image || '';
    qs('#description').value = item.description || '';
    
    const departureDates = item.departuredates ? JSON.parse(item.departuredates) : [];
    qs('#departureDates').value = departureDates.join(', ');
    
    currentTags = item.chips ? JSON.parse(item.chips) : [];
    qs('#chips').value = '';
    updateSelectedTagsDisplay();
    
    modal.classList.add('active');
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

  // Додавання тегу з випадаючого списку
  window.addTagFromSelect = function() {
    const select = qs('#tags-select');
    const tag = select.value;
    if (tag && !currentTags.includes(tag)) {
      currentTags.push(tag);
      updateSelectedTagsDisplay();
    }
    select.value = '';
  };

  // Оновлення поля зображення з випадаючого списку
  window.updateImageInput = function() {
    const select = qs('#image-select');
    const imageInput = qs('#image');
    if (select.value) {
      imageInput.value = select.value;
    }
  };

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
    
    // Додаємо теги з текстового поля, якщо вони є
    const chipsInput = qs('#chips').value;
    if (chipsInput.trim()) {
      const newTags = chipsInput.split(',').map(s => s.trim()).filter(Boolean);
      currentTags = [...currentTags, ...newTags];
    }
    
    // Збираємо дані з форми
    const formData = {
      title: qs('#title').value,
      price: qs('#price').value,
      duration: qs('#duration').value,
      groupSize: qs('#groupSize').value,
      accommodation: qs('#accommodation').value,
      badge: qs('#badge').value,
      category: qs('#category').value,
      meta: qs('#meta').value,
      image: qs('#image').value,
      description: qs('#description').value,
      departureDates: qs('#departureDates').value.split(',').map(s => s.trim()).filter(Boolean),
      chips: currentTags
    };
    
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
      
      if (data.success) {
        showToast(isEdit ? 'Запис оновлено' : 'Запис додано', 'success');
        closeModal();
        loadItems(type);
      } else {
        showToast(data.message || 'Помилка збереження', 'error');
      }
    } catch (error) {
      console.error('Помилка:', error);
      showToast('Помилка з\'єднання', 'error');
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

  // Отримання назви типу
  function getTypeName(type) {
    const names = {
      'tour': 'тур',
      'cruise': 'круїз',
      'island': 'острів',
      'hot': 'гарячу путівку'
    };
    return names[type] || type;
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

  // Додаємо обробник для вибору тегів через Enter
  qs('#chips')?.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const input = e.target;
      if (input.value.trim()) {
        const newTags = input.value.split(',').map(s => s.trim()).filter(Boolean);
        currentTags = [...currentTags, ...newTags];
        updateSelectedTagsDisplay();
        input.value = '';
      }
    }
  });

  // Ініціалізація
  window.addEventListener('DOMContentLoaded', async () => {
    const hasAccess = await checkAdminAccess();
    if (!hasAccess) return;

    qs('#loading-spinner').style.display = 'none';
    qs('#app-content').style.display = 'block';

    initTabs();
    // Завантажуємо тури за замовчуванням
    loadItems('tour');
  });
})();