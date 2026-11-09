/* Lumbre (sitio de ejemplo): carga, portada, revelados, recorrido, cifras y la linterna del showroom. */
(() => {
  const body = document.body;
  const quieto = matchMedia("(prefers-reduced-motion: reduce)").matches;
  body.classList.add("cargando");

  /* 0. Carga: la línea se enciende de 0 a 100 y la casa se ilumina.
     Solo en la primera visita de la sesión; después la página entra directo */
  const carga = document.querySelector(".carga");
  const luz = carga.querySelector(".carga-luz");
  const cifra = carga.querySelector(".carga-cifra");
  let vista = false;
  try { vista = sessionStorage.getItem("lumbre-carga") === "1"; sessionStorage.setItem("lumbre-carga", "1"); } catch {}
  if(vista) carga.classList.add("vista");
  const duracion = quieto || vista ? 0 : 900;
  const inicio = performance.now();
  const curva = t => 1 - Math.pow(1 - t, 3);

  function avanzar(ahora){
    const t = duracion ? Math.min(Math.max(ahora - inicio, 0) / duracion, 1) : 1;
    const v = curva(t);
    luz.style.transform = `scaleX(${v})`;
    cifra.textContent = String(Math.round(v * 100)).padStart(3, "0");
    if(t < 1) return requestAnimationFrame(avanzar);
    carga.classList.add("lista");
    body.classList.remove("cargando");
    requestAnimationFrame(() => body.classList.add("encendida"));
  }
  requestAnimationFrame(avanzar);

  /* 1. Menú: fondo al salir de la portada, enlace activo y menú del teléfono */
  const menu = document.querySelector(".menu");
  const portada = document.querySelector(".portada");
  const abrir = document.querySelector(".menu-abrir");
  const movil = document.getElementById("menu-movil");

  abrir.addEventListener("click", () => {
    const abierto = abrir.getAttribute("aria-expanded") === "true";
    abrir.setAttribute("aria-expanded", String(!abierto));
    abrir.textContent = abierto ? "Menú" : "Cerrar";
    movil.hidden = abierto;
  });
  movil.addEventListener("click", e => {
    if(e.target.closest("a")) abrir.click();
  });

  /* 2. Portada: el avance del scroll (0 a 1) mueve la casa y abre el nombre */
  const letras = [...document.querySelectorAll(".portada-nombre span")];
  letras.forEach((letra, i) => letra.style.setProperty("--d", ((i - (letras.length - 1) / 2) * 0.22).toFixed(2)));

  function alDesplazar(){
    const alto = portada.offsetHeight - innerHeight;
    const p = Math.min(Math.max(scrollY / alto, 0), 1);
    if(!quieto) portada.style.setProperty("--p", p.toFixed(4));
    menu.classList.toggle("solida", scrollY > portada.offsetHeight - innerHeight * 0.8);
  }
  addEventListener("scroll", alDesplazar, { passive: true });
  addEventListener("resize", alDesplazar);
  alDesplazar();

  /* Revelados y líneas de luz al entrar en pantalla */
  const vigia = new IntersectionObserver(entradas => {
    for(const e of entradas){
      if(!e.isIntersecting) continue;
      e.target.classList.add(e.target.classList.contains("luz") ? "encendida" : "visible");
      vigia.unobserve(e.target);
    }
  }, { rootMargin: "0px 0px -12% 0px" });
  document.querySelectorAll(".revelar, .seccion-cabeza .luz, .servicios-lista .luz, .pie-luz").forEach(el => vigia.observe(el));

  const secciones = ["proyectos", "estudio", "servicios", "showroom"].map(id => document.getElementById(id));
  const enlaces = new Map([...document.querySelectorAll(".menu-enlaces a")].map(a => [a.hash.slice(1), a]));
  const activo = new IntersectionObserver(entradas => {
    for(const e of entradas) enlaces.get(e.target.id)?.classList.toggle("activo", e.isIntersecting);
  }, { rootMargin: "-45% 0px -50% 0px" });
  secciones.forEach(s => activo.observe(s));

  /* 5. Recorrido: botones a los lados, marcas abajo y deslizar en el teléfono */
  const recorrido = document.querySelector("[data-recorrido]");
  const fotos = [...recorrido.querySelectorAll("[data-recorrido-foto]")];
  const nombre = recorrido.querySelector("[data-recorrido-nombre]");
  const marcas = recorrido.querySelector("[data-recorrido-marcas]");
  const ESPACIOS = ["Sala", "Doble altura", "Terraza", "Comedor", "Cocina", "Detalle"];
  let actual = 0;
  const botones = fotos.map((_, i) => {
    const b = document.createElement("button");
    b.type = "button";
    b.setAttribute("aria-label", `${ESPACIOS[i]}, espacio ${i + 1} de ${fotos.length}`);
    b.addEventListener("click", () => mostrar(i));
    marcas.append(b);
    return b;
  });
  function mostrar(i){
    actual = (i + fotos.length) % fotos.length;
    fotos.forEach((f, j) => f.classList.toggle("activa", j === actual));
    botones.forEach((b, j) => b.setAttribute("aria-current", String(j === actual)));
    nombre.textContent = `${ESPACIOS[actual]} · ${actual + 1}/${fotos.length}`;
  }
  recorrido.querySelectorAll("[data-recorrido-paso]").forEach(b =>
    b.addEventListener("click", () => mostrar(actual + Number(b.dataset.recorridoPaso))));
  let inicioX = null;
  const marco = recorrido.querySelector(".recorrido-marco");
  marco.addEventListener("touchstart", e => { inicioX = e.touches[0].clientX; }, { passive: true });
  marco.addEventListener("touchend", e => {
    if(inicioX === null) return;
    const dx = e.changedTouches[0].clientX - inicioX;
    if(Math.abs(dx) > 40) mostrar(actual + (dx < 0 ? 1 : -1));
    inicioX = null;
  });
  mostrar(0);

  /* Calificación: cuenta hasta su valor al aparecer */
  const formato = new Intl.NumberFormat("es-CO");
  const contador = new IntersectionObserver(entradas => {
    for(const e of entradas){
      if(!e.isIntersecting) continue;
      contador.unobserve(e.target);
      const el = e.target;
      const meta = Number(el.dataset.contar);
      const decimales = Number(el.dataset.decimales || 0);
      const pintar = v => el.textContent = el.dataset.miles !== undefined
        ? formato.format(Math.round(v))
        : v.toFixed(decimales).replace(".", ",");
      if(quieto){ pintar(meta); continue; }
      const t0 = performance.now();
      const paso = ahora => {
        const t = Math.min(Math.max(ahora - t0, 0) / 1800, 1);
        pintar(meta * curva(t));
        if(t < 1) requestAnimationFrame(paso);
      };
      requestAnimationFrame(paso);
    }
  }, { threshold: 0.6 });
  document.querySelectorAll("[data-contar]").forEach(el => contador.observe(el));

  /* 7. Showroom: el espacio se enciende alrededor del cursor (en el teléfono, por sí solo al aparecer) */
  const showroom = document.querySelector("[data-linterna]");
  const tactil = matchMedia("(hover: none)").matches;
  let radio = 0, meta = 0, x = 70, y = 55;
  function animarLinterna(){
    radio += (meta - radio) * 0.08;
    showroom.style.setProperty("--r", `${radio.toFixed(1)}px`);
    showroom.style.setProperty("--x", `${x}%`);
    showroom.style.setProperty("--y", `${y}%`);
    if(Math.abs(meta - radio) > 0.5) requestAnimationFrame(animarLinterna);
  }
  const encender = r => { meta = r; requestAnimationFrame(animarLinterna); };
  if(tactil || quieto){
    new IntersectionObserver(([e]) => { if(e.isIntersecting) encender(Math.hypot(innerWidth, innerHeight)); }, { threshold: 0.3 }).observe(showroom);
  } else {
    showroom.addEventListener("pointermove", e => {
      const caja = showroom.getBoundingClientRect();
      x = ((e.clientX - caja.left) / caja.width * 100).toFixed(2);
      y = ((e.clientY - caja.top) / caja.height * 100).toFixed(2);
      if(meta === 0) encender(Math.max(320, innerWidth * 0.28));
      else requestAnimationFrame(animarLinterna);
    });
    showroom.addEventListener("pointerleave", () => encender(0));
  }

  /* 9. Cita: arma el mensaje y abre WhatsApp para elegir a quién enviarlo (sitio de ejemplo: sin número real) */
  document.querySelector("[data-cita]").addEventListener("submit", e => {
    e.preventDefault();
    const datos = new FormData(e.target);
    const texto = `Hola, Lumbre. Soy ${datos.get("nombre")}. Me interesa agendar una cita inicial para un proyecto de ${String(datos.get("tipo")).toLowerCase()}` +
      (datos.get("ciudad") ? ` en ${datos.get("ciudad")}.` : ".");
    open(`https://wa.me/?text=${encodeURIComponent(texto)}`, "_blank", "noopener");
  });
})();
