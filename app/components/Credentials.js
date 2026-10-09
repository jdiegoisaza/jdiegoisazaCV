import { BadgeCheck } from "lucide-react";
import Reveal from "@/app/components/Reveal";
import CredentialsGrid from "@/app/components/CredentialsGrid";
import { listarCredenciales, agruparPorEmisor } from "@/app/lib/credenciales.mjs";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";

// Rutas locales (dentro de public/) llevan el basePath; las URLs remotas se dejan igual.
const asset = (ruta) => (/^https?:\/\//.test(ruta) ? ruta : `${basePath}/${ruta}`);

export default function Credentials({ cv }) {
  const { ui } = cv;
  const formato = new Intl.DateTimeFormat(ui.lang === "es" ? "es-CO" : "en-US", {
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  });

  const lista = listarCredenciales(ui.lang).map((c) => ({
    ...c,
    fechaTexto: formato.format(new Date(`${c.fecha}T00:00:00Z`)),
    imagen: asset(c.imagen),
    pdf: c.pdf ? asset(c.pdf) : undefined,
  }));
  const emisores = agruparPorEmisor(lista).map((g) => ({ emisor: g.emisor, total: g.items.length }));

  return (
    <section id="credenciales" className="bg-neutral-50 dark:bg-neutral-900/40 transition-colors">
      <div className="max-w-5xl mx-auto px-6 py-20">
        <Reveal>
          <div className="flex items-center gap-2 mb-2">
            <BadgeCheck className="w-5 h-5 text-blue-600 dark:text-blue-400" strokeWidth={2} />
            <h2 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">
              {ui.secciones.credenciales}
            </h2>
          </div>
          <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-8">
            {ui.secciones.credencialesIntro}
          </p>
        </Reveal>

        <CredentialsGrid
          credenciales={lista}
          emisores={emisores}
          labels={{
            todos: ui.secciones.todos,
            verificar: ui.secciones.verificar,
            verCertificado: ui.secciones.verCertificado,
          }}
        />
      </div>
    </section>
  );
}
