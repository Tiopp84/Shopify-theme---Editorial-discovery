class CollectionDiscovery extends HTMLElement {
  connectedCallback() {
    this.requestSequence = 0;
    this.addEventListener('click', this.handleClick);
    this.addEventListener('change', this.handleChange);
    this.addEventListener('submit', this.handleSubmit);
    this.addEventListener('close', this.handleDialogClose, true);
    window.addEventListener('popstate', this.handlePopState);
  }

  disconnectedCallback() {
    this.abortController?.abort();
    this.removeEventListener('click', this.handleClick);
    this.removeEventListener('change', this.handleChange);
    this.removeEventListener('submit', this.handleSubmit);
    this.removeEventListener('close', this.handleDialogClose, true);
    window.removeEventListener('popstate', this.handlePopState);
  }

  handleClick = (event) => {
    const openButton = event.target.closest('[data-facets-open]');
    if (openButton) {
      const panel = openButton.closest('[data-facets-panel]');
      const dialog = panel?.querySelector('dialog');
      if (!dialog) return;

      this.drawerOpener = openButton;
      dialog.showModal();
      return;
    }

    const closeButton = event.target.closest('[data-facets-close]');
    if (closeButton) {
      closeButton.closest('dialog')?.close();
      return;
    }

    if (event.target.matches('dialog[open]')) {
      event.target.close();
      return;
    }

    const navigationLink = event.target.closest('.active-facets a, .pagination a');
    if (!navigationLink || event.defaultPrevented || event.button !== 0) return;
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

    event.preventDefault();
    this.updateCollection(new URL(navigationLink.href), {
      pushHistory: true,
      focusSelector: navigationLink.classList.contains('pagination__link') ? '.collection-controls' : '',
    });
  };

  handleChange = (event) => {
    const control = event.target;
    if (!control.matches('[data-sort-by], input[type="checkbox"], input[type="radio"]')) return;

    const form = control.form;
    if (!form?.matches('.facets')) return;

    this.updateCollection(this.buildUrlFromForm(form), {
      pushHistory: true,
      interactionState: this.captureInteractionState(control),
    });
  };

  handleSubmit = (event) => {
    const form = event.target;
    if (!form.matches('.facets')) return;

    event.preventDefault();
    this.updateCollection(this.buildUrlFromForm(form), {
      pushHistory: true,
      interactionState: this.captureInteractionState(document.activeElement),
    });
  };

  handleDialogClose = (event) => {
    if (!event.target.matches('dialog')) return;
    this.drawerOpener?.focus();
    this.drawerOpener = null;
  };

  handlePopState = () => {
    this.updateCollection(new URL(window.location.href), {
      pushHistory: false,
      interactionState: this.captureInteractionState(document.activeElement),
    });
  };

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
      openGroups: dialog
        ? Array.from(dialog.querySelectorAll('.facets__group[open]')).map(
            (group) => group.querySelector('summary span')?.textContent.trim() || '',
          )
        : [],
      formId: form?.id || '',
      controlName: control?.name || '',
      controlValue: control?.value || '',
    };
  }

  async updateCollection(url, options = {}) {
    const { pushHistory = true, interactionState = null, focusSelector = '' } = options;
    const sequence = ++this.requestSequence;

    this.abortController?.abort();
    this.abortController = new AbortController();
    this.setLoading(true);

    try {
      const requestUrl = new URL(url);
      requestUrl.searchParams.set('section_id', this.dataset.sectionId);

      const response = await fetch(requestUrl, {
        headers: { 'X-Requested-With': 'XMLHttpRequest' },
        signal: this.abortController.signal,
      });

      if (!response.ok) throw new Error(`Collection update failed: ${response.status}`);

      const html = await response.text();
      if (sequence !== this.requestSequence) return;

      const documentFragment = new DOMParser().parseFromString(html, 'text/html');
      const nextCollection = Array.from(documentFragment.querySelectorAll('collection-discovery')).find(
        (element) => element.dataset.sectionId === this.dataset.sectionId,
      );

      if (!nextCollection) throw new Error('Collection section missing from response');

      this.innerHTML = nextCollection.innerHTML;

      if (pushHistory) history.pushState({}, '', url);

      this.restoreInteractionState(interactionState, focusSelector);
      this.announceUpdate();
    } catch (error) {
      if (error.name === 'AbortError') return;
      this.announceError();
    } finally {
      if (sequence === this.requestSequence) this.setLoading(false);
    }
  }

  restoreInteractionState(state, focusSelector) {
    if (state?.dialogFormId) {
      const form = this.querySelector(`#${CSS.escape(state.dialogFormId)}`);
      const dialog = form?.closest('dialog');

      if (dialog) {
        dialog.querySelectorAll('.facets__group').forEach((group) => {
          const label = group.querySelector('summary span')?.textContent.trim() || '';
          group.open = state.openGroups.includes(label);
        });

        this.drawerOpener = dialog.closest('[data-facets-panel]')?.querySelector('[data-facets-open]');
        dialog.showModal();
      }
    }

    const matchingForm = state?.formId ? this.querySelector(`#${CSS.escape(state.formId)}`) : null;
    const matchingControl = matchingForm
      ? Array.from(matchingForm.elements).find(
          (control) => control.name === state.controlName && control.value === state.controlValue,
        )
      : null;

    requestAnimationFrame(() => {
      if (matchingControl) matchingControl.focus();
      else if (focusSelector) this.querySelector(focusSelector)?.focus({ preventScroll: true });
    });
  }

  setLoading(isLoading) {
    this.toggleAttribute('aria-busy', isLoading);
    const status = this.querySelector('[data-collection-status]');
    if (status && isLoading) status.textContent = this.dataset.loadingText;
  }

  announceUpdate() {
    const status = this.querySelector('[data-collection-status]');
    const count = this.querySelector('.collection-controls__count')?.textContent.trim();
    if (status) status.textContent = `${this.dataset.updatedText} ${count || ''}`.trim();
  }

  announceError() {
    const status = this.querySelector('[data-collection-status]');
    if (status) status.textContent = this.dataset.errorText;
  }
}

if (!customElements.get('collection-discovery')) {
  customElements.define('collection-discovery', CollectionDiscovery);
}
