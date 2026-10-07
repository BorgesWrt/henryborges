(() => {
  if (!["127.0.0.1", "localhost"].includes(location.hostname)) return;
  async function update() {
    try {
      const response = await fetch("pics/projects/manifest.json", {
        cache: "no-store",
      });
      if (!response.ok) return;
      const manifest = await response.json();
      for (const image of document.querySelectorAll("img[data-preview]")) {
        const entry = manifest[image.dataset.preview];
        if (!entry || !/^pics\/projects\/[a-z-]+\.webp$/.test(entry.src))
          continue;
        const src = `${entry.src}?v=${encodeURIComponent(entry.capturedAt)}`;
        if (image.dataset.previewVersion === src) continue;
        const candidate = new Image();
        candidate.onload = () => {
          image.src = src;
          image.dataset.previewVersion = src;
        };
        candidate.src = src;
      }
    } catch {
      /* The bundled preview remains available offline. */
    }
  }
  update();
  setInterval(() => {
    if (!document.hidden) update();
  }, 60000);
  document.addEventListener("visibilitychange", () => {
    if (!document.hidden) update();
  });
})();
