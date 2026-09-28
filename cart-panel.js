(() => {
  const STORAGE_KEY = "albero-mini-cart";
  const animationDuration = 260;
  const money = new Intl.NumberFormat("bn-BD", {
    style: "currency",
    currency: "BDT",
    maximumFractionDigits: 0
  });

  const DEFAULT_ITEMS = [
    {
      id: "flow-suite",
      name: "Albero Flow Suite",
      details: "Team license | Midnight blue",
      price: 129,
      quantity: 1,
      thumbLabel: "AF",
      thumbFrom: "#2155f3",
      thumbTo: "#55d2ff"
    },
    {
      id: "brand-kit",
      name: "Brand System Kit",
      details: "Medium | Graphite",
      price: 84,
      quantity: 1,
      thumbLabel: "BK",
      thumbFrom: "#111f3f",
      thumbTo: "#6d85b5"
    },
    {
      id: "insight-pro",
      name: "Insight Board Pro",
      details: "Cloud sync | Silver",
      price: 56,
      quantity: 1,
      thumbLabel: "IP",
      thumbFrom: "#6a36ff",
      thumbTo: "#d28cff"
    }
  ];

  const cloneDefaults = () => DEFAULT_ITEMS.map((item) => ({ ...item }));

  const readCart = () => {
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY);
      if (!saved) return cloneDefaults();
      const parsed = JSON.parse(saved);
      if (!Array.isArray(parsed)) return cloneDefaults();
      return parsed.filter(Boolean).map((item) => ({
        ...item,
        quantity: Math.max(1, Number(item.quantity) || 1),
        price: Number(item.price) || 0
      }));
    } catch {
      return cloneDefaults();
    }
  };

  const writeCart = (cart) => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
    } catch {
      // Ignore storage issues and keep the in-memory cart functional.
    }
  };

  const buildThumb = (item) => {
    const svg = `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 96 96">
        <defs>
          <linearGradient id="g" x1="0" x2="1" y1="0" y2="1">
            <stop offset="0%" stop-color="${item.thumbFrom}"/>
            <stop offset="100%" stop-color="${item.thumbTo}"/>
          </linearGradient>
        </defs>
        <rect width="96" height="96" rx="18" fill="url(#g)"/>
        <circle cx="74" cy="25" r="10" fill="rgba(255,255,255,0.18)"/>
        <path d="M20 69C31 54 44 45 63 39" stroke="rgba(255,255,255,0.35)" stroke-width="5" stroke-linecap="round"/>
        <text x="48" y="56" text-anchor="middle" font-size="28" font-family="Arial, sans-serif" font-weight="700" fill="white">${item.thumbLabel}</text>
      </svg>
    `;
    return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
  };

  const createPanel = () => {
    document.body.insertAdjacentHTML(
      "beforeend",
      `
        <div class="cart-panel" id="cartPanel" hidden>
          <aside
            class="cart-panel__drawer"
            role="dialog"
            aria-modal="true"
            aria-labelledby="cartPanelTitle"
            tabindex="-1"
            data-cart-drawer
          >
            <header class="cart-panel__header">
              <div class="cart-panel__title-wrap">
                <h2 class="cart-panel__title" id="cartPanelTitle">Your Cart</h2>
                <span class="cart-panel__count" data-cart-count>0 items</span>
              </div>
              <button class="cart-panel__close" type="button" aria-label="Close cart" data-cart-close>
                <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path d="M6 6L18 18M18 6L6 18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                </svg>
              </button>
            </header>

            <div class="cart-panel__body">
              <div class="cart-panel__items" data-cart-items></div>
              <div class="cart-panel__empty" data-cart-empty hidden>
                <div class="cart-panel__empty-card">
                  <h3 class="cart-panel__empty-title">Your cart is empty</h3>
                  <p class="cart-panel__empty-text">Browse Albero products and add what you need to get started.</p>
                  <button class="cart-panel__empty-button" type="button" data-cart-start>Start shopping</button>
                </div>
              </div>
            </div>

            <div class="cart-panel__summary" data-cart-summary>
              <div class="cart-panel__summary-box">
                <div class="cart-panel__summary-row">
                  <span>Subtotal</span>
                  <strong data-cart-subtotal>$0</strong>
                </div>
                <p class="cart-panel__note">Shipping and taxes are calculated at checkout.</p>
                <div class="cart-panel__summary-row cart-panel__summary-row--total">
                  <span>Total</span>
                  <strong data-cart-total>$0</strong>
                </div>
              </div>

              <div class="cart-panel__actions">
                <button class="cart-panel__checkout" type="button">Checkout</button>
                <button class="cart-panel__view" type="button">View Cart</button>
              </div>
            </div>
          </aside>
        </div>
      `
    );

    return document.getElementById("cartPanel");
  };

  const initCartPanel = () => {
    const triggers = Array.from(document.querySelectorAll("[data-cart-open]"));
    if (triggers.length === 0) return;

    const panel = document.getElementById("cartPanel") || createPanel();
    const drawer = panel?.querySelector("[data-cart-drawer]");
    const closeButton = panel?.querySelector("[data-cart-close]");
    const itemsContainer = panel?.querySelector("[data-cart-items]");
    const emptyState = panel?.querySelector("[data-cart-empty]");
    const summary = panel?.querySelector("[data-cart-summary]");
    const countLabel = panel?.querySelector("[data-cart-count]");
    const subtotalValue = panel?.querySelector("[data-cart-subtotal]");
    const totalValue = panel?.querySelector("[data-cart-total]");
    const startShoppingButton = panel?.querySelector("[data-cart-start]");

    if (
      !(panel instanceof HTMLElement) ||
      !(drawer instanceof HTMLElement) ||
      !(closeButton instanceof HTMLButtonElement) ||
      !(itemsContainer instanceof HTMLElement) ||
      !(emptyState instanceof HTMLElement) ||
      !(summary instanceof HTMLElement) ||
      !(countLabel instanceof HTMLElement) ||
      !(subtotalValue instanceof HTMLElement) ||
      !(totalValue instanceof HTMLElement) ||
      !(startShoppingButton instanceof HTMLButtonElement)
    ) {
      return;
    }

    let cart = readCart();
    let activeTrigger = null;
    let closeTimer = 0;

    const setExpandedState = (expanded) => {
      triggers.forEach((trigger) => trigger.setAttribute("aria-expanded", String(expanded)));
    };

    const getItemCount = () => cart.reduce((sum, item) => sum + item.quantity, 0);
    const getSubtotal = () => cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

    const render = () => {
      const itemCount = getItemCount();
      const subtotal = getSubtotal();
      countLabel.textContent = `${itemCount} ${itemCount === 1 ? "item" : "items"}`;
      subtotalValue.textContent = money.format(subtotal);
      totalValue.textContent = money.format(subtotal);

      if (cart.length === 0) {
        itemsContainer.innerHTML = "";
        emptyState.hidden = false;
        summary.hidden = true;
        return;
      }

      emptyState.hidden = true;
      summary.hidden = false;
      itemsContainer.innerHTML = cart
        .map(
          (item) => `
            <article class="cart-panel__item">
              <img class="cart-panel__thumb" src="${buildThumb(item)}" alt="${item.name}" />
              <div class="cart-panel__item-content">
                <div class="cart-panel__item-top">
                  <div>
                    <h3 class="cart-panel__item-name">${item.name}</h3>
                    <p class="cart-panel__item-details">${item.details}</p>
                  </div>
                  <span class="cart-panel__item-price">${money.format(item.price)}</span>
                </div>

                <div class="cart-panel__item-controls">
                  <div class="cart-panel__qty" aria-label="Quantity selector">
                    <button
                      class="cart-panel__qty-btn"
                      type="button"
                      aria-label="Decrease quantity for ${item.name}"
                      data-cart-action="decrease"
                      data-cart-id="${item.id}"
                      ${item.quantity <= 1 ? "disabled" : ""}
                    >
                      -
                    </button>
                    <span class="cart-panel__qty-value" aria-live="polite">${item.quantity}</span>
                    <button
                      class="cart-panel__qty-btn"
                      type="button"
                      aria-label="Increase quantity for ${item.name}"
                      data-cart-action="increase"
                      data-cart-id="${item.id}"
                    >
                      +
                    </button>
                  </div>

                  <button
                    class="cart-panel__remove"
                    type="button"
                    data-cart-action="remove"
                    data-cart-id="${item.id}"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </article>
          `
        )
        .join("");
    };

    const focusablesSelector = [
      "button:not([disabled])",
      "a[href]",
      "input:not([disabled])",
      "select:not([disabled])",
      "textarea:not([disabled])",
      "[tabindex]:not([tabindex='-1'])"
    ].join(", ");

    const getFocusableElements = () =>
      Array.from(drawer.querySelectorAll(focusablesSelector)).filter(
        (element) => element instanceof HTMLElement && !element.hidden
      );

    const closePanel = () => {
      if (panel.hidden) return;
      window.clearTimeout(closeTimer);
      panel.classList.remove("is-open");
      document.body.classList.remove("cart-panel-open");
      setExpandedState(false);
      closeTimer = window.setTimeout(() => {
        panel.hidden = true;
        activeTrigger?.focus();
      }, animationDuration);
    };

    const openPanel = (trigger) => {
      window.clearTimeout(closeTimer);
      activeTrigger = trigger instanceof HTMLElement ? trigger : null;
      render();
      panel.hidden = false;
      document.body.classList.add("cart-panel-open");
      setExpandedState(true);
      window.requestAnimationFrame(() => {
        panel.classList.add("is-open");
        drawer.focus();
      });
    };

    const saveAndRender = () => {
      writeCart(cart);
      render();
    };

    triggers.forEach((trigger) => {
      trigger.addEventListener("click", (event) => {
        event.preventDefault();
        if (!panel.hidden) {
          closePanel();
          return;
        }
        openPanel(trigger);
      });
    });

    closeButton.addEventListener("click", closePanel);

    startShoppingButton.addEventListener("click", () => {
      closePanel();
      window.location.href = "services.html";
    });

    panel.addEventListener("click", (event) => {
      if (event.target === panel) {
        closePanel();
      }
    });

    panel.addEventListener("click", (event) => {
      const target = event.target;
      if (!(target instanceof HTMLElement)) return;

      const actionButton = target.closest("[data-cart-action]");
      if (!(actionButton instanceof HTMLElement)) return;

      const action = actionButton.getAttribute("data-cart-action");
      const itemId = actionButton.getAttribute("data-cart-id");
      if (!action || !itemId) return;

      if (action === "remove") {
        cart = cart.filter((item) => item.id !== itemId);
        saveAndRender();
        return;
      }

      cart = cart.map((item) => {
        if (item.id !== itemId) return item;
        if (action === "increase") {
          return { ...item, quantity: item.quantity + 1 };
        }
        if (action === "decrease") {
          return { ...item, quantity: Math.max(1, item.quantity - 1) };
        }
        return item;
      });
      saveAndRender();
    });

    drawer.addEventListener("keydown", (event) => {
      if (event.key === "Tab") {
        const focusables = getFocusableElements();
        if (focusables.length === 0) return;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];

        if (event.shiftKey && (document.activeElement === first || document.activeElement === drawer)) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && (document.activeElement === last || document.activeElement === drawer)) {
          event.preventDefault();
          first.focus();
        }
      }
    });

    window.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && !panel.hidden) {
        event.preventDefault();
        closePanel();
      }
    });

    render();
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initCartPanel);
  } else {
    initCartPanel();
  }
})();
