// Repo de proyecto (no jdiegoisaza.github.io), se sirve bajo /jdiegoisazaCV/
const basePath = "/jdiegoisazaCV";

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  images: {
    unoptimized: true,
  },
  basePath,
  assetPrefix: `${basePath}/`,
  env: {
    // Para construir hrefs a assets públicos (ej. el PDF del CV) desde componentes cliente/servidor.
    NEXT_PUBLIC_BASE_PATH: basePath,
  },
};

export default nextConfig;
