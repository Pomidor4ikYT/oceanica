(function() {
  const qs = (sel, ctx) => (ctx || document).querySelector(sel);
  const qsa = (sel, ctx) => Array.from((ctx || document).querySelectorAll(sel));

  // ========== Управління модальними вікнами ==========
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

  // ========== Робота з улюбленими (з авторизацією) ==========
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
    } else {
      favs.splice(idx, 1);
    }
    saveFavorites(favs);
  }

  function initFavorites() {
    const favTitles = new Set(getFavorites().map(f => f.title));
    qsa('.card').forEach(card => {
      const t = qs('.card-title', card)?.textContent?.trim();
      if (t && favTitles.has(t)) qs('.fav', card)?.classList.add('active');
    });
  }

  // ========== Глобальний обробник кліку на лайк ==========
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

  // ========== Дані турів ==========
  const tourDetailsData = {
    'Таїланд: Пхукет & Пхі-Пхі': {
      description: 'Неймовірний відпочинок на найкращих пляжах Таїланду. Вас чекають кришталево чиста вода, вапнякові скелі та масаж на березі океану.',
      departureDates: ['05.03.2026', '12.03.2026', '19.03.2026'],
      duration: '10 днів',
      groupSize: 'До 20 осіб',
      accommodation: 'Готелі 4* на першій лінії',
      price: '39 900 грн'
    },
    'Італія: Рим, Флоренція, Венеція': {
      description: 'Знамениті італійські міста: Колізей, Да Вінчі, гондоли. Екскурсії з професійними гідами.',
      departureDates: ['10.03.2026', '17.03.2026', '24.03.2026'],
      duration: '8 днів',
      groupSize: 'До 25 осіб',
      accommodation: 'Готелі 4* в центрах міст',
      price: '31 200 грн'
    },
    'Непал: Еверест та храми': {
      description: 'Треккінг до базового табору Евересту, відвідування стародавніх храмів, неймовірні краєвиди Гімалаїв.',
      departureDates: ['15.03.2026', '22.03.2026', '29.03.2026'],
      duration: '12 днів',
      groupSize: 'До 12 осіб',
      accommodation: 'Гірські притулки, готелі',
      price: '47 500 грн'
    },
    'Мальдіви: райські атоли': {
      description: 'Відпочинок на віллах над водою, білі пляжі, снорклінг серед коралів. Все включено.',
      departureDates: ['20.03.2026', '27.03.2026', '03.04.2026'],
      duration: '7 днів',
      groupSize: 'До 15 осіб',
      accommodation: 'Вілли над водою 5*',
      price: '67 800 грн'
    },
    'Франція: Париж, Долина Луари': {
      description: 'Романтичний Париж, Ейфелева вежа, Лувр та казкові замки долини Луари.',
      departureDates: ['25.03.2026', '01.04.2026', '08.04.2026'],
      duration: '6 днів',
      groupSize: 'До 20 осіб',
      accommodation: 'Готелі 4* в центрі',
      price: '28 900 грн'
    },
    'Швейцарія: Альпи та озера': {
      description: 'Найкращі курорти Швейцарії: Женевське озеро, Маттергорн, сирні дегустації.',
      departureDates: ['30.03.2026', '06.04.2026', '13.04.2026'],
      duration: '7 днів',
      groupSize: 'До 18 осіб',
      accommodation: 'Готелі в горах',
      price: '52 300 грн'
    },
    'Єгипет: Хургада, піраміди': {
      description: 'Червоне море, дайвінг, екскурсія до пірамід та Сфінкса. All Inclusive.',
      departureDates: ['05.04.2026', '12.04.2026', '19.04.2026'],
      duration: '10 днів',
      groupSize: 'До 30 осіб',
      accommodation: '5* готелі на березі',
      price: '24 500 грн'
    },
    'Греція: Афіни, Метеори, Салоніки': {
      description: 'Акрополь, монастирі Метеори, узбережжя Егейського моря.',
      departureDates: ['10.04.2026', '17.04.2026', '24.04.2026'],
      duration: '7 днів',
      groupSize: 'До 25 осіб',
      accommodation: 'Готелі 4*',
      price: '26 800 грн'
    },
    'Перу: Мачу-Пікчу та Анди': {
      description: 'Загублене місто інків, Куско, Амазонка. Справжня пригода.',
      departureDates: ['15.04.2026', '22.04.2026', '29.04.2026'],
      duration: '9 днів',
      groupSize: 'До 15 осіб',
      accommodation: 'Готелі та еко-лоджі',
      price: '58 900 грн'
    },
    'Балі: храми та серфінг': {
      description: 'Вулкани, храми, ритуали, чайні плантації та серфінг на кращих хвилях.',
      departureDates: ['20.04.2026', '27.04.2026', '04.05.2026'],
      duration: '11 днів',
      groupSize: 'До 20 осіб',
      accommodation: 'Вілли та готелі',
      price: '44 200 грн'
    },
    'Ісландія: вулкани та льодовики': {
      description: 'Гейзери, водоспади, чорні пляжі, північне сяйво. Унікальна природа.',
      departureDates: ['25.04.2026', '02.05.2026', '09.05.2026'],
      duration: '8 днів',
      groupSize: 'До 15 осіб',
      accommodation: 'Готелі та кемпінги',
      price: '62 300 грн'
    },
    'Японія: Токіо, Кіото, Осака': {
      description: 'Фудзі, храми, суші, сучасне та традиційне. Найкраще в Японії.',
      departureDates: ['30.04.2026', '07.05.2026', '14.05.2026'],
      duration: '10 днів',
      groupSize: 'До 18 осіб',
      accommodation: 'Готелі 4*',
      price: '72 500 грн'
    },
    'Тур вихідного дня': {
      description: '2 дні неймовірних вражень: відвідайте три європейські столиці за одну ціну. Ідеально для короткого відпочинку.',
      departureDates: ['10.03.2026', '17.03.2026', '24.03.2026'],
      duration: '2 дні',
      groupSize: 'До 30 осіб',
      accommodation: 'Готелі 3* в центрі',
      price: '9 990 грн'
    }
  };

  const tourList = [
    { title: 'Таїланд: Пхукет & Пхі-Пхі', cat: 'beach' },
    { title: 'Італія: Рим, Флоренція, Венеція', cat: 'excursion' },
    { title: 'Непал: Еверест та храми', cat: 'mountain' },
    { title: 'Мальдіви: райські атоли', cat: 'beach' },
    { title: 'Франція: Париж, Долина Луари', cat: 'excursion' },
    { title: 'Швейцарія: Альпи та озера', cat: 'mountain' },
    { title: 'Єгипет: Хургада, піраміди', cat: 'beach' },
    { title: 'Греція: Афіни, Метеори, Салоніки', cat: 'excursion' },
    { title: 'Перу: Мачу-Пікчу та Анди', cat: 'mountain' },
    { title: 'Балі: храми та серфінг', cat: 'beach' },
    { title: 'Ісландія: вулкани та льодовики', cat: 'mountain' },
    { title: 'Японія: Токіо, Кіото, Осака', cat: 'excursion' }
  ];

  function createCardFromTour(title) {
    const data = tourDetailsData[title] || {};
    const cat = tourList.find(t => t.title === title)?.cat || 'excursion';
    const index = tourList.findIndex(t => t.title === title) + 1;
    const imgSrc = `toursimg/tour${index}.jpg`;

    const badgeMap = {
      beach: '🏖️ Пляжний',
      excursion: '🏛️ Екскурсійний',
      mountain: '⛰️ Гірський'
    };
    const badge = badgeMap[cat] || '✈️ Тур';

    return `
      <article class="card" data-category="${cat}">
        <div class="card-img-wrap">
          <img class="card-img" src="${imgSrc}" alt="${title}" />
          <span class="badge">${badge}</span>
          <button class="fav" title="В обране"></button>
        </div>
        <div class="card-body">
          <h3 class="card-title">${title}</h3>
          <span class="card-meta">${data.duration || '7 днів'}</span>
          <span class="card-price">${data.price || '30 000 грн'}</span>
          <div class="chips">${(data.departureDates || []).slice(0,3).map(d => `<span class="chip">${d}</span>`).join('')}</div>
          <div class="card-actions">
            <div class="left-actions"><button class="btn-primary">Забронювати</button></div>
            <div class="right-actions"><button class="btn-outline">Детальніше</button></div>
          </div>
        </div>
      </article>
    `;
  }

  const toursGrid = qs('#toursGrid');
  if (toursGrid) {
    toursGrid.innerHTML = tourList.map(t => createCardFromTour(t.title)).join('');
    initFavorites();
  }

  // ========== Фільтр категорій ==========
  const filterBtn = qs('#filterBtn');
  const filterPanel = qs('#filterPanel');
  const categoryChips = qs('#categoryChips');
  const cards = qsa('.card');

  const categories = ['beach', 'excursion', 'mountain'];
  const categoryNames = {
    beach: '🏖️ Пляжні',
    excursion: '🏛️ Екскурсійні',
    mountain: '⛰️ Гірські'
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
  Object.values(tourDetailsData).forEach(d => d.departureDates.forEach(date => allDates.add(date)));
  const sortedDates = Array.from(allDates).sort((a,b) => {
    const [d1,m1,y1] = a.split('.').map(Number);
    const [d2,m2,y2] = b.split('.').map(Number);
    return new Date(y1,m1-1,d1) - new Date(y2,m2-1,d2);
  });
  const availableNote = qs('#availableDatesNote');
  if (availableNote) {
    availableNote.innerHTML = `📅 Доступні дати: ${sortedDates.slice(0, 7).join(', ')}`;
  }

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

  if (searchBtn && datePicker) {
    searchBtn.addEventListener('click', () => {
      const selected = datePicker.value;
      if (!selected) { showToast('❌ Оберіть дату', false); return; }
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

  function findDataByTitle(title) {
    return tourDetailsData[title] || null;
  }

  function buildDataFromCard(card) {
    const title = qs('.card-title', card)?.textContent?.trim() || '';
    const details = tourDetailsData[title] || {};
    return {
      title,
      subtitle: qs('.card-meta', card)?.textContent?.trim() || '',
      price: qs('.card-price', card)?.textContent?.trim() || '',
      img: qs('.card-img', card)?.src || '',
      badge: qs('.badge', card)?.textContent?.trim() || '',
      tags: qsa('.chips .chip', card).map(c => c.textContent.trim()),
      description: details.description || 'Чудовий тур.',
      departureDates: details.departureDates || ['15.03.2026', '22.03.2026', '29.03.2026'],
      duration: details.duration || (qs('.card-meta', card)?.textContent || '').trim(),
      groupSize: details.groupSize || 'До 20 осіб',
      accommodation: details.accommodation || 'Готель 4*'
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

  const specialTourBtn = qs('#specialTourBtn');
  if (specialTourBtn) {
    specialTourBtn.addEventListener('click', function(e) {
      e.preventDefault();
      const data = tourDetailsData['Тур вихідного дня'] || {};
      data.title = 'Тур вихідного дня';
      data.img = 'toursimg/tour_special.jpg';
      data.badge = '🔥 Гаряча пропозиція';
      data.subtitle = '2 дні • 3 столиці';
      data.price = '9 990 грн';
      data.tags = ['Європа', 'Екскурсія', 'Бюджетно'];
      openDetailsModal(data);
    });
  }

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
          const data = tourDetailsData[title] || {};
          data.title = title;
          data.img = slide.style.backgroundImage.slice(5, -2) || '';
          data.badge = qs('.cap-pill', slide)?.textContent?.trim() || '';
          data.subtitle = qs('.cap-desc', slide)?.textContent?.trim() || '';
          data.price = qs('.new-price', slide)?.textContent?.trim() || '';
          data.tags = [];
          data.departureDates = data.departureDates || ['15.03.2026', '22.03.2026', '29.03.2026'];
          data.duration = data.duration || (qs('.cap-sub', slide)?.textContent || '').trim();
          data.groupSize = data.groupSize || 'До 20 осіб';
          data.accommodation = data.accommodation || 'Готель';
          data.description = data.description || 'Неймовірний тур';
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