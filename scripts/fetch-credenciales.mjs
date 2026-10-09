// Actualiza las credenciales automáticas (Credly + Google Skills Boost) y las miniaturas de los PDF.
//
//   node scripts/fetch-credenciales.mjs
//
// - Lee los perfiles públicos configurados en app/data/credenciales.mjs.
// - Escribe app/data/credenciales.generated.json y descarga las imágenes a public/credenciales/img/.
// - Genera la miniatura (<pdf>.png) de cada PDF manual con pdftoppm (poppler), si está instalado.
//
// Nunca rompe el build: si una fuente falla, conserva lo que ya había en el JSON para esa fuente.
import { readFileSync, writeFileSync, existsSync, mkdirSync, statSync, renameSync, readdirSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { dirname, join, basename } from "node:path";
import { fileURLToPath } from "node:url";
import { fuentes, manuales, ocultar } from "../app/data/credenciales.mjs";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const publicDir = join(root, "public");
const imgDir = join(publicDir, "credenciales", "img");
const salida = join(root, "app", "data", "credenciales.generated.json");

// Nombres de emisor tal como queremos mostrarlos.
const EMISORES = {
  "IBM-SkillsBuild": "IBM SkillsBuild",
  Certiprof: "CertiProf",
};

const MESES = { Jan: 1, Feb: 2, Mar: 3, Apr: 4, May: 5, Jun: 6, Jul: 7, Aug: 8, Sep: 9, Oct: 10, Nov: 11, Dec: 12 };

function decodeHtml(s) {
  return s
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&#x27;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/\s+/g, " ")
    .trim();
}

async function getText(url, accept) {
  const res = await fetch(url, { headers: { Accept: accept, "User-Agent": "Mozilla/5.0 (portfolio build)" } });
  if (!res.ok) throw new Error(`${res.status} ${res.statusText} en ${url}`);
  return res.text();
}

async function fromCredly(usuario) {
  const items = [];
  let url = `https://www.credly.com/users/${usuario}/badges.json`;
  while (url) {
    const json = JSON.parse(await getText(url, "application/json"));
    for (const b of json.data) {
      if (!b.public || b.state !== "accepted") continue;
      const t = b.badge_template;
      const emisor = (t.issuer?.entities || []).map((e) => e.entity.name).join(" / ");
      const imagen = (b.image_url || t.image_url || "").replace("images.credly.com/images/", "images.credly.com/size/220x220/images/");
      items.push({
        id: `credly-${b.id}`,
        fuente: "credly",
        titulo: t.name,
        emisor: EMISORES[emisor] || emisor,
        fecha: b.issued_at_date,
        url: `https://www.credly.com/badges/${b.id}`,
        imagenRemota: imagen,
      });
    }
    url = json.metadata?.next_page_url || null;
  }
  return items;
}

async function fromSkillsBoost(perfil) {
  const html = await getText(`https://www.skills.google/public_profiles/${perfil}`, "text/html");
  const re =
    /class="badge-image" href="([^"]+)"><img[^>]*src="([^"]+)"[\s\S]*?ql-title-medium[^>]*>([\s\S]*?)<\/span>[\s\S]*?ql-body-medium[^>]*>([\s\S]*?)<\/span>/g;
  const items = [];
  let m;
  while ((m = re.exec(html))) {
    const [, url, imagen, titulo, earned] = m;
    const f = decodeHtml(earned).match(/([A-Z][a-z]{2}) (\d{1,2}), (\d{4})/);
    if (!f) continue;
    const fecha = `${f[3]}-${String(MESES[f[1]]).padStart(2, "0")}-${f[2].padStart(2, "0")}`;
    items.push({
      id: `skillsboost-${url.split("/").pop()}`,
      fuente: "skillsboost",
      // " - Locales" es la variante del curso para otros idiomas; el nombre es el mismo.
      titulo: decodeHtml(titulo).replace(/ - Locales$/, ""),
      emisor: "Google Cloud",
      fecha,
      url,
      imagenRemota: imagen,
    });
  }
  // El HTML cambia de vez en cuando: si no se pudo leer nada, es mejor fallar y conservar lo anterior.
  if (items.length === 0) throw new Error("no se encontró ninguna insignia en el HTML (¿cambió el formato?)");
  return items;
}

async function descargarImagen(item) {
  mkdirSync(imgDir, { recursive: true });
  const existente = readdirSync(imgDir).find((f) => f.startsWith(`${item.id}.`));
  if (existente) return `credenciales/img/${existente}`;
  const res = await fetch(item.imagenRemota);
  if (!res.ok) throw new Error(`${res.status} descargando ${item.imagenRemota}`);
  const tipo = res.headers.get("content-type") || "";
  const ext = tipo.includes("svg") ? "svg" : tipo.includes("jpeg") ? "jpg" : tipo.includes("webp") ? "webp" : "png";
  const archivo = `${item.id}.${ext}`;
  writeFileSync(join(imgDir, archivo), Buffer.from(await res.arrayBuffer()));
  return `credenciales/img/${archivo}`;
}

function generarMiniaturas() {
  const pdfs = manuales.flatMap((c) => (typeof c.pdf === "string" ? [c.pdf] : Object.values(c.pdf)));
  for (const rel of new Set(pdfs)) {
    const pdf = join(publicDir, rel);
    const png = `${pdf}.png`;
    if (!existsSync(pdf)) {
      console.warn(`  ! no existe ${rel}`);
      continue;
    }
    if (existsSync(png) && statSync(png).mtimeMs >= statSync(pdf).mtimeMs) continue;
    const prefijo = join(dirname(pdf), `${basename(pdf)}.tmp`);
    try {
      execFileSync("pdftoppm", ["-png", "-r", "40", "-f", "1", "-l", "1", pdf, prefijo], { stdio: "ignore" });
      // poppler escribe <prefijo>-1.png (o -01/-001 según el número de páginas).
      const generado = readdirSync(dirname(pdf)).find((f) => f.startsWith(`${basename(pdf)}.tmp-`));
      renameSync(join(dirname(pdf), generado), png);
      console.log(`  miniatura: ${rel}.png`);
    } catch {
      console.warn(`  ! no se pudo generar la miniatura de ${rel} (¿pdftoppm/poppler instalado?)`);
    }
  }
}

const anterior = existsSync(salida) ? JSON.parse(readFileSync(salida, "utf8")) : [];
const resultado = [];

for (const [fuente, leer, id] of [
  ["credly", fromCredly, fuentes.credly],
  ["skillsboost", fromSkillsBoost, fuentes.skillsBoost],
]) {
  if (!id) continue;
  try {
    const items = await leer(id);
    for (const item of items) {
      const { imagenRemota, ...resto } = item;
      if (ocultar.includes(item.id)) {
        // Queda en el JSON (para poder des-ocultarla) pero no se descarga su imagen.
        resto.imagen = imagenRemota;
        resultado.push(resto);
        continue;
      }
      try {
        resto.imagen = await descargarImagen(item);
      } catch (e) {
        console.warn(`  ! ${e.message}`);
        resto.imagen = imagenRemota;
      }
      resultado.push(resto);
    }
    console.log(`${fuente}: ${items.length} credenciales`);
  } catch (e) {
    const previas = anterior.filter((c) => c.fuente === fuente);
    console.warn(`! ${fuente}: ${e.message} — se conservan ${previas.length} credenciales del JSON anterior`);
    resultado.push(...previas);
  }
}

resultado.sort((a, b) => b.fecha.localeCompare(a.fecha) || a.titulo.localeCompare(b.titulo));
writeFileSync(salida, JSON.stringify(resultado, null, 2) + "\n", "utf8");
console.log(`app/data/credenciales.generated.json: ${resultado.length} credenciales`);

generarMiniaturas();
