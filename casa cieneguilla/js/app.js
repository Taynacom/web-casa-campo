/* Casa de Campo en Cieneguilla — comportamiento de la página de inicio */
(function () {
  'use strict';

  /* =====================================================================
     CANTIDAD DE FOTOS POR SECCIÓN
     Las fotos se piden por nombre, dentro de la carpeta images/:
       Carruseles:  zona-relax-1.webp, zona-relax-2.webp ...   (y su versión -small.webp para celular)
                    zona-cocina-N.webp, zona-diversion-N.webp
       Galerías:    galeria-interiores-N.webp, galeria-exteriores-N.webp, galeria-diversion-N.webp
     Para AGREGAR fotos: sube el archivo con el siguiente número y sube el número aquí.
     Si una foto no existe, simplemente NO se muestra (no queda ningún hueco roto).
     ===================================================================== */
  var cantidadDeFotos = {
    carrusel_relax: 3,
    carrusel_cocina: 3,
    carrusel_diversion: 5,
    galeria_interiores: 7,
    galeria_exteriores: 7,
    galeria_diversion: 4
  };

  /* ====== Configuración de rastreadores ====== */
  var GA_ID = 'AW-18281856788';        // Google Ads / etiqueta de Google
  var PIXEL_ID = '1714022912835558';   // Meta Pixel
  // Etiqueta de conversión de Google Ads (Google Ads > Conversiones). Formato: 'AbCdEfGhIjKlMnOp'.
  // Mientras esté vacía, no se envía conversión a Google.
  var GADS_LABEL = '';
  var KEY_COOKIES = 'cookies_aceptadas';
  var KEY_TOOLTIP = 'wsp_tooltip_cerrado';

  function leer(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }
  function guardar(k, v) { try { localStorage.setItem(k, v); } catch (e) { /* sin almacenamiento */ } }

  /* ====== Cookies y rastreadores (solo con consentimiento) ====== */
  function cargarTrackers() {
    if (window.__trackersCargados) return;
    window.__trackersCargados = true;

    var s = document.createElement('script');
    s.async = true;
    s.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA_ID;
    document.head.appendChild(s);
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { window.dataLayer.push(arguments); };
    window.gtag('js', new Date());
    window.gtag('config', GA_ID);

    !function (f, b, e, v, n, t, s2) {
      if (f.fbq) return;
      n = f.fbq = function () { n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments); };
      if (!f._fbq) f._fbq = n;
      n.push = n; n.loaded = !0; n.version = '2.0'; n.queue = [];
      t = b.createElement(e); t.async = !0; t.src = v;
      s2 = b.getElementsByTagName(e)[0]; s2.parentNode.insertBefore(t, s2);
    }(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js');
    window.fbq('init', PIXEL_ID);
    window.fbq('track', 'PageView');
  }

  function registrarContacto() {
    if (leer(KEY_COOKIES) !== 'true') return;
    try {
      if (window.fbq) window.fbq('track', 'Lead');
      if (window.gtag && GADS_LABEL) window.gtag('event', 'conversion', { send_to: GA_ID + '/' + GADS_LABEL });
    } catch (e) { /* no bloquear el enlace */ }
  }

  var banner = document.getElementById('cookie-banner');
  function mostrarBanner() {
    if (!banner) return;
    banner.removeAttribute('inert');
    banner.classList.remove('translate-y-full');
  }
  function ocultarBanner() {
    if (!banner) return;
    banner.classList.add('translate-y-full');
    banner.setAttribute('inert', '');
  }
  function decidirCookies(aceptar) {
    guardar(KEY_COOKIES, aceptar ? 'true' : 'false');
    ocultarBanner();
    if (aceptar) {
      cargarTrackers();
    } else if (window.__trackersCargados) {
      location.reload(); // detiene los rastreadores ya cargados
    }
  }

  var estadoCookies = leer(KEY_COOKIES);
  if (estadoCookies === 'true') {
    cargarTrackers();
  } else if (estadoCookies === null) {
    setTimeout(mostrarBanner, 1500);
  }

  /* ====== Tooltip de WhatsApp ====== */
  var tooltip = document.getElementById('tooltip-wsp');
  function mostrarTooltip() {
    if (!tooltip || leer(KEY_TOOLTIP)) return;
    tooltip.classList.remove('scale-0', 'opacity-0', 'pointer-events-none');
    tooltip.classList.add('scale-100', 'opacity-100', 'pointer-events-auto');
  }
  function cerrarTooltip() {
    if (!tooltip) return;
    tooltip.classList.remove('scale-100', 'opacity-100', 'pointer-events-auto');
    tooltip.classList.add('scale-0', 'opacity-0', 'pointer-events-none');
    guardar(KEY_TOOLTIP, 'true');
  }
  setTimeout(mostrarTooltip, 30000);

  /* ====== Menú flotante (aparece al bajar de la portada) ====== */
  var nav = document.getElementById('nav-flotante');
  var portada = document.getElementById('inicio');
  var contEnlaces = document.getElementById('nav-enlaces');
  var enlacesNav = nav ? Array.prototype.slice.call(nav.querySelectorAll('.nav-enlace')) : [];
  var seccionesNav = Array.prototype.slice.call(document.querySelectorAll('main section[id]'));
  var enlaceActivo = null;

  function marcarEnlace(link) {
    if (link === enlaceActivo) return;
    enlaceActivo = link;
    enlacesNav.forEach(function (a) {
      if (a === link) a.setAttribute('aria-current', 'true'); else a.removeAttribute('aria-current');
    });
    // En celular el menú se desliza de lado: se centra el botón de la sección actual
    if (link && contEnlaces && contEnlaces.scrollWidth > contEnlaces.clientWidth) {
      contEnlaces.scrollTo({ left: link.offsetLeft - (contEnlaces.clientWidth - link.offsetWidth) / 2, behavior: 'smooth' });
    }
  }

  function seccionActual() {
    var tope = (nav ? nav.offsetHeight : 56) + 40;
    var actual = null;
    seccionesNav.forEach(function (sec) {
      if (sec.getBoundingClientRect().top <= tope) actual = sec;
    });
    if (!actual) return null;
    var id = '#' + actual.id;
    return enlacesNav.filter(function (a) { return a.getAttribute('href') === id; })[0] || null;
  }

  var esperandoNav = false;
  function actualizarNav() {
    if (!nav) return;
    var umbral = portada ? portada.offsetHeight * 0.6 : 400;
    var visible = window.scrollY > umbral;
    nav.classList.toggle('-translate-y-full', !visible);
    if (visible) nav.removeAttribute('inert'); else nav.setAttribute('inert', '');
    marcarEnlace(visible ? seccionActual() : null);
  }
  if (nav) {
    window.addEventListener('scroll', function () {
      if (esperandoNav) return;
      esperandoNav = true;
      requestAnimationFrame(function () { esperandoNav = false; actualizarNav(); });
    }, { passive: true });
    actualizarNav();
  }

  /* ====== Fotos: si una foto no existe, no se muestra ====== */
  function revisarVacio(carrusel) {
    if (carrusel && !carrusel.querySelector('picture')) {
      var caja = carrusel.parentNode;
      if (caja) caja.classList.add('hidden'); // sin fotos: se oculta todo el bloque de imágenes
    }
  }

  // Si falla la versión -small (celular), reintenta con la grande; si también falla, quita la foto.
  function manejarError(img) {
    var gestionar = function () {
      var pic = img.parentNode;
      var carrusel = pic && pic.parentNode;
      var fuente = pic && pic.tagName === 'PICTURE' ? pic.querySelector('source') : null;
      if (fuente) {
        fuente.remove();
        var grande = img.getAttribute('src');
        img.removeAttribute('src');
        img.setAttribute('src', grande);
        return;
      }
      if (pic && pic.tagName === 'PICTURE') pic.remove(); else img.remove();
      revisarVacio(carrusel);
    };
    img.addEventListener('error', gestionar);
    if (img.complete && img.naturalWidth === 0 && img.getAttribute('src')) gestionar();
  }

  function crearSlide(prefijo, n, alt) {
    var pic = document.createElement('picture');
    pic.className = 'block freno-deslizamiento w-full flex-shrink-0 snap-center h-full';
    var fuente = document.createElement('source');
    fuente.media = '(max-width: 768px)';
    fuente.srcset = 'images/' + prefijo + '-' + n + '-small.webp';
    var img = document.createElement('img');
    img.src = 'images/' + prefijo + '-' + n + '.webp';
    img.alt = alt + ', foto ' + n;
    img.loading = 'lazy';
    img.decoding = 'async';
    img.width = 600;
    img.height = 400;
    img.className = 'w-full h-full object-cover';
    pic.appendChild(fuente);
    pic.appendChild(img);
    manejarError(img);
    return pic;
  }

  ['relax', 'cocina', 'diversion'].forEach(function (nombre) {
    var c = document.getElementById('carrusel-' + nombre);
    if (!c) return;
    var prefijo = c.getAttribute('data-prefijo');
    var alt = c.getAttribute('data-alt') || 'Casa de campo en Cieneguilla';
    var total = cantidadDeFotos['carrusel_' + nombre] || 1;
    // La foto 1 ya está en el HTML (para buscadores y carga rápida); se agregan de la 2 en adelante.
    Array.prototype.forEach.call(c.querySelectorAll('img'), manejarError);
    for (var i = 2; i <= total; i++) c.appendChild(crearSlide(prefijo, i, alt));
  });

  // Fotos de portada de cada galería (tarjetas) y fachada
  Array.prototype.forEach.call(document.querySelectorAll('[data-galeria] img'), manejarError);

  /* ====== Carruseles: gesto de ayuda y botones ====== */
  function moverCarrusel(id, direccion) {
    var c = document.getElementById(id);
    if (!c) return;
    c.scrollBy({ left: c.clientWidth * direccion, behavior: 'smooth' });
  }

  var observador = ('IntersectionObserver' in window) ? new IntersectionObserver(function (entradas) {
    entradas.forEach(function (entrada) {
      if (!entrada.isIntersecting) return;
      var c = entrada.target;
      if (c.dataset.amagueRealizado) return;
      c.dataset.amagueRealizado = 'true';
      setTimeout(function () {
        if (c.scrollLeft >= 10 || c.querySelectorAll('picture').length < 2) return;
        c.classList.add('ejecutar-amague');
        var cartel = document.getElementById('hint-' + c.id.split('-')[1]);
        if (cartel) {
          cartel.innerHTML = '<svg class="ic w-6 h-6 animate-pulse" viewBox="0 0 24 24" aria-hidden="true"><use href="#hand"/></svg> Desliza';
          cartel.classList.replace('opacity-0', 'opacity-100');
          setTimeout(function () { cartel.classList.replace('opacity-100', 'opacity-0'); }, 2000);
        }
        setTimeout(function () { c.classList.remove('ejecutar-amague'); }, 1400);
      }, 1200);
    });
  }, { threshold: 0.5 }) : null;

  ['carrusel-relax', 'carrusel-cocina', 'carrusel-diversion'].forEach(function (id) {
    var el = document.getElementById(id);
    if (el && observador) observador.observe(el);
  });

  /* ====== Reseñas: duplicar la pista para el desplazamiento continuo ====== */
  var pista = document.getElementById('resenas-pista');
  if (pista) {
    var copia = pista.cloneNode(true);
    copia.removeAttribute('id');
    copia.setAttribute('aria-hidden', 'true');
    copia.setAttribute('inert', '');
    pista.parentNode.appendChild(copia);
  }

  /* ====== Video de YouTube (se carga solo al pulsar) ====== */
  document.querySelectorAll('[data-yt]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var id = btn.getAttribute('data-yt');
      var ifr = document.createElement('iframe');
      ifr.src = 'https://www.youtube-nocookie.com/embed/' + id + '?rel=0&autoplay=1&playsinline=1';
      ifr.title = btn.getAttribute('data-titulo') || 'Video';
      ifr.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';
      ifr.setAttribute('referrerpolicy', 'strict-origin-when-cross-origin'); // YouTube exige saber desde qué página se reproduce
      ifr.allowFullscreen = true;
      ifr.className = 'absolute inset-0 w-full h-full';
      ifr.setAttribute('frameborder', '0');
      btn.replaceWith(ifr);
      ifr.focus();
    });
  });

  /* ====== Visor de fotos: pantalla completa + zoom ======
     Se abre desde las 3 galerías y desde los 3 carruseles.
     Zoom: rueda del mouse, Ctrl + rueda, pellizco (celular), doble toque / doble clic, botones + y -, teclas + - 0.
     Cambiar de foto: flechas, teclado ← →, o deslizar el dedo. Cerrar: X, tecla Esc, deslizar hacia abajo o botón "atrás" del celular. */
  var etiquetas = {
    galeria_interiores: 'Interior de la casa de campo en Cieneguilla',
    galeria_exteriores: 'Piscina y jardines de la casa de campo en Cieneguilla',
    galeria_diversion: 'Zona de parrilla y diversión de la casa de campo en Cieneguilla'
  };
  var ZOOM_MAX = 5;
  var visor = document.getElementById('visor');
  var escenario = document.getElementById('visor-escenario');
  var imgVisor = document.getElementById('visor-img');
  var contMiniaturas = document.getElementById('visor-miniaturas');
  var contador = document.getElementById('visor-contador');
  var ayuda = document.getElementById('visor-ayuda');
  var btnPantalla = visor ? visor.querySelector('[data-pantalla]') : null;
  var fotos = [], indice = 0, etiquetaActual = '', disparador = null, historialEmpujado = false;
  var zoom = { s: 1, x: 0, y: 0 };
  var punteros = {}, gesto = null, ultimoToque = { t: 0, x: 0, y: 0 };

  function chica(ruta) { return ruta.replace(/\.webp$/, '-small.webp'); }

  function rutasDe(cat) {
    var arr = [], pref = cat.replace('_', '-');
    for (var i = 1; i <= cantidadDeFotos[cat]; i++) {
      var g = 'images/' + pref + '-' + i + '.webp';
      arr.push({ grande: g, chica: chica(g) });
    }
    return arr;
  }

  /* --- Zoom y desplazamiento --- */
  function limitar() {
    var w = escenario.clientWidth, h = escenario.clientHeight;
    var nw = imgVisor.naturalWidth || w, nh = imgVisor.naturalHeight || h;
    var ajuste = Math.min(w / nw, h / nh);
    var mx = Math.max(0, (nw * ajuste * zoom.s - w) / 2);
    var my = Math.max(0, (nh * ajuste * zoom.s - h) / 2);
    zoom.x = Math.min(mx, Math.max(-mx, zoom.x));
    zoom.y = Math.min(my, Math.max(-my, zoom.y));
  }

  function pintar(suave) {
    limitar();
    imgVisor.style.transition = suave ? 'transform .18s ease-out, opacity .2s' : 'opacity .2s';
    imgVisor.style.transform = 'translate(' + zoom.x + 'px,' + zoom.y + 'px) scale(' + zoom.s + ')';
    escenario.classList.toggle('visor-acercado', zoom.s > 1.01);
  }

  // Acerca o aleja dejando quieto el punto (px, py), medido desde el centro de la foto
  function zoomEn(nuevo, px, py, suave) {
    nuevo = Math.min(ZOOM_MAX, Math.max(1, nuevo));
    var k = nuevo / zoom.s;
    zoom.x = px - k * (px - zoom.x);
    zoom.y = py - k * (py - zoom.y);
    zoom.s = nuevo;
    if (nuevo === 1) { zoom.x = 0; zoom.y = 0; }
    pintar(suave);
  }

  function desdeCentro(cx, cy) {
    var r = escenario.getBoundingClientRect();
    return { x: cx - r.left - r.width / 2, y: cy - r.top - r.height / 2 };
  }

  function reiniciarZoom() { zoom.s = 1; zoom.x = 0; zoom.y = 0; pintar(false); }

  /* --- Fotos y miniaturas --- */
  function marcarMiniaturas() {
    var bs = contMiniaturas.children;
    for (var i = 0; i < bs.length; i++) {
      if (i === indice) bs[i].setAttribute('aria-current', 'true'); else bs[i].removeAttribute('aria-current');
    }
    var b = bs[indice];
    if (b) contMiniaturas.scrollTo({ left: b.offsetLeft - (contMiniaturas.clientWidth - b.offsetWidth) / 2, behavior: 'smooth' });
    contador.textContent = (indice + 1) + ' / ' + fotos.length;
  }

  function quitarFoto(f) {
    var k = fotos.indexOf(f);
    if (k < 0) return;
    fotos.splice(k, 1);
    if (!fotos.length) { cerrarVisor(); return; }
    construirMiniaturas();
    if (k <= indice) mostrar(Math.min(k < indice ? indice - 1 : indice, fotos.length - 1));
    else marcarMiniaturas();
  }

  function construirMiniaturas() {
    contMiniaturas.innerHTML = '';
    fotos.forEach(function (f, i) {
      var b = document.createElement('button');
      b.type = 'button';
      b.className = 'visor-mini';
      b.setAttribute('aria-label', 'Ver foto ' + (i + 1) + ' de ' + fotos.length);
      var im = document.createElement('img');
      im.alt = '';
      im.loading = 'lazy';
      im.decoding = 'async';
      im.draggable = false;
      im.addEventListener('error', function () {
        if (im.getAttribute('src') !== f.grande) im.setAttribute('src', f.grande); // si falta la -small, usa la grande
        else quitarFoto(f);                                                         // si tampoco existe, se quita
      });
      im.src = f.chica;
      b.appendChild(im);
      b.addEventListener('click', function () { mostrar(fotos.indexOf(f)); });
      contMiniaturas.appendChild(b);
    });
  }

  function mostrar(i) {
    indice = i;
    var f = fotos[i];
    reiniciarZoom();
    imgVisor.classList.add('visor-cargando');
    imgVisor.alt = etiquetaActual + ' (foto ' + (i + 1) + ' de ' + fotos.length + ')';
    imgVisor.src = f.grande;
    marcarMiniaturas();
    if (fotos.length > 1) { // precarga la siguiente para que el cambio sea inmediato
      var sig = new Image();
      sig.src = fotos[(i + 1) % fotos.length].grande;
    }
  }

  imgVisor.addEventListener('load', function () {
    imgVisor.classList.remove('visor-cargando');
    pintar(false);
  });
  imgVisor.addEventListener('error', function () {
    if (visor.hidden || !imgVisor.getAttribute('src')) return;
    quitarFoto(fotos[indice]);
  });

  function cambiarFoto(dir) {
    if (fotos.length < 2) return;
    mostrar((indice + dir + fotos.length) % fotos.length);
  }

  /* --- Abrir y cerrar --- */
  function abrirVisor(lista, inicio, etiqueta, origen) {
    if (!visor || !lista.length) return;
    disparador = origen || null;
    etiquetaActual = etiqueta;
    fotos = lista;
    visor.hidden = false;
    document.body.style.overflow = 'hidden';
    construirMiniaturas();
    mostrar(Math.max(0, Math.min(inicio, fotos.length - 1)));
    if (ayuda) { ayuda.style.animation = 'none'; void ayuda.offsetWidth; ayuda.style.animation = ''; }
    if (btnPantalla) btnPantalla.hidden = !(document.fullscreenEnabled || document.webkitFullscreenEnabled);
    try { history.pushState({ visor: true }, ''); historialEmpujado = true; } catch (e) { historialEmpujado = false; }
    var cerrar = visor.querySelector('[data-cerrar-galeria]');
    if (cerrar) cerrar.focus();
  }

  function cerrarVisor(desdeHistorial) {
    if (!visor || visor.hidden) return;
    visor.hidden = true;
    document.body.style.overflow = '';
    var fs = document.fullscreenElement || document.webkitFullscreenElement;
    if (fs) { try { (document.exitFullscreen || document.webkitExitFullscreen).call(document); } catch (e) { /* nada */ } }
    imgVisor.removeAttribute('src');
    punteros = {}; gesto = null;
    zoom.s = 1; zoom.x = 0; zoom.y = 0;
    if (historialEmpujado) {
      historialEmpujado = false;
      if (!desdeHistorial) { try { history.back(); } catch (e) { /* nada */ } }
    }
    if (disparador && disparador.focus) disparador.focus();
  }

  // El botón "atrás" del celular cierra el visor en lugar de salir de la página
  window.addEventListener('popstate', function () {
    if (visor && !visor.hidden) { historialEmpujado = false; cerrarVisor(true); }
  });

  function alternarPantallaCompleta() {
    var fs = document.fullscreenElement || document.webkitFullscreenElement;
    try {
      if (fs) (document.exitFullscreen || document.webkitExitFullscreen).call(document);
      else (visor.requestFullscreen || visor.webkitRequestFullscreen).call(visor);
    } catch (e) { /* nada */ }
  }

  function abrirGaleria(cat, origen) {
    if (!cantidadDeFotos[cat]) return;
    abrirVisor(rutasDe(cat), 0, etiquetas[cat], origen);
  }

  // Desde un carrusel: se muestran las fotos que ese carrusel realmente tiene, empezando por la que tocaste
  function abrirDesdeCarrusel(c, img, origen) {
    if (!c) return;
    var imgs = Array.prototype.slice.call(c.querySelectorAll('picture img'));
    if (!imgs.length) return;
    var lista = imgs.map(function (im) {
      var g = im.getAttribute('src');
      return { grande: g, chica: chica(g) };
    });
    var inicio = img ? imgs.indexOf(img) : Math.round(c.scrollLeft / (c.clientWidth || 1));
    abrirVisor(lista, inicio, c.getAttribute('data-alt') || 'Casa de campo en Cieneguilla', origen);
  }

  /* --- Gestos sobre la foto --- */
  function nPunteros() { return Object.keys(punteros).length; }

  if (escenario) {
    escenario.addEventListener('pointerdown', function (e) {
      if (e.target.closest('button')) return;
      try { escenario.setPointerCapture(e.pointerId); } catch (err) { /* nada */ }
      punteros[e.pointerId] = { x: e.clientX, y: e.clientY };
      var n = nPunteros();
      if (n === 1) {
        gesto = { tipo: 'uno', x0: e.clientX, y0: e.clientY, t0: Date.now(), movido: false, px: e.clientX, py: e.clientY };
      } else if (n === 2) {
        var ids = Object.keys(punteros), a = punteros[ids[0]], b = punteros[ids[1]];
        gesto = { tipo: 'dos', d0: Math.hypot(a.x - b.x, a.y - b.y) || 1, s0: zoom.s, mx: (a.x + b.x) / 2, my: (a.y + b.y) / 2 };
      }
    });

    escenario.addEventListener('pointermove', function (e) {
      if (!punteros[e.pointerId] || !gesto) return;
      punteros[e.pointerId] = { x: e.clientX, y: e.clientY };
      if (gesto.tipo === 'dos' && nPunteros() >= 2) {
        var ids = Object.keys(punteros), a = punteros[ids[0]], b = punteros[ids[1]];
        var d = Math.hypot(a.x - b.x, a.y - b.y), mx = (a.x + b.x) / 2, my = (a.y + b.y) / 2;
        zoom.x += mx - gesto.mx; zoom.y += my - gesto.my;
        gesto.mx = mx; gesto.my = my;
        var c = desdeCentro(mx, my);
        zoomEn(gesto.s0 * d / gesto.d0, c.x, c.y, false);
      } else if (gesto.tipo === 'uno') {
        if (Math.abs(e.clientX - gesto.x0) > 8 || Math.abs(e.clientY - gesto.y0) > 8) gesto.movido = true;
        if (zoom.s > 1.01) { zoom.x += e.clientX - gesto.px; zoom.y += e.clientY - gesto.py; pintar(false); }
        gesto.px = e.clientX; gesto.py = e.clientY;
      }
    });

    var soltar = function (e) {
      if (!punteros[e.pointerId]) return;
      delete punteros[e.pointerId];
      if (!gesto) return;
      if (gesto.tipo === 'dos') {
        gesto = null;
        if (zoom.s < 1.05) zoomEn(1, 0, 0, true);
        var resto = Object.keys(punteros);
        if (resto.length === 1) { // queda un dedo: sigue moviendo la foto sin saltos
          var p = punteros[resto[0]];
          gesto = { tipo: 'uno', x0: p.x, y0: p.y, t0: Date.now(), movido: true, px: p.x, py: p.y };
        }
        return;
      }
      if (e.type === 'pointerup') {
        var dx = e.clientX - gesto.x0, dy = e.clientY - gesto.y0;
        if (zoom.s <= 1.01 && Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.2) {
          cambiarFoto(dx < 0 ? 1 : -1);
        } else if (zoom.s <= 1.01 && dy > 110 && dy > Math.abs(dx) * 1.5) {
          cerrarVisor();
        } else if (!gesto.movido && Date.now() - gesto.t0 < 350) {
          var ahora = Date.now();
          if (ahora - ultimoToque.t < 320 && Math.hypot(e.clientX - ultimoToque.x, e.clientY - ultimoToque.y) < 30) {
            var c = desdeCentro(e.clientX, e.clientY);
            zoomEn(zoom.s > 1.01 ? 1 : 2.5, c.x, c.y, true); // doble toque / doble clic
            ultimoToque.t = 0;
          } else {
            ultimoToque = { t: ahora, x: e.clientX, y: e.clientY };
          }
        }
      }
      gesto = null;
    };
    escenario.addEventListener('pointerup', soltar);
    escenario.addEventListener('pointercancel', soltar);
  }

  // Rueda del mouse y Ctrl + rueda: hacen zoom en la foto (y NO en toda la página)
  if (visor) {
    visor.addEventListener('wheel', function (e) {
      if (e.target.closest('#visor-miniaturas') && !e.ctrlKey) return;
      e.preventDefault();
      var dy = e.deltaMode === 1 ? e.deltaY * 33 : e.deltaY;
      var f = (e.ctrlKey && Math.abs(dy) < 50) ? Math.pow(1.01, -dy) : Math.pow(1.0015, -dy);
      var c = desdeCentro(e.clientX, e.clientY);
      zoomEn(zoom.s * f, c.x, c.y, false);
    }, { passive: false });
    window.addEventListener('resize', function () { if (!visor.hidden) pintar(false); });
  }

  document.addEventListener('keydown', function (e) {
    if (!visor || visor.hidden) return;
    if (e.key === 'Escape') { cerrarVisor(); return; }
    if (e.key === 'ArrowRight') { cambiarFoto(1); return; }
    if (e.key === 'ArrowLeft') { cambiarFoto(-1); return; }
    if (e.key === '+' || e.key === '=') { e.preventDefault(); zoomEn(zoom.s * 1.5, 0, 0, true); return; }
    if (e.key === '-' || e.key === '_') { e.preventDefault(); zoomEn(zoom.s / 1.5, 0, 0, true); return; }
    if (e.key === '0') { e.preventDefault(); zoomEn(1, 0, 0, true); return; }
    if (e.key === 'Tab') { // el foco se queda dentro del visor
      var bs = Array.prototype.filter.call(visor.querySelectorAll('button'), function (b) { return b.offsetParent !== null; });
      if (!bs.length) return;
      var primero = bs[0], ultimo = bs[bs.length - 1];
      if (e.shiftKey && document.activeElement === primero) { e.preventDefault(); ultimo.focus(); }
      else if (!e.shiftKey && document.activeElement === ultimo) { e.preventDefault(); primero.focus(); }
    }
  });

  /* ====== Clics (delegación de eventos) ====== */
  document.addEventListener('click', function (e) {
    // Tocar una foto de un carrusel la abre en grande
    var fotoCarrusel = e.target.closest('[data-prefijo] img');
    if (fotoCarrusel) { abrirDesdeCarrusel(fotoCarrusel.closest('[data-prefijo]'), fotoCarrusel, fotoCarrusel); return; }

    var t = e.target.closest('[data-wa],[data-cookies],[data-abrir-cookies],[data-cerrar-tooltip],[data-mover],[data-galeria],[data-ampliar],[data-cerrar-galeria],[data-nav-galeria],[data-zoom],[data-pantalla]');
    if (!t) return;

    if (t.hasAttribute('data-wa')) registrarContacto();
    if (t.hasAttribute('data-cookies')) decidirCookies(t.getAttribute('data-cookies') === 'aceptar');
    if (t.hasAttribute('data-abrir-cookies')) mostrarBanner();
    if (t.hasAttribute('data-cerrar-tooltip')) cerrarTooltip();
    if (t.hasAttribute('data-mover')) {
      var p = t.getAttribute('data-mover').split(':');
      moverCarrusel(p[0], parseInt(p[1], 10));
    }
    if (t.hasAttribute('data-galeria')) abrirGaleria(t.getAttribute('data-galeria'), t);
    if (t.hasAttribute('data-ampliar')) abrirDesdeCarrusel(document.getElementById(t.getAttribute('data-ampliar')), null, t);
    if (t.hasAttribute('data-cerrar-galeria')) cerrarVisor();
    if (t.hasAttribute('data-nav-galeria')) cambiarFoto(parseInt(t.getAttribute('data-nav-galeria'), 10));
    if (t.hasAttribute('data-zoom')) zoomEn(t.getAttribute('data-zoom') === 'in' ? zoom.s * 1.5 : zoom.s / 1.5, 0, 0, true);
    if (t.hasAttribute('data-pantalla')) alternarPantallaCompleta();
  });
})();
