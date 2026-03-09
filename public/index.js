// public/index.js
(function() {
  const { qs, qsa, showToast, initSlider, setupFavorites, loadFavoritesState, setupItemHandlers } = window.utils;

  // Ініціалізація слайдера
  initSlider('#sliderSlides');

  // Налаштування глобального обробника лайків
  setupFavorites();

  // Дані для пошуку та деталей
  let toursData = [];

  // Завантаження гарячих турів з сервера
  async function loadHotTours() {
    try {
      const response = await fetch('/api/tours'); // або окремий ендпоінт для гарячих
      toursData = await response.json();
      const track = qs('#carouselTrack');
      if (track) {
        track.innerHTML = toursData.map(tour => createCardFromTour(tour)).join('');
        loadFavoritesState();
        setupDateSearchForIndex();
      }
    } catch (error) {
      console.error('Помилка завантаження турів:', error);
    }
  }

  // Функція створення картки з об'єкта туру
  function createCardFromTour(tour) {
    const chipsHtml = (tour.chips ? JSON.parse(tour.chips) : []).map(c => `<span class="chip">${c}</span>`).join('');
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

  // Пошук за датою
  function setupDateSearchForIndex() {
    const searchBtn = qs('#searchByDate');
    const clearBtn = qs('#clearSearch');
    const datePicker = qs('#datePicker');
    const searchResultsDiv = qs('#searchResults');
    const searchResultsTitle = qs('#searchResultsTitle');

    // Зібрати всі доступні дати
    const allDates = new Set();
    Object.values(tourDetailsData).forEach(d => {
      if (d.departureDates) d.departureDates.forEach(date => allDates.add(date));
    });
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

        // Знайти тури з цією датою
        const foundTitles = [];
        for (const [title, data] of Object.entries(tourDetailsData)) {
          if (data.departureDates && data.departureDates.includes(formatted)) foundTitles.push(title);
        }

        if (foundTitles.length) {
          // Витягнути карти з сторінки та показати тільки знайдені
          const allCards = qsa('#carouselTrack .card');
          const foundCards = allCards.filter(card => {
            const title = qs('.card-title', card)?.textContent?.trim();
            return foundTitles.includes(title);
          });
          
          searchResultsDiv.innerHTML = foundCards.map(card => {
            const html = card.outerHTML;
            return html;
          }).join('');
          loadFavoritesState();
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
  }

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
      description: 'Популярний курорт Самуї з пальмами, фрутами та храмами...',
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
      accommodation: 'Гарячі готелі 3-4*'
    },
    'Хайнань, Китай': {
      departureDates: ['04.04.2026', '18.04.2026', '02.05.2026'],
      description: 'Тропічні острів Хайнань з пляжами та парками...',
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

  // Функція для отримання деталей з карти та дат з tourDetailsData
  function getCardTourData(card) {
    const title = qs('.card-title', card)?.textContent?.trim() || '';
    const details = tourDetailsData[title] || {};
    return details;
  }

  // Ініціалізація каруселі (якщо потрібна)
  const track = qs('#carouselTrack');
  const leftBtn = qs('#carouselLeft');
  const rightBtn = qs('#carouselRight');
  if (track && leftBtn && rightBtn) {
    let idx = 0;
    let cardWidth = 324;
    const cards = qsa('.card', track);
    if (cards.length) {
      cardWidth = cards[0].getBoundingClientRect().width + 24;
      const maxIdx = cards.length - 1;
      rightBtn.addEventListener('click', () => {
        idx = Math.min(idx + 1, maxIdx);
        track.style.transform = `translateX(-${idx * cardWidth}px)`;
      });
      leftBtn.addEventListener('click', () => {
        idx = Math.max(idx - 1, 0);
        track.style.transform = `translateX(-${idx * cardWidth}px)`;
      });
    }
  }

  function getDetailsFromCard(card) {
    const title = qs('.card-title', card)?.textContent?.trim() || '';
    const tourData = toursData.find(t => t.title === title) || {};
    const details = tourDetailsData[title] || {};
    return {
      title,
      subtitle: qs('.card-meta', card)?.textContent?.trim() || '',
      price: qs('.card-price', card)?.textContent?.trim() || '',
      img: qs('.card-img', card)?.src || '',
      badge: qs('.badge', card)?.textContent?.trim() || '',
      tags: qsa('.chips .chip', card).map(c => c.textContent.trim()),
      description: details.description || tourData.description || 'Чудовий відпочинок...',
      departureDates: details.departureDates || tourData.departureDates || ['15.03.2026','22.03.2026','29.03.2026'],
      duration: qs('.card-meta', card)?.textContent?.trim() || '',
      groupSize: details.groupSize || tourData.groupSize || 'До 30 осіб',
      accommodation: details.accommodation || tourData.accommodation || 'Комфортний готель'
    };
  }

  function getBookingItemFromCard(card) {
    const title = qs('.card-title', card)?.textContent?.trim() || '';
    return {
      title,
      image: qs('.card-img', card)?.src || '',
      price: qs('.card-price', card)?.textContent?.trim() || '',
      meta: qs('.card-meta', card)?.textContent?.trim() || '',
      badge: qs('.badge', card)?.textContent?.trim() || '',
      chips: qsa('.chips .chip', card).map(c => c.textContent.trim()),
      category: card.dataset.category || ''
    };
  }

  setupItemHandlers(getDetailsFromCard, getBookingItemFromCard);

  // Завантаження турів та ініціалізація
  loadHotTours();
  
  // Якщо toursData порожні, встановимо setupDateSearch все одно
  setTimeout(() => {
    if (!toursData.length && qs('#carouselTrack .card')) {
      // Якщо дані не завантажилися, але карточки на сторінці існують, витягнемо їх з дат
      toursData = qsa('#carouselTrack .card').map(card => {
        const title = qs('.card-title', card)?.textContent?.trim() || '';
        const details = tourDetailsData[title] || {};
        return {
          title,
          duration: qs('.card-meta', card)?.textContent?.trim() || '',
          price: qs('.card-price', card)?.textContent?.trim() || '',
          image: qs('.card-img', card)?.src || '',
          badge: qs('.badge', card)?.textContent?.trim() || '',
          chips: Array.from(qsa('.chips .chip', card)).map(c => c.textContent.trim()),
          category: card.dataset.category || '',
          description: details.description || 'Чудовий відпочинок...',
          departureDates: details.departureDates || ['15.03.2026','22.03.2026','29.03.2026'],
          groupSize: details.groupSize || 'До 30 осіб',
          accommodation: details.accommodation || 'Комфортний готель'
        };
      });
    }
    setupDateSearchForIndex();
  }, 500);
  
  loadFavoritesState();
})();