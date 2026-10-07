(() => {
  "use strict";
  const config = window.portfolioConfig;
  const id = config?.gaMeasurementId;
  if (
    !/^G-[A-Z0-9]+$/.test(id ?? "") ||
    !config.analyticsHostnames.includes(location.hostname)
  )
    return;
  const banner = document.getElementById("analytics-banner");
  const settings = document.getElementById("analytics-settings");
  settings.hidden = false;
  const key = "hb-analytics-consent";
  let choice = null;
  try {
    choice = localStorage.getItem(key);
  } catch {
    /* Ask again if preferences cannot be stored. */
  }
  let loaded = false;
  function enable() {
    window[`ga-disable-${id}`] = false;
    if (loaded) {
      window.gtag("consent", "update", {
        analytics_storage: "granted",
        ad_storage: "denied",
        ad_user_data: "denied",
        ad_personalization: "denied",
      });
      return;
    }
    loaded = true;
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () {
      window.dataLayer.push(arguments);
    };
    window.gtag("consent", "default", {
      analytics_storage: "denied",
      ad_storage: "denied",
      ad_user_data: "denied",
      ad_personalization: "denied",
    });
    window.gtag("consent", "update", {
      analytics_storage: "granted",
      ad_storage: "denied",
      ad_user_data: "denied",
      ad_personalization: "denied",
    });
    window.gtag("js", new Date());
    window.gtag("config", id, {
      send_page_view: true,
      cookie_domain: location.hostname,
      allow_google_signals: false,
      allow_ad_personalization_signals: false,
      page_location: location.origin + location.pathname,
      language: document.documentElement.lang,
    });
    const script = document.createElement("script");
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(id)}`;
    document.head.append(script);
  }
  function disable() {
    window[`ga-disable-${id}`] = true;
    if (loaded)
      window.gtag("consent", "update", {
        analytics_storage: "denied",
        ad_storage: "denied",
        ad_user_data: "denied",
        ad_personalization: "denied",
      });
    // Remove cookies created on this exact hostname when consent is withdrawn.
    document.cookie.split(";").forEach((cookie) => {
      const name = cookie.trim().split("=")[0];
      if (name === "_ga" || name.startsWith("_ga_")) {
        document.cookie = `${name}=;Max-Age=0;path=/`;
        document.cookie = `${name}=;Max-Age=0;path=/;domain=${location.hostname}`;
      }
    });
  }
  function setChoice(value) {
    choice = value;
    try {
      localStorage.setItem(key, value);
    } catch {
      /* Consent applies to this visit. */
    }
    banner.hidden = true;
    value === "granted" ? enable() : disable();
  }
  document
    .getElementById("analytics-accept")
    .addEventListener("click", () => setChoice("granted"));
  document
    .getElementById("analytics-decline")
    .addEventListener("click", () => setChoice("denied"));
  settings.addEventListener("click", () => {
    banner.hidden = false;
    document.getElementById("analytics-decline").focus();
  });
  if (choice === "granted") enable();
  else if (choice === "denied") disable();
  else banner.hidden = false;
  // Events contain only fixed UI identifiers, never messages or contact details.
  document.addEventListener("portfolio:language", (event) => {
    if (choice === "granted" && loaded)
      window.gtag("event", "language_change", {
        selected_language: event.detail.language,
      });
  });
  document.querySelectorAll("[data-case]").forEach((button) =>
    button.addEventListener("click", () => {
      if (choice === "granted" && loaded)
        window.gtag("event", "project_open", {
          project_id: button.dataset.case,
        });
    }),
  );
})();
