// public/js/index.js
(function() {
  const qs = (sel, ctx) => (ctx || document).querySelector(sel);
  const qsa = (sel, ctx) => Array.from((ctx || document).querySelectorAll(sel));

  // ========== Дефолтні дані для головної ==========
  const initialTours = [
    {
      title: 'Балі, Індонезія',
      duration: 'All Inclusive • 7 ночей',
      price: '35 960 грн',
      image: 'styles/img/index/card1.jpg',
      badge: 'Екзотика',
      chips: ['Серфінг', 'SPA', 'Вулкани'],
      category: 'екзотика'
    },
    {
      title: 'Крит, Греція',
      duration: 'Сніданки • 5 ночей',
      price: '19 960 грн',
      image: 'styles/img/index/card2.jpg',
      badge: 'Пляж',
      chips: ['Пляжі', 'Античність', 'Таверни'],
      category: 'пляж'
    },
    {
      title: 'Мальдіви',
      duration: 'Вілли • 6 ночей',
      price: '51 960 грн',
      image: 'styles/img/index/card3.jpg',
      badge: 'Люкс',
      chips: ['Океан', 'Рифи', 'Релакс'],
      category: 'люкс'
    },
    {
      title: 'Бора-Бора',
      duration: 'Лагуни • 7 ночей',
      price: '59 960 грн',
      image: 'styles/img/index/card4.jpg',
      badge: 'Екзотика',
      chips: ['Бунгало', 'Каяки', 'Снорклінг'],
      category: 'екзотика'
    },
    {
      title: 'Палаван, Філіппіни',
      duration: 'Еко-тур • 6 ночей',
      price: '31 960 грн',
      image: 'styles/img/index/card5.jpg',
      badge: 'Природа',
      chips: ['Лагуни', 'Печери', 'Острівці'],
      category: 'природа'
    },
    {
      title: 'Самуї, Таїланд',
      duration: 'Сніданки • 7 ночей',
      price: '27 960 грн',
      image: 'styles/img/index/card6.jpg',
      badge: 'Пляж',
      chips: ['Пальми', 'Фрукти', 'Храми'],
      category: 'пляж'
    },
    {
      title: 'Санторіні, Греція',
      duration: 'Романтика • 5 ночей',
      price: '23 160 грн',
      image: 'styles/img/index/card7.jpg',
      badge: 'Історія',
      chips: ['Закати', 'Круїзи', 'Вина'],
      category: 'історія'
    },
    {
      title: 'Марокко',
      duration: 'Гіди • 6 ночей',
      price: '15 960 грн',
      image: 'styles/img/index/card8.jpg',
      badge: 'Історія',
      chips: ['Медина', 'Сахара', 'Базар'],
      category: 'історія'
    }
  ];

  // ========== Дані для деталей турів на головній ==========
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
    }
  };

  const sliderTourDetails = {
    'egypt': {
      title: 'Єгипет',
      subtitle: 'Трансфер + гід • листопад',
      price: '23 960 грн',
      img: 'styles/img/index/bar1.jpg',
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
      img: 'styles/img/index/bar2.jpg',
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
      img: 'styles/img/index/bar3.jpg',
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
      img: 'styles/img/index/bar4.jpg',
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
      img: 'styles/img/index/bar5.jpg',
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
      img: 'styles/img/index/bar6.jpg',
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
      img: 'styles/img/index/bar7.jpg',
      badge: '-25%',
      tags: ['Гірськолижні курорти', 'SPA', 'Фонду'],
      description: 'Гірськолижні курорти Європи. Траси різної складності, підйомники, вечірки після катання.',
      departureDates: ['10.01.2027', '17.01.2027', '24.01.2027'],
      duration: '8 ночей',
      groupSize: 'До 30 осіб',
      accommodation: 'Шале 4*'
    }
  };

  // ========== Функції ==========
  function showToast(message, type = 'info') {
    if (window.utils?.showToast) {
      window.utils.showToast(message, type);
      return;
    }
    
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

  function createCardFromTour(tour) {
    const chipsHtml = (tour.chips || []).map(c => `<span class="chip">${c}</span>`).join('');
    return `
      <article class="card" data-category="${tour.category || ''}">
        <div class="card-img-wrap">
          <img class="card-img" src="${tour.image || 'styles/img/index/card1.jpg'}" alt="${tour.title}" />
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

  function loadTours() {
    const track = document.getElementById('carouselTrack');
    if (track) {
      track.innerHTML = initialTours.map(tour => createCardFromTour(tour)).join('');
    }
  }

  // ========== Слайдер ==========
  function initSlider() {
    const slides = document.getElementById('sliderSlides');
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
    
    setInterval(() => {
      currentIndex = (currentIndex + 1) % totalSlides;
      updateSlider();
    }, 5000);
  }

  function getDetailsFromCard(card) {
    const title = card.querySelector('.card-title')?.textContent?.trim() || '';
    const tourData = initialTours.find(t => t.title === title) || {};
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

  // ========== Модальні вікна ==========
  const detailsModal = document.getElementById('modalDetails');
  const bookModal = document.getElementById('modalBook');
  let currentBookingItem = null;

  function showDetailsModal(details) {
    if (!detailsModal) return;
    
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
    
    detailsModal.classList.add('active');
  }

  function showBookModal(item) {
    if (!bookModal) return;
    
    document.getElementById('modalBookTitle').textContent = `Бронювання: ${item.title || ''}`;
    document.getElementById('modalBookSubtitle').textContent = `${item.meta || ''} • ${item.price || ''}`;
    
    const form = document.getElementById('modalBookForm');
    if (form) {
      form.reset();
      document.getElementById('modalBookSuccess').classList.remove('active');
    }
    
    window.__currentBookingItem = item;
    bookModal.classList.add('active');
  }

  function showTourDetailsFromSlider(tourId) {
    const details = sliderTourDetails[tourId];
    if (details) {
      showDetailsModal(details);
    } else {
      showToast('Інформацію про тур не знайдено', 'error');
    }
  }

  function setupItemHandlers() {
    console.log('Налаштування обробників для карток');
    
    document.querySelectorAll('.btn-outline:not(.modal-close)').forEach(btn => {
      btn.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        
        const card = this.closest('.card');
        if (!card) return;
        
        const details = getDetailsFromCard(card);
        showDetailsModal(details);
      });
    });
    
    document.querySelectorAll('.btn-primary:not(.modal-close)').forEach(btn => {
      btn.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        
        const card = this.closest('.card');
        if (!card) return;
        
        const bookingItem = getBookingItemFromCard(card);
        showBookModal(bookingItem);
      });
    });
    
    document.querySelectorAll('.fav').forEach(btn => {
      btn.addEventListener('click', async function(e) {
        e.preventDefault();
        e.stopPropagation();
        
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

  function setupSliderHandlers() {
    console.log('Налаштування обробників для слайдера');
    
    document.querySelectorAll('.slide-detail-btn').forEach(btn => {
      btn.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        const tourId = this.dataset.tour;
        showTourDetailsFromSlider(tourId);
      });
    });
  }

  function setupDateSearch() {
    const searchBtn = document.getElementById('searchByDate');
    const clearBtn = document.getElementById('clearSearch');
    const datePicker = document.getElementById('datePicker');
    const searchResultsDiv = document.getElementById('searchResults');
    const searchResultsTitle = document.getElementById('searchResultsTitle');
    
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
            
            setTimeout(() => {
              document.querySelectorAll('#searchResults .btn-outline').forEach(btn => {
                btn.addEventListener('click', function(e) {
                  e.preventDefault();
                  e.stopPropagation();
                  const card = this.closest('.card');
                  if (card) {
                    const details = getDetailsFromCard(card);
                    showDetailsModal(details);
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
        setTimeout(updateCarousel, 100);
      }
    }
  }

  function setupModals() {
    document.querySelectorAll('.modal-close').forEach(btn => {
      btn.addEventListener('click', function() {
        const modal = this.closest('.modal-overlay');
        if (modal) modal.classList.remove('active');
      });
    });
    
    document.querySelectorAll('.modal-overlay').forEach(overlay => {
      overlay.addEventListener('click', function(e) {
        if (e.target === this) this.classList.remove('active');
      });
    });
    
    const modalDetailsBook = document.getElementById('modalDetailsBook');
    if (modalDetailsBook) {
      modalDetailsBook.addEventListener('click', function() {
        const modal = document.getElementById('modalDetails');
        if (!modal) return;
        
        const title = document.getElementById('modalDetailsTitle')?.textContent || '';
        const price = document.getElementById('modalDetailsPrice')?.textContent || '';
        const img = document.getElementById('modalDetailsImg')?.src || '';
        const badge = document.getElementById('modalDetailsBadge')?.textContent || '';
        const subtitle = document.getElementById('modalDetailsSubtitle')?.textContent || '';
        
        const chipsContainer = document.getElementById('modalDetailsChips');
        const chips = chipsContainer ? Array.from(chipsContainer.querySelectorAll('.modal-chip')).map(c => c.textContent) : [];
        
        const bookingItem = {
          title,
          price: price.replace('від ', ''),
          image: img,
          badge,
          chips,
          meta: subtitle,
          category: ''
        };
        
        modal.classList.remove('active');
        showBookModal(bookingItem);
      });
    }
    
    document.querySelectorAll('.modal-tab').forEach(tab => {
      tab.addEventListener('click', function() {
        const tabName = this.dataset.tab;
        const modalContent = this.closest('.modal-content');
        
        modalContent.querySelectorAll('.modal-tab').forEach(t => t.classList.remove('active'));
        this.classList.add('active');
        
        modalContent.querySelectorAll('.modal-panel').forEach(p => p.classList.remove('active'));
        const panel = modalContent.querySelector(`[data-panel="${tabName}"]`);
        if (panel) panel.classList.add('active');
      });
    });
    
    const bookForm = document.getElementById('modalBookForm');
    if (bookForm) {
      bookForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        if (!window.auth?.getToken()) {
          showToast('🔒 Увійдіть, щоб забронювати', 'info');
          setTimeout(() => { window.location.href = 'login.html'; }, 1500);
          return;
        }
        
        const dateInput = this.querySelector('input[name="date"]');
        if (!dateInput.value) {
          showToast('Оберіть дату', 'error');
          return;
        }
        
        const successEl = document.getElementById('modalBookSuccess');
        if (successEl) {
          successEl.classList.add('active');
          successEl.style.display = 'block';
        }
        
        showToast('✓ Бронювання підтверджено', 'success');
        
        setTimeout(() => {
          this.closest('.modal-overlay').classList.remove('active');
          if (successEl) {
            successEl.classList.remove('active');
            successEl.style.display = 'none';
          }
        }, 2000);
      });
    }
    
    const mrfClear = document.getElementById('mrfClear');
    if (mrfClear) {
      mrfClear.addEventListener('click', function() {
        document.getElementById('mrfName').value = '';
        document.getElementById('mrfText').value = '';
      });
    }
    
    const mrfSubmit = document.getElementById('mrfSubmit');
    if (mrfSubmit) {
      mrfSubmit.addEventListener('click', function() {
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
    
    const starInput = document.getElementById('mrfStars');
    if (starInput) {
      starInput.querySelectorAll('span').forEach(star => {
        star.addEventListener('click', function() {
          const value = this.dataset.star;
          starInput.dataset.value = value;
          
          starInput.querySelectorAll('span').forEach((s, i) => {
            s.textContent = i < value ? '★' : '☆';
          });
        });
      });
    }
  }

  function init() {
    console.log('Ініціалізація index.js');
    loadTours();
    
    setTimeout(() => {
      initSlider();
      setupSliderHandlers();
      setupItemHandlers();
      setupDateSearch();
      setupCarousel();
      setupModals();
    }, 100);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();