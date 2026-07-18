import { Briefcase } from "lucide-react";
import { experiencia } from "@/app/data/cv.mjs";
import Reveal from "@/app/components/Reveal";

export default function Experience() {
  return (
    <section id="experiencia" className="bg-neutral-50">
      <div className="max-w-5xl mx-auto px-6 py-20">
        <Reveal>
          <div className="flex items-center gap-2 mb-10">
            <Briefcase className="w-5 h-5 text-blue-600" strokeWidth={2} />
            <h2 className="text-2xl font-bold text-neutral-900">Experiencia</h2>
          </div>
        </Reveal>

        <div className="relative">
          <div className="absolute left-[7px] top-2 bottom-2 w-px bg-neutral-200" aria-hidden="true" />

          <div className="space-y-10">
            {experiencia.map((job, idx) => (
              <Reveal key={`${job.empresa}-${job.periodo}`} delay={idx * 60}>
                <article className="relative pl-8">
                  <span
                    className="absolute left-0 top-1.5 w-[15px] h-[15px] rounded-full border-[3px] border-blue-600 bg-white"
                    aria-hidden="true"
                  />
                  <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-1 mb-1">
                    <h3 className="font-semibold text-neutral-900">
                      {job.puesto} <span className="text-neutral-500 font-normal">· {job.empresa}</span>
                    </h3>
                    <p className="text-sm text-neutral-500 whitespace-nowrap">{job.periodo}</p>
                  </div>
                  <p className="text-sm text-neutral-500 mb-3">{job.ubicacion}</p>
                  <ul className="list-disc list-outside pl-5 space-y-1.5 text-neutral-700 text-sm leading-relaxed">
                    {job.bullets.map((bullet, i) => (
                      <li key={i}>{bullet}</li>
                    ))}
                  </ul>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
