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
    let activeInputs = Array.from(calculator.querySelectorAll('input:checked'));

    activeInputs.forEach((item) => {
      console.log(item);
      box[item.name] = item.value;
    })

    return box;
  }

}



focusStateFix();
smoothDropMenuMobile(671);
calculatorHandler();