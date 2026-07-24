if (!customElements.get('product-recommendations')) {
  class ProductRecommendations extends HTMLElement {
    connectedCallback() {
      if (this.initialized) return;
      this.initialized = true;
      this.results = this.querySelector('[data-product-recommendations-results]');
      this.status = this.querySelector('[data-product-recommendations-status]');
      if (!this.results || !this.dataset.endpoint || !this.dataset.productId) return;
      this.requestSequence = 0;
      this.load();
    }

    disconnectedCallback() {
      this.abortController?.abort();
      this.initialized = false;
    }

    async load() {
      const sequence = ++this.requestSequence;
      this.abortController?.abort();
      this.abortController = new AbortController();
      this.toggleAttribute('aria-busy', true);
      this.announce(this.dataset.loadingText);

      try {
        const url = new URL(this.dataset.endpoint, window.location.origin);
        url.searchParams.set('product_id', this.dataset.productId);
        url.searchParams.set('limit', this.dataset.limit || '4');
        url.searchParams.set('intent', this.dataset.intent || 'related');
        url.searchParams.set('section_id', 'product-recommendations');
        const response = await fetch(url, { signal: this.abortController.signal });
        if (!response.ok) throw new Error(`Recommendations failed: ${response.status}`);
        const documentFragment = new DOMParser().parseFromString(await response.text(), 'text/html');
        const content = documentFragment.querySelector('[data-product-recommendations-content]');
        if (sequence !== this.requestSequence) return;
        if (!content) return this.hide();
        this.installResponseStyles(documentFragment);
        this.results.replaceChildren(content);
        this.hidden = false;
        this.announce('');
      } catch (error) {
        if (error.name === 'AbortError') return;
        if (sequence === this.requestSequence) {
          this.hide();
          this.announce(this.dataset.errorText);
        }
      } finally {
        if (sequence === this.requestSequence) this.toggleAttribute('aria-busy', false);
      }
    }

    hide() {
      this.hidden = true;
      this.results.replaceChildren();
    }

    installResponseStyles(documentFragment) {
      documentFragment.querySelectorAll('style').forEach((style, index) => {
        const selector = `[data-product-recommendations-style="${index}"]`;
        if (document.head.querySelector(selector)) return;
        const copy = style.cloneNode(true);
        copy.dataset.productRecommendationsStyle = String(index);
        document.head.append(copy);
      });
    }

    announce(message) {
      if (!this.status) return;
      this.status.textContent = '';
      if (message) requestAnimationFrame(() => { this.status.textContent = message; });
    }
  }

  customElements.define('product-recommendations', ProductRecommendations);
}
