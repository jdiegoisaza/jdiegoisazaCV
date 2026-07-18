// Genera cv/resume.tex a partir de resume.template.tex + app/data/cv.mjs.
// Fuente de verdad del contenido: app/data/cv.mjs (la misma que usa el sitio).
import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import {
  perfil,
  experiencia,
  educacion,
  habilidades,
  certificaciones,
  proyectos,
} from "../app/data/cv.mjs";

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

function buildHeader() {
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

function buildExperiencia() {
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

  return ["%----------- EXPERIENCIA -----------", "\\cvsection{Experiencia}", entries.join("\n\n")].join(
    "\n"
  );
}

function buildEducacion() {
  const entries = educacion.map(
    (edu) =>
      `\\cventry{${escapeLatex(edu.periodo)}}{${escapeLatex(edu.titulo)}}{${escapeLatex(
        edu.institucion
      )}}{${escapeLatex(edu.ubicacion)}}{${escapeLatex(edu.detalle)}}{}`
  );

  return [
    "%----------- EDUCACIÓN -----------",
    "\\cvsection{Educación}",
    entries.join("\n"),
  ].join("\n");
}

function buildHabilidades() {
  const entries = habilidades.map(
    (h) => `  \\cvskill{${escapeLatex(h.categoria)}}{${escapeLatex(h.items.join(", "))}}`
  );

  return [
    "%----------- HABILIDADES -----------",
    "\\cvsection{Habilidades Técnicas}",
    "\\begin{cvskills}",
    entries.join("\n"),
    "\\end{cvskills}",
  ].join("\n");
}

function buildCertificaciones() {
  // Si hay "detalle", el emisor va en la columna derecha (#3); si no, el emisor
  // va inline junto al título (#2) para no dejar una columna derecha vacía.
  const entries = certificaciones.map((c) => {
    const [segundo, tercero] = c.detalle ? [c.detalle, c.emisor] : [c.emisor, ""];
    return `  \\cvhonor{${escapeLatex(c.titulo)}}{${escapeLatex(segundo)}}{${escapeLatex(tercero)}}{}`;
  });

  return [
    "%----------- CERTIFICACIONES -----------",
    "\\cvsection{Certificaciones}",
    "\\begin{cvhonors}",
    entries.join("\n"),
    "\\end{cvhonors}",
  ].join("\n");
}

function buildPortafolio() {
  const entries = proyectos.map((p) => {
    const stack = escapeLatex((p.stack || []).join(", "));
    const links = (p.repos || [])
      .map((r) => `\\href{${r.url}}{${escapeLatex(r.label)}}`)
      .join(", ");

    const descParts = [`\\textit{${escapeLatex(p.subtitulo)}.} ${escapeLatex(p.resumen)}`];
    if (links) descParts.push(`\\textbf{Repositorio:} ${links}`);

    return [
      "\\cventry",
      `  {${stack}} % Stack`,
      `  {${escapeLatex(p.titulo)}} % Proyecto`,
      "  {} % Localización",
      "  {} % Fechas",
      `  {${descParts.join(" ")}} % Descripción`,
    ].join("\n");
  });

  return ["%----------- PORTAFOLIO -----------", "\\cvsection{Portafolio}", entries.join("\n\n")].join(
    "\n"
  );
}

function buildBody() {
  return [
    "%----------- PERFIL -----------",
    "\\cvsection{Perfil Profesional}",
    "\\begin{cvparagraph}",
    escapeLatex(perfil.perfilCV),
    "\\end{cvparagraph}",
    "",
    buildExperiencia(),
    "",
    buildEducacion(),
    buildHabilidades(),
    "",
    buildCertificaciones(),
    "",
    buildPortafolio(),
  ].join("\n");
}

const template = readFileSync(join(__dirname, "resume.template.tex"), "utf8");
const output = template
  .replace("%%HEADER%%", buildHeader())
  .replace("%%BODY%%", buildBody());

writeFileSync(join(__dirname, "resume.tex"), output, "utf8");
console.log("cv/resume.tex generado desde app/data/cv.mjs");
