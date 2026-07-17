// Azure Static Web Apps sirve en la raíz de su propio dominio, no necesita basePath.
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
