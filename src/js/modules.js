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

    if (BurgerMenu) BurgerMenu.prototype.closeBurgerMenu(); 

    let scrollToTopBtn = document.querySelector('.scrollToTopBtn');
    if (scrollToTopBtn) {
      scrollToTopBtn.classList.add('hide');
      scrollToTopBtn.classList.remove('active');
    }

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

    if (FormValidator) {
      let inputs = popup.querySelectorAll('input');
      inputs.forEach((input) => {
        let agree = popup.querySelector('.popup__agree');
        FormValidator.prototype.removeWarning(input);
        FormValidator.prototype.cleanAllFields();
        if (agree) {
          if (agree.matches('.active')) agree.click();
          agree.classList.remove('invalid');
        }
      })
    }

    let scrollToTopBtn = document.querySelector('.scrollToTopBtn');
    if (scrollToTopBtn && ScrollToTop) {
      setTimeout(() => {
        scrollToTopBtn.classList.remove('hide');
        ScrollToTop.prototype.scrollHandler();
      }, this.params.delay ?? 100); 
    }
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
      this.backDrop.classList.add('popup-overlay');
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

      document.documentElement.lang = language;

    });

    if (FormValidator) {
      let calculator = document.querySelector('.calculator');
      if (calculator) {
        if (calculator.querySelector('.invalid')) {
          FormValidator.prototype.workOperator(calculator);
        }
      }
    }

    if (this.params.details?.changeButtonText) {
      let cards = Array.from(document.querySelectorAll('.price-card.opened'));
      if (cards.length > 0) {
        cards.forEach((card) => {
          let button = card.querySelector('.price-card__more-btn');
          this.params.details.changeButtonText(button, card);
        })
      }
    }
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


class DropdownMenu {

  constructor(params) {
    this.params = params;
    this.containers = Array.from(document.querySelectorAll(this.params.container));
    this.hoverTimeouts = new Map();
    this.activeDropdown = null;
    this.ownMethodsBinder();
    this.switchActivationType();
    this.setEventListeners();
  }

  setEventListeners() {

    this.containers.forEach((container) => {

      const buttons = Array.from(container.querySelectorAll(this.params.triggerBtn));

      buttons.forEach((button) => {

        const triggerType = button.dataset.dropdown || 'click';

        if (triggerType === 'hover') {
          button.addEventListener('mouseenter', this.handleHoverOpen);
          button.addEventListener('mouseleave', this.handleHoverClose);

          const subMenu = button.nextElementSibling;
          if (subMenu) {
            subMenu.addEventListener('mouseenter', () => clearTimeout(this.hoverTimeouts.get(button)));
            subMenu.addEventListener('mouseleave', () => this.handleHoverClose({ currentTarget: button }));
          }

        } else {
          button.addEventListener('click', this.handleClickOpen);
        }

      });

      container.addEventListener('click', (event) => {
          if (event.target.matches(this.params.link)) {
          this.closeAllSubMenus();
        }
      });

    });

    document.addEventListener('click', (event) => {

      const isDropdownButton = event.target.matches(this.params.triggerBtn);

      const isInsideAnyDropdown = this.containers.some(container => 
        container.contains(event.target)
      );

      if (!isInsideAnyDropdown && !isDropdownButton) {
        this.closeAllSubMenus();
      }

    });

  }

  handleClickOpen(event) {

    const button = event.currentTarget;
    const container = button.closest(this.params.container);
    this.setActiveDropdown(container);

    const subMenu = button.nextElementSibling;
    
    event.stopPropagation();
    event.preventDefault();
    
    this.closeSiblingMenus(button);
    
    const isOpening = !subMenu.classList.contains('active');
    
    if (isOpening) {
      this.addActiveClasses(button, subMenu);
    } else {
      this.removeActiveClasses(button, subMenu);
    }

  }

  handleHoverOpen(event) {

    const button = event.currentTarget;
    const container = button.closest(this.params.container);
    this.setActiveDropdown(container);

    clearTimeout(this.hoverTimeouts.get(button));
    
    const subMenu = button.nextElementSibling;
    if (!subMenu) return;

    const parentMenu = button.closest(this.params.inner) || container;
    const dropInners = Array.from(parentMenu.querySelectorAll(this.params.inner));

    dropInners.forEach(menu => {
      if (menu !== subMenu) {
        this.closeSubMenu(menu);
      }
    });

    this.addActiveClasses(button, subMenu);
    
    const grandParent = button.closest(this.params.inner);

    if (grandParent) {
      grandParent.classList.add('active');
    }

  }

  addActiveClasses(button, subMenu) {

    button.classList.add('active');
    subMenu.classList.add('active');
    
    let parentButton = button.closest(this.params.inner)?.previousElementSibling;

    while (parentButton && parentButton.matches(this.params.triggerBtn)) {
      parentButton.classList.add('active');
      parentButton = parentButton.closest(this.params.inner)?.previousElementSibling;
    }

  }

  removeActiveClasses(button, subMenu) {

    button.classList.remove('active');
    subMenu.classList.remove('active');
    
    subMenu.querySelectorAll(`${this.params.triggerBtn}, ${this.params.inner}`).forEach(el => {
      el.classList.remove('active');
    });
  }

  setActiveDropdown(container) {

    if (this.activeDropdown && this.activeDropdown !== container) {
      this.closeAllSubMenusInContainer(this.activeDropdown);
    }

    this.activeDropdown = container;
  }

  closeAllSubMenusInContainer(container) {

    const dropInners = Array.from(container.querySelectorAll(this.params.inner));
    const buttons = Array.from(container.querySelectorAll(this.params.triggerBtn));
    
    dropInners.forEach(menu => {
      menu.classList.remove('active');
    });
    
    buttons.forEach(button => {
      button.classList.remove('active');
    });
  }

  handleHoverClose(event) {

    const button = event.currentTarget;
    const subMenu = button.nextElementSibling;
    let delay = this.params.delay ?? 100;
    
    const timeoutId = setTimeout(() => {

      if (!subMenu.matches(':hover') && !button.matches(':hover')) {
        this.removeActiveClasses(button, subMenu);
      }

    }, delay);
    
    this.hoverTimeouts.set(button, timeoutId);

  }

  closeSubMenu(subMenu) {
    if (!subMenu) return;
    
    const button = subMenu.previousElementSibling;
    this.removeActiveClasses(button, subMenu);
  }

  closeAllSubMenus(exceptMenu = null) {

    this.containers.forEach(container => {

      const dropInners = Array.from(container.querySelectorAll(this.params.inner));
      const buttons = Array.from(container.querySelectorAll(this.params.triggerBtn));
      
      dropInners.forEach(menu => {
        if (menu !== exceptMenu) {
          menu.classList.remove('active');
        }
      });
      
      buttons.forEach(button => {
        if (exceptMenu && button.nextElementSibling !== exceptMenu) {
          button.classList.remove('active');
        } else if (!exceptMenu) {
          button.classList.remove('active');
        }
      });

    });

  }

  closeSiblingMenus(currentButton) {

    const parentMenu = currentButton.closest('ul') || currentButton.closest(this.params.container);
    const dropInners = parentMenu.querySelectorAll(this.params.inner);
    const buttons = parentMenu.querySelectorAll(this.params.triggerBtn);

    dropInners.forEach(menu => {

      if (menu !== currentButton.nextElementSibling) {
        menu.classList.remove('active');
      }

    });

    buttons.forEach(button => {

      if (button !== currentButton) {
        button.classList.remove('active');
      }

    });
  }

  switchActivationType() {

    let media = this.params.mobileModeOn ?? 768;
    let isMatchMedia = window.matchMedia(`(max-width: ${media}px)`).matches;
    
    if (isMatchMedia) {
      let btns = Array.from(document.querySelectorAll('[data-dropdown="hover"]'));
      btns.forEach((button) => button.setAttribute('data-dropdown', 'click'));
    }

  }

  ownMethodsBinder() {

    const prototype = Object.getPrototypeOf(this);
    const ownMethods = Object.getOwnPropertyNames(prototype);

    for (let item of ownMethods) {
      if (item !== 'constructor') prototype[item] = prototype[item].bind(this);
    }

  }
}


class CustomRange {

  constructor(params) {
    this.params = params;
    this.buttons = Array.from(document.querySelectorAll('[data-range] button'));

    if (this.buttons.length > 0) {
      this.ownMethodsBinder();
      this.setInitialStylesForButtons();
      this.showInitialButtonsValues();
      this.realTimeButtonsValuesUpdate();
      this.setInitialButtonsPosition();
      this.setEventListeners();
    }
  }

  setEventListeners() {
    
    document.addEventListener('pointerdown', (event) => {
      let target = event.target;

      if (target.matches('[data-range] button')) {

        this.button = target;
        let pointerId = event.pointerId;

        this.info = this.getButtonInfo(this.button);
        this.rangeInfo = this.info.range.getBoundingClientRect();
        
        this.button.classList.add('active');
        this.button.setPointerCapture(pointerId);

        this.button.addEventListener('pointerup', (event) => {
          this.button.classList.remove('active');
          this.button.releasePointerCapture(pointerId);
          document.removeEventListener('pointermove', this.pointermoveHandler);
        }, { once: true });

        document.addEventListener('pointermove', this.pointermoveHandler);

      }
    });

    if (this.params.moveButtonToClick) {

      document.addEventListener('click', (event) => {
        let target = event.target;

        if (target.closest('[data-range]') && !target.closest('button')) {

          let range = target.closest('[data-range]');
          let [ nearestButton, buttonsCount ] = this.getNearestButton(range, event.clientX);
          let rangeX = event.clientX - range.getBoundingClientRect().x;

          this.moveButtons(nearestButton, rangeX, event.clientX);

        }

      });

    }

  }

  pointermoveHandler(event) {
    if (this.button.matches('.active')) {
      let button = this.button;
      let x = event.clientX - this.rangeInfo.x;
      this.moveButtons(button, x, event.clientX);
    }
  }

  getNearestButton(range, clientX) {
    let box = [];
    let buttons = Array.from(range.querySelectorAll('button'));

    buttons.forEach((button) => {
      let halfButton = button.offsetWidth / 2;
      let info = button.getBoundingClientRect();
      let difference = Math.abs((info.x + halfButton) - clientX);
      box.push({item: button, dif: difference});
    })

    box.sort((a, b) => a.dif - b.dif);

    return [ box[0].item, buttons.length ];
  }

  getDistanceBetwenButtons(button, clientX) {

    if (this.buttons.length > 1) {

      let buttonInfo = this.getButtonInfo(button);
      let otherButton;

      if (buttonInfo.side === 'left') {
        otherButton = buttonInfo.range.querySelector('[data-range-right] button');
      } else {
        otherButton = buttonInfo.range.querySelector('[data-range-left] button');
      }

      let otherButtonX = otherButton ? otherButton.getBoundingClientRect().x : null;
      let distance;

      if (buttonInfo.side === 'left') {
        distance = -((clientX - buttonInfo.halfButton) - otherButtonX);
      } else {
        distance = (clientX - buttonInfo.halfButton) - otherButtonX;
      }

      return distance;

    } else {
      return 1e6;
    }

  }

  setInitialButtonsPosition() {
    this.buttons.forEach((button) => {
      if (button.hasAttribute('data-range-start')) {

        let startPosition = +button.dataset.rangeStart;
        let buttonInfo = this.getButtonInfo(button);
        let cord = (startPosition * buttonInfo.range.offsetWidth) / (buttonInfo.input.max - buttonInfo.input.min);
        let clientX = cord + buttonInfo.range.getBoundingClientRect().x;

        this.moveButtons(button, cord, clientX);
      }
    })
  }

  moveButtons(button, x, clientX) {

    let subline = button.parentElement;
    let side = subline.hasAttribute('data-range-left') ? 'left' : 'right';
    let rangeWidth = button.closest('[data-range]').offsetWidth;
    let distanceBetweenButtons = this.getDistanceBetwenButtons(button, clientX);
    let offset = this.params.minOffsetBetweenButtons;

    if (offset) {
      offset < 0 ? offset = 0 : offset;
    } else {
      offset = button.offsetWidth;
    }

    if (distanceBetweenButtons > offset) {

      if (x <= rangeWidth && x >= 0) {

        if (side === 'left') {
          button.style.transform = `translate(${x}px, -50%)`;
          subline.style.width = x + 'px';
        } else {
          button.style.transform = `translate(${x - rangeWidth}px, -50%)`;
          subline.style.width = rangeWidth - x + 'px';
        }

      } else {

        let input = button.parentElement.querySelector('input');

        if (x < 1) {

          if (side === 'left') {
            button.style.transform = `translate(${0}px, -50%)`;
            subline.style.width = '0px';
            this.transferValueDataFromButton(input, input.min);
          } else {
            button.style.transform = `translate(-${rangeWidth}px, -50%)`;
            subline.style.width = rangeWidth + 'px';
            this.transferValueDataFromButton(input, input.min);
          }

        } else if (x > rangeWidth) {

          if (side === 'left') {
            button.style.transform = `translate(${rangeWidth}px, -50%)`;
            subline.style.width = rangeWidth + 'px';
            this.transferValueDataFromButton(input, input.max - 1);
          } else {
            button.style.transform = `translate(${0}px, -50%)`;
            subline.style.width = '0px';
            this.transferValueDataFromButton(input, input.max - 1);
          }

        }

      }

    }
  }

  realTimeButtonsValuesUpdate() {

    let observer = new MutationObserver((list, observer) => {

      list.forEach((item) => {
        let button = item.target;
        let info = this.getButtonInfo(button);
        this.transferValueDataFromButton(info.input, info.value);
        let event = new InputEvent('input', { bubbles: true });
        info.input.dispatchEvent(event);
      })
      
    });

    this.buttons.forEach((button) => observer.observe(button, { attributes: true }));

  }

  showInitialButtonsValues() {
    this.buttons.forEach((button) => {
      let info = this.getButtonInfo(button);
      this.transferValueDataFromButton(info.input, info.value);
    })
  }

  transferValueDataFromButton(input, value) {
    let output = document.querySelector(`[data-range-show="${input.id}"]`);
    input.value = value;
    output.textContent = input.value;
  }

  getButtonInfo(button) {
    let range = button.closest('[data-range]');
    let halfButton = button.offsetWidth / 2;
    let buttonInfo = button.getBoundingClientRect();
    let rangeInfo = range.getBoundingClientRect();
    let input = button.parentElement.querySelector('input');
    let min = input.min, max = input.max;
    let subline = button.parentElement;
    let side = subline.hasAttribute('data-range-left') ? 'left' : 'right';

    let clientX = buttonInfo.x + halfButton;
    let rangeX = clientX - rangeInfo.x;

    let percent = (rangeX * 100) / rangeInfo.width;
    let value = Math.round(max - min) * (percent / 100);

    return {
      clientX: clientX, 
      rangeX: rangeX, 
      percent: percent, 
      value: value, 
      halfButton: halfButton,
      input: input,
      subline: subline,
      side: side,
      range: range
    };
  }

  setInitialStylesForButtons() {
    this.buttons.forEach((button) => {

      let info = this.getButtonInfo(button);

      info.range.style.cssText = 'position: relative';

      if (info.side === 'left') {
        info.subline.style.cssText = 'position: absolute; top: 0; left: 0; width: 0px;  height: 100%;';
        button.style.cssText = `position: absolute; top: 50%; left: -${info.halfButton}px; transform: translateY(-50%)`;
      } else {
        info.subline.style.cssText = 'position: absolute; top: 0; right: 0; width: 0px;  height: 100%;';
        button.style.cssText = `position: absolute; top: 50%; right: -${info.halfButton}px; transform: translateY(-50%)`;
      }
    })
  }

  ownMethodsBinder() {
    let prototype = Object.getPrototypeOf(this);
    let ownMethods = Object.getOwnPropertyNames(prototype);
    for (let item of ownMethods) {
      if (item !== 'constructor') prototype[item] = prototype[item].bind(this);
    }
  }

}


class FormValidator {

  constructor(params) {
    this.params = params;
    this.ownMethodsBinder();
    this.getMaskCode();
    this.setEventListeners();
  }

  async getMaskCode() { 
    let code = await import('https://unpkg.com/imask');
    this.setPhoneMask();
  }

  setPhoneMask() {
    let telInputs = Array.from(document.querySelectorAll('[data-validate][type="tel"]'));

    if (telInputs.length > 0 && this.params.phoneMask) {
      this.masks = {};
      let opt = this.params.phoneMask;
      telInputs.forEach((input) => {
        let mask = IMask(input, { ...opt });
        this.masks[input.id] = mask;
      })
    }
  }

  setEventListeners() {

    if (this.params.realTimeCheck) {
      window.addEventListener('input', (event) => {
        let form = event.target.form;
        this.workOperator(form, event.target);
      })
    }

    if (this.params.hideWarningOnClick) {
      window.addEventListener('click', (event) => {
        if (event.target.matches('[data-validate]')) {
          this.removeWarning(event.target);
        } 
      })
    }

    window.addEventListener('submit', (event) => {
      event.preventDefault();
      let form = event.target;
      this.workOperator(form);
    })
  }

  workOperator(form, currentInput) {

    let inputs = form.querySelectorAll('[data-validate]');

    if (currentInput) {
      this.validateTextFields(currentInput);
      this.validatePhoneFields(currentInput);
      this.validateCheckboxFields(currentInput);
    } else {

      inputs.forEach((input) => {
        this.validateTextFields(input);
        this.validatePhoneFields(input);
        this.validateCheckboxFields(input);
      });

    }

    let validInputsCount = form.querySelectorAll('[data-validate].valid').length;

    if (inputs.length === validInputsCount && !currentInput) {
      this.cleanAllFields();
      this.openFinalPopup(form);

      if (form.matches('.calculator') && this.params.resetCalculator) this.params.resetCalculator(form);
      if (form.matches('.popup--ask')) {
        let label = form.querySelector('.popup__agree');
        label.click();
      }
    }

  }

  openFinalPopup(form) {
    let submitButton = form.querySelector('[type="submit"]');
    submitButton.setAttribute('data-popup', 'popup--answer');
    submitButton.click();
    submitButton.removeAttribute('data-popup');
  }

  validatePhoneFields(input) {

    if (input.type === 'tel' && this.params.phoneMask) {

      let lang = document.documentElement.lang;
      let opt = this.params.phoneMask;
      let value = input.value.trim();
      let cleanValue = value ? value.match(/\d/g).join('') : '';
      let digitsCount = opt.mask.match(/\d/g).join('').length;
      let phoneCodeLength = opt.mask.match(/\{\d+\}/)[0].length - 2;
      
      let totalCheck = new RegExp(`\\d{${digitsCount}}`, '');
      let isEmpty = cleanValue.length === phoneCodeLength ? true : false;

      if (totalCheck.test(cleanValue)) {

        this.removeWarning(input);
        input.classList.add('valid');

      } else {

        if (isEmpty) {
          let text = lang === 'ru' ? 'Введите номер телефона' : 'Введiть номер телефону';
          this.showErrorWarning(input, text);
        } else if (!totalCheck.test(cleanValue)) {
          let text = lang === 'ru' ? 'Введите номер полностью' : 'Введiть номер повнiстю';
          this.showErrorWarning(input, text);
        }

      }

    }
  }

  validateTextFields(input) {

    if (input.type === 'text' || input.tagName === 'TEXTAREA') {

      let value = input.value.trim();
      let lang = document.documentElement.lang;

      let minSymbolsCount = 2;
      let isEmpty = value.length > 0 ? false : true;
      let forbiddenSymbols = /[0-9\!@#\$%\^&\*\(\)\-_\+\=\/\.\?\>\<";:\[\]\{\}\|]/i;

      if (isEmpty) {
        let text = lang === 'ru' ? 'Введите имя' : 'Введiть ім\'я';
        this.showErrorWarning(input, text);
      } else if (forbiddenSymbols.test(value)) {
        let text = lang === 'ru' ? 'Запрещенный символ' : 'Заборонений символ';
        this.showErrorWarning(input, text);
      } else if (value.length < minSymbolsCount) {
        let text = lang === 'ru' ? 'Минимум 2 буквы' : 'Мiнiмум 2 букви';
        this.showErrorWarning(input, text);
      }  else if (value) {
        this.removeWarning(input);
        input.classList.add('valid');
      }

    }
  }

  validateCheckboxFields(input) {

    if (input.type === 'checkbox') {

      let label = input.form.querySelector(`[for="${input.id}"]`);

      if (!input.checked) {
        label.classList.add('invalid');
        input.classList.add('invalid');
      } else {
        label.classList.remove('invalid');
        input.classList.remove('invalid');
        input.classList.add('valid');
      }

    }

  }

  cleanAllFields() {
    let fields = Array.from(document.querySelectorAll('[data-validate]'));

    fields.forEach((field) => {
      field.classList.remove('valid');
      if (field.type === 'tel') {
        this.masks[field.id].value = ''; 
      } else {
        field.value = '';
      }
      
    })
  }

  showErrorWarning(item, text) {
    let warningField = this.getWarningField(item);
    item.classList.remove('valid');
    item.classList.add('invalid');
    if (warningField) {
      warningField.classList.add('active');
      warningField.textContent = text;
    }
  }

  removeWarning(item) {
    let warningField = this.getWarningField(item);
    if (warningField) {
      item.classList.remove('invalid');
      warningField.classList.remove('active');
      warningField.textContent = '';
    }
  }

  getWarningField(item) {
    let form = item.form;
    let id = item.id;
    let warningField = form.querySelector(`[data-validate-warn="${id}"]`);
    return warningField;
  }

  ownMethodsBinder() {
    let prototype = Object.getPrototypeOf(this);
    let ownMethods = Object.getOwnPropertyNames(prototype);
    for (let item of ownMethods) {
      if (item !== 'constructor') prototype[item] = prototype[item].bind(this);
    }
  }

}


class BurgerMenu {

  constructor(params) {
    this.params = params;
    this.ownMethodsBinder();
    this.getElements();
    this.runMethods();
  }

  runMethods() {
    let media = this.params.activationBreakpoint ?? 768;
    let mediaOk = window.matchMedia(`(max-width: ${media}px)`).matches;

    if (mediaOk && this.openButton && this.content && this.closeButton) {
      this.createOverlay();
      this.setEventListeners();
    }
  }

  setEventListeners() {
    document.addEventListener('click', (event) => {
      let target = event.target;

      if (target.closest('[data-burger-open]')) {
        this.openBurgerMenu();
      }

      if (target.closest('a')) {
        this.closeBurgerMenu();
      }

      if (target.closest('[data-burger-close]')) {
        this.closeBurgerMenu();
      }

      if (!target.closest('[data-burger-content]') && !target.closest('[data-burger-open]') && this.params.closeByClickOutOfMenu) {
        this.closeBurgerMenu();
      }

    })
  }

  openBurgerMenu() {
    this.openButton.classList.toggle('active');
    this.content.classList.toggle('active');
    this.closeButton.classList.toggle('active');
    this.overlay ? this.overlay.classList.toggle('active') : null;
    
    this.handlePageOverflow();
  }

  closeBurgerMenu() {
    this.openButton.classList.remove('active');
    this.content.classList.remove('active');
    this.closeButton.classList.remove('active');
    this.overlay ? this.overlay.classList.remove('active') : null;

    this.handlePageOverflow();
  }

  handlePageOverflow() {
    let burgerActive = this.content.matches('.active');
    let scrollOffset = window.innerWidth - document.documentElement.clientWidth;

    if (burgerActive) {
      document.body.style.overflow = "hidden";
      document.body.style.paddingRight = scrollOffset + 'px';
    } else {
      document.body.style.overflow = '';
      document.body.style.paddingRight = '';
    }
  } 

  createOverlay() {
    if (this.params.needOverlay) {
      this.overlay = document.createElement('div');
      this.overlay.classList.add('burger-overlay');
      document.body.append(this.overlay);
    }
  }

  getElements() {
    this.openButton = document.querySelector('[data-burger-open]');
    this.closeButton = document.querySelector('[data-burger-close]');
    this.content = document.querySelector('[data-burger-content]');
  }

  ownMethodsBinder() {
    let prototype = Object.getPrototypeOf(this);
    let ownMethods = Object.getOwnPropertyNames(prototype)
    for (let item of ownMethods) {
      if (item !== 'constructor') prototype[item] = prototype[item].bind(this);
    }
  }

}

class ScrollToTop {

  constructor(params) {
    this.params = params;
    this.clientWidth = document.documentElement.clientWidth;
    this.button = document.querySelector('[data-item="scrollToTop"]');

    if (this.button) {
      this.ownMethodsBinder();
      this.setEventListeners();  
    }
  }

  setEventListeners() {
    window.addEventListener('scroll', this.scrollHandler);
    window.addEventListener('resize', this.updateClientWidth);
    document.addEventListener('DOMContentLoaded', this.scrollHandler);
    this.button.addEventListener('pointerup', this.moveToTop);
  }

  moveToTop() {
    window.scrollTo({top: 0, behavior: 'smooth'});
    this.button.blur();
    this.button.classList.add('off');
  }

  updateClientWidth() {
    this.clientWidth = document.documentElement.clientWidth;
  }

  getActivationCoordinate() {
    let activationCoordinate;
    for (let key in this.params) {
      let [min, max] = key.split('-');
      min = +min;
      max = +max;
      if (this.clientWidth >= min && this.clientWidth <= max) { 
        activationCoordinate = this.params[key];
        break;
      } else {
        activationCoordinate = this.params.default;
      }
    }
    return activationCoordinate ? activationCoordinate : 900;
  }

  controlButton(state) {
    if (state) {
      this.button.classList.add('active');
    } else {
      this.button.classList.remove('active');
      this.button.classList.remove('off');
    }
  }

  scrollHandler() {
    let coordinate = this.getActivationCoordinate();
    let scrollY = window.pageYOffset;
    
    if (scrollY >= coordinate) {
      this.controlButton(true)
    } else {
      this.controlButton(false)
    }
  }

  ownMethodsBinder() {
    let prototype = Object.getPrototypeOf(this);
    let ownMethods = Object.getOwnPropertyNames(prototype)
    for (let item of ownMethods) {
      if (item !== 'constructor') prototype[item] = prototype[item].bind(this);
    }
  }

}


export { Popup, ChangeLanguage, DropdownMenu, CustomRange, FormValidator, BurgerMenu, ScrollToTop };