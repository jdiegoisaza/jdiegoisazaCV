// Une las credenciales automáticas (credenciales.generated.json) con las manuales (PDF)
// para un idioma. La usan el sitio (components/Credentials.js) y el PDF (cv/generate-tex.mjs).
import generadas from "../data/credenciales.generated.json" with { type: "json" };
import { ocultar, ocultarEnPDF, manuales } from "../data/credenciales.mjs";

// Devuelve [{ id, titulo, emisor, fecha, imagen, url?, pdf? }] ordenadas de la más reciente a la más antigua.
export function listarCredenciales(lang) {
  const automaticas = generadas
    .filter((c) => !ocultar.includes(c.id))
    .map(({ id, titulo, emisor, fecha, url, imagen }) => ({ id, titulo, emisor, fecha, url, imagen }));

  const pdfs = manuales.map(({ id, titulo, emisor, fecha, pdf }) => {
    const ruta = typeof pdf === "string" ? pdf : pdf[lang] || pdf.es || Object.values(pdf)[0];
    return { id, titulo, emisor, fecha, pdf: ruta, imagen: `${ruta}.png` };
  });

  return [...automaticas, ...pdfs].sort(
    (a, b) => b.fecha.localeCompare(a.fecha) || a.titulo.localeCompare(b.titulo)
  );
}

// Para el CV en PDF: sin las de ocultarEnPDF.
export function listarCredencialesPDF(lang) {
  return listarCredenciales(lang).filter((c) => !ocultarEnPDF.includes(c.id));
}

// Versión compacta de los títulos de un emisor para el PDF: une los que comparten prefijo
// ("AWS SimuLearn: A", "AWS SimuLearn: B" -> "AWS SimuLearn (A / B)") y quita " in <emisor>".
export function titulosCompactos(items, emisor) {
  const sufijo = ` in ${emisor}`;
  const grupos = new Map();
  for (const { titulo } of items) {
    const corto = titulo.endsWith(sufijo) ? titulo.slice(0, -sufijo.length) : titulo;
    const sep = corto.indexOf(": ");
    const [prefijo, resto] = sep >= 0 ? [corto.slice(0, sep), corto.slice(sep + 2)] : [corto, null];
    if (!grupos.has(prefijo)) grupos.set(prefijo, []);
    if (resto) grupos.get(prefijo).push(resto);
  }
  return [...grupos.entries()].map(([prefijo, partes]) => {
    if (partes.length === 0) return prefijo;
    if (partes.length === 1) return `${prefijo}: ${partes[0]}`;
    return `${prefijo} (${partes.join(" / ")})`;
  });
}

// Agrupa por emisor; los emisores con más credenciales van primero.
export function agruparPorEmisor(lista) {
  const grupos = new Map();
  for (const c of lista) {
    if (!grupos.has(c.emisor)) grupos.set(c.emisor, []);
    grupos.get(c.emisor).push(c);
  }
  return [...grupos.entries()]
    .map(([emisor, items]) => ({ emisor, items }))
    .sort((a, b) => b.items.length - a.items.length || a.emisor.localeCompare(b.emisor));
}
