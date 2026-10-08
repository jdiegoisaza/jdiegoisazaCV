export default function Footer({ cv }) {
  const { perfil } = cv;
  return (
    <footer className="border-t border-neutral-200 dark:border-neutral-800 py-8 transition-colors">
      <div className="max-w-5xl mx-auto px-6 text-sm text-neutral-400 dark:text-neutral-600">
        © {new Date().getFullYear()} {perfil.nombre}
      </div>
    </footer>
  );
}
