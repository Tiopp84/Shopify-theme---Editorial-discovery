class HeaderShell extends HTMLElement {
  connectedCallback() {
    if (this.initialized) return;
    this.initialized = true;
    this.onClick = this.onClick.bind(this);
    this.onClose = this.onClose.bind(this);
    this.addEventListener('click', this.onClick);
    this.querySelectorAll('[data-header-dialog]').forEach((dialog) => dialog.addEventListener('close', this.onClose));
  }

  disconnectedCallback() {
    this.removeEventListener('click', this.onClick);
    this.querySelectorAll('[data-header-dialog]').forEach((dialog) => dialog.removeEventListener('close', this.onClose));
    this.initialized = false;
  }

  onClick(event) {
    const openButton = event.target.closest('[data-dialog-open]');
    if (openButton) {
      const dialog = this.querySelector(`[data-header-dialog="${CSS.escape(openButton.dataset.dialogOpen)}"]`);
      if (!dialog) return;
      this.activeOpener = openButton;
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

  onClose() {
    this.activeOpener?.focus();
    this.activeOpener = null;
  }
}

if (!customElements.get('header-shell')) customElements.define('header-shell', HeaderShell);
