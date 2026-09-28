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
  const state = {
    token: "",
    activeView: "overview",
    summary: null,
    blog: [],
    cases: [],
    contacts: [],
    support: [],
    newsletter: [],
    accounts: [],
    leads: [],
    quotes: [],
    clients: [],
    analytics: null
  };

  const views = ["overview", "blog", "cases", "contacts", "support", "newsletter", "accounts", "leads", "quotes", "clients", "analytics"];
  const loadedViews = new Set();

  const loginView = document.getElementById("loginView");
  const appView = document.getElementById("appView");
  const loginForm = document.getElementById("loginForm");
  const loginMessage = document.getElementById("loginMessage");
  const adminNotice = document.getElementById("adminNotice");
  const apiStatus = document.getElementById("apiStatus");
  const summaryGrid = document.getElementById("summaryGrid");
  const blogForm = document.getElementById("blogForm");
  const caseForm = document.getElementById("caseForm");

  const escapeHtml = (value) =>
    String(value ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");

  const slugify = (value) =>
    String(value || "")
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 180);

  const formatDate = (value) => {
    if (!value) return "";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return String(value);
    return new Intl.DateTimeFormat("en", {
      year: "numeric",
      month: "short",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit"
    }).format(date);
  };

  const toDatetimeLocal = (value) => {
    const date = value ? new Date(value) : new Date();
    if (Number.isNaN(date.getTime())) return new Date().toISOString().slice(0, 16);

    const offset = date.getTimezoneOffset();
    const localDate = new Date(date.getTime() - offset * 60000);
    return localDate.toISOString().slice(0, 16);
  };

  const setNotice = (message = "", type = "") => {
    adminNotice.textContent = message;
    adminNotice.dataset.type = type;
  };

  const setLoginMessage = (message = "", type = "") => {
    loginMessage.textContent = message;
    loginMessage.dataset.type = type;
  };

  const setBusy = (busy) => {
    document.body.toggleAttribute("data-busy", busy);
    document.querySelectorAll("button").forEach((button) => {
      if (button.id !== "logoutBtn") button.disabled = busy;
    });
  };

  const showLogin = () => {
    window.localStorage.removeItem("albero-admin-token");
    state.token = "";
    appView.hidden = true;
    loginView.hidden = false;
  };

  const showApp = () => {
    loginView.hidden = true;
    appView.hidden = false;
  };

  const adminFetch = async (path, options = {}) => {
    const response = await fetch(`${API_BASE_URL}${path}`, {
      ...options,
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        ...(state.token ? { Authorization: `Bearer ${state.token}` } : {}),
        ...(options.headers || {})
      }
    });

    const data = await response.json().catch(() => ({}));

    if (response.status === 401) {
      showLogin();
      throw new Error(data.message || "Admin login required.");
    }

    if (!response.ok) {
      const error = new Error(data.message || "Request failed.");
      error.status = response.status;
      error.data = data;
      throw error;
    }

    return data;
  };

  const isDatabaseUnavailable = (error) =>
    error?.status === 500 && /server|database|went wrong/i.test(error.message || "");

  const renderSummary = () => {
    const summary = state.summary || {};
    const items = [
      ["New Contacts", summary.newContacts],
      ["All Contacts", summary.contacts],
      ["Open Support", summary.openSupport],
      ["Subscribers", summary.subscribers],
      ["Blog Posts", summary.blogPosts],
      ["Case Studies", summary.caseStudies],
      ["Account Requests", summary.accountRequests],
      ["Support Total", summary.support],
      ["Active Leads", summary.activeLeads],
      ["Open Quotes", summary.openQuotes]
    ];

    summaryGrid.innerHTML = items
      .map(
        ([label, value]) => `
          <article class="stat-card">
            <span>${escapeHtml(label)}</span>
            <strong>${Number(value || 0)}</strong>
          </article>
        `
      )
      .join("");
  };

  const statusBadge = (status) => `<span class="badge" data-status="${escapeHtml(status)}">${escapeHtml(status)}</span>`;

  const emptyRow = (colspan, text) => `<tr><td class="empty-row" colspan="${colspan}">${escapeHtml(text)}</td></tr>`;

  const renderBlogRows = () => {
    const tbody = document.getElementById("blogRows");
    if (state.blog.length === 0) {
      tbody.innerHTML = emptyRow(5, "No blog posts found.");
      return;
    }

    tbody.innerHTML = state.blog
      .map(
        (item) => `
          <tr>
            <td><strong>${escapeHtml(item.title)}</strong><span class="muted-cell">${escapeHtml(item.slug)}</span></td>
            <td>${escapeHtml(item.category)}</td>
            <td>${statusBadge(item.status)}</td>
            <td>${escapeHtml(formatDate(item.publishedAt))}</td>
            <td>
              <div class="row-actions">
                <button class="mini-btn" type="button" data-edit-blog="${item.id}">Edit</button>
                <button class="mini-btn danger" type="button" data-delete-blog="${item.id}">Delete</button>
              </div>
            </td>
          </tr>
        `
      )
      .join("");
  };

  const renderCaseRows = () => {
    const tbody = document.getElementById("caseRows");
    if (state.cases.length === 0) {
      tbody.innerHTML = emptyRow(5, "No case studies found.");
      return;
    }

    tbody.innerHTML = state.cases
      .map(
        (item) => `
          <tr>
            <td><strong>${escapeHtml(item.title)}</strong><span class="muted-cell">${escapeHtml(item.slug)}</span></td>
            <td>${escapeHtml(item.clientName || item.category)}</td>
            <td>${statusBadge(item.status)}</td>
            <td>${escapeHtml(formatDate(item.publishedAt))}</td>
            <td>
              <div class="row-actions">
                <button class="mini-btn" type="button" data-edit-case="${item.id}">Edit</button>
                <button class="mini-btn danger" type="button" data-delete-case="${item.id}">Delete</button>
              </div>
            </td>
          </tr>
        `
      )
      .join("");
  };

  const statusSelect = (id, value, endpoint, statuses) => `
    <select class="status-pill" data-status-id="${id}" data-status-endpoint="${endpoint}">
      ${statuses.map((status) => `<option value="${status}" ${status === value ? "selected" : ""}>${status}</option>`).join("")}
    </select>
  `;

  const renderContacts = () => {
    const tbody = document.getElementById("contactRows");
    if (state.contacts.length === 0) {
      tbody.innerHTML = emptyRow(7, "No contact messages found.");
      return;
    }

    tbody.innerHTML = state.contacts
      .map(
        (item) => `
          <tr>
            <td><strong>${escapeHtml(item.name)}</strong><span class="muted-cell">${escapeHtml(item.company || item.service || "")}</span></td>
            <td>${escapeHtml(item.email)}</td>
            <td>${escapeHtml(item.phone || "")}</td>
            <td class="message-cell">${escapeHtml(item.message)}</td>
            <td>${statusSelect(item.id, item.status, "contact-messages", ["new", "read", "archived"])}</td>
            <td>${escapeHtml(formatDate(item.createdAt))}</td>
            <td><button class="mini-btn danger" type="button" data-delete-record="contact-messages" data-id="${item.id}">Delete</button></td>
          </tr>
        `
      )
      .join("");
  };

  const renderSupport = () => {
    const tbody = document.getElementById("supportRows");
    if (state.support.length === 0) {
      tbody.innerHTML = emptyRow(7, "No support requests found.");
      return;
    }

    tbody.innerHTML = state.support
      .map(
        (item) => `
          <tr>
            <td><strong>${escapeHtml(item.name)}</strong></td>
            <td>${escapeHtml(item.email)}</td>
            <td>${escapeHtml(item.subject || "")}</td>
            <td class="message-cell">${escapeHtml(item.message)}</td>
            <td>${statusSelect(item.id, item.status, "support-requests", ["new", "open", "closed", "archived"])}</td>
            <td>${escapeHtml(formatDate(item.createdAt))}</td>
            <td><button class="mini-btn danger" type="button" data-delete-record="support-requests" data-id="${item.id}">Delete</button></td>
          </tr>
        `
      )
      .join("");
  };

  const renderNewsletter = () => {
    const tbody = document.getElementById("newsletterRows");
    if (state.newsletter.length === 0) {
      tbody.innerHTML = emptyRow(5, "No newsletter subscribers found.");
      return;
    }

    tbody.innerHTML = state.newsletter
      .map(
        (item) => `
          <tr>
            <td><strong>${escapeHtml(item.email)}</strong></td>
            <td>${escapeHtml(item.sourcePage || "")}</td>
            <td>${statusSelect(item.id, item.status, "newsletter-subscribers", ["active", "unsubscribed"])}</td>
            <td>${escapeHtml(formatDate(item.subscribedAt))}</td>
            <td><button class="mini-btn danger" type="button" data-delete-record="newsletter-subscribers" data-id="${item.id}">Delete</button></td>
          </tr>
        `
      )
      .join("");
  };

  const renderAccounts = () => {
    const tbody = document.getElementById("accountRows");
    if (state.accounts.length === 0) {
      tbody.innerHTML = emptyRow(5, "No account login requests found.");
      return;
    }

    tbody.innerHTML = state.accounts
      .map(
        (item) => `
          <tr>
            <td><strong>${escapeHtml(item.email)}</strong></td>
            <td>${escapeHtml(item.sourcePage || "")}</td>
            <td>${escapeHtml(item.ipAddress || "")}</td>
            <td>${escapeHtml(formatDate(item.createdAt))}</td>
            <td><button class="mini-btn danger" type="button" data-delete-record="account-login-requests" data-id="${item.id}">Delete</button></td>
          </tr>
        `
      )
      .join("");
  };

  const renderLeads = () => {
    const tbody = document.getElementById("leadRows");
    if (state.leads.length === 0) {
      tbody.innerHTML = emptyRow(7, "No leads found.");
      return;
    }
    tbody.innerHTML = state.leads.map((item) => `
      <tr data-lead-priority="${escapeHtml(item.priority || "medium")}">
        <td><strong>${escapeHtml(item.name)}</strong><span class="muted-cell">${escapeHtml(item.email)}</span></td>
        <td>${escapeHtml(item.company || "—")}</td>
        <td>${escapeHtml(item.service || "—")}</td>
        <td><strong>${Number(item.score || 0)}</strong></td>
        <td>${statusBadge(item.priority)}</td>
        <td>${statusSelect(item.id, item.status, "leads", ["new", "contacted", "qualified", "proposal", "won", "lost"])}</td>
        <td>${escapeHtml(item.nextFollowUpAt ? formatDate(item.nextFollowUpAt) : "—")}</td>
      </tr>
    `).join("");
  };

  const renderQuotes = () => {
    const tbody = document.getElementById("quoteRows");
    if (state.quotes.length === 0) {
      tbody.innerHTML = emptyRow(6, "No quotation requests found.");
      return;
    }
    tbody.innerHTML = state.quotes.map((item) => `
      <tr>
        <td><strong>${escapeHtml(item.name)}</strong><span class="muted-cell">${escapeHtml(item.email)}</span></td>
        <td>${escapeHtml(item.service)}</td>
        <td>${escapeHtml(item.budget || "—")}</td>
        <td>${escapeHtml(item.currency || "BDT")}</td>
        <td>${statusSelect(item.id, item.status, "quotes", ["new", "reviewing", "quoted", "approved", "rejected", "archived"])}</td>
        <td>${escapeHtml(formatDate(item.createdAt))}</td>
      </tr>
    `).join("");
  };

  const renderClients = () => {
    const tbody = document.getElementById("clientRows");
    if (state.clients.length === 0) {
      tbody.innerHTML = emptyRow(5, "No client accounts found.");
      return;
    }
    tbody.innerHTML = state.clients.map((item) => `
      <tr><td>${escapeHtml(item.name)}</td><td>${escapeHtml(item.email)}</td><td>${escapeHtml(item.company || "—")}</td><td>${statusBadge(item.status)}</td><td>${escapeHtml(formatDate(item.createdAt))}</td></tr>
    `).join("");
  };

  const renderAnalytics = () => {
    const summary = state.analytics || {};
    const grid = document.getElementById("analyticsGrid");
    const rows = document.getElementById("analyticsRows");
    grid.innerHTML = `<article class="stat-card"><span>Total tracked events</span><strong>${Number(summary.total || 0)}</strong></article>`;
    rows.innerHTML = (summary.topEvents || []).map((item) => `<tr><td>${escapeHtml(item.eventName)}</td><td>${Number(item.total || 0)}</td></tr>`).join("") || emptyRow(2, "No analytics events found.");
  };

  const clearForm = (form) => {
    form.reset();
    form.elements.id.value = "";
    form.elements.author.value = "Albero Team";
    form.elements.status.value = "draft";
    form.elements.publishedAt.value = toDatetimeLocal();
  };

  const fillBlogForm = (item) => {
    clearForm(blogForm);
    Object.entries({
      id: item.id,
      title: item.title,
      slug: item.slug,
      category: item.category,
      author: item.author,
      status: item.status,
      publishedAt: toDatetimeLocal(item.publishedAt),
      imageUrl: item.imageUrl,
      imageAlt: item.imageAlt,
      excerpt: item.excerpt,
      content: item.content
    }).forEach(([key, value]) => {
      if (blogForm.elements[key]) blogForm.elements[key].value = value || "";
    });
  };

  const fillCaseForm = (item) => {
    clearForm(caseForm);
    Object.entries({
      id: item.id,
      title: item.title,
      slug: item.slug,
      category: item.category,
      clientName: item.clientName,
      author: item.author,
      status: item.status,
      publishedAt: toDatetimeLocal(item.publishedAt),
      imageUrl: item.imageUrl,
      imageAlt: item.imageAlt,
      excerpt: item.excerpt,
      challenge: item.challenge,
      solution: item.solution,
      outcome: item.outcome
    }).forEach(([key, value]) => {
      if (caseForm.elements[key]) caseForm.elements[key].value = value || "";
    });
  };

  const collectForm = (form) => {
    const formData = new FormData(form);
    return Object.fromEntries(formData.entries());
  };

  const loadOverview = async () => {
    try {
      const response = await adminFetch("/admin/summary");
      state.summary = response.data;
    } catch (error) {
      if (!isDatabaseUnavailable(error)) throw error;
      state.summary = {};
      setNotice("Logged in. MySQL is not connected yet, so dashboard data is unavailable.", "error");
    }

    renderSummary();
  };

  const loadBlog = async () => {
    try {
      const response = await adminFetch("/admin/blog-posts");
      state.blog = response.data || [];
    } catch (error) {
      if (!isDatabaseUnavailable(error)) throw error;
      state.blog = [];
      setNotice("Logged in. Connect MySQL to load and manage blog posts.", "error");
    }

    renderBlogRows();
    if (!blogForm.elements.id.value) clearForm(blogForm);
  };

  const loadCases = async () => {
    try {
      const response = await adminFetch("/admin/case-studies");
      state.cases = response.data || [];
    } catch (error) {
      if (!isDatabaseUnavailable(error)) throw error;
      state.cases = [];
      setNotice("Logged in. Connect MySQL to load and manage case studies.", "error");
    }

    renderCaseRows();
    if (!caseForm.elements.id.value) clearForm(caseForm);
  };

  const loadContacts = async () => {
    try {
      const response = await adminFetch("/admin/contact-messages");
      state.contacts = response.data || [];
    } catch (error) {
      if (!isDatabaseUnavailable(error)) throw error;
      state.contacts = [];
      setNotice("Logged in. Connect MySQL to load contact messages.", "error");
    }

    renderContacts();
  };

  const loadSupport = async () => {
    try {
      const response = await adminFetch("/admin/support-requests");
      state.support = response.data || [];
    } catch (error) {
      if (!isDatabaseUnavailable(error)) throw error;
      state.support = [];
      setNotice("Logged in. Connect MySQL to load support requests.", "error");
    }

    renderSupport();
  };

  const loadNewsletter = async () => {
    try {
      const response = await adminFetch("/admin/newsletter-subscribers");
      state.newsletter = response.data || [];
    } catch (error) {
      if (!isDatabaseUnavailable(error)) throw error;
      state.newsletter = [];
      setNotice("Logged in. Connect MySQL to load newsletter subscribers.", "error");
    }

    renderNewsletter();
  };

  const loadAccounts = async () => {
    try {
      const response = await adminFetch("/admin/account-login-requests");
      state.accounts = response.data || [];
    } catch (error) {
      if (!isDatabaseUnavailable(error)) throw error;
      state.accounts = [];
      setNotice("Logged in. Connect MySQL to load account requests.", "error");
    }

    renderAccounts();
  };

  const loadLeads = async () => {
    try { const response = await adminFetch("/admin/leads"); state.leads = response.data || []; }
    catch (error) { if (!isDatabaseUnavailable(error)) throw error; state.leads = []; setNotice("Logged in. Connect MySQL to load CRM leads.", "error"); }
    renderLeads();
  };

  const loadQuotes = async () => {
    try { const response = await adminFetch("/admin/quotes"); state.quotes = response.data || []; }
    catch (error) { if (!isDatabaseUnavailable(error)) throw error; state.quotes = []; setNotice("Logged in. Connect MySQL to load quotations.", "error"); }
    renderQuotes();
  };

  const loadClients = async () => {
    try { const response = await adminFetch("/admin/clients"); state.clients = response.data || []; }
    catch (error) { if (!isDatabaseUnavailable(error)) throw error; state.clients = []; setNotice("Logged in. Connect MySQL to load client accounts.", "error"); }
    renderClients();
  };

  const loadAnalytics = async () => {
    try { const response = await adminFetch("/analytics/summary"); state.analytics = response.data || {}; }
    catch (error) { if (!isDatabaseUnavailable(error)) throw error; state.analytics = {}; setNotice("Logged in. Connect MySQL to load analytics.", "error"); }
    renderAnalytics();
  };

  const loaders = {
    overview: loadOverview,
    blog: loadBlog,
    cases: loadCases,
    contacts: loadContacts,
    support: loadSupport,
    newsletter: loadNewsletter,
    accounts: loadAccounts,
    leads: loadLeads,
    quotes: loadQuotes,
    clients: loadClients,
    analytics: loadAnalytics
  };

  const loadView = async (view, force = false) => {
    if (!force && loadedViews.has(view)) return;
    setNotice("");
    setBusy(true);

    try {
      await loaders[view]();
      loadedViews.add(view);
      apiStatus.textContent = state.summary || view !== "overview" ? "Logged in" : "API connected";
    } catch (error) {
      setNotice(error.message, "error");
      apiStatus.textContent = "API error";
    } finally {
      setBusy(false);
    }
  };

  const switchView = (view) => {
    if (!views.includes(view)) return;
    state.activeView = view;

    document.querySelectorAll("[data-view]").forEach((button) => {
      button.classList.toggle("is-active", button.dataset.view === view);
    });

    document.querySelectorAll("[data-panel]").forEach((panel) => {
      panel.classList.toggle("is-active", panel.dataset.panel === view);
    });

    loadView(view);
  };

  const saveBlog = async () => {
    const payload = collectForm(blogForm);
    const id = payload.id;
    delete payload.id;

    if (!payload.slug) payload.slug = slugify(payload.title);

    const path = id ? `/admin/blog-posts/${id}` : "/admin/blog-posts";
    const method = id ? "PUT" : "POST";
    await adminFetch(path, { method, body: JSON.stringify(payload) });
    loadedViews.delete("blog");
    loadedViews.delete("overview");
    await loadBlog();
    setNotice("Blog post saved.", "success");
  };

  const saveCase = async () => {
    const payload = collectForm(caseForm);
    const id = payload.id;
    delete payload.id;

    if (!payload.slug) payload.slug = slugify(payload.title);

    const path = id ? `/admin/case-studies/${id}` : "/admin/case-studies";
    const method = id ? "PUT" : "POST";
    await adminFetch(path, { method, body: JSON.stringify(payload) });
    loadedViews.delete("cases");
    loadedViews.delete("overview");
    await loadCases();
    setNotice("Case study saved.", "success");
  };

  const deleteContent = async (type, idFromButton = "") => {
    const form = type === "blog" ? blogForm : caseForm;
    const id = idFromButton || form.elements.id.value;
    if (!id) {
      setNotice("Select an item first.", "error");
      return;
    }

    if (!window.confirm("Delete this item?")) return;

    const endpoint = type === "blog" ? "blog-posts" : "case-studies";
    await adminFetch(`/admin/${endpoint}/${id}`, { method: "DELETE" });
    clearForm(form);
    loadedViews.delete(type === "blog" ? "blog" : "cases");
    loadedViews.delete("overview");
    await (type === "blog" ? loadBlog() : loadCases());
    setNotice("Item deleted.", "success");
  };

  const updateRecordStatus = async (endpoint, id, status, control = null) => {
    const payload = { status };
    if (endpoint === "leads") {
      payload.priority = control?.closest("tr")?.dataset.leadPriority || "medium";
    }
    await adminFetch(`/admin/${endpoint}/${id}`, {
      method: "PATCH",
      body: JSON.stringify(payload)
    });
    loadedViews.delete("overview");
    setNotice("Status updated.", "success");
  };

  const deleteRecord = async (endpoint, id) => {
    if (!window.confirm("Delete this record?")) return;
    await adminFetch(`/admin/${endpoint}/${id}`, { method: "DELETE" });

    const viewByEndpoint = {
      "contact-messages": "contacts",
      "support-requests": "support",
      "newsletter-subscribers": "newsletter",
      "account-login-requests": "accounts"
    };
    const view = viewByEndpoint[endpoint];
    loadedViews.delete(view);
    loadedViews.delete("overview");
    await loadView(view, true);
    setNotice("Record deleted.", "success");
  };

  loginForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    setLoginMessage("");

    const payload = collectForm(loginForm);
    setBusy(true);

    try {
      const response = await fetch(`${API_BASE_URL}/admin/login`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data.message || "Login failed.");
      }

      state.token = "";
      loadedViews.clear();
      showApp();
      setNotice("Logged in successfully.", "success");
      switchView("overview");
      loginForm.reset();
    } catch (error) {
      setLoginMessage(error.message, "error");
    } finally {
      setBusy(false);
    }
  });

  document.getElementById("logoutBtn").addEventListener("click", async () => {
    try {
      await fetch(`${API_BASE_URL}/admin/logout`, { method: "POST", credentials: "include" });
    } finally {
      showLogin();
    }
  });

  document.getElementById("refreshBtn").addEventListener("click", () => {
    loadedViews.delete(state.activeView);
    loadView(state.activeView, true);
  });

  document.querySelectorAll("[data-view]").forEach((button) => {
    button.addEventListener("click", () => switchView(button.dataset.view));
  });

  document.addEventListener("click", async (event) => {
    const target = event.target;
    if (!(target instanceof HTMLElement)) return;

    const newType = target.getAttribute("data-content-new");
    if (newType === "blog") clearForm(blogForm);
    if (newType === "case") clearForm(caseForm);

    const editBlogId = target.getAttribute("data-edit-blog");
    if (editBlogId) {
      const item = state.blog.find((post) => String(post.id) === editBlogId);
      if (item) fillBlogForm(item);
    }

    const editCaseId = target.getAttribute("data-edit-case");
    if (editCaseId) {
      const item = state.cases.find((caseStudy) => String(caseStudy.id) === editCaseId);
      if (item) fillCaseForm(item);
    }

    const deleteBlogId = target.getAttribute("data-delete-blog");
    if (deleteBlogId) {
      setBusy(true);
      try {
        await deleteContent("blog", deleteBlogId);
      } catch (error) {
        setNotice(error.message, "error");
      } finally {
        setBusy(false);
      }
    }

    const deleteCaseId = target.getAttribute("data-delete-case");
    if (deleteCaseId) {
      setBusy(true);
      try {
        await deleteContent("case", deleteCaseId);
      } catch (error) {
        setNotice(error.message, "error");
      } finally {
        setBusy(false);
      }
    }

    const deleteContentType = target.getAttribute("data-content-delete");
    if (deleteContentType) {
      setBusy(true);
      try {
        await deleteContent(deleteContentType);
      } catch (error) {
        setNotice(error.message, "error");
      } finally {
        setBusy(false);
      }
    }

    const deleteRecordEndpoint = target.getAttribute("data-delete-record");
    if (deleteRecordEndpoint) {
      setBusy(true);
      try {
        await deleteRecord(deleteRecordEndpoint, target.dataset.id);
      } catch (error) {
        setNotice(error.message, "error");
      } finally {
        setBusy(false);
      }
    }
  });

  document.addEventListener("change", async (event) => {
    const target = event.target;
    if (!(target instanceof HTMLSelectElement)) return;
    const endpoint = target.getAttribute("data-status-endpoint");
    const id = target.getAttribute("data-status-id");
    if (!endpoint || !id) return;

    setBusy(true);
    try {
      await updateRecordStatus(endpoint, id, target.value, target);
    } catch (error) {
      setNotice(error.message, "error");
    } finally {
      setBusy(false);
    }
  });

  blogForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    setBusy(true);
    try {
      await saveBlog();
    } catch (error) {
      setNotice(error.message, "error");
    } finally {
      setBusy(false);
    }
  });

  caseForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    setBusy(true);
    try {
      await saveCase();
    } catch (error) {
      setNotice(error.message, "error");
    } finally {
      setBusy(false);
    }
  });

  [blogForm, caseForm].forEach((form) => {
    form.elements.title.addEventListener("blur", () => {
      if (!form.elements.slug.value.trim()) {
        form.elements.slug.value = slugify(form.elements.title.value);
      }
    });
  });

  const bootstrap = async () => {
    try {
      await adminFetch("/admin/session");
      showApp();
      switchView("overview");
    } catch {
      showLogin();
    }
  };

  bootstrap();
})();
