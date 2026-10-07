(() => {
  const sourceWidth = 1280;
  const previews = [...document.querySelectorAll("[data-live-preview]")];
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
