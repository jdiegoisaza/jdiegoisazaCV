# Sitio personal — Juan Diego Isaza

Sitio de una sola página (Next.js 16 + App Router + Tailwind v4). **`app/data/cv.mjs` es la única fuente de verdad del contenido** — tanto del sitio como del CV en PDF.

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

El CV se genera automáticamente a partir de `app/data/cv.mjs` — **no se edita LaTeX a mano**:

- `cv/resume.template.tex` — la plantilla (diseño, fuentes, márgenes, fixes de ATS). Solo se toca si cambia el diseño.
- `cv/generate-tex.mjs` — lee `app/data/cv.mjs` y genera `cv/resume.tex` (contenido real, no se comitea).
- `cv/fonts/` — Roboto + FontAwesome, empaquetadas (no dependen de fuentes del sistema).

Para editar el contenido del CV, **edita `app/data/cv.mjs`** (mismo archivo que alimenta el sitio) y regenera:

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
  xelatex -interaction=nonstopmode resume.tex
"
cp resume.pdf ../public/CV_JuanIsaza.pdf
```

En el pipeline esto corre automáticamente en cada push — ver más abajo.

## Infraestructura y despliegue

- **Hosting**: Azure Static Web Apps (`infra/` tiene la definición en Terraform).
- **CI/CD**: Azure DevOps Pipelines (`azure-pipelines.yml`), corriendo en un agente self-hosted, con tres stages:
  1. **Security** — Gitleaks, npm audit, Trivy, SBOM (CycloneDX), Checkov, SonarCloud.
  2. **Build** — genera y compila el CV (`node cv/generate-tex.mjs` + Docker/TeX Live), copia el PDF a `public/`, compila el sitio (`npm run build`).
  3. **Deploy** — publica a Azure Static Web Apps vía SWA CLI.
- Cada push a `main` dispara el pipeline automáticamente.

Ver `portafolio/03-infraestructura-devsecops-portafolio.md` (en el repo `HV/` local) para el detalle completo de cómo se armó esto.
