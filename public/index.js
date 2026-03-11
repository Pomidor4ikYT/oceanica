// index.js
(function() {
  // Глобальні змінні
  let toursData = [];
  
  // Дані турів з датами вильотів
  const tourDetailsData = {
    'Балі, Індонезія': {
      departureDates: ['15.03.2026', '22.03.2026', '05.04.2026'],
      description: 'Райський острів Балі з чудовими пляжами, храмами та культурою...',
      duration: 'All Inclusive • 7 ночей',
      groupSize: 'До 30 осіб',
      accommodation: 'Комфортний готель 4*'
    },
    'Крит, Греція': {
      departureDates: ['10.04.2026', '24.04.2026', '08.05.2026'],
      description: 'Легендарний острів Крит з древніми палацами та білосніжними пляжами...',
      duration: 'Сніданки • 5 ночей',
      groupSize: 'До 25 осіб',
      accommodation: 'Готель 3-4*'
    },
    'Мальдіви': {
      departureDates: ['20.03.2026', '03.04.2026', '17.04.2026'],
      description: 'Райські острівці Мальдіви з кристальною водою та дайвінгом...',
      duration: 'Вілли • 6 ночей',
      groupSize: 'До 20 осіб',
      accommodation: 'Вілли над водою 5*'
    },
    'Бора-Бора': {
      departureDates: ['05.05.2026', '19.05.2026', '02.06.2026'],
      description: 'Екзотична Бора-Бора з лагунами та неймовірними видами...',
      duration: 'Лагуни • 7 ночей',
      groupSize: 'До 22 осіб',
      accommodation: 'Бунгало 5*'
    },
    'Палаван, Філіппіни': {
      departureDates: ['12.04.2026', '26.04.2026', '10.05.2026'],
      description: 'Найкрасивіший острів світу Палаван з печерами та лагунами...',
      duration: 'Еко-тур • 6 ночей',
      groupSize: 'До 15 осіб',
      accommodation: 'Еко-готель'
    },
    'Самуї, Таїланд': {
      departureDates: ['08.03.2026', '22.03.2026', '05.04.2026'],
      description: 'Популярний курорт Самуї з пальмами, фруктами та храмами...',
      duration: 'Сніданки • 7 ночей',
      groupSize: 'До 25 осіб',
      accommodation: 'Готель 4*'
    },
    'Санторіні, Греція': {
      departureDates: ['25.05.2026', '09.06.2026', '23.06.2026'],
      description: 'Романтична Санторіні з білими будинками та заходами сонця...',
      duration: 'Романтика • 5 ночей',
      groupSize: 'До 18 осіб',
      accommodation: 'Готель класу люкс'
    },
    'Марокко': {
      departureDates: ['15.06.2026', '29.06.2026', '13.07.2026'],
      description: 'Екзотичне Марокко з базарами, Сахарою та medinas...',
      duration: 'Гіди • 6 ночей',
      groupSize: 'До 20 осіб',
      accommodation: 'Готелі 3-4*'
    },
    'Хайнань, Китай': {
      departureDates: ['04.04.2026', '18.04.2026', '02.05.2026'],
      description: 'Тропічний острів Хайнань з пляжами та парками...',
      duration: 'Пляжі • 7 ночей',
      groupSize: 'До 28 осіб',
      accommodation: 'Готель 4-5*'
    },
    'Таїті': {
      departureDates: ['10.06.2026', '24.06.2026', '07.07.2026'],
      description: 'Екзотична Таїті з дайвінгом, круїзами та культурою...',
      duration: 'Екзотика • 6 ночей',
      groupSize: 'До 16 осіб',
      accommodation: 'Готель класу люкс'
    },
    'Сейшели': {
      departureDates: ['20.05.2026', '04.06.2026', '18.06.2026'],
      description: 'Гранітні скелі та найкрасивіші пляжі світу на Сейшелях...',
      duration: 'Пляжі • 7 ночей',
      groupSize: 'До 14 осіб',
      accommodation: 'Готель 5*'
    },
    'Афінська Рив\'єра': {
      departureDates: ['12.06.2026', '26.06.2026', '09.07.2026'],
      description: 'Античні Афіни та красиві пляжі рів\'єри...',
      duration: 'Історія • 5 ночей',
      groupSize: 'До 25 осіб',
      accommodation: 'Готель 4*'
    }
  };

  // Деталі для турів зі слайдера
  const sliderTourDetails = {
    'egypt': {
      title: 'Єгипет',
      subtitle: 'Трансфер + гід • листопад',
      price: '23 960 грн',
      img: 'indeximg/bar1.jpg',
      badge: '-20%',
      tags: ['Піраміди', 'Червоне море', 'All Inclusive'],
      description: 'Розкішний відпочинок на березі Червоного моря. Готелі 5* з власним пляжем, аквапарками та анімацією.',
      departureDates: ['01.11.2026', '08.11.2026', '15.11.2026'],
      duration: '7 ночей',
      groupSize: 'До 40 осіб',
      accommodation: 'Готель 5* All Inclusive'
    },
    'santorini': {
      title: 'Санторіні',
      subtitle: 'Готелі зі знижкою • 4–6 ночей',
      price: '19 160 грн',
      img: 'indeximg/bar2.jpg',
      badge: '-15%',
      tags: ['Закати', 'Білі будинки', 'Романтика'],
      description: 'Неймовірні заходи сонця та білі будиночки на скелях. Екскурсії на вулкан та гарячі джерела.',
      departureDates: ['15.05.2026', '22.05.2026', '29.05.2026'],
      duration: '5 ночей',
      groupSize: 'До 25 осіб',
      accommodation: 'Готель 4* зі сніданками'
    },
    'morocco': {
      title: 'Марокко',
      subtitle: 'Медина + пустеля • 6 ночей',
      price: '15 960 грн',
      img: 'indeximg/bar3.jpg',
      badge: '-18%',
      tags: ['Сахара', 'Марракеш', 'Базари'],
      description: 'Загадкові базари та пустеля Сахара. Ночівля в пустелі, катання на верблюдах, традиційна кухня.',
      departureDates: ['10.09.2026', '17.09.2026', '24.09.2026'],
      duration: '6 ночей',
      groupSize: 'До 20 осіб',
      accommodation: 'Готелі 4* + наметовий табір'
    },
    'maldives': {
      title: 'Мальдіви',
      subtitle: 'Над водою • 6–7 ночей',
      price: '51 960 грн',
      img: 'indeximg/bar4.jpg',
      badge: '-12%',
      tags: ['Вілли над водою', 'Дайвінг', 'SPA'],
      description: 'Райські острови з віллами над водою. Кристально чиста вода, білий пісок, незаймана природа.',
      departureDates: ['05.12.2026', '12.12.2026', '19.12.2026'],
      duration: '7 ночей',
      groupSize: 'До 15 осіб',
      accommodation: 'Вілла над водою 5*'
    },
    'seychelles': {
      title: 'Сейшели',
      subtitle: 'Кришталеве море • 7 ночей',
      price: '43 960 грн',
      img: 'indeximg/bar5.jpg',
      badge: '-18%',
      tags: ['Гранітні пляжі', 'Снорклінг', 'Праслін'],
      description: 'Гранітні скелі та найкрасивіші пляжі світу. Черепахи, кокосові плантації, екзотична природа.',
      departureDates: ['18.07.2026', '25.07.2026', '01.08.2026'],
      duration: '7 ночей',
      groupSize: 'До 18 осіб',
      accommodation: 'Готель 5*'
    },
    'volcano': {
      title: 'Ісландія',
      subtitle: '5 днів • пригоди',
      price: '11 960 грн',
      img: 'indeximg/bar6.jpg',
      badge: '-20%',
      tags: ['Вулкани', 'Гейзери', 'Льодовики'],
      description: 'Активний відпочинок з неймовірними краєвидами. Золоте коло, Північне сяйво, блакитна лагуна.',
      departureDates: ['20.10.2026', '27.10.2026', '03.11.2026'],
      duration: '5 ночей',
      groupSize: 'До 16 осіб',
      accommodation: 'Готелі + котеджі'
    },
    'alps': {
      title: 'Альпи',
      subtitle: '8 днів • відпочинок',
      price: '27 960 грн',
      img: 'indeximg/bar7.jpg',
      badge: '-25%',
      tags: ['Гірськолижні курорти', 'SPA', 'Фонду'],
      description: 'Гірськолижні курорти Європи. Траси різної складності, підйомники, вечірки після катання.',
      departureDates: ['10.01.2027', '17.01.2027', '24.01.2027'],
      duration: '8 ночей',
      groupSize: 'До 30 осіб',
      accommodation: 'Шале 4*'
    }
  };

  // Допоміжні функції
  const qs = (selector, parent = document) => parent.querySelector(selector);
  const qsa = (selector, parent = document) => Array.from(parent.querySelectorAll(selector));

  // Функція показу toast-повідомлень
  function showToast(message, type = 'info') {
    let toast = document.querySelector('.toast-notification');
    if (!toast) {
      toast = document.createElement('div');
      toast.className = 'toast-notification';
      document.body.appendChild(toast);
    }
    
    toast.textContent = message;
    toast.className = `toast-notification ${type}`;
    
    setTimeout(() => toast.classList.add('show'), 10);
    setTimeout(() => {
      toast.classList.remove('show');
    }, 3000);
  }

  // Ініціалізація слайдера
  function initSlider(sliderSelector) {
    const slides = document.querySelector(sliderSelector);
    if (!slides) return;
    
    const prevBtn = document.querySelector('.slider-arrow.prev');
    const nextBtn = document.querySelector('.slider-arrow.next');
    
    if (!prevBtn || !nextBtn) return;
    
    let currentIndex = 0;
    const totalSlides = slides.children.length;
    
    function updateSlider() {
      slides.style.transform = `translateX(-${currentIndex * 100}%)`;
    }
    
    prevBtn.addEventListener('click', () => {
      currentIndex = (currentIndex - 1 + totalSlides) % totalSlides;
      updateSlider();
    });
    
    nextBtn.addEventListener('click', () => {
      currentIndex = (currentIndex + 1) % totalSlides;
      updateSlider();
    });
    
    // Автоматичне перемикання
    setInterval(() => {
      currentIndex = (currentIndex + 1) % totalSlides;
      updateSlider();
    }, 5000);
  }

  // Ініціалізація слайдера
  initSlider('#sliderSlides');

  // Функція створення картки з об'єкта туру
  function createCardFromTour(tour) {
    const chipsHtml = (tour.chips || []).map(c => `<span class="chip">${c}</span>`).join('');
    return `
      <article class="card" data-category="${tour.category || ''}">
        <div class="card-img-wrap">
          <img class="card-img" src="${tour.image || 'indeximg/card1.jpg'}" alt="${tour.title}" />
          <span class="badge">${tour.badge || 'Тур'}</span>
          <button class="fav" title="В обране"></button>
        </div>
        <div class="card-body">
          <h3 class="card-title">${tour.title}</h3>
          <span class="card-meta">${tour.duration || ''}</span>
          <span class="card-price">${tour.price || ''}</span>
          <div class="chips">${chipsHtml}</div>
          <div class="card-actions">
            <div class="left-actions"><button class="btn-primary">Забронювати</button></div>
            <div class="right-actions"><button class="btn-outline">Детальніше</button></div>
          </div>
        </div>
      </article>
    `;
  }

  // Початкові дані для карток
  const initialTours = [
    {
      title: 'Балі, Індонезія',
      duration: 'All Inclusive • 7 ночей',
      price: '35 960 грн',
      image: 'indeximg/card1.jpg',
      badge: 'Екзотика',
      chips: ['Серфінг', 'SPA', 'Вулкани'],
      category: 'екзотика'
    },
    {
      title: 'Крит, Греція',
      duration: 'Сніданки • 5 ночей',
      price: '19 960 грн',
      image: 'indeximg/card2.jpg',
      badge: 'Пляж',
      chips: ['Пляжі', 'Античність', 'Таверни'],
      category: 'пляж'
    },
    {
      title: 'Мальдіви',
      duration: 'Вілли • 6 ночей',
      price: '51 960 грн',
      image: 'indeximg/card3.jpg',
      badge: 'Люкс',
      chips: ['Океан', 'Рифи', 'Релакс'],
      category: 'люкс'
    },
    {
      title: 'Бора-Бора',
      duration: 'Лагуни • 7 ночей',
      price: '59 960 грн',
      image: 'indeximg/card4.jpg',
      badge: 'Екзотика',
      chips: ['Бунгало', 'Каяки', 'Снорклінг'],
      category: 'екзотика'
    },
    {
      title: 'Палаван, Філіппіни',
      duration: 'Еко-тур • 6 ночей',
      price: '31 960 грн',
      image: 'indeximg/card5.jpg',
      badge: 'Природа',
      chips: ['Лагуни', 'Печери', 'Острівці'],
      category: 'природа'
    },
    {
      title: 'Самуї, Таїланд',
      duration: 'Сніданки • 7 ночей',
      price: '27 960 грн',
      image: 'indeximg/card6.jpg',
      badge: 'Пляж',
      chips: ['Пальми', 'Фрукти', 'Храми'],
      category: 'пляж'
    },
    {
      title: 'Санторіні, Греція',
      duration: 'Романтика • 5 ночей',
      price: '23 160 грн',
      image: 'indeximg/card7.jpg',
      badge: 'Історія',
      chips: ['Закати', 'Круїзи', 'Вина'],
      category: 'історія'
    },
    {
      title: 'Марокко',
      duration: 'Гіди • 6 ночей',
      price: '15 960 грн',
      image: 'indeximg/card8.jpg',
      badge: 'Історія',
      chips: ['Медина', 'Сахара', 'Базар'],
      category: 'історія'
    }
  ];

  // Завантаження карток
  function loadTours() {
    const track = document.getElementById('carouselTrack');
    if (track) {
      track.innerHTML = initialTours.map(tour => createCardFromTour(tour)).join('');
      toursData = initialTours;
    }
  }

  // Отримання деталей з картки
  function getDetailsFromCard(card) {
    const title = card.querySelector('.card-title')?.textContent?.trim() || '';
    const tourData = toursData.find(t => t.title === title) || {};
    const details = tourDetailsData[title] || {};
    
    return {
      title,
      subtitle: card.querySelector('.card-meta')?.textContent?.trim() || '',
      price: card.querySelector('.card-price')?.textContent?.trim() || '',
      img: card.querySelector('.card-img')?.src || '',
      badge: card.querySelector('.badge')?.textContent?.trim() || '',
      tags: Array.from(card.querySelectorAll('.chips .chip')).map(c => c.textContent.trim()),
      description: details.description || tourData.description || 'Чудовий відпочинок...',
      departureDates: details.departureDates || ['15.03.2026', '22.03.2026', '29.03.2026'],
      duration: card.querySelector('.card-meta')?.textContent?.trim() || '',
      groupSize: details.groupSize || 'До 30 осіб',
      accommodation: details.accommodation || 'Комфортний готель'
    };
  }

  // Отримання даних для бронювання з картки
  function getBookingItemFromCard(card) {
    const title = card.querySelector('.card-title')?.textContent?.trim() || '';
    return {
      title,
      image: card.querySelector('.card-img')?.src || '',
      price: card.querySelector('.card-price')?.textContent?.trim() || '',
      meta: card.querySelector('.card-meta')?.textContent?.trim() || '',
      badge: card.querySelector('.badge')?.textContent?.trim() || '',
      chips: Array.from(card.querySelectorAll('.chips .chip')).map(c => c.textContent.trim()),
      category: card.dataset.category || ''
    };
  }

  // Показ модального вікна з деталями
  function showDetailsModal(details, bookingItem) {
    const modal = document.getElementById('modalDetails');
    if (!modal) return;
    
    document.getElementById('modalDetailsImg').src = details.img || '';
    document.getElementById('modalDetailsImg').alt = details.title || '';
    document.getElementById('modalDetailsBadge').textContent = details.badge || '';
    document.getElementById('modalDetailsTitle').textContent = details.title || '';
    document.getElementById('modalDetailsSubtitle').textContent = details.subtitle || '';
    document.getElementById('modalDetailsPrice').textContent = details.price || '';
    
    const chipsContainer = document.getElementById('modalDetailsChips');
    if (chipsContainer) {
      chipsContainer.innerHTML = '';
      if (details.tags && details.tags.length) {
        details.tags.forEach(tag => {
          const chip = document.createElement('span');
          chip.className = 'modal-chip';
          chip.textContent = tag;
          chipsContainer.appendChild(chip);
        });
      }
    }
    
    document.getElementById('modalDetailsDescription').textContent = details.description || '';
    
    const infoGrid = document.getElementById('modalDetailsInfo');
    if (infoGrid) {
      infoGrid.innerHTML = `
        <div class="modal-info-item">
          <span class="modal-info-label">Тривалість</span>
          <span class="modal-info-value">${details.duration || '—'}</span>
        </div>
        <div class="modal-info-item">
          <span class="modal-info-label">Група</span>
          <span class="modal-info-value">${details.groupSize || '—'}</span>
        </div>
        <div class="modal-info-item">
          <span class="modal-info-label">Проживання</span>
          <span class="modal-info-value">${details.accommodation || '—'}</span>
        </div>
        <div class="modal-info-item">
          <span class="modal-info-label">Дати вильотів</span>
          <span class="modal-info-value">${details.departureDates ? details.departureDates.join(', ') : '—'}</span>
        </div>
      `;
    }
    
    modal.dataset.bookingItem = JSON.stringify(bookingItem || details);
    modal.classList.add('active');
  }

  // Показ модального вікна бронювання
  function showBookModal(item) {
    const modal = document.getElementById('modalBook');
    if (!modal) return;
    
    document.getElementById('modalBookTitle').textContent = `Бронювання: ${item.title || ''}`;
    document.getElementById('modalBookSubtitle').textContent = `${item.meta || ''} • ${item.price || ''}`;
    
    const form = document.getElementById('modalBookForm');
    if (form) {
      form.reset();
      document.getElementById('modalBookSuccess').classList.remove('active');
    }
    
    modal.classList.add('active');
  }

  // Показ деталей туру зі слайдера
  function showTourDetailsFromSlider(tourId) {
    const details = sliderTourDetails[tourId];
    if (details) {
      showDetailsModal(details, details);
    } else {
      showToast('Інформацію про тур не знайдено', 'error');
    }
  }

  // Налаштування обробників для карток (ВИПРАВЛЕНО)
  function setupItemHandlers() {
    console.log('Налаштування обробників для карток');
    
    // Видаляємо старі обробники
    delete window.detailsHandler;
    delete window.bookHandler;
    
    // Обробники для кнопок "Детальніше"
    document.querySelectorAll('.btn-outline').forEach(btn => {
      const newBtn = btn.cloneNode(true);
      btn.parentNode.replaceChild(newBtn, btn);
      
      newBtn.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        
        const card = this.closest('.card');
        if (!card) return;
        
        const details = getDetailsFromCard(card);
        const bookingItem = getBookingItemFromCard(card);
        showDetailsModal(details, bookingItem);
      });
    });
    
    // Обробники для кнопок "Забронювати"
    document.querySelectorAll('.btn-primary').forEach(btn => {
      const newBtn = btn.cloneNode(true);
      btn.parentNode.replaceChild(newBtn, btn);
      
      newBtn.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        
        const card = this.closest('.card');
        if (!card) return;
        
        const bookingItem = getBookingItemFromCard(card);
        showBookModal(bookingItem);
      });
    });
    
    // Обробники для кнопок лайків (ВИПРАВЛЕНО - з перевіркою авторизації)
    document.querySelectorAll('.fav').forEach(btn => {
      const newBtn = btn.cloneNode(true);
      btn.parentNode.replaceChild(newBtn, btn);
      
      newBtn.addEventListener('click', async function(e) {
        e.preventDefault();
        e.stopPropagation();
        
        // ПЕРЕВІРКА АВТОРИЗАЦІЇ
        if (!window.auth?.getToken()) {
          showToast('🔒 Увійдіть, щоб додавати в обране', 'info');
          setTimeout(() => { window.location.href = 'login.html'; }, 1500);
          return;
        }
        
        const card = this.closest('.card');
        if (!card) return;
        
        const title = card.querySelector('.card-title')?.textContent?.trim() || '';
        const image = card.querySelector('.card-img')?.src || '';
        const price = card.querySelector('.card-price')?.textContent?.trim() || '';
        const meta = card.querySelector('.card-meta')?.textContent?.trim() || '';
        const badge = card.querySelector('.badge')?.textContent?.trim() || '';
        const chips = Array.from(card.querySelectorAll('.chips .chip')).map(c => c.textContent.trim());
        const category = card.dataset.category || '';
        
        const item = { title, image, price, meta, badge, chips, category };
        
        try {
          // Якщо у вас є серверна логіка
          if (window.auth?.toggleFavorite) {
            const result = await window.auth.toggleFavorite(item);
            if (result.success) {
              if (result.action === 'added') {
                this.classList.add('active');
                showToast('✅ Додано в улюблені', 'success');
              } else {
                this.classList.remove('active');
                showToast('🗑️ Видалено з улюблених', 'info');
              }
            } else {
              showToast(result.message || 'Помилка', 'error');
            }
          } else {
            // Якщо серверної логіки немає, просто імітуємо
            this.classList.toggle('active');
            showToast(this.classList.contains('active') ? '✅ Додано в улюблені' : '🗑️ Видалено з улюблених', 'success');
          }
        } catch (error) {
          console.error('Помилка:', error);
          showToast('Помилка з\'єднання', 'error');
        }
      });
    });
  }

  // Налаштування обробників для слайдера
  function setupSliderHandlers() {
    console.log('Налаштування обробників для слайдера');
    
    document.querySelectorAll('.slide-detail-btn').forEach(btn => {
      const newBtn = btn.cloneNode(true);
      btn.parentNode.replaceChild(newBtn, btn);
      
      newBtn.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        const tourId = this.dataset.tour;
        showTourDetailsFromSlider(tourId);
      });
    });
  }

  // Налаштування пошуку за датою
  function setupDateSearch() {
    const searchBtn = document.getElementById('searchByDate');
    const clearBtn = document.getElementById('clearSearch');
    const datePicker = document.getElementById('datePicker');
    const searchResultsDiv = document.getElementById('searchResults');
    const searchResultsTitle = document.getElementById('searchResultsTitle');
    
    // Зібрати всі доступні дати
    const allDates = new Set();
    Object.values(tourDetailsData).forEach(d => {
      if (d.departureDates) d.departureDates.forEach(date => allDates.add(date));
    });
    
    const sortedDates = Array.from(allDates).sort((a, b) => {
      const [d1, m1, y1] = a.split('.').map(Number);
      const [d2, m2, y2] = b.split('.').map(Number);
      return new Date(y1, m1 - 1, d1) - new Date(y2, m2 - 1, d2);
    });
    
    const availableNote = document.getElementById('availableDatesNote');
    if (availableNote) {
      availableNote.innerHTML = `📅 Доступні дати: ${sortedDates.slice(0, 7).join(', ')}`;
    }
    
    if (searchBtn && datePicker) {
      searchBtn.addEventListener('click', () => {
        const selected = datePicker.value;
        if (!selected) {
          showToast('❌ Оберіть дату', 'error');
          return;
        }
        
        const [y, m, d] = selected.split('-');
        const formatted = `${d}.${m}.${y}`;
        
        // Знайти тури з цією датою
        const foundTitles = [];
        for (const [title, data] of Object.entries(tourDetailsData)) {
          if (data.departureDates && data.departureDates.includes(formatted)) {
            foundTitles.push(title);
          }
        }
        
        if (foundTitles.length) {
          const allCards = document.querySelectorAll('#carouselTrack .card');
          const foundCards = Array.from(allCards).filter(card => {
            const title = card.querySelector('.card-title')?.textContent?.trim();
            return foundTitles.includes(title);
          });
          
          if (searchResultsDiv) {
            searchResultsDiv.innerHTML = foundCards.map(card => card.outerHTML).join('');
            searchResultsDiv.classList.add('visible');
            
            // Переналаштувати обробники для знайдених карток
            setTimeout(() => {
              document.querySelectorAll('#searchResults .btn-outline').forEach(btn => {
                btn.addEventListener('click', function(e) {
                  e.preventDefault();
                  e.stopPropagation();
                  const card = this.closest('.card');
                  if (card) {
                    const details = getDetailsFromCard(card);
                    const bookingItem = getBookingItemFromCard(card);
                    showDetailsModal(details, bookingItem);
                  }
                });
              });
              
              document.querySelectorAll('#searchResults .btn-primary').forEach(btn => {
                btn.addEventListener('click', function(e) {
                  e.preventDefault();
                  e.stopPropagation();
                  const card = this.closest('.card');
                  if (card) {
                    const bookingItem = getBookingItemFromCard(card);
                    showBookModal(bookingItem);
                  }
                });
              });
              
              document.querySelectorAll('#searchResults .fav').forEach(btn => {
                btn.addEventListener('click', async function(e) {
                  e.preventDefault();
                  e.stopPropagation();
                  
                  if (!window.auth?.getToken()) {
                    showToast('🔒 Увійдіть, щоб додавати в обране', 'info');
                    setTimeout(() => { window.location.href = 'login.html'; }, 1500);
                    return;
                  }
                  
                  this.classList.toggle('active');
                  showToast(this.classList.contains('active') ? '✅ Додано в улюблені' : '🗑️ Видалено з улюблених', 'success');
                });
              });
            }, 100);
          }
          if (searchResultsTitle) searchResultsTitle.classList.add('visible');
          showToast(`✅ Знайдено турів: ${foundTitles.length}`, 'success');
        } else {
          if (searchResultsDiv) searchResultsDiv.classList.remove('visible');
          if (searchResultsTitle) searchResultsTitle.classList.remove('visible');
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
  }

  // Налаштування каруселі
  function setupCarousel() {
    const track = document.getElementById('carouselTrack');
    const leftBtn = document.getElementById('carouselLeft');
    const rightBtn = document.getElementById('carouselRight');
    
    if (track && leftBtn && rightBtn) {
      let idx = 0;
      const cards = document.querySelectorAll('.card', track);
      
      if (cards.length) {
        const updateCarousel = () => {
          const cardWidth = cards[0].getBoundingClientRect().width + 24;
          const maxIdx = Math.max(0, cards.length - 4);
          track.style.transform = `translateX(-${idx * cardWidth}px)`;
        };
        
        rightBtn.addEventListener('click', () => {
          const maxIdx = Math.max(0, cards.length - 4);
          idx = Math.min(idx + 1, maxIdx);
          updateCarousel();
        });
        
        leftBtn.addEventListener('click', () => {
          idx = Math.max(idx - 1, 0);
          updateCarousel();
        });
        
        window.addEventListener('resize', updateCarousel);
      }
    }
  }

  // Налаштування модальних вікон
  function setupModals() {
    // Закриття по кнопках
    document.querySelectorAll('.modal-close').forEach(btn => {
      const newBtn = btn.cloneNode(true);
      btn.parentNode.replaceChild(newBtn, btn);
      
      newBtn.addEventListener('click', function() {
        const modal = this.closest('.modal-overlay');
        if (modal) modal.classList.remove('active');
      });
    });
    
    // Закриття по кліку на оверлей
    document.querySelectorAll('.modal-overlay').forEach(overlay => {
      const newOverlay = overlay.cloneNode(true);
      overlay.parentNode.replaceChild(newOverlay, overlay);
      
      newOverlay.addEventListener('click', function(e) {
        if (e.target === this) this.classList.remove('active');
      });
    });
    
    // Кнопка "Забронювати" в модальному вікні деталей
    const modalDetailsBook = document.getElementById('modalDetailsBook');
    if (modalDetailsBook) {
      const newBtn = modalDetailsBook.cloneNode(true);
      modalDetailsBook.parentNode.replaceChild(newBtn, modalDetailsBook);
      
      newBtn.addEventListener('click', function() {
        const modal = document.getElementById('modalDetails');
        if (!modal) return;
        
        const bookingItemStr = modal.dataset.bookingItem;
        const bookingItem = bookingItemStr ? JSON.parse(bookingItemStr) : {};
        
        modal.classList.remove('active');
        showBookModal(bookingItem);
      });
    }
    
    // Перемикання вкладок
    document.querySelectorAll('.modal-tab').forEach(tab => {
      const newTab = tab.cloneNode(true);
      tab.parentNode.replaceChild(newTab, tab);
      
      newTab.addEventListener('click', function() {
        const tabName = this.dataset.tab;
        const modalContent = this.closest('.modal-content');
        
        modalContent.querySelectorAll('.modal-tab').forEach(t => t.classList.remove('active'));
        this.classList.add('active');
        
        modalContent.querySelectorAll('.modal-panel').forEach(p => p.classList.remove('active'));
        const panel = modalContent.querySelector(`[data-panel="${tabName}"]`);
        if (panel) panel.classList.add('active');
      });
    });
    
    // Форма бронювання
    const bookForm = document.getElementById('modalBookForm');
    if (bookForm) {
      const newForm = bookForm.cloneNode(true);
      bookForm.parentNode.replaceChild(newForm, bookForm);
      
      newForm.addEventListener('submit', function(e) {
        e.preventDefault();
        document.getElementById('modalBookSuccess').classList.add('active');
        showToast('✓ Бронювання підтверджено', 'success');
        
        setTimeout(() => {
          this.closest('.modal-overlay').classList.remove('active');
        }, 2000);
      });
    }
    
    // Очищення форми відгуку
    const mrfClear = document.getElementById('mrfClear');
    if (mrfClear) {
      const newBtn = mrfClear.cloneNode(true);
      mrfClear.parentNode.replaceChild(newBtn, mrfClear);
      
      newBtn.addEventListener('click', function() {
        document.getElementById('mrfName').value = '';
        document.getElementById('mrfText').value = '';
      });
    }
    
    // Відправка відгуку
    const mrfSubmit = document.getElementById('mrfSubmit');
    if (mrfSubmit) {
      const newBtn = mrfSubmit.cloneNode(true);
      mrfSubmit.parentNode.replaceChild(newBtn, mrfSubmit);
      
      newBtn.addEventListener('click', function() {
        const name = document.getElementById('mrfName').value;
        const text = document.getElementById('mrfText').value;
        
        if (!name || !text) {
          showToast('❌ Заповніть всі поля', 'error');
          return;
        }
        
        showToast('✓ Дякуємо за відгук!', 'success');
        document.getElementById('mrfName').value = '';
        document.getElementById('mrfText').value = '';
      });
    }
    
    // Зірковий рейтинг
    const starInput = document.getElementById('mrfStars');
    if (starInput) {
      const newStarInput = starInput.cloneNode(true);
      starInput.parentNode.replaceChild(newStarInput, starInput);
      
      newStarInput.querySelectorAll('span').forEach(star => {
        star.addEventListener('click', function() {
          const value = this.dataset.star;
          newStarInput.dataset.value = value;
          
          newStarInput.querySelectorAll('span').forEach((s, i) => {
            s.style.color = i < value ? '#fbbf24' : '#d1d5db';
          });
        });
      });
    }
  }

  // Ініціалізація
  function init() {
    console.log('Ініціалізація index.js');
    loadTours();
    
    // Запускаємо налаштування обробників після завантаження DOM
    setTimeout(() => {
      setupSliderHandlers();
      setupItemHandlers();
      setupDateSearch();
      setupCarousel();
      setupModals();
    }, 100);
  }

  // Запуск після завантаження DOM
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();