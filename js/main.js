/* =========================================================
   VARAM CONSTRUCTORA — main.js
   Nota: los enlaces de WhatsApp ya están escritos directo en el
   HTML (no dependen de JavaScript), para que funcionen siempre,
   incluso si algo falla al cargar este archivo.
   ========================================================= */

document.addEventListener("DOMContentLoaded", function () {

  /* ---------------------------------------------------------
     1. Header: fondo/sombra al hacer scroll + enlace activo
     --------------------------------------------------------- */
  const header = document.getElementById("header");
  const sections = document.querySelectorAll("section[id]");
  const navLinks = document.querySelectorAll(".nav__links a");

  function onScroll() {
    header.classList.toggle("is-scrolled", window.scrollY > 10);

    let current = "";
    sections.forEach((section) => {
      const top = section.offsetTop - 120;
      if (window.scrollY >= top) current = section.getAttribute("id");
    });

    navLinks.forEach((link) => {
      link.classList.toggle("is-active", link.getAttribute("href") === "#" + current);
    });
  }

  window.addEventListener("scroll", onScroll);
  onScroll();

  /* ---------------------------------------------------------
     2. Menú móvil (hamburguesa)
     --------------------------------------------------------- */
  const navToggle = document.getElementById("navToggle");

  if (navToggle) {
    navToggle.addEventListener("click", function () {
      const isOpen = header.classList.toggle("is-open");
      navToggle.setAttribute("aria-expanded", isOpen);
    });

    navLinks.forEach((link) => {
      link.addEventListener("click", () => header.classList.remove("is-open"));
    });
  }

  /* ---------------------------------------------------------
     3. Animación "reveal" al hacer scroll
     --------------------------------------------------------- */
  const revealItems = document.querySelectorAll(".reveal");
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );
  revealItems.forEach((item) => revealObserver.observe(item));

  /* ---------------------------------------------------------
     4. Galería de proyectos (páginas de detalle): cambiar la
        foto principal al hacer clic en una miniatura, incluido
        el logo, que se muestra grande con fondo propio.
     --------------------------------------------------------- */
  document.querySelectorAll(".proyecto").forEach((proyecto) => {
    const mainImgWrapper = proyecto.querySelector(".proyecto__main-img");
    const mainImg = proyecto.querySelector("[data-main-img]");
    const thumbs = proyecto.querySelectorAll(".proyecto__thumbs button");

    thumbs.forEach((thumb) => {
      thumb.addEventListener("click", () => {
        const newSrc = thumb.getAttribute("data-img");
        const isLogo = thumb.getAttribute("data-type") === "logo";

        mainImg.style.opacity = 0;
        setTimeout(() => {
          mainImg.src = newSrc;
          mainImgWrapper.classList.toggle("is-logo-frame", isLogo);
          mainImg.style.opacity = 1;
        }, 150);

        thumbs.forEach((t) => t.classList.remove("is-active"));
        thumb.classList.add("is-active");
      });
    });
  });

  /* ---------------------------------------------------------
     5. Carrusel circular infinito de logos (portada)
        - El logo activo queda grande y centrado
        - Los de los lados quedan más pequeños con un filtro
          oscuro semitransparente encima ("filtro opaco")
        - Cada 5 segundos avanza uno, en bucle infinito
     --------------------------------------------------------- */
  const carousel = document.getElementById("logoCarousel");

  if (carousel) {
    const slides = Array.from(carousel.querySelectorAll(".logo-slide"));
    const dots = document.querySelectorAll("#carouselDots button");
    const nameEl = document.getElementById("carouselName");
    const tagEl = document.getElementById("carouselTag");
    const total = slides.length;
    let current = 0;
    let timer = null;

    function renderCarousel() {
      slides.forEach((slide, i) => {
        slide.classList.remove("is-active", "is-prev", "is-next", "is-hidden");
        const diff = (i - current + total) % total;

        if (diff === 0) slide.classList.add("is-active");
        else if (diff === 1) slide.classList.add("is-next");
        else if (diff === total - 1) slide.classList.add("is-prev");
        else slide.classList.add("is-hidden");
      });

      dots.forEach((dot, i) => dot.classList.toggle("is-active", i === current));

      const active = slides[current];
      if (nameEl) nameEl.textContent = active.getAttribute("data-name");
      if (tagEl) tagEl.textContent = active.getAttribute("data-tag");
    }

    function nextSlide() {
      current = (current + 1) % total; // avance circular infinito
      renderCarousel();
    }

    function goTo(index) {
      current = ((index % total) + total) % total;
      renderCarousel();
    }

    function startTimer() { timer = setInterval(nextSlide, 3500); }
    function resetTimer() { clearInterval(timer); startTimer(); }

    dots.forEach((dot, i) => {
      dot.addEventListener("click", () => { goTo(i); resetTimer(); });
    });

    // Clic en un logo lateral: lo trae al frente directamente
    slides.forEach((slide, i) => {
      slide.addEventListener("click", () => {
        if (!slide.classList.contains("is-active")) { goTo(i); resetTimer(); }
      });
    });

    carousel.addEventListener("mouseenter", () => clearInterval(timer));
    carousel.addEventListener("mouseleave", startTimer);

    renderCarousel();
    startTimer();
  }

});
