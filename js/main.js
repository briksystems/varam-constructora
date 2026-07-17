/* =========================================================
   VARAM CONSTRUCTORA — main.js
   Todo el JavaScript del sitio, comentado paso a paso.
   ========================================================= */

document.addEventListener("DOMContentLoaded", function () {

  /* ---------------------------------------------------------
     1. Header: sombra al hacer scroll + resaltar enlace activo
     --------------------------------------------------------- */
  const header = document.getElementById("header");
  const sections = document.querySelectorAll("section[id]");
  const navLinks = document.querySelectorAll(".nav__links a");

  function onScroll() {
    // Añade sombra al header cuando el usuario baja
    header.classList.toggle("is-scrolled", window.scrollY > 10);

    // Detecta qué sección está visible y resalta su enlace en el menú
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

  navToggle.addEventListener("click", function () {
    const isOpen = header.classList.toggle("is-open");
    navToggle.setAttribute("aria-expanded", isOpen);
  });

  // Cierra el menú móvil al hacer clic en un enlace
  navLinks.forEach((link) => {
    link.addEventListener("click", () => header.classList.remove("is-open"));
  });

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
        al hacer clic en una miniatura
     --------------------------------------------------------- */
  document.querySelectorAll(".proyecto").forEach((proyecto) => {
    const mainImg = proyecto.querySelector("[data-main-img]");
    const thumbs = proyecto.querySelectorAll(".proyecto__thumbs button");

    thumbs.forEach((thumb) => {
      thumb.addEventListener("click", () => {
        const newSrc = thumb.getAttribute("data-img");

        // pequeño fundido al cambiar de imagen
        mainImg.style.opacity = 0;
        setTimeout(() => {
          mainImg.src = newSrc;
          mainImg.style.opacity = 1;
        }, 150);

        thumbs.forEach((t) => t.classList.remove("is-active"));
        thumb.classList.add("is-active");
      });
    });
  });

  /* ---------------------------------------------------------
     5. Formulario de contacto (front-end only)
     ---------------------------------------------------------
     Este formulario todavía no envía datos a ningún servidor.
     Para conectarlo de verdad tienes dos caminos sencillos:

     a) Un servicio como Formspree o Web3Forms: creas una cuenta
        gratuita, te dan una URL, y cambias esta función para
        hacer un fetch() POST a esa URL con los datos del form.

     b) Tu propio backend (por ejemplo con Node.js/Express),
        que reciba estos datos y envíe un correo con Nodemailer.
     --------------------------------------------------------- */
  const form = document.getElementById("contactForm");
  const successMsg = document.getElementById("formSuccess");

  form.addEventListener("submit", function (e) {
    e.preventDefault(); // evita que la página se recargue

    // Aquí, en un sitio real, enviarías los datos con fetch():
    // fetch("https://TU-ENDPOINT", { method: "POST", body: new FormData(form) })

    successMsg.classList.add("is-visible");
    form.reset();

    // Oculta el mensaje de éxito después de unos segundos
    setTimeout(() => successMsg.classList.remove("is-visible"), 6000);
  });

});
