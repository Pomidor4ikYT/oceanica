// public/utils.js
(function(window) {
  const utils = {};

  // --- Селектори ---
  utils.qs = (sel, ctx) => (ctx || document).querySelector(sel);
  utils.qsa = (sel, ctx) => Array.from((ctx || document).querySelectorAll(sel));

  // --- Блокування прокрутки ---
  utils.disableBodyScroll = () => document.body.classList.add('modal-open');
  utils.enableBodyScroll = () => document.body.classList.remove('modal-open');

  // --- Toast ---
  utils.showToast = function(msg, type = 'success') {
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

  // --- Зірочки для відгуків ---
  utils.updateStars = function(el) {
    if (!el) return;
    const val = Number(el.dataset.value || 0);
    utils.qsa('span', el).forEach(s => {
      s.textContent = Number(s.dataset.star) <= val ? '★' : '☆';
    });
  };

  utils.initStarInput = function(el) {
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
      utils.updateStars(el);
    });
  };

  // --- Слайдер ---
  utils.initSlider = function(containerSelector) {
    const slidesContainer = utils.qs(containerSelector);
    if (!slidesContainer) return;
    const slides = utils.qsa('.offer-slide', slidesContainer);
    if (!slides.length) return;
    let currentIdx = 0, autoInterval;
    const total = slides.length;
    function update() { slidesContainer.style.transform = `translateX(-${currentIdx * 100}%)`; }
    function next() { currentIdx = (currentIdx + 1) % total; update(); }
    function prev() { currentIdx = (currentIdx - 1 + total) % total; update(); }
    function start() { autoInterval = setInterval(next, 5000); }
    function stop() { clearInterval(autoInterval); }
    start();
    const sliderEl = slidesContainer.closest('.offers-slider');
    sliderEl?.addEventListener('mouseenter', stop);
    sliderEl?.addEventListener('mouseleave', start);
    const prevBtn = sliderEl?.querySelector('.slider-arrow.prev');
    const nextBtn = sliderEl?.querySelector('.slider-arrow.next');
    prevBtn?.addEventListener('click', () => { stop(); prev(); start(); });
    nextBtn?.addEventListener('click', () => { stop(); next(); start(); });
    update();
  };

  // --- Улюблені (глобальний обробник + завантаження стану) ---
  utils.setupFavorites = function() {
    document.addEventListener('click', async (e) => {
      const favBtn = e.target.closest('.fav');
      if (!favBtn) return;
      e.preventDefault();
      e.stopPropagation();
      const card = favBtn.closest('.card');
      if (!card) return;
      if (!window.auth?.getToken()) {
        utils.showToast('🔒 Увійдіть, щоб додавати в обране', 'info');
        setTimeout(() => { window.location.href = 'login.html'; }, 1500);
        return;
      }
      const title = utils.qs('.card-title', card)?.textContent?.trim() || '';
      const image = utils.qs('.card-img', card)?.src || '';
      const price = utils.qs('.card-price', card)?.textContent?.trim() || '';
      const meta = utils.qs('.card-meta', card)?.textContent?.trim() || '';
      const badge = utils.qs('.badge', card)?.textContent?.trim() || '';
      const chips = utils.qsa('.chips .chip', card).map(c => c.textContent.trim());
      const category = card.dataset.category || '';
      const item = { title, image, price, meta, badge, chips, category };
      try {
        const result = await window.auth.toggleFavorite(item);
        if (result.success) {
          if (result.action === 'added') {
            favBtn.classList.add('active');
            utils.showToast('✅ Додано в улюблені', 'success');
          } else {
            favBtn.classList.remove('active');
            utils.showToast('🗑️ Видалено з улюблених', 'info');
          }
        } else {
          utils.showToast(result.message || 'Помилка', 'error');
        }
      } catch (error) {
        console.error(error);
        utils.showToast('Помилка з\'єднання', 'error');
      }
    });
  };

  utils.loadFavoritesState = async function() {
    if (!window.auth?.getToken()) return;
    try {
      const favs = await window.auth.getFavorites();
      const favTitles = new Set(favs.map(f => f.title));
      utils.qsa('.card').forEach(card => {
        const title = utils.qs('.card-title', card)?.textContent?.trim();
        if (title && favTitles.has(title)) {
          utils.qs('.fav', card)?.classList.add('active');
        }
      });
    } catch (error) {
      console.error('Помилка завантаження улюблених:', error);
    }
  };

  // --- Фільтр категорій ---
  utils.setupFilter = function(filterBtnId, filterPanelId, categoryChipsId, categoryMap) {
    const filterBtn = utils.qs(`#${filterBtnId}`);
    const filterPanel = utils.qs(`#${filterPanelId}`);
    const categoryChips = utils.qs(`#${categoryChipsId}`);
    if (!filterBtn || !filterPanel || !categoryChips) return;
    let html = '<div class="category-chip reset" data-category="reset">✖ Скинути</div>';
    for (const [cat, name] of Object.entries(categoryMap)) {
      html += `<div class="category-chip" data-category="${cat}">${name}</div>`;
    }
    categoryChips.innerHTML = html;
    const selectedCategories = new Set();
    const cards = () => utils.qsa('.card');
    function filter() {
      if (selectedCategories.size === 0) {
        cards().forEach(c => c.style.display = '');
      } else {
        cards().forEach(c => {
          c.style.display = selectedCategories.has(c.dataset.category) ? '' : 'none';
        });
      }
    }
    categoryChips.addEventListener('click', (e) => {
      const chip = e.target.closest('.category-chip');
      if (!chip) return;
      const cat = chip.dataset.category;
      if (cat === 'reset') {
        selectedCategories.clear();
        utils.qsa('.category-chip').forEach(ch => ch.classList.remove('active'));
      } else {
        if (selectedCategories.has(cat)) {
          selectedCategories.delete(cat);
          chip.classList.remove('active');
        } else {
          selectedCategories.add(cat);
          chip.classList.add('active');
        }
      }
      filter();
    });
    filterBtn.addEventListener('click', () => filterPanel.classList.toggle('active'));
  };

  // --- Пошук за датою ---
  utils.setupDateSearch = function(searchBtnId, clearBtnId, datePickerId, resultsDivId, resultsTitleId, itemsData, createCardFn) {
    const searchBtn = utils.qs(`#${searchBtnId}`);
    const clearBtn = utils.qs(`#${clearBtnId}`);
    const datePicker = utils.qs(`#${datePickerId}`);
    const resultsDiv = utils.qs(`#${resultsDivId}`);
    const resultsTitle = utils.qs(`#${resultsTitleId}`);
    if (!searchBtn || !datePicker || !resultsDiv || !resultsTitle) return;
    searchBtn.addEventListener('click', () => {
      const selected = datePicker.value;
      if (!selected) {
        utils.showToast('❌ Оберіть дату', 'error');
        return;
      }
      const [y, m, d] = selected.split('-');
      const formatted = `${d}.${m}.${y}`;
      const found = itemsData.filter(item => item.departureDates && item.departureDates.includes(formatted));
      if (found.length) {
        resultsDiv.innerHTML = found.map(item => createCardFn(item)).join('');
        utils.loadFavoritesState();
        resultsDiv.classList.add('visible');
        resultsTitle.classList.add('visible');
        utils.showToast(`✅ Знайдено: ${found.length}`, 'success');
      } else {
        resultsDiv.classList.remove('visible');
        resultsTitle.classList.remove('visible');
        utils.showToast(`❌ На ${formatted} нічого немає`, 'error');
      }
    });
    if (clearBtn) {
      clearBtn.addEventListener('click', () => {
        datePicker.value = '';
        resultsDiv.classList.remove('visible');
        resultsTitle.classList.remove('visible');
      });
    }
  };

  // --- Модальні вікна (деталі та бронювання) ---
  const detailsModal = document.getElementById('modalDetails');
  const bookModal = document.getElementById('modalBook');

  // Функції для закриття
  function closeDetails() {
    if (!detailsModal) return;
    detailsModal.classList.remove('active');
    setTimeout(() => detailsModal.style.display = 'none', 300);
    utils.enableBodyScroll();
  }
  function closeBook() {
    if (!bookModal) return;
    bookModal.classList.remove('active');
    setTimeout(() => bookModal.style.display = 'none', 300);
    utils.enableBodyScroll();
  }

  // Відкриття модалки деталей
  utils.openDetailsModal = function(data) {
    if (!detailsModal || !data) return;
    
    // Обробник переключення табів
    const tabBtns = detailsModal.querySelectorAll('.modal-tab');
    const panels = detailsModal.querySelectorAll('.modal-panel');
    function setTab(tab) {
      tabBtns.forEach(b => b.classList.toggle('active', b.dataset.tab === tab));
      panels.forEach(p => p.classList.toggle('active', p.dataset.panel === tab));
    }
    tabBtns.forEach(b => { b.onclick = () => setTab(b.dataset.tab || 'info'); });
    setTab('info');

    // Заповнення елементів
    const img = document.getElementById('modalDetailsImg');
    const badge = document.getElementById('modalDetailsBadge');
    const title = document.getElementById('modalDetailsTitle');
    const subtitle = document.getElementById('modalDetailsSubtitle');
    const price = document.getElementById('modalDetailsPrice');
    const chips = document.getElementById('modalDetailsChips');
    const desc = document.getElementById('modalDetailsDescription');
    const info = document.getElementById('modalDetailsInfo');

    if (img) img.src = data.img || '';
    if (badge) badge.textContent = data.badge || '';
    if (title) title.textContent = data.title || '';
    if (subtitle) subtitle.textContent = data.subtitle || '';
    if (price) price.textContent = data.price ? 'від ' + data.price : '';
    if (chips) chips.innerHTML = (data.tags || []).map(t => `<span class="modal-chip">${t}</span>`).join('');
    if (desc) desc.textContent = data.description || '';
    if (info) {
      info.innerHTML = `
        <div class="modal-info-item"><div class="modal-info-label">📅 Дати</div><div class="modal-info-value">${(data.departureDates || []).slice(0,3).join(', ')}</div></div>
        <div class="modal-info-item"><div class="modal-info-label">⏱️ Тривалість</div><div class="modal-info-value">${data.duration || ''}</div></div>
        <div class="modal-info-item"><div class="modal-info-label">👥 Група</div><div class="modal-info-value">${data.groupSize || ''}</div></div>
        <div class="modal-info-item"><div class="modal-info-label">🏨 Розміщення</div><div class="modal-info-value">${data.accommodation || ''}</div></div>
      `;
    }

    // Ініціалізація відгуків
    const reviewsList = document.getElementById('modalReviewsList');
    const mrfName = document.getElementById('mrfName');
    const mrfStars = document.getElementById('mrfStars');
    const mrfText = document.getElementById('mrfText');
    const mrfClear = document.getElementById('mrfClear');
    const mrfSubmit = document.getElementById('mrfSubmit');
    if (mrfStars) utils.initStarInput(mrfStars);

    detailsModal.classList.add('active');
    detailsModal.style.display = 'flex';
    utils.disableBodyScroll();
  };

  // Відкриття модалки бронювання
  utils.openBookModal = function(item) {
    if (!bookModal || !item) return;
    const titleEl = document.getElementById('modalBookTitle');
    const subtitleEl = document.getElementById('modalBookSubtitle');
    const form = document.getElementById('modalBookForm');
    const successEl = document.getElementById('modalBookSuccess');
    if (titleEl) titleEl.textContent = 'Бронювання';
    if (subtitleEl) subtitleEl.textContent = item.title || '';
    if (form) form.reset();
    if (successEl) {
      successEl.classList.remove('active');
      successEl.style.display = 'none';
    }
    const dateInput = form?.querySelector('input[name="date"]');
    if (dateInput) {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      dateInput.min = tomorrow.toISOString().split('T')[0];
    }
    bookModal.classList.add('active');
    bookModal.style.display = 'flex';
    utils.disableBodyScroll();
  };

  // Закриття по кліку на оверлей або кнопки
  if (detailsModal) {
    detailsModal.addEventListener('click', (e) => {
      if (e.target === detailsModal) closeDetails();
    });
    const closeBtns = detailsModal.querySelectorAll('#modalDetailsClose, #modalDetailsClose2');
    closeBtns.forEach(btn => btn.addEventListener('click', closeDetails));
  }
  if (bookModal) {
    bookModal.addEventListener('click', (e) => {
      if (e.target === bookModal) closeBook();
    });
    const closeBtn = bookModal.querySelector('#modalBookClose');
    if (closeBtn) closeBtn.addEventListener('click', closeBook);
  }

  // Обробка форми бронювання (можна винести, але залишимо глобально)
  const bookForm = document.getElementById('modalBookForm');
  if (bookForm) {
    bookForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      if (!window.auth?.getToken()) {
        utils.showToast('🔒 Увійдіть, щоб забронювати', 'info');
        setTimeout(() => window.location.href = 'login.html', 1500);
        return;
      }
      const dateInput = bookForm.querySelector('input[name="date"]');
      if (!dateInput.value) {
        utils.showToast('Оберіть дату', 'error');
        return;
      }
      const [y, m, d] = dateInput.value.split('-');
      const bookingDate = `${d}.${m}.${y}`;
      // Отримуємо поточний елемент з глобальної змінної (має бути встановлений перед відкриттям)
      const currentItem = window.__currentBookingItem;
      if (!currentItem) {
        utils.showToast('Помилка: дані відсутні', 'error');
        return;
      }
      const bookingItem = { ...currentItem, bookingDate };
      try {
        const result = await window.auth.addBooking(bookingItem);
        if (result.success) {
          const successEl = document.getElementById('modalBookSuccess');
          if (successEl) {
            successEl.classList.add('active');
            successEl.style.display = 'block';
          }
          setTimeout(closeBook, 3000);
        } else {
          utils.showToast(result.message || 'Помилка бронювання', 'error');
        }
      } catch (error) {
        console.error(error);
        utils.showToast('Помилка з\'єднання', 'error');
      }
    });
  }

  // --- Глобальний обробник кнопок "Детальніше" та "Забронювати" ---
  let currentDetailsCallback = null;
  let currentBookingCallback = null;

  utils.setupItemHandlers = function(detailsCallback, bookingCallback) {
    currentDetailsCallback = detailsCallback;
    currentBookingCallback = bookingCallback;
  };

  // Встановлюємо глобальний слухач один раз
  document.addEventListener('click', (e) => {
    const detailBtn = e.target.closest('.btn-outline:not(.modal-close)') || e.target.closest('.slide-detail-btn');
    if (detailBtn && currentDetailsCallback) {
      e.preventDefault();
      const card = detailBtn.closest('.card');
      if (card) {
        const data = currentDetailsCallback(card);
        if (data) utils.openDetailsModal(data);
      } else if (detailBtn.classList.contains('slide-detail-btn')) {
        const slide = detailBtn.closest('.offer-slide');
        if (slide) {
          // Можна обробити слайд, але для простоти поки нічого
        }
      }
      return;
    }

    const bookBtn = e.target.closest('.btn-primary');
    if (bookBtn && !e.target.closest('#modalDetails') && currentBookingCallback) {
      e.preventDefault();
      const card = bookBtn.closest('.card');
      if (card) {
        const item = currentBookingCallback(card);
        if (item) {
          window.__currentBookingItem = item; // зберігаємо для форми
          utils.openBookModal(item);
        }
      }
    }
  });

  // Експорт
  window.utils = utils;
})(window);