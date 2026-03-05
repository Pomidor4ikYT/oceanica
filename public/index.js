// index.js (виправлений)
(function() {
  const qs = (sel, ctx) => (ctx || document).querySelector(sel);
  const qsa = (sel, ctx) => Array.from((ctx || document).querySelectorAll(sel));

  function disableBodyScroll() { document.body.classList.add('modal-open'); }
  function enableBodyScroll() { document.body.classList.remove('modal-open'); }

  function updateStars(el) {
    if (!el) return;
    const val = Number(el.dataset.value || 0);
    qsa('span', el).forEach(s => {
      s.textContent = Number(s.dataset.star) <= val ? '★' : '☆';
    });
  }
  function initStarInput(el) {
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
      updateStars(el);
    });
  }

  // ========== Робота з поточним користувачем ==========
  function getCurrentUser() {
    return window.auth?.getCurrentUser?.() || null;
  }

  function getFavoritesKey() {
    const user = getCurrentUser();
    return user ? `oceanica_favorites_${user}` : null;
  }

  function getFavorites() {
    const key = getFavoritesKey();
    if (!key) return [];
    try { return JSON.parse(localStorage.getItem(key)) || []; } catch { return []; }
  }

  function saveFavorites(fav) {
    const key = getFavoritesKey();
    if (key) localStorage.setItem(key, JSON.stringify(fav));
  }

  function toggleFavorite(card) {
    const currentUser = getCurrentUser();
    if (!currentUser) {
      showToast('🔒 Увійдіть, щоб додавати в обране', 'info');
      setTimeout(() => { window.location.href = 'login.html'; }, 1500);
      return;
    }

    const title = qs('.card-title', card)?.textContent?.trim();
    if (!title) return;
    const favs = getFavorites();
    const idx = favs.findIndex(f => f.title === title);
    if (idx === -1) {
      favs.push({
        title,
        image: qs('.card-img', card)?.src || '',
        price: qs('.card-price', card)?.textContent?.trim() || '',
        meta: qs('.card-meta', card)?.textContent?.trim() || '',
        badge: qs('.badge', card)?.textContent?.trim() || '',
        chips: qsa('.chips .chip', card).map(c => c.textContent.trim()),
        category: card.dataset.category || ''
      });
    } else { favs.splice(idx, 1); }
    saveFavorites(favs);
  }

  function initFavorites() {
    const favTitles = new Set(getFavorites().map(f => f.title));
    qsa('.card').forEach(card => {
      const t = qs('.card-title', card)?.textContent?.trim();
      if (t && favTitles.has(t)) qs('.fav', card)?.classList.add('active');
    });
  }

  // ========== Глобальний обробник для fav ==========
  document.addEventListener('click', (e) => {
    const favBtn = e.target.closest('.fav');
    if (favBtn) {
      e.preventDefault();
      e.stopPropagation();
      const card = favBtn.closest('.card');
      if (!card) return;
      favBtn.classList.toggle('active');
      toggleFavorite(card);
    }
  });

  // ========== Слайдер ==========
  const slidesContainer = qs('#sliderSlides');
  const slides = qsa('.offer-slide', slidesContainer);
  if (slides.length) {
    let currentIdx = 0;
    let autoInterval;
    const totalSlides = slides.length;
    function updateSlider() { slidesContainer.style.transform = `translateX(-${currentIdx * 100}%)`; }
    function next() { currentIdx = (currentIdx + 1) % totalSlides; updateSlider(); }
    function prev() { currentIdx = (currentIdx - 1 + totalSlides) % totalSlides; updateSlider(); }
    function startAuto() { autoInterval = setInterval(next, 5000); }
    function stopAuto() { clearInterval(autoInterval); }
    startAuto();
    const sliderEl = qs('.offers-slider');
    sliderEl?.addEventListener('mouseenter', stopAuto);
    sliderEl?.addEventListener('mouseleave', startAuto);
    qs('.slider-arrow.prev')?.addEventListener('click', () => { stopAuto(); prev(); startAuto(); });
    qs('.slider-arrow.next')?.addEventListener('click', () => { stopAuto(); next(); startAuto(); });
    updateSlider();
  }

  // ========== Карусель карток ==========
  const track = qs('#carouselTrack');
  const leftBtn = qs('#carouselLeft');
  const rightBtn = qs('#carouselRight');
  if (track && leftBtn && rightBtn) {
    const cards = qsa('.card', track);
    let cardWidth = cards[0]?.getBoundingClientRect().width + 24 || 324;
    let idx = 0;
    function updateCarousel() { track.style.transform = `translateX(-${idx * cardWidth}px)`; }
    rightBtn.addEventListener('click', () => { idx = (idx + 1) % cards.length; updateCarousel(); });
    leftBtn.addEventListener('click', () => { idx = (idx - 1 + cards.length) % cards.length; updateCarousel(); });
    window.addEventListener('resize', () => {
      cardWidth = (cards[0]?.getBoundingClientRect().width || 300) + 24;
      updateCarousel();
    });
  }

  // ========== Дані турів ==========
  const today = new Date();
  const year = 2026;
  const month = '03';
  const formatDate = (day) => `${String(day).padStart(2, '0')}.${month}.${year}`;

  const tourDetailsData = {
    'Балі, Індонезія': { description: 'Екзотичний відпочинок на острові Балі...', departureDates: [formatDate(5), formatDate(12), formatDate(19)], duration: '7 ночей', groupSize: 'До 20 осіб', accommodation: '5-зірковий курорт', price: '35 960 грн' },
    'Крит, Греція': { description: 'Відпочинок на найбільшому грецькому острові...', departureDates: [formatDate(6), formatDate(13), formatDate(20)], duration: '5 ночей', groupSize: 'До 25 осіб', accommodation: '4-зірковий готель', price: '19 960 грн' },
    'Мальдіви': { description: 'Розкішний відпочинок на віллах...', departureDates: [formatDate(7), formatDate(14), formatDate(21)], duration: '6 ночей', groupSize: 'До 15 осіб', accommodation: 'Вілли над водою', price: '51 960 грн' },
    'Бора-Бора': { description: 'Перлина Тихого океану...', departureDates: [formatDate(8), formatDate(15), formatDate(22)], duration: '7 ночей', groupSize: 'До 10 осіб', accommodation: 'Бунгало над водою', price: '59 960 грн' },
    'Палаван, Філіппіни': { description: 'Дика природа, підземні річки...', departureDates: [formatDate(9), formatDate(16), formatDate(23)], duration: '6 ночей', groupSize: 'До 15 осіб', accommodation: 'Еко-готель', price: '31 960 грн' },
    'Самуї, Таїланд': { description: 'Кокосовий острів...', departureDates: [formatDate(10), formatDate(17), formatDate(24)], duration: '7 ночей', groupSize: 'До 20 осіб', accommodation: 'Готель на пляжі', price: '27 960 грн' },
    'Санторіні, Греція': { description: 'Знаменитий острів...', departureDates: [formatDate(11), formatDate(18), formatDate(25)], duration: '5 ночей', groupSize: 'До 20 осіб', accommodation: 'Готель з видом', price: '23 160 грн' },
    'Марокко': { description: 'Східна казка...', departureDates: [formatDate(12), formatDate(19), formatDate(26)], duration: '6 ночей', groupSize: 'До 15 осіб', accommodation: 'Ріад / Готель', price: '15 960 грн' },
    'Хайнань, Китай': { description: 'Тропічний острів...', departureDates: [formatDate(13), formatDate(20), formatDate(27)], duration: '7 ночей', groupSize: 'До 25 осіб', accommodation: '5-зірковий готель', price: '39 960 грн' },
    'Таїті': { description: 'Найбільший острів Французької Полінезії...', departureDates: [formatDate(14), formatDate(21), formatDate(28)], duration: '6 ночей', groupSize: 'До 12 осіб', accommodation: 'Бунгало на березі', price: '55 960 грн' },
    'Сейшели': { description: 'Архіпелаг з гранітними скелями...', departureDates: [formatDate(15), formatDate(22), formatDate(29)], duration: '7 ночей', groupSize: 'До 15 осіб', accommodation: 'Готель на березі', price: '43 960 грн' },
    'Афінська Рив\'єра': { description: 'Узбережжя поблизу Афін...', departureDates: [formatDate(16), formatDate(23), formatDate(30)], duration: '5 ночей', groupSize: 'До 20 осіб', accommodation: 'Готель біля моря', price: '27 960 грн' },
    'Єгипет • All Inclusive': { description: 'Чарівний Єгипет...', departureDates: [formatDate(17), formatDate(24), formatDate(31)], duration: '7 ночей', groupSize: 'До 25 осіб', accommodation: '5-зірковий готель', price: '23 960 грн' },
    'Санторіні • Греція': { description: 'Неймовірний острів...', departureDates: [formatDate(18), formatDate(25), formatDate(1)], duration: '5 ночей', groupSize: 'До 20 осіб', accommodation: 'Готель з видом на кальдеру', price: '19 160 грн' },
    'Марокко • екскурсії': { description: 'Подорож у казку...', departureDates: [formatDate(19), formatDate(26), formatDate(2)], duration: '6 ночей', groupSize: 'До 15 осіб', accommodation: 'Традиційний ріад', price: '15 960 грн' },
    'Мальдіви • вілли': { description: 'Райський відпочинок...', departureDates: [formatDate(20), formatDate(27), formatDate(3)], duration: '7 ночей', groupSize: 'До 10 осіб', accommodation: 'Вілла над водою', price: '51 960 грн' },
    'Сейшели • пляжі': { description: 'Унікальна архіпелаг...', departureDates: [formatDate(21), formatDate(28), formatDate(4)], duration: '7 ночей', groupSize: 'До 20 осіб', accommodation: 'Готель на березі океану', price: '43 960 грн' },
    'Вулканічний трек': { description: 'Активний тур...', departureDates: [formatDate(22), formatDate(29), formatDate(5)], duration: '5 днів', groupSize: 'До 12 осіб', accommodation: 'Кемпінг / Притулки', price: '11 960 грн' },
    'Альпійські лижі': { description: 'Найкращі траси Альп...', departureDates: [formatDate(23), formatDate(30), formatDate(6)], duration: '8 днів', groupSize: 'До 25 осіб', accommodation: 'Шале / Готель', price: '27 960 грн' }
  };

  const allDates = new Set();
  Object.values(tourDetailsData).forEach(d => d.departureDates.forEach(date => allDates.add(date)));
  const sortedDates = Array.from(allDates).sort((a,b) => {
    const [d1,m1,y1] = a.split('.').map(Number);
    const [d2,m2,y2] = b.split('.').map(Number);
    return new Date(y1,m1-1,d1) - new Date(y2,m2-1,d2);
  });
  const availableNote = qs('#availableDatesNote');
  if (availableNote) {
    availableNote.innerHTML = `📅 Доступні дати (найближчі): ${sortedDates.slice(0, 5).join(', ')}`;
  }

  function createCardFromTour(title) {
    const data = tourDetailsData[title];
    if (!data) return '';
    let imgSrc = 'indeximg/card1.jpg';
    if (title.includes('Єгипет')) imgSrc = 'indeximg/bar1.jpg';
    else if (title.includes('Санторіні')) imgSrc = 'indeximg/bar2.jpg';
    else if (title.includes('Марокко')) imgSrc = 'indeximg/bar3.jpg';
    else if (title.includes('Мальдіви')) imgSrc = 'indeximg/bar4.jpg';
    else if (title.includes('Сейшели')) imgSrc = 'indeximg/bar5.jpg';
    else if (title.includes('Вулканічний')) imgSrc = 'indeximg/bar6.jpg';
    else if (title.includes('Альпійські')) imgSrc = 'indeximg/bar7.jpg';
    else if (title.includes('Балі')) imgSrc = 'indeximg/card1.jpg';
    else if (title.includes('Крит')) imgSrc = 'indeximg/card2.jpg';
    else if (title.includes('Бора')) imgSrc = 'indeximg/card4.jpg';
    else if (title.includes('Палаван')) imgSrc = 'indeximg/card5.jpg';
    else if (title.includes('Самуї')) imgSrc = 'indeximg/card6.jpg';
    else if (title.includes('Хайнань')) imgSrc = 'indeximg/card9.jpg';
    else if (title.includes('Таїті')) imgSrc = 'indeximg/card10.jpg';
    else if (title.includes('Афінська')) imgSrc = 'indeximg/card12.jpg';

    const badge = (title.includes('•')) ? title.split('•')[1].trim() : (data.badge || 'Тур');
    const chips = data.departureDates ? data.departureDates.map(d => d.slice(0,5)) : ['Тур'];

    return `
      <article class="card" data-category="${badge}">
        <div class="card-img-wrap">
          <img class="card-img" src="${imgSrc}" alt="${title}" />
          <span class="badge">${badge}</span>
          <button class="fav" title="В обране"></button>
        </div>
        <div class="card-body">
          <h3 class="card-title">${title}</h3>
          <span class="card-meta">${data.duration || ''}</span>
          <span class="card-price">${data.price || ''}</span>
          <div class="chips">${chips.map(c => `<span class="chip">${c}</span>`).join('')}</div>
          <div class="card-actions">
            <div class="left-actions"><button class="btn-primary">Забронювати</button></div>
            <div class="right-actions"><button class="btn-outline">Детальніше</button></div>
          </div>
        </div>
      </article>
    `;
  }

  // ========== Toast ==========
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

  // ========== Пошук за датою ==========
  const searchBtn = qs('#searchByDate');
  const clearBtn = qs('#clearSearch');
  const datePicker = qs('#datePicker');
  const searchResultsDiv = qs('#searchResults');
  const searchResultsTitle = qs('#searchResultsTitle');

  if (searchBtn && datePicker) {
    searchBtn.addEventListener('click', () => {
      const selected = datePicker.value;
      if (!selected) { showToast('❌ Оберіть дату', 'error'); return; }
      const [y,m,d] = selected.split('-');
      const formatted = `${d}.${m}.${y}`;

      const foundTitles = [];
      for (const [title, data] of Object.entries(tourDetailsData)) {
        if (data.departureDates && data.departureDates.includes(formatted)) foundTitles.push(title);
      }

      if (foundTitles.length) {
        searchResultsDiv.innerHTML = foundTitles.map(title => createCardFromTour(title)).join('');
        searchResultsDiv.classList.add('visible');
        searchResultsTitle.classList.add('visible');
        showToast(`✅ Знайдено турів: ${foundTitles.length}`, 'success');
        initFavorites();
      } else {
        searchResultsDiv.classList.remove('visible');
        searchResultsTitle.classList.remove('visible');
        showToast(`❌ На ${formatted} турів немає`, 'error');
      }
    });
  }

  if (clearBtn && datePicker && searchResultsDiv && searchResultsTitle) {
    clearBtn.addEventListener('click', () => {
      datePicker.value = '';
      searchResultsDiv.classList.remove('visible');
      searchResultsTitle.classList.remove('visible');
    });
  }

  // ========== Модальні вікна ==========
  const detailsModal = qs('#modalDetails');
  const modalDetailsImg = qs('#modalDetailsImg');
  const modalDetailsBadge = qs('#modalDetailsBadge');
  const modalDetailsTitle = qs('#modalDetailsTitle');
  const modalDetailsSubtitle = qs('#modalDetailsSubtitle');
  const modalDetailsPrice = qs('#modalDetailsPrice');
  const modalDetailsChips = qs('#modalDetailsChips');
  const modalDetailsBook = qs('#modalDetailsBook');
  const detailsCloseBtns = [qs('#modalDetailsClose'), qs('#modalDetailsClose2')].filter(Boolean);
  const bookModal = qs('#modalBook');
  const modalBookTitle = qs('#modalBookTitle');
  const modalBookForm = qs('#modalBookForm');
  const modalBookSuccess = qs('#modalBookSuccess');
  const bookCloseBtn = qs('#modalBookClose');

  function openDetailsModal(data) {
    if (!data) return;
    const tabBtns = qsa('.modal-tab', detailsModal);
    const panels = qsa('.modal-panel', detailsModal);
    function setTab(tab) {
      tabBtns.forEach(b => b.classList.toggle('active', b.dataset.tab === tab));
      panels.forEach(p => p.classList.toggle('active', p.dataset.panel === tab));
    }
    tabBtns.forEach(b => { b.onclick = () => setTab(b.dataset.tab || 'info'); });
    setTab('info');

    modalDetailsImg && (modalDetailsImg.src = data.img || '');
    modalDetailsBadge && (modalDetailsBadge.textContent = data.badge || '');
    modalDetailsTitle && (modalDetailsTitle.textContent = data.title || '');
    modalDetailsSubtitle && (modalDetailsSubtitle.textContent = data.subtitle || '');
    if (modalDetailsPrice) {
      const clean = (data.price || '').toString().replace(/^від\s*/i, '');
      modalDetailsPrice.textContent = clean ? 'від ' + clean : '';
    }
    if (modalDetailsChips) {
      modalDetailsChips.innerHTML = (data.tags || []).map(t => `<span class="modal-chip">${t}</span>`).join('');
    }
    qs('#modalDetailsDescription', detailsModal).textContent = data.description || '';
    const infoEl = qs('#modalDetailsInfo', detailsModal);
    if (infoEl) {
      infoEl.innerHTML = `
        <div class="modal-info-item"><div class="modal-info-label">📅 Дати</div><div class="modal-info-value">${(data.departureDates || []).slice(0,3).join(', ')}</div></div>
        <div class="modal-info-item"><div class="modal-info-label">⏱️ Тривалість</div><div class="modal-info-value">${data.duration || ''}</div></div>
        <div class="modal-info-item"><div class="modal-info-label">👥 Група</div><div class="modal-info-value">${data.groupSize || ''}</div></div>
        <div class="modal-info-item"><div class="modal-info-label">🏨 Розміщення</div><div class="modal-info-value">${data.accommodation || ''}</div></div>
      `;
    }

    const LS_KEY = 'oceanica_card_reviews_v1';
    const reviewsList = qs('#modalReviewsList', detailsModal);
    const mrfName = qs('#mrfName', detailsModal);
    const mrfStars = qs('#mrfStars', detailsModal);
    const mrfText = qs('#mrfText', detailsModal);
    const mrfClear = qs('#mrfClear', detailsModal);
    const mrfSubmit = qs('#mrfSubmit', detailsModal);
    initStarInput(mrfStars);

    function loadAll() { try { return JSON.parse(localStorage.getItem(LS_KEY) || '{}') || {}; } catch { return {}; } }
    function saveAll(obj) { localStorage.setItem(LS_KEY, JSON.stringify(obj)); }
    function hash(str) { let h = 2166136261; for (let i=0; i<str.length; i++) { h ^= str.charCodeAt(i); h = Math.imul(h, 16777619); } return Math.abs(h); }
    function stars(n) { return '★★★★★'.slice(0, n) + '☆☆☆☆☆'.slice(0, 5-n); }
    function defaultReviews(title) {
      const names = ['Марія','Олег','Ірина','Дмитро','Наталія']; const texts = ['Чудово!','Супер!','Рекомендую','Все сподобалось','Казка!'];
      const h = hash(title || 'tour'); const count = 5 + (h % 3); const out = [];
      for (let i=0; i<count; i++) {
        out.push({ name: names[(h+i)%names.length], stars: 4+((h+i)%2), text: texts[(h+i)%texts.length], date: new Date(Date.now()-i*86400000).toISOString().slice(0,10) });
      } return out;
    }
    function getReviews(title) { const all = loadAll(); return (all[title] && all[title].length) ? all[title] : defaultReviews(title); }
    function setReviews(title, list) { const all = loadAll(); all[title] = list; saveAll(all); }
    function renderReviews(title) {
      if (!reviewsList) return;
      const list = getReviews(title);
      reviewsList.innerHTML = list.map(r => `
        <div class="modal-review"><div class="mrv-avatar">${(r.name||'Г')[0]}</div><div><div class="mrv-top"><span class="mrv-name">${r.name||'Гість'}</span><div style="display:flex;gap:10px;"><span class="mrv-date">${r.date||''}</span><span class="mrv-stars">${stars(Number(r.stars)||5)}</span></div></div><p class="mrv-text">${r.text||''}</p></div></div>
      `).join('');
    }
    renderReviews(data.title);
    if (mrfClear) mrfClear.onclick = () => { mrfName && (mrfName.value = ''); mrfText && (mrfText.value = ''); mrfStars && (mrfStars.dataset.value = '5'); updateStars(mrfStars); };
    if (mrfSubmit) mrfSubmit.onclick = () => {
      const title = data.title.trim();
      const name = (mrfName?.value || '').trim() || 'Гість';
      const text = (mrfText?.value || '').trim();
      const st = Number(mrfStars?.dataset.value || '5');
      if (!title || text.length < 6) { setTab('reviews'); return; }
      const list = getReviews(title).slice();
      list.unshift({ name, stars: Math.min(5, Math.max(3, st)), text, date: new Date().toISOString().slice(0,10) });
      setReviews(title, list);
      renderReviews(title);
      if (mrfText) mrfText.value = '';
      setTab('reviews');
    };

    detailsModal.classList.add('active');
    detailsModal.style.display = 'flex';
    disableBodyScroll();
  }
  function closeDetails() {
    detailsModal.classList.remove('active');
    setTimeout(() => detailsModal.style.display = 'none', 300);
    enableBodyScroll();
  }
  function openBookModal(data) {
    modalBookTitle && (modalBookTitle.textContent = 'Бронювання туру');
    qs('#modalBookSubtitle', bookModal) && (qs('#modalBookSubtitle', bookModal).textContent = data?.title || '');
    modalBookForm && modalBookForm.reset();
    const successEl = qs('#modalBookSuccess', bookModal);
    successEl && (successEl.classList.remove('active'), successEl.style.display = 'none');
    const dateInput = qs('input[name="date"]', modalBookForm);
    if (dateInput) {
      const tomorrow = new Date(); tomorrow.setDate(tomorrow.getDate() + 1);
      dateInput.min = tomorrow.toISOString().split('T')[0];
    }
    bookModal.classList.add('active');
    bookModal.style.display = 'flex';
    disableBodyScroll();
  }
  function closeBook() {
    bookModal.classList.remove('active');
    setTimeout(() => bookModal.style.display = 'none', 300);
    enableBodyScroll();
  }
  detailsCloseBtns.forEach(btn => btn.addEventListener('click', closeDetails));
  if (bookCloseBtn) bookCloseBtn.addEventListener('click', closeBook);
  if (detailsModal) detailsModal.addEventListener('click', e => { if (e.target === detailsModal) closeDetails(); });
  if (bookModal) bookModal.addEventListener('click', e => { if (e.target === bookModal) closeBook(); });
  if (modalDetailsBook) modalDetailsBook.addEventListener('click', () => { closeDetails(); openBookModal({ title: modalDetailsTitle?.textContent?.trim() }); });
  if (modalBookForm) modalBookForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const successEl = qs('#modalBookSuccess', bookModal);
    if (successEl) { successEl.classList.add('active'); successEl.style.display = 'block'; }
    successEl?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    setTimeout(closeBook, 3000);
  });

  // ========== Делеговані події для кнопок на картках ==========
  document.addEventListener('click', (e) => {
    const detailBtn = e.target.closest('.btn-outline:not(.modal-close)') || e.target.closest('.slide-detail-btn');
    if (detailBtn) {
      e.preventDefault();
      let card = detailBtn.closest('.card');
      if (card) {
        const title = qs('.card-title', card)?.textContent?.trim() || '';
        const data = tourDetailsData[title] || {};
        data.title = title;
        data.img = qs('.card-img', card)?.src || '';
        data.badge = qs('.badge', card)?.textContent?.trim() || '';
        data.subtitle = qs('.card-meta', card)?.textContent?.trim() || '';
        data.price = qs('.card-price', card)?.textContent?.trim() || '';
        data.tags = qsa('.chips .chip', card).map(c => c.textContent.trim());
        data.departureDates = data.departureDates || [formatDate(15), formatDate(22), formatDate(29)];
        data.duration = data.duration || (qs('.card-meta', card)?.textContent || '').trim();
        data.groupSize = data.groupSize || 'До 30 осіб';
        data.accommodation = data.accommodation || 'Комфортний готель';
        data.description = data.description || 'Чудовий відпочинок...';
        openDetailsModal(data);
      } else if (detailBtn.classList.contains('slide-detail-btn')) {
        const slide = detailBtn.closest('.offer-slide');
        if (slide) {
          const title = qs('.cap-title', slide)?.textContent?.trim() || '';
          const data = tourDetailsData[title] || {};
          data.title = title;
          data.img = slide.style.backgroundImage.slice(5, -2) || '';
          data.badge = qs('.cap-pill', slide)?.textContent?.trim() || '';
          data.subtitle = qs('.cap-desc', slide)?.textContent?.trim() || '';
          data.price = qs('.new-price', slide)?.textContent?.trim() || '';
          data.tags = [];
          data.departureDates = data.departureDates || [formatDate(15), formatDate(22), formatDate(29)];
          data.duration = data.duration || (qs('.cap-sub', slide)?.textContent || '').trim();
          data.groupSize = data.groupSize || 'До 20 осіб';
          data.accommodation = data.accommodation || 'Готель';
          data.description = data.description || 'Неймовірний відпочинок';
          openDetailsModal(data);
        }
      }
      return;
    }

    const bookBtn = e.target.closest('.btn-primary');
    if (bookBtn && !e.target.closest('#modalDetails')) {
      const card = bookBtn.closest('.card');
      if (card) {
        const title = qs('.card-title', card)?.textContent?.trim() || '';
        const data = tourDetailsData[title] || { title };
        openBookModal(data);
      }
    }
  });

  initFavorites();
})();