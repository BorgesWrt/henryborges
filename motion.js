(() => {
  const preference = matchMedia("(prefers-reduced-motion: reduce)");
  const mobile = matchMedia("(max-width: 1024px)");
  if (!("IntersectionObserver" in window)) return;
  let observer;
  const targets = [
    ...document.querySelectorAll(
      ".section-heading, .project, .usp-grid > article, .about-grid, .skill-grid > article, .contact-heading, .network-footer",
    ),
  ];
  function reveal(element) {
    element.classList.remove("reveal-pending");
    observer?.unobserve(element);
  }
  function initialize() {
    observer?.disconnect();
    targets.forEach((element) => element.classList.remove("reveal-pending"));
    if (preference.matches || mobile.matches) return;
    observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) reveal(entry.target);
        });
      },
      { threshold: 0, rootMargin: "0px 0px -24px 0px" },
    );
    targets.forEach((element) => {
      element.classList.add("scroll-reveal");
      const rect = element.getBoundingClientRect();
      if (rect.top > innerHeight || rect.bottom < 0) {
        element.classList.add("reveal-pending");
        observer.observe(element);
      }
    });
  }
  document.addEventListener("focusin", (event) => {
    const target = event.target.closest(".reveal-pending");
    if (target) reveal(target);
  });
  preference.addEventListener("change", initialize);
  mobile.addEventListener("change", initialize);
  initialize();
})();
