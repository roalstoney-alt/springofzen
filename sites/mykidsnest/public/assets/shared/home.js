(() => {
  "use strict";

  const slides = [...document.querySelectorAll("[data-slide]")];
  const dots = [...document.querySelectorAll("[data-slide-to]")];
  const live = document.querySelector("[data-carousel-live]");
  const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
  let index = 0;
  let timer = 0;
  let manuallyPaused = false;
  let pointerStart = null;

  function show(next, announce = true) {
    index = (next + slides.length) % slides.length;
    slides.forEach((slide, slideIndex) => {
      const active = slideIndex === index;
      slide.classList.toggle("is-active", active);
      slide.setAttribute("aria-hidden", String(!active));
      slide.querySelector("a")?.setAttribute("tabindex", active ? "0" : "-1");
    });
    dots.forEach((dot, dotIndex) => dot.setAttribute("aria-current", String(dotIndex === index)));
    if (announce && live) live.textContent = `${slides[index].dataset.world} world, slide ${index + 1} of ${slides.length}`;
  }

  function stopAutoplay() {
    manuallyPaused = true;
    clearInterval(timer);
    timer = 0;
  }

  function startAutoplay() {
    clearInterval(timer);
    if (reducedMotion || manuallyPaused || document.hidden) return;
    timer = window.setInterval(() => show(index + 1, false), 7000);
  }

  function manualMove(next) {
    stopAutoplay();
    show(next);
  }

  document.querySelectorAll("[data-direction]").forEach((button) => {
    button.addEventListener("click", () => manualMove(index + (button.dataset.direction === "next" ? 1 : -1)));
  });
  dots.forEach((dot) => dot.addEventListener("click", () => manualMove(Number(dot.dataset.slideTo))));

  window.addEventListener("keydown", (event) => {
    if (event.key === "ArrowRight") manualMove(index + 1);
    if (event.key === "ArrowLeft") manualMove(index - 1);
  });

  const carousel = document.querySelector("[data-carousel]");
  carousel.addEventListener("pointerdown", (event) => { pointerStart = { x: event.clientX, y: event.clientY }; });
  carousel.addEventListener("pointerup", (event) => {
    if (!pointerStart) return;
    const dx = event.clientX - pointerStart.x;
    const dy = event.clientY - pointerStart.y;
    pointerStart = null;
    if (Math.abs(dx) > 46 && Math.abs(dx) > Math.abs(dy) * 1.25) manualMove(index + (dx < 0 ? 1 : -1));
  });
  carousel.addEventListener("pointercancel", () => { pointerStart = null; });
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) clearInterval(timer);
    else startAutoplay();
  });

  show(0, false);
  startAutoplay();
})();
