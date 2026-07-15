import { experiencia } from "@/app/data/cv";

export default function Experience() {
  return (
    <section id="experiencia" className="max-w-5xl mx-auto px-6 py-16 border-t border-neutral-200">
      <h2 className="text-2xl font-bold text-neutral-900 mb-10">Experiencia</h2>

      <div className="space-y-10">
        {experiencia.map((job) => (
          <article key={`${job.empresa}-${job.periodo}`}>
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
        ))}
      </div>
    </section>
  );
}
