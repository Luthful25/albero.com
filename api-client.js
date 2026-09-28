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

  const postJson = async (path, payload) => {
    const response = await fetch(`${API_BASE_URL}${path}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      const error = new Error(data.message || "Request failed.");
      error.status = response.status;
      error.data = data;
      throw error;
    }

    return data;
  };

  const getJson = async (path) => {
    const response = await fetch(`${API_BASE_URL}${path}`);
    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      const error = new Error(data.message || "Request failed.");
      error.status = response.status;
      error.data = data;
      throw error;
    }

    return data;
  };

  const getSourcePage = () => `${window.location.pathname}${window.location.search}`;

  const getOrCreateStatus = (form) => {
    let status = form.querySelector("[data-form-status]");
    if (status instanceof HTMLElement) return status;

    status = document.createElement("p");
    status.className = "api-form-status";
    status.setAttribute("data-form-status", "");
    status.setAttribute("role", "status");
    status.setAttribute("aria-live", "polite");
    form.append(status);
    return status;
  };

  const setStatus = (form, type, message) => {
    const status = getOrCreateStatus(form);
    status.dataset.status = type;
    status.textContent = message;
  };

  const setBusy = (form, busy) => {
    const submitButton = form.querySelector('button[type="submit"], input[type="submit"]');
    form.setAttribute("aria-busy", String(busy));

    if (submitButton instanceof HTMLButtonElement || submitButton instanceof HTMLInputElement) {
      submitButton.disabled = busy;
    }
  };

  const openMailFallback = (subject, body) => {
    window.location.href = `mailto:hello@alberostudio.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  const isNetworkError = (error) => !error.status;

  const submitContactForm = async (form) => {
    const formData = new FormData(form);
    const payload = {
      name: String(formData.get("name") || "").trim(),
      email: String(formData.get("email") || "").trim(),
      phone: String(formData.get("phone") || "").trim(),
      company: String(formData.get("company") || "").trim(),
      subject: String(formData.get("subject") || "").trim(),
      service: String(formData.get("service") || "").trim(),
      message: String(formData.get("message") || "").trim(),
      sourcePage: getSourcePage()
    };

    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    setBusy(form, true);

    try {
      await postJson("/contact", payload);
      form.reset();
      setStatus(form, "success", "Thanks. Your message has been received.");
    } catch (error) {
      if (isNetworkError(error)) {
        openMailFallback(
          "Free consultation request from Albero website",
          `Please contact me about Albero services.\n\nName: ${payload.name}\nEmail: ${payload.email}\nOrganization: ${payload.company}\nSubject: ${payload.subject}\nNeed: ${payload.message}`
        );
        form.reset();
        return;
      }

      setStatus(form, "error", error.message || "Please try again.");
    } finally {
      setBusy(form, false);
    }
  };

  const submitNewsletterForm = async (form) => {
    const emailInput = form.querySelector('input[type="email"]');
    if (!(emailInput instanceof HTMLInputElement)) return;

    const payload = {
      email: emailInput.value.trim(),
      sourcePage: getSourcePage()
    };

    if (!emailInput.checkValidity()) {
      emailInput.reportValidity();
      return;
    }

    setBusy(form, true);

    try {
      await postJson("/newsletter", payload);
      form.reset();
      setStatus(form, "success", "Thanks. You are on the list.");
    } catch (error) {
      if (isNetworkError(error)) {
        openMailFallback(
          "New project inquiry from Albero website",
          `Please contact me about Albero services.\n\nEmail: ${payload.email}`
        );
        form.reset();
        return;
      }

      setStatus(form, "error", error.message || "Please try again.");
    } finally {
      setBusy(form, false);
    }
  };

  const submitQuoteForm = async (form) => {
    const formData = new FormData(form);
    const payload = {
      name: String(formData.get("name") || "").trim(),
      email: String(formData.get("email") || "").trim(),
      phone: String(formData.get("phone") || "").trim(),
      company: String(formData.get("company") || "").trim(),
      service: String(formData.get("service") || "").trim(),
      brief: String(formData.get("brief") || "").trim(),
      budget: String(formData.get("budget") || "").trim(),
      currency: "BDT",
      sourcePage: getSourcePage()
    };

    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    setBusy(form, true);
    try {
      await postJson("/quotes", payload);
      form.reset();
      setStatus(form, "success", "Your quotation request has been received.");
    } catch (error) {
      setStatus(form, "error", error.message || "Please try again.");
    } finally {
      setBusy(form, false);
    }
  };

  const requestAccountLogin = async (email) =>
    postJson("/accounts/login-request", {
      email,
      sourcePage: getSourcePage()
    });

  document.addEventListener(
    "submit",
    (event) => {
      const form = event.target;
      if (!(form instanceof HTMLFormElement)) return;

      if (form.matches(".contact-form")) {
        event.preventDefault();
        event.stopImmediatePropagation();
        submitContactForm(form);
        return;
      }

      if (form.matches(".cta-form")) {
        event.preventDefault();
        event.stopImmediatePropagation();
        submitNewsletterForm(form);
        return;
      }

      if (form.matches(".quote-form")) {
        event.preventDefault();
        event.stopImmediatePropagation();
        submitQuoteForm(form);
      }
    },
    true
  );

  window.AlberoApi = {
    API_BASE_URL,
    getJson,
    postJson,
    requestAccountLogin,
    submitContactForm,
    submitNewsletterForm,
    submitQuoteForm
  };
})();
