import { dictionary } from "./dictionary.js";

import { 
  Popup,
  ChangeLanguage,
  DropdownMenu,
  CustomRange
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



focusStateFix();
smoothDropMenuMobile(671);
calculatorHandler();