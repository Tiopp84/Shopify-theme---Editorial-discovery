if (!customElements.get('predictive-search')) {
class PredictiveSearch extends HTMLElement {
  connectedCallback() {
    if (this.initialized) return;
    this.initialized = true;
    this.input = this.querySelector('input[type="search"]');
    this.results = this.querySelector('[data-predictive-results]');
    this.status = this.querySelector('[data-predictive-status]');
    if (!this.input || !this.results) return;

    this.requestSequence = 0;
    this.resultCache = new Map();
    this.onInput = this.onInput.bind(this);
    this.onFocus = this.onFocus.bind(this);
    this.onKeydown = this.onKeydown.bind(this);
    this.onFocusOut = this.onFocusOut.bind(this);
    this.input.addEventListener('input', this.onInput);
    this.input.addEventListener('focus', this.onFocus);
    this.addEventListener('keydown', this.onKeydown);
    this.addEventListener('focusout', this.onFocusOut);
  }

  disconnectedCallback() {
    this.abortController?.abort();
    clearTimeout(this.inputTimer);
    this.input?.removeEventListener('input', this.onInput);
    this.input?.removeEventListener('focus', this.onFocus);
    this.removeEventListener('keydown', this.onKeydown);
    this.removeEventListener('focusout', this.onFocusOut);
    this.initialized = false;
  }

  onInput() {
    clearTimeout(this.inputTimer);
    const term = this.input.value.trim();
    if (term.length < 1) {
      this.abortController?.abort();
      this.close();
      return;
    }
    const cachedResult = this.resultCache.get(term.toLocaleLowerCase());
    if (cachedResult) {
      this.renderResults(cachedResult, term);
      return;
    }

    this.showLoading(term);
    this.inputTimer = setTimeout(() => this.fetchResults(term), 80);
  }

  onFocus() {
    if (this.dataset.suppressFocusOpen === 'true') return;
    const term = this.input.value.trim();
    if (!term) return;
    const normalizedTerm = term.toLocaleLowerCase();

    if (this.renderedTerm === normalizedTerm && this.results.hasChildNodes()) {
      this.open();
      return;
    }

    const cachedResult = this.resultCache.get(normalizedTerm);
    if (cachedResult) {
      this.renderResults(cachedResult, term);
      return;
    }

    this.onInput();
  }

  async fetchResults(term) {
    const sequence = ++this.requestSequence;
    this.abortController?.abort();
    this.abortController = new AbortController();
    this.setLoading(true);

    try {
      const url = new URL(this.dataset.predictiveUrl, window.location.origin);
      url.searchParams.set('q', term);
      url.searchParams.set('resources[type]', this.dataset.predictiveTypes || 'product,collection,page,article');
      // Keep matching pages or articles from consuming the product suggestions.
      url.searchParams.set('resources[limit]', '4');
      url.searchParams.set('resources[limit_scope]', 'each');
      url.searchParams.set('section_id', 'predictive-search');
      const response = await fetch(url, { signal: this.abortController.signal });
      if (!response.ok) throw new Error(`Predictive search failed: ${response.status}`);
      const html = await response.text();
      if (sequence !== this.requestSequence || term !== this.input.value.trim()) return;
      const documentFragment = new DOMParser().parseFromString(html, 'text/html');
      const content = documentFragment.querySelector('[data-predictive-results-content]');
      if (!content) throw new Error('Predictive search content missing');
      this.resultCache.set(term.toLocaleLowerCase(), content.innerHTML);
      this.renderResults(content.innerHTML, term);
      this.announce(this.dataset.updatedText);
    } catch (error) {
      if (error.name === 'AbortError') return;
      this.close(false);
      this.announce(this.dataset.errorText);
    } finally {
      if (sequence === this.requestSequence) this.setLoading(false);
    }
  }

  onKeydown(event) {
    if (event.key === 'Escape' && !this.results.hidden) {
      event.preventDefault();
      this.close();
      this.input.focus();
      return;
    }
    if (event.key !== 'ArrowDown' || this.results.hidden) return;
    const firstResult = this.results.querySelector('a');
    if (firstResult) {
      event.preventDefault();
      firstResult.focus();
    }
  }

  onFocusOut() {
    requestAnimationFrame(() => {
      if (!this.contains(document.activeElement)) this.close(false);
    });
  }

  open() {
    this.results.hidden = false;
    this.input.setAttribute('aria-expanded', 'true');
  }

  showLoading(term) {
    if (this.results.hidden || !this.results.hasChildNodes()) {
      const message = document.createElement('p');
      message.className = 'predictive-search__loading';
      message.textContent = this.dataset.loadingText;
      this.results.replaceChildren(message);
    }
    this.renderedTerm = term.toLocaleLowerCase();
    this.open();
  }

  renderResults(html, term) {
    this.results.innerHTML = html;
    this.renderedTerm = term.toLocaleLowerCase();
    this.open();
  }

  close(clear = true) {
    this.results.hidden = true;
    this.input.setAttribute('aria-expanded', 'false');
    if (clear) {
      this.results.innerHTML = '';
      this.renderedTerm = '';
    }
  }

  setLoading(loading) {
    this.toggleAttribute('aria-busy', loading);
    if (loading) this.announce(this.dataset.loadingText);
  }

  announce(message) {
    if (!this.status || !message) return;
    this.status.textContent = '';
    requestAnimationFrame(() => {
      this.status.textContent = message;
    });
  }
}

customElements.define('predictive-search', PredictiveSearch);
}
