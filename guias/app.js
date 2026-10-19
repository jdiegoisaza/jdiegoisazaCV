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

  document.addEventListener("click", function (e) {
    var n = e.target.closest ? e.target.closest("[data-k]") : null;
    if (n) mostrar(n);
  });

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
    document.querySelectorAll(".seccion .ch").forEach(function (c) {
      var ok = coincide(c);
      c.classList.toggle("hid", !ok);
      if (ok) hayCoincidencias = true;
    });
    document.querySelectorAll(".seccion .cat").forEach(function (cat) {
      cat.classList.toggle("hid", !!v && !cat.querySelector(".ch:not(.hid)"));
    });
    document.querySelectorAll(".seccion").forEach(function (s) {
      s.classList.toggle("hid", !!v && !s.querySelector(".ch:not(.hid)"));
    });
    document.querySelectorAll(".hero [data-k]").forEach(function (c) {
      var ok = coincide(c);
      c.classList.toggle("dim", !ok);
      if (ok) hayCoincidencias = true;
    });
    sinResultados.hidden = !v || hayCoincidencias;
    if (info.closest(".hid")) ancla.parentNode.insertBefore(info, ancla.nextSibling);
  });
})();
