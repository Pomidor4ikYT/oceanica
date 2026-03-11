// public/tours.js
(function() {
  const qs = (sel, ctx) => (ctx || document).querySelector(sel);
  const qsa = (sel, ctx) => Array.from((ctx || document).querySelectorAll(sel));

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

  // ========== Дані турів ==========
  const tourDetailsData = {
    'Таїланд: Пхукет & Пхі-Пхі': {
      description: 'Райські пляжі Таїланду з кристальною водою та островами Пхі-Пхі. Екскурсії, дайвінг, тайський масаж.',
      departureDates: ['15.03.2026', '22.03.2026', '05.04.2026'],
      duration: '10 днів',
      groupSize: 'До 25 осіб',
      accommodation: 'Курортний готель 4*',
      price: '39 900 грн'
    },
    'Італія: Рим, Флоренція, Венеція': {
      description: 'Класичний тур по найвідоміших містах Італії. Колізей, Ватикан, галерея Уффіці, гондоли.',
      departureDates: ['10.04.2026', '24.04.2026', '08.05.2026'],
      duration: '8 днів',
      groupSize: 'До 30 осіб',
      accommodation: 'Готель 3-4*',
      price: '31 200 грн'
    },
    'Непал: Еверест та храми': {
      description: 'Неймовірний тур на Гімалаї з треккінгом до базового табору Евересту. Відвідування храмів Катманду.',
      departureDates: ['20.03.2026', '03.04.2026', '17.04.2026'],
      duration: '12 днів',
      groupSize: 'До 15 осіб',
      accommodation: 'Альпійський кемп та готелі',
      price: '47 500 грн'
    },
    'Мальдіви: райські атоли': {
      description: 'Екзотичні атоли Мальдів з бунгало над водою, дайвінгом серед коралових рифів та SPA.',
      departureDates: ['05.05.2026', '19.05.2026', '02.06.2026'],
      duration: '7 днів',
      groupSize: 'До 20 осіб',
      accommodation: 'Вілли над водою 5*',
      price: '67 800 грн'
    },
    'Франція: Париж, Долина Луари': {
      description: 'Романтична Франція з відвідуванням Ейфелевої вежі, Лувру та замків Долини Луари.',
      departureDates: ['12.04.2026', '26.04.2026', '10.05.2026'],
      duration: '6 днів',
      groupSize: 'До 28 осіб',
      accommodation: 'Готель 3-4*',
      price: '28 900 грн'
    },
    'Швейцарія: Альпи та озера': {
      description: 'Гірські шедеври Швейцарії: Маттергорн, Женевське озеро, Інтерлакен. Поїзди, канатні дороги.',
      departureDates: ['08.03.2026', '22.03.2026', '05.04.2026'],
      duration: '7 днів',
      groupSize: 'До 22 осіб',
      accommodation: 'Гірський готель',
      price: '52 300 грн'
    },
    'Єгипет: Хургада, піраміди': {
      description: 'Поєднання пляжного відпочинку на Червоному морі з екскурсією до пірамід Гізи та Сфінкса.',
      departureDates: ['25.05.2026', '09.06.2026', '23.06.2026'],
      duration: '10 днів',
      groupSize: 'До 30 осіб',
      accommodation: 'Готель 4*',
      price: '24 500 грн'
    },
    'Греція: Афіни, Метеори, Салоніки': {
      description: 'Класична Греція з відвідуванням Акрополя, монастирів Метеори та узбережжя Салонік.',
      departureDates: ['15.06.2026', '29.06.2026', '13.07.2026'],
      duration: '7 днів',
      groupSize: 'До 25 осіб',
      accommodation: 'Готель 3-4*',
      price: '26 800 грн'
    },
    'Перу: Мачу-Пікчу та Анди': {
      description: 'Експедиція до стародавнього міста інків Мачу-Пікчу, озеро Тітікака, Куско.',
      departureDates: ['04.04.2026', '18.04.2026', '02.05.2026'],
      duration: '9 днів',
      groupSize: 'До 16 осіб',
      accommodation: 'Еко-готель та кемп',
      price: '58 900 грн'
    },
    'Балі: храми та серфінг': {
      description: 'Духовна Балі з храмами, рисовими полями, вулканами та уроками серфінгу.',
      departureDates: ['10.06.2026', '24.06.2026', '07.07.2026'],
      duration: '11 днів',
      groupSize: 'До 20 осіб',
      accommodation: 'Готель 4*',
      price: '44 200 грн'
    },
    'Ісландія: вулкани та льодовики': {
      description: 'Льодовики, гейзери, водоспади, чорні пляжі та північне сяйво в Ісландії.',
      departureDates: ['20.05.2026', '04.06.2026', '18.06.2026'],
      duration: '8 днів',
      groupSize: 'До 14 осіб',
      accommodation: 'Готель 3-4*',
      price: '62 300 грн'
    },
    'Японія: Токіо, Кіото, Осака': {
      description: 'Модерна та традиційна Японія: хмарочоси Токіо, стародавні храми Кіото, кухня Осаки.',
      departureDates: ['12.06.2026', '26.06.2026', '09.07.2026'],
      duration: '10 днів',
      groupSize: 'До 22 осіб',
      accommodation: 'Готель 4*',
      price: '72 500 грн'
    }
  };

  // ========== НОВИЙ РОЗШИРЕНИЙ ФІЛЬТР ==========
  const filterBtn = qs('#filterBtn');
  const filterPanel = qs('#filterPanel');
  const categoryChips = qs('#categoryChips');
  let cards = qsa('.card');
  const filterTabs = qsa('.filter-tab');
  let currentFilterType = 'category'; // 'category', 'name', 'price', 'popular'
  const selectedCategories = new Set();

  // Дані для різних типів фільтрів
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

  // Функція для отримання популярності туру (на основі відгуків)
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

  // Функція для парсингу ціни з рядка
  function extractPrice(priceStr) {
    const match = priceStr.replace(/\s/g, '').match(/(\d+)/);
    return match ? parseInt(match[0], 10) : 0;
  }

  // Рендер чіпсів залежно від типу фільтра
  function renderChipsByType(type) {
    let html = '<div class="category-chip reset" data-category="reset" data-sort="reset">✖ Скинути</div>';
    
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
    
    categoryChips.innerHTML = html;
  }

  // Ініціалізація вкладок
  filterTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      // Видаляємо active з усіх вкладок
      filterTabs.forEach(t => t.classList.remove('active'));
      // Додаємо active поточній вкладці
      tab.classList.add('active');
      
      // Оновлюємо тип фільтра
      currentFilterType = tab.dataset.filterType;
      
      // Очищаємо вибрані категорії
      selectedCategories.clear();
      
      // Рендеримо відповідні чіпси
      renderChipsByType(currentFilterType);
      
      // Скидаємо відображення карток
      cards = qsa('.card');
      cards.forEach(card => card.style.display = '');
      
      // Оновлюємо індикатор
      updateFilterIndicator();
    });
  });

  // Функція оновлення індикатора
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

  // Оновлена функція фільтрації/сортування
  function filterAndSortCards() {
    cards = qsa('.card');
    const cardsArray = Array.from(cards);
    
    if (currentFilterType === 'category') {
      // Фільтрація за категорією
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
      // Сортування для інших типів
      const sortValue = Array.from(selectedCategories)[0]; // Беремо перше вибране значення
      
      if (!sortValue) {
        // Якщо нічого не вибрано, показуємо всі в оригінальному порядку
        cardsArray.forEach(card => card.style.display = '');
        return;
      }
      
      // Сортуємо масив карток
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
            // Сортуємо за середнім рейтингом, потім за кількістю відгуків
            if (popB.avg !== popA.avg) return popB.avg - popA.avg;
            return popB.count - popA.count;
          default:
            return 0;
        }
      });
      
      // Переставляємо картки в DOM згідно з сортуванням
      const parent = cards[0]?.parentNode;
      if (parent) {
        sortedCards.forEach(card => parent.appendChild(card));
      }
      
      // Показуємо всі картки
      cardsArray.forEach(card => card.style.display = '');
    }
  }

  // ВИПРАВЛЕНИЙ обробник кліку по чіпсах
  categoryChips.addEventListener('click', (e) => {
    const chip = e.target.closest('.category-chip');
    if (!chip) return;
    
    const cat = chip.dataset.category;
    const sortVal = chip.dataset.sort;

    // Перевіряємо, чи це кнопка "Скинути" (має або data-category="reset" або data-sort="reset")
    if (cat === 'reset' || sortVal === 'reset') {
      // Скидання всіх фільтрів
      selectedCategories.clear();
      
      // Видаляємо активний клас з усіх чіпсів
      qsa('.category-chip').forEach(ch => {
        ch.classList.remove('active');
      });
      
      // Показуємо всі картки
      cards = qsa('.card');
      cards.forEach(card => card.style.display = '');
      
      // Якщо це режим сортування (не категорія), скидаємо порядок до оригінального
      if (currentFilterType !== 'category') {
        // Відновлюємо оригінальний порядок карток (за індексом)
        const parent = cards[0]?.parentNode;
        if (parent) {
          // Сортуємо за оригінальним порядком (за атрибутом data-original-index)
          cards.sort((a, b) => {
            const indexA = parseInt(a.dataset.originalIndex || '0');
            const indexB = parseInt(b.dataset.originalIndex || '0');
            return indexA - indexB;
          });
          cards.forEach(card => parent.appendChild(card));
        }
      }
      
      return;
    }

    // Якщо це не кнопка "Скинути", обробляємо вибір
    if (currentFilterType === 'category') {
      // Для категорій - мультивибір
      if (selectedCategories.has(cat)) {
        selectedCategories.delete(cat);
        chip.classList.remove('active');
      } else {
        selectedCategories.add(cat);
        chip.classList.add('active');
      }
    } else {
      // Для сортування - одиночний вибір
      selectedCategories.clear();
      qsa('.category-chip').forEach(ch => ch.classList.remove('active'));
      
      selectedCategories.add(sortVal);
      chip.classList.add('active');
    }
    
    filterAndSortCards();
  });

  filterBtn.addEventListener('click', () => {
    filterPanel.classList.toggle('active');
  });

  // Зберігаємо оригінальний порядок карток при завантаженні
  cards = qsa('.card');
  cards.forEach((card, index) => {
    card.dataset.originalIndex = index;
  });

  // Ініціалізація
  renderChipsByType('category');
  updateFilterIndicator();

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

  // Поточний елемент для бронювання
  let currentBookingItem = null;

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
      const names = ['Марія','Олег','Ірина','Дмитро','Наталія']; const texts = ['Чудово!','Неймовірно','Рекомендую','Все сподобалось','Казка!'];
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

  const specialTourBtn = qs('#specialTourBtn');
  if (specialTourBtn) {
    specialTourBtn.addEventListener('click', function(e) {
      e.preventDefault();
      const data = {
        title: 'Тур вихідного дня',
        subtitle: '2 дні • 3 міста Європи за одну ціну',
        price: '9 990 грн',
        img: 'toursimg/tours_special.jpg',
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
          data.groupSize = data.groupSize || 'До 30 осіб';
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

  loadFavorites();
})();