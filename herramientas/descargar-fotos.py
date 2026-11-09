"""Descarga las fotos de stock (Unsplash, ver CREDITOS-IMAGENES.md) y las deja en
assets/img/web/ como JPG de respaldo + WebP del mismo ancho + WebP de 800 px para el srcset.

    python herramientas/descargar-fotos.py [carpeta_de_descargas]

Necesita Pillow. Las descargas originales quedan en la carpeta indicada (por defecto,
fotos-originales/, que no se sube). Para cambiar una foto: cambia su fila en FOTOS,
actualiza CREDITOS-IMAGENES.md y los width/height del HTML con las medidas que imprime."""
import sys, os, urllib.request
from PIL import Image

raiz = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..")
desc = sys.argv[1] if len(sys.argv) > 1 else os.path.join(raiz, "fotos-originales")
out = os.path.join(raiz, "assets", "img", "web")
os.makedirs(desc, exist_ok=True)

# nombre, id de Unsplash, archivo en el CDN, ancho máximo, recorte: None o "square:<y0>" (cuadrado que empieza a esa fracción del alto)
FOTOS = [
    ("hero-casa", "t4FMbSdmeR0", "photo-1657346088167-b982455bf29a", 1400, "square:0.14"),
    ("estudio-bocetos", "Veee7A3x80Y", "photo-1649688066830-a0cf04d1bc41", 1100, None),
    ("materioteca", "iD_BTPT0yb8", "photo-1752321532730-ed24a51e7b3f", 2000, None),
    ("residencia-1", "1iiFe6dFQ_M", "photo-1760067537064-b3a93d6e4bc2", 1300, None),
    ("residencia-2", "LtlBlCal4Fw", "photo-1760067537639-0fb475c87657", 1600, None),
    ("residencia-3", "5BzyDJqp0c4", "photo-1760067538299-3f58e7a99fc5", 1600, None),
    ("residencia-4", "IP0iPi0vB5w", "photo-1760067538241-33a8694d9e23", 1600, None),
    ("residencia-5", "RIbx4WEQ0rg", "photo-1760067537540-cc36c1700d7e", 1600, None),
    ("residencia-6", "NSQMSkMOtc0", "photo-1760067537831-be00701e14fb", 1300, None),
    ("casa-mar", "RkQrl-toscw", "photo-1793891703775-1917fee884e5", 1800, None),
    ("casa-nogal", "JxCRZNW3Ye4", "photo-1787539386490-4eeca293c066", 1600, None),
    ("casa-ceiba", "7xA4Pe7sWLY", "photo-1776935359455-94263068537c", 1300, None),
    ("sala-oscura", "nDfB_rvJgiU", "photo-1778731660266-267032b97c65", 1300, None),
    ("alisio-1", "e7tWGuFhLu8", "photo-1793890779992-19a9834e4c3e", 1440, None),
    ("alisio-2", "PKLS3jz7nLQ", "photo-1793891546359-0966baa772bd", 1440, None),
    ("alisio-3", "7GgYEP1JB-w", "photo-1793891546432-94282b496829", 1440, None),
    ("alisio-4", "QxFiPlLhL6g", "photo-1793890941640-a86247355b37", 1800, None),
    ("alisio-5", "5qXxNLpRb4Y", "photo-1793891546186-e5d269171669", 1440, None),
    ("alisio-6", "0CQx_ytDW1E", "photo-1793891362534-eb5a2798db61", 1440, None),
    ("alisio-7", "gEyRhpu-wWs", "photo-1793891546350-9b3acdf35b1c", 1440, None),
    ("alisio-8", "6mniw4I8IaE", "photo-1793891703831-3aea75f28aed", 1440, None),
]

medidas = {}
for nombre, corto, archivo, ancho, recorte in FOTOS:
    origen = os.path.join(desc, f"{nombre}.jpg")
    if not os.path.exists(origen):
        url = f"https://images.unsplash.com/{archivo}?w=2400&q=90&fm=jpg"
        req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
        open(origen, "wb").write(urllib.request.urlopen(req, timeout=60).read())
    im = Image.open(origen).convert("RGB")
    if recorte and recorte.startswith("square:"):
        y0 = float(recorte.split(":")[1])
        w, h = im.size
        lado = min(w, h)
        top = int(h * y0) if h > w else 0
        left = (w - lado) // 2 if w > h else 0
        im = im.crop((left, top, left + lado, top + lado))
    if im.width > ancho:
        im = im.resize((ancho, round(im.height * ancho / im.width)), Image.LANCZOS)
    base = os.path.join(out, nombre)
    im.save(base + ".jpg", quality=78, optimize=True, progressive=True)
    im.save(base + ".webp", quality=74, method=6)
    chica = im.resize((800, round(im.height * 800 / im.width)), Image.LANCZOS) if im.width > 800 else im
    chica.save(base + "-800.webp", quality=72, method=6)
    medidas[nombre] = [im.width, im.height]
    kb = lambda p: round(os.path.getsize(p) / 1024)
    print(f"{nombre}: {im.width}x{im.height} jpg {kb(base+'.jpg')} KB · webp {kb(base+'.webp')} · 800 {kb(base+'-800.webp')}")
