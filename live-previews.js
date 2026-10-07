(() => {
  const sourceWidth = 1280;
  const previews = [...document.querySelectorAll("[data-live-preview]")];
  const wideScreen = matchMedia("(min-width: 1025px)");
  previews.forEach((preview) => {
    const iframe = preview.querySelector("iframe");
    if (!iframe) return;
    iframe.addEventListener("load", () => {
      if (wideScreen.matches)
        window.setTimeout(() => {
          if (wideScreen.matches && iframe.hasAttribute("src"))
            preview.classList.add("is-loaded");
        }, 500);
    });
  });
  function updateFrames() {
    previews.forEach((preview) => {
      const iframe = preview.querySelector("iframe");
      if (!iframe) return;
      if (wideScreen.matches) {
        if (!iframe.hasAttribute("src")) iframe.src = iframe.dataset.src;
      } else {
        preview.classList.remove("is-loaded");
        iframe.removeAttribute("src");
      }
    });
  }
  wideScreen.addEventListener("change", updateFrames);
  updateFrames();
  function resize(preview) {
    if (!wideScreen.matches) return;
    const width = preview.getBoundingClientRect().width;
    if (!width) return;
    preview.style.setProperty("--preview-scale", String(width / sourceWidth));
  }
  if ("ResizeObserver" in window) {
    const observer = new ResizeObserver((entries) =>
      entries.forEach((entry) => resize(entry.target)),
    );
    previews.forEach((preview) => {
      resize(preview);
      observer.observe(preview);
    });
  } else {
    previews.forEach(resize);
    window.addEventListener("resize", () => previews.forEach(resize));
  }
})();
