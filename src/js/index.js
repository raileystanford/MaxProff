import {
  Popup,
  FormValidator,
  DropMenu,
  ChangeLanguage,
  BurgerMenu,
  UpdatePageTitle,
} from './modules.js';

import { titles_dic, elements_dic } from './dictionary.js';

removeMobileBlocks();
pricesBlockMobile();
translateMoreBtnOfferBlock();

// Plugins

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

function showHiddenContent() {

  let blocks = Array.from(document.querySelectorAll('.offer__body'));
  let trigger = document.querySelector('.offer__trigger');

  if (!blocks.length || !trigger) return;

  defineElements();

  document.addEventListener('click', (event) => {

    let trigger = event.target.closest('.offer__trigger');

    if (trigger) {
      showHideBlock(trigger);
    }

  });

  function showHideBlock(trigger) {

    let block = trigger._content;
    let footer = trigger.parentElement;
    let lang = document.documentElement.lang;

    if (footer.matches('.active')) {
      block.style.height = '';
      footer.classList.remove('active');
      trigger.textContent = lang === 'ru' ? 'Список работ' : 'Список робіт';
    } else {
      block.style.height = block.scrollHeight + 'px';
      footer.classList.add('active');
      trigger.textContent = lang === 'ru' ? 'Скрыть' : 'Приховати';
    }

  }

  function defineElements() {

    blocks.forEach((block) => {

      let parent = block.closest('.offer');
      block._trigger = parent.querySelector('.offer__trigger');
      block._trigger._content = block;

    })

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






focusStateFix('.noUi-handle');
customRange();
formValidatorEventsHandler();
langControlsHandler();
calculatorHandler();
mobileFixedHeaderEffect();
showHiddenContent();
slidersAutoplayViewportController();