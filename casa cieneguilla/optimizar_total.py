from PIL import Image
import os
import glob

print("Iniciando compresión maestra...")

# Busca todas las imágenes en la carpeta
for img_path in glob.glob("images/*.webp"):
    if "-small" in img_path:
        continue # Evita procesar las que ya son pequeñas
        
    try:
        img = Image.open(img_path)
        
        # 1. Crear versión Móvil (600px)
        img_small = img.copy()
        img_small.thumbnail((600, 600), Image.Resampling.LANCZOS)
        ruta_small = img_path.replace(".webp", "-small.webp")
        img_small.save(ruta_small, "webp", optimize=True, quality=75)
        
        # 2. Optimizar la foto original para PC (Máximo 1200px)
        img.thumbnail((1200, 1200), Image.Resampling.LANCZOS)
        img.save(img_path, "webp", optimize=True, quality=80)
        
        print(f"✔ Optimizada: {img_path}")
    except Exception as e:
        print(f"Error con {img_path}: {e}")

print("¡Listo! Todas las fotos están perfectas para Google.")