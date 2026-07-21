import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const title = "Juan Diego Isaza Londoño — Especialista DevSecOps";
const description =
  "Portafolio con casos de estudio reales de automatización DevSecOps en Azure: pipelines, seguridad integrada y despliegue continuo, incluyendo cómo construí y aseguré este mismo sitio.";

export const metadata = {
  metadataBase: new URL("https://salmon-bush-02614530f.7.azurestaticapps.net"),
  title,
  description,
  openGraph: {
    title,
    description,
    url: "/",
    siteName: "Juan Diego Isaza — Portafolio",
    locale: "es_CO",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
  },
};

// Aplica el tema guardado ANTES del primer render para evitar el flash del tema incorrecto.
const themeInitScript = `
(function () {
  try {
    var saved = localStorage.getItem("theme");
    var wantsDark = saved ? saved === "dark" : window.matchMedia("(prefers-color-scheme: dark)").matches;
    document.documentElement.classList.toggle("dark", wantsDark);
  } catch (e) {}
})();
`;

export default function RootLayout({ children }) {
  return (
    <html
      lang="es"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-white text-neutral-900 dark:bg-neutral-950 dark:text-neutral-100 transition-colors">
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
        {children}
      </body>
    </html>
  );
}
