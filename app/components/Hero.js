import { perfil } from "@/app/data/cv.mjs";
import Reveal from "@/app/components/Reveal";

export default function Hero() {
  return (
    <section id="inicio" className="max-w-5xl mx-auto px-6 pt-20 pb-24">
      <Reveal>
        <div className="flex items-center gap-5 mb-6">
          <div className="shrink-0 w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-br from-blue-600 to-blue-400 text-white flex items-center justify-center text-xl sm:text-2xl font-bold shadow-lg shadow-blue-600/20">
            JD
          </div>
          <p className="text-blue-600 font-medium">Hola, soy</p>
        </div>

        <h1 className="text-4xl sm:text-5xl font-bold text-neutral-900 mb-3 tracking-tight">
          {perfil.nombre}
        </h1>
        <h2 className="text-xl sm:text-2xl text-neutral-600 mb-6">{perfil.titulo}</h2>
        <p className="max-w-2xl text-neutral-700 leading-relaxed mb-8">{perfil.resumen}</p>

        <div className="flex flex-wrap gap-3">
          <a
            href="#contacto"
            className="rounded-md bg-blue-600 text-white px-5 py-2.5 text-sm font-medium shadow-sm shadow-blue-600/20 hover:bg-blue-700 hover:shadow-md transition-all"
          >
            Contactar
          </a>
          <a
            href="/CV_JuanIsaza.pdf"
            className="rounded-md border border-neutral-300 px-5 py-2.5 text-sm font-medium text-neutral-700 hover:border-blue-600 hover:text-blue-600 transition-colors"
          >
            Descargar CV
          </a>
          <a
            href={perfil.github}
            target="_blank"
            rel="noreferrer"
            className="rounded-md border border-neutral-300 px-5 py-2.5 text-sm font-medium text-neutral-700 hover:border-blue-600 hover:text-blue-600 transition-colors"
          >
            GitHub
          </a>
          <a
            href={perfil.linkedin}
            target="_blank"
            rel="noreferrer"
            className="rounded-md border border-neutral-300 px-5 py-2.5 text-sm font-medium text-neutral-700 hover:border-blue-600 hover:text-blue-600 transition-colors"
          >
            LinkedIn
          </a>
        </div>
      </Reveal>
    </section>
  );
}
