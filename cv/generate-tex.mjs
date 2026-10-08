// Genera un .tex por idioma a partir de resume.template.tex + los datos del sitio:
//   app/data/cv.mjs    -> cv/resume.tex     (español)
//   app/data/cv.en.mjs -> cv/resume_en.tex  (inglés)
// Fuente de verdad del contenido: esos archivos (los mismos que usa el sitio).
import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import * as cvEs from "../app/data/cv.mjs";
import * as cvEn from "../app/data/cv.en.mjs";

const idiomas = [
  { cv: cvEs, salida: "resume.tex", fuente: "app/data/cv.mjs" },
  { cv: cvEn, salida: "resume_en.tex", fuente: "app/data/cv.en.mjs" },
];

const __dirname = dirname(fileURLToPath(import.meta.url));

function escapeLatex(value) {
  if (value === undefined || value === null) return "";
  return String(value)
    .replace(/\\/g, "\\textbackslash{}")
    .replace(/([&%$#_{}])/g, "\\$1")
    .replace(/~/g, "\\textasciitilde{}")
    .replace(/\^/g, "\\textasciicircum{}");
}

function handleFromUrl(url, host) {
  return url.replace(new RegExp(`^https?://(www\\.)?${host}/(in/)?`), "").replace(/\/$/, "");
}

function buildHeader({ perfil }) {
  const [tituloPrincipal, tituloSecundario] = perfil.titulo
    .split("·")
    .map((s) => s.trim());

  return [
    `\\name{${escapeLatex(perfil.nombrePila)}}{${escapeLatex(perfil.apellidos)}}`,
    `\\position{${escapeLatex(tituloPrincipal)}{\\enskip\\cdotp\\enskip}${escapeLatex(tituloSecundario)}}`,
    `\\address{${escapeLatex(perfil.ubicacion)}}`,
    `\\mobile{${escapeLatex(perfil.mobile)}}`,
    `\\email{${escapeLatex(perfil.email)}}`,
    `\\github{${escapeLatex(handleFromUrl(perfil.github, "github.com"))}}`,
    `\\linkedin{${escapeLatex(handleFromUrl(perfil.linkedin, "linkedin.com"))}}`,
    `\\extrainfo{\\faGlobe\\ \\href{${perfil.sitioWeb}}{jdiegoisaza}}`,
  ].join("\n");
}

function buildExperiencia({ experiencia, ui }) {
  const entries = experiencia.map((job) => {
    const bullets = job.bullets
      .map((b) => `      \\item ${escapeLatex(b)}`)
      .join("\n");
    return [
      "\\cventry",
      `  {${escapeLatex(job.puesto)}} % Puesto`,
      `  {${escapeLatex(job.empresa)}} % Empresa`,
      `  {${escapeLatex(job.ubicacion)}} % Localización`,
      `  {${escapeLatex(job.periodo)}} % Fechas`,
      "  { % Descripción",
      "    \\begin{cvitems}",
      bullets,
      "    \\end{cvitems}",
      "  }",
    ].join("\n");
  });

  return ["%----------- EXPERIENCIA -----------", `\\cvsection{${escapeLatex(ui.pdf.experiencia)}}`, entries.join("\n\n")].join(
    "\n"
  );
}

function buildEducacion({ educacion, ui }) {
  const entries = educacion.map(
    (edu) =>
      `\\cventry{${escapeLatex(edu.periodo)}}{${escapeLatex(edu.titulo)}}{${escapeLatex(
        edu.institucion
      )}}{${escapeLatex(edu.ubicacion)}}{${escapeLatex(edu.detalle)}}{}`
  );

  return [
    "%----------- EDUCACIÓN -----------",
    `\\cvsection{${escapeLatex(ui.pdf.educacion)}}`,
    entries.join("\n"),
  ].join("\n");
}

function buildHabilidades({ habilidades, ui }) {
  const entries = habilidades.map(
    (h) => `  \\cvskill{${escapeLatex(h.categoria)}}{${escapeLatex(h.items.join(", "))}}`
  );

  return [
    "%----------- HABILIDADES -----------",
    `\\cvsection{${escapeLatex(ui.pdf.habilidades)}}`,
    "\\begin{cvskills}",
    entries.join("\n"),
    "\\end{cvskills}",
  ].join("\n");
}

function buildCertificaciones({ certificaciones, ui }) {
  // Si hay "detalle", el emisor va en la columna derecha (#3); si no, el emisor
  // va inline junto al título (#2) para no dejar una columna derecha vacía.
  const entries = certificaciones.map((c) => {
    const [segundo, tercero] = c.detalle ? [c.detalle, c.emisor] : [c.emisor, ""];
    return `  \\cvhonor{${escapeLatex(c.titulo)}}{${escapeLatex(segundo)}}{${escapeLatex(tercero)}}{}`;
  });

  return [
    "%----------- CERTIFICACIONES -----------",
    `\\cvsection{${escapeLatex(ui.pdf.certificaciones)}}`,
    "\\begin{cvhonors}",
    entries.join("\n"),
    "\\end{cvhonors}",
  ].join("\n");
}

function buildPortafolio({ proyectos, ui }) {
  const entries = proyectos.map((p) => {
    const stack = escapeLatex((p.stack || []).join(", "));
    const links = (p.repos || [])
      .map((r) => `\\href{${r.url}}{${escapeLatex(r.label)}}`)
      .join(", ");

    const descParts = [`\\textit{${escapeLatex(p.subtitulo)}.} ${escapeLatex(p.resumen)}`];
    if (links) descParts.push(`\\textbf{${escapeLatex(ui.pdf.repositorio)}:} ${links}`);

    return [
      "\\cventry",
      `  {${stack}} % Stack`,
      `  {${escapeLatex(p.titulo)}} % Proyecto`,
      "  {} % Localización",
      "  {} % Fechas",
      `  {${descParts.join(" ")}} % Descripción`,
    ].join("\n");
  });

  return ["%----------- PORTAFOLIO -----------", `\\cvsection{${escapeLatex(ui.pdf.portafolio)}}`, entries.join("\n\n")].join(
    "\n"
  );
}

function buildBody(cv) {
  const { ui } = cv;
  return [
    "%----------- PERFIL -----------",
    `\\cvsection{${escapeLatex(ui.pdf.perfil)}}`,
    "\\begin{cvparagraph}",
    escapeLatex(cv.perfil.perfilCV),
    "\\end{cvparagraph}",
    "",
    buildExperiencia(cv),
    "",
    buildEducacion(cv),
    buildHabilidades(cv),
    "",
    buildCertificaciones(cv),
    "",
    buildPortafolio(cv),
  ].join("\n");
}

const template = readFileSync(join(__dirname, "resume.template.tex"), "utf8");
for (const { cv, salida, fuente } of idiomas) {
  // Función de reemplazo para que los "$" del contenido no se interpreten como patrones de replace().
  const output = template
    .replace("%%HEADER%%", () => buildHeader(cv))
    .replace("%%BODY%%", () => buildBody(cv));

  writeFileSync(join(__dirname, salida), output, "utf8");
  console.log(`cv/${salida} generado desde ${fuente}`);
}
