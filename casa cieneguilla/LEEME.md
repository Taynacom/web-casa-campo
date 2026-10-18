# Web casa de campo en Cieneguilla — cómo subir esta versión

## 0000. Cambios de la v5
- Título nuevo "Alquiler de casa de campo, solo para tu grupo"; "Cómo llegar" como título de la sección de ubicación; se corrigió el punto suelto en el enlace de la portada.

## 000. Cambios de la v4
- Se usó tu index.html editado como base (tus cambios se respetaron).
- Datos estructurados: FAQPage (preguntas frecuentes) y mención de "casa campestre" en el esquema y en una respuesta.

## 00. Cambios de la v3
- Se quitó la sección "Eventos" (y su enlace del menú); la información quedó en Preguntas frecuentes.
- Se quitó "a no más de 10 minutos del Óvalo" de la descripción inicial.
- El video siempre se reproduce dentro de la web (se quitaron los textos que enviaban a YouTube).
- Libro de reclamaciones: ahora envía los reclamos a tu Gmail con FormSubmit (sin access key). Antes de publicar, haz un reclamo de prueba y confirma el correo de activación que te llega UNA sola vez.

## 0. Novedades de esta versión (v2)
- **Visor de fotos con zoom**: los 3 carruseles y las 3 galerías se abren a pantalla completa. Zoom con rueda del mouse, Ctrl + rueda, pellizco en celular, doble toque/clic o botones + y -.
- **Menú flotante compacto en celular**: una sola barra delgada que marca en qué sección estás. El botón de WhatsApp de arriba solo aparece en computadora (en celular queda el botón flotante de abajo).
- **Video**: si abres `index.html` haciendo doble clic en tu computadora, YouTube no deja incrustar videos (Error 153) y el botón abre YouTube en otra pestaña. En la web real (Vercel) sí se reproduce dentro de la página.
- **Nueva sección "Eventos"**, textos de adelanto flexibles (sin montos fijos) y mención de "a no más de 10 minutos del Óvalo de Cieneguilla".
- Los estilos nuevos se añadieron **al final de `styles.css` y de `src/input.css`** (no necesitas regenerar nada para publicar).

## 1. Qué reemplazar en tu repositorio
Copia estos archivos a la raíz de tu repositorio de GitHub (reemplazando los anteriores) y **no toques tu carpeta `images/`**:

- `index.html`, `terminos.html`, `privacidad.html`, `reclamaciones.html`
- `styles.css` (reemplaza al anterior)
- `js/app.js` (nuevo)
- `sitemap.xml`, `robots.txt`, `vercel.json`
- Opcional (solo si vas a editar el diseño): `package.json`, `tailwind.config.js`, `src/input.css`

Los íconos ya vienen incrustados en cada página, así que **puedes abrir `index.html` directamente desde tu carpeta** y se ven igual que en Vercel. Ya no se usan `cdn.tailwindcss.com` ni `unpkg.com/lucide`.

## 2. Fotos: se piden por nombre (igual que antes)
Todas las fotos van en `images/` con estos nombres:

| Sección | Nombres |
|---|---|
| Portada | `foto-principal.webp` (PC) y `foto-principal-movil.webp` (celular) |
| Carrusel piscina | `zona-relax-1.webp`, `zona-relax-2.webp`… |
| Carrusel cocina | `zona-cocina-1.webp`… |
| Carrusel entretenimiento | `zona-diversion-1.webp`… |
| Galería interiores / exteriores / diversión | `galeria-interiores-1.webp`, `galeria-exteriores-1.webp`, `galeria-diversion-1.webp`… |
| Ubicación | `fachada.webp` |
| Vista previa al compartir | `vista-previa.webp` |

Cada una tiene su versión para celular con `-small` (ej. `zona-relax-1-small.webp`). Si falta la `-small`, el celular usa la grande.

**Para agregar fotos:** sube el archivo con el siguiente número y cambia la cantidad en `js/app.js`, en el bloque `cantidadDeFotos` (está al inicio del archivo, con comentarios).
**Si pones una cantidad mayor a las fotos que existen, las que falten simplemente no se muestran.**

## 3. Pendiente obligatorio: Libro de Reclamaciones
1. Entra a https://web3forms.com, escribe el correo donde quieres recibir los reclamos y copia la **Access Key**.
2. Abre `reclamaciones.html`, busca `PEGA_TU_ACCESS_KEY_AQUI` y reemplázalo por tu clave.
3. Sube los cambios y haz un reclamo de prueba. Debe llegarte un correo y mostrarse la constancia en pantalla.

## 4. Pendiente opcional: conversión de Google Ads
En `js/app.js` hay una variable `GADS_LABEL` vacía. Pega ahí la etiqueta de conversión de Google Ads
(Google Ads > Objetivos > Conversiones > tu conversión > Configuración de la etiqueta).

## 5. Si agregas clases de Tailwind nuevas al HTML
`styles.css` ya viene compilado, así que no necesitas hacer nada para publicar. Si agregas clases de Tailwind que no existían antes, hay que regenerarlo:

```
npm install
npm run build:css
```

y subir el `styles.css` actualizado. (O pásame el HTML y lo regenero yo.)

## 6. Search Console
En Google Search Console: añade la propiedad `https://www.casasdecampocieneguilla.com`, envía `https://www.casasdecampocieneguilla.com/sitemap.xml` y pide la indexación de la página de inicio.
