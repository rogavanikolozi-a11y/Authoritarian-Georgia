/* swiss.js: small behaviours for the Swiss redesign.
   1. The Brussels-Moscow needle drifts towards Moscow as the reader scrolls,
      but never reaches it (from 12% to 85% of the way).
   2. Headings fade in once when they scroll into view (skipped with reduced motion). */
(function () {
  var root = document.documentElement, ticking = false;
  function update() {
    var h = root.scrollHeight - window.innerHeight;
    var p = h > 0 ? Math.min(1, Math.max(0, window.scrollY / h)) : 0;
    root.style.setProperty("--s-p", (0.12 + 0.73 * p).toFixed(4));
    ticking = false;
  }
  window.addEventListener("scroll", function () { if (!ticking) { ticking = true; requestAnimationFrame(update); } }, { passive: true });
  window.addEventListener("resize", update);
  update();

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches || !("IntersectionObserver" in window)) return;
  document.querySelectorAll(".chapter__head, .sw-stats").forEach(function (el) { el.classList.add("sw-in"); });
  var io = new IntersectionObserver(function (es) {
    es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add("is-seen"); io.unobserve(e.target); } });
  }, { rootMargin: "0px 0px -10% 0px" });
  document.querySelectorAll(".sw-in").forEach(function (el) { io.observe(el); });
})();
