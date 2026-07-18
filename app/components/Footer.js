import { perfil } from "@/app/data/cv.mjs";

export default function Footer() {
  return (
    <footer className="border-t border-neutral-200 py-8">
      <div className="max-w-5xl mx-auto px-6 text-sm text-neutral-400">
        © {new Date().getFullYear()} {perfil.nombre}
      </div>
    </footer>
  );
}
