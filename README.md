# Sitio personal — Juan Diego Isaza

Sitio de una sola página (Next.js 16 + App Router + Tailwind v4), bilingüe. El contenido vive en dos archivos de datos, que alimentan tanto el sitio como el CV en PDF:

| Idioma  | Archivo de datos       | Página | PDF                              |
| ------- | ---------------------- | ------ | -------------------------------- |
| Español | `app/data/cv.mjs`      | `/`    | `public/CV_JuanIsaza.pdf`        |
| Inglés  | `app/data/cv.en.mjs`   | `/en`  | `public/CV_JuanIsaza_EN.pdf`     |

Ambos archivos tienen **la misma forma** (mismas claves). Para cambiar algo, edita el valor en el archivo del idioma correspondiente; si agregas un trabajo, proyecto o habilidad, agrégalo en los dos. El objeto `ui` de cada archivo contiene los textos de interfaz (menú, títulos, botones) y los títulos de sección del PDF. Algunos campos son solo para el PDF: `perfil.perfilCV` (perfil extendido) y `proyectos[].resumenCV` (versión resumida de cada proyecto, para que el CV quepa en 2 páginas; el sitio muestra `subtitulo` + `resumen` completos).

## Desarrollo local

```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000). El botón "Descargar CV" apunta a `public/CV_JuanIsaza.pdf` — en local no se regenera solo, ver la sección de CV más abajo.

## Build estático

El sitio está configurado como **export estático** (`output: "export"` en `next.config.mjs`):

```bash
npm run build
```

Esto genera la carpeta `out/` con HTML/CSS/JS listos para cualquier hosting estático.

## CV en PDF (`cv/`)

El CV se genera automáticamente a partir de `app/data/cv.mjs` (ES) y `app/data/cv.en.mjs` (EN) — **no se edita LaTeX a mano**:

- `cv/resume.template.tex` — la plantilla (diseño, fuentes, márgenes, fixes de ATS). Solo se toca si cambia el diseño.
- `cv/generate-tex.mjs` — lee ambos archivos de datos y genera `cv/resume.tex` (ES) y `cv/resume_en.tex` (EN). No se comitean.
- `cv/fonts/` — Roboto + FontAwesome, empaquetadas (no dependen de fuentes del sistema).

Para editar el contenido del CV, **edita `app/data/cv.mjs` o `app/data/cv.en.mjs`** (los mismos que alimentan el sitio) y regenera:

```bash
node cv/generate-tex.mjs
```

Para compilar el PDF localmente (requiere Docker):

```bash
node cv/generate-tex.mjs
cd cv
docker run --rm -v "$(pwd):/data" -w /data texlive/texlive:latest bash -c "
  mkdir -p ~/.fonts && cp fonts/*.ttf ~/.fonts/ && fc-cache -f &&
  xelatex -interaction=nonstopmode resume.tex &&
  xelatex -interaction=nonstopmode resume.tex &&
  xelatex -interaction=nonstopmode resume_en.tex &&
  xelatex -interaction=nonstopmode resume_en.tex
"
cp resume.pdf ../public/CV_JuanIsaza.pdf
cp resume_en.pdf ../public/CV_JuanIsaza_EN.pdf
```

En el pipeline esto corre automáticamente en cada push — ver más abajo.

## Infraestructura y despliegue

- **Hosting**: Azure Static Web Apps (`infra/` tiene la definición en Terraform).
- **CI/CD**: Azure DevOps Pipelines (`azure-pipelines.yml`), corriendo en un agente self-hosted, con tres stages:
  1. **Security** — Gitleaks, npm audit, Trivy, SBOM (CycloneDX), Checkov, SonarCloud.
  2. **Build** — genera y compila ambos CV (`node cv/generate-tex.mjs` + Docker/TeX Live), copia los PDF a `public/`, compila el sitio (`npm run build`).
  3. **Deploy** — publica a Azure Static Web Apps vía SWA CLI.
- Cada push a `main` dispara el pipeline automáticamente.

Ver `portafolio/03-infraestructura-devsecops-portafolio.md` (en el repo `HV/` local) para el detalle completo de cómo se armó esto.
