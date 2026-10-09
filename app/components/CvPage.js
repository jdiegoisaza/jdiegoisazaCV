import Nav from "@/app/components/Nav";
import Hero from "@/app/components/Hero";
import Experience from "@/app/components/Experience";
import Skills from "@/app/components/Skills";
import Credentials from "@/app/components/Credentials";
import Portfolio from "@/app/components/Portfolio";
import Contact from "@/app/components/Contact";
import Footer from "@/app/components/Footer";

// Página completa del CV para un idioma. `cv` es el módulo de datos (cv.mjs o cv.en.mjs).
export default function CvPage({ cv }) {
  return (
    <>
      {/* El root layout fija lang="es"; aquí se ajusta al idioma real de la página (p. ej. /en). */}
      <script dangerouslySetInnerHTML={{ __html: `document.documentElement.lang=${JSON.stringify(cv.ui.lang)};` }} />
      <Nav ui={cv.ui} />
      <main className="flex-1">
        <Hero cv={cv} />
        <Experience cv={cv} />
        <Skills cv={cv} />
        <Credentials cv={cv} />
        <Portfolio cv={cv} />
        <Contact cv={cv} />
      </main>
      <Footer cv={cv} />
    </>
  );
}
