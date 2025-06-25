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

    if (ImageDemonstrator) {

      let containers = Array.from(document.querySelectorAll('[data-demo]'));
      containers.forEach((container) => {
        let image = container._startImage;
        ImageDemonstrator.prototype.changeCaptionInfo(image);
      })

    }

    let promCon = document.querySelector('.promotions__items');
    if (promCon) {

      let element = promCon.querySelector('.promotion');
      let info = getComputedStyle(promCon);
      let padTop = parseFloat(info.paddingTop);
      let padBot = parseFloat(info.paddingBottom);

      if (promCon.matches('.open')) {
        promCon.style.height = promCon.scrollHeight + padBot + padTop + 'px';
      } else {
        promCon.style.height = element.offsetHeight + padBot + padTop + 'px';
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
    let mobile = this.params.mobileViewport ?? 769;
    let media = window.matchMedia(`(max-width: ${mobile}px)`).matches;
    
    document.addEventListener('pointerdown', (event) => {
      let target = event.target;

      if (target.matches('[data-range] button')) {

        this.button = target;
        let pointerId = event.pointerId;

        this.info = this.getButtonInfo(this.button);
        this.rangeInfo = this.info.range.getBoundingClientRect();
        
        this.button.classList.add('active');
        this.button.setPointerCapture(pointerId);

        if (!media) {

          document.addEventListener('pointermove', this.pointermoveHandler);

          this.button.addEventListener('pointerup', (event) => {
            this.button.classList.remove('active');
            document.removeEventListener('pointermove', this.pointermoveHandler);
          }, { once: true });

        } else {

          document.body.style.overflow = 'hidden';

          document.addEventListener('touchmove', this.pointermoveHandler);

          this.button.addEventListener('touchend', (event) => {
            document.body.style.overflow = '';
            this.button.classList.remove('active');
            document.removeEventListener('touchmove', this.pointermoveHandler);
          }, { once: true });

        }

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
      let clientX = event.type === 'touchmove' ? event.touches[0].clientX : event.clientX;
      let x = clientX - this.rangeInfo.x;
      this.moveButtons(button, x, clientX);
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


class Tabs {

  constructor(params) {
    this.params = params;
    this.containers = Array.from(document.querySelectorAll('[data-tabs]'));

    if (this.containers.length > 0) {
      this.ownMethodsBinder();
      this.setEventListeners();
      this.showStartTab();
    }
  }

  setEventListeners() {

    document.addEventListener('click', (event) => {
      let target = event.target;

      if (target.closest('[data-tabs-target]:not(.active)')) {
        let button = target.closest('[data-tabs-target]');
        this.showTabContent(button);
        this.deactivateAllButtons();
        button.classList.add('active');
      }

    });
  }

  showTabContent(button) {
    let targetId = button.dataset.tabsTarget;
    this.container = button.closest('[data-tabs]');
    let conName = this.container.dataset.tabs
    let timeout = this.params?.[conName]?.delay ?? 0;
    let adaptive = this.params?.[conName]?.adaptiveSize;

    if (targetId) {

      let target = this.container.querySelector(`[data-tabs-id="${targetId}"]`);
      this.deactivateAllTabs();

      if (adaptive) this.adoptContainerSize(target);

      setTimeout(() => {
        target.classList.add('active');
        this.startAutoplayInOpenedTab(target);
      }, timeout); 

    }
  }

  adoptContainerSize(content) {
    let width = content.offsetWidth;
    let height = content.offsetHeight;
    let container = content.parentElement;
    let conInfo = getComputedStyle(container);
    let paddingBottom = parseFloat(conInfo.paddingBottom);

    container.style.width = width + 'px';
    container.style.height = height + paddingBottom + 'px';
  }

  startAutoplayInOpenedTab(element) {

    let opt = element._params[element.dataset.demo];

    if (opt?.autoplay) {
      if (this.prevTabCon) ImageDemonstrator.prototype.stopAutoPlayHandler(this.prevTabCon._autoBtn);
      ImageDemonstrator.prototype.autoplayButtonHandler(element._autoBtn);
      this.prevTabCon = element;
    }

  }

  showStartTab() {
    this.containers.forEach((item) => {
      let conName = item.dataset.tabs;
      let startIndex = this.params?.[conName]?.startTab ? this.params[conName].startTab - 1 : 0;
      let buttons = Array.from(item.querySelectorAll('[data-tabs-target]'));
      let button = buttons.at(startIndex);
      button.classList.add('active');
      this.showTabContent(button); 
    })
  }

  deactivateAllTabs() {
    let contents = Array.from(this.container.querySelectorAll('[data-tabs-id]'));
    contents.forEach((item) => item.classList.remove('active'));
  }

  deactivateAllButtons() {
    let buttons = Array.from(this.container.querySelectorAll('[data-tabs-target]'));
    buttons.forEach((item) => item.classList.remove('active'));
  }

  ownMethodsBinder() {
    let prototype = Object.getPrototypeOf(this);
    let ownMethods = Object.getOwnPropertyNames(prototype)
    for (let item of ownMethods) {
      if (item !== 'constructor') prototype[item] = prototype[item].bind(this);
    }
  }
  
}


class ImageDemonstrator {

  constructor(params) {
    this.params = params;
    this.demonstrators = Array.from(document.querySelectorAll('[data-demo]'));
    this.windowFocus = true;
    this.oldCord = 0;

    this.lastX;
    this.lastY;
    this.lastTime;

    if (this.demonstrators.length > 0) {
      this.ownMethodsBinder();
      this.setSameParamsForAllDemonstrators();
      this.getElements();
      this.createPictureForScreen();
      this.lazyLoad();
      this.changePreviewsOrientation();
      this.showStartImageOnScreen();
      this.setScrollbars();
      this.setEventListeners();
      this.initAutoplay();
      this.playOnViewport();
    }
  }

  setEventListeners() {

    document.addEventListener('click', (event) => {

      let target = event.target;

      if (target.closest('[data-demo-previews]') && target.closest('img')) {
        let img = target.closest('img');
        this.showImageOnScreen(img);
        this.pauseAutoplay(img);
        if (Tabs) Tabs.prototype.adoptContainerSize(img.closest('[data-demo]'));
      }

      if (target.closest('[data-demo-prev], [data-demo-next]')) {
        let button = target.closest('[data-demo-prev], [data-demo-next]');
        this.controlButtonsOperator(button);
        this.pauseAutoplay(button);

        this.switchButtons(target);
      }

      if (target.closest('[data-demo-autoplay]')) {
        let button = target.closest('[data-demo-autoplay]');
        this.autoplayButtonHandler(button)
      }

      if (target.closest('[data-demo-autoplay-stop]')) {
        this.stopAutoPlayHandler(target);
      }

      if (target.closest('.scrollbar-horizontal, .scrollbar-vertical') && !target.closest('.scrollbar-thumb')) {
        this.scrollbarClickPositionHandler(event);
      }

    });

    window.addEventListener('blur', (event) => {
      this.windowFocus = false;
      this.demonstrators.forEach((demonstrator) => {
        let isActive = demonstrator._autoBtn ? demonstrator._autoBtn.matches('.active') : false;
        if (isActive) {
          this.pauseAutoplay(demonstrator);
          demonstrator._activeAuto = true;

          this.switchButtons(demonstrator);
        }
        
      });
    })

    window.addEventListener('focus', (event) => {
      this.windowFocus = true;
      this.demonstrators.forEach((demonstrator) => {
        let opt = this.params[demonstrator.dataset.demo];
        if (opt.autoplay && demonstrator._activeAuto) {
          this.autoplayButtonHandler(demonstrator._autoBtn);
          demonstrator._activeAuto = false;

          this.switchButtons(demonstrator);
        } 
      });
    })

    document.addEventListener('dragstart', (event) => {
      if (event.target.closest('[data-demo]')) event.preventDefault();
    }, { passive: false } );

    this.demonstrators.forEach((demonstrator) => {

      let opt = this.params[demonstrator.dataset.demo];
      
      if (opt.autoplay && !demonstrator._isMobileViewport && opt.autoplay?.stopOnHover) {

        demonstrator.addEventListener('pointerenter', (event) => {

          if (!demonstrator._isMobileViewport && !demonstrator._autoPlayStopped) {
            if (demonstrator._autoBtn.matches('.active')) demonstrator._activeAutoBtn = true;
            this.pauseAutoplay(demonstrator);
            
            this.switchButtons(demonstrator);
          } 

          demonstrator.addEventListener('pointerleave', (event) => {
            if (!demonstrator._doubleAutoplay && !demonstrator._autoPlayStopped && demonstrator._activeAutoBtn) this.autoplayButtonHandler(demonstrator._autoBtn);
            demonstrator._doubleAutoplay = false;
            demonstrator._activeAutoBtn = false;

          }, { once: true });

        });

      }
      
    })

    document.addEventListener('pointerdown', (event) => {

      let target = event.target;

      if (target.closest('.custom-radio') && target.closest('[data-demo]')) {
        this.stopAutoPlayHandler(event.target);
        this.paginationClickHandler(event);
        if (Tabs) Tabs.prototype.adoptContainerSize(target.closest('[data-demo]'));
      }

      if (target.closest('[data-demo-previews]')) {
        this.previewsPointerdownHandler(event);
        this.switchButtons(target);
      }

      if (target.closest('.scrollbar-thumb')) {
        let thumb = target.closest('.scrollbar-thumb');
        thumb.style.transition = 'all 0s';
        this.scrollbarThumbMoveHandller(event);
        this.switchButtons(target);
      }
 
    });

    document.addEventListener('wheel', (event) => {
      let target = event.target;

      if (target.closest('[data-demo-previews]')) {
        event.preventDefault();
      }
    }, { passive: false })

  }

  picturesPreloader(container) {

    let previews = container._previews;
    previews.forEach((preview) => {

      if (preview.tagName === 'PICTURE') {

        let sources = Array.from(preview.querySelectorAll('source'));
        sources.forEach((source) => {
          let url = source.dataset.demoSrc;
          if (url) new Image().src = url;
        })

        let imgUrl = preview.lastElementChild.dataset.demoSrc;
        if (imgUrl) new Image().src = imgUrl;

      } else {

        let url = preview.dataset.demoSrc;
        if (url) new Image().src = url;

      }

    })

  }

  updateWatchAreaHeight(element) {

    let demonstrator = element.closest('[data-demo]');
    
    if (demonstrator._isChangeBreakpoint) {
      let watchArea = demonstrator.querySelector('.demonstration__watch-area');
      watchArea.style.height = '';
      watchArea.style.height = watchArea.offsetHeight + 'px';
    }

  }

  hideScrollbarInNonFilledPreviewsBlock(element) {

    let demonstrator = element.closest('[data-demo]');
    let prevBlock = demonstrator._previewsBlock;
    let inner = prevBlock.firstElementChild;
    let dir = prevBlock.dataset.demoPreviews;
    
    let blockSize, innerSize;
    if (dir === 'horizontal') {
      blockSize = prevBlock.offsetWidth;
      innerSize = inner.offsetWidth;
    } else {
      blockSize = prevBlock.offsetHeight;
      innerSize = inner.offsetHeight;
    }

    if (innerSize < blockSize) {
      prevBlock.classList.add('hide-scrollbar');
    } else {
      prevBlock.classList.remove('hide-scrollbar');
    }

  }

  updatePreviewsBlockHeightWidth(element) {

    let demonstrator = element.closest('[data-demo]');
    let previews = demonstrator._previewsBlock;
    let dir = previews.dataset.demoPreviews;

    if (dir === 'vertical') {
      previews.style.height = '';
    } else {
      previews.style.width = '';
    }
    
    let wrapper = demonstrator.querySelector('.demonstration__screen-wrapper');
    let main = demonstrator.querySelector('.demonstration__main');
    let media = window.matchMedia('(max-width: 1024px)').matches;

    if (media) main = wrapper;
    
    if (dir === 'vertical') {
      previews.style.height = main.offsetHeight + 'px';
    } else {
      previews.style.width = main.offsetWidth + 'px';
    }

    this.hideScrollbarInNonFilledPreviewsBlock(element);
    // this.setSizeOfScrollbarThumb(demonstrator._previewsBlock, true);
    this.adjustPreviewsScroll(element);

  }

  changeCaptionInfo(image) {

    let demonstrator = image.closest('[data-demo]');
    let demoName = demonstrator.dataset.demo;
    let index = demonstrator._previews.findIndex((item) => image === item.lastElementChild);
    let slots = Array.from(demonstrator.querySelectorAll('[data-demo-get]'));
    let dictionary = this.params[demoName].dictionary[demoName];
    let data = dictionary.at(index);
    let lang = document.documentElement.lang;
    let clases = this.params[demoName].jobsClases;

    slots.forEach((slot) => {

      let slotName = slot.dataset.demoGet;

      if (slotName !== 'jobs') {

        let text = data[slotName][lang];
        slot.textContent = text;

      } else {

        let jobs = data[slotName];
        slot.innerHTML = '';
        jobs.forEach((job) => {

          let text = job[lang];
          let li = document.createElement('li');
          li.className = clases;
          li.textContent = text;
          slot.append(li);

        })

      }

    })

  }

  paginationClickHandler(event) {

    let demonstrator = event.target.closest('[data-demo]');
    let pag = event.target.closest('.custom-radio');

    let index = Array.from(demonstrator._pag.children).findIndex((item) => item === pag);

    let preview = demonstrator._previews.at(index);
    preview.tagName === 'IMG' ? preview : preview = preview.lastElementChild;
    this.showImageOnScreen(preview);

  }

  updatePagination(element) {

    let demonstrator = element.closest('[data-demo]');

    if (demonstrator._prevPag) demonstrator._prevPag.classList.remove('active');

    let index = demonstrator._previews.findIndex((item) => item.tagName === "IMG" ? item === element : item.lastElementChild === element);
    let paginations = Array.from(demonstrator._pag.children);

    paginations.at(index).classList.add('active');
    demonstrator._prevPag = paginations.at(index);
  
  }

  switchButtons(element) {

    let demonstrator = element.closest('[data-demo]');
    
    if (!demonstrator._autoBtn.matches('.active')) {
      demonstrator._autoBtn.classList.add('visible');
      demonstrator._autoBtnStop.classList.remove('visible');
    } else {
      demonstrator._autoBtn.classList.remove('visible');
      demonstrator._autoBtnStop.classList.add('visible');
    }

  }

  setSameParamsForAllDemonstrators() {

    if (this.params.forAll) {

      let data = this.params.forAll;
      delete this.params.forAll;

      this.demonstrators.forEach((demonstrator) => this.params[demonstrator.dataset.demo] = data);

    }

  }

  previewsPointerdownHandler(event) {

    let demonstrator = event.target.closest('[data-demo]');
    let opt = this.params[demonstrator.dataset.demo];
    let previewsBlock = demonstrator._previewsBlock;
    let dir = previewsBlock.dataset.demoPreviews;
    let isMobile = demonstrator._isMobileViewport;

    this.pauseAutoplay(demonstrator);
    this.getInitialPointerCord(event);
    previewsBlock.firstElementChild.style.transition = 'all 0s';

    let thumb;
    if (opt.scrollbar) {
      thumb = dir === 'horizontal' ? demonstrator._thumbHor : demonstrator._thumbVer;
      thumb.style.transition = 'all 0s';
    }

    if (!isMobile) {

      this.pointerDown = true;
      document.addEventListener('pointermove', this.previewsScrollHandler);
      document.addEventListener('pointerup', (event) => {
        previewsBlock.firstElementChild.style.transition = '';
        if (thumb) thumb.style.transition = '';
        document.removeEventListener('pointermove', this.previewsScrollHandler);
        this.pointerDown = false;
      }, { once: true } );

    } else {

      document.addEventListener('touchmove', this.previewsScrollHandler);
      document.addEventListener('touchend', (event) => {
        if (thumb) thumb.style.transition = '';
        document.removeEventListener('touchmove', this.previewsScrollHandler);
      }, { once: true });

    }

  }

  scrollbarThumbMoveHandller(event) {

    event.stopPropagation();
    // event.target.setPointerCapture(event.pointerId);

    let demonstrator = event.target.closest('[data-demo]');
    let prevBlock = demonstrator._previewsBlock;
    let dir = prevBlock.dataset.demoPreviews;
    let inner = prevBlock.firstElementChild;

    let thumb = dir === 'horizontal' ? demonstrator._thumbHor : demonstrator._thumbVer;
    let startPos = dir === 'horizontal' ? parseFloat(thumb.style.left) : parseFloat(thumb.style.top);
    let startCoord = dir === 'horizontal' ? event.clientX : event.clientY;
    let clientSize = dir === 'horizontal' ? prevBlock.clientWidth : prevBlock.clientHeight;
    let scrollSize = dir === 'horizontal' ? inner.scrollWidth : inner.scrollHeight;
    let thumbSize = dir === 'horizontal' ? thumb.offsetWidth : thumb.offsetHeight;

    function moveThumb(event) {

      event.target.setPointerCapture(event.pointerId);
      let eType = event.type;
      let eCord;

      if (dir === 'horizontal') {
        eCord = eType === 'pointermove' ? event.clientX : event.touches[0].clientX;
      } else {
        eCord = eType === 'pointermove' ? event.clientY : event.touches[0].clientY;
      }

      const delta = eCord - startCoord;
      let newPos = startPos + delta;
      
      newPos = Math.max(0, Math.min(clientSize - thumbSize, newPos));
      
      const scrollRange = clientSize - thumbSize;
      const scrollRatio = newPos / scrollRange;
      
      const maxTranslate = 0;
      const minTranslate = clientSize - scrollSize;
      const newTranslate = maxTranslate + scrollRatio * (minTranslate - maxTranslate);
      
      demonstrator._currentTranslate = newTranslate;
      
      if (dir === 'horizontal') {
        thumb.style.left = newPos + 'px';
        inner.style.transform = `translateX(${newTranslate}px)`;
      } else {
        thumb.style.top = newPos + 'px';
        inner.style.transform = `translateY(${newTranslate}px)`;
      }

    }

    if (!demonstrator._isMobileViewport) {

      document.addEventListener('pointermove', moveThumb);
      document.addEventListener('pointerup', () => {
        thumb.style.transition = '';
        document.removeEventListener('pointermove', moveThumb);
      }, { once: true } );

    } else {

      document.addEventListener('touchmove', moveThumb);
      document.addEventListener('touchend', () => {
        thumb.style.transition = '';
        document.removeEventListener('touchmove', moveThumb);
      }, { once: true } );

    }
    
  }

  setScrollbars() {
    this.demonstrators.forEach((demonstrator) => {
      let opt = this.params[demonstrator.dataset.demo];
      if (opt.scrollbar) {
        this.createScrollbar(demonstrator);
      }
    });
  }
    
  createScrollbar(demonstrator) {

    let prevBlock = demonstrator._previewsBlock;
    let dir = prevBlock.dataset.demoPreviews;

    prevBlock.style.cssText = 'position: relative; overflow: hidden';

    let thumb = document.createElement('div');
    thumb.classList.add('scrollbar-thumb');

    let scrollbarHor = document.createElement('div');
    scrollbarHor.classList.add('scrollbar-horizontal');
    scrollbarHor.style.cssText = 'position: absolute; bottom: 0px; left: 0px; right: 0px;';

    let scrollbarVer = document.createElement('div');
    scrollbarVer.classList.add('scrollbar-vertical');
    scrollbarVer.style.cssText = 'position: absolute; bottom: 0px; top: 0px; right: 0px;';

    thumb.style.cssText = 'position: absolute;';
    
    scrollbarHor.append(thumb.cloneNode(true));
    scrollbarVer.append(thumb.cloneNode(true));
    prevBlock.append(dir === 'horizontal' ? scrollbarHor : scrollbarVer);
    
    if (dir === 'horizontal') {
      demonstrator._scrollHor = scrollbarHor;
      demonstrator._thumbHor = scrollbarHor.firstElementChild;
      demonstrator._thumbHor.style.height = '100%';
    } else {
      demonstrator._scrollVer = scrollbarVer;
      demonstrator._thumbVer = scrollbarVer.firstElementChild;
      demonstrator._thumbVer.style.width = '100%';
    }

    this.setSizeOfScrollbarThumb(prevBlock);

  }

  setSizeOfScrollbarThumb(container, state) {

    let demonstrator = container.closest('[data-demo]');
    let opt = this.params[demonstrator.dataset.demo];
    let dir = container.dataset.demoPreviews;
    let inner = container.firstElementChild;
    let clientSize = dir === 'horizontal' ? container.clientWidth : container.clientHeight;
    let scrollSize = dir === 'horizontal' ? inner.scrollWidth : inner.scrollHeight;
    let minSize = opt.scrollbar?.minSize ?? 40;
    let size = opt.scrollbar?.size;

    let thumbSize;
    let thumbPos = 0;

    if (size) {
      thumbSize = size;
    } else {
      thumbSize = (clientSize / scrollSize) * clientSize;
      thumbSize = Math.max(thumbSize, minSize);
    }

    if (demonstrator._currentTranslate) {
      const maxTranslate = 0;
      const minTranslate = clientSize - scrollSize;
      const translateRange = minTranslate - maxTranslate;
      const scrollRange = clientSize - thumbSize;
      
      if (translateRange !== 0) {
        thumbPos = ((demonstrator._currentTranslate - maxTranslate) / translateRange) * scrollRange;
        thumbPos = Math.max(0, Math.min(scrollRange, thumbPos));
      }
    }

    if (dir === 'horizontal') {
      demonstrator._thumbHor.style.width = thumbSize + 'px';
      if (!state) demonstrator._thumbHor.style.left = thumbPos + 'px';
    } else {
      demonstrator._thumbVer.style.height = thumbSize + 'px';
      if (!state) demonstrator._thumbVer.style.top = thumbPos + 'px';
    }

  }

  updateScrollbar(element) {

    let demonstrator = element.closest('[data-demo]');
    let prevBlock = demonstrator._previewsBlock;
    let inner = prevBlock.firstElementChild;
    let dir = prevBlock.dataset.demoPreviews; 

    let thumb = dir === 'horizontal' ? demonstrator._thumbHor : demonstrator._thumbVer;

    let clientSize = dir === 'horizontal' ? prevBlock.clientWidth : prevBlock.clientHeight;
    let scrollSize = dir === 'horizontal' ? inner.scrollWidth : inner.scrollHeight;
    let thumbSize = dir === 'horizontal' ? thumb.offsetWidth : thumb.offsetHeight;
    
    let maxTranslate = 0;
    let minTranslate = clientSize - scrollSize;
    let translateRange = minTranslate - maxTranslate;
    let scrollRange = clientSize - thumbSize;
    
    if (translateRange !== 0) {

      let thumbPos = ((demonstrator._currentTranslate - maxTranslate) / translateRange) * scrollRange;

      if (dir === 'horizontal') {
        thumb.style.left = Math.max(0, Math.min(scrollRange, thumbPos)) + 'px';
      } else {
        thumb.style.top = Math.max(0, Math.min(scrollRange, thumbPos)) + 'px';
      }

    }

  }

  scrollbarClickPositionHandler(event) {

    let demonstrator = event.target.closest('[data-demo]');
    let prevBlock = demonstrator._previewsBlock;
    let dir = prevBlock.dataset.demoPreviews;
    let inner = prevBlock.firstElementChild;

    let scrollbar = dir === 'horizontal' ? demonstrator._scrollHor : demonstrator._scrollVer;
    let thumb = dir === 'horizontal' ? demonstrator._thumbHor : demonstrator._thumbVer;

    let rect = scrollbar.getBoundingClientRect();
    let clientSize = dir === 'horizontal' ? prevBlock.clientWidth : prevBlock.clientHeight;
    let scrollSize = dir === 'horizontal' ? inner.scrollWidth : inner.scrollHeight;
    let thumbSize = dir === 'horizontal' ? thumb.offsetWidth : thumb.offsetHeight;

    let pos = dir === 'horizontal' ? event.clientX - rect.left - thumbSize / 2 : event.clientY - rect.top - thumbSize / 2;
    pos = Math.max(0, Math.min(clientSize - thumbSize, pos));
    
    let scrollRange = clientSize - thumbSize;
    let scrollRatio = pos / scrollRange;
    
    let maxTranslate = 0;
    let minTranslate = clientSize - scrollSize;
    let newTranslate = maxTranslate + scrollRatio * (minTranslate - maxTranslate);
    
    demonstrator._currentTranslate = newTranslate;

    if (dir === 'horizontal') {
      inner.style.transform = `translateX(${newTranslate}px)`;
    } else {
      inner.style.transform = `translateY(${newTranslate}px)`;
    }
    
    this.updateScrollbar(demonstrator);

  }

  playOnViewport() {

    let observer = new IntersectionObserver((list, observer) => {

      list.forEach((item) => {

        if (item.isIntersecting) {

          if (item.target._autoPlayRun && !item.target._notIntersect) {
            this.autoplayButtonHandler(item.target._autoBtn);
          } 

          item.target._notIntersect = false;

        } else {
          item.target._notIntersect = false;
          this.pauseAutoplay(item.target);
        }

      })

    }, { root: null, threshold: 0.01, rootMargin: '200px 0px' } );

    this.demonstrators.forEach((demonstrator) => {

      if (demonstrator._playOnViewport) {
        demonstrator._notIntersect = true;
        observer.observe(demonstrator);
      }

    });

  }

  lazyLoad() {
    
    let observer = new IntersectionObserver((list, observer) => {

      list.forEach((item) => {

        if (item.isIntersecting) {
          
          let images = item.target._previews;

          this.picturesPreloader(item.target);

          images.forEach((image) => {

            let picture = image.closest('picture'); 
            let src = image.dataset.demoLazy;

            if (picture) {
              let sources = Array.from(picture.querySelectorAll('source'));
              sources.forEach((source) => source.srcset = source.dataset.demoLazy);
              let img = picture.lastElementChild;
              img.src = img.dataset.demoLazy;
            } else {
              image.src = src;
            }

          })

          item.target._lazy = false;
          this.showStartImageOnScreen();
          observer.unobserve(item.target)

        }

      })

    }, { root: null, threshold: 0.01, rootMargin: '900px 0px' });

    this.demonstrators.forEach((demonstrator) => {
      let opt = this.params[demonstrator.dataset.demo];
      if (opt.lazy) observer.observe(demonstrator);
    })

  }

  initAutoplay() {

    this.demonstrators.forEach((demonstrator) => {
      let opt = this.params[demonstrator.dataset.demo];

      if (opt) {
        if (opt.autoplay?.playOnStart) {
          this.autoplayButtonHandler(demonstrator._autoBtn);
        } else {
          demonstrator._autoBtn.classList.add('visible');
        }
      }

    })
    
  }

  stopAutoPlayHandler(element) {
    let demonstrator = element.closest('[data-demo]');

    if (demonstrator) {
      demonstrator._autoBtnStop.classList.add('active');
      demonstrator._autoPlayStopped = true;
      demonstrator._autoPlayRun = false;
      demonstrator._autoBtn.classList.remove('active');
      clearInterval(demonstrator._autoPlayInterval);

      this.switchButtons(demonstrator);
    }
  }

  pauseAutoplay(element) {

    let container = element.closest('[data-demo]');
    let button = container._autoBtn;

    if (button) {
      button.classList.remove('active');
      clearInterval(container._autoPlayInterval);
      container._doubleAutoplay = false;
    }

  }

  changePreviewsOrientation() {

    this.demonstrators.forEach((demonstrator) => {

      let opt = this.params[demonstrator.dataset.demo];

      if (opt.changeOrientation && demonstrator._isChangeBreakpoint) {

        let orient = demonstrator._previewsBlock.dataset.demoPreviews;
        let newOrient = orient === 'horizontal' ? 'vertical' : orient === 'vertical' ? 'horizontal' : null;
        demonstrator._previewsBlock.setAttribute('data-demo-previews', newOrient);

      }

    })

  }

  getInitialPointerCord(event) {

    let container = event.target.closest('[data-demo-previews]');
    let orient = container.dataset.demoPreviews;

    if (orient === 'horizontal') {
      this.oldCord = event.type === 'touchmove' ? event.touches[0].clientX : event.clientX;
    } else {
      this.oldCord = event.type === 'touchmove' ? event.touches[0].clientY : event.clientY;
    }

    this.isDargging = true;

  }

  previewsScrollHandler(event) {

    let demonstrator = event.target.closest('[data-demo]');
    
    if (event.target.closest('[data-demo-previews]') && (this.pointerDown || event.type === 'touchmove')) {

      let container = demonstrator._previewsBlock;
      let inner = container.firstElementChild;
      container.setPointerCapture(event.pointerId);
      
      let orient = container.dataset.demoPreviews;
      const styles = getComputedStyle(inner);
      
      const paddingStart = orient === 'horizontal' ? parseFloat(styles.paddingLeft) : parseFloat(styles.paddingTop);
      const paddingEnd = orient === 'horizontal' ? parseFloat(styles.paddingRight) : parseFloat(styles.paddingBottom);
      
      let currentTransform = inner.style.transform;
      let currentTranslate = 0;
      
      if (currentTransform) {
        const match = currentTransform.match(/translate[XY]\(([-\d.]+)px\)/);
        currentTranslate = match ? parseFloat(match[1]) : 0;
      }
      
      const containerSize = orient === 'horizontal' ? container.clientWidth : container.clientHeight;
      const innerSize = orient === 'horizontal' ? inner.scrollWidth - paddingStart - paddingEnd : inner.scrollHeight - paddingStart - paddingEnd;
      
      const pointerPos = orient === 'horizontal' ? (event.type === 'touchmove' ? event.touches[0].clientX : event.clientX) : (event.type === 'touchmove' ? event.touches[0].clientY : event.clientY);
      
      let delta = this.oldCord - pointerPos;
      this.oldCord = pointerPos;
      
      let newTranslate = currentTranslate - delta;
      
      const maxTranslate = 0;
      let minTranslate;

      if (orient === 'horizontal') {
        minTranslate = containerSize - innerSize - (paddingEnd + paddingStart);
      } else {
        minTranslate = containerSize - innerSize - (paddingEnd + paddingStart + paddingEnd);
      }
      
      newTranslate = Math.min(maxTranslate, Math.max(minTranslate, newTranslate));
      
      if (orient === 'horizontal') {
        inner.style.transform = `translateX(${newTranslate}px)`;
      } else {
        inner.style.transform = `translateY(${newTranslate}px)`;
      }

      demonstrator._currentTranslate = newTranslate;
      this.updateScrollbar(demonstrator);

    }
  }

  getPointerSpeed(event) {
    const currentX = event.type === 'touchmove' ? event.touches[0].clientX : event.clientX;
    const currentY = event.type === 'touchmove' ? event.touches[0].clientY : event.clientY;
    const currentTime = Date.now();

    let speedX, speedY;

    if (this.lastX !== undefined) {
      const deltaX = currentX - this.lastX;
      const deltaY = currentY - this.lastY;
      const deltaTime = currentTime - this.lastTime;

      speedX = Math.abs(deltaX / deltaTime);
      speedY = Math.abs(deltaY / deltaTime);
    }

    this.lastX = currentX;
    this.lastY = currentY;
    this.lastTime = currentTime;

    return { x: speedX, y: speedY };
  }

  getPointerMoveDirection(cord, orient) {

    if (this.oldCord > cord) {
      this.oldCord = cord;
      return orient === 'horizontal' ? 'rtl' : 'dtt';
    } else if (this.oldCord < cord) {
      this.oldCord = cord;
      return orient === 'horizontal' ? 'ltr' : 'ttd';
    }

  }

  autoplayButtonHandler(button) {

    let demonstrator = button.closest('[data-demo]');

    if (button.matches('.active')) {

      button.classList.remove('active');
      clearInterval(demonstrator._autoPlayInterval);
      demonstrator._autoPlayRun = false;

      this.switchButtons(demonstrator);

    } else {

      demonstrator._autoBtnStop ? demonstrator._autoBtnStop.classList.remove('active') : null;
      button.classList.add('active');
      this.autoPlayHandler(button);
      demonstrator._doubleAutoplay = true;
      demonstrator._autoPlayStopped = false;
      demonstrator._autoPlayRun = true;

      this.switchButtons(demonstrator);

    }

  }

  getElements() {
    this.demonstrators.forEach((demonstrator) => {

      let opt = this.params[demonstrator.dataset.demo];

      demonstrator._class = this;
      demonstrator._pag = demonstrator.querySelector('[data-demo-pag]');
      demonstrator._screen = demonstrator.querySelector('[data-demo-screen]');
      demonstrator._nextBtn = demonstrator.querySelector('[data-demo-next]');
      demonstrator._prevBtn = demonstrator.querySelector('[data-demo-prev]');
      demonstrator._autoBtn = demonstrator.querySelector('[data-demo-autoplay]');
      demonstrator._autoBtnStop = demonstrator.querySelector('[data-demo-autoplay-stop]');
      demonstrator._previewsBlock = demonstrator.querySelector('[data-demo-previews]');
      demonstrator._previews = Array.from(demonstrator._previewsBlock.firstElementChild.children);

      demonstrator._currentTranslate = 0;
      demonstrator._doubleActivating = false;
      demonstrator._isMobileViewport = window.matchMedia(`(max-width: ${opt?.mobileStartFrom ?? 768}px)`).matches;
      demonstrator._isChangeBreakpoint = window.matchMedia(`(max-width: ${opt.changeOrientationBreakpoint}px)`).matches;
      opt.lazy ? demonstrator._lazy = true : demonstrator._lazy = false;
      if (opt.autoplay?.playOnViewport) demonstrator._playOnViewport = true;
      demonstrator._params = this.params;
  
    })
  }

  showStartImageOnScreen() {
    this.demonstrators.forEach((demonstrator) => {
      let index = this.params[demonstrator.dataset.demo].startPicture ?? 0;
      let image = demonstrator._previews.at(index);
      image.tagName === 'IMG' ? image : image = image.lastElementChild;
      demonstrator._startImage = image;

      if (!demonstrator._lazy) this.showImageOnScreen(image);
    })
  }

  showImageOnScreen(image) {

    let picture, src;
    let container = image.closest('[data-demo]');
    let opt = this.params[container.dataset.demo];

    if (!image.matches('.active')) {
          
      if (container._previousImage) container._previousImage.classList.remove('active');
      container._previousImage = image;

      picture = image.closest('picture');
      src = image.dataset.demoSrc;
      image.classList.add('active');

      opt.transition ? container._screenPicture.lastElementChild.classList.add('active') : null;

      this.loadTimeout = setTimeout(() => {
        this.removePictureSources(container);
        this.setNewSources(picture);
        src ? container._screenPicture.lastElementChild.src = src : null;
      }, opt.transition?.loading ?? 0);

      this.effectTimeout = setTimeout(() => {
        container._screenPicture.lastElementChild.classList.remove('active');
      }, opt.transition?.effect ?? 0);

    }
 
    this.adjustPreviewsScroll(image);
    this.updatePagination(image); 
    this.changeCaptionInfo(image); 
    this.updateWatchAreaHeight(image); 
    this.updatePreviewsBlockHeightWidth(image); 
    
  }

  removePictureSources(container) {
    let sources = Array.from(container._screenPicture.querySelectorAll('source'));
    sources.forEach((item) => item.remove());
  }

  setNewSources(picture) {

    if (picture) {

      let container = picture.closest('[data-demo]');
      let sources = Array.from(picture.querySelectorAll('source'));

      sources.forEach((item) => {
        let source = document.createElement('source');
        let src = item.dataset.demoSrc;
        let media = item.media;
        let type = item.type;
  
        src ? source.srcset = src : null;
        media ? source.media = media : null;
        type ? source.type = type : null;
        container._screen.firstElementChild.prepend(source);
      });
    }

  }

  createPictureForScreen() {

    this.demonstrators.forEach((demonstrator) => {

      let opt = this.params[demonstrator.dataset.demo];
      let stub = demonstrator._screen.dataset.demoScreen;
      let pictureClass = opt.pictureClass ?? 'screen-img';
      let preloader = opt.lazy ? `src="${stub}"` : '';

      let picture = `
        <picture>
          <img class="${pictureClass}" ${preloader} style="position: absolute; top: 0; left: 0; display: block; width: 100%; height: 100%">
        </picture>
      `;

      demonstrator._screen.style.position = 'relative';
      demonstrator._screen.insertAdjacentHTML('afterbegin', picture);
      demonstrator._screenPicture = demonstrator._screen.firstElementChild;

    })

  }

  autoPlayHandler(element) {

    let container = element.closest('[data-demo]');
    let opt = this.params[container.dataset.demo];

    if (opt.autoplay) {

      clearInterval(container._autoPlayInterval);

      let interval = opt?.autoplay?.interval ?? 3000;
      let currentIndex = container._previews.findIndex((item) => item.tagName === 'PICTURE' ? item.lastElementChild.matches('.active') : item.matches('.active'));

      container._autoPlayInterval = setInterval(() => {

        currentIndex === container._previews.length - 1 ? currentIndex = 0 : currentIndex++;

        let preview = container._previews.at(currentIndex);

        if (preview.tagName === 'PICTURE') {
          this.showImageOnScreen(preview.lastElementChild);
        } else {
          this.showImageOnScreen(preview);
        }

        if (Tabs) Tabs.prototype.adoptContainerSize(container);

      }, interval);
    }

  }

  controlButtonsOperator(button) {

    let container = button.closest('[data-demo]');
    let opt = this.params[container.dataset.demo];
    let dir = button.hasAttribute('data-demo-prev') ? 'prev' : 'next';
    let currentIndex = container._previews.findIndex((item) => item.tagName === 'PICTURE' ? item.lastElementChild.matches('.active') : item.matches('.active'));

    if (dir === 'prev') {
      
      if (opt.reverse) {
        currentIndex--; 
      } else {
        currentIndex == 0 ? currentIndex = 0 : currentIndex--;
      }

    } else {

      if (opt.reverse) {
        currentIndex === container._previews.length - 1 ? currentIndex = 0 : currentIndex++;   
      } else {
        currentIndex = currentIndex === container._previews.length - 1 ? container._previews.length - 1 : currentIndex + 1;
      }

    }

    let newPreview = container._previews.at(currentIndex);

    if (newPreview.tagName === 'PICTURE') {
      this.showImageOnScreen(newPreview.lastElementChild);
    } else {
      this.showImageOnScreen(newPreview);
    }

    if (Tabs) Tabs.prototype.adoptContainerSize(container);

  }

  adjustPreviewsScroll(image) { 
     
    const demonstrator = image.closest('[data-demo]');
    const container = image.closest('[data-demo-previews]');
    const direction = container.dataset.demoPreviews;
    const inner = container.firstElementChild;

    image.closest('picture') ? image = image.closest('picture') : image;

    const containerRect = container.getBoundingClientRect();
    const imageRect = image.getBoundingClientRect();

    const styles = getComputedStyle(inner);
    const paddingStart = parseFloat(direction === 'horizontal' ? styles.paddingLeft : styles.paddingTop);
    const paddingEnd = parseFloat(direction === 'horizontal' ? styles.paddingRight : styles.paddingBottom);

    let delta = 0;

    if (direction === 'horizontal') {

      if (imageRect.left < containerRect.left + paddingStart) {
        delta = containerRect.left + paddingStart - imageRect.left;
      } else if (imageRect.right > containerRect.right - paddingEnd) {
        delta = containerRect.right - paddingEnd - imageRect.right;
      }

      demonstrator._currentTranslate += delta;

      const maxTranslate = 0;
      const minTranslate = container.clientWidth - inner.scrollWidth - paddingEnd - paddingStart;

      demonstrator._currentTranslate = Math.min(maxTranslate, Math.max(minTranslate, demonstrator._currentTranslate));
      inner.style.transform = `translateX(${demonstrator._currentTranslate}px)`;

    } else {

      if (imageRect.top < containerRect.top + paddingStart) {
        delta = containerRect.top + paddingStart - imageRect.top;
      } else if (imageRect.bottom > containerRect.bottom - paddingEnd) {
        delta = containerRect.bottom - paddingEnd - imageRect.bottom;
      }

      demonstrator._currentTranslate += delta;

      const maxTranslate = 0;
      const minTranslate = container.clientHeight - inner.scrollHeight - paddingEnd - paddingStart;

      demonstrator._currentTranslate = Math.min(maxTranslate, Math.max(minTranslate, demonstrator._currentTranslate));
      inner.style.transform = `translateY(${demonstrator._currentTranslate}px)`;

    }

    this.updateScrollbar(demonstrator);
  }

  ownMethodsBinder() {
    let prototype = Object.getPrototypeOf(this);
    let ownMethods = Object.getOwnPropertyNames(prototype)
    for (let item of ownMethods) {
      if (item !== 'constructor') prototype[item] = prototype[item].bind(this);
    }
  }

}


class ImageZoom {

  constructor(selector = '[data-zoom]', options = {}) {

    this.containers = document.querySelectorAll(selector);
    this.mode = options.mode || 'hover';
    this.minZoom = options.minZoom || 1;
    this.maxZoom = options.maxZoom || 3;
    this.zoomStep = options.zoomStep || 0.1;
    this.startZoom = options.startZoom || 1.5;
    this.mobileViewport = options.mobileViewport || 769;

    this.isMobile = window.matchMedia(`(max-width: ${this.mobileViewport}px)`).matches;
    this.containers.forEach(container => this.initContainer(container));

  }

  initContainer(container) {

    const img = container.querySelector('img');
    if (!img) return;

    container.style.overflow = 'hidden';
    container.style.position = 'relative';
    img.style.transformOrigin = 'top left';
    img.style.position = 'absolute';
    img.dataset.zoomScale = 1;

    if (!this.isMobile) {

      if (this.mode === 'hover') {
        this.initHoverZoom(container, img);
      } else {
        this.initClickZoom(container, img);
      }

      container.addEventListener('wheel', (e) => {
        e.preventDefault();
        this.zoomImage(img, e.deltaY < 0 ? 1 : -1, e.offsetX, e.offsetY, container);
      });

      container.addEventListener('dragstart', (event) => event.preventDefault());

    } else {

      this.initMobileZoom(container, img);

    }

  }

  initMobileZoom(container, img) {

    let initialDistance = 0;
    let initialScale = 1;
    let initialX = 0;
    let initialY = 0;
    let isPinching = false;
    let isDragging = false;
    let startX, startY;
    let lastTouchTime = 0;

    container.style.touchAction = 'none';
    touchmoveHandler = touchmoveHandler.bind(this);

    container.addEventListener('touchstart', (e) => {

      img.style.transition = 'transform 0.1s';

      if (e.touches.length === 1) {
     
        const touch = e.touches[0];
        startX = touch.clientX;
        startY = touch.clientY;
        initialX = parseFloat(img.dataset.imgX) || 0;
        initialY = parseFloat(img.dataset.imgY) || 0;
        isDragging = true;
        
   
        const currentTime = new Date().getTime();

        if (currentTime - lastTouchTime < 300) {
          img.dataset.zoomScale = 1;
          this.applyTransform(img, 0, 0);
        }

        lastTouchTime = currentTime;

      } else if (e.touches.length === 2) {
       
        e.preventDefault();
        isPinching = true;
        isDragging = false;
        initialScale = parseFloat(img.dataset.zoomScale) || 1;
        initialDistance = this.getTouchDistance(e.touches[0], e.touches[1]);
        
        const centerX = (e.touches[0].clientX + e.touches[1].clientX) / 2;
        const centerY = (e.touches[0].clientY + e.touches[1].clientY) / 2;

        const containerRect = container.getBoundingClientRect();
        const offsetX = centerX - containerRect.left;
        const offsetY = centerY - containerRect.top;
        
        startX = offsetX;
        startY = offsetY;
        initialX = parseFloat(img.dataset.imgX) || 0;
        initialY = parseFloat(img.dataset.imgY) || 0;

      } 

      container.addEventListener('touchmove', touchmoveHandler);
      container.addEventListener('touchend', (e) => {
      
        isPinching = false;
        isDragging = false;
        img.style.transition = '';
        container.removeEventListener('touchmove', touchmoveHandler);

      }, { once: true });
      
    });

    function touchmoveHandler(e) {

      if (isPinching && e.touches.length === 2) {

        e.preventDefault();
        const currentDistance = this.getTouchDistance(e.touches[0], e.touches[1]);
        const scale = initialScale * (currentDistance / initialDistance);

        const newScale = Math.min(this.maxZoom, Math.max(this.minZoom, scale));

        const containerRect = container.getBoundingClientRect();
        const centerX = (e.touches[0].clientX + e.touches[1].clientX) / 2;
        const centerY = (e.touches[0].clientY + e.touches[1].clientY) / 2;
        const offsetX = centerX - containerRect.left;
        const offsetY = centerY - containerRect.top;

        const relX = (offsetX - initialX) / initialScale;
        const relY = (offsetY - initialY) / initialScale;

        let imgX = offsetX - relX * newScale;
        let imgY = offsetY - relY * newScale;

        img.dataset.zoomScale = newScale;

        const constrained = this.constrainPosition(img, container, imgX, imgY);
        imgX = constrained.x;
        imgY = constrained.y;

        img.dataset.imgX = imgX;
        img.dataset.imgY = imgY;

        this.applyTransform(img, imgX, imgY);

      } else if (isDragging && e.touches.length === 1 && parseFloat(img.dataset.zoomScale) > 1) {

        e.preventDefault();
        const touch = e.touches[0];
        const dx = touch.clientX - startX;
        const dy = touch.clientY - startY;

        let imgX = initialX + dx;
        let imgY = initialY + dy;

        const constrained = this.constrainPosition(img, container, imgX, imgY);
        imgX = constrained.x;
        imgY = constrained.y;

        img.dataset.imgX = imgX;
        img.dataset.imgY = imgY;

        this.applyTransform(img, imgX, imgY);

        startX = touch.clientX;
        startY = touch.clientY;
        initialX = imgX;
        initialY = imgY;

      }

    }

  }

  getTouchDistance(touch1, touch2) {

    const dx = touch1.clientX - touch2.clientX;
    const dy = touch1.clientY - touch2.clientY;
    return Math.sqrt(dx * dx + dy * dy);

  }

  initHoverZoom(container, img) {

    container.addEventListener('mouseenter', () => {
      img.dataset.zoomScale = this.startZoom;
      img.style.transition = 'transform 0.1s';
      this.applyTransform(img, 0, 0);
      
      container.addEventListener('mousemove', moveHandler);
      
      container.addEventListener('mouseleave', () => {
        img.dataset.zoomScale = 1;
        img.style.transition = '';
        this.applyTransform(img, 0, 0);
        container.removeEventListener('mousemove', moveHandler);
      }, { once: true });

    });

    function moveHandler(e) {

      if (e.target.closest('.demonstration__screen-controls')) {
        img.dataset.zoomScale = 1;
        this.applyTransform(img, 0, 0);
      } else {
        const { offsetX, offsetY } = e;
        this.moveImage(img, offsetX, offsetY, container);
      }

    }

    moveHandler = moveHandler.bind(this);

  }

  initClickZoom(container, img) {

    let isDragging = false;
    let startX, startY;
    let imgX = 0, imgY = 0;
    let moved = false;

    const resetZoom = () => {

      img.dataset.zoomScale = 1;
      imgX = 0;
      imgY = 0;
      this.applyTransform(img, imgX, imgY);

    };

    container.addEventListener('pointerdown', (e) => {

      if (parseFloat(img.dataset.zoomScale) === 1) return;

      isDragging = true;
      startX = e.clientX;
      startY = e.clientY;
      moved = false;

      imgX = parseFloat(img.dataset.imgX) || 0;
      imgY = parseFloat(img.dataset.imgY) || 0;

      e.preventDefault();
      e.target.setPointerCapture(e.pointerId);

      let handler = moveHandler.bind(this);

      container.addEventListener('pointermove', handler);
      container.addEventListener('pointerup', (event) => {
        isDragging = false;
        container.removeEventListener('pointermove', handler);
      }, { once: true });

    });

    function moveHandler(e) {

      if (!isDragging || parseFloat(img.dataset.zoomScale) === 1) return;

      const dx = e.clientX - startX;
      const dy = e.clientY - startY;

      if (Math.abs(dx) > 2 || Math.abs(dy) > 2) {
        moved = true;
      }

      startX = e.clientX;
      startY = e.clientY;

      imgX += dx;
      imgY += dy;

      const constrained = this.constrainPosition(img, container, imgX, imgY);
      imgX = constrained.x;
      imgY = constrained.y;

      img.dataset.imgX = imgX;
      img.dataset.imgY = imgY;

      this.applyTransform(img, imgX, imgY);

    }

    container.addEventListener('click', (e) => {
    
      if (moved) {
        moved = false;
        return;
      }

      const currentScale = parseFloat(img.dataset.zoomScale);

      if (currentScale === 1) {

        const newScale = this.startZoom;
        img.dataset.zoomScale = newScale;
        img.classList.add('scale');

        const { offsetX, offsetY } = e;
        imgX = -offsetX * (newScale - 1);
        imgY = -offsetY * (newScale - 1);

        const constrained = this.constrainPosition(img, container, imgX, imgY);
        imgX = constrained.x;
        imgY = constrained.y;

        this.applyTransform(img, imgX, imgY);

      } else {

        resetZoom();
        img.classList.remove('scale');

      }

    });

  }

  zoomImage(img, direction, offsetX, offsetY, container) {

    let scale = parseFloat(img.dataset.zoomScale);
    const oldScale = scale;

    scale += this.zoomStep * direction;
    scale = Math.min(this.maxZoom, Math.max(this.minZoom, scale));
    if (scale === oldScale) return;

    let imgX = parseFloat(img.dataset.imgX) || 0;
    let imgY = parseFloat(img.dataset.imgY) || 0;

    const mouseX = offsetX;
    const mouseY = offsetY;

    const relX = (mouseX - imgX) / oldScale;
    const relY = (mouseY - imgY) / oldScale;

    imgX = mouseX - relX * scale;
    imgY = mouseY - relY * scale;

    img.dataset.zoomScale = scale;

    const constrained = this.constrainPosition(img, container, imgX, imgY);
    imgX = constrained.x;
    imgY = constrained.y;

    img.dataset.imgX = imgX;
    img.dataset.imgY = imgY;

    this.applyTransform(img, imgX, imgY);

  }

  applyTransform(img, x, y) {

    const scale = parseFloat(img.dataset.zoomScale);
    img.style.transform = `translate(${x}px, ${y}px) scale(${scale})`;
    img.dataset.imgX = x;
    img.dataset.imgY = y;

  }

  moveImage(img, offsetX, offsetY, container) {

    const scale = parseFloat(img.dataset.zoomScale);
    if (scale <= 1) return;

    let x = -(offsetX * (scale - 1));
    let y = -(offsetY * (scale - 1));

    this.constrainPosition(img, container, x, y);
    this.applyTransform(img, x, y);

  }

  constrainPosition(img, container, x, y) {

    const scale = parseFloat(img.dataset.zoomScale);

    const containerWidth = container.clientWidth;
    const containerHeight = container.clientHeight;

    const imgWidth = img.offsetWidth * scale;
    const imgHeight = img.offsetHeight * scale;

    const minX = Math.min(0, containerWidth - imgWidth);
    const minY = Math.min(0, containerHeight - imgHeight);

    x = Math.min(0, Math.max(minX, x));
    y = Math.min(0, Math.max(minY, y));

    return { x, y };

  }
  
}

class LazyLoad {

  constructor(params) {
    this.params = params;
    this.blocks= Array.from(document.querySelectorAll('[data-load-block]'));

    if (this.blocks.length > 0) {
      this.ownMethodsBinder();
      this.createObserver();
      this.observeBlocks();
      this.showLine();
    }

  }

  createObserver() {
    let offset = this.params?.offset ?? 500;
    this.observer = new IntersectionObserver((list, observer) => {

      list.forEach((item) => {
        if (item.isIntersecting) {
            this.observerHandler(item.target);
            observer.unobserve(item.target);
        }
      });

    }, { root: null, rootMargin: `${offset}px 0px ${offset}px 0px`, threshold: 0.01 });
  }

  observerHandler(container) {
    let elements = Array.from(container.querySelectorAll('[data-load]'));
    elements.forEach((element) => {

      let inPicture = element.closest('picture');
      let inVideo = element.closest('video');
      let inAudio = element.closest('audio');

      let url = element.dataset.load;

      if (inPicture) {
        element.tagName === 'IMG' ? element.src = url : element.srcset = url;
      } else if (inVideo || inAudio) {
        element.load();
      } else {
        element.src = url;
      }

    });
  }

  observeBlocks() {
    this.blocks.forEach((block) => {

      let isContent = block.querySelector('[data-load]');
      if (isContent) {
        this.observer.observe(block);
      }

    })
  }

  showLine() {
    if (this.params?.showLine) {
      let offset = this.params?.offset ?? 500;
      this.blocks.forEach((block) => {
        block.style.position = 'relative';
        let line = document.createElement('div');
        line.style.cssText = `display: block; width: 100vw; height: 2px; background: red; position: absolute; left: 0; top: -${offset}px`;
        block.prepend(line);
      })
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


export { 
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
};