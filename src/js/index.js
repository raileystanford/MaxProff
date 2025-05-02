import { dictionary } from "./dictionary.js";

import { 
  Popup,
  ChangeLanguage,
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

{ // Elements focus state fixed

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