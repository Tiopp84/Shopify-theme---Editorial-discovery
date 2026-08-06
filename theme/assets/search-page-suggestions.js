if (!customElements.get('search-page-suggestions')) {
  class SearchPageSuggestions extends HTMLElement {
    connectedCallback() {
      if (this.initialized || !this.dataset.query || !this.dataset.endpoint) return;
      this.initialized = true;
      this.results = this.querySelector('[data-search-page-suggestions-results]');
      if (!this.results) return;
      this.load();
    }

    disconnectedCallback() {
      this.abortController?.abort();
      this.initialized = false;
    }

    async load() {
      this.abortController?.abort();
      this.abortController = new AbortController();

      try {
        const url = new URL(this.dataset.endpoint, window.location.origin);
        url.searchParams.set('q', this.dataset.query);
        url.searchParams.set('resources[type]', 'product');
        url.searchParams.set('resources[limit]', '4');
        url.searchParams.set('resources[limit_scope]', 'each');
        url.searchParams.set('section_id', 'search-page-suggestions');
        const response = await fetch(url, { signal: this.abortController.signal });
        if (!response.ok) throw new Error(`Search suggestions failed: ${response.status}`);

        const documentFragment = new DOMParser().parseFromString(await response.text(), 'text/html');
        const content = documentFragment.querySelector('[data-search-page-suggestions-content]');
        if (!content) return this.hide();

        const existingProductIds = new Set(
          [...document.querySelectorAll('.search-page__products [data-product-id]')].map((card) => card.dataset.productId)
        );
        content.querySelectorAll('[data-product-id]').forEach((card) => {
          if (existingProductIds.has(card.dataset.productId)) card.remove();
        });
        if (!content.querySelector('[data-product-id]')) return this.hide();

        this.installResponseStyles(documentFragment);
        this.results.replaceChildren(content);
        this.hidden = false;
      } catch (error) {
        if (error.name !== 'AbortError') this.hide();
      }
    }

    hide() {
      this.hidden = true;
      this.results?.replaceChildren();
    }

    installResponseStyles(documentFragment) {
      documentFragment.querySelectorAll('style').forEach((style, index) => {
        const selector = `[data-search-page-suggestions-style="${index}"]`;
        if (document.head.querySelector(selector)) return;
        const copy = style.cloneNode(true);
        copy.dataset.searchPageSuggestionsStyle = String(index);
        document.head.append(copy);
      });
    }
  }

  customElements.define('search-page-suggestions', SearchPageSuggestions);
}
