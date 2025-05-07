import { dictionary } from "./dictionary.js";

import { 
  Popup,
  ChangeLanguage,
  DropdownMenu
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



focusStateFix();
smoothDropMenuMobile(671);