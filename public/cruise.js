(function() {
  const qs = (sel, ctx) => (ctx || document).querySelector(sel);
  const qsa = (sel, ctx) => Array.from((ctx || document).querySelectorAll(sel));

  // Поточний елемент для бронювання
  let currentBookingItem = null;

  // ========== Функції модалок ==========
  function disableBodyScroll() { document.body.classList.add('modal-open'); }
  function enableBodyScroll() { document.body.classList.remove('modal-open'); }

  // ========== Зірочки ==========
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

  // ========== Завантаження улюблених з сервера ==========
  async function loadFavorites() {
    if (!window.auth?.getToken()) return;
    try {
      const favs = await window.auth.getFavorites();
      const favTitles = new Set(favs.map(f => f.title));
      qsa('.card').forEach(card => {
        const title = qs('.card-title', card)?.textContent?.trim();
        if (title && favTitles.has(title)) {
          qs('.fav', card)?.classList.add('active');
        }
      });
    } catch (error) {
      console.error('Помилка завантаження улюблених:', error);
    }
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

  // ========== Глобальний обробник кліку на лайк ==========
  document.addEventListener('click', async (e) => {
    const favBtn = e.target.closest('.fav');
    if (favBtn) {
      e.preventDefault();
      e.stopPropagation();
      const card = favBtn.closest('.card');
      if (!card) return;

      if (!window.auth?.getToken()) {
        showToast('🔒 Увійдіть, щоб додавати в обране', 'info');
        setTimeout(() => { window.location.href = 'login.html'; }, 1500);
        return;
      }

      const title = qs('.card-title', card)?.textContent?.trim() || '';
      const image = qs('.card-img', card)?.src || '';
      const price = qs('.card-price', card)?.textContent?.trim() || '';
      const meta = qs('.card-meta', card)?.textContent?.trim() || '';
      const badge = qs('.badge', card)?.textContent?.trim() || '';
      const chips = qsa('.chips .chip', card).map(c => c.textContent.trim());
      const category = card.dataset.category || '';

      const item = { title, image, price, meta, badge, chips, category };

      try {
        const result = await window.auth.toggleFavorite(item);
        if (result.success) {
          if (result.action === 'added') {
            favBtn.classList.add('active');
            showToast('✅ Додано в улюблені', 'success');
          } else if (result.action === 'removed') {
            favBtn.classList.remove('active');
            showToast('🗑️ Видалено з улюблених', 'info');
          }
        } else {
          showToast(result.message || 'Помилка', 'error');
        }
      } catch (error) {
        console.error('Помилка:', error);
        showToast('Помилка з\'єднання', 'error');
      }
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

  // ========== Дані круїзів ==========
  const today = new Date();
  const year = 2026;
  const month = '03';
  const formatDate = (day) => `${String(day).padStart(2, '0')}.05.${year}`;

  const cruiseDetailsData = {
    'Середземне море': {
      description: 'Чарівний круїз Середземним морем...',
      departureDates: ['15.03.2026', '22.03.2026', '05.04.2026'],
      duration: '7 ночей',
      groupSize: 'До 200 осіб',
      accommodation: 'Лайнер класу люкс',
      price: '42 500 грн'
    },
    'Карибські острови': {
      description: 'Райський круїз Карибами...',
      departureDates: ['10.04.2026', '24.04.2026', '08.05.2026'],
      duration: '10 ночей',
      groupSize: 'До 250 осіб',
      accommodation: 'Лайнер з балконами',
      price: '67 800 грн'
    },
    'Норвезькі фіорди': {
      description: 'Неймовірний круїз норвезькими фіордами...',
      departureDates: ['20.03.2026', '03.04.2026', '17.04.2026'],
      duration: '8 ночей',
      groupSize: 'До 180 осіб',
      accommodation: 'Експедиційний лайнер',
      price: '53 200 грн'
    },
    'Аляска': {
      description: 'Круїз до найбільшого штату США...',
      departureDates: ['05.05.2026', '19.05.2026', '02.06.2026'],
      duration: '9 ночей',
      groupSize: 'До 220 осіб',
      accommodation: 'Лайнер преміум-класу',
      price: '61 500 грн'
    },
    'Круїз навколо світу': {
      description: 'Неймовірна навколосвітня подорож тривалістю 120 днів. Ви відвідаєте 6 континентів, 30 країн, побачите найвідоміші пам’ятки планети. На вас чекають: Ріо-де-Жанейро, Сідней, Токіо, Венеція, Нью-Йорк та багато інших. Розкішний лайнер, все включено, насичена екскурсійна програма.',
      departureDates: ['10.01.2026', '05.03.2026', '15.05.2026'],
      duration: '120 днів',
      groupSize: 'До 300 осіб',
      accommodation: 'Лайнер преміум-класу',
      price: '799 000 грн'
    },
    'Грецькі острови': {
      description: 'Знамениті грецькі острови...',
      departureDates: ['12.04.2026', '26.04.2026', '10.05.2026'],
      duration: '6 ночей',
      groupSize: 'До 150 осіб',
      accommodation: 'Комфортабельний лайнер',
      price: '38 900 грн'
    },
    'Дунай': {
      description: 'Річковий круїз Дунаєм...',
      departureDates: ['08.03.2026', '22.03.2026', '05.04.2026'],
      duration: '7 ночей',
      groupSize: 'До 120 осіб',
      accommodation: 'Річковий лайнер',
      price: '29 800 грн'
    },
    'Аравія': {
      description: 'Розкішний круїз узбережжям Аравії...',
      departureDates: ['25.05.2026', '09.06.2026', '23.06.2026'],
      duration: '8 ночей',
      groupSize: 'До 200 осіб',
      accommodation: 'Лайнер класу люкс',
      price: '73 200 грн'
    },
    'Андаманське море': {
      description: 'Екзотичний круїз Таїландом...',
      departureDates: ['15.06.2026', '29.06.2026', '13.07.2026'],
      duration: '5 ночей',
      groupSize: 'До 160 осіб',
      accommodation: 'Лайнер з відкритими палубами',
      price: '33 500 грн'
    },
    'Японське море': {
      description: 'Неймовірний круїз Японією...',
      departureDates: ['04.04.2026', '18.04.2026', '02.05.2026'],
      duration: '10 ночей',
      groupSize: 'До 180 осіб',
      accommodation: 'Лайнер преміум-класу',
      price: '89 900 грн'
    },
    'Ісландія': {
      description: 'Круїз до країни льодовиків та вулканів...',
      departureDates: ['10.06.2026', '24.06.2026', '07.07.2026'],
      duration: '7 ночей',
      groupSize: 'До 140 осіб',
      accommodation: 'Експедиційний лайнер',
      price: '65 200 грн'
    },
    'Чорне море': {
      description: 'Чорноморський круїз...',
      departureDates: ['20.05.2026', '04.06.2026', '18.06.2026'],
      duration: '5 ночей',
      groupSize: 'До 200 осіб',
      accommodation: 'Комфортабельний лайнер',
      price: '18 500 грн'
    },
    'Балтійське море': {
      description: 'Круїз Балтійським морем...',
      departureDates: ['12.06.2026', '26.06.2026', '09.07.2026'],
      duration: '8 ночей',
      groupSize: 'До 210 осіб',
      accommodation: 'Лайнер з балконами',
      price: '41 200 грн'
    }
  };

  function createCruiseCard(title, category) {
    const data = cruiseDetailsData[title] || {};
    let imgSrc = 'cruiseimg/cruise1.jpg';
    if (title.includes('Середземне')) imgSrc = 'cruiseimg/cruise1.jpg';
    else if (title.includes('Карибські')) imgSrc = 'cruiseimg/cruise2.jpg';
    else if (title.includes('Норвезькі')) imgSrc = 'cruiseimg/cruise3.jpg';
    else if (title.includes('Аляска')) imgSrc = 'cruiseimg/cruise4.jpg';
    else if (title.includes('Грецькі')) imgSrc = 'cruiseimg/cruise5.jpg';
    else if (title.includes('Дунай')) imgSrc = 'cruiseimg/cruise6.jpg';
    else if (title.includes('Аравія')) imgSrc = 'cruiseimg/cruise7.jpg';
    else if (title.includes('Андаманське')) imgSrc = 'cruiseimg/cruise8.jpg';
    else if (title.includes('Японське')) imgSrc = 'cruiseimg/cruise9.jpg';
    else if (title.includes('Ісландія')) imgSrc = 'cruiseimg/cruise10.jpg';
    else if (title.includes('Чорне')) imgSrc = 'cruiseimg/cruise11.jpg';
    else if (title.includes('Балтійське')) imgSrc = 'cruiseimg/cruise12.jpg';

    const badgeMap = {
      warm: '☀️ Теплі води',
      cold: '❄️ Холодні води',
      temperate: '🌊 Помірні води'
    };
    const badge = badgeMap[category] || '🌊 Круїз';

    return `
      <article class="card" data-category="${category}">
        <div class="card-img-wrap">
          <img class="card-img" src="${imgSrc}" alt="${title}" />
          <span class="badge">${badge}</span>
          <button class="fav" title="В обране"></button>
        </div>
        <div class="card-body">
          <h3 class="card-title">${title}</h3>
          <span class="card-meta">${data.duration || '7 ночей'}</span>
          <span class="card-price">${data.price || '42 500 грн'}</span>
          <div class="chips">${(data.departureDates || []).slice(0,3).map(d => `<span class="chip">${d}</span>`).join('')}</div>
          <div class="card-actions">
            <div class="left-actions"><button class="btn-primary">Забронювати</button></div>
            <div class="right-actions"><button class="btn-outline">Детальніше</button></div>
          </div>
        </div>
      </article>
    `;
  }

  const cruisesGrid = qs('#cruisesGrid');
  if (cruisesGrid) {
    const cruiseList = [
      { title: 'Середземне море', cat: 'temperate' },
      { title: 'Карибські острови', cat: 'warm' },
      { title: 'Норвезькі фіорди', cat: 'cold' },
      { title: 'Аляска', cat: 'cold' },
      { title: 'Грецькі острови', cat: 'warm' },
      { title: 'Дунай', cat: 'temperate' },
      { title: 'Аравія', cat: 'warm' },
      { title: 'Андаманське море', cat: 'warm' },
      { title: 'Японське море', cat: 'temperate' },
      { title: 'Ісландія', cat: 'cold' },
      { title: 'Чорне море', cat: 'temperate' },
      { title: 'Балтійське море', cat: 'temperate' }
    ];
    cruisesGrid.innerHTML = cruiseList.map(c => createCruiseCard(c.title, c.cat)).join('');
    loadFavorites();
  }

  // ========== Фільтр категорій ==========
  const filterBtn = qs('#filterBtn');
  const filterPanel = qs('#filterPanel');
  const categoryChips = qs('#categoryChips');
  const cards = qsa('.card');

  const categories = ['warm', 'cold', 'temperate'];
  const categoryNames = {
    warm: '☀️ Теплі води',
    cold: '❄️ Холодні води',
    temperate: '🌊 Помірні води'
  };

  function renderChips() {
    let html = '<div class="category-chip reset" data-category="reset">✖ Скинути</div>';
    categories.forEach(cat => {
      html += `<div class="category-chip" data-category="${cat}">${categoryNames[cat]}</div>`;
    });
    categoryChips.innerHTML = html;
  }
  renderChips();

  const selectedCategories = new Set();

  function filterCards() {
    if (selectedCategories.size === 0) {
      cards.forEach(card => card.style.display = '');
    } else {
      cards.forEach(card => {
        if (selectedCategories.has(card.dataset.category)) {
          card.style.display = '';
        } else {
          card.style.display = 'none';
        }
      });
    }
  }

  categoryChips.addEventListener('click', (e) => {
    const chip = e.target.closest('.category-chip');
    if (!chip) return;
    const cat = chip.dataset.category;

    if (cat === 'reset') {
      selectedCategories.clear();
      qsa('.category-chip').forEach(ch => ch.classList.remove('active'));
    } else {
      if (selectedCategories.has(cat)) {
        selectedCategories.delete(cat);
        chip.classList.remove('active');
      } else {
        selectedCategories.add(cat);
        chip.classList.add('active');
      }
    }
    filterCards();
  });

  filterBtn.addEventListener('click', () => {
    filterPanel.classList.toggle('active');
  });

  // ========== Пошук за датою ==========
  const searchBtn = qs('#searchByDate');
  const clearBtn = qs('#clearSearch');
  const datePicker = qs('#datePicker');
  const searchResultsDiv = qs('#searchResults');
  const searchResultsTitle = qs('#searchResultsTitle');

  const allDates = new Set();
  Object.values(cruiseDetailsData).forEach(d => d.departureDates.forEach(date => allDates.add(date)));
  const sortedDates = Array.from(allDates).sort((a,b) => {
    const [d1,m1,y1] = a.split('.').map(Number);
    const [d2,m2,y2] = b.split('.').map(Number);
    return new Date(y1,m1-1,d1) - new Date(y2,m2-1,d2);
  });
  const availableNote = qs('#availableDatesNote');
  if (availableNote) {
    availableNote.innerHTML = `📅 Доступні дати: ${sortedDates.slice(0, 7).join(', ')}`;
  }

  if (searchBtn && datePicker) {
    searchBtn.addEventListener('click', () => {
      const selected = datePicker.value;
      if (!selected) { showToast('❌ Оберіть дату', 'error'); return; }
      const [y,m,d] = selected.split('-');
      const formatted = `${d}.${m}.${y}`;

      const foundTitles = [];
      for (const [title, data] of Object.entries(cruiseDetailsData)) {
        if (data.departureDates && data.departureDates.includes(formatted)) foundTitles.push(title);
      }

      if (foundTitles.length) {
        const cruiseList = [
          { title: 'Середземне море', cat: 'temperate' },
          { title: 'Карибські острови', cat: 'warm' },
          { title: 'Норвезькі фіорди', cat: 'cold' },
          { title: 'Аляска', cat: 'cold' },
          { title: 'Грецькі острови', cat: 'warm' },
          { title: 'Дунай', cat: 'temperate' },
          { title: 'Аравія', cat: 'warm' },
          { title: 'Андаманське море', cat: 'warm' },
          { title: 'Японське море', cat: 'temperate' },
          { title: 'Ісландія', cat: 'cold' },
          { title: 'Чорне море', cat: 'temperate' },
          { title: 'Балтійське море', cat: 'temperate' }
        ];
        const filtered = cruiseList.filter(c => foundTitles.includes(c.title));
        searchResultsDiv.innerHTML = filtered.map(c => createCruiseCard(c.title, c.cat)).join('');
        loadFavorites();
        searchResultsDiv.classList.add('visible');
        searchResultsTitle.classList.add('visible');
        showToast(`✅ Знайдено круїзів: ${foundTitles.length}`, 'success');
      } else {
        searchResultsDiv.classList.remove('visible');
        searchResultsTitle.classList.remove('visible');
        showToast(`❌ На ${formatted} круїзів немає`, 'error');
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

  function findDataByTitle(title) {
    return cruiseDetailsData[title] || null;
  }

  function buildDataFromCard(card) {
    const title = qs('.card-title', card)?.textContent?.trim() || '';
    const details = cruiseDetailsData[title] || {};
    return {
      title,
      subtitle: qs('.card-meta', card)?.textContent?.trim() || '',
      price: qs('.card-price', card)?.textContent?.trim() || '',
      img: qs('.card-img', card)?.src || '',
      badge: qs('.badge', card)?.textContent?.trim() || '',
      tags: qsa('.chips .chip', card).map(c => c.textContent.trim()),
      description: details.description || 'Чудовий круїз.',
      departureDates: details.departureDates || ['15.05.2025', '29.05.2025', '12.06.2025'],
      duration: details.duration || (qs('.card-meta', card)?.textContent || '').trim(),
      groupSize: details.groupSize || 'До 200 осіб',
      accommodation: details.accommodation || 'Комфортабельний лайнер'
    };
  }

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
      modalDetailsPrice.textContent = data.price ? 'від ' + data.price : '';
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
      const h = hash(title || 'cruise'); const count = 5 + (h % 3); const out = [];
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
      if (!title || text.length < 3) { setTab('reviews'); return; }
      const list = getReviews(title).slice();
      list.unshift({ name, stars: Math.min(5, Math.max(1, st)), text, date: new Date().toISOString().slice(0,10) });
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
    modalBookTitle && (modalBookTitle.textContent = 'Бронювання круїзу');
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

  if (modalBookForm) {
    modalBookForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      if (!window.auth?.getToken()) {
        showToast('🔒 Увійдіть, щоб забронювати', 'info');
        setTimeout(() => { window.location.href = 'login.html'; }, 1500);
        return;
      }
      if (!currentBookingItem) {
        showToast('Помилка: дані туру відсутні', 'error');
        return;
      }
      const dateInput = qs('input[name="date"]', modalBookForm);
      if (!dateInput.value) {
        showToast('Оберіть дату', 'error');
        return;
      }
      const [y, m, d] = dateInput.value.split('-');
      const bookingDate = `${d}.${m}.${y}`;
      const bookingItem = { ...currentBookingItem, bookingDate };
      try {
        const result = await window.auth.addBooking(bookingItem);
        if (result.success) {
          const successEl = qs('#modalBookSuccess', bookModal);
          if (successEl) {
            successEl.classList.add('active');
            successEl.style.display = 'block';
          }
          successEl?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
          setTimeout(closeBook, 3000);
        } else {
          showToast(result.message || 'Помилка бронювання', 'error');
        }
      } catch (error) {
        console.error('Помилка бронювання:', error);
        showToast('Помилка з\'єднання', 'error');
      }
    });
  }

  // ========== Обробник для кнопки "Дізнатися більше" в гарячій пропозиції ==========
  const worldCruiseBtn = document.getElementById('worldCruiseBtn');
  if (worldCruiseBtn) {
    worldCruiseBtn.addEventListener('click', function(e) {
      e.preventDefault();
      const data = cruiseDetailsData['Круїз навколо світу'] || {};
      data.title = 'Круїз навколо світу';
      data.img = 'cruiseimg/world_cruise.jpg';
      data.badge = '🔥 Гаряча пропозиція';
      data.subtitle = '120 днів • 6 континентів • 30 країн';
      data.price = '799 000 грн';
      data.tags = ['Навколо світу', 'Преміум', 'Все включено'];
      openDetailsModal(data);
    });
  }

  // ========== Делеговані події для кнопок на картках ==========
  document.addEventListener('click', (e) => {
    const detailBtn = e.target.closest('.btn-outline:not(.modal-close)') || e.target.closest('.slide-detail-btn');
    if (detailBtn) {
      e.preventDefault();
      let card = detailBtn.closest('.card');
      if (card) {
        const data = buildDataFromCard(card);
        openDetailsModal(data);
      } else if (detailBtn.classList.contains('slide-detail-btn')) {
        const slide = detailBtn.closest('.offer-slide');
        if (slide) {
          const title = qs('.cap-title', slide)?.textContent?.trim() || '';
          const data = cruiseDetailsData[title] || {};
          data.title = title;
          data.img = slide.style.backgroundImage.slice(5, -2) || '';
          data.badge = qs('.cap-pill', slide)?.textContent?.trim() || '';
          data.subtitle = qs('.cap-desc', slide)?.textContent?.trim() || '';
          data.price = qs('.new-price', slide)?.textContent?.trim() || '';
          data.tags = [];
          data.departureDates = data.departureDates || ['15.05.2025', '22.05.2025', '05.06.2025'];
          data.duration = data.duration || (qs('.cap-sub', slide)?.textContent || '').trim();
          data.groupSize = data.groupSize || 'До 200 осіб';
          data.accommodation = data.accommodation || 'Лайнер';
          data.description = data.description || 'Неймовірний круїз';
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
        const image = qs('.card-img', card)?.src || '';
        const price = qs('.card-price', card)?.textContent?.trim() || '';
        const meta = qs('.card-meta', card)?.textContent?.trim() || '';
        const badge = qs('.badge', card)?.textContent?.trim() || '';
        const chips = qsa('.chips .chip', card).map(c => c.textContent.trim());
        const category = card.dataset.category || '';
        currentBookingItem = { title, image, price, meta, badge, chips, category };
        openBookModal(currentBookingItem);
      }
    }
  });

  // Ініціалізація зірочок у формі (якщо є)
  const rfStars = qs('#rfStars');
  if (rfStars) initStarInput(rfStars);
})();