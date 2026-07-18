import { Mail } from "lucide-react";
import { perfil } from "@/app/data/cv.mjs";
import Reveal from "@/app/components/Reveal";

export default function Contact() {
  return (
    <section id="contacto" className="max-w-5xl mx-auto px-6 py-20">
      <Reveal>
        <div className="flex items-center gap-2 mb-4">
          <Mail className="w-5 h-5 text-blue-600" strokeWidth={2} />
          <h2 className="text-2xl font-bold text-neutral-900">Contacto</h2>
        </div>
        <p className="text-neutral-600 mb-6 max-w-xl">
          ¿Buscas un especialista DevSecOps / Azure DevOps para tu equipo? Escríbeme por
          cualquiera de estos canales.
        </p>
        <div className="flex flex-wrap gap-4 text-sm">
          <a
            href={`mailto:${perfil.email}`}
            className="rounded-md bg-blue-600 text-white px-5 py-2.5 font-medium shadow-sm shadow-blue-600/20 hover:bg-blue-700 hover:shadow-md transition-all"
          >
            {perfil.email}
          </a>
          <a
            href={perfil.linkedin}
            target="_blank"
            rel="noreferrer"
            className="rounded-md border border-neutral-300 px-5 py-2.5 font-medium text-neutral-700 hover:border-blue-600 hover:text-blue-600 transition-colors"
          >
            LinkedIn
          </a>
          <a
            href={perfil.github}
            target="_blank"
            rel="noreferrer"
            className="rounded-md border border-neutral-300 px-5 py-2.5 font-medium text-neutral-700 hover:border-blue-600 hover:text-blue-600 transition-colors"
          >
            GitHub
          </a>
        </div>
      </Reveal>
    </section>
  );
}
