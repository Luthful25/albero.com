(() => {
  if (document.getElementById("assistantPanel")) return;

  const apiBase = () => {
    const local = new Set(["localhost", "127.0.0.1", "::1"]);
    const separate = local.has(window.location.hostname) && window.location.port && window.location.port !== "5000";
    return window.location.protocol === "file:" || separate ? "http://localhost:5000/api" : `${window.location.origin}/api`;
  };

  document.body.insertAdjacentHTML("beforeend", `
    <button class="assistant-launcher" type="button" aria-label="Open Albero assistant" aria-expanded="false" aria-controls="assistantPanel"><img src="assets/logo-site.png" alt="" aria-hidden="true" /></button>
    <section class="assistant-panel" id="assistantPanel" hidden aria-label="Albero assistant">
      <header class="assistant-panel__header"><div class="assistant-panel__brand"><img src="assets/logo-site.png" alt="" aria-hidden="true" /><strong>Albero Assistant</strong></div><span>Ask about services, security, AI, or quotations.</span></header>
      <div class="assistant-panel__messages" data-assistant-messages aria-live="polite"><p class="assistant-message">How can we help you explore your next technology project?</p></div>
      <form class="assistant-panel__form"><input name="message" autocomplete="off" placeholder="Ask a question..." required maxlength="500" /><button type="submit">Send</button></form>
    </section>
  `);

  const launcher = document.querySelector(".assistant-launcher");
  const panel = document.getElementById("assistantPanel");
  const messages = panel?.querySelector("[data-assistant-messages]");
  const form = panel?.querySelector("form");
  const input = form?.querySelector("input");
  const submitButton = form?.querySelector('button[type="submit"]');
  const history = [];

  const addMessage = (message, type = "assistant") => {
    if (!(messages instanceof HTMLElement)) return;
    const element = document.createElement("p");
    element.className = `assistant-message${type === "user" ? " assistant-message--user" : ""}`;
    element.textContent = message;
    messages.append(element);
    messages.scrollTop = messages.scrollHeight;
  };

  const setBusy = (busy) => {
    if (submitButton instanceof HTMLButtonElement) submitButton.disabled = busy;
    if (input instanceof HTMLInputElement) input.disabled = busy;
    form?.setAttribute("aria-busy", String(busy));
  };

  const toggle = (open) => {
    if (!(panel instanceof HTMLElement) || !(launcher instanceof HTMLButtonElement)) return;
    panel.hidden = !open;
    launcher.setAttribute("aria-expanded", String(open));
    if (open) input?.focus();
  };

  launcher?.addEventListener("click", () => toggle(panel?.hidden));
  form?.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (!(input instanceof HTMLInputElement) || !(messages instanceof HTMLElement)) return;
    const message = input.value.trim();
    if (!message) return;

    addMessage(message, "user");
    history.push({ role: "user", content: message });
    input.value = "";
    setBusy(true);

    const thinking = document.createElement("p");
    thinking.className = "assistant-message assistant-message--thinking";
    thinking.textContent = "Thinking...";
    messages.append(thinking);
    messages.scrollTop = messages.scrollHeight;

    try {
      const response = await fetch(`${apiBase()}/assistant`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message, messages: history.slice(-13, -1), sourcePage: window.location.pathname })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Assistant unavailable.");

      const result = data.data || {};
      const answer = result.answer || "Please contact our team.";
      thinking.remove();
      addMessage(answer);
      history.push({ role: "assistant", content: answer });

      if (result.suggestedAction) {
        const action = document.createElement("a");
        action.className = "assistant-message__action";
        action.href = result.suggestedUrl || "quote.html";
        action.textContent = result.suggestedAction;
        messages.append(action);
      }
    } catch (error) {
      thinking.remove();
      const statusMessage = error instanceof TypeError
        ? "Assistant server is offline. Please start the Albero backend and try again."
        : "OpenAI assistant is temporarily unavailable. Please try again shortly.";
      addMessage(statusMessage);
    } finally {
      setBusy(false);
      input.focus();
    }
  });
})();
