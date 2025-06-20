import { dictionary, dem_dictionary } from "./dictionary.js";

import { 
  Popup,
  ChangeLanguage,
  DropdownMenu,
  CustomRange, 
  FormValidator,
  BurgerMenu,
  ScrollToTop,
  Tabs,
  ImageDemonstrator,
  ImageZoom,
} from "./modules.js";

new Popup({
  backDrop: true,
  closeOnBtn: true,
  escButtonClose: true,
  delay: 150,
});

new ChangeLanguage({
  screenBlock: true,
  autoSet: false,
  dictionary: dictionary,
  details: {
    changeButtonText: changeButtonText,
  }
});

new DropdownMenu ({
  container: '.drop-list',
  triggerBtn: '.drop-list__button',
  link: '.drop-list__link',
  inner: '.drop-list__content',
  delay: 100,
  mobileModeOn: 768,
});

new CustomRange({
  moveButtonToClick: true,
})

new FormValidator({
  hideWarningOnClick: true,
  phoneMask: {
    mask: '+{38} (000) 000-00-00',
    lazy: false,
    placeholderChar: '_',
  },
  resetCalculator: resetCalculatorValues,
});

new BurgerMenu({
  needOverlay: true,
  closeByClickOutOfMenu: false,
});

// new ScrollToTop({
//   '769-1600': 1000,
//   '501-769': 1400,
//   '386-501': 1600,
//   '300-385': 1300,
// });

replacePreviews();

new Tabs({
  'tabs1': {
    adaptiveSize: true,
  }
});

new Swiper('.prices__slider', {
  simulateTouch: true,
  slidesPerView: 'auto',
  spaceBetween: 21,
  touchRatio: 0.8,  
  slidesOffsetBefore: 20,
  slidesOffsetAfter: 25,
  resistance: true,
  resistanceRatio: 0,

  freeMode: {
    enabled: true,
    momentum: false,
  },

  breakpoints: {
    769: {
      slidesOffsetAfter: 25,
    },
    386: {
      spaceBetween: 23,
    },
    300: {
      slidesOffsetAfter: 15,
      spaceBetween: 15,
    }
  }
});

new ImageDemonstrator({

  forAll: {

    pictureClass: 'demonstration__screen-img',
    reverse: true, 
    lazy: true,

    scrollbar: {
      minSize: 100,
      // size: 300,
    },

    transition: { 
      loading: 100, 
      effect: 200, 
    },

    swipeXCoef: 3, 
    swipeYCoef: 4,
    mobileStartFrom: 768, 
    changeOrientationBreakpoint: 1232,
    changeOrientation: true, 
    
    // autoplay: {  
    //   interval: 1000, 
    //   // stopOnHover: true, 
    //   playOnViewport: true, 
    // }, 

    startPicture: 0, 
    dictionary: dem_dictionary,
    jobsClases: 'info-card__list-item text3',
  
  }
  
});

new ImageZoom('[data-zoom]', {
  mode: 'hover',
  startZoom: 1.5, 
  minZoom: 1,
  maxZoom: 2,
  zoomStep: 0.2,
});



function focusStateFix() {

  document.addEventListener('pointerdown', (event) => {
    let element = event.target;
    if (element.closest('a')) element.closest('a').addEventListener('pointerleave', removeFocus);
    if (element.closest('button')) element.closest('button').addEventListener('pointerleave', removeFocus);
  })

  function removeFocus(event) {
    event.currentTarget.blur();
    event.currentTarget.removeEventListener('pointerleave', removeFocus);
  }

}

function smoothDropMenuMobile(query) {

  let contents = Array.from(document.querySelectorAll('.drop-list__content'));
  let media = window.matchMedia(`(max-width: ${query}px)`).matches;

  if (contents.length > 0 && media) {
    
    let observer = new MutationObserver((list, observer) => {
      
      list.forEach((item) => {
        if (item.target.classList.contains('active')) {
          item.target.style.height = item.target.scrollHeight + 20 + 'px';
        } else {
          item.target.style.height = '';
        }
      })

    });

    contents.forEach((item) => {
      observer.observe(item, { attributes: true });
    });

  }

}

function calculatorHandler() {

  let calculator = document.querySelector('.calculator');
  let langButton = document.querySelector('[data-lang-controls]');

  if (calculator) {

    calculator.addEventListener('submit', (event) => {
      event.preventDefault();
      getValues();
    })

    calculator.addEventListener('click', (event) => {
      let target = event.target;

      if (target.closest('.custom-radio')) {
        let element = target.closest('.custom-radio');
        activateVariant(element);
      }
    })

    calculator.addEventListener('input', (event) => {
      calculation();
    })

    if (langButton) langButton.addEventListener('click', () => setTimeout(calculation));

    function calculation() {

      let info = getValues();
      let renType = info.renType;
      let homeType = info.homeType;
      let rooms = +info.rooms;
      let square = +info.square;

      let constants = {

        renType: {
          'cosmetic': 0.02,
          'key': 0.03,
          'capital': 0.04,
          'design': 0.05,
        },

        homeType: {
          'new': 0.05,
          'old': 0.08,
        },

        rooms: {
          '1': 0.01,
          '2': 0.02,
          '3': 0.03,
          '4': 0.04,
          '5': 0.05,
          '6': 0.06,
        },

        basePrise: 1500,

      }

      let price = Math.round(square * (constants.basePrise * (1 + constants.renType[renType] + constants.homeType[homeType] + constants.rooms[rooms])));
      let duration = Math.trunc(price / 11000);

      duration < 1 ? duration = 1 : duration;

      showResults(duration, price);
      
    }

    function showResults(duration, price) {
      let lang = document.documentElement.lang;
      let durationOutput = document.querySelector('.calc-duration');
      let priceOutput = document.querySelector('.calc-price');

      let formater = new Intl.NumberFormat('uk-UA', { style: 'decimal', useGrouping: true });
      price = formater.format(price);

      if (durationOutput && priceOutput) {

        if (lang === 'ru') {
          if (duration > 1) {
            durationOutput.textContent = `до ${duration} дней`;
          } else {
            durationOutput.textContent = `до ${duration} дня`;
          }
        } else if (lang === 'ua') {
          if (duration > 1) {
            durationOutput.textContent = `до ${duration} днiв`;
          } else {
            durationOutput.textContent = `до ${duration} дня`;
          }
        }

        priceOutput.textContent = price + ' грн';

      }

    }

    function activateVariant(item) {
      diactivateOtherVariants(item);
      item.classList.add('active');
    }

    function diactivateOtherVariants(element) {
      let fieldset = element.closest('.calculator__section');
      let variants = Array.from(fieldset.querySelectorAll('.custom-radio'));

      variants.forEach((item) => item.classList.remove('active'));
    }

    function getValues() {
      let box = {};
      let activeInputs = Array.from(calculator.querySelectorAll('input'));

      activeInputs.forEach((item) => {
        if (item.matches(':checked') || item.type === 'range') {
          box[item.name] = item.value;
        }
      })

      return box;
    }

  }

}

function formAgreeButtonStateController(...names) {

  let labels = [];
  names.forEach((name) => {
    let label = document.querySelector(`label[for="${name}"]`);
    labels.push(label);
  })

  labels.forEach((label) => {
    label.addEventListener('click', (event) => {
      let target = event.target;
      target.classList.remove('invalid');
      target.classList.toggle('active');
    })
  })

}

function saveInitialCalculatorValues() {

  let calculator = document.querySelector('.calculator');

  if (calculator) {
    let radioInputs = calculator.querySelectorAll('input[type="radio"]:checked');

    radioInputs.forEach((item) => {
      item.initial = true;
    })
  }
}

function resetCalculatorValues(form) {

  let radioInputs = form.querySelectorAll('input[type="radio"]');

  radioInputs.forEach((item) => {
    if (item.initial) {

      let label = form.querySelector(`[for=${item.id}]`);
      let fieldset = label.closest('fieldset');
      let labels = fieldset.querySelectorAll('label');

      labels.forEach((item) => {
        item.classList.remove('active');
        item.blur();
      });

      item.click();
      label.classList.add('active');
      
    }
  })

  if (CustomRange) CustomRange.prototype.setInitialButtonsPosition();
  
}

function openPriceCard() {

  let cards = Array.from(document.querySelectorAll('.price-card'));

  if (cards.length > 0) {

    cards.forEach((card) => {
      let moreBtn = card.querySelector('.price-card__more-btn');
      let content = card.querySelector('.price-card__body');
      moreBtn.addEventListener('click', (event) => {
        card.classList.toggle('opened');
        operateContentBlock(content);
        changeButtonText(moreBtn, card);
      })
    })

  }

  function operateContentBlock(element) {
    if (!element.initHeight) element.initHeight = element.offsetHeight;
    let fullHeight = element.scrollHeight;

    if (element.closest('.opened')) {
      element.style.height = fullHeight + 'px';
    } else {
      element.style.height = element.initHeight + 'px';
    }
  }

}

function changeButtonText(button, card) {
  let lang = document.documentElement.lang;
  if (card.matches('.opened')) {

    if (lang === 'ru') {
      button.textContent = 'Свернуть';
    } else {
      button.textContent = 'Згорнути';
    }

  } else {

    if (lang === 'ru') {
      button.textContent = 'Список работ';
    } else {
      button.textContent = 'Список робiт';
    }

  }
}

function dynamicPaddingForFullWidthContainer(mainCon) {

  let containers = document.querySelectorAll('[data-dynamic]');
  let mainContainer = document.querySelector(mainCon);

  if (mainContainer && containers) {

    containers = Array.from(containers);
    operatePaddings();
    window.addEventListener('resize', operatePaddings)

  }

  function operatePaddings() {
    let media = window.matchMedia('(min-width: 769px)').matches;
    if (media) {
      let x = mainContainer.getBoundingClientRect().x;
      let padding = getComputedStyle(mainContainer).paddingLeft;
      padding = parseFloat(padding);

      containers.forEach((item) => {
        item.style.paddingLeft = x + padding + 'px';
      })
    }
  }

}

function replacePreviews() {

  let media = window.matchMedia('(max-width: 1024px)').matches;

  let demonstrators = Array.from(document.querySelectorAll('[data-demo]'));
  demonstrators.forEach((demonstrator) => {

    let preview = demonstrator.querySelector('.demonstration__previews');
    let wrapper = demonstrator.querySelector('.demonstration__screen-wrapper');
    let area = demonstrator.querySelector('.demonstration__watch-area');
    let controls = Array.from(demonstrator.querySelectorAll('.demonstration__control-btn'));

    if (media) {
      wrapper.append(preview);

      controls.forEach((item) => {
        area.append(item);
      })
    }
  })

}

focusStateFix();
smoothDropMenuMobile(671);
calculatorHandler();
formAgreeButtonStateController('popup-terms');
saveInitialCalculatorValues();
openPriceCard();
dynamicPaddingForFullWidthContainer('.page-wrapper');