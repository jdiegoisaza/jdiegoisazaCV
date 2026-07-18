"use client";

import { Sun, Moon } from "lucide-react";

export default function ThemeToggle({ isDark, onToggle }) {
  // Evita parpadeo de ícono incorrecto antes de saber el tema real en el cliente
  if (isDark === null) {
    return <span className="inline-block w-9 h-9" aria-hidden="true" />;
  }

  return (
    <button
      type="button"
      onClick={onToggle}
      aria-label={isDark ? "Cambiar a modo claro" : "Cambiar a modo oscuro"}
      className="inline-flex items-center justify-center w-9 h-9 rounded-md text-neutral-600 hover:text-blue-600 hover:bg-neutral-100 dark:text-neutral-300 dark:hover:text-blue-400 dark:hover:bg-neutral-800 transition-colors"
    >
      {isDark ? <Sun className="w-[18px] h-[18px]" /> : <Moon className="w-[18px] h-[18px]" />}
    </button>
  );
}
