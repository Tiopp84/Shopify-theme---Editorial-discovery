class AnnouncementBarAnchor extends HTMLElement {
  connectedCallback() {
    if (this.initialized) return;
    this.initialized = true;
    this.updateOffset = this.updateOffset.bind(this);
    this.resizeObserver = new ResizeObserver(this.updateOffset);
    this.resizeObserver.observe(this);
    this.updateOffset();
  }

  disconnectedCallback() {
    this.resizeObserver?.disconnect();
    if (document.querySelector('announcement-bar-anchor') === this) {
      document.documentElement.style.removeProperty('--announcement-bar-height');
      document.documentElement.removeAttribute('data-announcement-bar-fixed');
    }
    this.initialized = false;
  }

  updateOffset() {
    document.documentElement.style.setProperty('--announcement-bar-height', `${Math.ceil(this.getBoundingClientRect().height)}px`);
    document.documentElement.setAttribute('data-announcement-bar-fixed', '');
  }
}

if (!customElements.get('announcement-bar-anchor')) {
  customElements.define('announcement-bar-anchor', AnnouncementBarAnchor);
}
