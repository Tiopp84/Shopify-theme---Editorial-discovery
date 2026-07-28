class QuickAdd extends HTMLElement {
  connectedCallback() {
    if (this.abortController) return;
    if (this.hasAttribute('data-quick-add-direct')) return this.connectDirect();
    this.dialog = this.querySelector('[data-quick-add-dialog]');
    this.form = this.querySelector('[data-quick-add-form]');
    this.options = [...this.querySelectorAll('[data-quick-add-option]')];
    this.optionButtons = [...this.querySelectorAll('[data-quick-add-option-button]')];
    this.variantInput = this.querySelector('[data-quick-add-variant-id]');
    this.quantity = this.querySelector('[data-quick-add-quantity]');
    this.submit = this.querySelector('[data-quick-add-submit]');
    this.error = this.querySelector('[data-quick-add-error]');
    this.quantityNote = this.querySelector('[data-quick-add-quantity-note]');
    this.priceCurrent = this.querySelector('[data-quick-add-price-current]');
    this.priceCompare = this.querySelector('[data-quick-add-price-compare]');
    this.unitPrice = this.querySelector('[data-quick-add-unit-price]');
    this.sku = this.querySelector('[data-quick-add-sku]');
    this.skuValue = this.querySelector('[data-quick-add-sku-value]');
    this.availability = this.querySelector('[data-quick-add-availability]');
    this.media = [...this.querySelectorAll('[data-quick-add-media-id]')];
    this.mediaButtons = [...this.querySelectorAll('[data-quick-add-media-select]')];
    this.variants = JSON.parse(this.querySelector('[data-quick-add-variants]')?.textContent || '[]');
    if (!this.dialog || !this.form || !this.variantInput || !this.quantity || !this.submit || !this.variants.length) return;

    this.abortController = new AbortController();
    const { signal } = this.abortController;
    this.querySelector('[data-quick-add-open]')?.addEventListener('click', () => this.open(), { signal });
    this.querySelector('[data-quick-add-close]')?.addEventListener('click', () => this.dialog.close(), { signal });
    this.dialog.addEventListener('click', (event) => { if (event.target === this.dialog) this.dialog.close(); }, { signal });
    this.dialog.addEventListener('close', () => {
      this.unlockPageScroll();
      this.opener?.focus({ preventScroll: true });
    }, { signal });
    this.options.forEach((option) => option.addEventListener('change', () => this.fromControls(), { signal }));
    this.optionButtons.forEach((button) => button.addEventListener('click', () => {
      const option = this.options[Number(button.dataset.quickAddOptionIndex)];
      if (!option) return;
      option.value = button.dataset.quickAddOptionValue;
      this.fromControls();
    }, { signal }));
    this.querySelector('[data-quick-add-quantity-decrease]')?.addEventListener('click', () => this.changeQuantity(-1), { signal });
    this.querySelector('[data-quick-add-quantity-increase]')?.addEventListener('click', () => this.changeQuantity(1), { signal });
    this.mediaButtons.forEach((button) => button.addEventListener('click', () => this.selectMedia(button.dataset.quickAddMediaSelect), { signal }));
    this.quantity.addEventListener('change', () => this.clampQuantity(), { signal });
    window.addEventListener('cart:state', (event) => this.applyCartState(event.detail?.quantities), { signal });
    this.fromControls();
    this.setAttribute('data-quick-add-enhanced', '');
  }

  connectDirect() {
    this.form = this.querySelector('form');
    this.quantity = this.querySelector('[data-quick-add-quantity]');
    this.error = this.querySelector('[data-quick-add-error]');
    this.submit = this.form?.querySelector('[type="submit"]');
    this.currentVariant = { id: this.dataset.variantId, available: true };
    if (!this.form || !this.quantity || !this.error || !this.submit || !this.currentVariant.id) return;
    this.abortController = new AbortController();
    window.addEventListener('cart:state', (event) => this.applyCartState(event.detail?.quantities), { signal: this.abortController.signal });
  }

  disconnectedCallback() {
    this.abortController?.abort();
    this.inventoryController?.abort();
    this.unlockPageScroll();
    this.abortController = null;
  }

  open() {
    if (typeof this.dialog.showModal !== 'function') {
      this.querySelector('[data-quick-add-open]')?.closest('article')?.querySelector('.product-card__title a')?.click();
      return;
    }
    this.opener = document.activeElement;
    this.clearError();
    if (!this.dialog.open) {
      this.lockPageScroll();
      this.dialog.showModal();
    }
    (this.options[0] || this.querySelector('[data-quick-add-close]'))?.focus({ preventScroll: true });
  }

  fromControls() {
    const choices = this.options.map((option) => option.value);
    const variant = this.variants.find((item) => item.options.every((value, index) => value === choices[index]));
    this.syncOptions();
    if (!variant) return this.unavailable();
    this.commit(variant);
  }

  syncOptions() {
    this.options.forEach((option, index) => {
      [...option.options].forEach((choice) => {
        choice.disabled = !this.variants.some((variant) => variant.available && variant.options.every((value, optionIndex) => optionIndex === index ? value === choice.value : value === this.options[optionIndex]?.value));
      });
    });
    this.optionButtons.forEach((button) => {
      const index = Number(button.dataset.quickAddOptionIndex);
      const option = this.options[index];
      const selected = option?.value === button.dataset.quickAddOptionValue;
      button.setAttribute('aria-pressed', String(selected));
      button.disabled = !this.variants.some((variant) => variant.available && variant.options.every((value, optionIndex) => optionIndex === index ? value === button.dataset.quickAddOptionValue : value === this.options[optionIndex]?.value));
    });
    this.querySelectorAll('[data-quick-add-option-selected]').forEach((label) => {
      const option = this.options[Number(label.dataset.quickAddOptionSelected)];
      if (option) label.textContent = option.value;
    });
  }

  unavailable() {
    this.currentVariant = null;
    this.submit.disabled = true;
    this.showError(this.dataset.unavailable);
    this.quantity.disabled = true;
    this.querySelectorAll('[data-quick-add-quantity-decrease], [data-quick-add-quantity-increase]').forEach((button) => { button.disabled = true; });
  }

  commit(variant) {
    this.inventoryController?.abort();
    this.currentVariant = variant;
    this.variantInput.value = variant.id;
    this.clearError();
    this.submit.disabled = !variant.available;
    this.submit.textContent = variant.available ? this.dataset.addToCart : this.dataset.soldOut;
    this.quantity.disabled = !variant.available;
    this.quantityNote.hidden = !variant.hasQuantityPriceBreaks;
    if (this.priceCurrent) this.priceCurrent.textContent = variant.price || '';
    if (this.priceCompare) {
      this.priceCompare.textContent = variant.comparePrice || '';
      this.priceCompare.hidden = !variant.onSale;
    }
    if (this.unitPrice) {
      this.unitPrice.textContent = variant.unitPrice || '';
      this.unitPrice.hidden = !variant.unitPrice;
    }
    if (this.sku && this.skuValue) {
      this.skuValue.textContent = variant.sku || '';
      this.sku.hidden = !variant.sku;
    }
    if (this.availability) {
      this.availability.textContent = variant.available ? this.dataset.available : this.dataset.soldOut;
      this.availability.dataset.state = variant.available ? 'available' : 'sold-out';
    }
    if (variant.featuredMediaId) this.selectMedia(variant.featuredMediaId);
    const rule = variant.quantityRule || {};
    this.quantity.min = rule.min || 1;
    this.quantity.step = rule.increment || 1;
    if (rule.max) this.quantity.max = rule.max;
    else this.quantity.removeAttribute('max');
    this.clampQuantity();
  }

  clampQuantity() {
    if (!this.quantity) return;
    const step = Number(this.quantity.step) || 1;
    const min = Number(this.quantity.min) || 1;
    const max = this.quantity.max ? Number(this.quantity.max) : Infinity;
    const value = Number(this.quantity.value) || min;
    const clamped = Math.min(max, Math.max(min, value));
    this.quantity.value = Number.isFinite(clamped) ? min + Math.floor((clamped - min) / step) * step : clamped;
    this.querySelector('[data-quick-add-quantity-decrease]')?.toggleAttribute('disabled', this.quantity.disabled || Number(this.quantity.value) <= min);
    this.querySelector('[data-quick-add-quantity-increase]')?.toggleAttribute('disabled', this.quantity.disabled || Number(this.quantity.value) >= max);
  }

  changeQuantity(direction) {
    const step = Number(this.quantity.step) || 1;
    this.quantity.value = (Number(this.quantity.value) || Number(this.quantity.min) || 1) + direction * step;
    this.clampQuantity();
  }

  applyCartState(quantities) {
    this.cartQuantities = new Map(Object.entries(quantities || {}).map(([id, quantity]) => [String(id), Number(quantity) || 0]));
  }

  async validateAdd() {
    if (!this.currentVariant || !this.currentVariant.available) {
      this.showError(this.dataset.unavailable);
      return false;
    }
    this.inventoryController?.abort();
    const controller = new AbortController();
    this.inventoryController = controller;
    const { signal } = controller;
    const variantId = String(this.currentVariant.id);
    const requested = Number(this.quantity.value) || Number(this.quantity.min) || 1;
    const wasDisabled = this.submit.disabled;
    this.submit.disabled = true;
    this.submit.setAttribute('aria-busy', 'true');
    this.showError(this.dataset.verifying);
    try {
      const [cartQuantities, inventory] = await Promise.all([this.readCartQuantities(signal), this.readLiveInventory(variantId, signal)]);
      if (signal.aborted || String(this.currentVariant?.id) !== variantId) return false;
      if (!inventory) throw new Error('Unavailable');
      if (inventory.tracked && inventory.policy === 'deny') {
        const remaining = Math.max(0, inventory.quantity - (cartQuantities.get(variantId) || 0));
        if (requested > remaining) {
          this.showError(remaining ? `Only ${remaining} more item${remaining === 1 ? '' : 's'} can be added for this variant.` : 'The maximum quantity of this item is already in your cart.');
          return false;
        }
      }
      this.clearError();
      return true;
    } catch (_) {
      if (!signal.aborted) this.showError(this.dataset.error);
      return false;
    } finally {
      if (this.inventoryController === controller) this.inventoryController = null;
      if (!signal.aborted) {
        this.submit.disabled = wasDisabled || !this.currentVariant?.available;
        this.submit.removeAttribute('aria-busy');
      }
    }
  }

  async readCartQuantities(signal) {
    const cartUrl = document.querySelector('[data-cart-drawer]')?.dataset.cartUrl || '/cart';
    const response = await fetch(`${cartUrl}.js`, { cache: 'no-store', headers: { Accept: 'application/json' }, signal });
    if (!response.ok) throw new Error('Cart state request failed');
    const cart = await response.json();
    const quantities = (cart.items || []).reduce((result, item) => {
      result[String(item.variant_id)] = (result[String(item.variant_id)] || 0) + item.quantity;
      return result;
    }, {});
    this.applyCartState(quantities);
    return new Map(Object.entries(quantities));
  }

  async readLiveInventory(variantId, signal) {
    const url = new URL(this.dataset.productUrl, window.location.origin);
    url.searchParams.set('variant', variantId);
    url.searchParams.set('_', Date.now());
    const response = await fetch(url, { cache: 'no-store', headers: { Accept: 'text/html' }, signal });
    if (!response.ok) throw new Error('Inventory request failed');
    const root = new DOMParser().parseFromString(await response.text(), 'text/html').querySelector('[data-product-form]');
    const id = root?.querySelector('[data-product-variant-id]')?.value;
    if (!root || id !== variantId) throw new Error('Inventory response was stale');
    return {
      tracked: root.dataset.variantInventoryTracked === 'true',
      policy: root.dataset.variantInventoryPolicy,
      quantity: Number(root.dataset.variantInventoryQuantity),
    };
  }

  showError(message) { this.error.textContent = message; this.error.hidden = false; }
  clearError() { this.error.textContent = ''; this.error.hidden = true; }

  selectMedia(id) {
    if (!id) return;
    this.media.forEach((item) => { item.hidden = item.dataset.quickAddMediaId !== String(id); });
    this.mediaButtons.forEach((button) => button.toggleAttribute('aria-current', button.dataset.quickAddMediaSelect === String(id)));
  }

  lockPageScroll() {
    document.documentElement.classList.add('quick-add-modal-open');
    document.body.classList.add('quick-add-modal-open');
  }

  unlockPageScroll() {
    if (!document.body.classList.contains('quick-add-modal-open')) return;
    document.documentElement.classList.remove('quick-add-modal-open');
    document.body.classList.remove('quick-add-modal-open');
  }
}

if (!customElements.get('quick-add')) customElements.define('quick-add', QuickAdd);
