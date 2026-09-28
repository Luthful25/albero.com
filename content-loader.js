(() => {
  const getDefaultApiBaseUrl = () => {
    const localHosts = new Set(["localhost", "127.0.0.1", "::1"]);
    const isSeparateLocalFrontend =
      localHosts.has(window.location.hostname) && window.location.port && window.location.port !== "5000";

    if (window.location.protocol === "file:" || isSeparateLocalFrontend) {
      return "http://localhost:5000/api";
    }

    return `${window.location.origin}/api`;
  };

  const API_BASE_URL = window.ALBERO_API_BASE_URL || getDefaultApiBaseUrl();

  const escapeHtml = (value) =>
    String(value ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");

  const formatDate = (value) => {
    if (!value) return "";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return String(value);

    return new Intl.DateTimeFormat("en", {
      day: "2-digit",
      month: "short",
      year: "numeric"
    }).format(date);
  };

  const getJson = async (path) => {
    const response = await fetch(`${API_BASE_URL}${path}`);
    if (!response.ok) {
      throw new Error("Content request failed.");
    }

    return response.json();
  };

  const renderCaseStyleCard = (item, fallbackHref) => `
    <article class="case-card" data-filter-value="${escapeHtml(String(item.category || "").toLowerCase())}">
      <img class="case-card__image" src="${escapeHtml(item.imageUrl || "assets/service.jpg")}" alt="${escapeHtml(item.imageAlt || item.title)}" />
      <div class="case-card__body">
        <span class="case-card__category">${escapeHtml(item.category || "Albero Studio")}</span>
        <p class="case-card__meta">
          <span class="case-card__date-icon" aria-hidden="true"></span>
          <span>${escapeHtml(formatDate(item.publishedAt))}</span>
          <span>| By ${escapeHtml(item.author || "Albero Team")}</span>
        </p>
        <h2>${escapeHtml(item.title)}</h2>
        <p>${escapeHtml(item.excerpt || "")}</p>
        <a class="case-card__button" href="${fallbackHref}${item.slug ? `?slug=${encodeURIComponent(item.slug)}` : ""}">Read More</a>
      </div>
    </article>
  `;

  const renderHomeBlogCard = (item) => `
    <article class="blog-card">
      <img src="${escapeHtml(item.imageUrl || "assets/service.jpg")}" alt="${escapeHtml(item.imageAlt || item.title)}" loading="lazy" />
      <div class="blog-card-body">
        <div class="blog-meta">
          <span>${escapeHtml((item.author || "Albero Team").toUpperCase())}</span>
          <span>|</span>
          <span>${escapeHtml(formatDate(item.publishedAt).toUpperCase())}</span>
        </div>
        <h3>${escapeHtml(item.title)}</h3>
        <p>${escapeHtml(item.excerpt || "")}</p>
        <a href="blog-detail.html${item.slug ? `?slug=${encodeURIComponent(item.slug)}` : ""}" class="read-more">Read More</a>
      </div>
    </article>
  `;

  const loadBlogPage = async () => {
    const grid = document.querySelector("#blogArticles .case-card-grid");
    if (!(grid instanceof HTMLElement)) return;

    try {
      const response = await getJson("/blog-posts");
      const posts = Array.isArray(response.data) ? response.data : [];
      if (posts.length === 0) return;

      grid.innerHTML = posts.map((post) => renderCaseStyleCard(post, "blog.html")).join("");
      document.querySelector("#blogArticles .case-pagination")?.setAttribute("hidden", "");
    } catch {
      // Keep the static cards visible if the API is unavailable.
    }
  };

  const loadCasePage = async () => {
    const grid = document.querySelector("#clientStories .case-card-grid");
    if (!(grid instanceof HTMLElement)) return;

    try {
      const response = await getJson("/case-studies");
      const studies = Array.isArray(response.data) ? response.data : [];
      if (studies.length === 0) return;

      grid.innerHTML = studies.map((study) => renderCaseStyleCard(study, "case-studies.html")).join("");
      document.querySelector("#clientStories .case-pagination")?.setAttribute("hidden", "");
    } catch {
      // Keep the static cards visible if the API is unavailable.
    }
  };

  const loadHomeBlogCards = async () => {
    const grid = document.querySelector(".blog-section .blog-grid");
    if (!(grid instanceof HTMLElement)) return;

    try {
      const response = await getJson("/blog-posts");
      const posts = Array.isArray(response.data) ? response.data.slice(0, 3) : [];
      if (posts.length === 0) return;

      grid.innerHTML = posts.map(renderHomeBlogCard).join("");
    } catch {
      // Keep the static cards visible if the API is unavailable.
    }
  };

  const renderDetailError = (detail, message) => {
    detail.innerHTML = `<div class="content-detail__error"><h1>Content unavailable</h1><p>${escapeHtml(message)}</p><a class="content-detail__back" href="${detail.dataset.contentDetail === "case" ? "case-studies.html" : "blog.html"}">Return to listing</a></div>`;
  };

  const renderParagraphs = (value) =>
    String(value || "")
      .split(/\n{2,}/)
      .map((paragraph) => `<p>${escapeHtml(paragraph).replace(/\n/g, "<br />")}</p>`)
      .join("");

  const loadDetailPage = async () => {
    const detail = document.querySelector("[data-content-detail]");
    if (!(detail instanceof HTMLElement)) return;

    const type = detail.dataset.contentDetail === "case" ? "case" : "blog";
    const slug = new URLSearchParams(window.location.search).get("slug");
    if (!slug) {
      renderDetailError(detail, "Choose an article or capability note from the listing page.");
      return;
    }

    try {
      const response = await getJson(`/${type === "case" ? "case-studies" : "blog-posts"}/${encodeURIComponent(slug)}`);
      const item = response.data;
      if (!item) throw new Error("Content not found.");

      document.title = `${item.title} | Albero Studio`;
      detail.querySelector("[data-detail-category]").textContent = item.category || "Albero Studio";
      detail.querySelector("[data-detail-title]").textContent = item.title || "";
      detail.querySelector("[data-detail-meta]").textContent = `${formatDate(item.publishedAt)} | By ${item.author || "Albero Team"}`;
      detail.querySelector("[data-detail-excerpt]").textContent = item.excerpt || "";

      const image = detail.querySelector("[data-detail-image]");
      if (image instanceof HTMLImageElement) {
        image.src = item.imageUrl || "assets/service.jpg";
        image.alt = item.imageAlt || item.title || "Albero Studio content";
        image.hidden = false;
      }

      const body = detail.querySelector("[data-detail-body]");
      if (body instanceof HTMLElement) {
        body.innerHTML = type === "case"
          ? [
              ["Challenge", item.challenge],
              ["Solution", item.solution],
              ["Outcome", item.outcome]
            ].filter(([, value]) => value).map(([heading, value]) => `<section><h2>${heading}</h2>${renderParagraphs(value)}</section>`).join("")
          : renderParagraphs(item.content || item.excerpt);
      }

      detail.removeAttribute("aria-busy");
    } catch (error) {
      renderDetailError(detail, error.message || "This content could not be loaded.");
    }
  };

  const init = () => {
    loadBlogPage();
    loadCasePage();
    loadHomeBlogCards();
    loadDetailPage();
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
