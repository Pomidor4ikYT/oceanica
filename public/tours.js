// public/tours.js
(function() {
  const { qs, qsa, showToast, initSlider, setupFavorites, loadFavoritesState, setupFilter, setupItemHandlers } = window.utils;

  initSlider('#sliderSlides');
  setupFavorites();

  // Категорії для фільтра
  const categoryMap = {
    beach: '🏖️ Пляжні',
    excursion: '🏛️ Екскурсійні',
    mountain: '⛰️ Гірські'
  };
  setupFilter('filterBtn', 'filterPanel', 'categoryChips', categoryMap);

  // Завантаження турів з сервера
  let toursData = [];
  async function loadTours() {
    try {
      const response = await fetch('/api/tours');
      toursData = await response.json();
      const grid = qs('#toursGrid');
      if (grid) {
        grid.innerHTML = toursData.map(tour => createCardFromTour(tour)).join('');
        loadFavoritesState();
        setupDateSearchForTours();
      }
    } catch (error) {
      console.error('Помилка завантаження турів:', error);
    }
  }

  function createCardFromTour(tour) {
    const chipsHtml = (tour.chips ? JSON.parse(tour.chips) : []).map(c => `<span class="chip">${c}</span>`).join('');
    return `
      <article class="card" data-category="${tour.category || ''}">
        <div class="card-img-wrap">
          <img class="card-img" src="${tour.image || 'toursimg/tour1.jpg'}" alt="${tour.title}" />
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

  // Налаштування пошуку за датою
  function setupDateSearchForTours() {
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
          const allCards = qsa('#toursGrid .card');
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
    'Таїланд: Пхукет & Пхі-Пхі': {
      departureDates: ['15.03.2026', '22.03.2026', '05.04.2026'],
      description: 'Райські пляжі Таїланду з кристальною водою та островами...',
      groupSize: 'До 25 осіб',
      accommodation: 'Курортний готель 4*'
    },
    'Італія: Рим, Флоренція, Венеція': {
      departureDates: ['10.04.2026', '24.04.2026', '08.05.2026'],
      description: 'Класичний тур по найвідоміших містах Італії...',
      groupSize: 'До 30 осіб',
      accommodation: 'Готель 3-4*'
    },
    'Непал: Еверест та храми': {
      departureDates: ['20.03.2026', '03.04.2026', '17.04.2026'],
      description: 'Пекучний тур на гори та духовні святині Непалу...',
      groupSize: 'До 15 осіб',
      accommodation: 'Альпійський кемп та готелі'
    },
    'Мальдіви: райські атоли': {
      departureDates: ['05.05.2026', '19.05.2026', '02.06.2026'],
      description: 'Екзотичні атоли Мальдіви з дайвінгом та снорклінгом...',
      groupSize: 'До 20 осіб',
      accommodation: 'Вілли над водою 5*'
    },
    'Франція: Париж, Долина Луари': {
      departureDates: ['12.04.2026', '26.04.2026', '10.05.2026'],
      description: 'Романтична Франція з відомою архітектурою та вином...',
      groupSize: 'До 28 осіб',
      accommodation: 'Готель 3-4*'
    },
    'Швейцарія: Альпи та озера': {
      departureDates: ['08.03.2026', '22.03.2026', '05.04.2026'],
      description: 'Гірські шедеври Швейцарії з озерами та гірськими наскорисованнями...',
      groupSize: 'До 22 осіб',
      accommodation: 'Гірський готель'
    },
    'Єгипет: Хургада, піраміди': {
      departureDates: ['25.05.2026', '09.06.2026', '23.06.2026'],
      description: 'Древній Єгипет з пірамідами та Червоним морем...',
      groupSize: 'До 30 осіб',
      accommodation: 'Готель 4*'
    },
    'Греція: Афіни, Метеори, Салоніки': {
      departureDates: ['15.06.2026', '29.06.2026', '13.07.2026'],
      description: 'Класична Греція з древніми памятками та островами...',
      groupSize: 'До 25 осіб',
      accommodation: 'Готель 3-4*'
    },
    'Перу: Мачу-Пікчу та Анди': {
      departureDates: ['04.04.2026', '18.04.2026', '02.05.2026'],
      description: 'Легендарна Мачу-Пікчу та вулкани Перу...',
      groupSize: 'До 16 осіб',
      accommodation: 'Еко-готель та кемп'
    },
    'Балі: храми та серфінг': {
      departureDates: ['10.06.2026', '24.06.2026', '07.07.2026'],
      description: 'Духовна Балі з храмами, рисовими полями та серфінгом...',
      groupSize: 'До 20 осіб',
      accommodation: 'Готель 4*'
    },
    'Ісландія: вулкани та льодовики': {
      departureDates: ['20.05.2026', '04.06.2026', '18.06.2026'],
      description: 'Льодовики, вулкани та води Ісландії...',
      groupSize: 'До 14 осіб',
      accommodation: 'Готель 3-4*'
    },
    'Японія: Токіо, Кіото, Осака': {
      departureDates: ['12.06.2026', '26.06.2026', '09.07.2026'],
      description: 'Модерна та традиційна Японія з храмами та технологіями...',
      groupSize: 'До 22 осіб',
      accommodation: 'Готель 4*'
    }
  };

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

  // Викликаємо loadTours та установимо fallback
  loadTours();
  
  // Якщо toursData порожні, встановимо setupDateSearch все одно
  setTimeout(() => {
    if (!toursData.length && qs('#toursGrid .card')) {
      // Якщо дані не завантажилися, але карточки на сторінці існують, витягнемо їх з tourDetailsData
      toursData = qsa('#toursGrid .card').map(card => {
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
    setupDateSearchForTours();
  }, 500);
})();