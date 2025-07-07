import { dictionary, dem_dictionary, explain_dictionary } from "./dictionary.js";

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
  LazyLoad,
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
    stabilizator: indicatorsStabilizator,
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
  mobileViewport: 769,
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

new ScrollToTop({
  '769-1600': 1000,
  '501-769': 1400,
  '386-501': 1600,
  '300-385': 1300,
});

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
  slidesOffsetBefore: 20,
  slidesOffsetAfter: 25,
  resistance: true,
  resistanceRatio: 0,
  touchRatio: 1,

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

const command__swiper = new Swiper('.workers-slider__slider', {
  
  slidesPerView: 1,
  spaceBetween: 2,
  autoHeight: true,

  pagination: {
    el: '.swiper-pagination2',
    type: 'bullets',
    clickable: true,
  },

  navigation: {
    nextEl: '.workers-slider__button--next',
    prevEl: '.workers-slider__button--prev',
  },

  on: {
    slideChange: updateWorkersIndicator,
    init: updateWorkersIndicator,
  }

  // simulateTouch: true,
  // spaceBetween: 21, 
  // slidesOffsetBefore: 20,
  // slidesOffsetAfter: 25,
  // resistance: true,
  // resistanceRatio: 0,
  // touchRatio: 1,

  // freeMode: {
  //   enabled: true,
  //   momentum: false,
  // },

  // breakpoints: {
  //   769: {
  //     slidesOffsetAfter: 25,
  //   },
  //   386: {
  //     spaceBetween: 23,
  //   },
  //   300: {
  //     slidesOffsetAfter: 15,
  //     spaceBetween: 15,
  //   }
  // }
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
    //   interval: 2000, 
    //   stopOnHover: true, 
    //   playOnViewport: true, 
    // }, 

    startPicture: 0, 
    dictionary: dem_dictionary,
    jobsClases: 'info-card__list-item text3',
  
  }
  
});

new ImageZoom('[data-zoom]', {
  mode: 'hover',
  startZoom: 1.4, 
  minZoom: 1,
  maxZoom: 2,
  zoomStep: 0.2,
  mobileViewport: 769,
});

new LazyLoad({
  offset: 900,
});

new Swiper('.action__slider', {

  slidesPerView: 3,
  spaceBetween: 12,
  centeredSlides: true,
  initialSlide: 1,

  navigation: {
    nextEl: '.action__slider-btn--next',
    prevEl: '.action__slider-btn--prev',
  },

  pagination: {
    el: '.action__slider-pagination',
    type: 'bullets',
    clickable: true,
  },

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

function openMorePromotions() {

  let container = document.querySelector('.promotions__items');
  let button = document.querySelector('.promotions__button');
  let element = container.querySelector('.promotion');
  let isMobile = window.matchMedia('(max-width: 768px)').matches;

  if (container && button && element && !isMobile) {

    let conStyles = getComputedStyle(container);
    let conPadBot = parseFloat(conStyles.paddingBottom);
    let conPadTop = parseFloat(conStyles.paddingTop);
    let elementHeight = element.offsetHeight;
    let comboHeight = elementHeight + conPadBot + conPadTop;
    let fullHeight = container.scrollHeight;
  
    container.style.height = comboHeight + 'px';
    
    button.addEventListener('click', (event) => {

      let lang = document.documentElement.lang;
      elementHeight = element.offsetHeight;
      comboHeight = elementHeight + conPadBot + conPadTop;
      fullHeight = container.scrollHeight;

      if (container.matches('.open')) {

        button.textContent = lang === 'ru' ? 'Все акции' : 'Усі акції';
        container.classList.remove('open');
        container.style.height = comboHeight + 'px';
        button.scrollIntoView({ block: 'end', behavior: 'smooth' });

      } else {

        button.textContent = lang === 'ru' ? 'Свернуть' : 'Згорнути';
        container.style.height = fullHeight + 'px';
        container.classList.add('open');

      }
      
    });

  }

}

function changePromotionBlockToSlider() {

  let container = document.querySelector('.promotions__items');
  let media = window.matchMedia('(max-width: 768px)').matches;
  let button = document.querySelector('.promotions__button');

  if (container && media) {

    let wrapper = document.createElement('div');
    wrapper.classList.add('swiper-wrapper');
    container.prepend(wrapper);
    container.classList.add('swiper');
    let maxHeight = [];

    let items = Array.from(container.querySelectorAll('.promotion'));
    items.forEach((item) => {

      item.classList.remove('promotion--hidden');
      let slide = document.createElement('div');
      slide.classList.add('swiper-slide');
      slide.append(item);
      wrapper.append(slide);
      maxHeight.push(item.offsetHeight);

    });

    maxHeight = Math.max(...maxHeight);
    items.forEach((item) => item.style.height = maxHeight + 'px');

    let pagination = document.createElement('div');
    pagination.classList.add('swiper-pagination1', 'pagination');
    container.append(pagination);

    button ? button.remove() : null;

    new Swiper('.promotions__items', {

      spaceBetween: 13, 

      // autoplay: {
      //   delay: 2000,
      //   disableOnInteraction: true,
      // },

      pagination: {
        el: '.swiper-pagination1',
        type: 'bullets',
        clickable: true,
      },

      breakpoints: {
        672: {
          slidesPerView: 2.52,
        },
        501: {
          slidesPerView: 1.8,
        },
        319: {
          slidesPerView: 1,
        },
      }

    });

  }

}

function explanationHandler() {

  let media = window.matchMedia('(min-width: 1025px)').matches;

  if (media) {

    let cards = Array.from(document.querySelectorAll('.explanation__card'));
    let bullets = Array.from(document.querySelectorAll('.explanation__bullet'));
    let container = document.querySelector('.explanation__cards');
    let line = document.querySelector('.explanation__line');
    let lineInfo = line.getBoundingClientRect();
    let currentPopup, innerLine, currentIndex, prevIndex;

    if (cards.length > 0 && bullets.length > 0 && explain_dictionary && container) {

      createInnerLine();
      createPopups();

      document.addEventListener('mouseover', (event) => {
        let target = event.target;

        if (target.closest('.explanation__card')) {
          let element = target.closest('.explanation__card');
          activatePopup(element);
        }
      });

      container.addEventListener('pointerleave', (event) => {
        innerLine.style.width = '0px';
        bullets.forEach((item) => item.classList.remove('active'));
      });

    }

    function activatePopup(element) {

      prevIndex = currentIndex;

      let index = cards.findIndex((item) => item === element);
      let bullet = bullets.at(index);
      let popup = bullet._popup;
      let lang = document.documentElement.lang;
      let text = explain_dictionary.at(index)[lang];

      activateAllBulletsBeforeActive(index);
    
      popup.firstElementChild.textContent = text;
      controlSizeOfInnerLine(bullet);

      popup.classList.add('active');

      currentPopup = popup;
      currentIndex = index;

      if (prevIndex > currentIndex) {
        bullets.at(prevIndex).classList.remove('active');
      }

      element.addEventListener('mouseout', (event) => {
        currentPopup.classList.remove('active');
      }, { once: true });

    }

    function activateAllBulletsBeforeActive(index1) {

      bullets.forEach((bullet, index) => {

        if (index <= index1) {
          bullet.classList.add('active');
        }

      })

    }

    function controlSizeOfInnerLine(bullet) {

      let bulletInfo = bullet.getBoundingClientRect();
      let x = bulletInfo.x + (bulletInfo.width / 2);
      let width = Math.trunc(x - lineInfo.x);
      
      innerLine.style.width = width + 'px';

    }

    function createInnerLine() {

      if (line) {
        innerLine = document.createElement('div');
        innerLine.classList.add('explanation__progress');
        line.append(innerLine);
      }

    }

    function createPopups() {

      bullets.forEach((bullet) => {

        bullet._popup = document.createElement('div');
        bullet._popup.classList.add('explanation__description');
        let inner = document.createElement('div');
        inner.classList.add('explanation__description-inner', 'text10');
        bullet._popup.append(inner);
        bullet.append(bullet._popup);

      })

    }

  }

}

function autoCountQaCards() {

  let container = document.querySelector('.quality__methods');
  let cards = container ? Array.from(container.querySelectorAll('.qa-card')) : [];

  cards.forEach((card, index) => {

    let inner = `
      <span class="qa-card__cur-count">${index + 1}</span> / <span class="qa-card__total-count">${cards.length}</span>`;
    let area = card.querySelector('.qa-card__count');

    if (area) area.innerHTML = inner;

  })

}

function setSliderToReviewsBlock() {

  let block = document.querySelector('.reviews');
  let media = window.matchMedia('(max-width: 768px)').matches;

  if (block && media) {

    let reviews = Array.from(block.querySelectorAll('.review'));

    prepareContainer(block);
    reviews.forEach((review) => replaceElements(review));

    new Swiper('.reviews__items', {

      spaceBetween: 0, 
      slidesPerView: 1,

      // autoplay: {
      //   delay: 2000,
      //   disableOnInteraction: true,
      // },

      pagination: {
        el: '.reviews__swiper-pagination',
        type: 'bullets',
        clickable: true,
      },

      // breakpoints: {
      //   // 672: {
      //   //   slidesPerView: 2.52,
      //   // },
      //   // 501: {
      //   //   slidesPerView: 1.8,
      //   // },
      //   // 319: {
          
      //   // },
      // }

    });

  }

  function prepareContainer(block) {

    let container = block.querySelector('.reviews__items');

    if (container) {

      let wrapper = document.createElement('div');
      wrapper.classList.add('swiper-wrapper');
      container.classList.add('swiper');
      container.prepend(wrapper);

      let radios = document.createElement('div');
      radios.classList.add('reviews__swiper-pagination', 'pagination');
      container.append(radios);

    }

  }

  function replaceElements(element) {

    let container = element.parentElement;
    let wrapper = container.firstElementChild;
    let slide = document.createElement('div');

    slide.classList.add('swiper-slide');
    slide.append(element);
    wrapper.append(slide);

  }

}

function updateWorkersIndicator() {

  let activeIndex = this.activeIndex;
  let bullets = Array.from(document.querySelectorAll('.workers-slider__indicator'));
  let jobs = Array.from(document.querySelectorAll('.workers-slider__job'));

  if (bullets.length > 0 && jobs.length > 0) {

    if (this.prevBullet) this.prevBullet.classList.remove('active');
    if (this.prevJob) this.prevJob.classList.remove('active');

    let bullet = bullets.at(activeIndex);
    let job = jobs.at(activeIndex);

    bullet.classList.add('active');
    job.classList.add('active');

    this.prevBullet = bullet;
    this.prevJob = job;

  }
}

function operateWorkersUndicators() {

  let bullets = Array.from(document.querySelectorAll('.workers-slider__indicator'));
  let jobs = Array.from(document.querySelectorAll('.workers-slider__job'));

  if (bullets.length > 0 && jobs.length > 0 && command__swiper) {

    document.addEventListener('click', (event) => {
      let target = event.target;

      if (target.closest('.workers-slider__job')) {

        let item = target.closest('.workers-slider__job');
        handler(jobs, item);

      } else if (target.closest('.workers-slider__indicator')) {

        let item = target.closest('.workers-slider__indicator');
        handler(bullets, item);

      }

    });

  }

  function handler(arr, item) {

    let index = arr.findIndex((elem) => elem === item);
    arr.forEach((item) => item.classList.remove('active'));
    item.classList.add('active');
    command__swiper.slideTo(index);
    
  }

}

function indicatorsStabilizator() {

  let bullets = Array.from(document.querySelectorAll('.workers-slider__indicator'));
  let jobs = Array.from(document.querySelectorAll('.workers-slider__job'));
  let line = document.querySelector('.workers-slider__line');
  let bulletsCon = document.querySelector('.workers-slider__indicators');
  let conInfo = bulletsCon ? bulletsCon.getBoundingClientRect() : null;
  let media = window.matchMedia('(min-width: 1025px)').matches;
  let bulletsInfo = [];

  if ((bullets.length === jobs.length) && conInfo && line && media) {

    jobs.forEach((job, index) => {

      let bullet = bullets.at(index);
      let info = job.getBoundingClientRect();
      let x = (info.x + info.width / 2) - conInfo.x;
      let bulletX = x - (bullet.offsetWidth / 2);
      
      bullet.style.left = bulletX + 'px';
      if (index === 0 || index === bullets.length - 1) bulletsInfo.push(bullet.getBoundingClientRect());

    });

    let bulletStart = bulletsInfo[0];
    let bulletEnd = bulletsInfo[1];
    let width = (bulletEnd.x + bulletEnd.width / 2) - (bulletStart.x + bulletStart.width / 2);
    
    line.style.width = width + 'px';
    line.style.left = (bulletStart.x + (bulletStart.width / 2)) - conInfo.x + 'px';
   
  }

}


focusStateFix();
smoothDropMenuMobile(671);
calculatorHandler();
formAgreeButtonStateController('popup-terms');
saveInitialCalculatorValues();
openPriceCard();
dynamicPaddingForFullWidthContainer('.page-wrapper');
openMorePromotions();
changePromotionBlockToSlider();
explanationHandler();
autoCountQaCards();
setSliderToReviewsBlock();
operateWorkersUndicators();
indicatorsStabilizator();