class CartDrawer extends HTMLElement {
  connectedCallback() {
    if (this.abortController) return;
    this.abortController = new AbortController();
    const { signal } = this.abortController;
    this.dialog = this.querySelector('[data-cart-dialog]');
    this.status = this.querySelector('[data-cart-status]');
    this.resetLocalState();
    document.addEventListener('click', (event) => this.onClick(event), { signal });
    document.addEventListener('change', (event) => this.onChange(event), { signal });
    document.addEventListener('submit', (event) => this.onSubmit(event), { signal });
    this.querySelector('[data-cart-close]')?.addEventListener('click', () => this.dialog.close(), { signal });
    this.dialog?.addEventListener('click', (event) => { if (event.target === this.dialog) this.dialog.close(); }, { signal });
    this.dialog?.addEventListener('close', () => this.opener?.focus({ preventScroll: true }), { signal });
  }

  disconnectedCallback() {
    this.abortController?.abort();
    this.addController?.abort();
    this.syncController?.abort();
    clearTimeout(this.syncTimer);
    this.abortController = null;
  }

  onClick(event) {
    const opener = event.target.closest('[data-cart-open]');
    if (opener && this.open(opener)) { event.preventDefault(); return; }
    const remove = event.target.closest('[data-cart-remove]');
    if (remove && this.contains(remove)) {
      this.setLocalQuantity(remove.dataset.cartKey, 0, false);
      this.flushUpdates();
      return;
    }
    const step = event.target.closest('[data-cart-quantity-step]');
    if (step && this.contains(step)) {
      const input = this.querySelector(`#${CSS.escape(step.dataset.cartQuantityInput)}`);
      if (input) this.setLocalQuantity(step.dataset.cartKey, Math.max(0, (Number(input.value) || 0) + Number(step.dataset.cartQuantityStep)));
    }
  }

  onChange(event) {
    const input = event.target.closest('[data-cart-quantity]');
    if (input && this.contains(input)) this.setLocalQuantity(input.dataset.cartKey, Math.max(0, Number(input.value) || 0));
  }

  onSubmit(event) {
    if (event.target.matches('[data-product-form] form')) { event.preventDefault(); this.add(event.target); }
  }

  open(opener) {
    if (!this.dialog || typeof this.dialog.showModal !== 'function') return false;
    this.opener = opener;
    if (!this.dialog.open) this.dialog.showModal();
    this.querySelector('[data-cart-close]')?.focus({ preventScroll: true });
    return true;
  }

  setLocalQuantity(key, quantity, schedule = true) {
    const line = this.line(key);
    if (!line) return;
    const requested = Math.max(0, Math.floor(quantity));
    const stockLimit = Number(line.dataset.cartStockLimit);
    const value = Number.isFinite(stockLimit) ? Math.min(requested, stockLimit) : requested;
    if (value < requested) this.status.textContent = this.dataset.cartMaximumQuantity;
    this.local.set(key, value);
    line.dataset.cartQuantity = value;
    line.hidden = value === 0;
    const input = line.querySelector('[data-cart-quantity]');
    if (input) input.value = value;
    this.syncLineControls(line, value);
    this.renderLinePrice(line, value);
    if (value === this.confirmed.get(key)) this.dirty.delete(key);
    else this.dirty.set(key, value);
    this.renderLocalTotals();
    this.publishCartState();
    if (schedule) this.scheduleSync();
  }

  renderLocalTotals() {
    const total = this.localTotalCents();
    this.dataset.cartTotalCents = total;
    this.querySelector('[data-cart-subtotal]')?.replaceChildren(document.createTextNode(this.formatMoney(total, true)));
    const count = this.localItemCount();
    this.updateCount(count);
    this.renderLocalEmptyState(count === 0);
    this.toggleAttribute('data-cart-pending', this.dirty.size > 0 || Boolean(this.syncController));
  }

  localItemCount() { return [...this.local.values()].reduce((sum, quantity) => sum + quantity, 0); }

  localTotalCents() {
    const lineTotal = [...this.local.entries()].reduce((sum, [key, quantity]) => sum + Number(this.line(key)?.dataset.cartUnitPrice || 0) * quantity, 0);
    return Math.max(0, lineTotal - (Number(this.dataset.cartDiscountCents) || 0));
  }

  renderLocalEmptyState(isEmpty) {
    const form = this.querySelector('[data-cart-form]');
    const empty = this.querySelector('[data-cart-local-empty]');
    if (form && empty) { form.hidden = isEmpty; empty.hidden = !isEmpty; }
  }

  renderLinePrice(line, quantity) {
    line.querySelector('[data-cart-line-total]')?.replaceChildren(document.createTextNode(this.formatMoney(Number(line.dataset.cartUnitPrice) * quantity)));
    line.querySelector('[data-cart-line-compare]')?.replaceChildren(document.createTextNode(this.formatMoney(Number(line.dataset.cartCompareUnitPrice) * quantity)));
  }

  scheduleSync(delay = 650) {
    clearTimeout(this.syncTimer);
    if (!this.dirty.size) return;
    this.status.textContent = 'Cart will update shortly.';
    this.syncTimer = setTimeout(() => this.flushUpdates(), delay);
  }

  async flushUpdates() {
    clearTimeout(this.syncTimer);
    if (this.syncController) return;
    if (!this.dirty.size) return;
    const [key, sentQuantity] = this.dirty.entries().next().value;
    this.syncController = new AbortController();
    this.renderLocalTotals();
    this.status.textContent = 'Updating cart.';
    try {
      const response = await fetch(`${this.dataset.cartUrl}/change.js`, {
        method: 'POST',
        signal: this.syncController.signal,
        headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: key, quantity: sentQuantity, sections: 'cart-drawer', sections_url: `${window.location.pathname}${window.location.search}` }),
      });
      if (!response.ok) throw new Error('Cart update failed');
      const cart = await response.json();
      const serverQuantities = new Map(cart.items.map((item) => [item.key, item.quantity]));
      const confirmedQuantity = serverQuantities.get(key) || 0;
      this.confirmed.set(key, confirmedQuantity);
      if (this.local.get(key) === sentQuantity) {
        if (confirmedQuantity !== sentQuantity) this.setLocalQuantity(key, confirmedQuantity, false);
        else this.dirty.delete(key);
      }
      if (!this.dirty.size && this.pricingChanged(cart)) this.reconcileServerPricing(cart);
      this.status.textContent = 'Cart updated.';
    } catch (error) {
      if (error.name !== 'AbortError') {
        if (this.local.get(key) === sentQuantity) this.setLocalQuantity(key, this.confirmed.get(key) || 0, false);
        this.status.textContent = 'Cart update failed. The last confirmed quantities were restored.';
      }
    } finally {
      this.syncController = null;
      this.renderLocalTotals();
      this.publishCartState();
      if (this.dirty.size) {
        const delay = 0;
        this.scheduleSync(delay);
      }
    }
  }

  async add(form) {
    this.addController?.abort();
    this.addController = new AbortController();
    this.opener = document.activeElement;
    try {
      this.publishCartStateFromCart(await this.getCart());
      const body = new FormData(form);
      body.set('sections', 'cart-drawer');
      body.set('sections_url', `${window.location.pathname}${window.location.search}`);
      const response = await fetch(`${this.dataset.cartUrl}/add.js`, { method: 'POST', body, signal: this.addController.signal, headers: { Accept: 'application/json' } });
      if (!response.ok) throw new Error('Cart add failed');
      const added = await response.json();
      const cart = await this.getCart();
      const section = added.sections?.['cart-drawer'] || await this.getDrawerSection();
      if (!this.hydrateDrawerSection(section)) this.renderCart(cart);
      this.updateCount(cart.item_count);
      if (cart.item_count > 0) this.open(this.opener);
      this.status.textContent = 'Item added to cart.';
    } catch (error) {
      if (error.name !== 'AbortError') this.status.textContent = 'Item could not be added to cart. Please try again.';
    } finally {
      this.addController = null;
    }
  }

  async getCart() {
    const response = await fetch(`${this.dataset.cartUrl}.js`, { headers: { Accept: 'application/json' } });
    if (!response.ok) throw new Error('Cart state request failed');
    return response.json();
  }

  async getDrawerSection() {
    const url = new URL(window.location.href);
    url.searchParams.set('section_id', 'cart-drawer');
    const response = await fetch(url, { headers: { Accept: 'text/html' } });
    return response.ok ? response.text() : null;
  }

  renderCart(cart) {
    const content = this.querySelector('[data-cart-content]');
    const items = cart.items || [];
    if (!items.length) {
      content.innerHTML = this.emptyStateHtml();
      this.resetLocalState();
      return;
    }
    this.dataset.cartDiscountCents = this.cartDiscountTotal(cart);
    content.innerHTML = `${this.cartFormHtml(cart, items)}${this.emptyStateHtml(true)}`;
    this.resetLocalState();
  }

  emptyStateHtml(isLocal = false) {
    return `<div class="cart-drawer__empty"${isLocal ? ' data-cart-local-empty hidden' : ''}><p>${this.escape(this.dataset.cartEmptyText)}</p><a href="/collections/all">${this.escape(this.dataset.cartContinueShopping)}</a></div>`;
  }

  cartFormHtml(cart, items) {
    return `<form action="${this.escape(this.dataset.cartUrl)}" method="post" data-cart-form><div class="cart-drawer__lines">${items.map((item, index) => this.lineHtml(item, index)).join('')}</div>${this.cartFooterHtml(cart)}</form>`;
  }

  cartFooterHtml(cart) {
    return `<footer class="cart-drawer__footer">${this.cartDiscountHtml(cart)}<p class="cart-drawer__subtotal"><span>${this.escape(this.dataset.cartSubtotalLabel)}</span><strong data-cart-subtotal>${this.formatMoney(cart.total_price, true)}</strong></p><p class="cart-drawer__checkout-note">${this.escape(this.dataset.cartTaxesNote)}</p><button type="submit" name="checkout">${this.escape(this.dataset.cartCheckoutLabel)}</button><a href="${this.escape(this.dataset.cartUrl)}">${this.escape(this.dataset.cartViewCart)}</a></footer>`;
  }

  hydrateDrawerSection(html) {
    if (!html) return false;
    const fresh = new DOMParser().parseFromString(html, 'text/html').querySelector('[data-cart-drawer]');
    const content = fresh?.querySelector('[data-cart-content]');
    if (!content) return false;
    this.dataset.cartDiscountCents = fresh.dataset.cartDiscountCents || '0';
    this.querySelector('[data-cart-content]').innerHTML = content.innerHTML;
    this.resetLocalState();
    return true;
  }

  resetLocalState() {
    const entries = [...this.querySelectorAll('[data-cart-line]')].map((line) => [line.dataset.cartLine, Number(line.dataset.cartQuantity)]);
    this.local = new Map(entries);
    this.confirmed = new Map(entries);
    this.dirty = new Map();
    this.querySelectorAll('[data-cart-line]').forEach((line) => this.syncLineControls(line, Number(line.dataset.cartQuantity)));
    this.renderLocalTotals();
    this.publishCartState();
  }

  syncLineControls(line, quantity) {
    const stockLimit = Number(line.dataset.cartStockLimit);
    const hasStockLimit = Number.isFinite(stockLimit);
    const input = line.querySelector('[data-cart-quantity]');
    if (input && hasStockLimit) input.max = stockLimit;
    line.querySelector('[data-cart-quantity-step="-1"]')?.toggleAttribute('disabled', quantity <= 0);
    line.querySelector('[data-cart-quantity-step="1"]')?.toggleAttribute('disabled', hasStockLimit && quantity >= stockLimit);
  }

  cartDiscountTotal(cart) { return (cart.cart_level_discount_applications || []).reduce((sum, discount) => sum + Number(discount.total_allocated_amount || 0), 0); }

  cartDiscountHtml(cart) {
    const discounts = cart.cart_level_discount_applications || [];
    return discounts.length ? `<ul class="cart-drawer__discounts" role="list" data-cart-discounts>${discounts.map((discount) => `<li data-cart-cart-discount>${this.escape(discount.title)} (−${this.formatMoney(discount.total_allocated_amount)})</li>`).join('')}</ul>` : '';
  }

  pricingChanged(cart) {
    const serverItems = new Map((cart.items || []).map((item) => [item.key, item]));
    const linePriceChanged = [...this.local.keys()].some((key) => Number(this.line(key)?.dataset.cartUnitPrice) !== Number(serverItems.get(key)?.final_price));
    const displayedDiscount = Number(this.dataset.cartDiscountCents) || 0;
    return linePriceChanged || displayedDiscount !== this.cartDiscountTotal(cart) || Number(this.dataset.cartTotalCents) !== Number(cart.total_price);
  }

  reconcileServerPricing(cart) {
    const section = cart.sections?.['cart-drawer'];
    if (!this.hydrateDrawerSection(section)) this.renderCart(cart);
    this.updateCount(cart.item_count);
    this.status.textContent = 'Cart pricing updated.';
  }

  lineHtml(item, index) {
    const id = `DrawerQuantity-${index}`;
    const compareUnitPrice = Number(item.compare_at_price || item.original_price || 0);
    const key = this.escape(item.key);
    const stock = Number.isFinite(Number(item.inventory_quantity)) ? Number(item.inventory_quantity) : null;
    const stockData = stock === null ? '' : ` data-cart-stock-limit="${stock}"`;
    return `<article class="cart-drawer__line" data-cart-line="${key}" data-cart-variant-id="${item.variant_id}"${stockData} data-cart-quantity="${item.quantity}" data-cart-unit-price="${item.final_price}" data-cart-compare-unit-price="${compareUnitPrice}"><a href="${this.escape(item.url)}">${this.productImageHtml(item)}</a><div class="cart-drawer__line-details">${this.lineDetailsHtml(item)}${this.quantityControlsHtml(item, id, key, stock)}</div><div class="cart-drawer__line-price">${this.linePriceHtml(item, compareUnitPrice)}</div></article>`;
  }

  productImageHtml(item) { return item.image ? `<img src="${this.escape(item.image)}" alt="${this.escape(item.product_title)}">` : ''; }

  lineDetailsHtml(item) {
    const variant = item.variant_title && item.variant_title !== 'Default Title' ? `<p>${this.escape(item.variant_title)}</p>` : '';
    const sellingPlan = item.selling_plan_allocation?.selling_plan?.name ? `<p>${this.escape(item.selling_plan_allocation.selling_plan.name)}</p>` : '';
    const properties = Object.entries(item.properties || {}).filter(([, value]) => value !== '').map(([name, value]) => `<p>${this.escape(name)}: ${this.escape(value)}</p>`).join('');
    const discounts = (item.line_level_discount_allocations || []).map((discount) => `<li>${this.escape(discount.discount_application?.title)} (−${this.formatMoney(discount.amount)})</li>`).join('');
    return `<a href="${this.escape(item.url)}">${this.escape(item.product_title)}</a>${variant}${sellingPlan}${properties}${discounts ? `<ul class="cart-drawer__discounts" role="list">${discounts}</ul>` : ''}`;
  }

  quantityControlsHtml(item, id, key, stock) {
    const inputMax = stock === null ? '' : ` max="${stock}"`;
    return `<div class="cart-drawer__line-actions"><label class="visually-hidden" for="${id}">Quantity</label><div class="cart-drawer__quantity-control"><button type="button" aria-label="${this.escape(this.dataset.cartDecreaseLabel)}" data-cart-quantity-step="-1" data-cart-key="${key}" data-cart-quantity-input="${id}">−</button><input id="${id}" type="number" value="${item.quantity}" min="0"${inputMax} step="1" data-cart-quantity data-cart-key="${key}"><button type="button" aria-label="${this.escape(this.dataset.cartIncreaseLabel)}" data-cart-quantity-step="1" data-cart-key="${key}" data-cart-quantity-input="${id}">+</button></div><button type="button" aria-label="${this.escape(this.dataset.cartRemoveLabel)}" data-cart-remove data-cart-key="${key}"><svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 7h14M10 11v6M14 11v6M6 7l1 14h10l1-14M9 7V4h6v3"/></svg></button></div>`;
  }

  linePriceHtml(item, compareUnitPrice) {
    const compareLinePrice = compareUnitPrice * item.quantity;
    const compare = compareLinePrice > Number(item.final_line_price) ? `<s data-cart-line-compare>${this.formatMoney(compareLinePrice)}</s>` : '';
    const unit = `<small data-cart-unit-price>${this.formatMoney(item.final_price)} ${this.escape(this.dataset.cartEachLabel)}</small>`;
    const measurement = item.unit_price_measurement ? `<small>${this.formatMoney(item.unit_price)} / ${this.escape(item.unit_price_measurement.reference_unit)}</small>` : '';
    return `${compare}<strong data-cart-line-total>${this.formatMoney(item.final_line_price)}</strong>${unit}${measurement}`;
  }

  line(key) { return this.querySelector(`[data-cart-line="${CSS.escape(key)}"]`); }
  publishCartState() {
    const quantities = {};
    this.querySelectorAll('[data-cart-line]').forEach((line) => {
      const variantId = line.dataset.cartVariantId;
      if (variantId) quantities[variantId] = (quantities[variantId] || 0) + Number(this.local.get(line.dataset.cartLine) || 0);
    });
    window.dispatchEvent(new CustomEvent('cart:state', { detail: { quantities } }));
  }
  publishCartStateFromCart(cart) {
    const quantities = (cart.items || []).reduce((result, item) => {
      result[item.variant_id] = (result[item.variant_id] || 0) + item.quantity;
      return result;
    }, {});
    window.dispatchEvent(new CustomEvent('cart:state', { detail: { quantities } }));
  }
  formatMoney(cents, withCode = false) { return new Intl.NumberFormat(document.documentElement.lang || 'en', { style: 'currency', currency: this.dataset.cartCurrency || 'USD', currencyDisplay: withCode ? 'code' : 'narrowSymbol' }).format(Number(cents) / 100); }
  escape(value) { const node = document.createElement('span'); node.textContent = value || ''; return node.innerHTML; }
  updateCount(count) { document.querySelectorAll('[data-cart-count]').forEach((node) => { node.textContent = count; node.hidden = count === 0; }); }
}

if (!customElements.get('cart-drawer')) customElements.define('cart-drawer', CartDrawer);

class CartPage extends HTMLElement {
  connectedCallback() {
    if (this.abortController) return;
    this.abortController = new AbortController();
    const { signal } = this.abortController;
    this.querySelectorAll('[data-cart-page-quantity-step]').forEach((button) => { button.hidden = false; });
    this.addEventListener('click', (event) => this.onClick(event), { signal });
  }

  disconnectedCallback() {
    this.abortController?.abort();
    this.abortController = null;
  }

  onClick(event) {
    const step = event.target.closest('[data-cart-page-quantity-step]');
    if (!step || !this.contains(step)) return;
    const input = this.querySelector(`#${CSS.escape(step.dataset.cartPageQuantityInput)}`);
    if (!input) return;
    const maximum = input.max === '' ? Number.POSITIVE_INFINITY : Number(input.max);
    const value = Math.max(0, Math.min(maximum, (Number(input.value) || 0) + Number(step.dataset.cartPageQuantityStep)));
    input.value = value;
    input.dispatchEvent(new Event('change', { bubbles: true }));
    this.querySelector('[data-cart-page-status]').textContent = this.dataset.cartUpdateMessage;
  }
}

if (!customElements.get('cart-page')) customElements.define('cart-page', CartPage);
