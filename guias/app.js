(function () {
  "use strict";

  // Tema: automático → claro → oscuro. Se recuerda en este navegador si el almacenamiento está disponible.
  var raiz = document.documentElement;
  var botonTema = document.getElementById("tema");
  var nombresTema = { auto: "automático", light: "claro", dark: "oscuro" };
  function temaActual() { return raiz.getAttribute("data-theme") || "auto"; }
  function pintarTema() { if (botonTema) botonTema.textContent = "Tema: " + nombresTema[temaActual()]; }
  if (botonTema) {
    botonTema.addEventListener("click", function () {
      var siguiente = { auto: "light", light: "dark", dark: "auto" }[temaActual()];
      if (siguiente === "auto") raiz.removeAttribute("data-theme");
      else raiz.setAttribute("data-theme", siguiente);
      try {
        if (siguiente === "auto") localStorage.removeItem("guia-tema");
        else localStorage.setItem("guia-tema", siguiente);
      } catch (e) { /* almacenamiento no disponible: el tema solo dura esta visita */ }
      pintarTema();
    });
  }
  pintarTema();

  var fuente = document.getElementById("datos-guia");
  if (!fuente) return; // index.html no tiene datos

  var P = JSON.parse(fuente.textContent);
  var D = P.datos;
  var info = document.getElementById("info");
  var ancla = document.getElementById("ancla-info");
  var sinResultados = document.getElementById("sin-resultados");

  // Etiquetas del panel según el prefijo de la clave: c_ comando, s_ situación, f_ flag; el resto, concepto.
  var ETIQUETAS = {
    c_: ["En pocas palabras", "En detalle", "Ejemplos"],
    s_: ["Qué ves", "Causas y cómo resolverlo", "Comandos"],
    f_: ["Qué hace", "En detalle", "Ejemplos"]
  };
  function etiquetas(k) {
    return ETIQUETAS[k.slice(0, 2)] || P.etiquetas || ["En pocas palabras", "En detalle", "Ejemplos"];
  }
  function el(tag, clase, texto) {
    var e = document.createElement(tag);
    if (clase) e.className = clase;
    if (texto !== undefined) e.textContent = texto;
    return e;
  }

  function mostrar(n) {
    var k = n.getAttribute("data-k");
    var d = D[k];
    if (!d) return;
    var activos = document.querySelectorAll(".on");
    for (var i = 0; i < activos.length; i++) activos[i].classList.remove("on");
    n.classList.add("on");

    var L = etiquetas(k);
    info.textContent = "";
    var titulo = el("div", "titulo", d[0]);
    if (n.classList.contains("m")) titulo.classList.add("m");
    info.appendChild(titulo);
    info.appendChild(el("span", "k", L[0]));
    info.appendChild(el("div", "", d[1]));
    info.appendChild(el("span", "k", L[1]));
    info.appendChild(el("div", "", d[2]));
    info.appendChild(el("span", "k", L[2]));
    info.appendChild(Array.isArray(d[3]) ? el("pre", "", d[3].join("\n")) : el("code", "", d[3]));
    if (d[4]) {
      var w = el("div", "w");
      w.appendChild(el("b", "", "Cuidado: "));
      w.appendChild(document.createTextNode(d[4]));
      info.appendChild(w);
    }

    // El panel aparece justo debajo del bloque donde está lo que se tocó.
    var host = n.closest(".gr") || n.closest(".z") || n.closest(".flujos") || n.closest(".mapa") ||
      n.closest(".hd") || n.closest(".cat") || n.parentNode;
    host.parentNode.insertBefore(info, host.nextSibling);
  }

  // ---------- Arquitectura: explorador de archivos y visor de código ----------
  // a_<archivo>: [ruta, sencilla, detallada, líneas de código, cuidado?]
  // i_<recurso>: [título, sencilla, detallada, "a_<archivo>::marcador"] → abre ese archivo y resalta el bloque.
  var visor = document.getElementById("visor");
  var PALABRAS = /^([ 	]*)(resource|data|module|variable|output|provider|terraform|locals|backend|moved|import|removed|dynamic|lifecycle)(?=[^A-Za-z0-9_]|$)/;

  // Bloque a resaltar: desde la línea que contiene el marcador hasta la "}" con su misma indentación.
  function rangoDe(lineas, marcador) {
    var ini = -1;
    for (var i = 0; i < lineas.length; i++) { if (lineas[i].indexOf(marcador) >= 0) { ini = i; break; } }
    if (ini < 0) return null;
    var sangria = lineas[ini].length - lineas[ini].replace(/^[ 	]+/, "").length;
    for (var j = ini + 1; j < lineas.length; j++) {
      var t = lineas[j];
      if (t.trim() === "}" && t.length - t.replace(/^[ 	]+/, "").length === sangria) return [ini, j];
    }
    return [ini, ini];
  }

  function pintarCodigo(lineas, rango) {
    var pre = document.getElementById("visor-codigo");
    pre.textContent = "";
    var cont = el("div", "lineas");
    var primera = null;
    lineas.forEach(function (texto, i) {
      var l = el("span", "l");
      var m = texto.match(PALABRAS);
      if (/^[ 	]*(#|[/][/])/.test(texto)) { l.appendChild(el("span", "c", texto)); }
      else if (m) {
        l.appendChild(document.createTextNode(m[1]));
        l.appendChild(el("span", "kw", m[2]));
        l.appendChild(document.createTextNode(texto.slice(m[0].length)));
      } else { l.textContent = texto || " "; }
      if (rango && i >= rango[0] && i <= rango[1]) { l.classList.add("hl"); if (!primera) primera = l; }
      cont.appendChild(l);
    });
    pre.appendChild(cont);
    pre.scrollTop = primera ? Math.max(0, primera.offsetTop - 40) : 0;
  }

  function mostrarArchivo(n, desplazar) {
    var k = n.getAttribute("data-k");
    var d = D[k];
    if (!d) return;
    var claveArchivo = k, rango = null, etiq = ["Para qué sirve", "Cómo funciona"];
    var archivo = d;
    if (k.slice(0, 2) === "i_") {
      var partes = d[3].split("::");
      claveArchivo = partes[0];
      archivo = D[claveArchivo];
      rango = rangoDe(archivo[3], partes[1]);
      etiq = ["Qué es", "Cómo lo crea Terraform"];
    }
    var activos = document.querySelectorAll(".on");
    for (var i = 0; i < activos.length; i++) activos[i].classList.remove("on");
    n.classList.add("on");
    var enArbol = document.querySelector('.arbol [data-k="' + claveArchivo + '"]');
    if (enArbol) enArbol.classList.add("on");

    document.getElementById("visor-ruta").textContent = archivo[0] + (rango ? "  ·  líneas " + (rango[0] + 1) + "-" + (rango[1] + 1) : "");
    var texto = document.getElementById("visor-texto");
    texto.textContent = "";
    if (k.slice(0, 2) === "i_") texto.appendChild(el("div", "titulo", d[0]));
    texto.appendChild(el("span", "k", etiq[0]));
    texto.appendChild(el("div", "", d[1]));
    texto.appendChild(el("span", "k", etiq[1]));
    texto.appendChild(el("div", "", d[2]));
    var cuidado = d[4] || (k.slice(0, 2) === "i_" ? null : archivo[4]);
    if (cuidado) {
      var w = el("div", "w");
      w.appendChild(el("b", "", "Cuidado: "));
      w.appendChild(document.createTextNode(cuidado));
      texto.appendChild(w);
    }
    pintarCodigo(archivo[3], rango);
    if (desplazar && window.innerWidth < 760) visor.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  document.addEventListener("click", function (e) {
    var n = e.target.closest ? e.target.closest("[data-k]") : null;
    if (!n) return;
    var pref = n.getAttribute("data-k").slice(0, 2);
    if (visor && (pref === "a_" || pref === "i_")) mostrarArchivo(n, true);
    else mostrar(n);
  });

  // Al cargar, el visor muestra el primer archivo marcado como inicial (o el primero del árbol).
  if (visor) {
    var inicial = document.querySelector(".arbol [data-inicial]") || document.querySelector(".arbol .archivo");
    if (inicial) mostrarArchivo(inicial, false);
  }

  // Búsqueda: oculta en las secciones lo que no coincide y atenúa en el mapa superior.
  // Quita tildes para que 'configuracion' encuentre 'configuración' (rango Unicode de diacríticos 0300-036F).
  var DIACRITICOS = new RegExp("[" + String.fromCharCode(0x300) + "-" + String.fromCharCode(0x36f) + "]", "g");
  function norm(s) { return String(s).toLowerCase().normalize("NFD").replace(DIACRITICOS, ""); }
  var indice = {};
  Object.keys(D).forEach(function (k) { indice[k] = norm(D[k][0] + " " + D[k][1] + " " + D[k][2]); });

  var buscar = document.getElementById("buscar");
  buscar.addEventListener("input", function () {
    var v = norm(buscar.value.trim());
    function coincide(n) {
      return !v || indice[n.getAttribute("data-k")].indexOf(v) >= 0 || norm(n.textContent).indexOf(v) >= 0;
    }
    var hayCoincidencias = false;
    document.querySelectorAll(".seccion:not(.arq) .ch").forEach(function (c) {
      var ok = coincide(c);
      c.classList.toggle("hid", !ok);
      if (ok) hayCoincidencias = true;
    });
    document.querySelectorAll(".seccion:not(.arq) .cat").forEach(function (cat) {
      cat.classList.toggle("hid", !!v && !cat.querySelector(".ch:not(.hid)"));
    });
    document.querySelectorAll(".seccion:not(.arq)").forEach(function (s) {
      s.classList.toggle("hid", !!v && !s.querySelector(".ch:not(.hid)"));
    });
    // El mapa superior y la arquitectura no se ocultan: se atenúa lo que no coincide.
    document.querySelectorAll(".hero [data-k], .arq [data-k]").forEach(function (c) {
      var ok = coincide(c);
      c.classList.toggle("dim", !ok);
      if (ok) hayCoincidencias = true;
    });
    sinResultados.hidden = !v || hayCoincidencias;
    if (info.closest(".hid")) ancla.parentNode.insertBefore(info, ancla.nextSibling);
  });
})();
