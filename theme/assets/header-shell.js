class HeaderShell extends HTMLElement {
  connectedCallback() {
    this.dialog = this.querySelector('dialog');
    this.openButton = this.querySelector('[data-drawer-open]');
    this.closeButton = this.querySelector('[data-drawer-close]');

    if (!this.dialog || !this.openButton || !this.closeButton) return;

    this.openButton.addEventListener('click', this.openDrawer);
    this.closeButton.addEventListener('click', this.closeDrawer);
    this.dialog.addEventListener('close', this.restoreFocus);
    this.dialog.addEventListener('click', this.closeFromBackdrop);
  }

  disconnectedCallback() {
    if (!this.dialog || !this.openButton || !this.closeButton) return;

    this.openButton.removeEventListener('click', this.openDrawer);
    this.closeButton.removeEventListener('click', this.closeDrawer);
    this.dialog.removeEventListener('close', this.restoreFocus);
    this.dialog.removeEventListener('click', this.closeFromBackdrop);
  }

  openDrawer = () => {
    this.dialog.showModal();
  };

  closeDrawer = () => {
    this.dialog.close();
  };

  restoreFocus = () => {
    this.openButton.focus();
  };

  closeFromBackdrop = (event) => {
    if (event.target === this.dialog) this.dialog.close();
  };
}

if (!customElements.get('header-shell')) {
  customElements.define('header-shell', HeaderShell);
}
