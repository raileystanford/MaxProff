class Popup {

  constructor(params) {

    this.triggers = document.querySelectorAll('[data-popup]');
    if (this.triggers.length === 0) return;

    this.params = params ?? {};
    this.params.backdrop = params.backdrop ?? true;
    this.params.scrollUnlockTime = params.scrollUnlockTime ?? 150;
    this.params.escapeButtonExit = params.escapeButtonExit ?? true;

    this.current = {};
    this.isMobile = window.matchMedia(`(max-width: ${params.mobileFrom ?? 768}px)`).matches;
    this.scrollWidth = window.innerWidth - document.documentElement.clientWidth;

    this.ownMethodsBinder();
    this.createBackdrop();
    this.setClassIntoPopups();
    this.setEventListeners();

  }

  setEventListeners() {

    document.addEventListener('click', (event) => {

      let trigger = event.target.closest('[data-popup]');
      let close = event.target.closest('[data-popup-close]');
      let overlay = !this.current.popup?.contains(event.target);

      if (trigger) {

        this.openPopup(trigger);

      } else if (close) {

        this.closePopup();

      } else if (overlay && this.current.popup?.matches('.active')) {

        if (this.params.overlayExit) {

          this.closePopup();

        } else {

          this.params.overlayForbiddenExit?.(this, this.current);

        }

      }

    });

    if (this.params.escapeButtonExit && !this.isMobile) {

      document.addEventListener('keydown', (event) => {

        if (event.key === 'Escape' && this.current.popup?.matches('.active')) {
          this.closePopup();
        } 
        
      });

    }

  }

  openPopup(data) {

    this.params.preOpenCallback?.(this, this.current);

    this.closePopup();

    let popClass = typeof data === 'string' ? data : data.dataset.popup;

    this.current.popup = document.querySelector(`.${popClass}`);
    if (data.dataset) this.current.opener = data;

    let popup = this.current.popup;

    if (this.current.opener) this.current.opener.disabled = true;
    this.backdrop?.classList.add('active');

    this.preventPageTrembling('open');

    popup.classList.add('active');
    popup.tabIndex = -1;
    popup.addEventListener('transitionend', (event) => popup.focus(), { once: true });
    popup.focus();

    this.params.afterOpenCallback?.(this, this.current);

  }

  closePopup() {

    let popup = this.current.popup;

    if (!popup) return;

    this.params.preCloseCallback?.(this, this.current);

    if (this.current.opener) this.current.opener.disabled = '';
    this.backdrop?.classList.remove('active');

    this.preventPageTrembling('close');

    popup.classList.remove('active');
    popup.tabIndex = '';
    popup.blur();

    this.params.afterCloseCallback?.(this, this.current);

    this.current.popup = null;
    this.current.opener = null;

  }

  preventPageTrembling(state) {

    if (this.isMobile) return;

    if (this.params.pageWrapper) {

      let wrapper = document.querySelector(this.params.pageWrapper);

      if (state === 'open') {

        clearTimeout(this.scrollUnlockTimer);
        document.body.style.overflow = 'hidden';
        wrapper.style.paddingRight = this.scrollWidth + 'px';

      } else {

        this.scrollUnlockTimer = setTimeout(() => {
          document.body.style.overflow = '';
          wrapper.style.paddingRight = '';
        }, this.params.scrollUnlockTime);
        
      }

    } else {

      if (state === 'open') {

        clearTimeout(this.scrollUnlockTimer);
        document.body.style.overflow = 'hidden';
        document.body.style.paddingRight = this.scrollWidth + 'px';

      } else {
        
        this.scrollUnlockTimer = setTimeout(() => {
          document.body.style.overflow = '';
          document.body.style.paddingRight = '';
        }, this.params.scrollUnlockTime);
      }

    }

  }

  createBackdrop() {

    if (!this.params.backdrop) return;

    this.backdrop = document.createElement('div');
    this.backdrop.classList.add('popup-backdrop');
    document.body.append(this.backdrop);

  }

  setClassIntoPopups() {

    Array.from(this.triggers).forEach((item) => {

      let popup = document.querySelector(`.${item.dataset.popup}`);
      if (popup) popup._popup = this;

    })

  }

}

class FormValidator {

  constructor(params) {

    this.forms = Array.from(document.querySelectorAll('[data-form]'));

    if (this.forms.length === 0) return;

    this.params = params ?? {};
    this.resetWhenChange = this.params.resetWhenChange ?? true;
    this.realTimeCheck = this.params.realTimeCheck;
    this.invalids = [];

    this.ownMethodsBinder();
    this.updateFormFields();
    this.initPhoneMask();
    this.setEventListeners();

  }

  setEventListeners() {

    document.addEventListener('submit', this.submitHandler);

    if (this.resetWhenChange || this.realTimeCheck) {
      document.addEventListener('input', this.inputHandler);
    }

  }

  submitHandler(event) {

    this.form = event.target;

    if (!this.form.closest('[data-form]')) return;

    event.preventDefault();

    this.form._elements.forEach((field) => {

      field.classList.remove('valid');

      if (field.type === 'text' || field.tagName === 'TEXTAREA' || field.type === 'search') {
        this.validateTextField(field);
      } else if (field.type === 'email') {
        this.validateEmailField(field);
      } else if (field.type === 'tel') {
        this.validatePhoneField(field);
      } else if (field.type === 'checkbox') {
        this.validateSoloCheckbox(field);
      } else if (field.tagName !== 'INPUT') {
        this.validateGroupedCheckboxRadios(field);
      }

    });

    let validInputs = this.form.querySelectorAll('.valid');

    if (validInputs.length === this.form._elements.length) {
      this.validEvent();
      // this.form.submit();
    } else {
      this.invalidEvent();
    }

  }

  inputHandler(event) {

    let input = event.target;

    if (!input.matches('[data-validate]')) return;

    input.classList.remove('valid');

    if (this.resetWhenChange) {
      
      if (input.matches('.invalid')) {
        input.classList.remove('invalid');
        this.resetEvent(input);
      }

    }

    if (this.realTimeCheck) {

      this.form = input.closest('[data-form]');

      if (input.type === 'text' || input.tagName === 'TEXTAREA' || input.type === 'search') {
        this.validateTextField(input);
      } else if (input.type === 'email') {
        this.validateEmailField(input);
      } else if (input.type === 'tel') {
        this.validatePhoneField(input);
      }

      if (this.invalids.length > 0) this.invalidEvent();

    }
 
  }

  validEvent() {

    let event = new CustomEvent('formvalid', {

      bubbles: true,
      cancelable: true,
      composed: true,

    });

    this.form.dispatchEvent(event);

  }

  invalidEvent() {

    let event = new CustomEvent('invalidinput', {

      bubbles: true,
      cancelable: true,
      composed: true,
      detail: [...this.invalids],

    });

    this.form.dispatchEvent(event);
    this.invalids.length = 0;

  }

  resetEvent(input) {

    let event = new CustomEvent('resetinput', {

      bubbles: true,
      cancelable: true,
      composed: true,
      detail: { input },

    });

    if (this.form) this.form.dispatchEvent(event);

  }

  validationError(input, msg) {

    input.classList.add('invalid');
    this.invalids.push({ input, msg });

  }

  validateTextField(input) {

    let opt = this.params.textInput ?? {};
    let value = input.value.trim();

    let isEmpty = value.length === 0;
    let isLatinText = !/[а-я]/i.test(value);
    let isCyrylicText = !/[a-z]/i.test(value);
    let isMinLengthDone = value.length >= (opt.minLength ?? 1);
    let isNotContainNumbers = !/\d+/.test(value);
    let isContainForbiddenSymbols;

    if (opt.forbiddenSymbols !== false) {
      isContainForbiddenSymbols = (opt.forbiddenSymbols ?? /[\!@\#\$\%\~\^\&\*\(\)_\=\+\{\}\[\];:'"\>\<,\./?\\\|`\-]/).test(value);
    } else {
      isContainForbiddenSymbols = false;
    }

    if (isEmpty) {
      this.validationError(input, 'Empty field');
    } else if (!isLatinText && opt.onlyLatin) {
      this.validationError(input, 'Only latins allowed');
    } else if (!isCyrylicText && opt.onlyCyrylic) {
      this.validationError(input, 'Only cyrylic allowed');
    } else if (!isNotContainNumbers && opt.noNumbers) {
      this.validationError(input, 'Digits not allowed');
    } else if (isContainForbiddenSymbols) {
      this.validationError(input, 'Forbidden symbol');
    } else if (!isMinLengthDone) {
      this.validationError(input, 'Text lower than minimum length');
    } else {
      input.classList.remove('invalid');
      input.classList.add('valid');
    }

  }

  validateEmailField(input) {

    let opt = this.params.emailInput ?? {};
    let value = input.value.trim();
    let regExp = /^[a-z][a-z0-9._-]*(?<![._-])@[a-z0-9-]+(?:\.[a-z0-9-]+)*\.[a-z]{2,}$/i;

    let isEmpty = value.length === 0;
    let isMultipleAccepted = input.multiple;
    let isMultiple = (value.match(/@/g) ?? []).length > 1;
    let isOnlyLatinSymbols = !/[а-я]/i.test(value);
    let isCorrectFormat, isAllowedDomain;

    if (isMultipleAccepted) {

      let correctCount = 0;

      let emails = value.split(' ');
    
      emails.forEach((email) => {
        if (regExp.test(email)) correctCount++;
      });

      if (correctCount === emails.length) {
        isCorrectFormat = true;
      } else {
        isCorrectFormat = false;
      }

    } else {

      isCorrectFormat = regExp.test(value);

    }

    if (opt.allowedDomains) {

      isAllowedDomain = opt.allowedDomains.some((item) => value.includes(item));

    } else {

      isAllowedDomain = true;

    }

    if (isEmpty) {
      this.validationError(input, 'Empty field');
    } else if (!isOnlyLatinSymbols) {
      this.validationError(input, 'Cyrylic symbols forbidden');
    } else if (!isMultipleAccepted && isMultiple) {
      this.validationError(input, 'More than one email');
    } else if (!isCorrectFormat) {
      this.validationError(input, 'Wrong email format');
    } else if (!isAllowedDomain) {
      this.validationError(input, 'Wrong mail service');
    } else {
      input.classList.remove('invalid');
      input.classList.add('valid');
    }

  }

  validatePhoneField(input) {

    if (this.isPhoneMaskExist) {

      let value = input._mask.unmaskedValue;
      let mask = input._mask.masked.mask;
      let maskLength = mask.match(/\d/g).length;
      let codeLength = mask.match(/\{\d+\}/)[0].length - 2;

      let isFullNumber = value.length === maskLength;
      let isEmpty = value.length === codeLength;

      if (isEmpty) {
        this.validationError(input, 'Empty field');
      } else if (!isFullNumber) {
        this.validationError(input, 'Enter full number');
      } else {
        input.classList.remove('invalid');
        input.classList.add('valid');
      }
      
    } else {

      let value = input.value.trim();
      value = value.includes('+') ? value.replace(/\+/g, '') : value;
      let opt = this.params.phoneInput ?? {};

      let isEmpty = value.length === 0;
      let isMultiple = input.multiple;
      let isContainForbiddenSymbols = /[а-яa-z!@#$%^&*\(\)_=\-\|\}\{'";:\/?\.\\>,<`~]/i.test(value);
      let isFullLength = opt.length ? value.length === opt.length : true;
      let isOverNumbered = value.length > opt.length;

      let isAllowedCountry, isCorrectFormat;

      if (opt.code) {

        if (isMultiple) {

          let phones = value.split(' ');
          let validCount = 0;

          phones.forEach((phone) => {

            if (phone.startsWith(opt.code)) validCount++;

          });

          isAllowedCountry = validCount === phones.length;

        } else {

          isAllowedCountry = value.startsWith(opt.code);

        }

      } else {

        isAllowedCountry = true;

      }

      if (isEmpty) {
        this.validationError(input, 'Empty field');
      } else if (isContainForbiddenSymbols) {
        this.validationError(input, 'Forbidden symbol');
      } else if (!isAllowedCountry) {
        this.validationError(input, 'Wrong number country');
      } else if (isOverNumbered) {
        this.validationError(input, 'Value bigger than length');
      } else if (!isFullLength) {
        this.validationError(input, 'Enter full number');
      }  else {
        input.classList.remove('invalid');
        input.classList.add('valid');
      }

    }

  }

  validateSoloCheckbox(input) {

    let isChecked = input.checked;

    if (!isChecked) {
      this.validationError(input, 'Checkbox not selected');
    } else {
      input.classList.remove('invalid');
      input.classList.add('valid');
    }

  }

  validateGroupedCheckboxRadios(element) {

    let inputs = Array.from(element.querySelectorAll('[type="checkbox"], [type="radio"]'));
    let isSomeChecked = inputs.some((input) => input.checked);

    if (!isSomeChecked) {
      this.validationError(element, 'Select at least one element');
    } else {
      element.classList.remove('invalid');
      element.classList.add('valid');
    }

  }

  async initPhoneMask() {

    if (!this.params.phoneMask) return;

    let inputs = Array.from(document.querySelectorAll('[data-form] input[type="tel"][data-validate]'));

    if (inputs.length === 0) return;

    let maskModule = await import('https://unpkg.com/imask?module');
    const IMask = maskModule.default ?? maskModule.IMask ?? window.IMask;

    inputs.forEach((input) => {

      let mask = IMask(input, this.params.phoneMask);
      input._mask = mask;

    });

    this.isPhoneMaskExist = true;

  }

  updateFormFields() {

    this.forms.forEach((form) => {

      let inputs = Array.from(form.querySelectorAll('[data-validate]'));

      form._validator = this;
      form._elements = inputs;
      
      inputs.forEach((input) => input._validator = this);

    });

  }

}

class DropMenu {

  constructor(params = {}) {

    this.blocks = Array.from(document.querySelectorAll('[data-drop-block]'));
    if (!this.blocks.length) return;

    this.opt = params;
    this.opt.mobile = this.opt.mobile ?? 768;
    this.opt.type = this.opt.type ?? 'click';
    this.opt.nestedType = this.opt.nestedType ?? this.opt.type;
    this.opt.multiple = this.opt.multiple;

    this.ownMethodsBinder();
    this.switchToMobile();
    this.defineElements();
    this.setEventListeners();

  }

  setEventListeners() {

    document.addEventListener('click', (event) => {

      const trigger = event.target.closest('[data-drop-trigger]');
      const block = event.target.closest('[data-drop-block]');
      const link = event.target.closest('[data-drop-content] a');

      if (trigger) {

        const currentBlock = trigger.closest('[data-drop-block]');
        const isNested = this.isNested(currentBlock);

        const type = isNested ? this.opt.nestedType : this.opt.type;

        this.openMenu(trigger, type);
        return;
      }

      if (!block) {
        this.closeAllMenus();
        return;
      }

      if (link) {
        this.closeAllMenus();
      }

    });

    document.addEventListener('pointerover', (event) => {

      const trigger = event.target.closest('[data-drop-trigger]');
      if (!trigger) return;

      const block = trigger.closest('[data-drop-block]');
      const isNested = this.isNested(block);

      const type = isNested ? this.opt.nestedType : this.opt.type;

      if (type === 'hover') {
        this.openMenu(trigger, 'hover');
      }

    });

  }

  openMenu(trigger, type = 'click') {

    const block = trigger.closest('[data-drop-block]');
    if (!block) return;

    if (type === 'click') {

      const isOpened = block.classList.contains('opened');

      if (!this.opt.multiple) {
        this.closeSiblings(block);
      }

      block.classList.toggle('opened');

      if (!isOpened) {
        this.opt.menuOpened?.(block);
      } else {
        this.opt.menuClosed?.(block);
      }

    }

    if (type === 'hover') {

      if (block.classList.contains('opened')) return;

      this.closeSiblings(block);

      block.classList.add('opened');
      this.opt.menuOpened?.(block);

      block.addEventListener('pointerleave', () => {
        this.closeBranch(block);
      }, { once: true });

    }

  }

  isNested(block) {
    return !!block.parentElement.closest('[data-drop-block]');
  }

  closeSiblings(block) {

    const parent = block.parentElement;

    const siblings = Array.from(parent.children).filter(el =>
      el !== block && el.matches('[data-drop-block]')
    );

    siblings.forEach((sib) => {
      this.closeBranch(sib);
    });

  }

  closeBranch(block) {

    if (block.classList.contains('opened')) {
      block.classList.remove('opened');
      this.opt.menuClosed?.(block);
    }

    block.querySelectorAll('.opened').forEach(child => {
      child.classList.remove('opened');
      this.opt.menuClosed?.(child);
    });

  }

  closeAllMenus() {

    this.blocks.forEach((block) => {
      if (block.classList.contains('opened')) {
        block.classList.remove('opened');
        this.opt.menuClosed?.(block);
      }
    });

  }

  switchToMobile() {

    const isMobile = window.matchMedia(`(max-width: ${this.opt.mobile}px)`).matches;

    if (isMobile) {
      this.opt.type = 'click';
      this.opt.nestedType = 'click';
    }

  }

  defineElements() {

    this.blocks.forEach((block) => {

      block._trigger = block.querySelector('[data-drop-trigger]');
      block._content = block.querySelector('[data-drop-content]');

    });

  }

}

class ChangeLanguage {

  constructor(params) {
    this.params = params ?? {};
    this.elements = Array.from(document.querySelectorAll('[data-lang]'));
    this.controls = Array.from(document.querySelectorAll('[data-lang-controls]'));
    this.dictionary = this.params.dictionary;
    this.autoSetted = false;
 
    if (this.elements.length > 0 && this.controls.length > 0) {
      this.ownMethodsBinder();
      this.getLanguages();
      if (this.params.autoSet) this.languageAutoSet();
      this.setEventListeners();
      if (!this.autoSetted) this.setCurrentLanguage();
    }
  }

  setEventListeners() {
    window.addEventListener('click', this.workOperator);
  }

  workOperator(event) {
    let target = event.target;

    if (target.closest('[data-lang-var]')) {
      let button = target.closest('[data-lang-var]');
      let language = button.dataset.langVar;

      this.changeLaguage(language);
    }
  }

  async languageAutoSet() {

    let request = await fetch('https://ipapi.co/json/');
    if (request.ok) {
      let response = await request.json();
      let countryCode = response.country_code.toLowerCase();
      let langPresense = this.langList.includes(countryCode);
      
      if (langPresense) {
        this.changeLaguage(countryCode);
        this.autoSetted = true;
      } 
      
    }
  }

  changeLaguage(language) {

    if (language === document.documentElement.lang) return;

    document.dispatchEvent(new CustomEvent('pretranslate', { bubbles: true, cancelable: true, composed: true, detail: language }));

    this.elements.forEach((item) => {

      let dictionary = this.dictionary;
      let innerHTML = item.dataset.lang.match(/\*/);
      let elementKey = item.dataset.lang.match(/[^\*]+/g)[0];
      let tag = item.tagName;
      let content;

      try {

        content = dictionary[elementKey][language];
        if (!content) throw new Error();
        
      } catch(err) {

        if (err.name === 'TypeError') {
          console.log(`key [${elementKey}] not found in dictionary`);
        } else {
          console.log(`lang variant [${language}] for key [${elementKey}] not found in dictionary`);
        }
 
      }

      if (tag === 'IMG') {

        item.alt = content;
  
      } else if (tag === 'INPUT' || tag === 'TEXTAREA') {

        item.placeholder = dictionary[elementKey][language];

      } else if (content) {

        if (innerHTML) {
          item.innerHTML = content;
        } else {
          item.textContent = content;
        }

      }

    });

    document.documentElement.lang = language;
    localStorage.setItem('currentLang', language);
    document.dispatchEvent(new CustomEvent('translated', { bubbles: true, cancelable: true, composed: true, detail: language }));

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

  updateElements() {
    this.elements = Array.from(document.querySelectorAll('[data-lang]'));
  }

  setCurrentLanguage() {

    let lang = localStorage.getItem('currentLang');
    if (this.langList.includes(lang)) this.changeLaguage(lang);

  }
}

class BurgerMenu {

  constructor(params) {

    this.params = params ?? {};
    this.params.exceptBtns = this.params.exceptBtns ?? '';
    let media = this.params.activationBreakpoint ?? 768;
    let mediaOk = window.matchMedia(`(max-width: ${media}px)`).matches;

    if (!mediaOk) return;

    this.ownMethodsBinder();
    this.getElements();
    this.createOverlay();
    this.setEventListeners();

  }

  setEventListeners() {

    document.addEventListener('click', (event) => {
        
      let target = event.target;
      let except = this.params.exceptBtns;

      if (target.closest('[data-burger-open]')) {
        this.openBurgerMenu();
      } else if (target.closest('[data-burger-close]')) {
        this.closeBurgerMenu();
      } else if ((target.closest('a') || target.closest(`button:not(${except})`)) && target.closest('[data-burger-content]')) {
        this.closeBurgerMenu();
      } else if (!target.closest('[data-burger-content]') && !target.closest('[data-burger-open]') && this.params.closeByClickOutOfMenu) {
        this.closeBurgerMenu();
      }

    });

  }

  openBurgerMenu() {
    this.openButton.classList.toggle('active');
    this.content.classList.toggle('active');
    this.overlay?.classList.toggle('active');
    
    this.handlePageOverflow();
    this.params.openCallback?.({ 
      button: this.openButton, 
      content: this.content, 
      overlay: this.overlay,
      closeBtn: this.closeButton,
    });
  }

  closeBurgerMenu() {
    this.openButton.classList.remove('active');
    this.content.classList.remove('active');
    this.overlay?.classList.remove('active');

    this.handlePageOverflow();
    this.params.closeCallback?.({ 
      button: this.openButton, 
      content: this.content, 
      overlay: this.overlay,
      closeBtn: this.closeButton,
    });
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

}

class UpdatePageTitle {

  constructor(params) {
    this.params = params ?? {};
    this.items = Array.from(document.querySelectorAll('[data-title]'));
    this.title = document.querySelector('title');
    let media = window.matchMedia(`(max-width: ${this.params.mobile ?? 768}px)`).matches;
    
    if (this.items.length > 0 && !media) {
      this.ownMethodsBinder();
      this.createObserver();
      this.installObserverOnElements();
      this.translateListener();
    }
  
  }

  installObserverOnElements() {

    this.items.forEach((item) => this.observer.observe(item));

  }

  createObserver() {

    let params = this.params.observer ?? {};

    let options = {
      root: null,
      rootMargin: params.rootMargin ?? '0px',
      threshold: params.threshold ?? 0.3,
      delay: params.delay ?? 0
    }

    this.observer = new IntersectionObserver(this.observerHandler, options);

  }

  observerHandler(list, observer) {

    list.forEach((item) => {

      let element = item.target;
      let msg = element.dataset.title;

      if (item.isIntersecting) {
        
        if (this.params.dictionary) {
          this.title._translateKey = msg; 
          this.translator();
        } else {
          this.title.textContent = msg;
        }
  
      }

    })

  }

  translateListener() {

    if (!this.params.dictionary) return;

    document.addEventListener('translated', (event) => this.translator());

  }

  translator() {

    let lang = document.documentElement.lang;
    let key = this.title._translateKey;
    if (!key) return;
    let text = this.params.dictionary[key][lang];
    this.title.textContent = text;

  }
}

class Demonstrator {

  constructor(selector, params = {}) {

    if (typeof Swiper === 'undefined') {
      console.warn('[Swiper] not loaded');
      return;
    }

    this.demonstrator = document.querySelector(selector);
    if (!this.demonstrator) return;

    this.opt = params;

    this.isMobile = window.matchMedia(`(max-width: ${this.opt.mobile ?? 768}px)`).matches;

    this.screen = this.demonstrator.querySelector('.demonstrator__screen');
    this.screenPic = this.screen?.querySelector('.demonstrator__big-img');

    this.scrollToClick = this.opt.scrollToClick ?? true;
    this.showSlideOnScreen = this.showSlideOnScreen.bind(this);

    this.initSlider();
    this.setLazyIntersectionObserver();
    this.setAutoplayIntersectionObserver();
    this.setEventListeners();

  }

  initSlider() {

    this.slider = this.demonstrator.querySelector('.swiper');
    if (!this.slider) {
      console.warn('Swiper container not found', this.demonstrator);
      return;
    }

    this.swiper = new Swiper(this.slider, {

      slidesPerView: 4,
      spaceBetween: 10,
      speed: 500,
      simulateTouch: true,
      direction: 'vertical',

      pagination: {
        el: this.demonstrator.querySelector('.demonstrator__pagination'),
        clickable: true,
        type: 'bullets',
      },

      navigation: {
        nextEl: this.demonstrator.querySelector('.demonstrator__btn--next'),
        prevEl: this.demonstrator.querySelector('.demonstrator__btn--prev'),
      },

      mousewheel: {
        enabled: true,
        forceToAxis: true,
      },

      keyboard: {
        enabled: true,
        onlyInViewport: true,
      },

      ...this.opt.slider

    });

    this.isAutoplayEnabled = this.swiper.params?.autoplay?.enabled;
    this.isLooped = this.swiper.params?.loop;

    if (!this.opt.lazy) {
      this.swiper.on('slideChange', this.showSlideOnScreen);
      this.showSlideOnScreen();
    }

  }

  setEventListeners() {

    this.demonstrator.addEventListener('click', (event) => {

      const slide = event.target.closest('.swiper-slide:not(.active)');
      if (slide) this.showSlideOnScreen(slide);

    });

    if (!this.isAutoplayEnabled) return;

    if (this.isMobile) {

      this.demonstrator.addEventListener('pointerdown', () => {
        this.swiper.autoplay.stop();
      });

    } else {

      this.demonstrator.addEventListener('pointerenter', () => {

        this.swiper.autoplay.stop();

        this.demonstrator.addEventListener('pointerleave', () => {
          this.swiper.autoplay.start();
        }, { once: true });

      });

    }

  }

  setAutoplayIntersectionObserver() {

    if (!this.opt.autoplayOnViewport || !this.isAutoplayEnabled) return;

    this.autoplayObserver = new IntersectionObserver((entries) => {

      if (!this.swiper) return;

      entries.forEach((entry) => {

        if (entry.isIntersecting) {
          this.swiper.autoplay.start();
        } else {
          this.swiper.autoplay.stop();
        }

      });

    }, {
      threshold: this.opt.autoplayOnViewport.threshold ?? 0.1,
      rootMargin: `${this.opt.autoplayOnViewport.margin ?? 0}px 0px`,
    });

    this.autoplayObserver.observe(this.demonstrator);

  }

  setLazyIntersectionObserver() {

    if (!this.opt.lazy) return;

    const fulls = Array.from(this.demonstrator.querySelectorAll('[data-full]'));

    this.lazyObserver = new IntersectionObserver((entries, obs) => {

      entries.forEach((entry) => {

        if (!entry.isIntersecting) return;

        fulls.forEach((item) => {
          const img = new Image();
          img.src = item.dataset.full;
        });

        this.loadThumbs();

        this.swiper.on('slideChange', this.showSlideOnScreen);
        this.showSlideOnScreen();

        obs.disconnect();

      });

    }, {
      threshold: this.opt.lazy.threshold ?? 0.01,
      rootMargin: `${this.opt.lazy.margin ?? 700}px 0px`
    });

    this.lazyObserver.observe(this.demonstrator);

  }

  loadThumbs() {

    const thumbs = Array.from(this.demonstrator.querySelectorAll('[data-lazy]'));

    thumbs.forEach((thumb) => {

      if (thumb.tagName === 'SOURCE') thumb.srcset = thumb.dataset.lazy;
      if (thumb.tagName === 'IMG') thumb.src = thumb.dataset.lazy;

      thumb.removeAttribute('data-lazy');

    });

  }

  showSlideOnScreen(slide) {

    if (!this.swiper) return;

    const data = this.getImgInfo(slide);
    if (!data.full) return;

    this.swiper.slides.forEach(s => s.classList.remove('active'));
    data.slide.classList.add('active');

    this.scrollSliderToSlide(data.slide);

    clearTimeout(this.imgTimer);
    clearTimeout(this.animTimer);

    this.screenPic.classList.add('active');

    this.imgTimer = setTimeout(() => {
      this.screenPic.src = data.full;
      this.screenPic.alt = data.alt ?? 'image';
    }, 150);

    this.animTimer = setTimeout(() => {
      this.screenPic.classList.remove('active');
    }, 300);

  }

  scrollSliderToSlide(slide) {

    if (!slide || !this.scrollToClick) return;

    if (this.isLooped) {
      const index = slide.dataset.swiperSlideIndex;
      this.swiper.slideToLoop(index);
    } else {
      const index = [...this.swiper.slides].indexOf(slide);
      this.swiper.slideTo(index);
    }

  }

  getImgInfo(slide) {

    const activeSlide = this.swiper.slides[this.swiper.activeIndex];

    slide = (slide && slide.classList?.contains('swiper-slide')) ? slide : activeSlide;

    const img = slide.querySelector('.demonstrator__img');
    if (!img) return {};

    return { full: img.dataset.full, alt: img.alt, slide };

  }

}

class ImageZoom {

  constructor(options = {}) {

    this.mode = options.mode ?? 'hover';
    this.isMobile = window.matchMedia(`(max-width:${options.mobileViewport ?? 768}px)`).matches;

    this.selectOptions(options);
    this.containers = document.querySelectorAll('[data-zoom]');
    this.createFullscreen();
    this.containers.forEach(c => this.initContainer(c));

  }

  selectOptions(options) {

    this.minZoom = options.minZoom ?? 1;
    this.maxZoom = options.maxZoom ?? 3;
    this.zoomStep = options.zoomStep ?? 0.15;
    this.startZoom = options.startZoom ?? 1.6;

    if (!this.isMobile) return;

    let mobile = Object.keys(options.mobile ?? {}).length > 0;

    if (!mobile) return

    this.minZoom = options.mobile.minZoom ?? options.minZoom ?? 1;
    this.maxZoom = options.mobile.maxZoom ?? options.maxZoom ?? 3;
    this.zoomStep = options.mobile.zoomStep ?? options.zoomStep ?? 0.15;
    this.startZoom = options.mobile.startZoom ?? options.startZoom ?? 1.6;

  }

  initContainer(container) {

    const img = container.querySelector('[data-zoom-img]');
    if (!img) return;

    if (this.isMobile) {
      container.addEventListener('click', () => this.openFullscreen(img));
      return;
    }

    container.style.position = 'relative';
    container.style.overflow = 'hidden';

    Object.assign(img.style, {
      position: 'absolute',
      transformOrigin: '0 0',
      willChange: 'transform'
    });

    img.dataset.zoomScale = 1;
    img.dataset.imgX = 0;
    img.dataset.imgY = 0;

    this.mode === 'hover'
      ? this.initHoverZoom(container, img)
      : this.initClickZoom(container, img);

    container.addEventListener('wheel', e => {
      e.preventDefault();
      const { x, y } = this.getCoords(e, container);
      this.zoomDesktop(img, e.deltaY < 0 ? 1 : -1, x, y, container);
    }, { passive: false });

    container.addEventListener('dragstart', e => e.preventDefault());
  }

  initHoverZoom(container, img) {

    let active = false;

    const move = e => {
      const { x, y } = this.getCoords(e, container);

      if (!active) {
        img.dataset.zoomScale = this.startZoom;
        active = true;
      }

      this.moveDesktop(img, x, y, container);
    };

    container.addEventListener('mouseenter', () => {
      container.classList.add('active');
      container.addEventListener('mousemove', move);
    });

    container.addEventListener('mouseleave', () => {
      container.classList.remove('active');
      container.removeEventListener('mousemove', move);
      img.dataset.zoomScale = 1;
      this.applyDesktopTransform(img, 0, 0, container);
      active = false;
    });
  }

  initClickZoom(container, img) {

    let dragging = false;
    let moved = false;
    let startX = 0;
    let startY = 0;

    container.addEventListener('pointerdown', e => {
      if (+img.dataset.zoomScale === 1) return;
      dragging = true;
      moved = false;
      startX = e.clientX;
      startY = e.clientY;
      container.setPointerCapture(e.pointerId);
    });

    container.addEventListener('pointermove', e => {
      if (!dragging) return;

      const dx = e.clientX - startX;
      const dy = e.clientY - startY;

      if (Math.abs(dx) > 2 || Math.abs(dy) > 2) moved = true;

      startX = e.clientX;
      startY = e.clientY;

      this.applyDesktopTransform(
        img,
        (+img.dataset.imgX) + dx,
        (+img.dataset.imgY) + dy,
        container
      );
    });

    container.addEventListener('pointerup', () => dragging = false);

    container.addEventListener('click', e => {

      if (moved) {
        moved = false;
        return;
      }

      if (+img.dataset.zoomScale === 1) {
        container.classList.add('active');
        img.dataset.zoomScale = this.startZoom;
        const { x, y } = this.getCoords(e, container);
        this.applyDesktopTransform(
          img,
          -x * (this.startZoom - 1),
          -y * (this.startZoom - 1),
          container
        );
      } else {
        container.classList.remove('active');
        img.dataset.zoomScale = 1;
        this.applyDesktopTransform(img, 0, 0, container);
      }
    });
  }

  zoomDesktop(img, dir, x, y, container) {

    let scale = +img.dataset.zoomScale;
    scale = Math.min(this.maxZoom, Math.max(this.minZoom, scale + this.zoomStep * dir));
    img.dataset.zoomScale = scale;

    this.applyDesktopTransform(
      img,
      -x * (scale - 1),
      -y * (scale - 1),
      container
    );
  }

  moveDesktop(img, x, y, container) {
    if (+img.dataset.zoomScale <= 1) return;
    this.applyDesktopTransform(
      img,
      -x * (+img.dataset.zoomScale - 1),
      -y * (+img.dataset.zoomScale - 1),
      container
    );
  }

  applyDesktopTransform(img, x, y, container) {

    if (!container) return;

    const scale = +img.dataset.zoomScale;
    const cw = container.clientWidth;
    const ch = container.clientHeight;
    const iw = img.offsetWidth * scale;
    const ih = img.offsetHeight * scale;

    const minX = Math.min(0, cw - iw);
    const minY = Math.min(0, ch - ih);

    x = Math.min(0, Math.max(minX, x));
    y = Math.min(0, Math.max(minY, y));

    img.dataset.imgX = x;
    img.dataset.imgY = y;
    img.style.transform = `translate(${x}px, ${y}px) scale(${scale})`;
  }

  createFullscreen() {

    if (!this.isMobile) return;

    this.fs = document.createElement('div');
    this.fs.className = 'zoom-fs';

    this.fsImg = document.createElement('img');
    this.fsImg.classList.add('zoom-fs__img');

    this.closeBtn = document.createElement('button');
    this.closeBtn.className = 'zoom-fs__close-btn';
    this.closeBtn.textContent = '✕';

    this.fs.append(this.fsImg, this.closeBtn);
    document.body.appendChild(this.fs);

    this.initFullscreenGestures();

    this.closeBtn.onclick = () => this.closeFullscreen();
    this.fs.onclick = e => e.target === this.fs && this.closeFullscreen();

  }

  openFullscreen(sourceImg) {

    this.fsImg.src = sourceImg.src;

    this.scale = 1;
    this.x = 0;
    this.y = 0;

    this.applyFullscreenTransform();

    requestAnimationFrame(() => {
      this.fs.classList.add('active');
    });

    document.body.style.overflow = 'hidden';
  }

  closeFullscreen() {

    this.applyFullscreenTransform();
    this.fs.classList.remove('active');
    document.body.style.overflow = '';

  }

  initFullscreenGestures() {

    let startDist = 0;
    let startScale = 1;
    let startX = 0;
    let startY = 0;
    let dragging = false;

    this.fs.addEventListener('touchstart', e => {

      this.fsImg.style.transition = 'none';

      if (e.touches.length === 2) {
        startDist = this.getDistance(e.touches[0], e.touches[1]);
        startScale = this.scale;
      }

      if (e.touches.length === 1 && this.scale > 1) {
        dragging = true;
        startX = e.touches[0].clientX;
        startY = e.touches[0].clientY;
      }

    }, { passive: false });

    this.fs.addEventListener('touchmove', e => {
      e.preventDefault();

      if (e.touches.length === 2) {
        const dist = this.getDistance(e.touches[0], e.touches[1]);
        this.scale = Math.min(this.maxZoom, Math.max(this.minZoom, startScale * (dist / startDist)));
        this.constrainFullscreen();
        this.applyFullscreenTransform();
      }

      if (dragging && e.touches.length === 1) {
        const dx = e.touches[0].clientX - startX;
        const dy = e.touches[0].clientY - startY;
        startX = e.touches[0].clientX;
        startY = e.touches[0].clientY;
        this.x += dx;
        this.y += dy;
        this.constrainFullscreen();
        this.applyFullscreenTransform();
      }

    }, { passive: false });

    this.fs.addEventListener('touchend', () => dragging = false);
  }

  constrainFullscreen() {

    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const iw = this.fsImg.offsetWidth * this.scale;
    const ih = this.fsImg.offsetHeight * this.scale;

    const minX = Math.min(0, (vw - iw) / 2);
    const maxX = Math.max(0, (iw - vw) / 2);
    const minY = Math.min(0, (vh - ih) / 2);
    const maxY = Math.max(0, (ih - vh) / 2);

    this.x = Math.min(maxX, Math.max(minX, this.x));
    this.y = Math.min(maxY, Math.max(minY, this.y));
  }

  applyFullscreenTransform() {
    this.fsImg.style.transform = `translate(-50%, -50%) translate(${this.x}px, ${this.y}px) scale(${this.scale})`;
  }

  getCoords(e, el) {
    const r = el.getBoundingClientRect();
    return { x: e.clientX - r.left, y: e.clientY - r.top };
  }

  getDistance(a, b) {
    return Math.hypot(a.clientX - b.clientX, a.clientY - b.clientY);
  }

}

class ScrollToTop {

  constructor(params) {
    this.params = params ?? {};
    this.clientWidth = document.documentElement.clientWidth;
    this.button = document.querySelector('[data-scroll-top]');

    if (this.button) {
      this.ownMethodsBinder();
      this.setEventListeners(); 
      this.scrollHandler(); 
    }
  }

  setEventListeners() {
    window.addEventListener('scroll', this.scrollHandler);
    window.addEventListener('resize', this.updateClientWidth);
    this.button.addEventListener('click', this.moveToTop);
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
    return activationCoordinate ?? 900;
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

}




function setupMixin(...classes) {

  const mixin = {

    ownMethodsBinder() {
      let prototype = Object.getPrototypeOf(this);
      let ownMethods = Object.getOwnPropertyNames(prototype);

      for (let item of ownMethods) {
        if (item !== 'constructor') prototype[item] = prototype[item].bind(this);
      }
    }

  };

  classes.forEach((item) => Object.assign(item.prototype, mixin));

}

setupMixin(
  Popup,
  FormValidator,
  DropMenu,
  ChangeLanguage,
  BurgerMenu,
  UpdatePageTitle,
  ScrollToTop,
);

export {
  Popup,
  FormValidator,
  DropMenu,
  ChangeLanguage,
  BurgerMenu,
  UpdatePageTitle,
  Demonstrator,
  ImageZoom,
  ScrollToTop,
}