// admin.js - ВИПРАВЛЕНА ВЕРСІЯ
(function() {
  const qs = (sel) => document.querySelector(sel);
  const qsa = (sel) => Array.from(document.querySelectorAll(sel));

  // Поточні теги
  let currentTags = [];
  // Поточні дати
  let currentDates = [];
  // Поточний тип
  let currentType = 'tour';
  
  // Глобальний об'єкт для зберігання демо-даних
  let demoData = {
    tour: [],
    cruise: [],
    island: [],
    hot: []
  };

  // Конфігурація для різних типів
  const typeConfig = {
    tour: {
      name: 'тур',
      categories: [
        { value: 'beach', label: '🏖️ Пляжний' },
        { value: 'excursion', label: '🏛️ Екскурсійний' },
        { value: 'mountain', label: '⛰️ Гірський' }
      ],
      badges: [
        { value: '🏖️ Пляжний', label: '🏖️ Пляжний' },
        { value: '🏛️ Екскурсійний', label: '🏛️ Екскурсійний' },
        { value: '⛰️ Гірський', label: '⛰️ Гірський' },
        { value: '🔥 Гаряча пропозиція', label: '🔥 Гаряча пропозиція' },
        { value: '-20%', label: '-20%' },
        { value: '-15%', label: '-15%' },
        { value: '-10%', label: '-10%' }
      ],
      tags: [
        '🏖️ Пляжі', '🏛️ Античність', '⛰️ Гори', '🤿 Дайвінг', '💆 SPA',
        '🚌 Екскурсії', '💕 Романтика', '🧗 Пригоди', '🍹 All Inclusive',
        '🍳 Сніданки', '🏡 Вілли', '🌊 Лагуна', '🐠 Рифи', '🛕 Храми'
      ]
    },
    cruise: {
      name: 'круїз',
      categories: [
        { value: 'warm', label: '☀️ Теплі води' },
        { value: 'cold', label: '❄️ Холодні води' },
        { value: 'temperate', label: '🌊 Помірні води' }
      ],
      badges: [
        { value: '☀️ Теплі води', label: '☀️ Теплі води' },
        { value: '❄️ Холодні води', label: '❄️ Холодні води' },
        { value: '🌊 Помірні води', label: '🌊 Помірні води' },
        { value: '🔥 Гаряча пропозиція', label: '🔥 Гаряча пропозиція' },
        { value: '-20%', label: '-20%' },
        { value: '-15%', label: '-15%' }
      ],
      tags: [
        '🌊 Океан', '🚢 Лайнер', '🏝️ Острови', '🍽️ Ресторани',
        '🎭 Шоу', '🏊 Бассейн', '🍹 Коктейлі', '🤿 Снорклінг'
      ]
    },
    island: {
      name: 'острів',
      categories: [
        { value: 'tropical', label: '🏝️ Тропічний' },
        { value: 'volcanic', label: '🌋 Вулканічний' },
        { value: 'exotic', label: '✨ Екзотичний' }
      ],
      badges: [
        { value: '🏝️ Тропічний', label: '🏝️ Тропічний' },
        { value: '🌋 Вулканічний', label: '🌋 Вулканічний' },
        { value: '✨ Екзотичний', label: '✨ Екзотичний' },
        { value: '🔥 Гаряча пропозиція', label: '🔥 Гаряча пропозиція' },
        { value: '-20%', label: '-20%' }
      ],
      tags: [
        '🏝️ Пляж', '🌴 Пальми', '🐠 Рифи', '🤿 Снорклінг',
        '🌋 Вулкан', '💆 SPA', '🏡 Бунгало', '🌅 Захід сонця'
      ]
    },
    hot: {
      name: 'гаряча путівка',
      categories: [
        { value: 'beach', label: '🏖️ Пляжний' },
        { value: 'excursion', label: '🏛️ Екскурсійний' },
        { value: 'mountain', label: '⛰️ Гірський' },
        { value: 'tropical', label: '🏝️ Тропічний' }
      ],
      badges: [
        { value: '-20%', label: '-20%' },
        { value: '-15%', label: '-15%' },
        { value: '-10%', label: '-10%' },
        { value: '-25%', label: '-25%' },
        { value: '-30%', label: '-30%' },
        { value: '🔥 Гаряча пропозиція', label: '🔥 Гаряча пропозиція' }
      ],
      tags: [
        '🔥 Гаряче', '💯 Знижка', '🎁 Спецпропозиція',
        '✈️ Швидко', '🏨 Готель', '🍹 All Inclusive'
      ]
    }
  };

  // ========== ПОЧАТКОВІ ДАНІ ДЛЯ ТУРІВ (12 карток) ==========
  const initialToursData = [
    {
      id: 1,
      title: 'Таїланд: Пхукет & Пхі-Пхі',
      price: '39 900 грн',
      duration: '10 ночей',
      groupSize: '25 осіб',
      accommodation: 'Готель 4*',
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
      groupSize: '30 осіб',
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
      groupSize: '15 осіб',
      accommodation: 'Кемп',
      badge: '⛰️ Гірський',
      category: 'mountain',
      image: 'styles/img/tours/tour3.jpg',
      meta: '12 днів • Trekking',
      departureDates: ['20.03.2026', '03.04.2026', '17.04.2026'],
      chips: ['Гімалаї', 'Буддизм', 'Базовий табір'],
      description: 'Треккінг до Евересту.'
    },
    {
      id: 4,
      title: 'Мальдіви: райські атоли',
      price: '67 800 грн',
      duration: '7 ночей',
      groupSize: '20 осіб',
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
      groupSize: '28 осіб',
      accommodation: 'Готель 3-4*',
      badge: '🏛️ Екскурсійний',
      category: 'excursion',
      image: 'styles/img/tours/tour5.jpg',
      meta: '6 днів • сніданки',
      departureDates: ['12.04.2026', '26.04.2026', '10.05.2026'],
      chips: ['Ейфелева вежа', 'Замки', 'Вина'],
      description: 'Романтична Франція.'
    },
    {
      id: 6,
      title: 'Швейцарія: Альпи та озера',
      price: '52 300 грн',
      duration: '7 ночей',
      groupSize: '22 осіб',
      accommodation: 'Гірський готель',
      badge: '⛰️ Гірський',
      category: 'mountain',
      image: 'styles/img/tours/tour6.jpg',
      meta: '7 днів • напівпансіон',
      departureDates: ['08.03.2026', '22.03.2026', '05.04.2026'],
      chips: ['Маттергорн', 'Женевське озеро', 'Сири'],
      description: 'Гірські шедеври Швейцарії.'
    },
    {
      id: 7,
      title: 'Єгипет: Хургада, піраміди',
      price: '24 500 грн',
      duration: '10 ночей',
      groupSize: '30 осіб',
      accommodation: 'Готель 4*',
      badge: '🏖️ Пляжний',
      category: 'beach',
      image: 'styles/img/tours/tour7.jpg',
      meta: '10 днів • All Inclusive',
      departureDates: ['25.05.2026', '09.06.2026', '23.06.2026'],
      chips: ['Червоне море', 'Сфінкс', 'Дайвінг'],
      description: 'Поєднання пляжного відпочинку з екскурсіями.'
    },
    {
      id: 8,
      title: 'Греція: Афіни, Метеори, Салоніки',
      price: '26 800 грн',
      duration: '7 ночей',
      groupSize: '25 осіб',
      accommodation: 'Готель 3-4*',
      badge: '🏛️ Екскурсійний',
      category: 'excursion',
      image: 'styles/img/tours/tour8.jpg',
      meta: '7 днів • сніданки',
      departureDates: ['15.06.2026', '29.06.2026', '13.07.2026'],
      chips: ['Акрополь', 'Монастирі', 'Олімп'],
      description: 'Класична Греція.'
    },
    {
      id: 9,
      title: 'Перу: Мачу-Пікчу та Анди',
      price: '58 900 грн',
      duration: '9 ночей',
      groupSize: '16 осіб',
      accommodation: 'Еко-готель',
      badge: '⛰️ Гірський',
      category: 'mountain',
      image: 'styles/img/tours/tour9.jpg',
      meta: '9 днів • експедиція',
      departureDates: ['04.04.2026', '18.04.2026', '02.05.2026'],
      chips: ['Інки', 'Амазонка', 'Куско'],
      description: 'Експедиція до стародавнього міста інків.'
    },
    {
      id: 10,
      title: 'Балі: храми та серфінг',
      price: '44 200 грн',
      duration: '11 ночей',
      groupSize: '20 осіб',
      accommodation: 'Готель 4*',
      badge: '🏖️ Пляжний',
      category: 'beach',
      image: 'styles/img/tours/tour10.jpg',
      meta: '11 днів • All Inclusive',
      departureDates: ['10.06.2026', '24.06.2026', '07.07.2026'],
      chips: ['Вулкани', 'Ритуали', 'Чайні плантації'],
      description: 'Духовна Балі з храмами та серфінгом.'
    },
    {
      id: 11,
      title: 'Ісландія: вулкани та льодовики',
      price: '62 300 грн',
      duration: '8 ночей',
      groupSize: '14 осіб',
      accommodation: 'Готель 3-4*',
      badge: '⛰️ Гірський',
      category: 'mountain',
      image: 'styles/img/tours/tour11.jpg',
      meta: '8 днів • пригоди',
      departureDates: ['20.05.2026', '04.06.2026', '18.06.2026'],
      chips: ['Гейзери', 'Північне сяйво', 'Чорні пляжі'],
      description: 'Льодовики, гейзери та північне сяйво.'
    },
    {
      id: 12,
      title: 'Японія: Токіо, Кіото, Осака',
      price: '72 500 грн',
      duration: '10 ночей',
      groupSize: '22 осіб',
      accommodation: 'Готель 4*',
      badge: '🏛️ Екскурсійний',
      category: 'excursion',
      image: 'styles/img/tours/tour12.jpg',
      meta: '10 днів • сніданки',
      departureDates: ['12.06.2026', '26.06.2026', '09.07.2026'],
      chips: ['Фудзі', 'Храми', 'Суші'],
      description: 'Модерна та традиційна Японія.'
    }
  ];

  // ========== ПОЧАТКОВІ ДАНІ ДЛЯ КРУЇЗІВ (12 карток) ==========
  const initialCruisesData = [
    {
      id: 1,
      title: 'Середземне море',
      price: '42 500 грн',
      duration: '7 ночей',
      groupSize: '200 осіб',
      accommodation: 'Лайнер класу люкс',
      badge: '☀️ Теплі води',
      category: 'warm',
      image: 'styles/img/cruise/cruise1.jpg',
      meta: '7 ночей',
      departureDates: ['15.03.2026', '22.03.2026', '05.04.2026'],
      chips: ['Італія', 'Греція', 'Іспанія'],
      description: 'Чарівний круїз Середземним морем.'
    },
    {
      id: 2,
      title: 'Карибські острови',
      price: '67 800 грн',
      duration: '10 ночей',
      groupSize: '250 осіб',
      accommodation: 'Лайнер з балконами',
      badge: '☀️ Теплі води',
      category: 'warm',
      image: 'styles/img/cruise/cruise2.jpg',
      meta: '10 ночей',
      departureDates: ['10.04.2026', '24.04.2026', '08.05.2026'],
      chips: ['Багами', 'Ямайка', 'Дайвінг'],
      description: 'Райський круїз Карибами.'
    },
    {
      id: 3,
      title: 'Норвезькі фіорди',
      price: '53 200 грн',
      duration: '8 ночей',
      groupSize: '180 осіб',
      accommodation: 'Експедиційний лайнер',
      badge: '❄️ Холодні води',
      category: 'cold',
      image: 'styles/img/cruise/cruise3.jpg',
      meta: '8 ночей',
      departureDates: ['20.03.2026', '03.04.2026', '17.04.2026'],
      chips: ['Берген', 'Гейрангер', 'Північне сяйво'],
      description: 'Неймовірний круїз норвезькими фіордами.'
    },
    {
      id: 4,
      title: 'Аляска',
      price: '61 500 грн',
      duration: '9 ночей',
      groupSize: '220 осіб',
      accommodation: 'Лайнер преміум-класу',
      badge: '❄️ Холодні води',
      category: 'cold',
      image: 'styles/img/cruise/cruise4.jpg',
      meta: '9 ночей',
      departureDates: ['05.05.2026', '19.05.2026', '02.06.2026'],
      chips: ['Джуно', 'Сьюард', 'Льодовики'],
      description: 'Круїз до найбільшого штату США.'
    },
    {
      id: 5,
      title: 'Грецькі острови',
      price: '38 900 грн',
      duration: '6 ночей',
      groupSize: '150 осіб',
      accommodation: 'Комфортабельний лайнер',
      badge: '☀️ Теплі води',
      category: 'warm',
      image: 'styles/img/cruise/cruise5.jpg',
      meta: '6 ночей',
      departureDates: ['12.04.2026', '26.04.2026', '10.05.2026'],
      chips: ['Санторіні', 'Міконос', 'Кріт'],
      description: 'Знамениті грецькі острови.'
    },
    {
      id: 6,
      title: 'Дунай',
      price: '29 800 грн',
      duration: '7 ночей',
      groupSize: '120 осіб',
      accommodation: 'Річковий лайнер',
      badge: '🌊 Помірні води',
      category: 'temperate',
      image: 'styles/img/cruise/cruise6.jpg',
      meta: '7 ночей',
      departureDates: ['08.03.2026', '22.03.2026', '05.04.2026'],
      chips: ['Відень', 'Будапешт', 'Братислава'],
      description: 'Річковий круїз Дунаєм.'
    },
    {
      id: 7,
      title: 'Аравія',
      price: '73 200 грн',
      duration: '8 ночей',
      groupSize: '200 осіб',
      accommodation: 'Лайнер класу люкс',
      badge: '☀️ Теплі води',
      category: 'warm',
      image: 'styles/img/cruise/cruise7.jpg',
      meta: '8 ночей',
      departureDates: ['25.05.2026', '09.06.2026', '23.06.2026'],
      chips: ['Дубай', 'Оман', 'Катар'],
      description: 'Розкішний круїз узбережжям Аравії.'
    },
    {
      id: 8,
      title: 'Андаманське море',
      price: '33 500 грн',
      duration: '5 ночей',
      groupSize: '160 осіб',
      accommodation: 'Лайнер з відкритими палубами',
      badge: '☀️ Теплі води',
      category: 'warm',
      image: 'styles/img/cruise/cruise8.jpg',
      meta: '5 ночей',
      departureDates: ['15.06.2026', '29.06.2026', '13.07.2026'],
      chips: ['Пхукет', 'Пхі-Пхі', 'Краби'],
      description: 'Екзотичний круїз Таїландом.'
    },
    {
      id: 9,
      title: 'Японське море',
      price: '89 900 грн',
      duration: '10 ночей',
      groupSize: '180 осіб',
      accommodation: 'Лайнер преміум-класу',
      badge: '🌊 Помірні води',
      category: 'temperate',
      image: 'styles/img/cruise/cruise9.jpg',
      meta: '10 ночей',
      departureDates: ['04.04.2026', '18.04.2026', '02.05.2026'],
      chips: ['Токіо', 'Осака', 'Хоккайдо'],
      description: 'Неймовірний круїз Японією.'
    },
    {
      id: 10,
      title: 'Ісландія',
      price: '65 200 грн',
      duration: '7 ночей',
      groupSize: '140 осіб',
      accommodation: 'Експедиційний лайнер',
      badge: '❄️ Холодні води',
      category: 'cold',
      image: 'styles/img/cruise/cruise10.jpg',
      meta: '7 ночей',
      departureDates: ['10.06.2026', '24.06.2026', '07.07.2026'],
      chips: ['Рейк\'явік', 'Гейзери', 'Водоспади'],
      description: 'Круїз до країни льодовиків та вулканів.'
    },
    {
      id: 11,
      title: 'Чорне море',
      price: '18 500 грн',
      duration: '5 ночей',
      groupSize: '200 осіб',
      accommodation: 'Комфортабельний лайнер',
      badge: '🌊 Помірні води',
      category: 'temperate',
      image: 'styles/img/cruise/cruise11.jpg',
      meta: '5 ночей',
      departureDates: ['20.05.2026', '04.06.2026', '18.06.2026'],
      chips: ['Одеса', 'Сочі', 'Болгарія'],
      description: 'Чорноморський круїз.'
    },
    {
      id: 12,
      title: 'Балтійське море',
      price: '41 200 грн',
      duration: '8 ночей',
      groupSize: '210 осіб',
      accommodation: 'Лайнер з балконами',
      badge: '🌊 Помірні води',
      category: 'temperate',
      image: 'styles/img/cruise/cruise12.jpg',
      meta: '8 ночей',
      departureDates: ['12.06.2026', '26.06.2026', '09.07.2026'],
      chips: ['Стокгольм', 'Гельсінкі', 'Санкт-Петербург'],
      description: 'Круїз Балтійським морем.'
    }
  ];

  // ========== ПОЧАТКОВІ ДАНІ ДЛЯ ОСТРОВІВ (12 карток) ==========
  const initialIslandsData = [
    {
      id: 1,
      title: 'Мальдіви',
      price: '67 800 грн',
      duration: '7 ночей',
      groupSize: '10 осіб',
      accommodation: 'Вілли над водою 5*',
      badge: '🏝️ Тропічний',
      category: 'tropical',
      image: 'styles/img/island/island1.jpg',
      meta: '7 ночей',
      departureDates: ['05.03.2026', '12.03.2026', '19.03.2026'],
      chips: ['Вілли', 'Дайвінг', 'SPA'],
      description: 'Райські острови в Індійському океані.'
    },
    {
      id: 2,
      title: 'Ісландія',
      price: '62 300 грн',
      duration: '8 днів',
      groupSize: '15 осіб',
      accommodation: 'Готелі та котеджі',
      badge: '🌋 Вулканічний',
      category: 'volcanic',
      image: 'styles/img/island/island2.jpg',
      meta: '8 днів',
      departureDates: ['10.03.2026', '17.03.2026', '24.03.2026'],
      chips: ['Гейзери', 'Водоспади', 'Чорні пляжі'],
      description: 'Країна льодовиків та вулканів.'
    },
    {
      id: 3,
      title: 'Бора-Бора',
      price: '59 960 грн',
      duration: '7 ночей',
      groupSize: '8 осіб',
      accommodation: 'Бунгало над водою',
      badge: '✨ Екзотичний',
      category: 'exotic',
      image: 'styles/img/island/island3.jpg',
      meta: '7 ночей',
      departureDates: ['15.03.2026', '22.03.2026', '29.03.2026'],
      chips: ['Лагуна', 'Рифи', 'Бунгало'],
      description: 'Найкрасивіша лагуна світу.'
    },
    {
      id: 4,
      title: 'Сейшели',
      price: '43 960 грн',
      duration: '7 ночей',
      groupSize: '12 осіб',
      accommodation: 'Готелі на березі',
      badge: '🏝️ Тропічний',
      category: 'tropical',
      image: 'styles/img/island/island4.jpg',
      meta: '7 ночей',
      departureDates: ['20.03.2026', '27.03.2026', '03.04.2026'],
      chips: ['Гранітні пляжі', 'Черепахи', 'Заповідники'],
      description: 'Гранітні острови з унікальною природою.'
    },
    {
      id: 5,
      title: 'Гаваї',
      price: '72 500 грн',
      duration: '10 днів',
      groupSize: '20 осіб',
      accommodation: 'Готелі на океані',
      badge: '🌋 Вулканічний',
      category: 'volcanic',
      image: 'styles/img/island/island5.jpg',
      meta: '10 днів',
      departureDates: ['25.03.2026', '01.04.2026', '08.04.2026'],
      chips: ['Вулкани', 'Серфінг', 'Квіти'],
      description: 'Американський тропічний рай.'
    },
    {
      id: 6,
      title: 'Таїті',
      price: '55 960 грн',
      duration: '6 ночей',
      groupSize: '10 осіб',
      accommodation: 'Бунгало на березі',
      badge: '✨ Екзотичний',
      category: 'exotic',
      image: 'styles/img/island/island6.jpg',
      meta: '6 ночей',
      departureDates: ['30.03.2026', '06.04.2026', '13.04.2026'],
      chips: ['Чорні піски', 'Водоспади', 'Полінезія'],
      description: 'Французька Полінезія.'
    },
    {
      id: 7,
      title: 'Фіджі',
      price: '64 200 грн',
      duration: '8 ночей',
      groupSize: '14 осіб',
      accommodation: 'Курорти 5*',
      badge: '🏝️ Тропічний',
      category: 'tropical',
      image: 'styles/img/island/island7.jpg',
      meta: '8 ночей',
      departureDates: ['05.04.2026', '12.04.2026', '19.04.2026'],
      chips: ['Коралові сади', 'Серфінг', 'Аборигени'],
      description: 'Тихоокеанський рай.'
    },
    {
      id: 8,
      title: 'Шрі-Ланка',
      price: '38 500 грн',
      duration: '9 ночей',
      groupSize: '16 осіб',
      accommodation: 'Готелі та вілли',
      badge: '✨ Екзотичний',
      category: 'exotic',
      image: 'styles/img/island/island8.jpg',
      meta: '9 ночей',
      departureDates: ['10.04.2026', '17.04.2026', '24.04.2026'],
      chips: ['Чайні плантації', 'Слони', 'Храми'],
      description: 'Острів сліз.'
    },
    {
      id: 9,
      title: 'Маврикій',
      price: '59 800 грн',
      duration: '7 ночей',
      groupSize: '12 осіб',
      accommodation: 'Преміум-готелі',
      badge: '🏝️ Тропічний',
      category: 'tropical',
      image: 'styles/img/island/island9.jpg',
      meta: '7 ночей',
      departureDates: ['15.04.2026', '22.04.2026', '29.04.2026'],
      chips: ['Водоспади', 'Кольорові піски', 'Лагуни'],
      description: 'Острів в Індійському океані.'
    },
    {
      id: 10,
      title: 'Куба',
      price: '41 200 грн',
      duration: '8 ночей',
      groupSize: '18 осіб',
      accommodation: 'Готелі 4*',
      badge: '✨ Екзотичний',
      category: 'exotic',
      image: 'styles/img/island/island10.jpg',
      meta: '8 ночей',
      departureDates: ['20.04.2026', '27.04.2026', '04.05.2026'],
      chips: ['Гавана', 'Сігари', 'Ром'],
      description: 'Острів свободи.'
    },
    {
      id: 11,
      title: 'Занзібар',
      price: '36 900 грн',
      duration: '7 ночей',
      groupSize: '15 осіб',
      accommodation: 'Готелі на березі',
      badge: '🏝️ Тропічний',
      category: 'tropical',
      image: 'styles/img/island/island11.jpg',
      meta: '7 ночей',
      departureDates: ['25.04.2026', '02.05.2026', '09.05.2026'],
      chips: ['Кам\'яне місто', 'Спеції', 'Черепахи'],
      description: 'Танзанійський острів спецій.'
    },
    {
      id: 12,
      title: 'Сардінія',
      price: '48 700 грн',
      duration: '7 ночей',
      groupSize: '20 осіб',
      accommodation: 'Готелі та агротуризми',
      badge: '✨ Екзотичний',
      category: 'exotic',
      image: 'styles/img/island/island12.jpg',
      meta: '7 ночей',
      departureDates: ['30.04.2026', '07.05.2026', '14.05.2026'],
      chips: ['Білі пляжі', 'Нураги', 'Італійська кухня'],
      description: 'Італійський острів у Середземному морі.'
    }
  ];

  // ========== ПОЧАТКОВІ ДАНІ ДЛЯ ГАРЯЧИХ ПУТІВОК (12 карток) ==========
  const initialHotData = [
    {
      id: 1,
      title: 'Єгипет All Inclusive',
      price: '23 960 грн',
      duration: '7 ночей',
      groupSize: '40 осіб',
      accommodation: 'Готель 5*',
      badge: '-20%',
      category: 'beach',
      image: 'styles/img/index/bar1.jpg',
      meta: '7 ночей',
      departureDates: ['01.11.2026', '08.11.2026', '15.11.2026'],
      chips: ['Піраміди', 'Червоне море', 'All Inclusive'],
      description: 'Гаряча пропозиція Єгипту.'
    },
    {
      id: 2,
      title: 'Санторіні',
      price: '19 160 грн',
      duration: '5 ночей',
      groupSize: '25 осіб',
      accommodation: 'Готель 4*',
      badge: '-15%',
      category: 'excursion',
      image: 'styles/img/index/bar2.jpg',
      meta: '5 ночей',
      departureDates: ['15.05.2026', '22.05.2026', '29.05.2026'],
      chips: ['Закати', 'Білі будинки', 'Романтика'],
      description: 'Неймовірні заходи сонця.'
    },
    {
      id: 3,
      title: 'Марокко',
      price: '15 960 грн',
      duration: '6 ночей',
      groupSize: '20 осіб',
      accommodation: 'Готелі 4*',
      badge: '-18%',
      category: 'excursion',
      image: 'styles/img/index/bar3.jpg',
      meta: '6 ночей',
      departureDates: ['10.09.2026', '17.09.2026', '24.09.2026'],
      chips: ['Сахара', 'Марракеш', 'Базари'],
      description: 'Загадкові базари та пустеля.'
    },
    {
      id: 4,
      title: 'Мальдіви',
      price: '51 960 грн',
      duration: '7 ночей',
      groupSize: '15 осіб',
      accommodation: 'Вілла над водою',
      badge: '-12%',
      category: 'tropical',
      image: 'styles/img/index/bar4.jpg',
      meta: '7 ночей',
      departureDates: ['05.12.2026', '12.12.2026', '19.12.2026'],
      chips: ['Вілли над водою', 'Дайвінг', 'SPA'],
      description: 'Райські острови.'
    },
    {
      id: 5,
      title: 'Сейшели',
      price: '43 960 грн',
      duration: '7 ночей',
      groupSize: '18 осіб',
      accommodation: 'Готель 5*',
      badge: '-18%',
      category: 'tropical',
      image: 'styles/img/index/bar5.jpg',
      meta: '7 ночей',
      departureDates: ['18.07.2026', '25.07.2026', '01.08.2026'],
      chips: ['Гранітні пляжі', 'Снорклінг', 'Праслін'],
      description: 'Гранітні скелі.'
    },
    {
      id: 6,
      title: 'Ісландія',
      price: '11 960 грн',
      duration: '5 ночей',
      groupSize: '16 осіб',
      accommodation: 'Готелі + котеджі',
      badge: '-20%',
      category: 'mountain',
      image: 'styles/img/index/bar6.jpg',
      meta: '5 ночей',
      departureDates: ['20.10.2026', '27.10.2026', '03.11.2026'],
      chips: ['Вулкани', 'Гейзери', 'Льодовики'],
      description: 'Активний відпочинок.'
    },
    {
      id: 7,
      title: 'Альпи',
      price: '27 960 грн',
      duration: '8 ночей',
      groupSize: '30 осіб',
      accommodation: 'Шале 4*',
      badge: '-25%',
      category: 'mountain',
      image: 'styles/img/index/bar7.jpg',
      meta: '8 ночей',
      departureDates: ['10.01.2027', '17.01.2027', '24.01.2027'],
      chips: ['Гірськолижні курорти', 'SPA', 'Фонду'],
      description: 'Гірськолижні курорти.'
    },
    {
      id: 8,
      title: 'Балі',
      price: '35 960 грн',
      duration: '7 ночей',
      groupSize: '25 осіб',
      accommodation: 'Готель 4*',
      badge: '-15%',
      category: 'tropical',
      image: 'styles/img/island/island1.jpg',
      meta: '7 ночей',
      departureDates: ['15.06.2026', '22.06.2026', '29.06.2026'],
      chips: ['Храми', 'Серфінг', 'Вулкани'],
      description: 'Райський острів.'
    },
    {
      id: 9,
      title: 'Крит',
      price: '19 960 грн',
      duration: '5 ночей',
      groupSize: '25 осіб',
      accommodation: 'Готель 3-4*',
      badge: '-15%',
      category: 'beach',
      image: 'styles/img/tours/tour2.jpg',
      meta: '5 ночей',
      departureDates: ['10.07.2026', '17.07.2026', '24.07.2026'],
      chips: ['Пляжі', 'Античність', 'Таверни'],
      description: 'Легендарний острів.'
    },
    {
      id: 10,
      title: 'Бора-Бора',
      price: '59 960 грн',
      duration: '7 ночей',
      groupSize: '22 осіб',
      accommodation: 'Бунгало 5*',
      badge: '-20%',
      category: 'tropical',
      image: 'styles/img/island/island3.jpg',
      meta: '7 ночей',
      departureDates: ['05.08.2026', '12.08.2026', '19.08.2026'],
      chips: ['Бунгало', 'Каяки', 'Снорклінг'],
      description: 'Екзотична Бора-Бора.'
    },
    {
      id: 11,
      title: 'Палаван',
      price: '31 960 грн',
      duration: '6 ночей',
      groupSize: '15 осіб',
      accommodation: 'Еко-готель',
      badge: '-15%',
      category: 'tropical',
      image: 'styles/img/island/island7.jpg',
      meta: '6 ночей',
      departureDates: ['12.09.2026', '19.09.2026', '26.09.2026'],
      chips: ['Лагуни', 'Печери', 'Острівці'],
      description: 'Найкрасивіший острів світу.'
    },
    {
      id: 12,
      title: 'Самуї',
      price: '27 960 грн',
      duration: '7 ночей',
      groupSize: '25 осіб',
      accommodation: 'Готель 4*',
      badge: '-10%',
      category: 'beach',
      image: 'styles/img/island/island6.jpg',
      meta: '7 ночей',
      departureDates: ['08.10.2026', '15.10.2026', '22.10.2026'],
      chips: ['Пальми', 'Фрукти', 'Храми'],
      description: 'Популярний курорт.'
    }
  ];

  // Об'єкт з усіма початковими даними
  const initialDemoData = {
    tour: initialToursData,
    cruise: initialCruisesData,
    island: initialIslandsData,
    hot: initialHotData
  };

  // Перевірка авторизації та прав адміністратора
  async function checkAdminAccess() {
    const token = window.auth?.getToken();
    if (!token) {
      window.location.href = 'login.html';
      return false;
    }

    try {
      const userData = await window.auth.getUserData();
      console.log('👤 Дані користувача в admin.js:', userData);
      
      // ТИМЧАСОВО: пропускаємо всіх для тесту
      // if (!userData || userData.role !== 'admin') {
      //   showToast('❌ Доступ заборонено. Потрібні права адміністратора', 'error');
      //   setTimeout(() => {
      //     window.location.href = 'index.html';
      //   }, 2000);
      //   return false;
      // }
      return true;
    } catch (error) {
      console.error('Помилка перевірки прав:', error);
      showToast('⚠️ Демо-режим: сервер не відповідає', 'info');
      return true;
    }
  }

  // Показ повідомлень
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

  // Оновлення селектів відповідно до типу
  function updateSelectsForType(type) {
    const config = typeConfig[type] || typeConfig.tour;
    currentType = type;

    const categorySelect = qs('#category');
    if (categorySelect) {
      categorySelect.innerHTML = '<option value="">Оберіть категорію</option>' +
        config.categories.map(c => `<option value="${c.value}">${c.label}</option>`).join('');
    }

    const badgeSelect = qs('#badge');
    if (badgeSelect) {
      badgeSelect.innerHTML = '<option value="">Оберіть бейдж</option>' +
        config.badges.map(b => `<option value="${b.value}">${b.label}</option>`).join('');
    }

    const tagsSelect = qs('#tags-select');
    if (tagsSelect) {
      tagsSelect.innerHTML = '<option value="">Оберіть тег</option>' +
        config.tags.map(t => `<option value="${t}">${t}</option>`).join('');
    }
  }

   // Завантаження даних за типом
  async function loadItems(type) {
    console.log(`🔍 Завантаження даних для типу: ${type}`);
    
    try {
      const token = window.auth.getToken();
      const response = await fetch(`/api/admin/${type}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.success && data.items && data.items.length > 0) {
        console.log(`✅ Отримано ${data.items.length} карток з сервера для ${type}`);
        // Зберігаємо в демо-дані
        demoData[type] = data.items;
        renderItems(type, data.items);
      } else {
        console.log(`📋 Використовуємо демо-дані для ${type}: ${initialDemoData[type]?.length} карток`);
        // Зберігаємо в демо-дані
        demoData[type] = initialDemoData[type] || [];
        renderItems(type, demoData[type]);
        showToast(`ℹ️ Завантажено ${demoData[type].length} ${type}ів (демо-режим)`, 'info');
      }
    } catch (error) {
      console.error('❌ Помилка завантаження:', error);
      console.log(`📋 Сервер не відповідає, використовуємо демо-дані для ${type}: ${initialDemoData[type]?.length} карток`);
      // Зберігаємо в демо-дані
      demoData[type] = initialDemoData[type] || [];
      renderItems(type, demoData[type]);
      showToast(`ℹ️ Завантажено ${demoData[type].length} ${type}ів (демо-режим)`, 'info');
    }
  }

  // Відображення карток - ВИПРАВЛЕНО!
  function renderItems(type, items) {
    console.log(`🔄 renderItems викликано для типу: ${type}, отримано елементів:`, items?.length);
    
    // Правильні ID для кожної категорії
    let gridId;
    switch(type) {
      case 'tour':
        gridId = 'tours-grid';
        break;
      case 'cruise':
        gridId = 'cruises-grid';
        break;
      case 'island':
        gridId = 'islands-grid';
        break;
      case 'hot':
        gridId = 'hot-grid';
        break;
      default:
        gridId = `${type}-grid`;
    }
    
    const grid = qs(`#${gridId}`);
    if (!grid) {
      console.error(`❌ Елемент з ID #${gridId} не знайдено!`);
      return;
    }

    const typeName = typeConfig[type]?.name || type;
    const typeNamePlural = type === 'tour' ? 'турів' : 
                          type === 'cruise' ? 'круїзів' : 
                          type === 'island' ? 'островів' : 'путівок';

    console.log(`📦 Відображаємо ${items.length} карток для ${typeNamePlural} в елементі #${gridId}`);

    // Картка для додавання
    let html = `<div class="add-card" onclick="openAddModal('${type}')" style="cursor: pointer; border: 2px dashed #0f4c81; background: #f0f7ff; border-radius: 16px; min-height: 320px; display: flex; align-items: center; justify-content: center;">
      <div class="add-card-content" style="display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 2rem;">
        <span class="add-icon" style="font-size: 4rem; line-height: 1; color: #0f4c81;">➕</span>
        <span class="add-text" style="font-size: 1.2rem; font-weight: 600; color: #0f4c81; margin-top: 1rem;">Створити новий ${typeName}</span>
        <span style="font-size: 0.9rem; color: #64748b; margin-top: 0.5rem;">Натисніть, щоб додати</span>
      </div>
    </div>`;

    if (items && items.length > 0) {
      html += items.map(item => {
        const chips = item.chips || [];
        const price = item.price || '0 грн';
        let imagePath = item.image || 'images/placeholder.jpg';
        
        return `
          <div class="admin-card" data-id="${item.id}" style="background: #f8fafc; border-radius: 16px; overflow: hidden; border: 1px solid #e2e8f0;">
            <div class="admin-card-image" style="background-image: url('${imagePath}'); background-size: cover; background-position: center; height: 150px; position: relative;">
              <span class="admin-card-badge" style="position: absolute; top: 10px; left: 10px; background: #0f4c81; color: white; padding: 0.2rem 0.8rem; border-radius: 40px; font-size: 0.8rem;">${item.badge || typeName}</span>
            </div>
            <div class="admin-card-body" style="padding: 1rem;">
              <h3 class="admin-card-title" style="font-weight: 700; margin-bottom: 0.5rem; color: #0f4c81;">${item.title}</h3>
              <div class="admin-card-price" style="font-weight: 700; color: #005e00; margin-bottom: 0.5rem;">${price}</div>
              <div class="admin-card-meta" style="font-size: 0.85rem; color: #64748b; margin-bottom: 0.5rem;">${item.meta || item.duration || ''}</div>
              <div class="admin-card-chips" style="display: flex; flex-wrap: wrap; gap: 0.3rem; margin-bottom: 1rem;">
                ${chips.slice(0, 3).map(chip => `<span class="admin-chip" style="background: #e2e8f0; padding: 0.2rem 0.5rem; border-radius: 40px; font-size: 0.7rem;">${chip}</span>`).join('')}
              </div>
              <div class="admin-card-actions" style="display: flex; gap: 0.5rem; justify-content: flex-end;">
                <button class="btn-outline" onclick="editItem('${type}', ${item.id})" style="padding: 0.5rem 1rem; border: 1px solid #0f4c81; background: transparent; color: #0f4c81; border-radius: 40px; cursor: pointer;">✏️ Редагувати</button>
                <button class="btn-danger" onclick="deleteItem('${type}', ${item.id})" style="padding: 0.5rem 1rem; background: #dc2626; color: white; border: none; border-radius: 40px; cursor: pointer;">🗑️ Видалити</button>
              </div>
            </div>
          </div>
        `;
      }).join('');
    } else {
      html += `<div class="empty-message" style="grid-column: 1 / -1; text-align: center; padding: 3rem; background: #f8fafc; border-radius: 24px; border: 2px dashed #cbd5e1;">
        <p style="font-size: 1.1rem; color: #94a3b8;">Немає ${typeNamePlural}. Натисніть кнопку "Створити", щоб додати перший ${typeName}.</p>
      </div>`;
    }

    grid.innerHTML = html;
    console.log(`✅ Відображено ${items.length} карток для типу ${type} в елементі #${gridId}`);
  }

  // Відкриття модального вікна для додавання
  window.openAddModal = function(type) {
    const modal = qs('#itemModal');
    const form = qs('#itemForm');
    
    qs('#modalTitle').textContent = `➕ Додати новий ${typeConfig[type]?.name || type}`;
    qs('#itemType').value = type;
    qs('#itemId').value = '';
    
    updateSelectsForType(type);
    
    form.reset();
    currentTags = [];
    currentDates = [];
    updateSelectedTagsDisplay();
    updateDatesDisplay();
    
    modal.classList.add('active');
  };

  // Редагування елемента
  window.editItem = async function(type, id) {
    try {
      const token = window.auth.getToken();
      const response = await fetch(`/api/admin/${type}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      let item = null;
      
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          item = data.items.find(i => i.id == id);
        }
      }
      
      if (!item && initialDemoData[type]) {
        item = initialDemoData[type].find(i => i.id == id);
      }
      
      if (item) {
        fillEditForm(type, item);
      } else {
        showToast('Елемент не знайдено', 'error');
      }
    } catch (error) {
      console.error('Помилка:', error);
      const item = initialDemoData[type]?.find(i => i.id == id);
      if (item) {
        fillEditForm(type, item);
      } else {
        showToast('Помилка завантаження даних', 'error');
      }
    }
  };

  // Заповнення форми для редагування
  function fillEditForm(type, item) {
    const modal = qs('#itemModal');
    
    qs('#modalTitle').textContent = `✏️ Редагувати ${typeConfig[type]?.name || type}`;
    qs('#itemType').value = type;
    qs('#itemId').value = item.id;
    
    updateSelectsForType(type);
    
    qs('#title').value = item.title || '';
    
    const priceValue = item.price ? item.price.replace(' грн', '').replace(/\s/g, '') : '';
    qs('#price').value = priceValue;
    
    const durationValue = item.duration ? item.duration.replace(' ночей', '').replace(' днів', '') : '';
    qs('#duration').value = durationValue;
    
    const groupValue = item.groupSize ? item.groupSize.replace(' осіб', '') : '';
    qs('#groupSize').value = groupValue;
    
    const accomValue = item.accommodation ? item.accommodation.replace('Готель ', '').replace('*', '') : '';
    qs('#accommodation').value = accomValue;
    
    qs('#badge').value = item.badge || '';
    qs('#category').value = item.category || '';
    qs('#meta').value = item.meta || '';
    qs('#image').value = item.image || '';
    qs('#description').value = item.description || '';
    
    currentDates = item.departureDates || [];
    updateDatesDisplay();
    
    currentTags = item.chips || [];
    updateSelectedTagsDisplay();
    
    modal.classList.add('active');
  }

  // Оновлення відображення дат
  function updateDatesDisplay() {
    const container = qs('#datesContainer');
    if (!container) return;

    let html = '';
    currentDates.forEach((date, index) => {
      html += `
        <div class="date-input-row" style="display: flex; gap: 10px; margin-bottom: 10px;">
          <input type="text" class="form-input date-input" value="${date}" placeholder="ДД.ММ.РРРР">
          <button type="button" class="btn-outline remove-date" data-index="${index}" style="padding: 0.5rem 1rem;">✕</button>
        </div>
      `;
    });

    html += `
      <div class="date-input-row" style="display: flex; gap: 10px; margin-bottom: 10px;">
        <input type="text" class="form-input date-input" placeholder="ДД.ММ.РРРР">
        <button type="button" class="btn-outline add-date" style="padding: 0.5rem 1rem;">+ Додати дату</button>
      </div>
    `;

    container.innerHTML = html;

    container.querySelectorAll('.add-date').forEach(btn => {
      btn.addEventListener('click', () => {
        const row = btn.closest('.date-input-row');
        const input = row.querySelector('.date-input');
        if (input.value.trim()) {
          currentDates.push(input.value.trim());
          updateDatesDisplay();
        }
      });
    });

    container.querySelectorAll('.remove-date').forEach(btn => {
      btn.addEventListener('click', () => {
        const index = btn.dataset.index;
        if (index !== undefined) {
          currentDates.splice(index, 1);
          updateDatesDisplay();
        }
      });
    });
  }

  // Оновлення відображення вибраних тегів
  function updateSelectedTagsDisplay() {
    const container = qs('#selected-tags');
    if (!container) return;

    if (currentTags.length === 0) {
      container.innerHTML = '';
      return;
    }

    container.innerHTML = currentTags.map((tag, index) => `
      <span class="tag-item" style="background: #0f4c81; color: white; padding: 4px 12px; border-radius: 30px; display: inline-flex; align-items: center; gap: 6px; margin: 2px;">
        ${tag}
        <span class="remove-tag" onclick="removeTag(${index})" style="cursor: pointer; opacity: 0.8;">✕</span>
      </span>
    `).join('');
  }

  // Видалення тегу
  window.removeTag = function(index) {
    currentTags.splice(index, 1);
    updateSelectedTagsDisplay();
  };

  // Додавання тегу
  function addTag(tag) {
    if (tag && !currentTags.includes(tag)) {
      currentTags.push(tag);
      updateSelectedTagsDisplay();
    }
  }

  // Закриття модального вікна
  window.closeModal = function() {
    qs('#itemModal').classList.remove('active');
  };

  // Видалення елемента
  window.deleteItem = async function(type, id) {
    if (!confirm('Ви впевнені, що хочете видалити цей запис?')) return;
    
    try {
      const token = window.auth.getToken();
      const response = await fetch(`/api/admin/${type}/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          showToast('✅ Запис видалено', 'success');
          loadItems(type);
          return;
        }
      }
      
      // Видаляємо з демо-даних
      const index = demoData[type].findIndex(item => item.id == id);
      if (index !== -1) {
        demoData[type].splice(index, 1);
        showToast('✅ Запис видалено (демо-режим)', 'success');
        renderItems(type, demoData[type]);
      }
      
    } catch (error) {
      console.error('❌ Помилка:', error);
      
      // Видаляємо з демо-даних при помилці
      const index = demoData[type].findIndex(item => item.id == id);
      if (index !== -1) {
        demoData[type].splice(index, 1);
        showToast('✅ Запис видалено (демо-режим)', 'success');
        renderItems(type, demoData[type]);
      }
    }
  };

  // Збереження форми
  qs('#itemForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const type = qs('#itemType').value;
    const id = qs('#itemId').value;
    const isEdit = !!id;

    // Додаємо тег з поля вводу, якщо є
    const chipsInput = qs('#chipsInput');
    if (chipsInput.value.trim()) {
      addTag(chipsInput.value.trim());
      chipsInput.value = '';
    }

    // Форматуємо дані
    const price = qs('#price').value;
    const duration = qs('#duration').value;
    const groupSize = qs('#groupSize').value;
    const accommodation = qs('#accommodation').value;

    // Форматуємо тривалість
    let formattedDuration = duration;
    if (duration && !isNaN(duration)) {
      formattedDuration = duration + (type === 'tour' || type === 'island' ? ' ночей' : ' днів');
    }

    // Форматуємо розмір групи
    let formattedGroup = groupSize;
    if (groupSize && !isNaN(groupSize)) {
      formattedGroup = groupSize + ' осіб';
    }

    // Форматуємо проживання
    let formattedAccom = accommodation;
    if (accommodation && !isNaN(accommodation)) {
      formattedAccom = 'Готель ' + accommodation + '*';
    }

    // Збираємо дані
    const formData = {
      id: isEdit ? parseInt(id) : Date.now(), // Генеруємо ID для нових карток
      title: qs('#title').value,
      price: price.toString().includes('грн') ? price : price + ' грн',
      duration: formattedDuration,
      groupSize: formattedGroup,
      accommodation: formattedAccom,
      badge: qs('#badge').value,
      category: qs('#category').value,
      meta: qs('#meta').value,
      image: qs('#image').value || 'images/placeholder.jpg',
      description: qs('#description').value || '',
      departureDates: currentDates,
      chips: currentTags
    };

    // Перевірка обов'язкових полів
    if (!formData.title || !price) {
      showToast('❌ Назва та ціна обов\'язкові', 'error');
      return;
    }

    console.log('📝 Відправляємо дані:', formData);

    try {
      const token = window.auth.getToken();
      const url = isEdit ? `/api/admin/${type}/${id}` : `/api/admin/${type}`;
      const method = isEdit ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });
      
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          showToast(isEdit ? '✅ Запис оновлено' : '✅ Запис додано', 'success');
          closeModal();
          loadItems(type);
          return;
        }
      }
      
      // Якщо сервер не відповідає, працюємо в демо-режимі
      if (!isEdit) {
        // Додаємо нову картку
        demoData[type].push(formData);
        showToast('✅ Картку створено (демо-режим)', 'success');
      } else {
        // Редагуємо існуючу картку
        const index = demoData[type].findIndex(item => item.id == id);
        if (index !== -1) {
          demoData[type][index] = formData;
          showToast('✅ Картку оновлено (демо-режим)', 'success');
        }
      }
      
      closeModal();
      renderItems(type, demoData[type]);
      
    } catch (error) {
      console.error('❌ Помилка:', error);
      
      // Працюємо в демо-режимі при помилці
      if (!isEdit) {
        demoData[type].push(formData);
        showToast('✅ Картку створено (демо-режим)', 'success');
      } else {
        const index = demoData[type].findIndex(item => item.id == id);
        if (index !== -1) {
          demoData[type][index] = formData;
          showToast('✅ Картку оновлено (демо-режим)', 'success');
        }
      }
      
      closeModal();
      renderItems(type, demoData[type]);
    }
  });

  // Завантаження користувачів
  async function loadUsers() {
    try {
      const token = window.auth.getToken();
      const response = await fetch('/api/admin/users', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          renderUsers(data.users);
          return;
        }
      }
      
      renderUsers([
        { id: 1, name: 'Admin', email: 'admintest1@gmail.com', phone: '+380501234567', registered: '01.01.2025', role: 'admin' },
        { id: 2, name: 'Тестовий користувач', email: 'user@test.com', phone: '+380671234567', registered: '15.02.2025', role: 'user' }
      ]);
      
    } catch (error) {
      console.error('Помилка завантаження користувачів:', error);
      renderUsers([
        { id: 1, name: 'Admin', email: 'admintest1@gmail.com', phone: '+380501234567', registered: '01.01.2025', role: 'admin' },
        { id: 2, name: 'Тестовий користувач', email: 'user@test.com', phone: '+380671234567', registered: '15.02.2025', role: 'user' }
      ]);
    }
  }

  // Відображення користувачів
  function renderUsers(users) {
    const grid = qs('#users-grid');
    if (!grid) return;

    if (!users || users.length === 0) {
      grid.innerHTML = '<p class="empty-message">Немає користувачів</p>';
      return;
    }

    grid.innerHTML = `
      <table style="width: 100%; border-collapse: collapse;">
        <thead>
          <tr style="background: #f1f5f9;">
            <th style="padding: 1rem; text-align: left;">ID</th>
            <th style="padding: 1rem; text-align: left;">Ім'я</th>
            <th style="padding: 1rem; text-align: left;">Email</th>
            <th style="padding: 1rem; text-align: left;">Телефон</th>
            <th style="padding: 1rem; text-align: left;">Дата реєстрації</th>
            <th style="padding: 1rem; text-align: left;">Роль</th>
            <th style="padding: 1rem; text-align: left;">Дії</th>
          </tr>
        </thead>
        <tbody>
          ${users.map(user => `
            <tr style="border-bottom: 1px solid #e2e8f0;">
              <td style="padding: 1rem;">${user.id}</td>
              <td style="padding: 1rem;">${user.name}</td>
              <td style="padding: 1rem;">${user.email}</td>
              <td style="padding: 1rem;">${user.phone || '-'}</td>
              <td style="padding: 1rem;">${user.registered}</td>
              <td style="padding: 1rem;">
                <span class="role-badge ${user.role === 'admin' ? 'admin' : ''}" style="background: ${user.role === 'admin' ? '#0f4c81' : '#e2e8f0'}; color: ${user.role === 'admin' ? 'white' : '#334155'}; padding: 0.2rem 0.8rem; border-radius: 40px;">${user.role}</span>
              </td>
              <td style="padding: 1rem;">
                <select class="role-select" onchange="changeUserRole(${user.id}, this.value)" style="padding: 0.3rem; border-radius: 8px; border: 1px solid #cbd5e1;">
                  <option value="user" ${user.role === 'user' ? 'selected' : ''}>Користувач</option>
                  <option value="admin" ${user.role === 'admin' ? 'selected' : ''}>Адмін</option>
                </select>
              </td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    `;
  }

  // Зміна ролі користувача
  window.changeUserRole = async function(userId, newRole) {
    try {
      const token = window.auth.getToken();
      const response = await fetch(`/api/admin/users/${userId}/role`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ role: newRole })
      });
      
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          showToast('✅ Роль оновлено', 'success');
          return;
        }
      }
      
      showToast('✅ Роль оновлено (демо-режим)', 'success');
      
    } catch (error) {
      console.error('Помилка:', error);
      showToast('✅ Роль оновлено (демо-режим)', 'success');
    }
  };

  // Завантаження всіх бронювань
  async function loadAllBookings() {
    try {
      const token = window.auth.getToken();
      const response = await fetch('/api/admin/bookings/all', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          renderBookings(data.bookings);
          return;
        }
      }
      
      renderBookings([
        { id: 1, user_name: 'Тестовий користувач', user_email: 'user@test.com', title: 'Таїланд: Пхукет', price: '39 900 грн', bookingdate: '15.03.2026', category: 'beach' },
        { id: 2, user_name: 'Admin', user_email: 'admintest1@gmail.com', title: 'Мальдіви', price: '67 800 грн', bookingdate: '05.03.2026', category: 'tropical' }
      ]);
      
    } catch (error) {
      console.error('Помилка завантаження бронювань:', error);
      renderBookings([
        { id: 1, user_name: 'Тестовий користувач', user_email: 'user@test.com', title: 'Таїланд: Пхукет', price: '39 900 грн', bookingdate: '15.03.2026', category: 'beach' },
        { id: 2, user_name: 'Admin', user_email: 'admintest1@gmail.com', title: 'Мальдіви', price: '67 800 грн', bookingdate: '05.03.2026', category: 'tropical' }
      ]);
    }
  }

  // Відображення бронювань
  function renderBookings(bookings) {
    const grid = qs('#bookings-grid');
    if (!grid) return;

    if (!bookings || bookings.length === 0) {
      grid.innerHTML = '<p class="empty-message">Немає бронювань</p>';
      return;
    }

    grid.innerHTML = `
      <table style="width: 100%; border-collapse: collapse;">
        <thead>
          <tr style="background: #f1f5f9;">
            <th style="padding: 1rem; text-align: left;">ID</th>
            <th style="padding: 1rem; text-align: left;">Користувач</th>
            <th style="padding: 1rem; text-align: left;">Email</th>
            <th style="padding: 1rem; text-align: left;">Тур</th>
            <th style="padding: 1rem; text-align: left;">Ціна</th>
            <th style="padding: 1rem; text-align: left;">Дата заїзду</th>
            <th style="padding: 1rem; text-align: left;">Категорія</th>
          </tr>
        </thead>
        <tbody>
          ${bookings.map(booking => `
            <tr style="border-bottom: 1px solid #e2e8f0;">
              <td style="padding: 1rem;">${booking.id}</td>
              <td style="padding: 1rem;">${booking.user_name}</td>
              <td style="padding: 1rem;">${booking.user_email}</td>
              <td style="padding: 1rem;">${booking.title}</td>
              <td style="padding: 1rem;">${booking.price || '-'}</td>
              <td style="padding: 1rem;">${booking.bookingdate || '-'}</td>
              <td style="padding: 1rem;">${booking.category || '-'}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    `;
  }

  // Ініціалізація вкладок
  function initTabs() {
    const tabs = qsa('.admin-tab');
    const contents = qsa('.tab-content');

    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        const tabName = tab.dataset.tab;
        
        tabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        
        contents.forEach(c => c.classList.remove('active'));
        qs(`#${tabName}-tab`).classList.add('active');
        
        if (['tours', 'cruises', 'islands', 'hot'].includes(tabName)) {
          const type = tabName === 'tours' ? 'tour' : 
                      tabName === 'cruises' ? 'cruise' :
                      tabName === 'islands' ? 'island' : 'hot';
          loadItems(type);
        } else if (tabName === 'users') {
          loadUsers();
        } else if (tabName === 'bookings') {
          loadAllBookings();
        }
      });
    });
  }

  // Додаємо обробники
  function setupEventListeners() {
    const tagsSelect = qs('#tags-select');
    if (tagsSelect) {
      tagsSelect.addEventListener('change', () => {
        if (tagsSelect.value) {
          addTag(tagsSelect.value);
          tagsSelect.value = '';
        }
      });
    }

    const addTagBtn = qs('#addTagBtn');
    if (addTagBtn) {
      addTagBtn.addEventListener('click', () => {
        const input = qs('#chipsInput');
        if (input.value.trim()) {
          addTag(input.value.trim());
          input.value = '';
        }
      });
    }

    const chipsInput = qs('#chipsInput');
    if (chipsInput) {
      chipsInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          if (chipsInput.value.trim()) {
            addTag(chipsInput.value.trim());
            chipsInput.value = '';
          }
        }
      });
    }

    const imageFile = qs('#imageFile');
    if (imageFile) {
      imageFile.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = (event) => {
            qs('#image').value = event.target.result;
            const preview = qs('#imagePreview');
            preview.style.display = 'block';
            preview.querySelector('img').src = event.target.result;
          };
          reader.readAsDataURL(file);
        }
      });
    }
  }

  // Ініціалізація
  window.addEventListener('DOMContentLoaded', async () => {
    console.log('🚀 admin.js завантажено');
    console.log('🔍 Елементи сторінки:');
    console.log('- tours-grid:', document.getElementById('tours-grid'));
    console.log('- cruises-grid:', document.getElementById('cruises-grid'));
    console.log('- islands-grid:', document.getElementById('islands-grid'));
    console.log('- hot-grid:', document.getElementById('hot-grid'));

    const hasAccess = await checkAdminAccess();
    if (!hasAccess) return;

    qs('#loading-spinner').style.display = 'none';
    qs('#app-content').style.display = 'block';

    initTabs();
    setupEventListeners();
    
    loadItems('tour');
  });
})();