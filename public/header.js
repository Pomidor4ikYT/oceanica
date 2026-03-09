(function() {
  const qs = (sel) => document.querySelector(sel);

  function updateHeader() {
    const userSection = qs('#userSection');
    if (!userSection) return;

    const token = window.auth?.getToken();
    const user = token ? window.auth.getUserFromToken() : null;

    if (!user) {
      userSection.innerHTML = `<a href="login.html" class="nav-link login-btn">Увійти</a>`;
      return;
    }

    const initial = (user.name || 'К').charAt(0).toUpperCase();
    userSection.innerHTML = `
      <div class="user-dropdown">
        <div class="avatar" id="avatarTrigger">${initial}</div>
        <div class="dropdown-menu" id="userDropdown">
          <a href="account.html" class="dropdown-item">👤 Профіль</a>
          <a href="account.html?tab=settings" class="dropdown-item">⚙️ Налаштування</a>
          <div class="dropdown-divider"></div>
          <button class="dropdown-item" id="logoutBtn">🚪 Вийти</button>
        </div>
      </div>
    `;

    const avatar = qs('#avatarTrigger');
    const menu = qs('#userDropdown');
    if (avatar && menu) {
      avatar.addEventListener('click', (e) => {
        e.stopPropagation();
        menu.classList.toggle('show');
      });
      document.addEventListener('click', () => menu.classList.remove('show'));
      menu.addEventListener('click', (e) => e.stopPropagation());
    }

    const logoutBtn = qs('#logoutBtn');
    if (logoutBtn) {
      logoutBtn.addEventListener('click', () => {
        window.auth.logout();
        updateHeader();
      });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', updateHeader);
  } else {
    updateHeader();
  }

  window.addEventListener('authChange', updateHeader);
})();