// public/header.js
(function() {
  const qs = (sel) => document.querySelector(sel);

  async function updateHeader() {
    const userSection = qs('#userSection');
    if (!userSection) return;

    const token = window.auth?.getToken();
    
    if (!token) {
      userSection.innerHTML = `<a href="login.html" class="login-btn">🔑 Увійти</a>`;
      return;
    }

    try {
      let userData = null;
      
      const cached = localStorage.getItem('oceanica_user_data');
      if (cached) {
        try {
          userData = JSON.parse(cached);
        } catch (e) {
          // Ігноруємо
        }
      }
      
      if (!userData) {
        userData = await window.auth.getUserData();
      }

      if (!userData) {
        userSection.innerHTML = `<a href="login.html" class="login-btn">🔑 Увійти</a>`;
        return;
      }

      const isAdmin = userData.role === 'admin';
      const userName = userData.name || 'Користувач';
      const userInitial = userName.charAt(0).toUpperCase();

      let dropdownItems = `
        <a href="account.html" class="dropdown-item">
          <span>👤</span> Мій профіль
        </a>
        <a href="account.html?tab=favorites" class="dropdown-item">
          <span>❤️</span> Улюблене
        </a>
        <a href="account.html?tab=booked" class="dropdown-item">
          <span>✅</span> Бронювання
        </a>
        <a href="settings.html" class="dropdown-item">
          <span>⚙️</span> Налаштування
        </a>
      `;

      if (isAdmin) {
        dropdownItems += `
          <div class="dropdown-divider"></div>
          <a href="admin.html" class="dropdown-item" style="color: #0f4c81; font-weight: 700;">
            <span>🔧</span> Адмін-панель
          </a>
        `;
      }

      dropdownItems += `
        <div class="dropdown-divider"></div>
        <button class="dropdown-item" id="logoutBtn" style="color: #dc2626;">
          <span>🚪</span> Вийти
        </button>
      `;

      userSection.innerHTML = `
        <div class="user-dropdown">
          <div class="avatar" id="avatarTrigger" title="${userName}">
            ${userInitial}
          </div>
          <div class="dropdown-menu" id="userDropdown">
            ${dropdownItems}
          </div>
        </div>
      `;

      const avatar = qs('#avatarTrigger');
      const menu = qs('#userDropdown');
      
      if (avatar && menu) {
        avatar.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          menu.classList.toggle('show');
        });

        document.addEventListener('click', (e) => {
          if (!avatar.contains(e.target) && !menu.contains(e.target)) {
            menu.classList.remove('show');
          }
        });

        menu.addEventListener('click', (e) => {
          e.stopPropagation();
        });
      }

      const logoutBtn = qs('#logoutBtn');
      if (logoutBtn) {
        logoutBtn.addEventListener('click', (e) => {
          e.preventDefault();
          window.auth.logout();
        });
      }

    } catch (error) {
      console.error('Помилка в header.js:', error);
      userSection.innerHTML = `<a href="login.html" class="login-btn">🔑 Увійти</a>`;
    }
  }

  function init() {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', updateHeader);
    } else {
      updateHeader();
    }

    window.addEventListener('authChange', updateHeader);
    
    window.addEventListener('storage', (e) => {
      if (e.key === 'oceanica_token' || e.key === 'oceanica_user_data') {
        updateHeader();
      }
    });
  }

  init();
})();