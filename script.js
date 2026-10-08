(() => {
  "use strict";
  const languages = ["en", "ru", "es", "vi", "zh"];
  const htmlLanguages = {
    en: "en",
    ru: "ru",
    es: "es",
    vi: "vi",
    zh: "zh-Hans",
  };
  const ogLocales = {
    en: "en_US",
    ru: "ru_RU",
    es: "es_ES",
    vi: "vi_VN",
    zh: "zh_CN",
  };
  const storage = {
    get(key) {
      try {
        return localStorage.getItem(key);
      } catch {
        return null;
      }
    },
    set(key, value) {
      try {
        localStorage.setItem(key, value);
      } catch {
        /* Storage is optional. */
      }
    },
  };
  const queryLanguage = new URLSearchParams(location.search).get("lang");
  let language = languages.includes(queryLanguage)
    ? queryLanguage
    : storage.get("hb-language");
  if (!languages.includes(language)) language = "en";
  const t = (key) =>
    window.portfolioTranslations[language][key] ??
    window.portfolioTranslations.en[key] ??
    key;
  window.portfolioI18n = {
    t,
    get language() {
      return language;
    },
  };
  const select = document.getElementById("language");
  const dialog = document.getElementById("case-dialog");
  let activeCase = null;
  const cases = {
    interior: { title: "Interior Arts", url: "https://interior-arts.ru/" },
    ashen: { title: "Ashen Archive", url: "https://ashen-archive.pages.dev/" },
    soberu: { title: "Soberu", url: "https://soberu.soberu-app.workers.dev/" },
    lines: { title: "Lines of Arts", url: "https://lines-of-arts.pages.dev/" },
  };
  function renderCase(id) {
    const project = cases[id];
    document.getElementById("case-title").textContent = project.title;
    const builtHeading = document.querySelector('[data-i18n="caseBuilt"]');
    builtHeading.textContent = t("caseBuilt");
    for (const part of ["summary", "challenge", "status"])
      document.getElementById(`case-${part}`).textContent = t(
        `${id}Case${part[0].toUpperCase()}${part.slice(1)}`,
      );
    const features = document.getElementById("case-features");
    features.replaceChildren(
      ...t(`${id}CaseFeatures`).map((feature) => {
        const li = document.createElement("li");
        li.textContent = feature;
        return li;
      }),
    );
    const caseLink = document.getElementById("case-link");
    caseLink.hidden = !project.url;
    if (project.url) caseLink.href = project.url;
    else caseLink.removeAttribute("href");
  }
  function renderLanguage() {
    document.documentElement.lang = htmlLanguages[language];
    select.value = language;
    document.querySelectorAll("[data-i18n]").forEach((el) => {
      const value = t(el.dataset.i18n);
      // Only explicit line breaks in our own translations become HTML elements.
      el.replaceChildren(
        ...value
          .split("<br>")
          .flatMap((line, index) =>
            index
              ? [document.createElement("br"), document.createTextNode(line)]
              : [document.createTextNode(line)],
          ),
      );
    });
    document
      .querySelectorAll("[data-i18n-aria]")
      .forEach((el) => el.setAttribute("aria-label", t(el.dataset.i18nAria)));
    document
      .querySelectorAll("[data-i18n-alt]")
      .forEach((el) => (el.alt = t(el.dataset.i18nAlt)));
    document.title = t("pageTitle");
    document.querySelector('meta[name="description"]').content =
      t("pageDescription");
    document.querySelector('meta[property="og:title"]').content =
      t("pageTitle");
    document.querySelector('meta[property="og:description"]').content =
      t("pageDescription");
    document.querySelector('meta[property="og:locale"]').content =
      ogLocales[language];
    document.querySelector('meta[property="og:image:alt"]').content =
      t("socialAlt");
    document.getElementById("copy-status").textContent = "";
    if (activeCase) renderCase(activeCase);
    document.dispatchEvent(
      new CustomEvent("portfolio:language", { detail: { language } }),
    );
  }
  select.addEventListener("change", () => {
    language = select.value;
    storage.set("hb-language", language);
    renderLanguage();
    const url = new URL(location.href);
    url.searchParams.set("lang", language);
    history.replaceState(null, "", url);
  });
  renderLanguage();
  const toggle = document.getElementById("theme-toggle");
  const storedTheme = storage.get("hb-theme");
  let theme = ["light", "dark"].includes(storedTheme) ? storedTheme : "light";
  function renderTheme() {
    document.documentElement.dataset.theme = theme;
    toggle.setAttribute("aria-pressed", String(theme === "dark"));
    document.querySelector('meta[name="theme-color"]').content =
      theme === "dark" ? "#171c18" : "#f5f3ec";
  }
  renderTheme();
  toggle.addEventListener("click", () => {
    theme = theme === "light" ? "dark" : "light";
    storage.set("hb-theme", theme);
    renderTheme();
  });
  const menuButton = document.querySelector(".menu-toggle");
  const navigation = document.getElementById("navigation");
  function closeMenu() {
    menuButton.setAttribute("aria-expanded", "false");
    navigation.classList.remove("is-open");
  }
  menuButton.addEventListener("click", () => {
    const open = menuButton.getAttribute("aria-expanded") !== "true";
    menuButton.setAttribute("aria-expanded", String(open));
    navigation.classList.toggle("is-open", open);
  });
  navigation
    .querySelectorAll("a")
    .forEach((link) => link.addEventListener("click", closeMenu));
  document.addEventListener("click", (event) => {
    if (
      !navigation.contains(event.target) &&
      !menuButton.contains(event.target)
    )
      closeMenu();
  });
  document.addEventListener("keydown", (event) => {
    if (
      event.key === "Escape" &&
      menuButton.getAttribute("aria-expanded") === "true"
    ) {
      closeMenu();
      menuButton.focus();
    }
  });
  matchMedia("(min-width:761px)").addEventListener("change", closeMenu);
  document.querySelectorAll("[data-case]").forEach((button) =>
    button.addEventListener("click", () => {
      activeCase = button.dataset.case;
      renderCase(activeCase);
      dialog.showModal();
    }),
  );
  document
    .getElementById("close-dialog")
    .addEventListener("click", () => dialog.close());
  dialog.addEventListener("click", (event) => {
    if (event.target !== dialog) return;
    const rect = dialog.getBoundingClientRect();
    if (
      event.clientX < rect.left ||
      event.clientX > rect.right ||
      event.clientY < rect.top ||
      event.clientY > rect.bottom
    )
      dialog.close();
  });
  dialog.addEventListener("close", () => {
    activeCase = null;
  });
  document.getElementById("copy-email").addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText("andreyzh24@gmail.com");
      document.getElementById("copy-status").textContent = t("copied");
    } catch {
      document.getElementById("copy-status").textContent = t("copyFailed");
    }
  });
  document.getElementById("year").textContent = String(
    new Date().getFullYear(),
  );
})();
