class HeaderShell extends HTMLElement {
  connectedCallback() {
    if (this.initialized) return;
    this.initialized = true;
    this.onClick = this.onClick.bind(this);
    this.onClose = this.onClose.bind(this);
    this.onDocumentClick = this.onDocumentClick.bind(this);
    this.onDocumentKeydown = this.onDocumentKeydown.bind(this);
    this.onNavGroupPointerEnter = this.onNavGroupPointerEnter.bind(this);
    this.onNavGroupPointerLeave = this.onNavGroupPointerLeave.bind(this);
    this.hoverCloseTimer = null;
    this.addEventListener('click', this.onClick);
    document.addEventListener('click', this.onDocumentClick);
    document.addEventListener('keydown', this.onDocumentKeydown);
    this.querySelectorAll('[data-header-dialog]').forEach((dialog) => dialog.addEventListener('close', this.onClose));
    this.navGroups = [...this.querySelectorAll('.header-shell__nav-group')];
    this.mobileMenu = this.querySelector('[data-mobile-menu]');
    this.mobileMenu?.setAttribute('data-mobile-menu-enhanced', '');
    this.mobileMenu?.querySelectorAll('[data-mobile-menu-open]').forEach((trigger) => trigger.setAttribute('aria-expanded', 'false'));

    if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
      this.navGroups.forEach((group) => {
        group.addEventListener('pointerenter', this.onNavGroupPointerEnter);
        group.addEventListener('pointerleave', this.onNavGroupPointerLeave);
      });
    }

    // Khởi tạo GSAP animations cho Header
    this.initGsapAnimations();
  }

  disconnectedCallback() {
    this.removeEventListener('click', this.onClick);
    document.removeEventListener('click', this.onDocumentClick);
    document.removeEventListener('keydown', this.onDocumentKeydown);
    this.querySelectorAll('[data-header-dialog]').forEach((dialog) => dialog.removeEventListener('close', this.onClose));
    this.navGroups?.forEach((group) => {
      group.removeEventListener('pointerenter', this.onNavGroupPointerEnter);
      group.removeEventListener('pointerleave', this.onNavGroupPointerLeave);
    });
    window.clearTimeout(this.hoverCloseTimer);
    if (this.scrollTriggerInstance) {
      this.scrollTriggerInstance.kill();
    }
    this.initialized = false;
  }

  /**
   * Tích hợp GSAP & ScrollTrigger cho Header Shopify
   */
  initGsapAnimations() {
    if (typeof gsap === 'undefined') return;

    // Kích hoạt ScrollTrigger plugin
    if (typeof ScrollTrigger !== 'undefined') {
      gsap.registerPlugin(ScrollTrigger);
    }

    // Tắt animation nếu người dùng bật chế độ giảm chuyển động
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    // 1. Entrance Timeline: Hiệu ứng xuất hiện khi mới load trang
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

    const logo = this.querySelector('.header-shell__brand');
    const navItems = this.querySelectorAll('.header-shell__desktop-nav > *');
    const actionButtons = this.querySelectorAll('.header-shell__actions > *');

    if (logo) {
      tl.from(logo, {
        y: -25,
        opacity: 0,
        duration: 0.7,
      });
    }

    if (navItems.length > 0) {
      tl.from(
        navItems,
        {
          y: -15,
          opacity: 0,
          duration: 0.5,
          stagger: 0.08,
        },
        '-=0.4'
      );
    }

    if (actionButtons.length > 0) {
      tl.from(
        actionButtons,
        {
          scale: 0.8,
          opacity: 0,
          duration: 0.4,
          stagger: 0.06,
          ease: 'back.out(1.7)',
        },
        '-=0.3'
      );
    }

    // 2. Hover Micro-interactions cho Icon Button (Search, Account, Cart)
    actionButtons.forEach((btn) => {
      btn.addEventListener('mouseenter', () => {
        gsap.to(btn, { scale: 1.18, rotation: 3, duration: 0.25, ease: 'power2.out' });
      });
      btn.addEventListener('mouseleave', () => {
        gsap.to(btn, { scale: 1, rotation: 0, duration: 0.25, ease: 'power2.out' });
      });
    });

    // 3. ScrollTrigger: Tự động hiệu ứng cuộn trang (Sticky Glassmorphism & Smart Hide/Reveal)
    if (typeof ScrollTrigger !== 'undefined') {
      let lastScrollY = window.scrollY;

      this.scrollTriggerInstance = ScrollTrigger.create({
        start: 'top top',
        end: 'max',
        onUpdate: (self) => {
          const currentScrollY = self.scroll();

          // Thêm class chuyển sang nền mờ Glassmorphism khi cuộn > 40px
          if (currentScrollY > 40) {
            this.classList.add('header-shell--scrolled');
          } else {
            this.classList.remove('header-shell--scrolled');
          }

          // Smart Hide/Reveal: Cuộn xuống 150px ẩn Header, cuộn lên hiện Header
          if (currentScrollY > 150 && currentScrollY > lastScrollY) {
            gsap.to(this, { yPercent: -100, duration: 0.35, ease: 'power2.inOut', overwrite: 'auto' });
          } else {
            gsap.to(this, { yPercent: 0, duration: 0.35, ease: 'power2.out', overwrite: 'auto' });
          }

          lastScrollY = currentScrollY;
        },
      });
    }
  }

  onNavGroupPointerEnter(event) {
    window.clearTimeout(this.hoverCloseTimer);
    const activeGroup = event.currentTarget;
    this.navGroups.forEach((group) => {
      if (group !== activeGroup) group.removeAttribute('open');
    });

    const wasOpen = activeGroup.hasAttribute('open');
    activeGroup.setAttribute('open', '');

    // GSAP Submenu Dropdown Animation (Fade & Spring Drop)
    if (!wasOpen && typeof gsap !== 'undefined') {
      const submenu = activeGroup.querySelector('.header-shell__submenu');
      if (submenu) {
        gsap.fromTo(
          submenu,
          { opacity: 0, y: 15, scale: 0.94 },
          { opacity: 1, y: 0, scale: 1, duration: 0.3, ease: 'back.out(1.4)', overwrite: 'auto' }
        );
      }
    }
  }

  onNavGroupPointerLeave(event) {
    const activeGroup = event.currentTarget;
    this.hoverCloseTimer = window.setTimeout(() => {
      if (!activeGroup.matches(':hover')) activeGroup.removeAttribute('open');
    }, 180);
  }

  onDocumentClick(event) {
    const clickedGroup = event.target.closest?.('.header-shell__nav-group');
    this.querySelectorAll('.header-shell__nav-group[open]').forEach((group) => {
      if (group !== clickedGroup) group.removeAttribute('open');
    });
  }

  onDocumentKeydown(event) {
    if (event.key !== 'Escape') return;
    const openGroups = [...this.querySelectorAll('.header-shell__nav-group[open]')];
    if (openGroups.length === 0) return;

    const focusedGroup = document.activeElement?.closest?.('.header-shell__nav-group');
    openGroups.forEach((group) => group.removeAttribute('open'));
    focusedGroup?.querySelector('summary')?.focus();
  }

  openMobileSubmenu(trigger) {
    const panelId = trigger.dataset.mobileMenuOpen;
    const panel = this.querySelector(`#${CSS.escape(panelId)}`);
    const rootPanel = this.mobileMenu?.querySelector('[data-mobile-menu-root]');
    if (!panel || !rootPanel) return;

    this.resetMobileSubmenu();
    rootPanel.hidden = true;
    panel.hidden = false;
    this.mobileMenu.dataset.activeSubmenu = panelId;
    trigger.setAttribute('aria-expanded', 'true');
    panel.querySelector('[data-mobile-menu-back]')?.focus();

    // GSAP Mobile Submenu Stagger Animation
    if (typeof gsap !== 'undefined') {
      const items = panel.querySelectorAll('a, button, h3');
      gsap.fromTo(
        items,
        { opacity: 0, x: 20 },
        { opacity: 1, x: 0, duration: 0.35, stagger: 0.05, ease: 'power2.out' }
      );
    }
  }

  resetMobileSubmenu({ restoreFocus = false } = {}) {
    const activePanelId = this.mobileMenu?.dataset.activeSubmenu;
    if (!activePanelId) return;

    const activePanel = this.querySelector(`#${CSS.escape(activePanelId)}`);
    const activeTrigger = this.mobileMenu.querySelector(`[data-mobile-menu-open="${CSS.escape(activePanelId)}"]`);
    activePanel?.setAttribute('hidden', '');
    this.mobileMenu.querySelector('[data-mobile-menu-root]')?.removeAttribute('hidden');
    delete this.mobileMenu.dataset.activeSubmenu;
    activeTrigger?.setAttribute('aria-expanded', 'false');
    if (restoreFocus) activeTrigger?.focus();
  }

  onClick(event) {
    const mobileMenuTrigger = event.target.closest('[data-mobile-menu-open]');
    if (mobileMenuTrigger) {
      event.preventDefault();
      this.openMobileSubmenu(mobileMenuTrigger);
      return;
    }

    const mobileMenuBack = event.target.closest('[data-mobile-menu-back]');
    if (mobileMenuBack) {
      this.resetMobileSubmenu({ restoreFocus: true });
      return;
    }

    const openButton = event.target.closest('[data-dialog-open]');
    if (openButton) {
      const dialog = this.querySelector(`[data-header-dialog="${CSS.escape(openButton.dataset.dialogOpen)}"]`);
      if (!dialog) return;
      this.activeOpener = openButton;
      dialog.showModal();

      // GSAP Stagger cho Drawer / Search Dialog
      if (typeof gsap !== 'undefined') {
        const dialogItems = dialog.querySelectorAll('.header-shell__drawer-header, nav > *, form');
        gsap.fromTo(
          dialogItems,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.4, stagger: 0.07, ease: 'power2.out', delay: 0.05 }
        );
      }

      if (openButton.dataset.dialogOpen === 'search') {
        requestAnimationFrame(() => dialog.querySelector('input[type="search"]')?.focus());
      }
      return;
    }

    const closeButton = event.target.closest('[data-dialog-close]');
    if (closeButton) {
      closeButton.closest('dialog')?.close();
      return;
    }

    if (event.target.matches('dialog[open][data-header-dialog]')) event.target.close();
  }

  onClose(event) {
    if (event.currentTarget?.dataset.headerDialog === 'menu') this.resetMobileSubmenu();
    this.activeOpener?.focus();
    this.activeOpener = null;
  }
}

if (!customElements.get('header-shell')) customElements.define('header-shell', HeaderShell);
