(() => {
  const localHosts = new Set(["localhost", "127.0.0.1", "::1"]);
  const separate = localHosts.has(window.location.hostname) && window.location.port && window.location.port !== "5000";
  const API_BASE_URL = window.ALBERO_API_BASE_URL || (window.location.protocol === "file:" || separate ? "http://localhost:5000/api" : `${window.location.origin}/api`);
  const loginView = document.querySelector("[data-portal-login]");
  const dashboard = document.querySelector("[data-portal-dashboard]");
  const form = document.querySelector(".portal-form");
  const status = form?.querySelector("[data-portal-status]");
  const userName = document.querySelector("[data-portal-user]");
  const orders = document.querySelector("[data-portal-orders]");
  const setStatus = (message, type = "") => { if (status) { status.textContent = message; status.dataset.status = type; } };
  const escapeHtml = (value) => String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#39;");

  const request = async (path, options = {}) => {
    const response = await fetch(`${API_BASE_URL}${path}`, { ...options, credentials: "include", headers: { "Content-Type": "application/json", ...(options.headers || {}) } });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(data.message || "Request failed.");
    return data;
  };

  const showDashboard = async (user) => {
    loginView.hidden = true;
    dashboard.hidden = false;
    if (userName) userName.textContent = user?.name || "Client";
    try {
      const response = await request("/client/orders");
      const items = response.data || [];
      orders.innerHTML = items.length ? items.map((item) => `<article class="portal-order"><strong>${escapeHtml(item.orderNumber)}</strong><span>${escapeHtml(item.currency)} ${escapeHtml(item.amount)}</span><span>${escapeHtml(item.status)}</span><span>${escapeHtml(new Date(item.createdAt).toLocaleDateString())}</span></article>`).join("") : "<p>No orders or project records are available yet.</p>";
    } catch { orders.innerHTML = "<p>Orders will appear here when your project workspace is active.</p>"; }
  };

  form?.addEventListener("submit", async (event) => {
    event.preventDefault();
    setStatus("Signing in…");
    const data = Object.fromEntries(new FormData(form).entries());
    try { const response = await request("/client/login", { method: "POST", body: JSON.stringify(data) }); setStatus("", "success"); await showDashboard(response.user); }
    catch (error) { setStatus(error.message, "error"); }
  });

  document.querySelector("[data-portal-logout]")?.addEventListener("click", async () => { await request("/client/logout", { method: "POST" }).catch(() => {}); dashboard.hidden = true; loginView.hidden = false; });

  request("/client/session").then((response) => showDashboard(response.user)).catch(() => { loginView.hidden = false; dashboard.hidden = true; });
})();
