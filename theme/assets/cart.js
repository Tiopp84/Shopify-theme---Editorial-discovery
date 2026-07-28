class CartStore extends EventTarget {
  constructor(source) {
    super();
    this.configure(source);
    this.lines = new Map();
    this.confirmed = new Map();
    this.dirty = new Map();
    this.note = source.dataset.cartNote || '';
    this.confirmedNote = this.note;
    this.noteDirty = false;
    this.noteState = 'saved';
    this.revision = 0;
    this.discountCents = Number(source.dataset.cartDiscountCents) || 0;
    this.serverTotalCents = Number(source.dataset.cartTotalCents) || 0;
  }

  configure(source) {
    this.cartUrl ||= source.dataset.cartUrl;
    this.currency ||= source.dataset.cartCurrency || 'USD';
  }

  register(lines, source, replace = false) {
    this.configure(source);
    const serverNote = source.dataset.cartNote || '';
    if (!this.noteDirty) {
      this.note = serverNote;
      this.confirmedNote = serverNote;
      this.noteState = 'saved';
    }
    if (!this.lines.size || replace) {
      this.lines = new Map(lines.map((line) => [line.key, { ...line }]));
      this.confirmed = new Map(lines.map((line) => [line.key, line.quantity]));
      this.dirty.clear();
    } else {
      lines.forEach((line) => {
        const current = this.lines.get(line.key);
        if (!current) {
          this.lines.set(line.key, { ...line });
          this.confirmed.set(line.key, line.quantity);
        } else if (!this.dirty.has(line.key)) {
          this.lines.set(line.key, { ...current, ...line });
          this.confirmed.set(line.key, line.quantity);
        }
      });
    }
    this.discountCents = Number(source.dataset.cartDiscountCents) || this.discountCents;
    this.serverTotalCents = Number(source.dataset.cartTotalCents) || this.serverTotalCents;
    this.emit('register');
  }

  snapshot(message = '') {
    const lines = [...this.lines.values()].map((line) => ({ ...line }));
    const count = lines.reduce((sum, line) => sum + line.quantity, 0);
    const totalCents = Math.max(0, lines.reduce((sum, line) => sum + line.unitPrice * line.quantity, 0) - this.discountCents);
    return { lines, count, totalCents, note: this.note, noteState: this.noteState, pending: this.hasPending() || Boolean(this.controller), message };
  }

  hasPending() { return this.dirty.size > 0 || this.noteDirty; }

  setQuantity(key, quantity, immediate = false) {
    const line = this.lines.get(key);
    if (!line) return;
    const requested = Math.max(0, Math.floor(Number(quantity) || 0));
    const value = requested;
    this.revision += 1;
    line.quantity = value;
    if (value === this.confirmed.get(key)) this.dirty.delete(key);
    else this.dirty.set(key, value);
    this.emit('local', '', null, key);
    if (immediate) this.flush();
    else this.schedule();
  }

  setNote(note) {
    this.revision += 1;
    this.note = note;
    this.noteDirty = note !== this.confirmedNote;
    this.noteState = this.noteDirty ? 'saving' : 'saved';
    this.emit('note');
    if (this.noteDirty) this.schedule();
  }

  schedule(delay = 650) {
    clearTimeout(this.timer);
    if (!this.hasPending()) return;
    this.emit('pending', 'Cart will update shortly.');
    this.timer = setTimeout(() => this.flush(), delay);
  }

  async flush() {
    clearTimeout(this.timer);
    if (this.controller || !this.hasPending()) return;
    const lineMutation = this.dirty.size > 0;
    const [key, quantity] = lineMutation ? this.dirty.entries().next().value : [];
    const noteAtSend = this.note;
    const revisionAtSend = this.revision;
    this.controller = new AbortController();
    this.emit('pending', 'Updating cart.');
    try {
      const response = await fetch(`${this.cartUrl}/${lineMutation ? 'change' : 'update'}.js`, {
        method: 'POST',
        signal: this.controller.signal,
        headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...(lineMutation ? { id: key, quantity } : { note: noteAtSend }),
        }),
      });
      if (!response.ok) {
        const error = await response.json().catch(() => null);
        throw new Error(error?.description || 'Cart update failed');
      }
      const cart = await response.json();
      if (lineMutation) {
        this.confirmLine(cart, key, quantity);
      } else if (this.note === noteAtSend) {
        this.confirmedNote = cart.note || noteAtSend;
        this.note = this.confirmedNote;
        this.noteDirty = false;
        this.noteState = 'saved';
      }
      const pricingChanged = !this.hasPending() && this.reconcilePricing(cart);
      let renderServerCart = pricingChanged;
      if (renderServerCart) {
        const section = await this.readDrawerSection(this.controller.signal).catch(() => null);
        renderServerCart = this.revision === revisionAtSend && !this.hasPending();
        if (renderServerCart && section) cart.sections = { 'cart-drawer': section };
      }
      this.emit(renderServerCart ? 'server' : 'confirmed', lineMutation ? 'Cart updated.' : '', renderServerCart ? cart : null);
    } catch (error) {
      if (error.name !== 'AbortError' && lineMutation) {
        const cart = await this.readCart();
        if (cart) {
          this.confirmLine(cart, key, quantity);
          this.reconcilePricing(cart);
          this.emit('error', error.message || 'Cart update failed.', null, key);
        } else if (this.lines.get(key)?.quantity === quantity) {
          this.lines.get(key).quantity = this.confirmed.get(key) || 0;
          this.dirty.delete(key);
          this.emit('error', `${error.message || 'Cart update failed.'} The last confirmed quantities were restored.`, null, key);
        }
      } else if (error.name !== 'AbortError' && !lineMutation && this.note === noteAtSend) {
        this.noteDirty = false;
        this.noteState = 'error';
        this.emit('note-error');
      }
    } finally {
      this.controller = null;
      this.emit('settled');
      if (this.hasPending()) this.schedule(0);
    }
  }

  reconcilePricing(cart) {
    const serverLines = new Map((cart.items || []).map((item) => [item.key, item]));
    const previousTotal = this.snapshot().totalCents;
    const previousDiscount = this.discountCents;
    let linePriceChanged = false;
    this.lines.forEach((line, key) => {
      const serverLine = serverLines.get(key);
      if (!serverLine) return;
      if (line.unitPrice !== Number(serverLine.final_price) || line.compareUnitPrice !== Number(serverLine.original_price || line.compareUnitPrice)) linePriceChanged = true;
      line.unitPrice = Number(serverLine.final_price);
      line.compareUnitPrice = Number(serverLine.original_price || line.compareUnitPrice);
    });
    this.discountCents = (cart.cart_level_discount_applications || []).reduce((sum, discount) => sum + Number(discount.total_allocated_amount || 0), 0);
    this.serverTotalCents = Number(cart.total_price) || 0;
    return linePriceChanged || previousDiscount !== this.discountCents || previousTotal !== this.serverTotalCents;
  }

  confirmLine(cart, key, requestedQuantity) {
    const serverLine = cart.items.find((item) => item.key === key);
    const confirmedQuantity = serverLine?.quantity || 0;
    this.confirmed.set(key, confirmedQuantity);
    if (this.lines.get(key)?.quantity === requestedQuantity) {
      this.lines.get(key).quantity = confirmedQuantity;
      this.dirty.delete(key);
    }
  }

  async readCart() {
    try {
      const response = await fetch(`${this.cartUrl}.js`, { headers: { Accept: 'application/json' } });
      return response.ok ? response.json() : null;
    } catch (_) {
      return null;
    }
  }

  async readDrawerSection(signal) {
    const url = new URL(this.cartUrl, window.location.origin);
    url.searchParams.set('sections', 'cart-drawer');
    const response = await fetch(url, { signal, headers: { Accept: 'application/json' } });
    if (!response.ok) return null;
    const sections = await response.json();
    return sections?.['cart-drawer'] || null;
  }

  replaceFromCart(cart) {
    const previous = this.lines;
    this.lines = new Map((cart.items || []).map((item) => {
      const old = previous.get(item.key) || {};
      return [item.key, {
        key: item.key,
        quantity: item.quantity,
        unitPrice: Number(item.final_price),
        compareUnitPrice: Number(item.original_price || old.compareUnitPrice || 0),
        variantId: item.variant_id,
      }];
    }));
    this.confirmed = new Map([...this.lines].map(([key, line]) => [key, line.quantity]));
    this.dirty.clear();
    this.confirmedNote = cart.note || '';
    if (!this.noteDirty) this.note = this.confirmedNote;
    this.noteState = this.noteDirty ? 'saving' : 'saved';
    this.discountCents = (cart.cart_level_discount_applications || []).reduce((sum, discount) => sum + Number(discount.total_allocated_amount || 0), 0);
    this.serverTotalCents = Number(cart.total_price) || 0;
  }

  emit(reason, message = '', cart = null, lineKey = null) {
    const detail = { ...this.snapshot(message), reason, cart, lineKey };
    this.dispatchEvent(new CustomEvent('change', { detail }));
    document.querySelectorAll('[data-cart-count]').forEach((node) => { node.textContent = detail.count; node.hidden = detail.count === 0; });
    const quantities = detail.lines.reduce((result, line) => {
      if (line.variantId) result[line.variantId] = (result[line.variantId] || 0) + line.quantity;
      return result;
    }, {});
    window.dispatchEvent(new CustomEvent('cart:state', { detail: { quantities } }));
  }

  formatMoney(cents, withCode = false) {
    return new Intl.NumberFormat(document.documentElement.lang || 'en', { style: 'currency', currency: this.currency, currencyDisplay: withCode ? 'code' : 'narrowSymbol' }).format(Number(cents) / 100);
  }
}

function cartStore(source) {
  window.themeCartStore ||= new CartStore(source);
  window.themeCartStore.configure(source);
  return window.themeCartStore;
}

function linesFrom(root, selector) {
  return [...root.querySelectorAll(selector)].map((line) => ({
    key: line.dataset.cartLine || line.dataset.cartPageLine,
    quantity: Number(line.dataset.cartQuantity),
    unitPrice: Number(line.dataset.cartUnitPrice),
    compareUnitPrice: Number(line.dataset.cartCompareUnitPrice),
    variantId: line.dataset.cartVariantId,
  }));
}

class CartDrawer extends HTMLElement {
  connectedCallback() {
    if (this.abortController) return;
    this.abortController = new AbortController();
    const { signal } = this.abortController;
    this.dialog = this.querySelector('[data-cart-dialog]');
    this.status = this.querySelector('[data-cart-status]');
    this.store = cartStore(this);
    this.store.register(linesFrom(this, '[data-cart-line]'), this);
    this.onStoreChange = (event) => this.renderStore(event.detail);
    this.store.addEventListener('change', this.onStoreChange, { signal });
    this.renderStore({ ...this.store.snapshot(), reason: 'register' });
    document.addEventListener('click', (event) => this.onClick(event), { signal });
    document.addEventListener('change', (event) => this.onChange(event), { signal });
    this.addEventListener('keydown', (event) => this.onKeydown(event), { signal });
    document.addEventListener('submit', (event) => this.onSubmit(event), { signal });
    this.querySelector('[data-cart-close]')?.addEventListener('click', () => this.dialog.close(), { signal });
    this.dialog?.addEventListener('click', (event) => { if (event.target === this.dialog) this.dialog.close(); }, { signal });
    this.dialog?.addEventListener('close', () => this.opener?.focus({ preventScroll: true }), { signal });
  }

  disconnectedCallback() {
    this.abortController?.abort();
    this.addController?.abort();
    this.abortController = null;
  }

  onClick(event) {
    const opener = event.target.closest('[data-cart-open]');
    if (opener && this.open(opener)) { event.preventDefault(); return; }
    const remove = event.target.closest('[data-cart-remove]');
    if (remove && this.contains(remove)) { this.store.setQuantity(remove.dataset.cartKey, 0, true); return; }
    const step = event.target.closest('[data-cart-quantity-step]');
    if (step && this.contains(step)) {
      const input = this.querySelector(`#${CSS.escape(step.dataset.cartQuantityInput)}`);
      if (input) this.store.setQuantity(step.dataset.cartKey, (Number(input.value) || 0) + Number(step.dataset.cartQuantityStep));
    }
  }

  onChange(event) {
    const input = event.target.closest('[data-cart-quantity]');
    if (input && this.contains(input)) this.store.setQuantity(input.dataset.cartKey, input.value);
  }

  onKeydown(event) {
    const input = event.target.closest('[data-cart-quantity]');
    if (event.key !== 'Enter' || event.isComposing || !input || !this.contains(input)) return;
    event.preventDefault();
    this.store.setQuantity(input.dataset.cartKey, input.value, true);
  }

  onSubmit(event) {
    if (event.target.matches('[data-product-form] form')) { event.preventDefault(); this.add(event.target); }
    const form = event.target.closest('[data-cart-form]');
    if (!form || !this.contains(form) || event.submitter?.name === 'checkout') return;
    event.preventDefault();
    const input = document.activeElement?.closest('[data-cart-quantity]');
    if (input && form.contains(input)) this.store.setQuantity(input.dataset.cartKey, input.value, true);
  }

  open(opener) {
    if (!this.dialog || typeof this.dialog.showModal !== 'function') return false;
    this.opener = opener;
    if (!this.dialog.open) this.dialog.showModal();
    this.querySelector('[data-cart-close]')?.focus({ preventScroll: true });
    return true;
  }

  renderStore(detail) {
    if (detail.reason === 'server' && detail.cart) {
      const section = detail.cart.sections?.['cart-drawer'];
      if (this.hydrate(section)) return;
      this.renderCart(detail.cart);
      return;
    }
    detail.lines.forEach((state) => {
      const line = this.querySelector(`[data-cart-line="${CSS.escape(state.key)}"]`);
      if (!line) return;
      line.hidden = state.quantity === 0;
      line.dataset.cartQuantity = state.quantity;
      line.querySelector('[data-cart-quantity]')?.setAttribute('value', state.quantity);
      const input = line.querySelector('[data-cart-quantity]');
      if (input) input.value = state.quantity;
      line.querySelector('[data-cart-line-total]')?.replaceChildren(document.createTextNode(this.store.formatMoney(state.unitPrice * state.quantity)));
      const compare = line.querySelector('[data-cart-line-compare]');
      if (compare) compare.replaceChildren(document.createTextNode(this.store.formatMoney(state.compareUnitPrice * state.quantity)));
      line.querySelector('[data-cart-quantity-step="-1"]')?.toggleAttribute('disabled', state.quantity <= 0);
      line.querySelector('[data-cart-quantity-step="1"]')?.removeAttribute('disabled');
    });
    this.querySelector('[data-cart-subtotal]')?.replaceChildren(document.createTextNode(this.store.formatMoney(detail.totalCents, true)));
    this.querySelector('[data-cart-note]')?.setAttribute('value', detail.note);
    this.toggleAttribute('data-cart-pending', detail.pending);
    this.setCheckoutPending(detail.pending);
    this.renderEmpty(detail.count === 0);
    if (detail.reason === 'error' && detail.message && detail.lineKey) {
      this.setLineError(detail.lineKey, detail.message);
      this.status.hidden = true;
    } else if (detail.reason === 'error' && detail.message) {
      this.status.textContent = detail.message;
      this.status.hidden = false;
    } else if (detail.reason === 'local') {
      if (detail.lineKey) this.clearLineError(detail.lineKey);
      this.status.hidden = true;
    }
  }

  setLineError(key, message) {
    const line = this.querySelector(`[data-cart-line="${CSS.escape(key)}"]`);
    const details = line?.querySelector('.cart-drawer__line-details');
    if (!details) return;
    let error = details.querySelector('[data-cart-line-error]');
    if (!error) {
      error = document.createElement('p');
      error.className = 'cart-drawer__line-error';
      error.dataset.cartLineError = '';
      error.setAttribute('role', 'alert');
      details.append(error);
    }
    error.textContent = message;
  }

  clearLineError(key) {
    this.querySelector(`[data-cart-line="${CSS.escape(key)}"] [data-cart-line-error]`)?.remove();
  }

  setCheckoutPending(pending) {
    this.querySelectorAll('[name="checkout"], .shopify-payment-button__button').forEach((control) => {
      if (control.matches('[name="checkout"]')) {
        if (pending && !control.hasAttribute('data-cart-checkout-loading')) {
          control.dataset.cartCheckoutLabel = control.textContent;
          control.textContent = this.dataset.cartUpdatingLabel;
          control.dataset.cartCheckoutLoading = '';
        } else if (!pending && control.hasAttribute('data-cart-checkout-loading')) {
          control.textContent = control.dataset.cartCheckoutLabel;
          delete control.dataset.cartCheckoutLabel;
          delete control.dataset.cartCheckoutLoading;
        }
      }
      control.disabled = pending;
      control.setAttribute('aria-disabled', String(pending));
      control.setAttribute('aria-busy', String(pending));
    });
  }

  renderEmpty(empty) {
    const form = this.querySelector('[data-cart-form]');
    const localEmpty = this.querySelector('[data-cart-local-empty]');
    if (form && localEmpty) { form.hidden = empty; localEmpty.hidden = !empty; }
  }

  hydrate(html) {
    if (!html) return false;
    const fresh = new DOMParser().parseFromString(html, 'text/html').querySelector('[data-cart-drawer]');
    const content = fresh?.querySelector('[data-cart-content]');
    if (!content) return false;
    this.dataset.cartDiscountCents = fresh.dataset.cartDiscountCents || '0';
    this.querySelector('[data-cart-content]').innerHTML = content.innerHTML;
    this.store.register(linesFrom(this, '[data-cart-line]'), this, true);
    return true;
  }

  renderCart(cart) {
    const content = this.querySelector('[data-cart-content]');
    if (!cart.items?.length) { content.innerHTML = this.emptyStateHtml(); this.store.register([], this, true); return; }
    content.innerHTML = `${this.cartFormHtml(cart)}${this.emptyStateHtml(true)}`;
    this.store.register(linesFrom(this, '[data-cart-line]'), this, true);
  }

  emptyStateHtml(local = false) {
    return `<div class="cart-drawer__empty"${local ? ' data-cart-local-empty hidden' : ''}><p>${this.escape(this.dataset.cartEmptyText)}</p><a href="/collections/all">${this.escape(this.dataset.cartContinueShopping)}</a></div>`;
  }

  cartFormHtml(cart) {
    return `<form action="${this.escape(this.dataset.cartUrl)}" method="post" data-cart-form><input type="hidden" name="note" value="${this.escape(this.store.note)}" data-cart-note><div class="cart-drawer__lines">${cart.items.map((item, index) => this.lineHtml(item, index)).join('')}</div>${this.cartFooterHtml(cart)}</form>`;
  }

  cartFooterHtml(cart) {
    return `<footer class="cart-drawer__footer">${this.cartDiscountHtml(cart)}<p class="cart-drawer__subtotal"><span>${this.escape(this.dataset.cartSubtotalLabel)}</span><strong data-cart-subtotal>${this.store.formatMoney(cart.total_price, true)}</strong></p><p class="cart-drawer__checkout-note">${this.escape(this.dataset.cartTaxesNote)}</p><button type="submit" name="checkout">${this.escape(this.dataset.cartCheckoutLabel)}</button><a href="${this.escape(this.dataset.cartUrl)}">${this.escape(this.dataset.cartViewCart)}</a></footer>`;
  }

  lineHtml(item, index) {
    const id = `DrawerQuantity-${index}`;
    const compare = Number(item.compare_at_price || item.original_price || 0);
    return `<article class="cart-drawer__line" data-cart-line="${this.escape(item.key)}" data-cart-variant-id="${item.variant_id}" data-cart-quantity="${item.quantity}" data-cart-unit-price="${item.final_price}" data-cart-compare-unit-price="${compare}"><a href="${this.escape(item.url)}">${item.image ? `<img src="${this.escape(item.image)}" alt="${this.escape(item.product_title)}">` : ''}</a><div class="cart-drawer__line-details">${this.lineDetailsHtml(item)}<div class="cart-drawer__line-actions"><label class="visually-hidden" for="${id}">Quantity</label><div class="cart-drawer__quantity-control"><button type="button" aria-label="${this.escape(this.dataset.cartDecreaseLabel)}" data-cart-quantity-step="-1" data-cart-key="${this.escape(item.key)}" data-cart-quantity-input="${id}">−</button><input id="${id}" type="number" name="updates[]" value="${item.quantity}" min="0" step="1" data-cart-quantity data-cart-key="${this.escape(item.key)}"><button type="button" aria-label="${this.escape(this.dataset.cartIncreaseLabel)}" data-cart-quantity-step="1" data-cart-key="${this.escape(item.key)}" data-cart-quantity-input="${id}">+</button></div><button type="button" aria-label="${this.escape(this.dataset.cartRemoveLabel)}" data-cart-remove data-cart-key="${this.escape(item.key)}"><svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 7h14M10 11v6M14 11v6M6 7l1 14h10l1-14M9 7V4h6v3"/></svg></button></div></div><div class="cart-drawer__line-price">${this.linePriceHtml(item, compare)}</div></article>`;
  }

  lineDetailsHtml(item) {
    const variant = item.variant_title && item.variant_title !== 'Default Title' ? `<p>${this.escape(item.variant_title)}</p>` : '';
    const sellingPlan = item.selling_plan_allocation?.selling_plan?.name ? `<p>${this.escape(item.selling_plan_allocation.selling_plan.name)}</p>` : '';
    const properties = Object.entries(item.properties || {}).filter(([, value]) => value !== '').map(([name, value]) => `<p>${this.escape(name)}: ${this.escape(value)}</p>`).join('');
    const discounts = (item.line_level_discount_allocations || []).map((discount) => `<li>${this.escape(discount.discount_application?.title)} (−${this.store.formatMoney(discount.amount)})</li>`).join('');
    return `<a href="${this.escape(item.url)}">${this.escape(item.product_title)}</a>${variant}${sellingPlan}${properties}${discounts ? `<ul class="cart-drawer__discounts" role="list">${discounts}</ul>` : ''}`;
  }

  linePriceHtml(item, compareUnitPrice) {
    const compare = compareUnitPrice * item.quantity > Number(item.final_line_price) ? `<s data-cart-line-compare>${this.store.formatMoney(compareUnitPrice * item.quantity)}</s>` : '';
    const measurement = item.unit_price_measurement ? `<small>${this.store.formatMoney(item.unit_price)} / ${this.escape(item.unit_price_measurement.reference_unit)}</small>` : '';
    return `${compare}<strong data-cart-line-total>${this.store.formatMoney(item.final_line_price)}</strong><small data-cart-unit-price>${this.store.formatMoney(item.final_price)} ${this.escape(this.dataset.cartEachLabel)}</small>${measurement}`;
  }

  cartDiscountHtml(cart) {
    const discounts = cart.cart_level_discount_applications || [];
    return discounts.length ? `<ul class="cart-drawer__discounts" role="list">${discounts.map((discount) => `<li>${this.escape(discount.title)} (−${this.store.formatMoney(discount.total_allocated_amount)})</li>`).join('')}</ul>` : '';
  }

  async add(form) {
    this.addController?.abort();
    this.addController = new AbortController();
    this.opener = document.activeElement;
    const productForm = form.closest('product-form');
    const quickAdd = form.closest('quick-add');
    const productError = productForm?.querySelector('[data-product-selection-error]') || quickAdd?.querySelector('[data-quick-add-error]');
    if (productError) {
      productError.textContent = '';
      productError.hidden = true;
    }
    try {
      const validator = productForm || quickAdd;
      if (validator && !(await validator.validateAdd())) return;
      const body = new FormData(form);
      body.set('sections', 'cart-drawer');
      body.set('sections_url', `${window.location.pathname}${window.location.search}`);
      const response = await fetch(`${this.dataset.cartUrl}/add.js`, { method: 'POST', body, signal: this.addController.signal, headers: { Accept: 'application/json' } });
      if (!response.ok) {
        const error = await response.json().catch(() => null);
        const message = error?.description || 'Item could not be added to cart.';
        // Shopify can reject the request after accepting the quantity that was
        // available. Refresh its authoritative state, but keep the shopper on
        // the PDP so the availability message is visible where they acted.
        const cart = await this.store.readCart();
        if (cart) {
          this.store.replaceFromCart(cart);
          this.renderCart(cart);
          this.store.emit('error', message, cart);
        }
        throw new Error(message);
      }
      const added = await response.json();
      const cartResponse = await fetch(`${this.dataset.cartUrl}.js`, { headers: { Accept: 'application/json' } });
      if (!cartResponse.ok) throw new Error('Cart state request failed');
      const cart = await cartResponse.json();
      cart.sections = added.sections;
      this.store.replaceFromCart(cart);
      this.store.emit('server', 'Item added to cart.', cart);
      if (cart.item_count > 0) this.open(this.opener);
    } catch (error) {
      if (error.name !== 'AbortError') {
        this.status.textContent = error.message || 'Item could not be added to cart. Please try again.';
        this.status.hidden = false;
        if (productError) {
          productError.textContent = this.status.textContent;
          productError.hidden = false;
        }
      }
    } finally {
      this.addController = null;
    }
  }

  escape(value) { const node = document.createElement('span'); node.textContent = value || ''; return node.innerHTML; }
}

class CartPage extends HTMLElement {
  connectedCallback() {
    if (this.abortController) return;
    this.abortController = new AbortController();
    const { signal } = this.abortController;
    this.store = cartStore(this);
    this.store.register(linesFrom(this, '[data-cart-page-line]'), this);
    this.onStoreChange = (event) => this.renderStore(event.detail);
    this.store.addEventListener('change', this.onStoreChange, { signal });
    this.renderStore({ ...this.store.snapshot(), reason: 'register' });
    this.querySelectorAll('[data-cart-page-quantity-step]').forEach((button) => { button.hidden = false; });
    this.querySelector('[name="update"]')?.setAttribute('hidden', '');
    this.addEventListener('click', (event) => this.onClick(event), { signal });
    this.addEventListener('change', (event) => this.onChange(event), { signal });
    this.addEventListener('keydown', (event) => this.onKeydown(event), { signal });
    this.addEventListener('submit', (event) => this.onSubmit(event), { signal });
    this.addEventListener('input', (event) => {
      if (event.target.matches('[data-cart-note-input]')) this.store.setNote(event.target.value);
    }, { signal });
  }

  disconnectedCallback() { this.abortController?.abort(); this.abortController = null; }

  onClick(event) {
    const remove = event.target.closest('[data-cart-page-remove]');
    if (remove && this.contains(remove)) { event.preventDefault(); this.store.setQuantity(remove.dataset.cartKey, 0, true); return; }
    const step = event.target.closest('[data-cart-page-quantity-step]');
    if (!step || !this.contains(step)) return;
    const input = this.querySelector(`#${CSS.escape(step.dataset.cartPageQuantityInput)}`);
    if (input) this.store.setQuantity(input.dataset.cartKey, (Number(input.value) || 0) + Number(step.dataset.cartPageQuantityStep));
  }

  onChange(event) {
    const input = event.target.closest('[data-cart-page-quantity]');
    if (input && this.contains(input)) this.store.setQuantity(input.dataset.cartKey, input.value);
  }

  onKeydown(event) {
    const input = event.target.closest('[data-cart-page-quantity]');
    if (event.key !== 'Enter' || event.isComposing || !input || !this.contains(input)) return;
    event.preventDefault();
    this.store.setQuantity(input.dataset.cartKey, input.value, true);
  }

  onSubmit(event) {
    const form = event.target.closest('.main-cart__form');
    if (!form || !this.contains(form) || event.submitter?.name === 'checkout') return;
    event.preventDefault();
    const input = document.activeElement?.closest('[data-cart-page-quantity]');
    if (input && form.contains(input)) this.store.setQuantity(input.dataset.cartKey, input.value, true);
  }

  renderStore(detail) {
    detail.lines.forEach((state) => {
      const line = this.querySelector(`[data-cart-page-line="${CSS.escape(state.key)}"]`);
      if (!line) return;
      line.hidden = state.quantity === 0;
      line.dataset.cartQuantity = state.quantity;
      const input = line.querySelector('[data-cart-page-quantity]');
      if (input) input.value = state.quantity;
      line.querySelector('[data-cart-page-quantity-step="-1"]')?.toggleAttribute('disabled', state.quantity <= 0);
      line.querySelector('[data-cart-page-quantity-step="1"]')?.removeAttribute('disabled');
      line.querySelector('[data-cart-page-line-total]')?.replaceChildren(document.createTextNode(this.store.formatMoney(state.unitPrice * state.quantity)));
      const compare = line.querySelector('[data-cart-page-line-compare]');
      if (compare) compare.replaceChildren(document.createTextNode(this.store.formatMoney(state.compareUnitPrice * state.quantity)));
    });
    this.querySelector('[data-cart-page-subtotal]')?.replaceChildren(document.createTextNode(this.store.formatMoney(detail.totalCents, true)));
    const itemCount = this.querySelector('[data-cart-page-item-count]');
    if (itemCount) itemCount.textContent = itemCount.dataset.cartPageItemCountTemplate.replace('__count__', detail.count);
    const note = this.querySelector('[data-cart-note-input]');
    if (note && document.activeElement !== note) note.value = detail.note;
    const noteStatus = this.querySelector('[data-cart-note-status]');
    if (noteStatus) {
      const messages = { saving: this.dataset.cartNoteSavingMessage, saved: this.dataset.cartNoteSavedMessage, error: this.dataset.cartNoteErrorMessage };
      noteStatus.textContent = detail.reason === 'register' ? '' : messages[detail.noteState] || '';
    }
    const form = this.querySelector('form');
    const empty = this.querySelector('[data-cart-page-empty]');
    if (form && empty) { form.hidden = detail.count === 0; empty.hidden = detail.count !== 0; }
    this.setCheckoutPending(detail.pending);
    const status = this.querySelector('[data-cart-page-status]');
    if (detail.reason === 'error' && detail.lineKey) {
      this.setLineError(detail.lineKey, detail.message);
      if (status) status.hidden = true;
    } else if (status && detail.reason === 'error') {
      status.textContent = detail.message;
      status.hidden = false;
    } else if (status && detail.reason === 'local') {
      if (detail.lineKey) this.clearLineError(detail.lineKey);
      status.hidden = true;
    }
  }

  setLineError(key, message) {
    const line = this.querySelector(`[data-cart-page-line="${CSS.escape(key)}"]`);
    const details = line?.querySelector('.main-cart__line-details');
    if (!details) return;
    let error = details.querySelector('[data-cart-page-line-error]');
    if (!error) {
      error = document.createElement('p');
      error.className = 'main-cart__line-error';
      error.dataset.cartPageLineError = '';
      error.setAttribute('role', 'alert');
      details.append(error);
    }
    error.textContent = message;
  }

  clearLineError(key) {
    this.querySelector(`[data-cart-page-line="${CSS.escape(key)}"] [data-cart-page-line-error]`)?.remove();
  }

  setCheckoutPending(pending) {
    this.querySelectorAll('[name="checkout"], .shopify-payment-button__button').forEach((control) => {
      if (control.matches('[name="checkout"]')) {
        if (pending && !control.hasAttribute('data-cart-checkout-loading')) {
          control.dataset.cartCheckoutLabel = control.textContent;
          control.textContent = this.dataset.cartUpdatingLabel;
          control.dataset.cartCheckoutLoading = '';
        } else if (!pending && control.hasAttribute('data-cart-checkout-loading')) {
          control.textContent = control.dataset.cartCheckoutLabel;
          delete control.dataset.cartCheckoutLabel;
          delete control.dataset.cartCheckoutLoading;
        }
      }
      control.disabled = pending;
      control.setAttribute('aria-disabled', String(pending));
      control.setAttribute('aria-busy', String(pending));
    });
  }

}

if (!customElements.get('cart-drawer')) customElements.define('cart-drawer', CartDrawer);
if (!customElements.get('cart-page')) customElements.define('cart-page', CartPage);
