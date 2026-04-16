import {
  LazyLoad,
  Popup,
  FormValidator,
  DropMenu,
  ChangeLanguage,
  BurgerMenu,
  UpdatePageTitle,
  Demonstrator,
  ImageZoom,
  ScrollToTop,
  DropAnswer,
} from './modules.js';

import { titles_dic, elements_dic, demo_data, team_data } from './dictionary.js';

removeMobileBlocks();
pricesBlockMobile();
reviewsMobileBlock();
translateMoreBtnOfferBlock();


// Plugins

new LazyLoad({
  offset: 800,
});

new Popup({
  backdrop: true,
  overlayExit: true,
  // pageWrapper: '.popup-backdrop', // Если есть какойто скрол смусер или еще чтото что обрачивает както страницу то указывай тут егог класс что падинг при открытии попапа ему задавался а не быди. Если ниче такого нет то просто не пиши ето свойство
  scrollUnlockTime: 100,
  mobileFrom: 831,
  escapeButtonExit: true,

  // Колбек срабатывающий когда выход из попапа по клику вне него запрещен и мы кликнули вне него
  overlayForbiddenExit: function(module, current) {},

  preOpenCallback: function(module, current) {},
  afterOpenCallback: function(module, current) {},
  preCloseCallback: function(module, current) {},

  afterCloseCallback: function(module, current) {

    clearPopupInputs(current.popup);

  },
});

new FormValidator({
  resetWhenChange: true,

  textInput: {
    onlyCyrylic: true,
    minLength: 2,
    noNumbers: true,
  },


  phoneMask: {
    mask: '+{38} (000) 000-00-00',
    lazy: false,
    placeholderChar: '_',
  },

});

new DropMenu({

  type: 'hover',
  mobile: 831,

  // menuOpened: (block) => console.log('opened', block),
  // menuClosed: (block) => console.log('closed', block),

});

new ChangeLanguage({
  dictionary: elements_dic,
});

new BurgerMenu({
  activationBreakpoint: 671,
  needOverlay: false,
  closeByClickOutOfMenu: true,
  exceptBtns: '[data-lang-var], .button', // Кроме button с указаными селекторами. При клике на такие кнопки меню не закроется
  openCallback: function(info) {},
  closeCallback: function(info) {},
});

new UpdatePageTitle({
  dictionary: titles_dic,
  observer: {
    threshold: 0.3,
  },
});

new ImageZoom({
  mode: 'hover',
  mobileViewport: 831,
  strictHoverTarget: true,

  startZoom: 1.3,
  minZoom: 1,
  maxZoom: 1.7,
  zoomStep: 0.2,

  mobile: {
    minZoom: 1,
    maxZoom: 4,
    zoomStep: 0.2,
  }
});

new ScrollToTop({
  '1024-9999': 950,
  '1-1023': 1500,
  default: 900,
});

new DropAnswer({
  backdropClose: true,
  multiple: true,
  escapeClose: true,
  linkClose: true,

  openCallback: function(block) {
    changeOfferTriggerText(block);
    changePromotionsTriggerText(block);
  },

  closeCallback: function(block) {
    changeOfferTriggerText(block);
    changePromotionsTriggerText(block);
  },
});

// AUTOPLAY
new Swiper('#working_slider', {

  slidesPerView: 3,
  spaceBetween: 165,
  speed: 600,
  loop: true,
  centeredSlides: true,
  initialSlide: 1, 

  pagination: {
    el: '.working-slider .swiper-pagination',
    clickable: true,
    type: 'bullets',
  },

  navigation: {
    nextEl: '.working-slider .working-slider__slider-control--next',
    prevEl: '.working-slider .working-slider__slider-control--prev',
  },

  // autoplay: {
  //   delay: 2000,
  //   disableOnInteraction: false,
  //   pauseOnMouseEnter: true,
  // },

  breakpoints: {

    1031: {
      slidesPerView: 3,
      spaceBetween: 165,
      centeredSlides: true,
      initialSlide: 1, 
    },

    831: {
      spaceBetween: 10,
      slidesPerView: 1.32,
      centeredSlides: false,
      initialSlide: 0, 

      // autoplay: {
      //   delay: 2000,
      //   disableOnInteraction: false,
      //   pauseOnMouseEnter: true,
      // },
    },

    671: {
      spaceBetween: 10,
      slidesPerView: 1.406,
      centeredSlides: false,
      initialSlide: 0,

      // autoplay: {
      //   delay: 2000,
      //   disableOnInteraction: true,
      //   pauseOnMouseEnter: true,
      // },
    },

    501: {
      spaceBetween: 10,
      slidesPerView: 1.2,
      centeredSlides: false,
      initialSlide: 0,
      
      // autoplay: {
      //   delay: 2000,
      //   disableOnInteraction: true,
      //   pauseOnMouseEnter: true,
      // },
    },

    1: {
      spaceBetween: 20,
      slidesPerView: 1,
      centeredSlides: false,
      initialSlide: 0, 

      // autoplay: {
      //   delay: 2000,
      //   disableOnInteraction: true,
      //   pauseOnMouseEnter: true,
      // },
    },

  },

});


// Other functions

function focusStateFix(...selectors) {

  let initSelectors = [ 'a', 'button' ];
  if (selectors) initSelectors.push(...selectors);

  document.addEventListener('pointerdown', (event) => {

    initSelectors.forEach((selector) => {

      let isValid = event.target.closest(selector);
      if (isValid) isValid.addEventListener('pointerleave', (event) => event.currentTarget.blur(), { once: true });

    });

  });

}

function customRange() {

  let range = document.querySelector('#squareRange');

  if (!range) return;

  let slider = range.querySelector('.custom-range__line');
  let valueArea = range.querySelector('.custom-range__value');
  let input = range.querySelector('.custom-range__input');

  noUiSlider.create(slider, {
    start: [ 72 ],
    connect: [ true, false ],
    range: {
      'min': 1,
      'max': 300
    },
  });

  let button = range.querySelector('.noUi-handle');

  button.addEventListener('pointerdown', (event) => {
    button.setPointerCapture(event.pointerId);
  })

  slider.noUiSlider.on('update', (values, handle) => {
    let value = Math.trunc(values[0]);
    valueArea.textContent = value;
    input.value = value;
  });

}

function formValidatorEventsHandler() {

  let form = document.querySelector('[data-form]');

  if (!form) return;

  defineWarnFields();

  document.addEventListener('formvalid', (event) => {

    let popup = event.target.closest('.popup');
    let calculator = event.target.closest('.calculator');

    if (popup) {
      popup?._popup?.openPopup('popup--result');
    } else if (calculator) {
      let dialog = document.querySelector('.popup');
      dialog?._popup?.openPopup('popup--result');
      clearCalculatorInputs(calculator)
    }

  });

  document.addEventListener('invalidinput', (event) => {

    event.detail.forEach((item) => showWarning(item));

  });

  document.addEventListener('resetinput', (event) => {

    let warning = event.detail.input._warning;
   
    if (!warning) return;

    warning.classList.remove('active');
    warning.style.height = '';

  });

  document.addEventListener('translated', (event) => {

    repeatWarning();

  })

  function showWarning(data) {

    if (data.input.type === 'checkbox') return;

    let warnField = data.input._warning;
    let text = getWarningText(data.input.type, data.msg);

    data.input._lastCode = data.msg;

    if (text) {
      warnField.textContent = text;
      warnField.style.height = warnField.scrollHeight + 'px';
    }
    
    warnField.classList.add('active');

  }

  function getWarningText(type, msg) {

    let text;
    let lang = document.documentElement.lang;

    if (type === 'text') {

      if (msg === 'Empty field') {
        text = lang === 'ru' ? 'Введите ваше имя' : 'Введіть ваше ім\'я';
      } else if (msg === 'Only cyrylic allowed') {
        text = lang === 'ru' ? 'Используйте кириллические символы': 'Використовуйте символи кирилиці';
      } else if (msg === 'Text lower than minimum length') {
        text = lang === 'ru' ? 'Введите минимум две буквы' : 'Введіть щонайменше дві літери';
      } else if (msg === 'Digits not allowed' || msg === 'Forbidden symbol') {
        text = lang === 'ru' ? 'Вводите только буквы' : 'Вводьте лише літери';
      }

    } else if (type === 'tel') {

      if (msg === 'Empty field') {
        text = lang === 'ru' ? 'Введите номер телефона' : 'Введіть номер телефону';
      } else if (msg === 'Enter full number') {
        text = lang === 'ru' ? 'Введите номер полностью' : 'Введіть номер повністю';
      }

    }

    return text;

  }

  function repeatWarning() {

    let invalids = Array.from(document.querySelectorAll('[data-validate].invalid'));
    invalids.forEach((item) => {
      if (item._lastCode) showWarning({ input: item, msg: item._lastCode });
    })

  }

  function defineWarnFields() {

    let inputs = Array.from(document.querySelectorAll('[data-validate]'));

    inputs.forEach((input) => {

      let warnElement = document.querySelector(`[data-warn="${input.id}"]`);
      if (warnElement) input._warning = warnElement;

    });

  }

}

function clearPopupInputs(popup) {

  if (!popup) return;

  let form = popup.querySelector('form');

  if (!form) return;

  Array.from(form.elements).forEach((item) => {

    if (item.type === 'text') {
      item.value = '';
    } else if (item.type === 'checkbox') {
      item.checked = false;
    } else if (item.type === 'tel') {
      item._mask ? item._mask.value = '' : item.value = '';
    }

    item.classList.remove('invalid', 'valid');

    let warning = item._warning;

    if (warning) {
      warning.classList.remove('active');
      warning.textContent = '';
      warning.style.height = '';
    }

  });

}

function clearCalculatorInputs(calculator) {

  if (!calculator) return;

  let elements = Array.from(calculator.querySelectorAll('fieldset'));
  let range = calculator.querySelector('#squareRange .custom-range__line');
  let initValue = range?.noUiSlider?.options.start[0];

  elements.forEach((element) => {
    
    let input = element.elements[0];
    
    if (input.type === 'radio') {

      input.checked = true;

    } else if (input.type === 'tel') {

      if (input._mask) {
        input._mask.value = '';
      } else {
        input.value = '';
      }

    } else if (input.type === 'hidden') {

      range?.noUiSlider?.set(initValue);
      input.value = initValue ?? 0;

    }
    
  });

}

function langControlsHandler() {

  let controls = Array.from(document.querySelectorAll('[data-lang-var]'));

  if (controls.length === 0) return;

  selectLastLangBtn();

  document.addEventListener('click', (event) => {

    let button = event.target.closest('[data-lang-var]');

    if (button) {
      unselectOtherButtons();
      selectButton(button);
    }

  });

  function selectButton(button) {
    button.classList.add('active');
    button.setAttribute('disabled', '');
  }

  function unselectOtherButtons() {
    controls.forEach((item) => {
      item.classList.remove('active');
      item.removeAttribute('disabled');
    });
  }

  function selectLastLangBtn() {
    let lang = document.documentElement.lang;
    let button = document.querySelector(`[data-lang-var="${lang}"]`);
    unselectOtherButtons();
    selectButton(button);
  }

}

function calculatorHandler() {

  let calculator = document.querySelector('.calculator');

  if (!calculator) return;

  let priceArea = calculator.querySelector('.res-price');
  let durationArea = calculator.querySelector('.calculator__result-value--dur');
  let range = calculator.querySelector('#squareRange .custom-range__line');

  let coefs = {

    'base-price': 1557,

    'rem-type': {
      'cosmetic': 0.01,
      'capital': 0.2,
      'key': 0.25,
      'design': 0.3,
    },

    'appart-type': {
      'newhome': 0.02,
      'oldhome': 0.1,
    },

    'room-count': {
      '1': 0.01,
      '2': 0.02,
      '3': 0.03,
      '4': 0.04,
      '5': 0.05,
      '6': 0.06,
    },

  }

  let data = {};
 
  getIputsInfo();
  calcResult();
  autoTranslate();

  document.addEventListener('input', (event) => {

    getIputsInfo();
    calcResult();

  });

  range?.noUiSlider?.on('update', (values, handle) => {
    
    getIputsInfo();
    calcResult();

  });

  function calcResult() {

    let square = data['square-value'];
    let basePrice = coefs['base-price']
    let remTypeCoef = coefs['rem-type'][data['rem-type']];
    let appartTypeCoef = coefs['appart-type'][data['appart-type']];
    let roomCountCoef = coefs['room-count'][data['room-count']] ;
    
    let remTypeCost = remTypeCoef * basePrice;
    let appartCost = appartTypeCoef * basePrice;
    let roomCountCost = roomCountCoef * basePrice; 

    let price = (remTypeCost + appartCost + roomCountCost + basePrice) * square; 
    let duration = price / 12000;

    showResults(price, duration);

  }

  function showResults(price, duration) {

    let lang = document.documentElement.lang;

    let formatter = new Intl.NumberFormat('ru');
    let rules = new Intl.PluralRules( lang === 'ru' ? 'ru-RU' : 'ua-UA' );

    price = formatter.format(Math.ceil(price));
    duration = Math.ceil(duration);

    let pluralForm = rules.select(duration);

    let variant = lang === 'ru' ? 'дней' : 'днів';
    let forms = {
      'one': 'дня',
      'few': variant,
      'many': variant,
      'other': variant,
    };

    let end = forms[pluralForm] ?? variant;

    priceArea.textContent = price;
    durationArea.innerHTML = `<span class="calculator__result-value mid-text">до <span class="res-duration">${duration}</span> ${end}</span>`;

  }

  function getIputsInfo() {

    Array.from(calculator.elements).forEach((input) => {

      if (input.checked || (input.type === 'hidden')) {
        data[input.name] = input.value;
      }

    });

  }

  function autoTranslate() {

    let observer = new MutationObserver((list, obs) => {
      getIputsInfo();
      calcResult();
    });

    observer.observe(document.documentElement, { attributes: true });

  }

}

function mobileFixedHeaderEffect() {

  let header = document.querySelector('.mob-nav');
  let media = window.matchMedia('(max-width: 671px)').matches;

  if (!header || !media) return;

  window.addEventListener('scroll', (event) => {

    if (window.pageYOffset > 0) {
      header.classList.add('active');
    } else {
      header.classList.remove('active');
    }

  });

}

function removeMobileBlocks() {

  let media = window.matchMedia('(max-width: 671px)').matches;
  let header = document.querySelector('.mob-nav');
  let menu = document.querySelector('.mob-menu');

  if (!media) {

    if (header) header.remove();
    if (menu) menu.remove();

  }

}

function translateMoreBtnOfferBlock() {

  let btns = Array.from(document.querySelectorAll('.offer__trigger'));

  if (!btns.length) return;

  document.addEventListener('translated', (event) => {

    btns.forEach((btn) => {

      let parent = btn.parentElement;
      let lang = document.documentElement.lang;

      if (parent.matches('.active')) {
        btn.textContent = lang === 'ru' ? 'Скрыть' : 'Приховати';
      } else {
        btn.textContent = lang === 'ru' ? 'Список работ' : 'Список робіт';
      }

    });

  });

}

function pricesBlockMobile() {

  let block = document.querySelector('.section--prices');
  let media = window.matchMedia('(max-width: 831px)').matches;

  if (!block || !media) return;

  let container = block.querySelector('.offers');
  let offers = Array.from(block.querySelectorAll('.offer'));

  if (!container || !offers.length) return;

  let slider;

  createStructure();
  initSlider();

  function createStructure() {

    slider = document.createElement('div');
    slider.classList.add('swiper', 'offers-slider');
    slider.id = 'offers_slider';

    let wrapper = document.createElement('div');
    wrapper.classList.add('swiper-wrapper');

    offers.forEach((offer) => {

      let slide = document.createElement('div');
      slide.classList.add('swiper-slide');

      offer.className = 'offer offers-slider__offer';

      slide.append(offer);
      wrapper.append(slide);

    });

    slider.append(wrapper);
    container.replaceWith(slider);

  }

  function initSlider() {

    new Swiper('#offers_slider', {
      slidesPerView: 2.479, 
      spaceBetween: 23,
      slidesOffsetBefore: 15,
      slidesOffsetAfter: 15,
      speed: 700,

      autoplay: {
        delay: 3000,
        disableOnInteraction: true,
        pauseOnMouseEnter: true,
      },

      breakpoints: {

        741: {
          slidesPerView: 2.479, 
        },

        670: {
          slidesPerView: 2.2,
        },

        501: {
          slidesPerView: 1.65, 
        },

        413: {
          slidesOffsetBefore: 15,
          slidesOffsetAfter: 15,
          slidesPerView: 1.3257,
        },

        1: {
          slidesOffsetBefore: 10,
          slidesOffsetAfter: 10,
          slidesPerView: 1.15, 
        }

      }

    });

  }

}

function slidersAutoplayViewportController(except = '.a93fj3fds1') {

  let sliders = Array.from(document.querySelectorAll(`.swiper:not(${except})`));

  if (sliders.length === 0) return;

  let observer = new IntersectionObserver((list, obs) => {

    list.forEach((item) => {

      if (item.isIntersecting) {
        item.target.swiper?.autoplay.start();
      } else {
        item.target.swiper?.autoplay.stop();
      }

    })

  }, { root: null, threshold: 0.2 });

  sliders.forEach((slider) => observer.observe(slider));

}

// AUTOPLAY
function activateDemonstrators() {

  let demonstrators = Array.from(document.querySelectorAll('.demonstrator'));

  if (!demonstrators.length) return;
  
  defineDemoInfoBlockAreas();

  demonstrators.forEach((demo) => {

    new Demonstrator(`#${demo.id}`, {

      mobile: 831,

      lazy: {
        margin: 700,
      },

      slider: {

        slidesPerView: 5.375,
        spaceBetween: 10,
        speed: 500,
        simulateTouch: true,
        direction: 'vertical',

        pagination: {
          el: `#${demo.id} .slider-pag`,
          clickable: true,
          type: 'bullets',
          renderBullet: customBullets,
        },

        navigation: {
          nextEl: `#${demo.id} .demonstrator__slider-control--next`,
          prevEl: `#${demo.id} .demonstrator__slider-control--prev`,
        },

        // autoplay: {
        //   delay: 3000,
        //   disableOnInteraction: false,
        //   pauseOnMouseEnter: true,
        // },

        on: {
          afterInit: updateDemoInfoBlock,
          slideChange: updateDemoInfoBlock,
        },

        breakpoints: {

          1330: {
            direction: 'vertical',
            spaceBetween: 10,
          },

          1031: {
            slidesPerView: 5.375,
            direction: 'horizontal',
            spaceBetween: 10,
          },

          831: {
            slidesPerView: 3.6,
            direction: 'horizontal',
            spaceBetween: 10,
          },

          671: {
            slidesPerView: 4,
            spaceBetween: 12,
            direction: 'horizontal',
          },

          413: {
            slidesPerView: 4.318,
            spaceBetween: 9,
            direction: 'horizontal',
          },

          1: {
            slidesPerView: 3.3,
            spaceBetween: 10,
            direction: 'horizontal',
          }

        }

      }

    });

    addExtraSlidesInToolsSlider(`#${demo.id} .swiper`);

  });

  translateDemoInfoBlock();

  function customBullets(index, className) {

    try {

      let slide = this.slides[index];
      let square = demo_data[slide.id].square;

      return `<button class="slider-pag__item ${className}">
                <span class="slider-pag__effect"></span>
                <span class="slider-pag__text small-text">${square} м²</span>
              </button>`;

    } catch {

      console.log('Custom bullets error');

      return `<button class="slider-pag__item ${className}">
                <span class="slider-pag__effect"></span>
                <span class="slider-pag__text small-text">${index + 1}</span>
              </button>`;

    }

  }

  function addExtraSlidesInToolsSlider(selector) {

    let slider = document.querySelector(selector);

    if (!slider) return;

    let swiper = slider.swiper;
    let slidesCount = Math.trunc(+swiper.params.slidesPerView);

    if (slidesCount > 1) {

      for (let i = 1; i <= slidesCount - 1; i++) {
        swiper.appendSlide(`<div class="swiper-slide" style="visibility: hidden;"></div>`);
      }

    }

  }

}

function defineDemoInfoBlockAreas() {

  let demoInfoBlock = Array.from(document.querySelectorAll('.demo-info'));

  demoInfoBlock.forEach((demo) => {

    demo._sum = demo.querySelector('[data-info="sum"]');
    demo._square = demo.querySelector('[data-info="square"]');
    demo._duration = demo.querySelector('[data-info="duration"]');
    demo._rooms = demo.querySelector('[data-info="rooms"]');
    demo._location = demo.querySelector('[data-info="location"]');
    demo._list = demo.querySelector('[data-info="list"]');

  });

}

function updateDemoInfoBlock(swiper) {

  try {
    demo_data
  } catch {
    console.log('[demo_data] dictionary not found');
    return;
  }

  let activeSlide = swiper.slides.at(swiper.realIndex);
  let data = demo_data[activeSlide.id];

  if (!data) return;
  
  let lang = document.documentElement.lang;
  let demonstrator = activeSlide.closest('.demonstrator');
  let demoInfoBlock = demonstrator.querySelector('.demo-info');
  let numberFormatter = new Intl.NumberFormat('ru');
  
  demoInfoBlock._sum.textContent = numberFormatter.format(data.sum) + ' грн';
  demoInfoBlock._square.textContent = data.square + ' м²';
  demoInfoBlock._rooms.textContent = data.rooms;

  let days = formatDemoInfoDurationField(lang, data.duration);
  demoInfoBlock._duration.textContent = days;

  demoInfoBlock._location.textContent = data.location[lang];

  demoInfoBlock._list.innerHTML = '';

  data.actions.forEach((action) => {

    let li = document.createElement('li');
    li.classList.add('desc-list__li', 'small-text');

    li.textContent = action[lang];

    demoInfoBlock._list.append(li);

  });

  try {
    ChangeLanguage.prototype.updateElements();
  } catch {
    console.log('[ChangeLanguage] plugin is not defined');
  }

}

function formatDemoInfoDurationField(lang, duration) {

  let rules = new Intl.PluralRules( lang === 'ru' ? 'ru-RU' : 'ua-UA' );
  let pluralForm = rules.select(duration);

  let variant = lang === 'ru' ? 'дней' : 'днів';
  let forms = {
    'one': 'день',
    'few': lang === 'ru' ? 'дня' : 'дні',
    'many': variant,
    'other': variant,
  };

  let end = forms[pluralForm] ?? variant;
  return `${duration} ${end}`;

}

function translateDemoInfoBlock() {

  document.addEventListener('translated', (event) => {

    let slides = Array.from(document.querySelectorAll('.demonstrator .swiper'));
    slides.forEach((slide) => updateDemoInfoBlock(slide.swiper));

  });

}

function tabletsHandler() {

  let tabs = Array.from(document.querySelectorAll('[data-tabs]'));

  if (!tabs.length) return;

  let currentTabsBlock;
  defineElements();
  selectInitTab();

  document.addEventListener('click', (event) => {

    let trigger = event.target.closest('[data-tab-trig]');

    if (trigger) {
      showSelectedTab(trigger);
    }

  });

  function showSelectedTab(trigger) {

    currentTabsBlock = trigger.closest('[data-tabs]');

    let tab = currentTabsBlock.querySelector(`[data-tab="${trigger.dataset.tabTrig}"]`);

    if (!tab || tab.matches('.active')) return;

    currentTabsBlock._tabs.forEach((tab) => {
      tab.classList.remove('active')
      demosAutoplayController(tab);
    });

    currentTabsBlock._triggers.forEach((trig) => trig.classList.remove('active'));

    trigger.classList.add('active');
    tab.classList.add('active');
    demosAutoplayController(tab);

  }

  function demosAutoplayController(tab) {

    tab.matches('.active') ? tab._swiper?.autoplay.start() : tab._swiper?.autoplay.stop();

  }

  function selectInitTab() {

    tabs.forEach((item) => {
      item._triggers[0].classList.add('active');
      item._tabs[0].classList.add('active');
    })

  }

  function defineElements() {

    tabs.forEach((item) => {

      item._triggers = Array.from(item.querySelectorAll('[data-tab-trig]'));
      item._tabs = Array.from(item.querySelectorAll('[data-tab]'));
      item._tabs.forEach((tab) => tab._swiper = tab.querySelector('.swiper').swiper);

    })

  }

}

function tabsDemosAutoplayInViewport() {

  let demos = Array.from(document.querySelectorAll('.tabs .demonstrator'));

  if (!demos.length) return;
  if (typeof Swiper === 'undefined') return;

  let area = document.querySelector('.tabs__area');

  demos.forEach((item) => {

    let swiper = item.querySelector('.swiper').swiper;
    if (swiper) swiper.autoplay.stop();

  });

  let observer = new IntersectionObserver((list, obs) => {

    list.forEach((item) => {

      let swiper = item.target.querySelector('.tabs__tab.active .swiper').swiper;

      if (item.isIntersecting) {

        if (swiper) swiper.autoplay.start();

      } else {

        if (swiper) swiper.autoplay.stop();

      }

    });

  }, { threshold: 0.1 });

  observer.observe(area);
 
}

function changeOfferTriggerText(block) {

  let lang = document.documentElement.lang;
  
  if (block.matches('.opened')) {
    block._trigger.textContent = lang === 'ru' ? 'Скрыть' : 'Приховати';
  } else {
    block._trigger.textContent = lang === 'ru' ? 'Список работ' : 'Список робіт';
  }

}

function changePromotionsTriggerText(block) {

  let lang = document.documentElement.lang;
  
  if (block.matches('.opened')) {
    block._trigger.textContent = lang === 'ru' ? 'Скрыть' : 'Приховати';
  } else {
    block._trigger.textContent = lang === 'ru' ? 'Все акции' : 'Усі акції';
  }

}

// AUTOPLAY
function mobilePromotionsBlock() {

  let media = window.matchMedia('(max-width: 831px)').matches;
  let block = document.querySelector('.promotions');

  if (!media || !block) return;

  let proms = Array.from(block.querySelectorAll('.promotion'));

  createSlider();
  initSlider();

  function createSlider() {

    block.innerHTML = '';
    block.classList.add('swiper');

    let wrapper = document.createElement('div');
    wrapper.classList.add('swiper-wrapper');

    let pag = document.createElement('div');
    pag.classList.add('swiper-pagination', 'custom-pag');

    proms.forEach((promotion) => {

      let slide = document.createElement('div');
      slide.classList.add('swiper-slide');

      slide.append(promotion);
      wrapper.append(slide);

    });

    block.append(wrapper, pag);

  }

  function initSlider() {

    new Swiper(block, {

      slidesPerView: 2.531,
      spaceBetween: 13,
      speed: 700,

      pagination: {
        el: '.promotions .swiper-pagination',
        clickable: true,
        type: 'bullets',
      },

      // autoplay: {
      //   delay: 2500,
      //   disableOnInteraction: false,
      //   pauseOnMouseEnter: true,
      // },

      breakpoints: {

        671: {
          slidesPerView: 2.531,
          spaceBetween: 13,
        },

        501: {
          slidesPerView: 1.8,
          spaceBetween: 10,
        },

        1: {
          slidesPerView: 1,
          spaceBetween: 20,
        }
      }

    });

  }

}

function explanatorHandler() {

  let media = window.matchMedia('(max-width: 1031px)').matches;

  if (media) return;

  let block = document.querySelector('.explanator');
  let cards = Array.from(document.querySelectorAll('.explanator .option'));
  let points = Array.from(document.querySelectorAll('.explanator .explanator__point'));
  let line = document.querySelector('.explanator .explanator__line');

  if (!block || !cards.length || !points.length || !line) return;

  defineElements();
  let lastPointIndex = 0;

  block.addEventListener('pointerover', (event) => {

    let card = event.target.closest('.option');
    let point = event.target.closest('.explanator .explanator__point');

    if (card) {
      movementHandler(card);
    } else if (point) {
      movementHandler(point);
    }

  });

  block.addEventListener('pointerleave', (event) => {

    cards.forEach((card) => card.classList.remove('active'));
    points.forEach((point) => point.classList.remove('active'));
    line.firstElementChild.style.width = '0px';
    lastPointIndex = 0;

  });

  function movementHandler(elem) {

    cards.forEach((card) => card.classList.remove('active'));
    points.forEach((point, index) => elem._index > index ? point.classList.add('active') : null);

    elem = elem._point ?? elem;
    elem._card ? elem._card.classList.add('active') : elem.classList.add('active');

    if (elem._index < lastPointIndex ) {
      points.at(lastPointIndex).classList.remove('active');
      lastPointIndex = elem._index;
    } else {
      elem.classList.add('active');
      lastPointIndex = elem._index;
    }
    
    let sublineWidth = getSublineLength(elem);
    line.firstElementChild.style.width = sublineWidth + 'px';

  }

  function getSublineLength(point) {

    if (!point) return;

    let subLine = line.firstElementChild;
    let startX = subLine._info.x;
    let pointMidX = point._info.x + (point._info.width / 2);
    
    return Math.abs(Math.trunc(pointMidX - startX));

  }

  function defineElements() {

    cards.forEach((card, index) => {
      card._index = index;
      card._point = points.at(index);
    });

    points.forEach((point, index) => {
      point._index = index;
      point._card = cards.at(index);
      point._info = point.getBoundingClientRect();
    });

    line.firstElementChild._info = line.getBoundingClientRect();

  }

}

// AUTOPLAY
function reviewsMobileBlock() {

  let block = document.querySelector('.reviews');
  let media = window.matchMedia('(max-width: 831px)').matches;

  if (!block || !media) return;
  if (typeof Swiper === 'undefined') return;

  let slides = Array.from(block.querySelectorAll('.review'));

  createSliderStructure();
  initSwiperSlider();

  function createSliderStructure() {

    let pagination = document.createElement('div');
    pagination.classList.add('swiper-pagination', 'custom-pag');

    let wrapper = document.createElement('div');
    wrapper.classList.add('swiper-wrapper');

    slides.forEach((slide) => {

      let slideEl = document.createElement('div');
      slideEl.classList.add('swiper-slide');

      slideEl.append(slide);
      wrapper.append(slideEl);

    });

    block.classList.add('swiper');
    block.innerHTML = '';
    block.append(wrapper, pagination);

  }

  function initSwiperSlider() {

    new Swiper(block, {

      slidesPerView: 1,
      spaceBetween: 0,
      speed: 700,

      pagination: {
        el: '.reviews .swiper-pagination',
        clickable: true,
        type: 'bullets',
      },

      // autoplay: {
      //   delay: 3000,
      //   disableOnInteraction: true,
      //   pauseOnMouseEnter: true,
      // },

    });

  }

}

// AUTOPLAY
function teamSlider() {

  let block = document.querySelector('.team-slider');

  if (!block) return;
  if (typeof Swiper === 'undefined') return;

  let slider = block.querySelector('.swiper');
  let buttons = Array.from(block.querySelectorAll('.team-slider__button'));
  let points = Array.from(block.querySelectorAll('.team-slider__point'));
  let infoBlock = block.querySelector('.team-info');
  let line = block.querySelector('.team-slider__nav-line');
  let swiper, timer;

  defineElementsData();
  initSwiper();
  setNavConnectLineWidth();  

  document.addEventListener('translated', (event) => {

    switchActiveButtonPoint(swiper.realIndex, swiper);
    setNavConnectLineWidth();

  });

  block.addEventListener('click', (event) => {

    let navButton = event.target.closest('.team-slider__point, .team-slider__button');

    if (navButton) {
      if (swiper.realIndex !== navButton._index) swiper.slideToLoop(navButton._index);
    }

  });

  // block.addEventListener('pointerenter', (event) => {
  //   swiper.autoplay.stop();
  // });

  // block.addEventListener('pointerleave', (event) => {
  //   swiper.autoplay.start();
  // });

  function initSwiper() {

    swiper = new Swiper(slider, {

      slidesPerView: 1,
      spaceBetween: 30,
      speed: 600,
      direction: 'vertical',
      loop: true,

      pagination: {
        el: '.team-slider .swiper-pagination',
        clickable: true,
        type: 'bullets',
      },

      navigation: {
        nextEl: '.team-slider .team-slider__slider-control--next',
        prevEl: '.team-slider .team-slider__slider-control--prev',
      },

      // autoplay: {
      //   delay: 3000,
      //   disableOnInteraction: false,
      //   pauseOnMouseEnter: true,
      // },

      breakpoints: {

        831: {
          direction: 'vertical',
        },

        1: {
          direction: 'horizontal',
        },

      },

      on: {

        afterInit: function(plugin) {

          let index = plugin.realIndex;

          switchActiveButtonPoint(index, plugin, true);

        },

        slideChange: function(plugin) {

          let index = plugin.realIndex;

          switchActiveButtonPoint(index, plugin);

        }

      }

    })

  }

  function switchActiveButtonPoint(index, plugin, init) {

    buttons.forEach((button) => button.classList.remove('active'));
    points.forEach((point) => point.classList.remove('active'));

    setTimeout(() => {

      let activeSlide = block.querySelector('.swiper-slide-active');
      let key = activeSlide.dataset.team;
      
      if (init) {
        setWorkerData(key);
      } else {
        infoBlock.classList.add('active');
        clearTimeout(timer);
        timer = setTimeout(() => setWorkerData(key), 300);
      }

    });
    
    buttons.at(index).classList.add('active');
    points.at(index).classList.add('active');

  }

  function defineElementsData() {

    buttons.forEach((btn, index) => {
      btn._index = index;
      points.at(index)._index = index;
    });

    infoBlock._name = infoBlock.querySelector('.team-info__name');
    infoBlock._job = infoBlock.querySelector('.team-info__job');
    infoBlock._sub = infoBlock.querySelector('.team-info__sub');
    infoBlock._list = infoBlock.querySelector('.team-info__desc-list');

  }

  function setWorkerData(key) {
  
    if (!team_data || !key) return;

    let lang = document.documentElement.lang;

    infoBlock._name.textContent = team_data[key].name[lang];
    infoBlock._job.textContent = team_data[key].job[lang];
    infoBlock._sub.textContent = team_data[key].sub[lang];

    infoBlock._list.innerHTML = '';

    team_data[key].actions.forEach((action) => {

      let li = document.createElement('li');
      li.classList.add('desc-list__li', 'small-text');

      li.textContent = action[lang];

      infoBlock._list.append(li);

    });

    infoBlock.classList.remove('active');

  }

  function setNavConnectLineWidth() {

    if (!line) return;

    let containerInfo = line.parentElement.getBoundingClientRect();
    let firstPointInfo = points.at(0).getBoundingClientRect();
    let lastPointInfo = points.at(-1).getBoundingClientRect();

    let x = Math.round((firstPointInfo.x + firstPointInfo.width / 2) - containerInfo.x);
    let width = Math.round((lastPointInfo.x + lastPointInfo.width / 2) - (firstPointInfo.x + firstPointInfo.width / 2));

    line.style.cssText = `left: ${x}px; width: ${width}px`;

  }

}









focusStateFix('.noUi-handle', '.agreement__label');
mobilePromotionsBlock();
activateDemonstrators();
customRange();
formValidatorEventsHandler();
langControlsHandler();
calculatorHandler();
mobileFixedHeaderEffect();
// slidersAutoplayViewportController('.demonstrator .swiper');
tabletsHandler();
// tabsDemosAutoplayInViewport();
explanatorHandler();
teamSlider();