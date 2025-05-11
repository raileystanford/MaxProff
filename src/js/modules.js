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


export { Popup, ChangeLanguage, DropdownMenu, CustomRange };