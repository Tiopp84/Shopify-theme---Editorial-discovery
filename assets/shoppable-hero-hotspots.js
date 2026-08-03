class ShoppableHeroHotspots extends HTMLElement {
  connectedCallback() {
    if (this.abortController) return;

    this.abortController = new AbortController();
    this.hoverTimers = new Map();
    this.hotspots = [...this.querySelectorAll('.shoppable-hero__hotspot')];
    const { signal } = this.abortController;

    this.hotspots.forEach((hotspot) => {
      hotspot.addEventListener('pointerenter', (event) => this.openFromHover(event, hotspot), { signal });
      hotspot.addEventListener('pointerleave', () => this.queueHoverClose(hotspot), { signal });
      hotspot.addEventListener('toggle', () => this.handleToggle(hotspot), { signal });
    });

    document.addEventListener('pointerdown', (event) => this.closeFromOutside(event), { capture: true, signal });
    window.addEventListener('resize', () => this.fitOpenPreviews(), { passive: true, signal });
  }

  disconnectedCallback() {
    this.abortController?.abort();
    this.abortController = null;
    this.hoverTimers?.forEach((timer) => window.clearTimeout(timer));
    this.hoverTimers?.clear();
  }

  openFromHover(event, hotspot) {
    if (event.pointerType !== 'mouse') return;

    this.clearHoverClose(hotspot);
    if (hotspot.open) return;

    hotspot.dataset.openedByHover = 'true';
    hotspot.open = true;
    this.closeOthers(hotspot);
    this.fitPreviewToViewport(hotspot);
  }

  queueHoverClose(hotspot) {
    if (hotspot.dataset.openedByHover !== 'true') return;

    this.clearHoverClose(hotspot);
    const timer = window.setTimeout(() => {
      this.hoverTimers.delete(hotspot);
      if (hotspot.matches(':hover')) return;
      hotspot.open = false;
      delete hotspot.dataset.openedByHover;
      this.resetPreviewFit(hotspot);
    }, 180);
    this.hoverTimers.set(hotspot, timer);
  }

  clearHoverClose(hotspot) {
    const timer = this.hoverTimers.get(hotspot);
    if (timer) window.clearTimeout(timer);
    this.hoverTimers.delete(hotspot);
  }

  handleToggle(hotspot) {
    if (hotspot.open) {
      this.closeOthers(hotspot);
      this.fitPreviewToViewport(hotspot);
      return;
    }
    delete hotspot.dataset.openedByHover;
    this.resetPreviewFit(hotspot);
  }

  closeOthers(activeHotspot) {
    this.hotspots.forEach((hotspot) => {
      if (hotspot === activeHotspot) return;
      this.clearHoverClose(hotspot);
      hotspot.open = false;
      delete hotspot.dataset.openedByHover;
      this.resetPreviewFit(hotspot);
    });
  }

  closeFromOutside(event) {
    if (this.contains(event.target)) return;

    this.hotspots.forEach((hotspot) => {
      this.clearHoverClose(hotspot);
      hotspot.open = false;
      delete hotspot.dataset.openedByHover;
      this.resetPreviewFit(hotspot);
    });

    if (this.contains(document.activeElement)) document.activeElement.blur();
  }

  fitOpenPreviews() {
    this.hotspots.filter((hotspot) => hotspot.open).forEach((hotspot) => this.fitPreviewToViewport(hotspot));
  }

  fitPreviewToViewport(hotspot) {
    const preview = hotspot.querySelector('.shoppable-hero__product-preview');
    if (!preview) return;

    this.resetPreviewFit(hotspot);
    window.requestAnimationFrame(() => {
      if (!hotspot.open) return;

      const inset = 12;
      const rect = preview.getBoundingClientRect();
      const shiftX = rect.left < inset ? inset - rect.left : Math.min(0, window.innerWidth - inset - rect.right);
      const shiftY = rect.top < inset ? inset - rect.top : Math.min(0, window.innerHeight - inset - rect.bottom);
      preview.style.setProperty('--shoppable-hero-preview-shift-x', `${shiftX}px`);
      preview.style.setProperty('--shoppable-hero-preview-shift-y', `${shiftY}px`);
    });
  }

  resetPreviewFit(hotspot) {
    const preview = hotspot.querySelector('.shoppable-hero__product-preview');
    preview?.style.removeProperty('--shoppable-hero-preview-shift-x');
    preview?.style.removeProperty('--shoppable-hero-preview-shift-y');
  }
}

if (!customElements.get('shoppable-hero-hotspots')) {
  customElements.define('shoppable-hero-hotspots', ShoppableHeroHotspots);
}
