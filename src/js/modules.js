class Popup {

  constructor(params) {
    this.params = params;
    this.scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    this.createBackdrop();
    this.ownMethodsBinder();
    this.setEventListeners();
  }

  setEventListeners() {
    window.addEventListener('click', this.mouseOperator);
    if (this.params.escButtonClose) {
      window.addEventListener('keydown', this.keyboardOperator);
    }
  }

  mouseOperator(event) {

    let target = event.target;
    let btn = this.getButton(event);
    
    if (btn) {
      this.popupClass = `.${btn.dataset.popup}`;
      this.popup = document.querySelector(this.popupClass);
      this.openPopup(this.popup);
    }

    if (target.closest('[data-popup-close]')) {
      this.closePopup(this.popup);
    }

    if (!target.closest(this.popupClass) && !target.closest('[data-popup]') && !this.params.closeOnBtn) {
      this.closePopup(this.popup);
    }
  }

  keyboardOperator(event) {
    if (event.key === "Escape") {
      this.popup ? this.closePopup(this.popup) : null;
    }
  }

  openPopup(popup) {
    if (this.previousPopup) this.previousPopup.classList.remove('active');
    this.previousPopup = popup;
    popup.classList.add('active');
    if (this.params.backDrop) this.backDrop.classList.add('active');
    document.body.style.overflow = 'hidden';
    if (window.matchMedia('(min-width: 769px)').matches) document.body.style.paddingRight = this.scrollbarWidth + 'px';
  }

  closePopup(popup) {
    let delay = this.params.delay ? this.params.delay : 0;
    popup.classList.remove('active');
    if (this.params.backDrop) this.backDrop.classList.remove('active');
    setTimeout(() => {
      document.body.style.overflow = '';
      document.body.style.paddingRight = '';
    }, delay);
  }

  getButton(event) {
    let target = event.target;
    if (target.closest('[data-popup]')) {
      return target.closest('[data-popup]'); 
    }
  }

  createBackdrop() {
    if (this.params.backDrop) {
      this.backDrop = document.createElement('div');
      this.backDrop.classList.add('overlay');
      document.body.prepend(this.backDrop);
    }
  }

  ownMethodsBinder() {
    let prototype = Object.getPrototypeOf(this);
    let ownMethods = Object.getOwnPropertyNames(prototype)
    for (let item of ownMethods) {
      if (item !== 'constructor') prototype[item] = prototype[item].bind(this);
    }
  }

  previousPopup;
}


class ChangeLanguage {

  constructor(params) {
    this.params = params;
    this.elements = Array.from(document.querySelectorAll('[data-lang]'));
    this.controls = Array.from(document.querySelectorAll('[data-lang-controls]'));

    if (this.elements && this.controls) {
      this.ownMethodsBinder();
      this.getLanguages();
      if (this.params.autoSet) this.languageAutoSet();
      this.setEventListeners();
    }
  }

  setEventListeners() {
    if (this.elements && this.controls) {
      window.addEventListener('click', this.workOperator);
    }
  }

  workOperator(event) {
    let target = event.target;

    if (target.closest('[data-lang-var]')) {
      let button = target.closest('[data-lang-var]');
      let language = button.dataset.langVar;
      let dictionary = this.params.dictionary;

      this.buttonActiveState(button);
      this.changeLaguage(dictionary, language);
    }
  }

  async languageAutoSet() {
    this.screenBlocker();
    let request = await fetch('https://ipapi.co/json/');
    if (request.ok) {
      let response = await request.json();
      let countryCode = response.country_code.toLowerCase();
      let langPresense = this.langList.some((item) => item === countryCode);
      
      if (langPresense) this.changeLaguage(this.params.dictionary, countryCode);

      let btn = document.querySelector(`[data-lang-var="${countryCode}"]`);
      this.buttonActiveState(btn);

      if (this.params.screenBlock) this.screenBlock.remove();
    }
  }

  changeLaguage(dictionary, language) {
    this.elements.forEach((item) => {
      let innerHTML = item.dataset.lang.match(/\*/);
      let elementKey = item.dataset.lang.match(/[^\*]+/g)[0];
      
      if (item.tagName === 'PICTURE') {
        let source = item.querySelector('source');
        let img = item.querySelector('img');
        source.srcset = dictionary[elementKey][language]['webp'];
        img.src = dictionary[elementKey][language]['img'];
        img.alt = dictionary[elementKey][language]['alt'];
        return;
      }

      if (item.tagName === 'IMG') {
        item.src = dictionary[elementKey][language]['img'];
        item.alt = dictionary[elementKey][language]['alt'];
        return;
      }

      if (item.tagName === 'INPUT') {
        item.placeholder = dictionary[elementKey][language];
        return;
      }

      let content = dictionary[elementKey][language];

      if (content) {
        if (innerHTML) {
          item.innerHTML = content;
        } else {
          item.textContent = content;
        }
      }

    });
  }

  getLanguages() {
    this.langList = [];
    this.controls.forEach((control) => {
      let btns = Array.from(control.querySelectorAll('[data-lang-var]'));
      btns.forEach((item) => {
        this.langList.push(item.dataset.langVar);
      })
    })
  }

  buttonActiveState(button) {
    let code = button.dataset.langVar;

    this.controls.forEach((control) => {
      let btns = Array.from(control.querySelectorAll('[data-lang-var]'));
      btns.forEach((item) => {
        item.classList.remove('active');
      })
    })

    this.activateSameButtons(code);
  }

  activateSameButtons(code) {
    let buttons = Array.from(document.querySelectorAll(`[data-lang-var="${code}"]`));
    buttons.forEach((item) => item.classList.add('active'));
  }

  screenBlocker() {
    this.screenBlock = document.createElement('div');
    this.screenBlock.classList.add('lang-screen-block');
    this.screenBlock.style.cssText = 'position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; z-index: 100; background: white;';
    document.body.prepend(this.screenBlock);
  }

  ownMethodsBinder() {
    let prototype = Object.getPrototypeOf(this);
    let ownMethods = Object.getOwnPropertyNames(prototype)
    for (let item of ownMethods) {
      if (item !== 'constructor') prototype[item] = prototype[item].bind(this);
    }
  }
}

export { Popup, ChangeLanguage };