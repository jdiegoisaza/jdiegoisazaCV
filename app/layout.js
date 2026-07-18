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

export const metadata = {
  title: "Juan Diego Isaza Londoño — Especialista DevSecOps",
  description:
    "Especialista DevSecOps · Ingeniero de Sistemas. Azure DevOps, CI/CD, automatización y seguridad en pipelines.",
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
