from PIL import Image
import os

# Lista de imágenes identificadas como muy pesadas en el informe
fotos_pesadas = [
    "zona-diversion-2.webp", "zona-relax-3.webp", "zona-diversion-1.webp",
    "galeria-interiores-1.webp", "galeria-diversion-1.webp", "galeria-exteriores-1.webp",
    "zona-relax-1.webp", "zona-relax-2.webp", "zona-cocina-2.webp", 
    "zona-cocina-1.webp", "zona-diversion-3.webp", "zona-cocina-3.webp", 
    "zona-diversion-4.webp"
]

for nombre in fotos_pesadas:
    ruta = os.path.join("images", nombre)
    if os.path.exists(ruta):
        img = Image.open(ruta)
        # Redimensionar a 600px de ancho máximo (ideal para móviles)
        img.thumbnail((600, 600))
        # Guardar como versión 'small' para usar en srcset
        nuevo_nombre = nombre.replace(".webp", "-small.webp")
        img.save(os.path.join("images", nuevo_nombre), "webp", optimize=True, quality=75)
        print(f"Creada versión optimizada: {nuevo_nombre}")