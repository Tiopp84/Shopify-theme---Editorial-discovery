class OverlayMotionController {
  constructor() {
    this.reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    this.duration = 360;
    this.dialogs = new WeakSet();
    this.nativeClose = HTMLDialogElement.prototype.close;
    this.patchClose();
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
      }, controller.duration);
    };
    HTMLDialogElement.prototype.close.__narrivelleOverlayMotion = true;
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
