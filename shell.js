(() => {
  const header = `
    <header class="corp-header" id="corpHeader">
      <div class="corp-top-nav"><div class="container corp-top-nav-inner">
        <a href="index.html" class="corp-logo-card" aria-label="Albero Studio home"><img class="corp-logo-img" src="assets/logo-site.png" alt="Albero Studio" /></a>
        <nav class="corp-main-nav" aria-label="Primary">
          <div class="nav-primary-item"><a href="index.html">Home</a></div>
          <div class="nav-primary-item"><a href="company.html">Company</a></div>
        <div class="nav-primary-item"><a href="services.html">Technology</a></div>
          <div class="nav-primary-item"><a href="products.html">Products</a></div>
          <div class="nav-primary-item"><a href="blog.html">Research</a></div>
          <div class="nav-primary-item"><a href="learning-zone.html">Learning Zone</a></div>
          <div class="nav-primary-item"><a href="careers.html">Careers</a></div>
          <div class="nav-primary-item"><a href="contact.html">Contact</a></div>
        </nav>
        <div class="corp-right-actions" aria-label="Header actions">
          <button type="button" class="corp-icon-btn hero-search-btn" aria-label="Search Albero Studio">
            <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M10.9 18.2C14.93 18.2 18.2 14.93 18.2 10.9C18.2 6.87 14.93 3.6 10.9 3.6C6.87 3.6 3.6 6.87 3.6 10.9C3.6 14.93 6.87 18.2 10.9 18.2Z" stroke="currentColor" stroke-width="2" /><path d="M16.2 16.2L21 21" stroke="currentColor" stroke-width="2" stroke-linecap="round" /></svg>
          </button>
          <span class="header-action-divider" aria-hidden="true"></span>
          <button class="corp-icon-btn hero-lines-btn" type="button" aria-label="Open menu" aria-haspopup="true" aria-controls="corpMobileMenu" aria-expanded="false"><span></span><span></span><span></span></button>
        </div>
        <button class="corp-menu-btn" id="corpMenuBtn" type="button" aria-expanded="false" aria-controls="corpMobileMenu" aria-label="Toggle menu"><span></span><span></span><span></span></button>
      </div></div>
      <nav class="corp-mobile-menu" id="corpMobileMenu" aria-label="Mobile menu">
        <a href="index.html">Home</a><a href="company.html">Company</a><a href="services.html">Technology</a><a href="products.html">Products</a><a href="blog.html">Research</a><a href="learning-zone.html">Learning Zone</a><a href="careers.html">Careers</a><a href="contact.html">Contact</a>
      </nav>
    </header>`;

  const footer = `
    <footer class="corp-footer" id="footer">
      <div class="corp-footer__inner"><div class="corp-footer__main">
        <a href="index.html" class="corp-footer__logo" aria-label="Albero Studio home"><img class="corp-footer__logo-img" src="assets/logo-site.png" alt="Albero Studio" /></a>
        <nav class="corp-footer__nav" aria-label="Footer navigation"><a href="company.html">Company</a><a href="services.html">Technology</a><a href="products.html">Products</a><a href="blog.html">Research</a><a href="careers.html">Careers</a><a href="contact.html">Contact</a><a href="quote.html">Quotation</a><a href="client-portal.html">Client Portal</a></nav>
        <div class="corp-footer__contact" aria-label="Contact"><a href="mailto:hello@alberostudio.com">hello@alberostudio.com</a><a href="tel:+8801315963305">+880 1315 963305</a></div>
        <div class="corp-footer__socials" aria-label="Social links"><a href="https://www.facebook.com" aria-label="Facebook" target="_blank" rel="noopener noreferrer"><span aria-hidden="true">f</span></a><a href="https://www.youtube.com" aria-label="YouTube" target="_blank" rel="noopener noreferrer"><span aria-hidden="true">▶</span></a><a href="mailto:hello@alberostudio.com" aria-label="Email"><svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><rect x="2.8" y="5" width="18.4" height="14" rx="2.5" stroke="currentColor" stroke-width="1.8" /><path d="M4.8 7L12 12.3L19.2 7" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" /></svg></a></div>
      </div><div class="corp-footer__principles" aria-label="Albero Studio focus"><div><span>OUR FOCUS</span><strong>Secure intelligence</strong><small>Cybersecurity, AI, and engineering for useful progress.</small></div><div><span>OUR 3C THEORY</span><strong>Consistency · Clarity · Conscience</strong><small>A practical philosophy for responsible technology.</small></div><div><span>OUR ORIGIN</span><strong>Built in Bangladesh</strong><small>Designed for teams and possibilities around the world.</small></div></div><div class="corp-footer__bottom"><p class="corp-footer__copyright">&copy; <span data-current-year>2026</span> Albero Studio. All rights reserved.</p><a class="corp-footer__legal-link" href="privacy.html">Privacy Policy</a></div></div>
    </footer>`;

  const init = () => {
    document.querySelector("[data-site-header]")?.replaceWith(document.createRange().createContextualFragment(header));
    document.querySelector("[data-site-footer]")?.replaceWith(document.createRange().createContextualFragment(footer));

    const menuButton = document.getElementById("corpMenuBtn");
    const linesButton = document.querySelector(".hero-lines-btn");
    const mobileMenu = document.getElementById("corpMobileMenu");
    const toggleMenu = (open) => {
      menuButton?.setAttribute("aria-expanded", String(open));
      linesButton?.setAttribute("aria-expanded", String(open));
      mobileMenu?.classList.toggle("open", open);
      document.body.classList.toggle("menu-open", open);
    };
    menuButton?.addEventListener("click", () => toggleMenu(menuButton.getAttribute("aria-expanded") !== "true"));
    linesButton?.addEventListener("click", () => toggleMenu(linesButton.getAttribute("aria-expanded") !== "true"));
    mobileMenu?.querySelectorAll("a").forEach((link) => link.addEventListener("click", () => toggleMenu(false)));
  };

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
