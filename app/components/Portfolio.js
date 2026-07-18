import { FolderGit2 } from "lucide-react";
import { proyectos } from "@/app/data/cv.mjs";
import Reveal from "@/app/components/Reveal";

export default function Portfolio() {
  return (
    <section id="portafolio" className="bg-neutral-50">
      <div className="max-w-5xl mx-auto px-6 py-20">
        <Reveal>
          <div className="flex items-center gap-2 mb-2">
            <FolderGit2 className="w-5 h-5 text-blue-600" strokeWidth={2} />
            <h2 className="text-2xl font-bold text-neutral-900">Portafolio</h2>
          </div>
          <p className="text-sm text-neutral-500 mb-10">
            Casos de estudio de proyectos reales, descritos sin datos confidenciales de cliente.
          </p>
        </Reveal>

        <div className="grid sm:grid-cols-2 gap-6">
          {proyectos.map((proyecto, idx) => (
            <Reveal key={proyecto.titulo} delay={idx * 50}>
              <article className="h-full rounded-lg border border-neutral-200 bg-white p-6 shadow-sm hover:shadow-lg hover:border-blue-200 hover:-translate-y-0.5 transition-all">
                <h3 className="font-semibold text-neutral-900 mb-1">{proyecto.titulo}</h3>
                <p className="text-sm text-blue-600 mb-3">{proyecto.subtitulo}</p>
                <p className="text-sm text-neutral-600 leading-relaxed mb-4">{proyecto.resumen}</p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {proyecto.stack.map((tech) => (
                    <span
                      key={tech}
                      className="text-xs bg-neutral-100 text-neutral-700 rounded px-2 py-1"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
                {proyecto.repos && (
                  <div className="flex flex-wrap gap-x-4 gap-y-1">
                    {proyecto.repos.map((repo) => (
                      <a
                        key={repo.url}
                        href={repo.url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-sm text-blue-600 hover:underline"
                      >
                        {repo.label} →
                      </a>
                    ))}
                  </div>
                )}
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
