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
    this.form = this.querySelector('form');
    this.price = this.section.querySelector('[data-product-price]');
    this.sku = this.section.querySelector('[data-product-sku]');
    this.skuValue = this.section.querySelector('[data-product-sku-value]');
    this.availability = this.section.querySelector('[data-product-availability]');
    this.paymentTermsVariantInputs = [...this.section.querySelectorAll('[data-product-payment-terms-variant-id]')];
    this.giftCardRecipientToggle = this.querySelector('[data-gift-card-recipient-toggle]');
    this.giftCardRecipientFields = this.querySelector('[data-gift-card-recipient-fields]');
    this.giftCardRecipientEmail = this.querySelector('[data-gift-card-recipient-email]');
    this.paymentButton = this.querySelector('[data-product-payment-button]');
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
    this.giftCardRecipientToggle?.addEventListener('change', () => this.syncGiftCardRecipient(), { signal });
    this.form?.addEventListener('submit', (event) => this.onSubmit(event), { signal });
    window.addEventListener('popstate', () => this.fromUrl(), { signal });
    window.addEventListener('cart:state', (event) => this.applyCartState(event.detail?.quantities), { signal });
    this.setAttribute('data-product-enhanced', '');
    this.syncGiftCardRecipient();
    this.fromUrl();
    this.loadCartState();
  }

  disconnectedCallback() { this.abortController?.abort(); this.abortController = null; }

  showError(message) {
    if (!this.error) return;
    this.error.textContent = message;
    this.error.hidden = false;
  }

  async onSubmit(event) {
    if (event.submitter?.closest?.('[data-product-payment-button]')) return;
    if (this.validatedSubmit) {
      this.validatedSubmit = false;
      return;
    }
    event.preventDefault();
    if (this.validatingSubmit) return;
    this.validatingSubmit = true;
    const isValid = await this.validateAdd();
    this.validatingSubmit = false;
    if (!isValid || !this.form) return;
    this.validatedSubmit = true;
    this.form.setAttribute('data-product-validation-approved', '');
    if (event.submitter) this.form.requestSubmit(event.submitter);
    else this.form.requestSubmit();
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
    this.syncPaymentTerms(variant.id);
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
    if (this.section.dataset.galleryLayout !== 'stacked') {
      this.section.querySelectorAll('[data-product-media-id]').forEach((media) => { media.hidden = Boolean(variant.featuredMediaId) && media.dataset.productMediaId !== String(variant.featuredMediaId); });
    }
    this.section.dispatchEvent(new CustomEvent('product:variant-change', { bubbles: true, detail: { variant, featuredMediaId: variant.featuredMediaId } }));
    if (updateUrl) {
      const url = new URL(window.location.href);
      url.searchParams.set('variant', variant.id);
      window.history.replaceState({}, '', url);
    }
  }

  escape(value) { const node = document.createElement('span'); node.textContent = value || ''; return node.innerHTML; }

  syncPaymentTerms(variantId) {
    this.paymentTermsVariantInputs.forEach((input) => {
      input.value = variantId;
      input.setAttribute('value', variantId);
      input.dispatchEvent(new Event('change', { bubbles: true }));
    });
  }

  syncGiftCardRecipient() {
    if (!this.giftCardRecipientToggle || !this.giftCardRecipientFields) return;
    const enabled = this.giftCardRecipientToggle.checked;
    this.giftCardRecipientFields.hidden = !enabled;
    this.giftCardRecipientFields.querySelectorAll('input, textarea').forEach((input) => {
      input.disabled = !enabled;
    });
    if (this.giftCardRecipientEmail) this.giftCardRecipientEmail.required = enabled;
    if (this.paymentButton) this.paymentButton.hidden = enabled;
    const sendOn = this.giftCardRecipientFields.querySelector('[data-gift-card-recipient-date]');
    if (!sendOn) return;
    const today = new Date();
    const max = new Date(today);
    max.setDate(max.getDate() + 90);
    sendOn.min = this.formatDate(today);
    sendOn.max = this.formatDate(max);
  }

  formatDate(date) {
    const offsetDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
    return offsetDate.toISOString().slice(0, 10);
  }

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

class PickupAvailability extends HTMLElement {
  connectedCallback() {
    if (this.abortController) return;
    this.section = this.closest('[data-product-section]');
    this.abortController = new AbortController();
    const { signal } = this.abortController;
    this.section?.addEventListener('product:variant-change', (event) => this.update(event.detail?.variant), { signal });
    if (this.dataset.variantAvailable !== 'true') return this.clear();
    this.load(this.dataset.variantId);
  }

  disconnectedCallback() {
    this.abortController?.abort();
    this.abortController = null;
  }

  update(variant) {
    if (!variant?.available) return this.clear();
    this.dataset.variantAvailable = 'true';
    this.load(variant.id);
  }

  clear() {
    this.requestController?.abort();
    this.sequence = (this.sequence || 0) + 1;
    this.dataset.variantAvailable = 'false';
    this.replaceChildren();
    this.hidden = true;
    this.setAttribute('aria-busy', 'false');
  }

  async load(variantId) {
    if (!variantId) return this.clear();
    this.requestController?.abort();
    const requestController = new AbortController();
    this.requestController = requestController;
    const sequence = (this.sequence || 0) + 1;
    this.sequence = sequence;
    this.dataset.variantId = String(variantId);
    this.setAttribute('aria-busy', 'true');
    try {
      const root = this.dataset.rootUrl.endsWith('/') ? this.dataset.rootUrl : `${this.dataset.rootUrl}/`;
      const url = new URL(`${root}variants/${variantId}/`, window.location.origin);
      url.searchParams.set('section_id', 'pickup-availability');
      const previewThemeId = new URL(window.location.href).searchParams.get('preview_theme_id');
      if (previewThemeId) url.searchParams.set('preview_theme_id', previewThemeId);
      const response = await fetch(url, { headers: { Accept: 'text/html' }, signal: requestController.signal });
      if (!response.ok) throw new Error(`Pickup availability failed: ${response.status}`);
      const documentFragment = new DOMParser().parseFromString(await response.text(), 'text/html');
      const content = documentFragment.querySelector('[data-pickup-availability-content]');
      if (requestController.signal.aborted || sequence !== this.sequence || this.dataset.variantId !== String(variantId)) return;
      if (!content) return this.clear();
      this.replaceChildren(content);
      this.hidden = false;
      this.bindDialog();
    } catch (error) {
      if (!requestController.signal.aborted && sequence === this.sequence) this.clear();
    } finally {
      if (sequence === this.sequence) this.setAttribute('aria-busy', 'false');
      if (this.requestController === requestController) this.requestController = null;
    }
  }

  bindDialog() {
    const dialog = this.querySelector('[data-pickup-availability-dialog]');
    const opener = this.querySelector('[data-pickup-availability-open]');
    const close = this.querySelector('[data-pickup-availability-close]');
    opener?.addEventListener('click', () => dialog?.showModal(), { signal: this.abortController.signal });
    close?.addEventListener('click', () => dialog?.close(), { signal: this.abortController.signal });
    dialog?.addEventListener('click', (event) => { if (event.target === dialog) dialog.close(); }, { signal: this.abortController.signal });
    dialog?.addEventListener('close', () => opener?.focus(), { signal: this.abortController.signal });
  }
}

if (!customElements.get('pickup-availability')) customElements.define('pickup-availability', PickupAvailability);

class ProductGallery extends HTMLElement {
  connectedCallback() {
    if (this.abortController) return;
    this.abortController = new AbortController();
    const signal = this.abortController.signal;
    this.media = [...this.querySelectorAll('[data-product-media-id]')];
    this.isStacked = this.dataset.galleryLayout === 'stacked';
    this.buttons = [...this.querySelectorAll('[data-product-media-select]')];
    this.stage = this.querySelector('.main-product__media-stage');
    this.thumbnailWrap = this.querySelector('[data-product-thumbnail-wrap]');
    this.thumbnails = this.querySelector('[data-product-thumbnails]');
    this.dialog = this.querySelector('[data-product-gallery-dialog]');
    this.dialogContent = this.querySelector('[data-product-gallery-dialog-content]');
    this.previousButton = this.querySelector('[data-product-gallery-previous]');
    this.nextButton = this.querySelector('[data-product-gallery-next]');
    this.count = this.querySelector('[data-product-gallery-count]');
    this.buttons.forEach((button) => button.addEventListener('click', () => this.select(button.dataset.productMediaSelect, { reveal: true }), { signal }));
    this.thumbnails?.addEventListener('scroll', () => this.scheduleThumbnailOverflowUpdate(), { signal, passive: true });
    if (this.thumbnails && typeof ResizeObserver === 'function') {
      this.thumbnailResizeObserver = new ResizeObserver(() => this.updateThumbnailOverflow());
      this.thumbnailResizeObserver.observe(this.thumbnails);
    }
    this.stage?.addEventListener('click', (event) => {
      if (this.suppressStageOpen) {
        this.suppressStageOpen = false;
        return;
      }
      const opener = event.target.closest('[data-product-media-open]');
      if (!opener) return;
      this.select(opener.dataset.productMediaOpen);
      this.open(opener);
    }, { signal });
    if (!this.isStacked) {
      this.stage?.addEventListener('pointerdown', (event) => this.onStagePointerDown(event), { signal });
      this.stage?.addEventListener('pointermove', (event) => this.onStagePointerMove(event), { signal });
      this.stage?.addEventListener('pointerup', (event) => this.onStagePointerUp(event), { signal });
      this.stage?.addEventListener('pointercancel', () => this.cancelStageSwipe(), { signal });
    }
    this.dialogContent?.addEventListener('pointerdown', (event) => this.onModalPointerDown(event), { signal });
    this.dialogContent?.addEventListener('pointermove', (event) => this.onModalPointerMove(event), { signal });
    this.dialogContent?.addEventListener('pointerup', (event) => this.onModalPointerUp(event), { signal });
    this.dialogContent?.addEventListener('pointercancel', () => this.cancelModalSwipe(), { signal });
    this.previousButton?.addEventListener('click', () => this.step(-1), { signal });
    this.nextButton?.addEventListener('click', () => this.step(1), { signal });
    this.dialog?.addEventListener('click', (event) => { if (event.target === this.dialog) this.dialog.close(); }, { signal });
    this.dialog?.addEventListener('close', () => {
      this.pauseModalPlayback();
      this.unlockPageScroll();
      this.opener?.focus();
    }, { signal });
    this.dialog?.addEventListener('keydown', (event) => {
      // Native video controls can consume ArrowLeft/ArrowRight before the
      // bubbling phase. Capturing keeps gallery navigation available after a
      // video has received focus, then moves focus to the persistent toolbar
      // control because the video node is about to be replaced.
      if (event.key === 'ArrowLeft') { event.preventDefault(); this.step(-1, this.previousButton); }
      if (event.key === 'ArrowRight') { event.preventDefault(); this.step(1, this.nextButton); }
    }, { signal, capture: true });
    window.addEventListener('resize', () => {
      if (this.dialog?.open && this.mediaAspect) this.sizeDialog(this.mediaAspect);
    }, { signal });
    this.closest('[data-product-section]')?.addEventListener('product:variant-change', (event) => {
      if (event.detail.featuredMediaId) this.select(String(event.detail.featuredMediaId));
    }, { signal });
    this.select(this.dataset.initialMediaId || this.media[0]?.dataset.productMediaId);
    this.updateThumbnailOverflow();
  }

  disconnectedCallback() {
    this.abortController?.abort();
    this.abortController = null;
    this.thumbnailResizeObserver?.disconnect();
    this.thumbnailResizeObserver = null;
    window.cancelAnimationFrame(this.thumbnailOverflowFrame);
    this.thumbnailOverflowFrame = null;
  }

  scheduleThumbnailOverflowUpdate() {
    if (this.thumbnailOverflowFrame) return;
    this.thumbnailOverflowFrame = window.requestAnimationFrame(() => {
      this.thumbnailOverflowFrame = null;
      this.updateThumbnailOverflow();
    });
  }

  updateThumbnailOverflow() {
    if (!this.thumbnails || !this.thumbnailWrap) return;
    const hasOverflow = this.thumbnails.scrollWidth - this.thumbnails.clientWidth > 1;
    const hasMoreAtEnd = this.thumbnails.scrollLeft + this.thumbnails.clientWidth < this.thumbnails.scrollWidth - 1;
    this.thumbnailWrap.toggleAttribute('data-overflow-start', hasOverflow && this.thumbnails.scrollLeft > 1);
    this.thumbnailWrap.toggleAttribute('data-overflow-end', hasOverflow && hasMoreAtEnd);
  }

  select(id, { reveal = false } = {}) {
    if (!id) return;
    const selectedMedia = this.media.find((item) => item.dataset.productMediaId === String(id));
    this.media.forEach((item) => {
      const selected = item.dataset.productMediaId === String(id);
      if (!this.isStacked) item.hidden = !selected;
      if (!selected && !this.isStacked) item.querySelectorAll('video').forEach((video) => video.pause());
    });
    if (selectedMedia?.dataset.productMediaRatio) this.stage?.style.setProperty('--pdp-media-ratio', selectedMedia.dataset.productMediaRatio);
    const video = selectedMedia?.querySelector('video');
    const syncVideoRatio = () => {
      if (video?.videoWidth && video.videoHeight) this.stage?.style.setProperty('--pdp-media-ratio', String(video.videoWidth / video.videoHeight));
    };
    if (video?.readyState >= 1) syncVideoRatio();
    else video?.addEventListener('loadedmetadata', syncVideoRatio, { once: true });
    this.buttons.forEach((button) => {
      if (button.dataset.productMediaSelect === String(id)) button.setAttribute('aria-current', 'true');
      else button.removeAttribute('aria-current');
    });
    this.selectedId = String(id);
    if (reveal) this.revealSelectedMedia();
  }

  revealSelectedMedia() {
    requestAnimationFrame(() => {
      if (!this.stage) return;
      const bounds = this.stage.getBoundingClientRect();
      const header = document.querySelector('.header-shell--sticky');
      const headerBottom = Math.max(0, header?.getBoundingClientRect().bottom || 0);
      const breadcrumb = document.querySelector('.breadcrumbs--product');
      const breadcrumbGap = breadcrumb ? Math.max(0, bounds.top - breadcrumb.getBoundingClientRect().top) : 24;
      // Keep the whole breadcrumb below the sticky header, with a short gap,
      // then place the selected media immediately after its natural spacing.
      const revealOffset = headerBottom + breadcrumbGap + 16;
      if (bounds.top < revealOffset || bounds.bottom > window.innerHeight) {
        window.scrollTo({
          top: Math.max(0, window.scrollY + bounds.top - revealOffset),
          behavior: 'auto',
        });
      }
    });
  }

  onStagePointerDown(event) {
    if (event.pointerType !== 'touch' || this.media.length < 2 || this.stageTransitioning) return;
    this.stagePointer = { id: event.pointerId, x: event.clientX, y: event.clientY };
    this.stage?.setPointerCapture?.(event.pointerId);
  }

  onStagePointerMove(event) {
    const pointer = this.stagePointer;
    if (!pointer || pointer.id !== event.pointerId) return;
    const deltaX = event.clientX - pointer.x;
    const deltaY = event.clientY - pointer.y;
    if (Math.abs(deltaX) <= Math.abs(deltaY)) return;
    event.preventDefault();
    const direction = deltaX < 0 ? 1 : -1;
    const target = this.prepareStagePreview(direction);
    const distance = Math.max(this.stage?.clientWidth || 0, 1);
    this.setDragOffset(this.media.find((item) => item.dataset.productMediaId === this.selectedId), deltaX);
    this.setDragOffset(target, direction * distance + deltaX);
  }

  onStagePointerUp(event) {
    const pointer = this.stagePointer;
    this.stagePointer = null;
    if (!pointer || pointer.id !== event.pointerId) return;
    const deltaX = event.clientX - pointer.x;
    const deltaY = event.clientY - pointer.y;
    if (Math.abs(deltaX) < 48 || Math.abs(deltaX) <= Math.abs(deltaY)) {
      if (Math.abs(deltaX) > 8 && Math.abs(deltaX) > Math.abs(deltaY)) this.suppressStageClick();
      this.snapBackStage();
      return;
    }
    this.suppressStageClick();
    this.transitionStage(deltaX < 0 ? 1 : -1, deltaX);
  }

  cancelStageSwipe() {
    this.stagePointer = null;
    this.snapBackStage();
  }

  suppressStageClick() {
    this.suppressStageOpen = true;
    window.setTimeout(() => { this.suppressStageOpen = false; }, 0);
  }

  stepSelected(direction) {
    const index = this.media.findIndex((item) => item.dataset.productMediaId === this.selectedId);
    const next = this.media[(index + direction + this.media.length) % this.media.length];
    this.select(next?.dataset.productMediaId);
  }

  prepareStagePreview(direction) {
    if (this.stageSwipeTarget && this.stageSwipeDirection === direction) return this.stageSwipeTarget;
    this.clearStagePreview();
    const index = this.media.findIndex((item) => item.dataset.productMediaId === this.selectedId);
    const target = this.media[(index + direction + this.media.length) % this.media.length];
    if (!target) return null;
    target.hidden = false;
    target.style.position = 'absolute';
    target.style.inset = '0';
    target.style.zIndex = '1';
    this.stageSwipeTarget = target;
    this.stageSwipeDirection = direction;
    return target;
  }

  clearStagePreview({ keepTarget = false } = {}) {
    const target = this.stageSwipeTarget;
    if (!target) return;
    if (!keepTarget) target.hidden = true;
    target.style.removeProperty('position');
    target.style.removeProperty('inset');
    target.style.removeProperty('z-index');
    target.style.removeProperty('transform');
    target.style.removeProperty('will-change');
    delete target.dataset.productGalleryOffset;
    this.stageSwipeTarget = null;
    this.stageSwipeDirection = null;
  }

  async snapBackStage() {
    const source = this.media.find((item) => item.dataset.productMediaId === this.selectedId);
    const target = this.stageSwipeTarget;
    if (!target) {
      this.snapBack(source);
      return;
    }
    const distance = Math.max(this.stage?.clientWidth || 0, 1);
    await Promise.all([
      this.snapBack(source),
      this.animateOffset(target, this.currentOffset(target), this.stageSwipeDirection * distance),
    ]);
    this.clearStagePreview();
  }

  async transitionStage(direction, offset = 0) {
    if (this.stageTransitioning) return;
    const source = this.media.find((item) => item.dataset.productMediaId === this.selectedId);
    const next = this.prepareStagePreview(direction);
    if (!source || !next) return;
    this.stageTransitioning = true;
    const distance = Math.max(this.stage?.clientWidth || 0, 1);
    const exitOffset = direction * -distance;
    await Promise.all([
      this.animateOffset(source, this.currentOffset(source) || offset, exitOffset),
      this.animateOffset(next, this.currentOffset(next) || direction * distance, 0),
    ]);
    this.select(next.dataset.productMediaId);
    this.clearStagePreview({ keepTarget: true });
    this.stageTransitioning = false;
  }

  onModalPointerDown(event) {
    if (event.pointerType !== 'touch' || this.media.length < 2 || this.modalTransitioning) return;
    if (event.target.closest('video, iframe, model-viewer, button, a, input')) return;
    this.modalPointer = { id: event.pointerId, x: event.clientX, y: event.clientY };
    this.dialogContent?.setPointerCapture?.(event.pointerId);
  }

  onModalPointerMove(event) {
    const pointer = this.modalPointer;
    if (!pointer || pointer.id !== event.pointerId) return;
    const deltaX = event.clientX - pointer.x;
    const deltaY = event.clientY - pointer.y;
    if (Math.abs(deltaX) <= Math.abs(deltaY)) return;
    event.preventDefault();
    const direction = deltaX < 0 ? 1 : -1;
    const target = this.prepareModalPreview(direction);
    const distance = Math.max(this.dialogContent?.clientWidth || 0, 1);
    this.setDragOffset(this.dialogContent?.firstElementChild, deltaX);
    this.setDragOffset(target, direction * distance + deltaX);
  }

  onModalPointerUp(event) {
    const pointer = this.modalPointer;
    this.modalPointer = null;
    if (!pointer || pointer.id !== event.pointerId) return;
    const deltaX = event.clientX - pointer.x;
    const deltaY = event.clientY - pointer.y;
    if (Math.abs(deltaX) < 48 || Math.abs(deltaX) <= Math.abs(deltaY)) {
      this.snapBackModal();
      return;
    }
    this.transitionModal(deltaX < 0 ? 1 : -1, deltaX);
  }

  cancelModalSwipe() {
    this.modalPointer = null;
    this.snapBackModal();
  }

  prepareModalPreview(direction) {
    if (this.modalSwipeTarget && this.modalSwipeDirection === direction) return this.modalSwipeTarget;
    this.clearModalPreview();
    const source = this.dialogContent?.firstElementChild;
    const index = this.media.findIndex((item) => item.dataset.productMediaId === this.modalSelectedId);
    const next = this.media[(index + direction + this.media.length) % this.media.length];
    if (!source || !next) return null;
    const target = next.cloneNode(true);
    target.removeAttribute('hidden');
    target.querySelector('[data-product-media-open]')?.remove();
    source.style.gridArea = '1 / 1';
    target.style.gridArea = '1 / 1';
    this.dialogContent.append(target);
    this.modalSwipeTarget = target;
    this.modalSwipeDirection = direction;
    return target;
  }

  clearModalPreview({ keepTarget = false } = {}) {
    const target = this.modalSwipeTarget;
    const source = this.dialogContent?.firstElementChild;
    source?.style.removeProperty('grid-area');
    if (!target) return;
    if (!keepTarget) target.remove();
    target.style.removeProperty('grid-area');
    target.style.removeProperty('transform');
    target.style.removeProperty('will-change');
    delete target.dataset.productGalleryOffset;
    this.modalSwipeTarget = null;
    this.modalSwipeDirection = null;
  }

  async snapBackModal() {
    const source = this.dialogContent?.firstElementChild;
    const target = this.modalSwipeTarget;
    if (!target) {
      this.snapBack(source);
      return;
    }
    const distance = Math.max(this.dialogContent?.clientWidth || 0, 1);
    await Promise.all([
      this.snapBack(source),
      this.animateOffset(target, this.currentOffset(target), this.modalSwipeDirection * distance),
    ]);
    this.clearModalPreview();
  }

  setDragOffset(element, offset) {
    if (!element) return;
    element.style.transform = `translate3d(${offset}px, 0, 0)`;
    element.style.willChange = 'transform';
    element.dataset.productGalleryOffset = String(offset);
  }

  async snapBack(element) {
    if (!element) return;
    const offset = this.currentOffset(element);
    await this.animateOffset(element, offset, 0);
  }

  currentOffset(element) {
    const offset = Number(element.dataset.productGalleryOffset);
    return Number.isFinite(offset) ? offset : 0;
  }

  async animateOffset(element, from, to) {
    if (!element) return;
    const apply = (offset) => {
      element.style.transform = `translate3d(${offset}px, 0, 0)`;
      element.dataset.productGalleryOffset = String(offset);
    };
    apply(from);
    if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches && typeof element.animate === 'function') {
      const animation = element.animate(
        [{ transform: `translate3d(${from}px, 0, 0)` }, { transform: `translate3d(${to}px, 0, 0)` }],
        { duration: 220, easing: 'cubic-bezier(.22, .61, .36, 1)', fill: 'both' },
      );
      await animation.finished.catch(() => {});
      animation.cancel();
    }
    apply(to);
    if (to === 0) {
      element.style.removeProperty('transform');
      element.style.removeProperty('will-change');
      delete element.dataset.productGalleryOffset;
    }
  }

  async transitionModal(direction, offset = 0) {
    if (this.modalTransitioning) return;
    const source = this.dialogContent?.firstElementChild;
    const index = this.media.findIndex((item) => item.dataset.productMediaId === this.modalSelectedId);
    const nextIndex = (index + direction + this.media.length) % this.media.length;
    const next = this.media[nextIndex];
    if (!source || !next) return;
    this.modalTransitioning = true;
    const distance = Math.max(this.dialogContent?.clientWidth || 0, 1);
    const incoming = this.prepareModalPreview(direction);
    if (!incoming) {
      this.modalTransitioning = false;
      return;
    }
    await Promise.all([
      this.animateOffset(source, this.currentOffset(source) || offset, direction * -distance),
      this.animateOffset(incoming, this.currentOffset(incoming) || direction * distance, 0),
    ]);
    this.pauseModalPlayback(source);
    this.modalSelectedId = next.dataset.productMediaId;
    this.dialogContent.replaceChildren(incoming);
    this.clearModalPreview({ keepTarget: true });
    this.enableHoverZoom(incoming.querySelector('img'));
    this.setDialogAspect(incoming);
    if (this.count) this.count.textContent = `${nextIndex + 1} / ${this.media.length}`;
    this.modalTransitioning = false;
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

  pauseModalPlayback(root = this.dialogContent) {
    root?.querySelectorAll('video').forEach((video) => video.pause());
  }

  setDialogAspect(clone) {
    const playableMedia = clone.querySelector('video, iframe');
    if (playableMedia) {
      this.dialog?.setAttribute('data-product-gallery-media-type', 'video');
      const fallbackAspect = Number.parseFloat(clone.dataset.productMediaRatio) || 16 / 9;
      // Size before metadata arrives. This prevents the browser's native video
      // dimensions from briefly expanding the dialog to an oversized frame.
      this.sizeDialog(fallbackAspect);
      const setVideoAspect = () => {
        if (playableMedia.videoWidth && playableMedia.videoHeight) this.sizeDialog(playableMedia.videoWidth / playableMedia.videoHeight);
      };
      if (playableMedia.readyState >= HTMLMediaElement.HAVE_METADATA) setVideoAspect();
      else if (playableMedia instanceof HTMLVideoElement) playableMedia.addEventListener('loadedmetadata', setVideoAspect, { once: true });
      return;
    }
    const image = clone.querySelector('img');
    if (image) {
      this.dialog?.removeAttribute('data-product-gallery-media-type');
      const setImageAspect = () => {
        if (image.naturalWidth && image.naturalHeight) this.sizeDialog(image.naturalWidth / image.naturalHeight);
      };
      if (image.complete) setImageAspect();
      else image.addEventListener('load', setImageAspect, { once: true });
      return;
    }
    this.dialog?.removeAttribute('data-product-gallery-media-type');
    this.sizeDialog(16 / 9);
  }

  sizeDialog(aspect) {
    this.mediaAspect = aspect;
    const isVideo = this.dialog?.dataset.productGalleryMediaType === 'video';
    const viewportHeight = window.visualViewport?.height || window.innerHeight;
    const maxWidth = window.innerWidth * 0.88;
    // Reserve comfortable breathing room around portrait media. The gallery
    // toolbar lives inside this frame, so it remains visible above browser and
    // Theme Editor viewport chrome instead of falling below the dialog.
    const maxHeight = viewportHeight * (isVideo ? 0.56 : 0.78);
    const width = Math.min(maxWidth, maxHeight * aspect);
    const height = width / aspect;
    this.dialog.style.inlineSize = `${Math.floor(width)}px`;
    this.dialog.style.blockSize = `${Math.floor(height)}px`;
    this.dialog.style.marginBlockStart = `${Math.max(8, Math.floor((viewportHeight - height) / 2))}px`;
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
    window.overlayMotionController?.captureScrollbarCompensation();
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

  step(direction, focusTarget = null) {
    const index = this.media.findIndex((item) => item.dataset.productMediaId === this.modalSelectedId);
    this.pauseModalPlayback();
    this.modalSelectedId = this.media[(index + direction + this.media.length) % this.media.length]?.dataset.productMediaId;
    this.renderModalMedia();
    focusTarget?.focus({ preventScroll: true });
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
    window.overlayMotionController?.captureScrollbarCompensation();
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
