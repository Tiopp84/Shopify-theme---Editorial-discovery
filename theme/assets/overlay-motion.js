class OverlayMotionController {
  constructor() {
    this.reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    this.duration = 360;
    this.dialogs = new WeakSet();
    this.nativeClose = HTMLDialogElement.prototype.close;
    this.nativeShowModal = HTMLDialogElement.prototype.showModal;
    this.patchClose();
    this.patchShowModal();
    document.addEventListener('close', () => window.requestAnimationFrame(() => this.releaseScrollbarCompensation()), true);
    this.observe();
    this.hydrate(document);
  }

  patchClose() {
    const controller = this;
    if (HTMLDialogElement.prototype.close.__narrivelleOverlayMotion) return;

    HTMLDialogElement.prototype.close = function closeWithMotion(returnValue) {
      if (
        !this.matches?.('dialog[data-overlay-motion]')
        || controller.reducedMotion.matches
        || !this.open
        || this.dataset.overlayClosing === 'true'
      ) {
        return controller.nativeClose.call(this, returnValue);
      }

      this.dataset.overlayClosing = 'true';
      this.removeAttribute('data-overlay-visible');
      window.setTimeout(() => {
        if (this.open) controller.nativeClose.call(this, returnValue);
      }, controller.durationFor(this));
    };
    HTMLDialogElement.prototype.close.__narrivelleOverlayMotion = true;
  }

  patchShowModal() {
    const controller = this;
    if (HTMLDialogElement.prototype.showModal.__narrivelleScrollbarCompensation) return;

    HTMLDialogElement.prototype.showModal = function showModalWithScrollbarCompensation() {
      if (this.matches?.('dialog[scroll-lock]') && !controller.hasActiveScrollLock()) controller.captureScrollbarCompensation();
      return controller.nativeShowModal.call(this);
    };
    HTMLDialogElement.prototype.showModal.__narrivelleScrollbarCompensation = true;
  }

  hasActiveScrollLock() {
    return document.documentElement.matches('.quick-add-modal-open, .product-gallery-modal-open, .size-guide-modal-open')
      || Boolean(document.querySelector('dialog[scroll-lock][open], details[scroll-lock][open]'));
  }

  captureScrollbarCompensation() {
    const width = Math.max(0, window.innerWidth - document.documentElement.clientWidth);
    document.documentElement.style.setProperty('--scroll-lock-scrollbar-width', `${width}px`);
  }

  releaseScrollbarCompensation() {
    if (!this.hasActiveScrollLock()) document.documentElement.style.removeProperty('--scroll-lock-scrollbar-width');
  }

  durationFor(dialog) {
    const duration = Number.parseFloat(window.getComputedStyle(dialog).getPropertyValue('--overlay-motion-duration'));
    return Number.isFinite(duration) ? duration : this.duration;
  }

  observe() {
    this.observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'attributes') this.sync(mutation.target);
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === Node.ELEMENT_NODE) this.hydrate(node);
        });
      });
    });
    this.observer.observe(document.documentElement, { attributes: true, attributeFilter: ['open'], childList: true, subtree: true });
  }

  hydrate(scope) {
    if (scope.matches?.('dialog[data-overlay-motion]')) this.register(scope);
    scope.querySelectorAll?.('dialog[data-overlay-motion]').forEach((dialog) => this.register(dialog));
  }

  register(dialog) {
    if (this.dialogs.has(dialog)) return;
    this.dialogs.add(dialog);
    dialog.addEventListener('cancel', (event) => {
      if (this.reducedMotion.matches || dialog.dataset.overlayClosing === 'true') return;
      event.preventDefault();
      dialog.close();
    });
    dialog.addEventListener('close', () => {
      dialog.removeAttribute('data-overlay-visible');
      delete dialog.dataset.overlayClosing;
    });
    this.sync(dialog);
  }

  sync(dialog) {
    if (!dialog.matches?.('dialog[data-overlay-motion]')) return;
    if (!dialog.open) {
      dialog.removeAttribute('data-overlay-visible');
      delete dialog.dataset.overlayClosing;
      return;
    }
    if (this.reducedMotion.matches) {
      dialog.setAttribute('data-overlay-visible', '');
      return;
    }
    window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() => {
        if (dialog.open && dialog.dataset.overlayClosing !== 'true') dialog.setAttribute('data-overlay-visible', '');
      });
    });
  }
}

if (!window.overlayMotionController) window.overlayMotionController = new OverlayMotionController();
