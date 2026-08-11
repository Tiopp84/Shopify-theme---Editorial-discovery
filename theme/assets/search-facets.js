class SearchDiscovery extends HTMLElement {
  connectedCallback() {
    this.requestSequence = 0;
    this.enhanceForms();
    this.addEventListener('click', this.handleClick);
    this.addEventListener('change', this.handleChange);
    this.addEventListener('submit', this.handleSubmit);
    this.addEventListener('close', this.handleDialogClose, true);
    this.addEventListener('keydown', this.handleSortMenuKeydown);
    document.addEventListener('pointerdown', this.handleDocumentPointerDown);
    window.addEventListener('popstate', this.handlePopState);
  }

  disconnectedCallback() {
    this.abortController?.abort();
    this.removeEventListener('click', this.handleClick);
    this.removeEventListener('change', this.handleChange);
    this.removeEventListener('submit', this.handleSubmit);
    this.removeEventListener('close', this.handleDialogClose, true);
    this.removeEventListener('keydown', this.handleSortMenuKeydown);
    document.removeEventListener('pointerdown', this.handleDocumentPointerDown);
    window.removeEventListener('popstate', this.handlePopState);
  }

  handleClick = (event) => {
    const openButton = event.target.closest('[data-search-facets-open]');
    if (openButton) {
      const dialog = openButton.closest('[data-search-facets-panel]')?.querySelector('dialog');
      if (!dialog) return;
      this.drawerOpener = openButton;
      dialog.showModal();
      return;
    }

    if (event.target.closest('[data-search-facets-close]')) {
      event.target.closest('dialog')?.close();
      return;
    }

    if (event.target.matches('dialog[open]')) {
      event.target.close();
      return;
    }

    const navigationLink = event.target.closest('.search-page__active-facets a, .pagination a');
    if (!navigationLink || event.defaultPrevented || event.button !== 0) return;
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

    event.preventDefault();
    this.updateSearch(new URL(navigationLink.href), {
      focusSelector: navigationLink.classList.contains('pagination__link') ? '[data-search-controls]' : '',
    });
  };

  handleChange = (event) => {
    const control = event.target;
    if (!control.matches('[data-sort-by], input[type="checkbox"], input[type="radio"], input[type="number"]')) return;
    if (!control.form?.matches('.facets')) return;
    control.closest('.facets__sort-menu--popover')?.removeAttribute('open');
    this.updateSearch(this.buildUrlFromForm(control.form), { interactionState: this.captureInteractionState(control) });
  };

  handleSubmit = (event) => {
    const form = event.target;
    if (!form.matches('.facets')) return;
    event.preventDefault();
    this.updateSearch(this.buildUrlFromForm(form), { interactionState: this.captureInteractionState(document.activeElement) });
  };

  handleDialogClose = (event) => {
    if (!event.target.matches('dialog[data-search-facet-dialog]')) return;
    this.drawerOpener?.focus();
    this.drawerOpener = null;
  };

  handleDocumentPointerDown = (event) => {
    const openMenu = this.querySelector('.facets__sort-menu--popover[open]');
    if (openMenu && !openMenu.contains(event.target)) openMenu.open = false;
  };

  handleSortMenuKeydown = (event) => {
    const menu = event.target.closest('.facets__sort-menu--popover');
    if (!menu) return;
    const summary = menu.querySelector('summary');
    const options = Array.from(menu.querySelectorAll('input[type="radio"]'));
    const current = event.target.closest('input[type="radio"]');

    if (event.key === 'Escape' && menu.open) {
      event.preventDefault();
      menu.open = false;
      summary?.focus();
      return;
    }
    if (event.target === summary && ['ArrowDown', 'ArrowUp'].includes(event.key)) {
      event.preventDefault();
      menu.open = true;
      (event.key === 'ArrowUp' ? options.at(-1) : menu.querySelector('input:checked') || options[0])?.focus();
      return;
    }
    if (current && event.key === 'Enter') {
      event.preventDefault();
      current.click();
      return;
    }
    if (!current || !['ArrowDown', 'ArrowUp', 'Home', 'End'].includes(event.key)) return;
    event.preventDefault();
    const index = options.indexOf(current);
    const nextIndex = { ArrowDown: (index + 1) % options.length, ArrowUp: (index - 1 + options.length) % options.length, Home: 0, End: options.length - 1 }[event.key];
    options[nextIndex]?.focus();
  };

  handlePopState = () => this.updateSearch(new URL(window.location.href), { pushHistory: false });

  buildUrlFromForm(form) {
    const url = new URL(form.action, window.location.origin);
    const parameters = new URLSearchParams();
    new FormData(form).forEach((value, key) => {
      if (typeof value === 'string' && value !== '') parameters.append(key, value);
    });
    url.search = parameters.toString();
    return url;
  }

  captureInteractionState(control) {
    const dialog = control?.closest?.('dialog[open]');
    const form = control?.form;
    return {
      dialogFormId: dialog?.querySelector('form')?.id || '',
      openGroups: dialog ? Array.from(dialog.querySelectorAll('.facets__group[open]')).map((group) => group.querySelector('summary span')?.textContent.trim() || '') : [],
      formId: form?.id || '',
      controlName: control?.name || '',
      controlValue: control?.value || '',
    };
  }

  async updateSearch(url, options = {}) {
    const { pushHistory = true, interactionState = null, focusSelector = '' } = options;
    const sequence = ++this.requestSequence;
    this.abortController?.abort();
    this.abortController = new AbortController();
    this.setLoading(true);

    try {
      const requestUrl = new URL(url);
      requestUrl.searchParams.set('section_id', this.dataset.sectionId);
      const response = await fetch(requestUrl, { headers: { 'X-Requested-With': 'XMLHttpRequest' }, signal: this.abortController.signal });
      if (!response.ok) throw new Error(`Search update failed: ${response.status}`);
      const html = await response.text();
      if (sequence !== this.requestSequence) return;
      const nextSearch = Array.from(new DOMParser().parseFromString(html, 'text/html').querySelectorAll('search-discovery')).find((element) => element.dataset.sectionId === this.dataset.sectionId);
      if (!nextSearch) throw new Error('Search section missing from response');
      this.patchSearch(nextSearch);
      if (pushHistory) history.pushState({}, '', url);
      this.restoreInteractionState(interactionState, focusSelector);
      this.announceUpdate();
    } catch (error) {
      if (error.name !== 'AbortError') this.announceError();
    } finally {
      if (sequence === this.requestSequence) this.setLoading(false);
    }
  }

  patchSearch(nextSearch) {
    const response = this.querySelector('[data-search-response]');
    const nextResponse = nextSearch.querySelector('[data-search-response]');
    if (!response || !nextResponse) throw new Error('Search response boundary missing');
    const controls = response.querySelector('[data-search-controls]');
    const nextControls = nextResponse.querySelector('[data-search-controls]');

    if (!controls || !nextControls) {
      const replacement = nextResponse.cloneNode(true);
      replacement.querySelectorAll('noscript').forEach((node) => node.remove());
      response.replaceWith(replacement);
      this.enhanceForms();
      return;
    }

    this.patchContent('[data-search-count]', nextResponse);
    this.patchContent('[data-search-active-facets]', nextResponse);
    this.querySelectorAll('dialog[data-search-facet-dialog]').forEach((dialog) => {
      const nextDialog = nextResponse.querySelector(`dialog[data-search-facet-dialog="${CSS.escape(dialog.dataset.searchFacetDialog)}"]`);
      const header = dialog.querySelector('.search-facets-dialog__header');
      const nextHeader = nextDialog?.querySelector('.search-facets-dialog__header');
      if (header && nextHeader) header.innerHTML = nextHeader.innerHTML;
    });
    this.querySelectorAll('.facets').forEach((form) => {
      const nextForm = nextResponse.querySelector(`#${CSS.escape(form.id)}`);
      if (!nextForm) return;
      form.action = nextForm.action;
      form.innerHTML = nextForm.innerHTML;
    });
    const results = this.querySelector('[data-search-results]');
    const nextResults = nextResponse.querySelector('[data-search-results]');
    if (results && nextResults) {
      const replacement = nextResults.cloneNode(true);
      replacement.querySelectorAll('noscript').forEach((node) => node.remove());
      results.replaceWith(replacement);
    }
    this.enhanceForms();
  }

  enhanceForms() {
    this.querySelectorAll('.facets').forEach((form) => form.classList.add('facets--auto-apply'));
  }

  patchContent(selector, nextResponse) {
    const current = this.querySelector(selector);
    const next = nextResponse.querySelector(selector);
    if (current && next) current.innerHTML = next.innerHTML;
  }

  restoreInteractionState(state, focusSelector) {
    if (state?.dialogFormId) {
      const form = this.querySelector(`#${CSS.escape(state.dialogFormId)}`);
      const dialog = form?.closest('dialog');
      if (dialog) {
        this.drawerOpener = dialog.closest('[data-search-facets-panel]')?.querySelector('[data-search-facets-open]');
        dialog.showModal();
      }
      dialog?.querySelectorAll('.facets__group').forEach((group) => {
        group.open = state.openGroups.includes(group.querySelector('summary span')?.textContent.trim() || '');
      });
    }
    const form = state?.formId ? this.querySelector(`#${CSS.escape(state.formId)}`) : null;
    const control = form ? Array.from(form.elements).find((element) => element.name === state.controlName && element.value === state.controlValue) : null;
    requestAnimationFrame(() => (control || (focusSelector && this.querySelector(focusSelector)))?.focus({ preventScroll: true }));
  }

  setLoading(isLoading) {
    this.toggleAttribute('aria-busy', isLoading);
    const status = this.querySelector('[data-search-status]');
    if (status && isLoading) status.textContent = this.dataset.loadingText;
  }

  announceUpdate() {
    const status = this.querySelector('[data-search-status]');
    const count = this.querySelector('[data-search-count]')?.textContent.trim();
    if (status) status.textContent = `${this.dataset.updatedText} ${count || ''}`.trim();
  }

  announceError() {
    const status = this.querySelector('[data-search-status]');
    if (status) status.textContent = this.dataset.errorText;
  }
}

if (!customElements.get('search-discovery')) customElements.define('search-discovery', SearchDiscovery);
