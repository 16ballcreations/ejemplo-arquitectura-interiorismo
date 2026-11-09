# Lumbre Arquitectura e Interiorismo: sitio de ejemplo

**Sitio de muestra de [16 Ball Creations](https://16ballcreations.com) para estudios de
arquitectura e interiorismo.** Sirve para enseñarle a un prospecto del rubro cómo se vería su
web: carga con una línea de luz, portada con el nombre detrás de la casa, recorrido por una obra,
showroom que se ilumina con el cursor, proyectos, página de proyecto con galería, testimonios y
una cita que arma el mensaje de WhatsApp.

> **Lumbre es una marca inventada.** El estudio, Sara Montoya, los proyectos, las cifras, los
> testimonios y los datos de contacto son ficticios. Las fotos son de stock (Unsplash) y no son
> obras del estudio: ver [CREDITOS-IMAGENES.md](CREDITOS-IMAGENES.md). Todas las páginas llevan
> `noindex` y un aviso fijo de «Sitio de ejemplo · Hecho por 16 Ball Creations».

Para un cliente real se cambian las fotos, los textos y los datos, y se conserva la estructura.

## Concepto: «Casas que se encienden al caer la tarde»

La **línea de luz** (una raya de 1 px, cálida, con un brillo suave, como un LED bajo una losa) es
el único recurso gráfico: separa el logotipo del descriptor, abre cada sección y se enciende al
entrar en pantalla. Brutalista con medida: retícula a la vista, bloques rectos, sin sombras ni
esquinas redondeadas. La identidad está en [MARCA.md](MARCA.md).

| # | Sección | Qué hace |
|---|---|---|
| 0 | Carga | La línea de luz va de 000 a 100 y la casa se ilumina (solo la primera vez en la sesión) |
| 1 | Portada | Casa al anochecer con LUMBRE detrás de su silueta; las letras se separan con el scroll |
| 2 | Estudio y servicios | Fondo piedra, formato revista: presentación, calificación que cuenta hasta 4,9 y seis servicios |
| 3 | Fundadora | Bocetos sobre la mesa de dibujo con la cita de la fundadora; recorrido de una residencia con botones y deslizar en el teléfono |
| 4 | Showroom | Materioteca: el espacio se enciende donde pasa el cursor (en el teléfono, solo) |
| 5 | Proyectos | Cinco en retícula escalonada más un índice; Casa Alisio tiene página propia |
| 6 | Clientes | Testimonio principal, dos más y una calificación |
| 7 | Cita inicial | El formulario arma el mensaje de WhatsApp (en el ejemplo abre WhatsApp sin número) y botón a Calendly |
| 8 | Pie | Datos, redes y el nombre a todo lo ancho |

## Archivos

| Ruta | Qué es |
|---|---|
| `index.html` | La página principal |
| `proyectos/casa-alisio/` | Página de proyecto (plantilla): portada, ficha, recorrido, detalle, galería con visor, siguiente proyecto |
| `assets/css/marca.css` | Tokens de color, tipografía (Inter Tight) y la línea de luz |
| `assets/css/sitio.css` · `proyecto.css` | Estilos de la página y de la página de proyecto (incluye el aviso de sitio de ejemplo) |
| `assets/js/sitio.js` · `proyecto.js` | Carga, portada, revelados, recorrido, cifras, linterna, formulario; visor de la galería |
| `assets/img/marca/` | Logotipo (oscuro y claro) y sello: una L hecha de un muro y la línea de luz |
| `assets/img/web/` | 21 fotos de Unsplash en JPG + WebP + WebP de 800 px |
| `CREDITOS-IMAGENES.md` | Autor, enlace y licencia de cada foto |
| `herramientas/servir.mjs` | Servidor local: `node herramientas/servir.mjs 4330` |
| `herramientas/descargar-fotos.py` | Descarga y optimiza las fotos (necesita Pillow) |

La silueta de la portada es un `clip-path` en `sitio.css` (`.portada-recorte`) trazado sobre
`hero-casa.jpg`: si se cambia esa foto, hay que volver a trazarla.

## Origen

Nace de una propuesta de 16BC para un estudio de arquitectura. Se conservó el diseño y la
arquitectura de páginas y se cambió todo lo del cliente: nombre, logo, textos, proyectos,
personas, fotos, contacto, redes y reseñas. Se quitaron el manual de marca y la auditoría de
marca de esa propuesta, que eran del cliente.

**Publicado en** https://16ballcreations.github.io/ejemplo-arquitectura-interiorismo/ (GitHub Pages desde `main`, raíz; repositorio `16ballcreations/ejemplo-arquitectura-interiorismo`). Sigue con `noindex`.
