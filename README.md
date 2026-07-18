# Sitio personal — Juan Diego Isaza

Sitio de una sola página (Next.js 16 + App Router + Tailwind v4). El contenido vive centralizado en `app/data/cv.js`, y el CV en PDF se compila desde LaTeX en `cv/resume.tex`.

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

`cv/resume.tex` (clase `awesome-cv.cls` + fuentes en `cv/fonts/`) es la fuente de verdad del CV. El PDF **no se comitea** — se compila en cada corrida del pipeline con Docker + TeX Live y se copia a `public/CV_JuanIsaza.pdf` antes del build de Next.js.

Para compilarlo localmente (requiere Docker):

```bash
cd cv
docker run --rm -v "$(pwd):/data" -w /data texlive/texlive:latest bash -c "
  mkdir -p ~/.fonts && cp fonts/*.ttf ~/.fonts/ && fc-cache -f &&
  xelatex -interaction=nonstopmode resume.tex &&
  xelatex -interaction=nonstopmode resume.tex
"
cp resume.pdf ../public/CV_JuanIsaza.pdf
```

Revisa `app/data/cv.js` cada vez que cambie `cv/resume.tex`, para que el sitio y el CV no se desalineen (son dos fuentes de contenido independientes).

## Infraestructura y despliegue

- **Hosting**: Azure Static Web Apps (`infra/` tiene la definición en Terraform).
- **CI/CD**: Azure DevOps Pipelines (`azure-pipelines.yml`), corriendo en un agente self-hosted, con tres stages:
  1. **Security** — Gitleaks, npm audit, Trivy, SBOM (CycloneDX), Checkov, SonarCloud.
  2. **Build** — compila el CV (Docker + TeX Live), compila el sitio (`npm run build`).
  3. **Deploy** — publica a Azure Static Web Apps vía SWA CLI.
- Cada push a `main` dispara el pipeline automáticamente.

Ver `portafolio/03-infraestructura-devsecops-portafolio.md` (en el repo `HV/` local) para el detalle completo de cómo se armó esto.
