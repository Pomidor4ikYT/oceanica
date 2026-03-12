// public/js/tours.js
(function() {
  const qs = (sel, ctx) => (ctx || document).querySelector(sel);
  const qsa = (sel, ctx) => Array.from((ctx || document).querySelectorAll(sel));

  // ========== Дефолтні дані турів (якщо API не працює) ==========
  const defaultTours = [
    {
      id: 1,
      title: 'Таїланд: Пхукет & Пхі-Пхі',
      price: '39 900 грн',
      duration: '10 днів',
      groupSize: 'До 25 осіб',
      accommodation: 'Курортний готель 4*',
      badge: '🏖️ Пляжний',
      category: 'beach',
      image: 'styles/img/tours/tour1.jpg',
      meta: '10 днів • All Inclusive',
      departureDates: ['15.03.2026', '22.03.2026', '05.04.2026'],
      chips: ['Пальми', 'Вапнякові скелі', 'Дайвінг'],
      description: 'Райські пляжі Таїланду з кристальною водою та островами Пхі-Пхі.'
    },
    {
      id: 2,
      title: 'Італія: Рим, Флоренція, Венеція',
      price: '31 200 грн',
      duration: '8 днів',
      groupSize: 'До 30 осіб',
      accommodation: 'Готель 3-4*',
      badge: '🏛️ Екскурсійний',
      category: 'excursion',
      image: 'styles/img/tours/tour2.jpg',
      meta: '8 днів • сніданки',
      departureDates: ['10.04.2026', '24.04.2026', '08.05.2026'],
      chips: ['Колізей', 'Да Вінчі', 'Гондоли'],
      description: 'Класичний тур по найвідоміших містах Італії.'
    },
    {
      id: 3,
      title: 'Непал: Еверест та храми',
      price: '47 500 грн',
      duration: '12 днів',
      groupSize: 'До 15 осіб',
      accommodation: 'Альпійський кемп та готелі',
      badge: '⛰️ Гірський',
      category: 'mountain',
      image: 'styles/img/tours/tour3.jpg',
      meta: '12 днів • Trekking',
      departureDates: ['20.03.2026', '03.04.2026', '17.04.2026'],
      chips: ['Гімалаї', 'Буддизм', 'Базовий табір'],
      description: 'Неймовірний тур на Гімалаї з треккінгом до базового табору Евересту.'
    },
    {
      id: 4,
      title: 'Мальдіви: райські атоли',
      price: '67 800 грн',
      duration: '7 днів',
      groupSize: 'До 20 осіб',
      accommodation: 'Вілли над водою 5*',
      badge: '🏖️ Пляжний',
      category: 'beach',
      image: 'styles/img/tours/tour4.jpg',
      meta: '7 днів • вілли над водою',
      departureDates: ['05.05.2026', '19.05.2026', '02.06.2026'],
      chips: ['Лагуна', 'Снорклінг', 'SPA'],
      description: 'Екзотичні атоли Мальдів з бунгало над водою.'
    },
    {
      id: 5,
      title: 'Франція: Париж, Долина Луари',
      price: '28 900 грн',
      duration: '6 днів',
      groupSize: 'До 28 осіб',
      accommodation: 'Готель 3-4*',
      badge: '🏛️ Екскурсійний',
      category: 'excursion',
      image: 'styles/img/tours/tour5.jpg',
      meta: '6 днів • сніданки',
      departureDates: ['12.04.2026', '26.04.2026', '10.05.2026'],
      chips: ['Ейфелева вежа', 'Замки', 'Вина'],
      description: 'Романтична Франція з відвідуванням Ейфелевої вежі, Лувру та замків Долини Луари.'
    },
    {
      id: 6,
      title: 'Швейцарія: Альпи та озера',
      price: '52 300 грн',
      duration: '7 днів',
      groupSize: 'До 22 осіб',
      accommodation: 'Гірський готель',
      badge: '⛰️ Гірський',
      category: 'mountain',
      image: 'styles/img/tours/tour6.jpg',
      meta: '7 днів • напівпансіон',
      departureDates: ['08.03.2026', '22.03.2026', '05.04.2026'],
      chips: ['Маттергорн', 'Женевське озеро', 'Сири'],
      description: 'Гірські шедеври Швейцарії: Маттергорн, Женевське озеро, Інтерлакен.'
    },
    {
      id: 7,
      title: 'Єгипет: Хургада, піраміди',
      price: '24 500 грн',
      duration: '10 днів',
      groupSize: 'До 30 осіб',
      accommodation: 'Готель 4*',
      badge: '🏖️ Пляжний',
      category: 'beach',
      image: 'styles/img/tours/tour7.jpg',
      meta: '10 днів • All Inclusive',
      departureDates: ['25.05.2026', '09.06.2026', '23.06.2026'],
      chips: ['Червоне море', 'Сфінкс', 'Дайвінг'],
      description: 'Поєднання пляжного відпочинку на Червоному морі з екскурсією до пірамід Гізи.'
    },
    {
      id: 8,
      title: 'Греція: Афіни, Метеори, Салоніки',
      price: '26 800 грн',
      duration: '7 днів',
      groupSize: 'До 25 осіб',
      accommodation: 'Готель 3-4*',
      badge: '🏛️ Екскурсійний',
      category: 'excursion',
      image: 'styles/img/tours/tour8.jpg',
      meta: '7 днів • сніданки',
      departureDates: ['15.06.2026', '29.06.2026', '13.07.2026'],
      chips: ['Акрополь', 'Монастирі', 'Олімп'],
      description: 'Класична Греція з відвідуванням Акрополя, монастирів Метеори.'
    },
    {
      id: 9,
      title: 'Перу: Мачу-Пікчу та Анди',
      price: '58 900 грн',
      duration: '9 днів',
      groupSize: 'До 16 осіб',
      accommodation: 'Еко-готель та кемп',
      badge: '⛰️ Гірський',
      category: 'mountain',
      image: 'styles/img/tours/tour9.jpg',
      meta: '9 днів • експедиція',
      departureDates: ['04.04.2026', '18.04.2026', '02.05.2026'],
      chips: ['Інки', 'Амазонка', 'Куско'],
      description: 'Експедиція до стародавнього міста інків Мачу-Пікчу.'
    },
    {
      id: 10,
      title: 'Балі: храми та серфінг',
      price: '44 200 грн',
      duration: '11 днів',
      groupSize: 'До 20 осіб',
      accommodation: 'Готель 4*',
      badge: '🏖️ Пляжний',
      category: 'beach',
      image: 'styles/img/tours/tour10.jpg',
      meta: '11 днів • All Inclusive',
      departureDates: ['10.06.2026', '24.06.2026', '07.07.2026'],
      chips: ['Вулкани', 'Ритуали', 'Чайні плантації'],
      description: 'Духовна Балі з храмами, рисовими полями, вулканами.'
    },
    {
      id: 11,
      title: 'Ісландія: вулкани та льодовики',
      price: '62 300 грн',
      duration: '8 днів',
      groupSize: 'До 14 осіб',
      accommodation: 'Готель 3-4*',
      badge: '⛰️ Гірський',
      category: 'mountain',
      image: 'styles/img/tours/tour11.jpg',
      meta: '8 днів • пригоди',
      departureDates: ['20.05.2026', '04.06.2026', '18.06.2026'],
      chips: ['Гейзери', 'Північне сяйво', 'Чорні пляжі'],
      description: 'Льодовики, гейзери, водоспади, чорні пляжі в Ісландії.'
    },
    {
      id: 12,
      title: 'Японія: Токіо, Кіото, Осака',
      price: '72 500 грн',
      duration: '10 днів',
      groupSize: 'До 22 осіб',
      accommodation: 'Готель 4*',
      badge: '🏛️ Екскурсійний',
      category: 'excursion',
      image: 'styles/img/tours/tour12.jpg',
      meta: '10 днів • сніданки',
      departureDates: ['12.06.2026', '26.06.2026', '09.07.2026'],
      chips: ['Фудзі', 'Храми', 'Суші'],
      description: 'Модерна та традиційна Японія: хмарочоси Токіо, храми Кіото.'
    }
  ];

  // ========== Дані для деталей турів ==========
  const tourDetailsData = {};
  defaultTours.forEach(tour => {
    tourDetailsData[tour.title] = {
      description: tour.description,
      departureDates: tour.departureDates,
      duration: tour.duration,
      groupSize: tour.groupSize,
      accommodation: tour.accommodation,
      price: tour.price
    };
  });

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

  // ========== Завантаження турів з API ==========
  async function loadTours() {
    console.log('🔍 Завантаження турів...');
    
    try {
      const response = await fetch('/api/admin/tour');
      const data = await response.json();
      
      if (data.success && data.items && data.items.length > 0) {
        console.log(`✅ Завантажено ${data.items.length} турів з API`);
        renderTours(data.items);
      } else {
        console.log('📋 Використовуємо локальні дані турів');
        renderTours(defaultTours);
      }
    } catch (error) {
      console.error('❌ Помилка завантаження турів:', error);
      console.log('📋 Використовуємо локальні дані турів (помилка API)');
      renderTours(defaultTours);
    }
  }

  // ========== Відображення турів ==========
  function renderTours(tours) {
    const toursGrid = qs('#toursGrid');
    if (!toursGrid) {
      console.error('❌ Елемент #toursGrid не знайдено!');
      return;
    }

    let html = '';
    
    tours.forEach(tour => {
      const chipsHtml = (tour.chips || []).map(chip => `<span class="chip">${chip}</span>`).join('');
      
      html += `
        <article class="card" data-category="${tour.category || ''}">
          <div class="card-img-wrap">
            <img class="card-img" src="${tour.image || 'styles/img/tours/tour1.jpg'}" alt="${tour.title}" />
            <span class="badge">${tour.badge || 'Тур'}</span>
            <button class="fav" title="В обране"></button>
          </div>
          <div class="card-body">
            <h3 class="card-title">${tour.title}</h3>
            <span class="card-meta">${tour.meta || tour.duration || ''}</span>
            <span class="card-price">${tour.price || ''}</span>
            <div class="chips">${chipsHtml}</div>
            <div class="card-actions">
              <div class="left-actions"><button class="btn-primary">Забронювати</button></div>
              <div class="right-actions"><button class="btn-outline">Детальніше</button></div>
            </div>
          </div>
        </article>
      `;
    });

    toursGrid.innerHTML = html;
    console.log(`✅ Відображено ${tours.length} турів`);
    
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

  const categories = ['beach', 'excursion', 'mountain'];
  const categoryNames = {
    beach: '🏖️ Пляжні',
    excursion: '🏛️ Екскурсійні',
    mountain: '⛰️ Гірські'
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

  function getTourPopularity(title) {
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
      case 'category': text += '🏖️ за типом туру'; break;
      case 'name': text += '🔤 за назвою'; break;
      case 'price': text += '💰 за ціною'; break;
      case 'popular': text += '⭐ за популярністю'; break;
      default: text += 'всі тури';
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
        const popA = getTourPopularity(titleA);
        const popB = getTourPopularity(titleB);
        
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
        const allCards = qsa('#toursGrid .card');
        const foundCards = allCards.filter(card => {
          const title = qs('.card-title', card)?.textContent?.trim();
          return foundTitles.includes(title);
        });
        
        searchResultsDiv.innerHTML = foundCards.map(card => card.outerHTML).join('');
        loadFavorites();
        searchResultsDiv.classList.add('visible');
        searchResultsTitle.classList.add('visible');
        showToast(`✅ Знайдено турів: ${foundTitles.length}`, 'success');
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
      groupSize: details.groupSize || 'До 25 осіб',
      accommodation: details.accommodation || 'Комфортний готель'
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
      const h = hash(title || 'tour'); 
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
    
    if (modalBookTitle) modalBookTitle.textContent = 'Бронювання туру';
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
  const specialTourBtn = document.getElementById('specialTourBtn');
  if (specialTourBtn) {
    specialTourBtn.addEventListener('click', function(e) {
      e.preventDefault();
      const data = {
        title: 'Тур вихідного дня',
        subtitle: '2 дні • 3 міста Європи за одну ціну',
        price: '9 990 грн',
        img: 'styles/img/tours/tours_special.jpg',
        badge: '🔥 Гаряча пропозиція',
        tags: ['Європа', 'Екскурсія', 'Групове'],
        description: 'Неймовірний тур вихідного дня до трьох європейських столиць. Відвідайте Відень, Братиславу та Будапешт за один вікенд!',
        departureDates: ['15.03.2026', '22.03.2026', '29.03.2026'],
        duration: '2 дні',
        groupSize: 'До 30 осіб',
        accommodation: 'Готель 3*'
      };
      openDetailsModal(data);
    });
  }

  // ========== Ініціалізація ==========
  function init() {
    console.log('🚀 tours.js ініціалізація');
    
    // Зберігаємо оригінальний порядок карток
    cards = qsa('.card');
    cards.forEach((card, index) => {
      card.dataset.originalIndex = index;
    });
    
    // Ініціалізуємо слайдер
    initSlider();
    
    // Завантажуємо тури
    loadTours();
    
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