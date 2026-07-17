/* =========================================================
   VARAM CONSTRUCTORA — main.js
   Todo el JavaScript del sitio, comentado paso a paso.
   ========================================================= */

document.addEventListener("DOMContentLoaded", function () {

  /* ---------------------------------------------------------
     0. WhatsApp: número y mensajes pre-armados
     ---------------------------------------------------------
     Todos los botones/enlaces con data-wa="home" reciben el
     mensaje general (lista de los 3 proyectos).
     Los que tienen data-wa-project="Nombre" reciben un mensaje
     ya enfocado en ese proyecto puntual.
     --------------------------------------------------------- */
  const WA_NUMBER = "573116824142"; // 57 = Colombia + número sin espacios

  const HOME_MESSAGE =
    "Hola, vengo desde la página de VARAM Constructora y quiero información. " +
    "¿Qué proyecto te interesa conocer?\n1. Villa Toscana\n2. Barlovento\n3. Vientum";

  function projectMessage(name) {
    return (
      "Hola, vengo desde la página de VARAM Constructora. " +
      "Quiero más información sobre el proyecto " + name + ". " +
      "¿Qué necesito saber para dar el siguiente paso?"
    );
  }

  function waLink(message) {
    return "https://wa.me/" + WA_NUMBER + "?text=" + encodeURIComponent(message);
  }

  // Botones/enlaces genéricos (mensaje con el listado de proyectos)
  document.querySelectorAll("[data-wa='home']").forEach((el) => {
    el.setAttribute("href", waLink(HOME_MESSAGE));
  });

  // Botones de "contactar sobre este proyecto" (mensaje específico)
  document.querySelectorAll("[data-wa-project]").forEach((el) => {
    const projectName = el.getAttribute("data-wa-project");
    el.setAttribute("href", waLink(projectMessage(projectName)));
  });

  /* ---------------------------------------------------------
     1. Header: sombra/fondo al hacer scroll + enlace activo
     --------------------------------------------------------- */
  const header = document.getElementById("header");
  const sections = document.querySelectorAll("section[id]");
  const navLinks = document.querySelectorAll(".nav__links a");

  function onScroll() {
    header.classList.toggle("is-scrolled", window.scrollY > 10);

    let current = "";
    sections.forEach((section) => {
      const top = section.offsetTop - 120;
      if (window.scrollY >= top) {
        current = section.getAttribute("id");
      }
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
     3. Animación "reveal": los elementos aparecen al hacer scroll
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
     4. Galería de proyectos: cambiar la foto principal
        al hacer clic en una miniatura (incluye el logo)
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
     5. Carrusel del catálogo (portada con los 3 proyectos)
        Autoplay cada 5 segundos + navegación por puntos
     --------------------------------------------------------- */
  const carousel = document.getElementById("catalogoCarousel");

  if (carousel) {
    const slides = carousel.querySelectorAll(".carousel__slide");
    const dots = carousel.querySelectorAll(".carousel__dots button");
    let current = 0;
    let timer = null;

    function renderCarousel() {
      slides.forEach((slide, i) => {
        slide.classList.remove("is-active", "is-prev", "is-next", "is-hidden");
        const diff = (i - current + slides.length) % slides.length;

        if (diff === 0) slide.classList.add("is-active");
        else if (diff === 1) slide.classList.add("is-next");
        else if (diff === slides.length - 1) slide.classList.add("is-prev");
        else slide.classList.add("is-hidden");
      });

      dots.forEach((dot, i) => dot.classList.toggle("is-active", i === current));
    }

    function nextSlide() {
      current = (current + 1) % slides.length;
      renderCarousel();
    }

    function startTimer() {
      timer = setInterval(nextSlide, 5000);
    }

    function resetTimer() {
      clearInterval(timer);
      startTimer();
    }

    dots.forEach((dot, i) => {
      dot.addEventListener("click", () => {
        current = i;
        renderCarousel();
        resetTimer();
      });
    });

    // Pausa el autoplay mientras el mouse está sobre el carrusel
    carousel.addEventListener("mouseenter", () => clearInterval(timer));
    carousel.addEventListener("mouseleave", startTimer);

    renderCarousel();
    startTimer();
  }

});
