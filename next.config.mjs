// Azure Static Web Apps sirve en la raíz (no necesita basePath).
// GitHub Pages (repo de proyecto, no usuario.github.io) sirve bajo /jdiegoisazaCV/.
// Cada pipeline exporta NEXT_PUBLIC_BASE_PATH según el destino; en local/Azure queda vacío.
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  images: {
    unoptimized: true,
  },
  ...(basePath ? { basePath, assetPrefix: `${basePath}/` } : {}),
  env: {
    NEXT_PUBLIC_BASE_PATH: basePath,
  },
};

export default nextConfig;
