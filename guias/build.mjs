// Genera las guías de estudio en HTML: un archivo autocontenido por tema + index.html,
// en public/guias/ (el sitio las publica en /guias/). No se comitean: se regeneran solas
// antes de `npm run dev` y `npm run build` (scripts predev / prebuild de package.json).
//
//   npm run guias        # o: node guias/build.mjs
//
// - Contenido: guias/datos/<tema>.mjs (editar ahí y volver a generar).
// - Estilos: guias/estilos.css · Lógica del navegador: guias/app.js
// Cada HTML generado funciona solo, sin internet ni dependencias: también se puede abrir
// con doble clic o enviar por correo. Los enlaces son relativos, así que funcionan igual en
// Azure Static Web Apps (raíz) y en GitHub Pages (bajo /jdiegoisazaCV/).
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import azure from "./datos/azure.mjs";
import aws from "./datos/aws.mjs";
import git from "./datos/git.mjs";
import linux from "./datos/linux.mjs";
import docker from "./datos/docker.mjs";
import kubernetes from "./datos/kubernetes.mjs";

const aqui = dirname(fileURLToPath(import.meta.url));
const destino = join(aqui, "..", "public", "guias");
mkdirSync(destino, { recursive: true });
const guias = [azure, aws, git, linux, docker, kubernetes];
const css = readFileSync(join(aqui, "estilos.css"), "utf8");
const js = readFileSync(join(aqui, "app.js"), "utf8");
const fecha = new Date().toISOString().slice(0, 10);

const esc = (s) =>
  String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
// JSON dentro de <script>: se escapa "<" para que ningún texto pueda cerrar la etiqueta.
const BARRA = String.fromCharCode(92);
const jsonSeguro = (o) =>
  JSON.stringify(o)
    .split("<").join(BARRA + "u003c")
    .split(String.fromCharCode(0x2028)).join(BARRA + "u2028")
    .split(String.fromCharCode(0x2029)).join(BARRA + "u2029");

// Se ejecuta antes de pintar para evitar el parpadeo del tema equivocado.
const temaInicial =
  'try{var t=localStorage.getItem("guia-tema");if(t==="light"||t==="dark")document.documentElement.setAttribute("data-theme",t)}catch(e){}';

function nav(actual) {
  const links = [
    { id: "index", nombre: "Inicio" },
    ...guias.map((g) => ({ id: g.id, nombre: g.nombre })),
  ];
  // "../" vuelve a la raíz del sitio (funciona con o sin basePath).
  return `<nav class="guias" aria-label="Guías"><a href="../">← Portafolio</a>${links
    .map((l) => `<a href="${l.id}.html"${l.id === actual ? ' aria-current="page"' : ""}>${esc(l.nombre)}</a>`)
    .join("")}</nav>`;
}

function documento({ id, titulo, descripcion, cuerpo, scripts }) {
  return `<!doctype html>
<html lang="es">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(titulo)}</title>
<meta name="description" content="${esc(descripcion)}">
<script>${temaInicial}</script>
<style>
${css}
</style>
</head>
<body>
<div class="pagina">
<header>
<div class="cabecera"><div><h1>${esc(titulo)}</h1><p class="desc">${esc(descripcion)}</p></div><button type="button" class="tema" id="tema">Tema: automático</button></div>
${nav(id)}
</header>
<main>
${cuerpo}
</main>
<footer>Guía de estudio · generada el ${fecha}</footer>
</div>
${scripts}
</body>
</html>
`;
}

const chip = (k, label, mono) =>
  `<button type="button" class="ch${mono ? " m" : ""}" data-k="${k}">${esc(label)}</button>`;

const caja = ([k, titulo, sub]) =>
  `<div class="zn"><button type="button" class="tt" data-k="${k}">${esc(titulo)}</button>${
    sub ? `<span class="t2">${esc(sub)}</span>` : ""
  }</div>`;

function flecha(f) {
  const [texto, simbolo = "→"] = Array.isArray(f) ? f : [f];
  return `<span class="flecha" aria-hidden="true"><small>${esc(texto)}</small><span class="g">${esc(simbolo)}</span></span>`;
}

function renderHero(h) {
  if (h.tipo === "html") return h.html;
  if (h.tipo === "mapa") {
    return `<div class="mapa"><span class="lb">${esc(h.etiqueta)}</span>${h.items
      .map(([k, l]) => `<button type="button" class="tt m" data-k="${k}">${esc(l)}</button>`)
      .join("")}</div>`;
  }
  if (h.tipo === "flujos") {
    return `<div class="flujos">${h.filas
      .map(
        (f) =>
          `<div class="fila">${f.etiqueta ? `<span class="fe">${esc(f.etiqueta)}</span>` : ""}<div class="flujo">${f.pasos
            .map((p, i) => (i ? flecha(f.flechas[i - 1]) : "") + caja(p))
            .join("")}</div></div>`
      )
      .join("")}</div>`;
  }
  throw new Error(`Tipo de mapa desconocido: ${h.tipo}`);
}

function renderSeccion(s) {
  const grupos = s.grupos
    .map(
      (g) =>
        `<div class="cat"><b>${esc(g.nombre)}</b>${g.sub ? `<i class="s">${esc(g.sub)}</i>` : ""}${g.items
          .map(([k, label, mono]) => chip(k, label, mono ?? s.mono))
          .join("")}</div>`
    )
    .join("");
  return `<section class="seccion"><h2>${esc(s.titulo)}</h2>${
    s.intro ? `<p class="sintro">${esc(s.intro)}</p>` : ""
  }<div class="gr">${grupos}</div></section>`;
}

const clavesDe = (html) => new Set([...html.matchAll(/data-k="([^"]+)"/g)].map((m) => m[1]));

function validar(g, html) {
  const usadas = clavesDe(html);
  const faltan = [...usadas].filter((k) => !g.datos[k]);
  if (faltan.length) throw new Error(`${g.id}: no hay datos para ${faltan.join(", ")}`);
  for (const [k, d] of Object.entries(g.datos)) {
    if (!Array.isArray(d) || d.length < 4 || d.length > 5) throw new Error(`${g.id}.${k}: formato inválido`);
  }
  const sobran = Object.keys(g.datos).filter((k) => !usadas.has(k));
  if (sobran.length) console.warn(`  ! ${g.id}: datos sin usar: ${sobran.join(", ")}`);
}

function conteos(g) {
  const partes = [];
  if (g.heroResumen) partes.push(`${g.heroResumen}: ${clavesDe(renderHero(g.hero)).size}`);
  for (const s of g.secciones) {
    partes.push(`${s.corto}: ${new Set(s.grupos.flatMap((gr) => gr.items.map((i) => i[0]))).size}`);
  }
  return partes.join(" · ");
}

for (const g of guias) {
  const hero = renderHero(g.hero);
  const secciones = g.secciones.map(renderSeccion).join("\n");
  const cuerpo = `<section class="hero" aria-label="${esc(g.heroTitulo)}">${hero}</section>
<input class="buscar" id="buscar" type="search" placeholder="${esc(g.busqueda)}" aria-label="Buscar en la guía" autocomplete="off">
<div id="ancla-info"></div>
<div id="info" aria-live="polite">Selecciona cualquier elemento para ver su explicación sencilla, la detallada y ejemplos.</div>
<p id="sin-resultados" class="sinres" hidden>No hay coincidencias.</p>
${secciones}`;
  validar(g, cuerpo);
  const scripts = `<script id="datos-guia" type="application/json">${jsonSeguro({
    etiquetas: g.etiquetas,
    datos: g.datos,
  })}</script>
<script>
${js}
</script>`;
  writeFileSync(join(destino, `${g.id}.html`), documento({ id: g.id, titulo: g.titulo, descripcion: g.descripcion, cuerpo, scripts }), "utf8");
  console.log(`${g.id}.html — ${conteos(g)}`);
}

const tarjetas = guias
  .map(
    (g) =>
      `<a class="tarjeta" href="${g.id}.html"><span class="tn">${esc(g.nombre)}</span><span class="td">${esc(
        g.resumen
      )}</span><span class="tc">${esc(conteos(g))}</span></a>`
  )
  .join("\n");
writeFileSync(
  join(destino, "index.html"),
  documento({
    id: "index",
    titulo: "Guías de estudio",
    descripcion:
      "Conceptos, comandos, situaciones comunes y flags de nube, contenedores y herramientas DevOps, con explicación sencilla y detallada.",
    cuerpo: `<div class="tarjetas">\n${tarjetas}\n</div>`,
    scripts: `<script>\n${js}\n</script>`,
  }),
  "utf8"
);
console.log("index.html");
