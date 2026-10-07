(() => {
  const sourceWidth = 1280;
  const previews = [...document.querySelectorAll("[data-live-preview]")];
  previews.forEach((preview) => {
    const iframe = preview.querySelector("iframe");
    if (!iframe || !preview.querySelector(".preview-fallback")) return;
    iframe.addEventListener("load", () => {
      window.setTimeout(() => preview.classList.add("is-loaded"), 500);
    });
  });
  function resize(preview) {
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
