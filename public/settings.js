// public/settings.js
(function() {
  const qs = (sel) => document.querySelector(sel);

  if (!window.auth?.getToken()) {
    window.location.href = 'login.html';
    return;
  }

  async function loadUserData() {
    try {
      const userData = await window.auth.getUserData();
      if (userData) {
        qs('#settingsName').value = userData.name || '';
        qs('#settingsEmail').value = userData.email || '';
        qs('#settingsPhone').value = userData.phone || '';
        qs('#settingsBio').value = userData.bio || '';
        const savedColor = localStorage.getItem('avatarColor') || '#0f4c81';
        document.querySelector(`.color-option[data-color="${savedColor}"]`)?.classList.add('selected');
        qs('#avatarPreview').style.background = savedColor;
        qs('#avatarPreview').textContent = (userData.name || 'В').charAt(0).toUpperCase();
      }
    } catch (error) {
      console.error('Помилка завантаження даних:', error);
    }
  }

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

  qs('#uploadAvatarBtn').addEventListener('click', () => {
    alert('Функція завантаження фото буде доступна найближчим часом.');
  });

  qs('#settingsForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const name = qs('#settingsName').value.trim();
    const email = qs('#settingsEmail').value.trim();
    const phone = qs('#settingsPhone').value.trim();
    const bio = qs('#settingsBio').value.trim();
    const password = qs('#settingsPassword').value;
    const confirm = qs('#settingsConfirmPassword').value;

    if (password && password !== confirm) {
      showMessage('Паролі не співпадають', 'error');
      return;
    }

    const updates = { name, email, phone, bio };
    if (password) updates.password = password;

    try {
      const result = await window.auth.updateUser(updates);
      if (result.success) {
        showMessage('Дані успішно оновлено!', 'success');
        if (result.token) {
          localStorage.setItem('oceanica_token', result.token);
        }
        window.dispatchEvent(new Event('authChange'));
      } else {
        showMessage(result.message || 'Помилка оновлення', 'error');
      }
    } catch (error) {
      showMessage('Помилка з\'єднання', 'error');
    }
  });

  qs('#deleteAccountBtn').addEventListener('click', async () => {
    if (!confirm('Ви впевнені, що хочете видалити акаунт? Це незворотна дія.')) return;
    alert('Функція видалення акаунта тимчасово недоступна.');
  });

  function showMessage(text, type) {
    const msg = qs('#settingsMessage');
    msg.textContent = text;
    msg.className = `message ${type}`;
    setTimeout(() => {
      msg.className = 'message';
    }, 3000);
  }

  loadUserData();
})();