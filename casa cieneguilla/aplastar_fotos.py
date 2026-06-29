from PIL import Image
import os
import glob

# Busca todas las imágenes webp en la carpeta images
for img_path in glob.glob("images/*.webp"):
    
    # IGNORAR la foto principal de PC para que no pierda calidad en monitores grandes
    if "foto-principal.webp" in img_path and "movil" not in img_path:
        continue
        
    tamanio_kb = os.path.getsize(img_path) / 1024
    
    # Solo atacar a las que pesan más de 100 KB
    if tamanio_kb > 100:
        img = Image.open(img_path)
        # Redimensionar a 800px de ancho máximo (ideal para retina displays móviles)
        img.thumbnail((800, 800))
        # Sobreescribir la imagen original aplastando el peso
        img.save(img_path, "webp", optimize=True, quality=65)
        print(f"Optimizada: {img_path} (Antes pesaba: {tamanio_kb:.1f} KB)")