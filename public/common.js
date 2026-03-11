// common.js
(function() {
  window.qs = (sel, ctx) => (ctx || document).querySelector(sel);
  window.qsa = (sel, ctx) => Array.from((ctx || document).querySelectorAll(sel));

  window.disableBodyScroll = () => document.body.classList.add('modal-open');
  window.enableBodyScroll = () => document.body.classList.remove('modal-open');

  window.showToast = function(msg, type = 'success') {
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
  };

  window.updateStars = function(el) {
    if (!el) return;
    const val = Number(el.dataset.value || 0);
    window.qsa('span', el).forEach(s => {
      s.textContent = Number(s.dataset.star) <= val ? '★' : '☆';
    });
  };

  window.initStarInput = function(el) {
    if (!el) return;
    el.dataset.value = el.dataset.value || el.getAttribute('data-value') || '5';
    el.innerHTML = '';
    for (let i = 1; i <= 5; i++) {
      const span = document.createElement('span');
      span.dataset.star = i;
      span.textContent = i <= Number(el.dataset.value) ? '★' : '☆';
      el.appendChild(span);
    }
    el.addEventListener('click', function(e) {
      const span = e.target.closest('span[data-star]');
      if (!span) return;
      el.dataset.value = span.dataset.star;
      window.updateStars(el);
    });
  };

  async function renderUserMenu() {
    const container = document.querySelector('.user-menu-container');
    if (!container) return;

    const token = window.auth?.getToken?.();
    if (!token) {
      container.innerHTML = '<a href="login.html" class="nav-link">🔑 Увійти</a>';
      return;
    }

    let user = null;
    try {
      user = await window.auth.getUserData();
    } catch (e) {
      console.error('Не вдалося отримати дані користувача', e);
    }

    if (!user) {
      container.innerHTML = '<a href="#" class="nav-link" id="logout-fallback">Вийти</a>';
      document.getElementById('logout-fallback')?.addEventListener('click', (e) => {
        e.preventDefault();
        window.auth.logout();
      });
      return;
    }

    const avatar = user.avatar || '';
    const name = user.name || 'User';
    const initial = name.charAt(0).toUpperCase();

    container.innerHTML = `
      <div class="user-menu">
        <div class="avatar-dropdown">
          ${avatar ? `<img src="${avatar}" alt="avatar" class="avatar-img">` : `<div class="avatar-initial">${initial}</div>`}
          <div class="dropdown-content">
            <a href="account.html" class="dropdown-item">👤 Мій профіль</a>
            <a href="account.html?tab=favorites" class="dropdown-item">❤️ Улюблені</a>
            <a href="account.html?tab=booked" class="dropdown-item">✅ Заброньовані</a>
            <a href="account.html?tab=settings" class="dropdown-item">⚙️ Налаштування</a>
            <a href="#" class="dropdown-item logout-btn">🚪 Вийти</a>
          </div>
        </div>
      </div>
    `;

    container.querySelector('.logout-btn')?.addEventListener('click', (e) => {
      e.preventDefault();
      window.auth.logout();
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', renderUserMenu);
  } else {
    renderUserMenu();
  }
})();