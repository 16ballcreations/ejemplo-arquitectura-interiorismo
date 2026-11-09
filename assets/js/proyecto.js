/* Lumbre (sitio de ejemplo): página de detalle de un proyecto. Menú, revelados y visor de la galería. */
(() => {
  const quieto = matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* Menú: fondo al bajar y menú del teléfono */
  const menu = document.querySelector(".menu");
  const abrir = document.querySelector(".menu-abrir");
  const movil = document.getElementById("menu-movil");
  abrir.addEventListener("click", () => {
    const abierto = abrir.getAttribute("aria-expanded") === "true";
    abrir.setAttribute("aria-expanded", String(!abierto));
    abrir.textContent = abierto ? "Menú" : "Cerrar";
    movil.hidden = abierto;
  });
  movil.addEventListener("click", e => { if(e.target.closest("a")) abrir.click(); });

  /* La foto de portada se asienta al bajar */
  const portada = document.querySelector(".obra-portada");
  function alDesplazar(){
    menu.classList.toggle("solida", scrollY > innerHeight * 0.6);
    if(!quieto) portada.style.setProperty("--p", Math.min(scrollY / innerHeight, 1).toFixed(3));
  }
  addEventListener("scroll", alDesplazar, { passive: true });
  alDesplazar();

  /* Revelados y líneas de luz al entrar en pantalla */
  const vigia = new IntersectionObserver(entradas => {
    for(const e of entradas){
      if(!e.isIntersecting) continue;
      e.target.classList.add(e.target.classList.contains("luz") ? "encendida" : "visible");
      vigia.unobserve(e.target);
    }
  }, { rootMargin: "0px 0px -12% 0px" });
  document.querySelectorAll(".revelar, .luz").forEach(el => vigia.observe(el));

  /* Visor: cada imagen de la galería se abre a pantalla completa, con flechas y teclado */
  const fotos = [...document.querySelectorAll("[data-galeria] img")];
  const visor = document.querySelector("[data-visor]");
  const grande = visor.querySelector("[data-visor-foto]");
  const pie = visor.querySelector("[data-visor-pie]");
  let actual = 0;
  function mostrar(i){
    actual = (i + fotos.length) % fotos.length;
    grande.src = fotos[actual].src;
    grande.alt = fotos[actual].alt;
    pie.textContent = `${String(actual + 1).padStart(2, "0")} / ${String(fotos.length).padStart(2, "0")} · ${fotos[actual].alt}`;
  }
  fotos.forEach((foto, i) => foto.closest("button").addEventListener("click", () => {
    mostrar(i);
    visor.showModal();
  }));
  visor.querySelectorAll("[data-visor-paso]").forEach(b =>
    b.addEventListener("click", () => mostrar(actual + Number(b.dataset.visorPaso))));
  visor.querySelector("[data-visor-cerrar]").addEventListener("click", () => visor.close());
  visor.addEventListener("click", e => { if(e.target === visor) visor.close(); });
  visor.addEventListener("keydown", e => {
    if(e.key === "ArrowRight") mostrar(actual + 1);
    if(e.key === "ArrowLeft") mostrar(actual - 1);
  });
  let inicioX = null;
  visor.addEventListener("touchstart", e => { inicioX = e.touches[0].clientX; }, { passive: true });
  visor.addEventListener("touchend", e => {
    if(inicioX === null) return;
    const dx = e.changedTouches[0].clientX - inicioX;
    if(Math.abs(dx) > 40) mostrar(actual + (dx < 0 ? 1 : -1));
    inicioX = null;
  });
})();
