(() => {
  const root = document.documentElement;
  const body = document.body;
  const buttons = [...document.querySelectorAll("[data-set-lang]")];
  const internalLinks = [...document.querySelectorAll('.identity, .site-nav a, a[data-preserve-lang]')];
  const storageKey = "wenjie-qian-site-language-v2";

  function savedLanguage() {
    const query = new URLSearchParams(window.location.search).get("lang");
    if (query === "en" || query === "zh") return query;
    try {
      const stored = localStorage.getItem(storageKey);
      return stored === "zh" || stored === "en" ? stored : "en";
    } catch (_) {
      return "en";
    }
  }

  function updateInternalLinks(language) {
    internalLinks.forEach((link) => {
      if (!link.dataset.baseHref) link.dataset.baseHref = link.getAttribute("href");
      const base = link.dataset.baseHref;
      link.setAttribute("href", language === "zh" ? `${base}?lang=zh` : base);
    });
  }

  function setLanguage(language, save = true) {
    const selected = language === "zh" ? "zh" : "en";
    root.dataset.lang = selected;
    root.lang = selected === "zh" ? "zh-CN" : "en";
    document.title = selected === "zh" ? body.dataset.titleZh : body.dataset.titleEn;

    const meta = document.querySelector('meta[name="description"]');
    if (meta) meta.setAttribute("content", meta.dataset[selected]);

    buttons.forEach((button) => button.setAttribute("aria-pressed", String(button.dataset.setLang === selected)));
    updateInternalLinks(selected);

    if (save) {
      try { localStorage.setItem(storageKey, selected); } catch (_) { /* Language still works without storage. */ }
    }
  }

  buttons.forEach((button) => button.addEventListener("click", () => setLanguage(button.dataset.setLang)));
  setLanguage(savedLanguage(), false);

  const year = document.querySelector("#current-year");
  if (year) year.textContent = new Date().getFullYear();
})();
