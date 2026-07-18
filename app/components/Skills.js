import { Wrench, Award, GraduationCap } from "lucide-react";
import { habilidades, certificaciones, educacion } from "@/app/data/cv.mjs";
import Reveal from "@/app/components/Reveal";

export default function Skills() {
  return (
    <section id="habilidades" className="max-w-5xl mx-auto px-6 py-20">
      <Reveal>
        <div className="flex items-center gap-2 mb-10">
          <Wrench className="w-5 h-5 text-blue-600 dark:text-blue-400" strokeWidth={2} />
          <h2 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">
            Habilidades técnicas
          </h2>
        </div>
      </Reveal>

      <div className="grid sm:grid-cols-2 gap-4 mb-16">
        {habilidades.map((skill, idx) => (
          <Reveal key={skill.categoria} delay={idx * 40}>
            <div className="h-full rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-4 shadow-sm hover:shadow-md dark:shadow-none hover:border-blue-200 dark:hover:border-blue-800 transition-all">
              <p className="text-sm font-semibold text-neutral-900 dark:text-neutral-100 mb-2.5">
                {skill.categoria}
              </p>
              <div className="flex flex-wrap gap-1.5">
                {skill.items.map((item) => (
                  <span
                    key={item}
                    className="text-xs bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 rounded-full px-2.5 py-1"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          </Reveal>
        ))}
      </div>

      <Reveal>
        <div className="grid sm:grid-cols-2 gap-10">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Award className="w-4 h-4 text-blue-600 dark:text-blue-400" strokeWidth={2} />
              <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
                Certificaciones
              </h3>
            </div>
            <ul className="space-y-2">
              {certificaciones.map((cert) => (
                <li key={cert.titulo} className="text-sm text-neutral-700 dark:text-neutral-300">
                  <span className="font-medium text-neutral-900 dark:text-neutral-100">
                    {cert.titulo}
                  </span>
                  {cert.detalle ? `, ${cert.detalle}` : ""} —{" "}
                  <span className="text-blue-600 dark:text-blue-400">{cert.emisor}</span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-4">
              <GraduationCap className="w-4 h-4 text-blue-600 dark:text-blue-400" strokeWidth={2} />
              <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
                Educación
              </h3>
            </div>
            <ul className="space-y-2">
              {educacion.map((edu) => (
                <li key={edu.titulo} className="text-sm text-neutral-700 dark:text-neutral-300">
                  <span className="font-medium text-neutral-900 dark:text-neutral-100">
                    {edu.titulo}
                  </span>{" "}
                  — {edu.institucion} ({edu.periodo}
                  {edu.detalle ? `, ${edu.detalle}` : ""})
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
