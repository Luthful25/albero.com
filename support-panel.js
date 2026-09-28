(() => {
  const createPanel = () => {
    document.body.insertAdjacentHTML(
      "beforeend",
      `
        <div class="support-panel" id="supportPanel" hidden>
          <div
            class="support-panel__card"
            role="dialog"
            aria-modal="false"
            aria-labelledby="supportPanelHeading"
            tabindex="-1"
            data-support-card
          >
            <div class="support-panel__hero">
              <p class="support-panel__eyebrow" id="supportPanelHeading">Call us at</p>
              <p class="support-panel__country">Bangladesh</p>
              <p class="support-panel__numbers">+8801315963305</p>
              <p class="support-panel__subcopy">
                Or see our complete list of
                <a href="contact.html" data-support-link>local country numbers</a>
              </p>
            </div>

            <div class="support-panel__content" aria-label="Support options">
              <a href="tel:+8801315963305" class="support-panel__option" data-support-link>
                <span class="support-panel__icon" aria-hidden="true">
                  <svg viewBox="0 0 24 24" fill="none">
                    <path d="M4 13.2V12A8 8 0 0 1 20 12V13.2" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
                    <rect x="3.5" y="12" width="4.5" height="7" rx="2.2" stroke="currentColor" stroke-width="1.8"/>
                    <rect x="16" y="12" width="4.5" height="7" rx="2.2" stroke="currentColor" stroke-width="1.8"/>
                    <path d="M12 19.2V21M12 21H16" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
                  </svg>
                </span>
                <span>
                  <span class="support-panel__option-title">Call me now</span>
                  <span class="support-panel__option-text">Albero can call you to discuss any questions you have.</span>
                </span>
              </a>

              <a href="mailto:hello@alberostudio.com?subject=Chat%20Request" class="support-panel__option" data-support-link>
                <span class="support-panel__icon" aria-hidden="true">
                  <svg viewBox="0 0 24 24" fill="none">
                    <path d="M6 17L3.8 20V6.8C3.8 5.81 4.61 5 5.6 5H18.4C19.39 5 20.2 5.81 20.2 6.8V15.2C20.2 16.19 19.39 17 18.4 17H6Z" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/>
                    <path d="M8 10H16M8 13.6H13.5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
                  </svg>
                </span>
                <span>
                  <span class="support-panel__option-title">Chat now</span>
                  <span class="support-panel__option-text">Get live help and chat with an ALBERO representative.</span>
                </span>
              </a>

              <a href="mailto:hello@alberostudio.com?subject=Website%20Inquiry" class="support-panel__option" data-support-link>
                <span class="support-panel__icon" aria-hidden="true">
                  <svg viewBox="0 0 24 24" fill="none">
                    <rect x="2.8" y="5" width="18.4" height="14" rx="2.5" stroke="currentColor" stroke-width="1.8"/>
                    <path d="M4.8 7L12 12.3L19.2 7" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                </span>
                <span>
                  <span class="support-panel__option-title">Contact us</span>
                  <span class="support-panel__option-text">Send us your comments, questions, or feedback.</span>
                </span>
              </a>
            </div>
          </div>
        </div>
      `
    );

    return document.getElementById("supportPanel");
  };

  const initSupportPanel = () => {
    const triggers = Array.from(document.querySelectorAll("[data-support-open]"));
    if (triggers.length === 0) return;

    const panel = document.getElementById("supportPanel") || createPanel();
    const card = panel?.querySelector("[data-support-card]");
    const links = Array.from(panel?.querySelectorAll("[data-support-link]") || []);

    if (!(panel instanceof HTMLElement) || !(card instanceof HTMLElement)) {
      return;
    }

    let activeTrigger = null;

    const positionCard = (trigger) => {
      const rect = trigger.getBoundingClientRect();
      const cardWidth = card.offsetWidth;
      const cardHeight = card.offsetHeight;
      const gap = 14;
      const viewportPadding = 12;
      const canPlaceLeft = rect.left - gap - cardWidth >= viewportPadding;

      let left;
      let top;

      if (window.innerWidth <= 780) {
        left = Math.max(viewportPadding, Math.min(window.innerWidth - cardWidth - viewportPadding, rect.right - cardWidth));
        top = Math.max(viewportPadding, rect.top - cardHeight - gap);
      } else if (canPlaceLeft) {
        left = rect.left - cardWidth - gap;
        top = Math.min(
          Math.max(viewportPadding, rect.top + rect.height / 2 - cardHeight / 2),
          window.innerHeight - cardHeight - viewportPadding
        );
      } else {
        left = Math.min(window.innerWidth - cardWidth - viewportPadding, rect.right + gap);
        top = Math.min(
          Math.max(viewportPadding, rect.top + rect.height / 2 - cardHeight / 2),
          window.innerHeight - cardHeight - viewportPadding
        );
      }

      card.style.left = `${left}px`;
      card.style.top = `${top}px`;
    };

    const setExpandedState = (expanded) => {
      triggers.forEach((trigger) => trigger.setAttribute("aria-expanded", String(expanded)));
    };

    const closePanel = () => {
      if (panel.hidden) return;
      panel.classList.remove("is-open");
      panel.hidden = true;
      setExpandedState(false);
      activeTrigger?.focus();
    };

    const openPanel = (trigger) => {
      activeTrigger = trigger instanceof HTMLElement ? trigger : null;
      panel.hidden = false;
      positionCard(trigger);
      setExpandedState(true);
      window.requestAnimationFrame(() => {
        panel.classList.add("is-open");
        card.focus();
      });
    };

    triggers.forEach((trigger) => {
      trigger.addEventListener("click", (event) => {
        event.preventDefault();
        if (!panel.hidden && activeTrigger === trigger) {
          closePanel();
          return;
        }
        openPanel(trigger);
      });
    });

    links.forEach((link) => {
      link.addEventListener("click", () => {
        closePanel();
      });
    });

    panel.addEventListener("click", (event) => {
      if (event.target === panel) {
        closePanel();
      }
    });

    window.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && !panel.hidden) {
        event.preventDefault();
        closePanel();
      }
    });

    window.addEventListener("resize", () => {
      if (!panel.hidden && activeTrigger instanceof HTMLElement) {
        positionCard(activeTrigger);
      }
    });

    window.addEventListener("scroll", () => {
      if (!panel.hidden && activeTrigger instanceof HTMLElement) {
        positionCard(activeTrigger);
      }
    }, { passive: true });
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initSupportPanel);
  } else {
    initSupportPanel();
  }
})();
