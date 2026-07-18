import { habilidades, certificaciones, educacion } from "@/app/data/cv.mjs";

export default function Skills() {
  return (
    <section id="habilidades" className="max-w-5xl mx-auto px-6 py-16 border-t border-neutral-200">
      <h2 className="text-2xl font-bold text-neutral-900 mb-10">Habilidades técnicas</h2>

      <div className="grid sm:grid-cols-2 gap-x-8 gap-y-5 mb-16">
        {habilidades.map((skill) => (
          <div key={skill.categoria}>
            <p className="text-sm font-semibold text-neutral-900">{skill.categoria}</p>
            <p className="text-sm text-neutral-600">{skill.items}</p>
          </div>
        ))}
      </div>

      <h3 className="text-lg font-semibold text-neutral-900 mb-4">Certificaciones</h3>
      <ul className="space-y-2 mb-16">
        {certificaciones.map((cert) => (
          <li key={cert.titulo} className="text-sm text-neutral-700">
            <span className="font-medium text-neutral-900">{cert.titulo}</span>
            {cert.detalle ? `, ${cert.detalle}` : ""} —{" "}
            <span className="text-blue-600">{cert.emisor}</span>
          </li>
        ))}
      </ul>

      <h3 className="text-lg font-semibold text-neutral-900 mb-4">Educación</h3>
      <ul className="space-y-2">
        {educacion.map((edu) => (
          <li key={edu.titulo} className="text-sm text-neutral-700">
            <span className="font-medium text-neutral-900">{edu.titulo}</span> —{" "}
            {edu.institucion} ({edu.periodo}
            {edu.detalle ? `, ${edu.detalle}` : ""})
          </li>
        ))}
      </ul>
    </section>
  );
}
