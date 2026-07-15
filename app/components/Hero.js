import { perfil } from "@/app/data/cv";

export default function Hero() {
  return (
    <section id="inicio" className="max-w-5xl mx-auto px-6 pt-16 pb-20">
      <p className="text-blue-600 font-medium mb-2">Hola, soy</p>
      <h1 className="text-4xl sm:text-5xl font-bold text-neutral-900 mb-3">
        {perfil.nombre}
      </h1>
      <h2 className="text-xl sm:text-2xl text-neutral-600 mb-6">{perfil.titulo}</h2>
      <p className="max-w-2xl text-neutral-700 leading-relaxed mb-8">
        {perfil.resumen}
      </p>

      <div className="flex flex-wrap gap-3">
        <a
          href="#contacto"
          className="rounded-md bg-blue-600 text-white px-5 py-2.5 text-sm font-medium hover:bg-blue-700 transition-colors"
        >
          Contactar
        </a>
        <a
          href={`${process.env.NEXT_PUBLIC_BASE_PATH}/CV_JuanIsaza.pdf`}
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
    </section>
  );
}
