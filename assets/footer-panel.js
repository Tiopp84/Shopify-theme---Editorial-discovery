class FooterPanelController {
  constructor() {
    this.root = document.documentElement;
    this.panel = document.querySelector('[data-site-panel]');
    this.footer = document.querySelector('[data-footer-panel]');
    this.spacer = document.querySelector('.footer-panel-spacer');
    this.reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    this.desktopLayout = window.matchMedia('(min-width: 64rem)');
    this.frame = null;

    if (!this.panel || !this.footer || !this.spacer) return;

    this.onScroll = () => this.scheduleUpdate();
    this.onResize = () => this.scheduleUpdate();
    this.onMotionChange = () => this.refresh();
    this.onLayoutChange = () => this.refresh();
    this.onSectionChange = () => this.refresh();
    this.resizeObserver = window.ResizeObserver
      ? new ResizeObserver(() => this.scheduleUpdate())
      : null;
    window.addEventListener('scroll', this.onScroll, { passive: true });
    window.addEventListener('resize', this.onResize, { passive: true });
    this.reducedMotion.addEventListener('change', this.onMotionChange);
    this.desktopLayout.addEventListener('change', this.onLayoutChange);
    document.addEventListener('shopify:section:load', this.onSectionChange);
    document.addEventListener('shopify:section:unload', this.onSectionChange);
    this.refresh();
  }

  refresh() {
    if (this.reducedMotion.matches || !this.desktopLayout.matches) {
      this.clearState();
      return;
    }

    if (!this.footer?.isConnected) this.footer = document.querySelector('[data-footer-panel]');
    if (!this.footer) {
      this.clearState();
      return;
    }

    this.resizeObserver?.disconnect();
    this.resizeObserver?.observe(this.footer);
    this.root.classList.add('footer-panel-ready');
    this.scheduleUpdate();
  }

  clearState() {
    this.resizeObserver?.disconnect();
    if (this.frame) window.cancelAnimationFrame(this.frame);
    this.frame = null;
    this.root.classList.remove('footer-panel-ready');
    [
      '--footer-panel-edge-progress',
      '--footer-panel-footer-offset',
      '--footer-panel-footer-blur',
      '--footer-panel-footer-brightness',
      '--footer-panel-height',
    ].forEach((property) => this.root.style.removeProperty(property));
    this.panel?.removeAttribute('data-footer-panel-active');
  }

  scheduleUpdate() {
    if (this.frame) return;
    this.frame = window.requestAnimationFrame(() => {
      this.frame = null;
      this.update();
    });
  }

  update() {
    if (this.reducedMotion.matches || !this.desktopLayout.matches || !this.footer?.isConnected) return;
    const footerHeight = this.footer.offsetHeight;
    if (!footerHeight) return;

    const viewport = window.innerHeight || 1;
    const panelBottom = this.panel.offsetTop + this.panel.offsetHeight - window.scrollY;
    const progress = Math.min(1, Math.max(0, (viewport - panelBottom) / footerHeight));
    const edgeProgress = progress <= 0.5 ? progress * 2 : (1 - progress) * 2;
    const coveredProgress = 1 - progress;
    this.root.style.setProperty('--footer-panel-height', `${footerHeight}px`);
    this.root.style.setProperty('--footer-panel-edge-progress', edgeProgress.toFixed(3));
    this.root.style.setProperty('--footer-panel-footer-offset', `${(coveredProgress * 20).toFixed(2)}px`);
    this.root.style.setProperty('--footer-panel-footer-blur', `${(coveredProgress * 1.5).toFixed(2)}px`);
    this.root.style.setProperty('--footer-panel-footer-brightness', (1 - coveredProgress * 0.28).toFixed(3));
    this.panel.toggleAttribute('data-footer-panel-active', edgeProgress > 0.001);
  }
}

if (!window.footerPanelController) window.footerPanelController = new FooterPanelController();
