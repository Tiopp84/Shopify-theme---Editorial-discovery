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
    this.onScroll = this.onScroll.bind(this);
    this.onMotionPreferenceChange = this.onMotionPreferenceChange.bind(this);
    this.onDesktopLayoutChange = this.onDesktopLayoutChange.bind(this);
    this.hoverCloseTimer = null;
    this.scrollFrame = null;
    this.lastScrollY = window.scrollY;
    this.desktopCompactDownDistance = 0;
    this.desktopCompactUpDistance = 0;
    this.desktopCompactEnterDistance = 40;
    this.desktopCompactExitDistance = 96;
    this.desktopScrollDeadZone = 2;
    this.desktopScrollInitialized = false;
    this.mobileBarDownDistance = 0;
    this.mobileBarUpDistance = 0;
    this.mobileBarThreshold = 72;
    this.mobileBarRevealDistance = 16;
    this.mobileBarHideDistance = 32;
    this.mobileBarHoldDuration = 900;
    this.mobileBarLockUntil = 0;
    this.wasHoldingCompactContext = false;
    this.compactContextSources = new Set();
    this.reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    this.desktopLayoutQuery = window.matchMedia('(min-width: 64rem)');
    this.mobileSearchDrawerQuery = window.matchMedia('(max-width: 47.99rem)');
    this.addEventListener('click', this.onClick);
    document.addEventListener('click', this.onDocumentClick);
    document.addEventListener('keydown', this.onDocumentKeydown);
    this.querySelectorAll('[data-header-dialog]').forEach((dialog) => dialog.addEventListener('close', this.onClose));
    this.navGroups = [...this.querySelectorAll('.header-shell__nav-group')];
    this.dropdownHoverEnabled = this.dataset.dropdownHover === 'true';
    this.compactHeaderEnabled = this.dataset.compactHeaderEnabled !== 'false';
    this.mobileMenu = this.querySelector('[data-mobile-menu]');
    this.mobileTaskbar = this.querySelector('.header-shell__mobile-taskbar');
    this.headerInner = this.querySelector('.header-shell__inner');
    this.mobileTaskbar?.setAttribute('inert', '');
    this.mobileMenu?.setAttribute('data-mobile-menu-enhanced', '');
    this.mobileMenu?.querySelectorAll('[data-mobile-menu-open]').forEach((trigger) => trigger.setAttribute('aria-expanded', 'false'));

    if (this.dropdownHoverEnabled) {
      this.navGroups.forEach((group) => {
        group.addEventListener('pointerenter', this.onNavGroupPointerEnter);
        group.addEventListener('pointerleave', this.onNavGroupPointerLeave);
      });
    }

    this.reducedMotionQuery.addEventListener('change', this.onMotionPreferenceChange);
    this.desktopLayoutQuery.addEventListener('change', this.onDesktopLayoutChange);
    this.startMotion();
  }

  disconnectedCallback() {
    this.removeEventListener('click', this.onClick);
    document.removeEventListener('click', this.onDocumentClick);
    document.removeEventListener('keydown', this.onDocumentKeydown);
    this.querySelectorAll('[data-header-dialog]').forEach((dialog) => dialog.removeEventListener('close', this.onClose));
    if (this.dropdownHoverEnabled) {
      this.navGroups?.forEach((group) => {
        group.removeEventListener('pointerenter', this.onNavGroupPointerEnter);
        group.removeEventListener('pointerleave', this.onNavGroupPointerLeave);
      });
    }
    window.clearTimeout(this.hoverCloseTimer);
    window.removeEventListener('scroll', this.onScroll);
    this.reducedMotionQuery?.removeEventListener('change', this.onMotionPreferenceChange);
    this.desktopLayoutQuery?.removeEventListener('change', this.onDesktopLayoutChange);
    if (this.scrollFrame) window.cancelAnimationFrame(this.scrollFrame);
    this.scrollFrame = null;
    this.mobileBarLockUntil = 0;
    this.wasHoldingCompactContext = false;
    this.compactContextSources?.clear();
    this.hideMobileTaskbar();
    this.classList.remove('header-shell--compact', 'header-shell--scrolled');
    this.initialized = false;
  }

  startMotion() {
    if (!this.classList.contains('header-shell--sticky')) return;
    this.updateScrollState();
    window.addEventListener('scroll', this.onScroll, { passive: true });
  }

  onMotionPreferenceChange() {
    window.removeEventListener('scroll', this.onScroll);
    if (this.scrollFrame) window.cancelAnimationFrame(this.scrollFrame);
    this.scrollFrame = null;
    this.classList.remove('header-shell--compact');
    this.hideMobileTaskbar();
    this.lastScrollY = window.scrollY;
    this.mobileBarLockUntil = 0;
    this.wasHoldingCompactContext = false;
    this.compactContextSources.clear();
    this.desktopScrollInitialized = false;
    this.resetDesktopCompactDistance();
    this.resetMobileBarDistance();
    this.startMotion();
  }

  onDesktopLayoutChange() {
    this.classList.remove('header-shell--compact');
    this.hideMobileTaskbar();
    this.wasHoldingCompactContext = false;
    this.compactContextSources.clear();
    this.desktopScrollInitialized = false;
    this.resetDesktopCompactDistance();
    this.resetMobileBarDistance();
    this.updateScrollState();
  }

  onScroll() {
    if (this.scrollFrame) return;

    this.scrollFrame = window.requestAnimationFrame(() => {
      this.updateScrollState();
      this.scrollFrame = null;
    });
  }

  hasHeldCompactContext() {
    const sections = [...document.querySelectorAll('[data-header-scroll-policy="hold-compact-header"]')];
    const activeSources = new Set();

    sections.forEach((section) => {
      const stickyTarget = section.querySelector('[data-header-scroll-target]');
      if (!stickyTarget) return;

      const stickyStyle = window.getComputedStyle(stickyTarget);
      if (stickyStyle.position !== 'sticky') return;
      const stickyOffset = Number.parseFloat(stickyStyle.top) || 0;
      const targetBounds = stickyTarget.getBoundingClientRect();
      const sectionBounds = section.getBoundingClientRect();
      const wasActive = this.compactContextSources.has(section);
      const releaseBuffer = wasActive ? 16 : 1;
      const isActive = targetBounds.top <= stickyOffset + releaseBuffer
        && sectionBounds.bottom > stickyOffset + targetBounds.height - releaseBuffer;
      if (isActive) activeSources.add(section);
    });

    this.compactContextSources = activeSources;
    return activeSources.size > 0;
  }

  updateScrollState() {
    const scrollY = window.scrollY;
    const delta = scrollY - this.lastScrollY;
    const dialogOpen = this.querySelector('dialog[open]');
    const activeElement = document.activeElement;
    const keyboardFocusInside = this.contains(activeElement) && activeElement?.matches?.(':focus-visible');
    this.classList.toggle('header-shell--scrolled', scrollY > 40);

    if (!this.desktopLayoutQuery.matches) {
      this.classList.remove('header-shell--compact');
      this.resetDesktopCompactDistance();
      if (this.compactHeaderEnabled) {
        this.updateMobileTaskbar({ scrollY, delta, dialogOpen });
      } else {
        this.hideMobileTaskbar();
      }
      this.lastScrollY = scrollY;
      return;
    }

    this.hideMobileTaskbar();
    this.resetMobileBarDistance();

    if (!this.compactHeaderEnabled) {
      this.classList.remove('header-shell--compact');
      this.resetDesktopCompactDistance();
      this.lastScrollY = scrollY;
      return;
    }

    if (this.hasHeldCompactContext()) {
      this.classList.add('header-shell--compact');
      this.wasHoldingCompactContext = true;
      this.desktopScrollInitialized = true;
      this.resetDesktopCompactDistance();
      this.lastScrollY = scrollY;
      return;
    }

    if (this.wasHoldingCompactContext) {
      this.wasHoldingCompactContext = false;
      if (delta < 0) {
        this.classList.remove('header-shell--compact');
        this.resetDesktopCompactDistance();
        this.lastScrollY = scrollY;
        return;
      }
    }

    if (scrollY <= 40 || dialogOpen || keyboardFocusInside) {
      this.classList.remove('header-shell--compact');
      this.desktopScrollInitialized = true;
      this.resetDesktopCompactDistance();
      this.lastScrollY = scrollY;
      return;
    }

    if (!this.desktopScrollInitialized) {
      this.classList.toggle('header-shell--compact', scrollY > 120);
      this.desktopScrollInitialized = true;
      this.resetDesktopCompactDistance();
      this.lastScrollY = scrollY;
      return;
    }

    if (Math.abs(delta) > this.desktopScrollDeadZone) {
      if (delta > 0) {
        this.desktopCompactDownDistance += delta;
        this.desktopCompactUpDistance = 0;
        if (!this.classList.contains('header-shell--compact') && this.desktopCompactDownDistance >= this.desktopCompactEnterDistance) {
          this.classList.add('header-shell--compact');
          this.resetDesktopCompactDistance();
        }
      } else {
        this.desktopCompactUpDistance += Math.abs(delta);
        this.desktopCompactDownDistance = 0;
        if (this.classList.contains('header-shell--compact') && this.desktopCompactUpDistance >= this.desktopCompactExitDistance) {
          this.classList.remove('header-shell--compact');
          this.resetDesktopCompactDistance();
        }
      }
    }

    this.lastScrollY = scrollY;
  }

  resetDesktopCompactDistance() {
    this.desktopCompactDownDistance = 0;
    this.desktopCompactUpDistance = 0;
  }

  updateMobileTaskbar({ scrollY, delta, dialogOpen }) {
    const taskbarVisible = this.classList.contains('header-shell--mobile-taskbar');

    if (dialogOpen) {
      return;
    }

    if (scrollY <= this.mobileBarThreshold) {
      this.hideMobileTaskbar();
      this.resetMobileBarDistance();
      this.mobileBarLockUntil = 0;
      return;
    }

    if (delta > 0) {
      this.mobileBarDownDistance += delta;
      this.mobileBarUpDistance = 0;
      if (!taskbarVisible && this.mobileBarDownDistance >= this.mobileBarRevealDistance) {
        this.showMobileTaskbar();
        this.resetMobileBarDistance();
      }
      return;
    }

    if (delta < 0) {
      this.mobileBarUpDistance += Math.abs(delta);
      this.mobileBarDownDistance = 0;
      if (taskbarVisible && this.mobileBarUpDistance >= this.mobileBarHideDistance && !this.mobileTaskbarIsLocked()) {
        this.hideMobileTaskbar();
        this.resetMobileBarDistance();
      }
    }
  }

  resetMobileBarDistance() {
    this.mobileBarDownDistance = 0;
    this.mobileBarUpDistance = 0;
  }

  showMobileTaskbar() {
    this.classList.add('header-shell--mobile-taskbar');
    this.headerInner?.setAttribute('inert', '');
    this.mobileTaskbar?.removeAttribute('inert');
    this.mobileBarLockUntil = performance.now() + this.mobileBarHoldDuration;
  }

  hideMobileTaskbar() {
    this.classList.remove('header-shell--mobile-taskbar');
    this.headerInner?.removeAttribute('inert');
    this.mobileTaskbar?.setAttribute('inert', '');
  }

  mobileTaskbarIsLocked() {
    return performance.now() < this.mobileBarLockUntil;
  }

  onNavGroupPointerEnter(event) {
    if (event.pointerType && event.pointerType !== 'mouse') return;
    window.clearTimeout(this.hoverCloseTimer);
    const activeGroup = event.currentTarget;
    this.navGroups.forEach((group) => {
      if (group !== activeGroup) group.removeAttribute('open');
    });
    activeGroup.setAttribute('open', '');
  }

  onNavGroupPointerLeave(event) {
    if (event.pointerType && event.pointerType !== 'mouse') return;
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
      this.classList.remove('header-shell--compact');
      dialog.showModal();
      if (openButton.dataset.dialogOpen === 'search' && !this.mobileSearchDrawerQuery.matches) {
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
    const reopenMobileTaskbar = this.activeOpener?.closest('.header-shell__mobile-taskbar');
    this.activeOpener?.focus();
    this.activeOpener = null;
    if (reopenMobileTaskbar && !this.desktopLayoutQuery.matches && window.scrollY > this.mobileBarThreshold) {
      this.showMobileTaskbar();
    }
    this.updateScrollState();
  }
}

if (!customElements.get('header-shell')) customElements.define('header-shell', HeaderShell);
