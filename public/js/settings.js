// public/settings.js
(function() {
  const qs = (sel) => document.querySelector(sel);

  // Перевірка авторизації
  if (!window.auth?.getToken()) {
    window.location.href = 'login.html';
    return;
  }

  // Показ повідомлень
  function showMessage(text, type) {
    const msg = qs('#settingsMessage');
    msg.textContent = text;
    msg.className = `message ${type}`;
    setTimeout(() => {
      msg.className = 'message';
    }, 3000);
  }

  // Завантаження даних користувача
  async function loadUserData() {
    try {
      const userData = await window.auth.getUserData();
      if (userData) {
        qs('#settingsName').value = userData.name || '';
        qs('#settingsEmail').value = userData.email || '';
        qs('#settingsPhone').value = userData.phone || '';
        qs('#settingsBio').value = userData.bio || '';
        
        // Завантажуємо збережений колір аватара
        const savedColor = localStorage.getItem('avatarColor') || '#0f4c81';
        document.querySelector(`.color-option[data-color="${savedColor}"]`)?.classList.add('selected');
        qs('#avatarPreview').style.background = savedColor;
        qs('#avatarPreview').textContent = (userData.name || 'В').charAt(0).toUpperCase();
      }
    } catch (error) {
      console.error('Помилка завантаження даних:', error);
      showMessage('Помилка завантаження даних', 'error');
    }
  }

  // Вибір кольору аватара
  const colorOptions = qs('#colorPicker');
  colorOptions.addEventListener('click', (e) => {
    const option = e.target.closest('.color-option');
    if (!option) return;
    
    const color = option.dataset.color;
    qs('.color-option.selected')?.classList.remove('selected');
    option.classList.add('selected');
    qs('#avatarPreview').style.background = color;
    localStorage.setItem('avatarColor', color);
  });

  // Завантаження фото (демо)
  qs('#uploadAvatarBtn').addEventListener('click', () => {
    alert('Функція завантаження фото буде доступна найближчим часом.');
  });

  // Збереження змін
  qs('#settingsForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const name = qs('#settingsName').value.trim();
    const email = qs('#settingsEmail').value.trim();
    const phone = qs('#settingsPhone').value.trim();
    const bio = qs('#settingsBio').value.trim();
    const password = qs('#settingsPassword').value;
    const confirm = qs('#settingsConfirmPassword').value;

    // Перевірка пароля
    if (password && password !== confirm) {
      showMessage('❌ Паролі не співпадають', 'error');
      return;
    }

    // Блокуємо кнопку
    const submitBtn = e.target.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.disabled = true;
    submitBtn.textContent = '💾 Збереження...';

    const updates = { name, email, phone, bio };
    if (password) updates.password = password;

    try {
      const result = await window.auth.updateUser(updates);
      
      if (result.success) {
        showMessage('✅ Дані успішно оновлено!', 'success');
        
        // Оновлюємо токен якщо є
        if (result.token) {
          localStorage.setItem('oceanica_token', result.token);
        }
        
        // Оновлюємо дані в localStorage
        const userData = await window.auth.getUserData();
        if (userData) {
          localStorage.setItem('oceanica_user_data', JSON.stringify(userData));
        }
        
        // Оновлюємо аватар
        qs('#avatarPreview').textContent = (userData?.name || 'В').charAt(0).toUpperCase();
        
        // Сповіщаємо про зміни
        window.dispatchEvent(new Event('authChange'));
      } else {
        showMessage(result.message || '❌ Помилка оновлення', 'error');
      }
    } catch (error) {
      console.error('Помилка:', error);
      showMessage('❌ Помилка з\'єднання', 'error');
    } finally {
      // Розблоковуємо кнопку
      submitBtn.disabled = false;
      submitBtn.textContent = originalText;
    }
  });

  // Видалення акаунта
  qs('#deleteAccountBtn').addEventListener('click', async () => {
    if (!confirm('⚠️ Ви впевнені, що хочете видалити акаунт?\n\nЦе незворотна дія. Всі ваші дані (бронювання, улюблені) будуть втрачені.')) return;
    
    const deleteBtn = qs('#deleteAccountBtn');
    const originalText = deleteBtn.textContent;
    deleteBtn.disabled = true;
    deleteBtn.textContent = '🗑️ Видалення...';

    const token = window.auth.getToken();
    if (!token) return;
    
    try {
      const response = await fetch('/user', {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      const data = await response.json();
      
      if (data.success) {
        showMessage('✅ Акаунт видалено', 'success');
        setTimeout(() => {
          window.auth.logout(); // перенаправлення на index.html
        }, 1500);
      } else {
        showMessage(data.message || '❌ Помилка видалення', 'error');
        deleteBtn.disabled = false;
        deleteBtn.textContent = originalText;
      }
    } catch (error) {
      console.error(error);
      showMessage('❌ Помилка з\'єднання', 'error');
      deleteBtn.disabled = false;
      deleteBtn.textContent = originalText;
    }
  });

  // Додаємо стилі для повідомлень
  const style = document.createElement('style');
  style.textContent = `
    .message {
      margin-top: 1rem;
      padding: 1rem;
      border-radius: 12px;
      display: none;
      text-align: center;
      font-weight: 600;
    }
    .message.success {
      display: block;
      background: #d1fae5;
      color: #065f46;
      border: 1px solid #10b981;
    }
    .message.error {
      display: block;
      background: #fee2e2;
      color: #b91c1c;
      border: 1px solid #ef4444;
    }
    .btn-primary:disabled, .btn-danger:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
  `;
  document.head.appendChild(style);

  // Завантажуємо дані при старті
  loadUserData();
})();