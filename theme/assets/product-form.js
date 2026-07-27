class ProductForm extends HTMLElement {
  connectedCallback() {
    if (this.abortController) return;
    this.section = this.closest('[data-product-section]');
    this.variantInput = this.querySelector('[data-product-variant-id]');
    this.submit = this.querySelector('[data-product-submit]');
    this.options = [...this.querySelectorAll('[data-product-option]')];
    this.optionButtons = [...this.querySelectorAll('[data-product-option-button]')];
    this.quantity = this.querySelector('[data-product-quantity]');
    this.quantityDecrease = this.querySelector('[data-product-quantity-decrease]');
    this.quantityIncrease = this.querySelector('[data-product-quantity-increase]');
    this.error = this.querySelector('[data-product-selection-error]');
    this.price = this.section.querySelector('[data-product-price]');
    this.sku = this.section.querySelector('[data-product-sku]');
    this.skuValue = this.section.querySelector('[data-product-sku-value]');
    this.availability = this.section.querySelector('[data-product-availability]');
    this.variants = JSON.parse(this.section.querySelector('[data-product-variants]').textContent);
    this.cartQuantities = new Map();
    if (!this.variantInput || !this.submit || !this.price) return;
    this.variantInput.name = 'id';
    this.abortController = new AbortController();
    const signal = this.abortController.signal;
    this.options.forEach((option) => option.addEventListener('change', () => this.fromControls(), { signal }));
    this.optionButtons.forEach((button) => button.addEventListener('click', () => {
      const option = this.options[Number(button.dataset.productOptionIndex)];
      if (!option) return;
      option.value = button.dataset.productOptionValue;
      this.fromControls();
    }, { signal }));
    this.querySelector('[data-product-quantity-decrease]')?.addEventListener('click', () => this.changeQuantity(-1), { signal });
    this.querySelector('[data-product-quantity-increase]')?.addEventListener('click', () => this.changeQuantity(1), { signal });
    this.quantity?.addEventListener('change', () => this.clampQuantity(), { signal });
    window.addEventListener('popstate', () => this.fromUrl(), { signal });
    window.addEventListener('cart:state', (event) => this.applyCartState(event.detail?.quantities), { signal });
    this.setAttribute('data-product-enhanced', '');
    this.fromUrl();
    this.loadCartState();
  }

  disconnectedCallback() { this.abortController?.abort(); this.abortController = null; }

  showError(message) {
    if (!this.error) return;
    this.error.textContent = message;
    this.error.hidden = false;
  }

  async validateAdd() {
    if (!this.currentVariant || !this.quantity) return false;
    this.inventoryController?.abort();
    const controller = new AbortController();
    this.inventoryController = controller;
    const { signal } = controller;
    const wasDisabled = this.submit.disabled;
    const variantId = this.currentVariant.id;
    const requested = Number(this.quantity.value) || Number(this.quantity.min) || 1;
    this.submit.disabled = true;
    try {
      const [cartQuantities, inventory] = await Promise.all([
        this.readCartQuantities(signal),
        this.readLiveInventory(variantId, signal),
      ]);
      if (signal.aborted || String(this.currentVariant?.id) !== String(variantId)) return false;
      if (!inventory) {
        this.showError('We could not verify availability. Please try again.');
        return false;
      }
      if (!inventory.tracked || inventory.policy !== 'deny') return true;
      const inCart = cartQuantities.get(String(variantId)) || 0;
      const remaining = Math.max(0, inventory.quantity - inCart);
      if (requested > remaining) {
        this.showError(remaining ? `Only ${remaining} more item${remaining === 1 ? '' : 's'} can be added for this variant.` : 'The maximum quantity of this item is already in your cart.');
        return false;
      }
      return true;
    } catch (error) {
      if (!signal.aborted) this.showError('We could not verify availability. Please try again.');
      return false;
    } finally {
      if (this.inventoryController === controller) this.inventoryController = null;
      if (!signal.aborted) this.submit.disabled = wasDisabled || !this.currentVariant.available;
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
    url.searchParams.set('section_id', this.section.dataset.sectionId);
    url.searchParams.set('_', Date.now());
    const response = await fetch(url, { cache: 'no-store', headers: { Accept: 'text/html' }, signal });
    if (!response.ok) throw new Error('Inventory request failed');
    const html = await response.text();
    const form = new DOMParser().parseFromString(html, 'text/html').querySelector('[data-product-form]');
    const returnedVariantId = form?.querySelector('[data-product-variant-id]')?.value;
    if (!form || returnedVariantId !== String(variantId)) throw new Error('Inventory response was stale');
    return {
      tracked: form.dataset.variantInventoryTracked === 'true',
      policy: form.dataset.variantInventoryPolicy,
      quantity: Number(form.dataset.variantInventoryQuantity),
    };
  }

  fromControls() {
    const choices = this.options.map((option) => option.value);
    const variant = this.variants.find((item) => item.options.every((value, index) => value === choices[index]));
    if (!variant) return this.unavailable();
    this.commit(variant, true);
  }

  fromUrl() {
    const id = new URL(window.location.href).searchParams.get('variant');
    const variant = this.variants.find((item) => String(item.id) === id) || this.variants.find((item) => String(item.id) === this.variantInput.value);
    if (!variant) return;
    this.options.forEach((option, index) => { option.value = variant.options[index]; });
    this.syncOptionButtons();
    this.commit(variant, false);
  }

  unavailable() {
    this.submit.disabled = true;
    this.error.hidden = false;
    this.error.textContent = this.dataset.unavailable;
    if (this.availability) {
      this.availability.textContent = this.dataset.unavailable;
      this.availability.dataset.state = 'unavailable';
    }
    this.syncOptionButtons();
  }

  commit(variant, updateUrl) {
    this.inventoryController?.abort();
    this.currentVariant = variant;
    this.variantInput.value = variant.id;
    this.error.hidden = true;
    this.error.textContent = '';
    this.submit.disabled = !variant.available || Boolean(this.inventoryController);
    this.submit.textContent = variant.available ? this.dataset.addToCart : this.dataset.soldOut;
    this.renderAvailability(variant);
    if (this.skuValue) this.skuValue.textContent = variant.sku || '';
    if (this.sku) this.sku.hidden = !variant.sku;
    this.syncOptionButtons();
    this.syncQuantityRule(variant);
    this.price.innerHTML = `<div class="price"><span class="price__current">${this.escape(variant.price)}</span>${variant.onSale ? `<s class="price__compare">${this.escape(variant.comparePrice)}</s>` : ''}${variant.unitPrice ? `<small class="price__unit">${this.escape(variant.unitPrice)}</small>` : ''}</div>`;
    this.section.querySelectorAll('[data-product-media-id]').forEach((media) => { media.hidden = Boolean(variant.featuredMediaId) && media.dataset.productMediaId !== String(variant.featuredMediaId); });
    this.section.dispatchEvent(new CustomEvent('product:variant-change', { bubbles: true, detail: { featuredMediaId: variant.featuredMediaId } }));
    if (updateUrl) {
      const url = new URL(window.location.href);
      url.searchParams.set('variant', variant.id);
      window.history.replaceState({}, '', url);
    }
  }

  escape(value) { const node = document.createElement('span'); node.textContent = value || ''; return node.innerHTML; }

  syncOptionButtons() {
    this.optionButtons.forEach((button) => {
      const index = Number(button.dataset.productOptionIndex);
      const option = this.options[index];
      button.setAttribute('aria-pressed', String(option?.value === button.dataset.productOptionValue));
      button.disabled = !this.isOptionValueAvailable(index, button.dataset.productOptionValue);
    });
    this.options.forEach((option, index) => {
      [...option.options].forEach((choice) => {
        choice.disabled = !this.isOptionValueAvailable(index, choice.value);
      });
    });
    this.querySelectorAll('[data-product-option-selected]').forEach((label) => {
      const option = this.options[Number(label.dataset.productOptionSelected)];
      if (option) label.textContent = option.value;
    });
  }

  isOptionValueAvailable(index, optionValue) {
    return this.variants.some((variant) => variant.available && variant.options.every((value, optionIndex) => optionIndex === index ? value === optionValue : value === this.options[optionIndex]?.value));
  }

  syncQuantityRule(variant) {
    if (!this.quantity) return;
    const rule = variant.quantityRule || {};
    this.quantity.min = rule.min || 1;
    this.quantity.step = rule.increment || 1;
    if (rule.max) this.quantity.max = rule.max;
    else this.quantity.removeAttribute('max');
    this.quantity.disabled = !variant.available;
    this.submit.disabled = !variant.available;
    this.error.hidden = true;
    this.error.textContent = '';
    this.clampQuantity();
  }

  renderAvailability(variant) {
    if (!this.availability) return;
    if (!variant.available) {
      this.availability.textContent = this.dataset.soldOut;
      this.availability.dataset.state = 'sold-out';
    } else {
      this.availability.textContent = this.dataset.available;
      this.availability.dataset.state = 'available';
    }
  }

  applyCartState(quantities) {
    this.cartQuantities = new Map(Object.entries(quantities || {}).map(([id, quantity]) => [String(id), Number(quantity) || 0]));
    if (this.currentVariant) {
      this.syncQuantityRule(this.currentVariant);
      this.renderAvailability(this.currentVariant);
    }
  }

  async loadCartState() {
    const cartUrl = document.querySelector('[data-cart-drawer]')?.dataset.cartUrl || '/cart';
    try {
      const response = await fetch(`${cartUrl}.js`, { headers: { Accept: 'application/json' } });
      if (!response.ok) return;
      const cart = await response.json();
      const quantities = (cart.items || []).reduce((result, item) => {
        result[item.variant_id] = (result[item.variant_id] || 0) + item.quantity;
        return result;
      }, {});
      this.applyCartState(quantities);
    } catch (_) {
      // Shopify remains the final validator if cart state cannot be read.
    }
  }

  clampQuantity() {
    if (!this.quantity) return;
    const step = Number(this.quantity.step) || 1;
    const min = Number(this.quantity.min) || 1;
    const max = this.quantity.max ? Number(this.quantity.max) : Infinity;
    const value = Number(this.quantity.value) || min;
    const clamped = Math.min(max, Math.max(min, value));
    this.quantity.value = Number.isFinite(clamped) ? min + Math.floor((clamped - min) / step) * step : clamped;
    this.quantityIncrease.disabled = this.quantity.disabled || this.quantity.value >= max;
    this.quantityDecrease.disabled = this.quantity.disabled || this.quantity.value <= min;
  }

  changeQuantity(direction) {
    if (!this.quantity) return;
    const step = Number(this.quantity.step) || 1;
    const min = Number(this.quantity.min) || 1;
    const max = this.quantity.max ? Number(this.quantity.max) : Infinity;
    const value = Number(this.quantity.value) || min;
    this.quantity.value = Math.min(max, Math.max(min, value + direction * step));
    this.clampQuantity();
  }
}

if (!customElements.get('product-form')) customElements.define('product-form', ProductForm);

class ProductGallery extends HTMLElement {
  connectedCallback() {
    if (this.abortController) return;
    this.abortController = new AbortController();
    const signal = this.abortController.signal;
    this.media = [...this.querySelectorAll('[data-product-media-id]')];
    this.buttons = [...this.querySelectorAll('[data-product-media-select]')];
    this.stage = this.querySelector('.main-product__media-stage');
    this.dialog = this.querySelector('[data-product-gallery-dialog]');
    this.dialogContent = this.querySelector('[data-product-gallery-dialog-content]');
    this.previousButton = this.querySelector('[data-product-gallery-previous]');
    this.nextButton = this.querySelector('[data-product-gallery-next]');
    this.count = this.querySelector('[data-product-gallery-count]');
    this.buttons.forEach((button) => button.addEventListener('click', () => this.select(button.dataset.productMediaSelect, { reveal: true }), { signal }));
    this.stage?.addEventListener('click', (event) => {
      const opener = event.target.closest('[data-product-media-open]');
      if (!opener) return;
      this.select(opener.dataset.productMediaOpen);
      this.open(opener);
    }, { signal });
    this.previousButton?.addEventListener('click', () => this.step(-1), { signal });
    this.nextButton?.addEventListener('click', () => this.step(1), { signal });
    this.dialog?.addEventListener('click', (event) => { if (event.target === this.dialog) this.dialog.close(); }, { signal });
    this.dialog?.addEventListener('close', () => {
      this.unlockPageScroll();
      this.opener?.focus();
    }, { signal });
    this.dialog?.addEventListener('keydown', (event) => {
      if (event.key === 'ArrowLeft') { event.preventDefault(); this.step(-1); }
      if (event.key === 'ArrowRight') { event.preventDefault(); this.step(1); }
    }, { signal });
    this.closest('[data-product-section]')?.addEventListener('product:variant-change', (event) => {
      if (event.detail.featuredMediaId) this.select(String(event.detail.featuredMediaId));
    }, { signal });
    this.select(this.dataset.initialMediaId || this.media[0]?.dataset.productMediaId);
  }

  disconnectedCallback() { this.abortController?.abort(); this.abortController = null; }

  select(id, { reveal = false } = {}) {
    if (!id) return;
    const selectedMedia = this.media.find((item) => item.dataset.productMediaId === String(id));
    this.media.forEach((item) => {
      const selected = item.dataset.productMediaId === String(id);
      item.hidden = !selected;
      if (!selected) item.querySelectorAll('video').forEach((video) => video.pause());
    });
    if (selectedMedia?.dataset.productMediaRatio) this.stage?.style.setProperty('--pdp-media-ratio', selectedMedia.dataset.productMediaRatio);
    this.buttons.forEach((button) => button.toggleAttribute('aria-current', button.dataset.productMediaSelect === String(id)));
    this.selectedId = String(id);
    if (reveal) this.revealSelectedMedia();
  }

  revealSelectedMedia() {
    requestAnimationFrame(() => {
      if (!this.stage) return;
      const bounds = this.stage.getBoundingClientRect();
      if (bounds.top < 0 || bounds.bottom > window.innerHeight) this.stage.scrollIntoView({ block: 'start', inline: 'nearest', behavior: 'auto' });
    });
  }

  open(opener = null) {
    this.modalSelectedId = this.selectedId;
    this.opener = opener || this.media.find((item) => item.dataset.productMediaId === this.selectedId)?.querySelector('[data-product-media-open]');
    this.renderModalMedia();
    if (!this.dialog.open) {
      this.lockPageScroll();
      this.dialog.showModal();
      this.dialog.focus({ preventScroll: true });
    }
  }

  renderModalMedia() {
    const source = this.media.find((item) => item.dataset.productMediaId === this.modalSelectedId);
    if (!source || !this.dialog || !this.dialogContent) return;
    const clone = source.cloneNode(true);
    clone.removeAttribute('hidden');
    clone.querySelector('[data-product-media-open]')?.remove();
    this.dialogContent.replaceChildren(clone);
    this.enableHoverZoom(clone.querySelector('img'));
    this.setDialogAspect(clone);
    if (this.count) this.count.textContent = `${this.media.findIndex((item) => item.dataset.productMediaId === this.modalSelectedId) + 1} / ${this.media.length}`;
  }

  setDialogAspect(clone) {
    const image = clone.querySelector('img');
    if (image) {
      const setImageAspect = () => {
        if (image.naturalWidth && image.naturalHeight) this.sizeDialog(image.naturalWidth / image.naturalHeight);
      };
      if (image.complete) setImageAspect();
      else image.addEventListener('load', setImageAspect, { once: true });
      return;
    }
    const video = clone.querySelector('video');
    if (video) {
      const setVideoAspect = () => {
        if (video.videoWidth && video.videoHeight) this.sizeDialog(video.videoWidth / video.videoHeight);
      };
      video.addEventListener('loadedmetadata', setVideoAspect, { once: true });
      return;
    }
    this.sizeDialog(16 / 9);
  }

  sizeDialog(aspect) {
    this.mediaAspect = aspect;
    const navigationHeight = 64;
    const maxWidth = window.innerWidth * 0.92;
    const maxHeight = window.innerHeight - navigationHeight - 16;
    const width = Math.min(maxWidth, maxHeight * aspect);
    const height = width / aspect;
    this.dialog.style.inlineSize = `${Math.floor(width)}px`;
    this.dialog.style.blockSize = `${Math.floor(height)}px`;
    this.dialog.style.marginBlockStart = `${Math.max(8, Math.floor((window.innerHeight - navigationHeight - height) / 2))}px`;
  }

  enableHoverZoom(image) {
    if (!image || !window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
    image.dataset.productHoverZoom = '';
    image.addEventListener('pointermove', (event) => {
      const bounds = image.getBoundingClientRect();
      image.style.transformOrigin = `${((event.clientX - bounds.left) / bounds.width) * 100}% ${((event.clientY - bounds.top) / bounds.height) * 100}%`;
      image.classList.add('is-zooming');
    });
    image.addEventListener('pointerleave', () => {
      image.classList.remove('is-zooming');
      image.style.removeProperty('transform-origin');
    });
  }

  lockPageScroll() {
    this.scrollY = window.scrollY;
    document.documentElement.classList.add('product-gallery-modal-open');
    document.body.classList.add('product-gallery-modal-open');
    document.body.style.position = 'fixed';
    document.body.style.top = `-${this.scrollY}px`;
    document.body.style.width = '100%';
  }

  unlockPageScroll() {
    document.documentElement.classList.remove('product-gallery-modal-open');
    document.body.classList.remove('product-gallery-modal-open');
    document.body.style.removeProperty('position');
    document.body.style.removeProperty('top');
    document.body.style.removeProperty('width');
    window.scrollTo(0, this.scrollY || 0);
    this.scrollY = 0;
  }

  step(direction) {
    const index = this.media.findIndex((item) => item.dataset.productMediaId === this.modalSelectedId);
    this.modalSelectedId = this.media[(index + direction + this.media.length) % this.media.length]?.dataset.productMediaId;
    this.renderModalMedia();
  }
}

if (!customElements.get('product-gallery')) customElements.define('product-gallery', ProductGallery);

class SizeGuide extends HTMLElement {
  connectedCallback() {
    if (this.abortController) return;
    this.abortController = new AbortController();
    const signal = this.abortController.signal;
    this.dialog = this.querySelector('[data-size-guide-dialog]');
    this.trigger = this.closest('[data-product-section]')?.querySelector('[data-size-guide-open]');
    this.closeButton = this.querySelector('[data-size-guide-close]');
    if (!this.dialog || !this.trigger) return;
    this.trigger.addEventListener('click', (event) => {
      if (typeof this.dialog.showModal !== 'function') return;
      event.preventDefault();
      this.opener = this.trigger;
      this.lockPageScroll();
      this.dialog.showModal();
      this.closeButton?.focus({ preventScroll: true });
    }, { signal });
    this.closeButton?.addEventListener('click', () => this.dialog.close(), { signal });
    this.dialog.addEventListener('click', (event) => { if (event.target === this.dialog) this.dialog.close(); }, { signal });
    this.dialog.addEventListener('close', () => {
      this.unlockPageScroll();
      this.opener?.focus({ preventScroll: true });
    }, { signal });
  }

  disconnectedCallback() { this.abortController?.abort(); this.abortController = null; }

  lockPageScroll() {
    this.scrollY = window.scrollY;
    document.documentElement.classList.add('size-guide-modal-open');
    document.body.classList.add('size-guide-modal-open');
    document.body.style.position = 'fixed';
    document.body.style.top = `-${this.scrollY}px`;
    document.body.style.width = '100%';
  }

  unlockPageScroll() {
    document.documentElement.classList.remove('size-guide-modal-open');
    document.body.classList.remove('size-guide-modal-open');
    document.body.style.removeProperty('position');
    document.body.style.removeProperty('top');
    document.body.style.removeProperty('width');
    window.scrollTo(0, this.scrollY || 0);
    this.scrollY = 0;
  }
}

if (!customElements.get('size-guide')) customElements.define('size-guide', SizeGuide);
