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
    this.hoverCloseTimer = null;
    this.scrollFrame = null;
    this.lastScrollY = window.scrollY;
    this.compactAnchorY = null;
    this.compactReleaseDistance = 120;
    this.compactReleaseDelay = 480;
    this.compactReleaseTimer = null;
    this.reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    this.addEventListener('click', this.onClick);
    document.addEventListener('click', this.onDocumentClick);
    document.addEventListener('keydown', this.onDocumentKeydown);
    this.querySelectorAll('[data-header-dialog]').forEach((dialog) => dialog.addEventListener('close', this.onClose));
    this.navGroups = [...this.querySelectorAll('.header-shell__nav-group')];
    this.mobileMenu = this.querySelector('[data-mobile-menu]');
    this.mobileMenu?.setAttribute('data-mobile-menu-enhanced', '');
    this.mobileMenu?.querySelectorAll('[data-mobile-menu-open]').forEach((trigger) => trigger.setAttribute('aria-expanded', 'false'));

    this.navGroups.forEach((group) => {
      group.addEventListener('pointerenter', this.onNavGroupPointerEnter);
      group.addEventListener('pointerleave', this.onNavGroupPointerLeave);
    });

    this.reducedMotionQuery.addEventListener('change', this.onMotionPreferenceChange);
    this.startMotion();
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
    window.clearTimeout(this.compactReleaseTimer);
    window.removeEventListener('scroll', this.onScroll);
    this.reducedMotionQuery?.removeEventListener('change', this.onMotionPreferenceChange);
    if (this.scrollFrame) window.cancelAnimationFrame(this.scrollFrame);
    this.scrollFrame = null;
    this.compactReleaseTimer = null;
    this.compactAnchorY = null;
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
    window.clearTimeout(this.compactReleaseTimer);
    this.compactReleaseTimer = null;
    this.classList.remove('header-shell--compact');
    this.lastScrollY = window.scrollY;
    this.compactAnchorY = null;
    this.startMotion();
  }

  onScroll() {
    if (this.scrollFrame) return;

    this.scrollFrame = window.requestAnimationFrame(() => {
      this.updateScrollState();
      this.scrollFrame = null;
    });
  }

  updateScrollState() {
    const scrollY = window.scrollY;
    const delta = scrollY - this.lastScrollY;
    const dialogOpen = this.querySelector('dialog[open]');
    const focusInside = this.contains(document.activeElement);

    this.classList.toggle('header-shell--scrolled', scrollY > 40);

    if (!this.classList.contains('header-shell--compact') && !dialogOpen && !focusInside && scrollY > 120 && delta > 4) {
      this.cancelCompactRelease();
      this.classList.add('header-shell--compact');
      this.compactAnchorY = scrollY;
    } else if (this.classList.contains('header-shell--compact') && delta > 0) {
      this.cancelCompactRelease();
      this.compactAnchorY = scrollY;
    }

    if (scrollY <= 40 || dialogOpen || focusInside) {
      this.cancelCompactRelease();
      this.classList.remove('header-shell--compact');
      this.compactAnchorY = null;
    } else if (this.classList.contains('header-shell--compact') && this.compactAnchorY !== null && scrollY <= this.compactAnchorY - this.compactReleaseDistance && delta < -4) {
      this.scheduleCompactRelease();
    } else if (delta >= 0) {
      this.cancelCompactRelease();
    }

    this.lastScrollY = scrollY;
  }

  scheduleCompactRelease() {
    if (this.compactReleaseTimer) return;
    this.compactReleaseTimer = window.setTimeout(() => {
      this.compactReleaseTimer = null;
      if (!this.classList.contains('header-shell--compact') || this.compactAnchorY === null) return;
      if (window.scrollY <= this.compactAnchorY - this.compactReleaseDistance) {
        this.classList.remove('header-shell--compact');
        this.compactAnchorY = null;
      }
    }, this.compactReleaseDelay);
  }

  cancelCompactRelease() {
    if (!this.compactReleaseTimer) return;
    window.clearTimeout(this.compactReleaseTimer);
    this.compactReleaseTimer = null;
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
