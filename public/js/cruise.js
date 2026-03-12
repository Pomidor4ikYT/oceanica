// public/js/cruise.js
(function() {
  const qs = (sel, ctx) => (ctx || document).querySelector(sel);
  const qsa = (sel, ctx) => Array.from((ctx || document).querySelectorAll(sel));

  // ========== Дефолтні дані круїзів (якщо API не працює) ==========
  const defaultCruises = [
    {
      id: 1,
      title: 'Середземне море',
      price: '42 500 грн',
      duration: '7 ночей',
      groupSize: 'До 200 осіб',
      accommodation: 'Лайнер класу люкс',
      badge: '🌊 Помірні води',
      category: 'temperate',
      image: 'styles/img/cruise/cruise1.jpg',
      meta: '7 ночей',
      departureDates: ['15.03.2026', '22.03.2026', '05.04.2026'],
      chips: ['Італія', 'Греція', 'Іспанія'],
      description: 'Чарівний круїз Середземним морем. Відвідайте Італію, Грецію та Іспанію.'
    },
    {
      id: 2,
      title: 'Карибські острови',
      price: '67 800 грн',
      duration: '10 ночей',
      groupSize: 'До 250 осіб',
      accommodation: 'Лайнер з балконами',
      badge: '☀️ Теплі води',
      category: 'warm',
      image: 'styles/img/cruise/cruise2.jpg',
      meta: '10 ночей',
      departureDates: ['10.04.2026', '24.04.2026', '08.05.2026'],
      chips: ['Багами', 'Ямайка', 'Дайвінг'],
      description: 'Райський круїз Карибами. Білі пляжі, бірюзова вода, дайвінг.'
    },
    {
      id: 3,
      title: 'Норвезькі фіорди',
      price: '53 200 грн',
      duration: '8 ночей',
      groupSize: 'До 180 осіб',
      accommodation: 'Експедиційний лайнер',
      badge: '❄️ Холодні води',
      category: 'cold',
      image: 'styles/img/cruise/cruise3.jpg',
      meta: '8 ночей',
      departureDates: ['20.03.2026', '03.04.2026', '17.04.2026'],
      chips: ['Берген', 'Гейрангер', 'Північне сяйво'],
      description: 'Неймовірний круїз норвезькими фіордами. Льодовики, водоспади, північне сяйво.'
    },
    {
      id: 4,
      title: 'Аляска',
      price: '61 500 грн',
      duration: '9 ночей',
      groupSize: 'До 220 осіб',
      accommodation: 'Лайнер преміум-класу',
      badge: '❄️ Холодні води',
      category: 'cold',
      image: 'styles/img/cruise/cruise4.jpg',
      meta: '9 ночей',
      departureDates: ['05.05.2026', '19.05.2026', '02.06.2026'],
      chips: ['Джуно', 'Сьюард', 'Льодовики'],
      description: 'Круїз до найбільшого штату США. Величні льодовики, кити, національні парки.'
    },
    {
      id: 5,
      title: 'Грецькі острови',
      price: '38 900 грн',
      duration: '6 ночей',
      groupSize: 'До 150 осіб',
      accommodation: 'Комфортабельний лайнер',
      badge: '☀️ Теплі води',
      category: 'warm',
      image: 'styles/img/cruise/cruise5.jpg',
      meta: '6 ночей',
      departureDates: ['12.04.2026', '26.04.2026', '10.05.2026'],
      chips: ['Санторіні', 'Міконос', 'Кріт'],
      description: 'Знамениті грецькі острови. Санторіні, Міконос, Кріт.'
    },
    {
      id: 6,
      title: 'Дунай',
      price: '29 800 грн',
      duration: '7 ночей',
      groupSize: 'До 120 осіб',
      accommodation: 'Річковий лайнер',
      badge: '🌊 Помірні води',
      category: 'temperate',
      image: 'styles/img/cruise/cruise6.jpg',
      meta: '7 ночей',
      departureDates: ['08.03.2026', '22.03.2026', '05.04.2026'],
      chips: ['Відень', 'Будапешт', 'Братислава'],
      description: 'Річковий круїз Дунаєм. Відень, Будапешт, Братислава.'
    },
    {
      id: 7,
      title: 'Аравія',
      price: '73 200 грн',
      duration: '8 ночей',
      groupSize: 'До 200 осіб',
      accommodation: 'Лайнер класу люкс',
      badge: '☀️ Теплі води',
      category: 'warm',
      image: 'styles/img/cruise/cruise7.jpg',
      meta: '8 ночей',
      departureDates: ['25.05.2026', '09.06.2026', '23.06.2026'],
      chips: ['Дубай', 'Оман', 'Катар'],
      description: 'Розкішний круїз узбережжям Аравії. Дубай, Оман, Катар.'
    },
    {
      id: 8,
      title: 'Андаманське море',
      price: '33 500 грн',
      duration: '5 ночей',
      groupSize: 'До 160 осіб',
      accommodation: 'Лайнер з відкритими палубами',
      badge: '☀️ Теплі води',
      category: 'warm',
      image: 'styles/img/cruise/cruise8.jpg',
      meta: '5 ночей',
      departureDates: ['15.06.2026', '29.06.2026', '13.07.2026'],
      chips: ['Пхукет', 'Пхі-Пхі', 'Краби'],
      description: 'Екзотичний круїз Таїландом. Пхукет, Пхі-Пхі, Крабі.'
    },
    {
      id: 9,
      title: 'Японське море',
      price: '89 900 грн',
      duration: '10 ночей',
      groupSize: 'До 180 осіб',
      accommodation: 'Лайнер преміум-класу',
      badge: '🌊 Помірні води',
      category: 'temperate',
      image: 'styles/img/cruise/cruise9.jpg',
      meta: '10 ночей',
      departureDates: ['04.04.2026', '18.04.2026', '02.05.2026'],
      chips: ['Токіо', 'Осака', 'Хоккайдо'],
      description: 'Неймовірний круїз Японією. Токіо, Осака, Хоккайдо.'
    },
    {
      id: 10,
      title: 'Ісландія',
      price: '65 200 грн',
      duration: '7 ночей',
      groupSize: 'До 140 осіб',
      accommodation: 'Експедиційний лайнер',
      badge: '❄️ Холодні води',
      category: 'cold',
      image: 'styles/img/cruise/cruise10.jpg',
      meta: '7 ночей',
      departureDates: ['10.06.2026', '24.06.2026', '07.07.2026'],
      chips: ['Рейк\'явік', 'Гейзери', 'Водоспади'],
      description: 'Круїз до країни льодовиків та вулканів. Рейк\'явік, гейзери, водоспади.'
    },
    {
      id: 11,
      title: 'Чорне море',
      price: '18 500 грн',
      duration: '5 ночей',
      groupSize: 'До 200 осіб',
      accommodation: 'Комфортабельний лайнер',
      badge: '🌊 Помірні води',
      category: 'temperate',
      image: 'styles/img/cruise/cruise11.jpg',
      meta: '5 ночей',
      departureDates: ['20.05.2026', '04.06.2026', '18.06.2026'],
      chips: ['Одеса', 'Сочі', 'Болгарія'],
      description: 'Чорноморський круїз. Одеса, Сочі, Болгарія.'
    },
    {
      id: 12,
      title: 'Балтійське море',
      price: '41 200 грн',
      duration: '8 ночей',
      groupSize: 'До 210 осіб',
      accommodation: 'Лайнер з балконами',
      badge: '🌊 Помірні води',
      category: 'temperate',
      image: 'styles/img/cruise/cruise12.jpg',
      meta: '8 ночей',
      departureDates: ['12.06.2026', '26.06.2026', '09.07.2026'],
      chips: ['Стокгольм', 'Гельсінкі', 'Санкт-Петербург'],
      description: 'Круїз Балтійським морем. Стокгольм, Гельсінкі, Санкт-Петербург.'
    }
  ];

  // ========== Дані для деталей круїзів ==========
  const cruiseDetailsData = {};
  defaultCruises.forEach(cruise => {
    cruiseDetailsData[cruise.title] = {
      description: cruise.description,
      departureDates: cruise.departureDates,
      duration: cruise.duration,
      groupSize: cruise.groupSize,
      accommodation: cruise.accommodation,
      price: cruise.price
    };
  });
  cruiseDetailsData['Круїз навколо світу'] = {
    description: 'Неймовірна навколосвітня подорож тривалістю 120 днів. Ви відвідаєте 6 континентів, 30 країн, побачите найвідоміші пам\'ятки планети.',
    departureDates: ['10.01.2026', '05.03.2026', '15.05.2026'],
    duration: '120 днів',
    groupSize: 'До 300 осіб',
    accommodation: 'Лайнер преміум-класу',
    price: '799 000 грн'
  };

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

  // ========== Завантаження круїзів з API ==========
  async function loadCruises() {
    console.log('🔍 Завантаження круїзів...');
    
    try {
      const response = await fetch('/api/admin/cruise');
      const data = await response.json();
      
      if (data.success && data.items && data.items.length > 0) {
        console.log(`✅ Завантажено ${data.items.length} круїзів з API`);
        renderCruises(data.items);
      } else {
        console.log('📋 Використовуємо локальні дані круїзів');
        renderCruises(defaultCruises);
      }
    } catch (error) {
      console.error('❌ Помилка завантаження круїзів:', error);
      console.log('📋 Використовуємо локальні дані круїзів (помилка API)');
      renderCruises(defaultCruises);
    }
  }

  // ========== Відображення круїзів ==========
  function renderCruises(cruises) {
    const cruisesGrid = qs('#cruisesGrid');
    if (!cruisesGrid) {
      console.error('❌ Елемент #cruisesGrid не знайдено!');
      return;
    }

    let html = '';
    
    cruises.forEach(cruise => {
      const chipsHtml = (cruise.chips || []).map(chip => `<span class="chip">${chip}</span>`).join('');
      
      html += `
        <article class="card" data-category="${cruise.category || ''}">
          <div class="card-img-wrap">
            <img class="card-img" src="${cruise.image || 'styles/img/cruise/cruise1.jpg'}" alt="${cruise.title}" />
            <span class="badge">${cruise.badge || 'Круїз'}</span>
            <button class="fav" title="В обране"></button>
          </div>
          <div class="card-body">
            <h3 class="card-title">${cruise.title}</h3>
            <span class="card-meta">${cruise.meta || cruise.duration || ''}</span>
            <span class="card-price">${cruise.price || ''}</span>
            <div class="chips">${chipsHtml}</div>
            <div class="card-actions">
              <div class="left-actions"><button class="btn-primary">Забронювати</button></div>
              <div class="right-actions"><button class="btn-outline">Детальніше</button></div>
            </div>
          </div>
        </article>
      `;
    });

    cruisesGrid.innerHTML = html;
    console.log(`✅ Відображено ${cruises.length} круїзів`);
    
    // Завантажуємо улюблені після рендеру
    loadFavorites();
  }

  // ========== Слайдер ==========
  function initSlider() {
    const slidesContainer = qs('#sliderSlides');
    if (!slidesContainer) return;
    
    const slides = qsa('.offer-slide', slidesContainer);
    if (!slides.length) return;
    
    let currentIdx = 0;
    let autoInterval;
    const totalSlides = slides.length;
    
    function updateSlider() { 
      slidesContainer.style.transform = `translateX(-${currentIdx * 100}%)`; 
    }
    
    function next() { 
      currentIdx = (currentIdx + 1) % totalSlides; 
      updateSlider(); 
    }
    
    function prev() { 
      currentIdx = (currentIdx - 1 + totalSlides) % totalSlides; 
      updateSlider(); 
    }
    
    function startAuto() { 
      autoInterval = setInterval(next, 5000); 
    }
    
    function stopAuto() { 
      clearInterval(autoInterval); 
    }
    
    startAuto();
    
    const sliderEl = qs('.offers-slider');
    sliderEl?.addEventListener('mouseenter', stopAuto);
    sliderEl?.addEventListener('mouseleave', startAuto);
    
    const prevBtn = qs('.slider-arrow.prev');
    const nextBtn = qs('.slider-arrow.next');
    
    if (prevBtn) {
      prevBtn.addEventListener('click', () => { 
        stopAuto(); 
        prev(); 
        startAuto(); 
      });
    }
    
    if (nextBtn) {
      nextBtn.addEventListener('click', () => { 
        stopAuto(); 
        next(); 
        startAuto(); 
      });
    }
    
    updateSlider();
  }

  // ========== Фільтр ==========
  const filterBtn = qs('#filterBtn');
  const filterPanel = qs('#filterPanel');
  const categoryChips = qs('#categoryChips');
  let cards = qsa('.card');
  const filterTabs = qsa('.filter-tab');
  let currentFilterType = 'category';
  const selectedCategories = new Set();

  const categories = ['warm', 'cold', 'temperate'];
  const categoryNames = {
    warm: '☀️ Теплі води',
    cold: '❄️ Холодні води',
    temperate: '🌊 Помірні води'
  };

  const nameSortOptions = [
    { value: 'name-asc', label: '🔤 А-Я' },
    { value: 'name-desc', label: '🔤 Я-А' }
  ];

  const priceSortOptions = [
    { value: 'price-asc', label: '💰 Від дешевих' },
    { value: 'price-desc', label: '💰 Від дорогих' }
  ];

  const popularOptions = [
    { value: 'popular-desc', label: '⭐ За рейтингом' }
  ];

  function getCruisePopularity(title) {
    const LS_KEY = 'oceanica_card_reviews_v1';
    try {
      const all = JSON.parse(localStorage.getItem(LS_KEY) || '{}') || {};
      const reviews = all[title] || [];
      if (reviews.length === 0) return { count: 0, avg: 5 };
      
      const avg = reviews.reduce((sum, r) => sum + (r.stars || 5), 0) / reviews.length;
      return { count: reviews.length, avg: avg };
    } catch {
      return { count: 0, avg: 5 };
    }
  }

  function extractPrice(priceStr) {
    const match = priceStr.replace(/\s/g, '').match(/(\d+)/);
    return match ? parseInt(match[0], 10) : 0;
  }

  function renderChipsByType(type) {
    let html = '<div class="category-chip reset" data-category="reset">✖ Скинути</div>';
    
    if (type === 'category') {
      categories.forEach(cat => {
        html += `<div class="category-chip" data-category="${cat}">${categoryNames[cat]}</div>`;
      });
    } else if (type === 'name') {
      nameSortOptions.forEach(opt => {
        html += `<div class="category-chip" data-sort="${opt.value}">${opt.label}</div>`;
      });
    } else if (type === 'price') {
      priceSortOptions.forEach(opt => {
        html += `<div class="category-chip" data-sort="${opt.value}">${opt.label}</div>`;
      });
    } else if (type === 'popular') {
      popularOptions.forEach(opt => {
        html += `<div class="category-chip" data-sort="${opt.value}">${opt.label}</div>`;
      });
    }
    
    if (categoryChips) categoryChips.innerHTML = html;
  }

  filterTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      filterTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      
      currentFilterType = tab.dataset.filterType;
      selectedCategories.clear();
      renderChipsByType(currentFilterType);
      
      cards = qsa('.card');
      cards.forEach(card => card.style.display = '');
      
      updateFilterIndicator();
    });
  });

  function updateFilterIndicator() {
    const indicator = qs('#activeFilterIndicator');
    if (!indicator) return;
    
    const activeTab = qs('.filter-tab.active');
    if (!activeTab) return;
    
    let text = 'Активний фільтр: ';
    switch(activeTab.dataset.filterType) {
      case 'category': text += '🌊 за типом водойми'; break;
      case 'name': text += '🔤 за назвою'; break;
      case 'price': text += '💰 за ціною'; break;
      case 'popular': text += '⭐ за популярністю'; break;
      default: text += 'всі круїзи';
    }
    
    indicator.textContent = text;
  }

  function filterAndSortCards() {
    cards = qsa('.card');
    const cardsArray = Array.from(cards);
    
    if (currentFilterType === 'category') {
      if (selectedCategories.size === 0) {
        cardsArray.forEach(card => card.style.display = '');
      } else {
        cardsArray.forEach(card => {
          if (selectedCategories.has(card.dataset.category)) {
            card.style.display = '';
          } else {
            card.style.display = 'none';
          }
        });
      }
    } else {
      const sortValue = Array.from(selectedCategories)[0];
      
      if (!sortValue) {
        cardsArray.forEach(card => card.style.display = '');
        return;
      }
      
      const sortedCards = [...cardsArray].sort((a, b) => {
        const titleA = qs('.card-title', a)?.textContent?.trim() || '';
        const titleB = qs('.card-title', b)?.textContent?.trim() || '';
        const priceA = extractPrice(qs('.card-price', a)?.textContent?.trim() || '0');
        const priceB = extractPrice(qs('.card-price', b)?.textContent?.trim() || '0');
        const popA = getCruisePopularity(titleA);
        const popB = getCruisePopularity(titleB);
        
        switch(sortValue) {
          case 'name-asc':
            return titleA.localeCompare(titleB, 'uk');
          case 'name-desc':
            return titleB.localeCompare(titleA, 'uk');
          case 'price-asc':
            return priceA - priceB;
          case 'price-desc':
            return priceB - priceA;
          case 'popular-desc':
            if (popB.avg !== popA.avg) return popB.avg - popA.avg;
            return popB.count - popA.count;
          default:
            return 0;
        }
      });
      
      const parent = cards[0]?.parentNode;
      if (parent) {
        sortedCards.forEach(card => parent.appendChild(card));
      }
      
      cardsArray.forEach(card => card.style.display = '');
    }
  }

  if (categoryChips) {
    categoryChips.addEventListener('click', (e) => {
      const chip = e.target.closest('.category-chip');
      if (!chip) return;
      
      const cat = chip.dataset.category;
      const sortVal = chip.dataset.sort;

      if (cat === 'reset' || sortVal === 'reset') {
        selectedCategories.clear();
        qsa('.category-chip').forEach(ch => ch.classList.remove('active'));
        cards = qsa('.card');
        cards.forEach(card => card.style.display = '');
      } else {
        if (currentFilterType === 'category') {
          if (selectedCategories.has(cat)) {
            selectedCategories.delete(cat);
            chip.classList.remove('active');
          } else {
            selectedCategories.add(cat);
            chip.classList.add('active');
          }
        } else {
          selectedCategories.clear();
          qsa('.category-chip').forEach(ch => ch.classList.remove('active'));
          selectedCategories.add(sortVal);
          chip.classList.add('active');
        }
      }
      
      filterAndSortCards();
    });
  }

  if (filterBtn) {
    filterBtn.addEventListener('click', () => {
      filterPanel.classList.toggle('active');
    });
  }

  // Зберігаємо оригінальний порядок карток
  cards = qsa('.card');
  cards.forEach((card, index) => {
    card.dataset.originalIndex = index;
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
        const allCards = qsa('#cruisesGrid .card');
        const foundCards = allCards.filter(card => {
          const title = qs('.card-title', card)?.textContent?.trim();
          return foundTitles.includes(title);
        });
        
        searchResultsDiv.innerHTML = foundCards.map(card => card.outerHTML).join('');
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
      departureDates: details.departureDates || ['15.03.2026', '22.03.2026', '29.03.2026'],
      duration: details.duration || (qs('.card-meta', card)?.textContent || '').trim(),
      groupSize: details.groupSize || 'До 200 осіб',
      accommodation: details.accommodation || 'Комфортабельний лайнер'
    };
  }

  function openDetailsModal(data) {
    if (!data || !detailsModal) return;
    
    const tabBtns = qsa('.modal-tab', detailsModal);
    const panels = qsa('.modal-panel', detailsModal);
    
    function setTab(tab) {
      tabBtns.forEach(b => b.classList.toggle('active', b.dataset.tab === tab));
      panels.forEach(p => p.classList.toggle('active', p.dataset.panel === tab));
    }
    
    tabBtns.forEach(b => { b.onclick = () => setTab(b.dataset.tab || 'info'); });
    setTab('info');

    if (modalDetailsImg) modalDetailsImg.src = data.img || '';
    if (modalDetailsBadge) modalDetailsBadge.textContent = data.badge || '';
    if (modalDetailsTitle) modalDetailsTitle.textContent = data.title || '';
    if (modalDetailsSubtitle) modalDetailsSubtitle.textContent = data.subtitle || '';
    if (modalDetailsPrice) {
      modalDetailsPrice.textContent = data.price ? 'від ' + data.price : '';
    }
    if (modalDetailsChips) {
      modalDetailsChips.innerHTML = (data.tags || []).map(t => `<span class="modal-chip">${t}</span>`).join('');
    }
    
    const descEl = qs('#modalDetailsDescription', detailsModal);
    if (descEl) descEl.textContent = data.description || '';
    
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
    
    if (mrfStars) initStarInput(mrfStars);

    function loadAll() { try { return JSON.parse(localStorage.getItem(LS_KEY) || '{}') || {}; } catch { return {}; } }
    function saveAll(obj) { localStorage.setItem(LS_KEY, JSON.stringify(obj)); }
    function hash(str) { let h = 2166136261; for (let i=0; i<str.length; i++) { h ^= str.charCodeAt(i); h = Math.imul(h, 16777619); } return Math.abs(h); }
    function stars(n) { return '★★★★★'.slice(0, n) + '☆☆☆☆☆'.slice(0, 5-n); }
    
    function defaultReviews(title) {
      const names = ['Марія','Олег','Ірина','Дмитро','Наталія']; 
      const texts = ['Чудово!','Супер!','Рекомендую','Все сподобалось','Казка!'];
      const h = hash(title || 'cruise'); 
      const count = 5 + (h % 3); 
      const out = [];
      for (let i=0; i<count; i++) {
        out.push({ 
          name: names[(h+i)%names.length], 
          stars: 4+((h+i)%2), 
          text: texts[(h+i)%texts.length], 
          date: new Date(Date.now()-i*86400000).toLocaleDateString('uk-UA') 
        });
      } 
      return out;
    }
    
    function getReviews(title) { 
      const all = loadAll(); 
      return (all[title] && all[title].length) ? all[title] : defaultReviews(title); 
    }
    
    function setReviews(title, list) { 
      const all = loadAll(); 
      all[title] = list; 
      saveAll(all); 
    }
    
    function renderReviews(title) {
      if (!reviewsList) return;
      const list = getReviews(title);
      reviewsList.innerHTML = list.map(r => `
        <div class="modal-review">
          <div class="mrv-avatar">${(r.name||'Г')[0]}</div>
          <div>
            <div class="mrv-top">
              <span class="mrv-name">${r.name||'Гість'}</span>
              <div style="display:flex;gap:10px;">
                <span class="mrv-date">${r.date||''}</span>
                <span class="mrv-stars">${stars(Number(r.stars)||5)}</span>
              </div>
            </div>
            <p class="mrv-text">${r.text||''}</p>
          </div>
        </div>
      `).join('');
    }
    
    renderReviews(data.title);
    
    if (mrfClear) {
      mrfClear.onclick = () => { 
        if (mrfName) mrfName.value = ''; 
        if (mrfText) mrfText.value = ''; 
        if (mrfStars) mrfStars.dataset.value = '5'; 
        updateStars(mrfStars); 
      };
    }
    
    if (mrfSubmit) {
      mrfSubmit.onclick = () => {
        const title = data.title.trim();
        const name = (mrfName?.value || '').trim() || 'Гість';
        const text = (mrfText?.value || '').trim();
        const st = Number(mrfStars?.dataset.value || '5');
        if (!title || text.length < 3) { setTab('reviews'); return; }
        const list = getReviews(title).slice();
        list.unshift({ name, stars: Math.min(5, Math.max(1, st)), text, date: new Date().toLocaleDateString('uk-UA') });
        setReviews(title, list);
        renderReviews(title);
        if (mrfText) mrfText.value = '';
        setTab('reviews');
      };
    }

    detailsModal.classList.add('active');
    detailsModal.style.display = 'flex';
    disableBodyScroll();
  }

  function closeDetails() {
    if (!detailsModal) return;
    detailsModal.classList.remove('active');
    setTimeout(() => detailsModal.style.display = 'none', 300);
    enableBodyScroll();
  }
  
  function openBookModal(data) {
    if (!bookModal || !data) return;
    
    if (modalBookTitle) modalBookTitle.textContent = 'Бронювання круїзу';
    const subtitleEl = qs('#modalBookSubtitle', bookModal);
    if (subtitleEl) subtitleEl.textContent = data?.title || '';
    
    if (modalBookForm) modalBookForm.reset();
    
    const successEl = qs('#modalBookSuccess', bookModal);
    if (successEl) {
      successEl.classList.remove('active');
      successEl.style.display = 'none';
    }
    
    const dateInput = qs('input[name="date"]', modalBookForm);
    if (dateInput) {
      const tomorrow = new Date(); 
      tomorrow.setDate(tomorrow.getDate() + 1);
      dateInput.min = tomorrow.toISOString().split('T')[0];
    }
    
    bookModal.classList.add('active');
    bookModal.style.display = 'flex';
    disableBodyScroll();
  }
  
  function closeBook() {
    if (!bookModal) return;
    bookModal.classList.remove('active');
    setTimeout(() => bookModal.style.display = 'none', 300);
    enableBodyScroll();
  }

  detailsCloseBtns.forEach(btn => {
    if (btn) btn.addEventListener('click', closeDetails);
  });
  
  if (bookCloseBtn) bookCloseBtn.addEventListener('click', closeBook);
  
  if (detailsModal) {
    detailsModal.addEventListener('click', e => { 
      if (e.target === detailsModal) closeDetails(); 
    });
  }
  
  if (bookModal) {
    bookModal.addEventListener('click', e => { 
      if (e.target === bookModal) closeBook(); 
    });
  }
  
  if (modalDetailsBook) {
    modalDetailsBook.addEventListener('click', () => { 
      const title = modalDetailsTitle?.textContent?.trim();
      closeDetails(); 
      openBookModal({ title }); 
    });
  }

  if (modalBookForm) {
    modalBookForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      if (!window.auth?.getToken()) {
        showToast('🔒 Увійдіть, щоб забронювати', 'info');
        setTimeout(() => { window.location.href = 'login.html'; }, 1500);
        return;
      }
      if (!currentBookingItem) {
        showToast('Помилка: дані круїзу відсутні', 'error');
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
      const data = {
        title: 'Круїз навколо світу',
        subtitle: '120 днів • 6 континентів • 30 країн',
        price: '799 000 грн',
        img: 'styles/img/cruise/world_cruise.jpg',
        badge: '🔥 Гаряча пропозиція',
        tags: ['Навколо світу', 'Преміум', 'Все включено'],
        description: cruiseDetailsData['Круїз навколо світу'].description,
        departureDates: cruiseDetailsData['Круїз навколо світу'].departureDates,
        duration: cruiseDetailsData['Круїз навколо світу'].duration,
        groupSize: cruiseDetailsData['Круїз навколо світу'].groupSize,
        accommodation: cruiseDetailsData['Круїз навколо світу'].accommodation
      };
      openDetailsModal(data);
    });
  }

  // ========== Обробники кліків для карток ==========
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

  // ========== Ініціалізація ==========
  function init() {
    console.log('🚀 cruise.js ініціалізація');
    
    // Зберігаємо оригінальний порядок карток
    cards = qsa('.card');
    cards.forEach((card, index) => {
      card.dataset.originalIndex = index;
    });
    
    // Ініціалізуємо слайдер
    initSlider();
    
    // Завантажуємо круїзи
    loadCruises();
    
    // Налаштовуємо фільтр
    renderChipsByType('category');
    updateFilterIndicator();
  }

  // Запускаємо після завантаження DOM
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();