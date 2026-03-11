// public/js/header.js
(function() {
  const qs = (sel) => document.querySelector(sel);

  async function updateHeader() {
    console.log('🔄 Оновлення header...');
    const userSection = qs('#userSection');
    if (!userSection) {
      console.log('❌ userSection не знайдено');
      return;
    }

    const token = window.auth?.getToken();
    console.log('🔑 Токен:', token ? 'є' : 'немає');
    
    if (!token) {
      userSection.innerHTML = `<a href="login.html" class="login-btn">🔑 Увійти</a>`;
      return;
    }

    try {
      const userData = await window.auth.getUserData();
      console.log('👤 Дані користувача:', userData);
      
      if (!userData) {
        console.log('❌ Немає даних користувача');
        userSection.innerHTML = `<a href="login.html" class="login-btn">🔑 Увійти</a>`;
        return;
      }

      const userName = userData.name || 'Користувач';
      const userInitial = userName.charAt(0).toUpperCase();

      let menuHtml = `
        <div class="user-dropdown">
          <div class="avatar" id="avatarTrigger" title="${userName}">${userInitial}</div>
          <div class="dropdown-menu" id="userDropdown">
            <a href="/account.html" class="dropdown-item">
              <span>👤</span> Мій профіль
            </a>
            <a href="/account.html?tab=favorites" class="dropdown-item">
              <span>❤️</span> Улюблене
            </a>
            <a href="/account.html?tab=booked" class="dropdown-item">
              <span>✅</span> Бронювання
            </a>
            <a href="/settings.html" class="dropdown-item">
              <span>⚙️</span> Налаштування
            </a>
      `;

      // Показуємо адмін-панель для всіх (тимчасово)
      menuHtml += `
            <div class="dropdown-divider"></div>
            <a href="/admin.html" class="dropdown-item admin-link">
              <span>🔧</span> Адмін-панель
            </a>
      `;

      menuHtml += `
            <div class="dropdown-divider"></div>
            <a href="#" id="logoutBtn" class="dropdown-item logout-btn">
              <span>🚪</span> Вийти
            </a>
          </div>
        </div>
      `;

      userSection.innerHTML = menuHtml;
      console.log('✅ Меню створено');

      // Додаємо обробник для аватара
      const avatar = qs('#avatarTrigger');
      const menu = qs('#userDropdown');
      
      if (avatar && menu) {
        avatar.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          menu.classList.toggle('show');
        });

        // Закриваємо меню при кліку поза ним
        document.addEventListener('click', (e) => {
          if (!avatar.contains(e.target) && !menu.contains(e.target)) {
            menu.classList.remove('show');
          }
        });
      }

      // Додаємо обробник для кнопки виходу
      const logoutBtn = qs('#logoutBtn');
      if (logoutBtn) {
        logoutBtn.addEventListener('click', (e) => {
          e.preventDefault();
          window.auth.logout();
        });
      }

      // Додаємо обробники для всіх посилань в меню
      document.querySelectorAll('.dropdown-item').forEach(link => {
        link.addEventListener('click', function(e) {
          if (this.id !== 'logoutBtn') {
            // Для звичайних посилань - показуємо завантаження
            console.log('Перехід за посиланням:', this.href);
          }
        });
      });

    } catch (error) {
      console.error('❌ Помилка в header.js:', error);
      userSection.innerHTML = `<a href="login.html" class="login-btn">🔑 Увійти</a>`;
    }
  }

  function init() {
    console.log('🚀 header.js ініціалізація');
    
    updateHeader();
    
    window.addEventListener('storage', (e) => {
      if (e.key === 'oceanica_token' || e.key === 'oceanica_user_data') {
        console.log('📦 Зміна в localStorage, оновлюємо header');
        updateHeader();
      }
    });

    window.addEventListener('authChange', () => {
      console.log('🔄 Подія authChange, оновлюємо header');
      updateHeader();
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();