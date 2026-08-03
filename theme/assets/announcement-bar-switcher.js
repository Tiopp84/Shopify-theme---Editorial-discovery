class AnnouncementBarSwitcher extends HTMLElement {
  connectedCallback() {
    if (this.abortController || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    this.messages = [...this.querySelectorAll('[data-announcement-message]')];
    this.track = this.querySelector('[data-announcement-switcher-track]');
    if (this.messages.length < 2 || !this.track) return;

    this.abortController = new AbortController();
    this.activeMessage = this.messages[0];
    this.transitionDuration = Number.parseFloat(window.getComputedStyle(this).getPropertyValue('--announcement-swap-duration')) || 260;
    this.transitioning = false;
    this.rotationTimer = null;
    this.messages.forEach((message, index) => {
      message.hidden = false;
      this.setMessageAvailability(message, index === 0);
    });
    const { signal } = this.abortController;
    this.addEventListener('mouseenter', () => this.pause(), { signal });
    this.addEventListener('mouseleave', () => this.resume(), { signal });
    this.addEventListener('focusin', () => this.pause(), { signal });
    this.addEventListener('focusout', (event) => {
      if (!this.contains(event.relatedTarget)) this.resume();
    }, { signal });
    window.requestAnimationFrame(() => this.track.classList.add('is-ready'));
    this.resume();
  }

  disconnectedCallback() {
    this.abortController?.abort();
    this.abortController = null;
    window.clearInterval(this.rotationTimer);
  }

  pause() {
    window.clearInterval(this.rotationTimer);
    this.rotationTimer = null;
  }

  resume() {
    if (this.rotationTimer) return;
    this.rotationTimer = window.setInterval(() => this.showNext(), 3000);
  }

  showNext() {
    if (this.transitioning) return;

    let slides = [...this.track.querySelectorAll('[data-announcement-message]')];
    let currentIndex = slides.indexOf(this.activeMessage);
    if (currentIndex === slides.length - 1) {
      this.rotateTrackToCurrent();
      slides = [...this.track.querySelectorAll('[data-announcement-message]')];
      currentIndex = 0;
    }

    const current = this.activeMessage;
    const next = slides[currentIndex + 1];
    this.transitioning = true;
    this.setMessageAvailability(current, false);
    this.setMessageAvailability(next, true);
    this.track.style.transform = `translateX(-${(currentIndex + 1) * 100}%)`;
    this.activeMessage = next;
    window.setTimeout(() => {
      this.transitioning = false;
    }, this.transitionDuration);
  }

  rotateTrackToCurrent() {
    this.track.classList.add('is-resetting');
    while (this.track.firstElementChild !== this.activeMessage) {
      this.track.append(this.track.firstElementChild);
    }
    this.track.style.transform = 'translateX(0)';
    // Commit the reordered, visually identical active slide before animation resumes.
    this.track.getBoundingClientRect();
    this.track.classList.remove('is-resetting');
    this.track.getBoundingClientRect();
  }

  setMessageAvailability(message, isActive) {
    message.classList.toggle('is-active', isActive);
    message.toggleAttribute('aria-hidden', !isActive);
    message.inert = !isActive;
    message.querySelectorAll('a').forEach((link) => {
      if (isActive) link.removeAttribute('tabindex');
      else link.setAttribute('tabindex', '-1');
    });
  }
}

if (!customElements.get('announcement-bar-switcher')) {
  customElements.define('announcement-bar-switcher', AnnouncementBarSwitcher);
}

class AnnouncementBarMarquee extends HTMLElement {
  connectedCallback() {
    if (this.abortController || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    this.viewport = this;
    this.track = this.querySelector('.announcement-bar__marquee-track');
    this.sourceGroup = this.querySelector('[data-announcement-marquee-group]');
    if (!this.track || !this.sourceGroup) return;

    this.abortController = new AbortController();
    this.resizeObserver = new ResizeObserver(() => this.queueBuild());
    this.resizeObserver.observe(this.viewport);
    this.queueBuild();
  }

  disconnectedCallback() {
    this.abortController?.abort();
    this.abortController = null;
    this.resizeObserver?.disconnect();
    this.resizeObserver = null;
    window.cancelAnimationFrame(this.buildFrame);
  }

  queueBuild() {
    window.cancelAnimationFrame(this.buildFrame);
    this.buildFrame = window.requestAnimationFrame(() => this.build());
  }

  build() {
    this.track.classList.remove('is-ready');
    this.track.querySelectorAll('[data-announcement-marquee-copy]').forEach((copy) => copy.remove());

    const sourceWidth = this.sourceGroup.getBoundingClientRect().width;
    if (!sourceWidth || !this.viewport.clientWidth) return;

    while (this.track.scrollWidth < this.viewport.clientWidth + sourceWidth) {
      const copy = this.sourceGroup.cloneNode(true);
      copy.dataset.announcementMarqueeCopy = '';
      copy.setAttribute('aria-hidden', 'true');
      copy.inert = true;
      copy.querySelectorAll('a').forEach((link) => link.setAttribute('tabindex', '-1'));
      copy.querySelectorAll('[data-shopify-editor-block]').forEach((node) => node.removeAttribute('data-shopify-editor-block'));
      this.track.append(copy);
    }

    this.track.style.setProperty('--announcement-marquee-distance', `${sourceWidth}px`);
    this.track.classList.add('is-ready');
  }
}

if (!customElements.get('announcement-bar-marquee')) {
  customElements.define('announcement-bar-marquee', AnnouncementBarMarquee);
}
