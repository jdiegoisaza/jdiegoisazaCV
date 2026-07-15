# Sitio personal — Juan Diego Isaza

Sitio de una sola página (Next.js 16 + App Router + Tailwind v4) generado a partir del contenido de `../resume.tex`. El contenido vive centralizado en `app/data/cv.js` para que sea fácil mantenerlo sincronizado con el CV.

## Desarrollo local

```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000).

## Build estático

El sitio está configurado como **export estático** (`output: "export"` en `next.config.mjs`), pensado para GitHub Pages:

```bash
npm run build
```

Esto genera la carpeta `out/` con HTML/CSS/JS listos para cualquier hosting estático.

## Desplegar en GitHub Pages

1. Crea un repositorio en GitHub llamado **`jdiegoisazaHV`**. Como no es un repo `usuario.github.io`, el sitio se sirve bajo `https://jdiegoisaza.github.io/jdiegoisazaHV/` — `next.config.mjs` ya tiene el `basePath`/`assetPrefix` configurados para eso. Si en algún momento cambias el nombre del repo, actualiza la constante `basePath` en `next.config.mjs`.
2. Sube este contenido de `pagina-web/` a ese repositorio (rama `main`).
3. En GitHub → Settings → Pages, en "Build and deployment" selecciona **GitHub Actions** como source.
4. El workflow en `.github/workflows/deploy.yml` ya está listo: cada push a `main` compila y publica automáticamente. También puedes dispararlo manualmente desde la pestaña Actions.

## Pendientes antes de publicar

- Coloca tu CV compilado en `public/CV_JuanIsaza.pdf` (el botón "Descargar CV" del Hero ya apunta ahí).
- Completa la sección "Proyectos personales" en `app/data/cv.js` (`proyectos`) cuando tengas repos propios que mostrar — hoy aparece como "Próximamente" a propósito, para no inventar contenido.
- Revisa `app/data/cv.js` cada vez que cambie `resume.tex`, para que el sitio y el CV no se desalineen.
