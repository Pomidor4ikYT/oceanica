// public/header.js
(function() {
  const qs = (sel) => document.querySelector(sel);

  async function updateHeader() {
    const userSection = qs('#userSection');
    if (!userSection) return;

    const token = window.auth?.getToken();
    
    if (!token) {
      // Якщо користувач не авторизований - показуємо кнопку входу
      userSection.innerHTML = `<a href="login.html" class="nav-link login-btn">Увійти</a>`;
      return;
    }

    try {
      // Отримуємо дані користувача з сервера
      const userData = await window.auth.getUserData();
      
      if (!userData) {
        // Якщо дані не отримано (помилка авторизації) - показуємо кнопку входу
        userSection.innerHTML = `<a href="login.html" class="nav-link login-btn">Увійти</a>`;
        return;
      }

      const isAdmin = userData.role === 'admin';
      const userName = userData.name || 'Користувач';
      const userInitial = userName.charAt(0).toUpperCase();

      // Формуємо HTML для випадаючого меню
      let dropdownItems = `
        <a href="account.html" class="dropdown-item">
          <span style="margin-right: 8px;">👤</span> Мій профіль
        </a>
        <a href="account.html?tab=favorites" class="dropdown-item">
          <span style="margin-right: 8px;">❤️</span> Улюблене
        </a>
        <a href="account.html?tab=booked" class="dropdown-item">
          <span style="margin-right: 8px;">✅</span> Бронювання
        </a>
        <a href="settings.html" class="dropdown-item">
          <span style="margin-right: 8px;">⚙️</span> Налаштування
        </a>
      `;

      // Додаємо пункт адмін-панелі для адміністраторів
      if (isAdmin) {
        dropdownItems += `
          <div class="dropdown-divider"></div>
          <a href="admin.html" class="dropdown-item" style="color: #0f4c81; font-weight: 700;">
            <span style="margin-right: 8px;">🔧</span> Адмін-панель
          </a>
        `;
      }

      dropdownItems += `
        <div class="dropdown-divider"></div>
        <button class="dropdown-item" id="logoutBtn" style="color: #dc2626;">
          <span style="margin-right: 8px;">🚪</span> Вийти
        </button>
      `;

      // Вставляємо HTML для авторизованого користувача
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

      // Додаємо обробники подій для випадаючого меню
      const avatar = qs('#avatarTrigger');
      const menu = qs('#userDropdown');
      
      if (avatar && menu) {
        // Відкриття/закриття меню при кліку на аватар
        avatar.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          menu.classList.toggle('show');
        });

        // Закриття меню при кліку поза ним
        document.addEventListener('click', (e) => {
          if (!avatar.contains(e.target) && !menu.contains(e.target)) {
            menu.classList.remove('show');
          }
        });

        // Запобігаємо закриттю при кліку всередині меню
        menu.addEventListener('click', (e) => {
          e.stopPropagation();
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

    } catch (error) {
      console.error('Помилка в header.js:', error);
      // У випадку помилки показуємо кнопку входу
      userSection.innerHTML = `<a href="login.html" class="nav-link login-btn">Увійти</a>`;
    }
  }

  // Додаємо стилі для випадаючого меню (якщо їх немає в CSS)
  function addDropdownStyles() {
    const styleId = 'dropdown-styles';
    if (document.getElementById(styleId)) return;

    const style = document.createElement('style');
    style.id = styleId;
    style.textContent = `
      .user-dropdown {
        position: relative;
        display: inline-block;
      }

      .avatar {
        width: 42px;
        height: 42px;
        background: linear-gradient(145deg, #0f4c81, #1e7fb0);
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 1.2rem;
        font-weight: 700;
        color: white;
        cursor: pointer;
        box-shadow: 0 4px 8px rgba(0,110,230,0.3);
        transition: transform 0.2s, box-shadow 0.2s;
        border: 2px solid white;
      }

      .avatar:hover {
        transform: scale(1.05);
        box-shadow: 0 6px 12px rgba(15,76,129,0.4);
      }

      .user-dropdown .dropdown-menu {
        display: none;
        position: absolute;
        top: 52px;
        right: 0;
        background: white;
        border-radius: 16px;
        box-shadow: 0 10px 25px rgba(0,0,0,0.15);
        min-width: 220px;
        z-index: 1000;
        padding: 0.5rem 0;
        border: 1px solid #e2e8f0;
        animation: dropdownFade 0.2s ease;
      }

      @keyframes dropdownFade {
        from {
          opacity: 0;
          transform: translateY(-10px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }

      .user-dropdown .dropdown-menu.show {
        display: block;
      }

      .user-dropdown .dropdown-item {
        display: flex;
        align-items: center;
        padding: 0.7rem 1.5rem;
        text-decoration: none;
        color: #334155;
        transition: background 0.2s;
        font-family: 'Inter', sans-serif;
        font-size: 0.95rem;
        font-weight: 500;
        background: none;
        border: none;
        width: 100%;
        text-align: left;
        cursor: pointer;
        box-sizing: border-box;
      }

      .user-dropdown .dropdown-item:hover {
        background: #f1f5f9;
        color: #0f4c81;
      }

      .dropdown-divider {
        height: 1px;
        background: #e2e8f0;
        margin: 0.5rem 0;
      }

      .login-btn {
        background: #0f4c81 !important;
        color: white !important;
        padding: 0.5rem 1.5rem !important;
        border-radius: 40px !important;
        transition: all 0.2s !important;
        font-weight: 600 !important;
        text-decoration: none !important;
        display: inline-block !important;
        border: 2px solid #0f4c81 !important;
      }

      .login-btn:hover {
        background: #1e7fb0 !important;
        transform: translateY(-2px) !important;
        box-shadow: 0 4px 8px rgba(15,76,129,0.2) !important;
        border-color: #1e7fb0 !important;
      }

      @media (max-width: 768px) {
        .user-dropdown .dropdown-menu {
          right: auto;
          left: 50%;
          transform: translateX(-50%);
        }
        
        .user-dropdown .dropdown-menu.show {
          transform: translateX(-50%) translateY(0);
        }
      }
    `;
    document.head.appendChild(style);
  }

  // Ініціалізація
  function init() {
    addDropdownStyles();
    
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', updateHeader);
    } else {
      updateHeader();
    }

    // Оновлюємо хедер при зміні авторизації
    window.addEventListener('authChange', updateHeader);
    
    // Оновлюємо хедер при зміні localStorage (для синхронізації між вкладками)
    window.addEventListener('storage', (e) => {
      if (e.key === 'oceanica_token' || e.key === 'oceanica_user_email') {
        updateHeader();
      }
    });
  }

  init();
})();