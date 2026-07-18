"use client";

import { useEffect, useState } from "react";
import ThemeToggle from "@/app/components/ThemeToggle";

const links = [
  { href: "#inicio", label: "Inicio" },
  { href: "#experiencia", label: "Experiencia" },
  { href: "#habilidades", label: "Habilidades" },
  { href: "#portafolio", label: "Portafolio" },
  { href: "#contacto", label: "Contacto" },
];

export default function Nav() {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("inicio");
  const [isDark, setIsDark] = useState(null);

  useEffect(() => {
    const sections = links
      .map((link) => document.getElementById(link.href.slice(1)))
      .filter(Boolean);

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id);
        });
      },
      { rootMargin: "-45% 0px -50% 0px" }
    );

    sections.forEach((section) => observer.observe(section));
    setIsDark(document.documentElement.classList.contains("dark"));
    return () => observer.disconnect();
  }, []);

  function toggleTheme() {
    const next = !isDark;
    setIsDark(next);
    document.documentElement.classList.toggle("dark", next);
    try {
      localStorage.setItem("theme", next ? "dark" : "light");
    } catch (e) {
      // localStorage no disponible (modo privado, etc.) — no bloquea el toggle
    }
  }

  return (
    <header className="sticky top-0 z-50 bg-white/80 dark:bg-neutral-950/80 backdrop-blur-md border-b border-neutral-200 dark:border-neutral-800 transition-colors">
      <nav className="max-w-5xl mx-auto flex items-center justify-between px-6 py-4">
        <a href="#inicio" className="font-semibold text-neutral-900 dark:text-neutral-100">
          Juan Diego Isaza
        </a>

        <div className="flex items-center gap-2 sm:hidden">
          <ThemeToggle isDark={isDark} onToggle={toggleTheme} />
          <button
            type="button"
            className="text-neutral-700 dark:text-neutral-300"
            onClick={() => setOpen((v) => !v)}
            aria-label="Abrir menú"
          >
            {open ? "✕" : "☰"}
          </button>
        </div>

        <div className="hidden sm:flex items-center gap-6">
          <ul className="flex gap-6 text-sm">
            {links.map((link) => {
              const isActive = active === link.href.slice(1);
              return (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className={`relative pb-1 transition-colors ${
                      isActive
                        ? "text-blue-600 dark:text-blue-400 font-medium"
                        : "text-neutral-600 dark:text-neutral-400 hover:text-blue-600 dark:hover:text-blue-400"
                    }`}
                  >
                    {link.label}
                    <span
                      className={`absolute -bottom-[1px] left-0 h-[2px] bg-blue-600 dark:bg-blue-400 transition-all duration-300 ${
                        isActive ? "w-full" : "w-0"
                      }`}
                    />
                  </a>
                </li>
              );
            })}
          </ul>
          <ThemeToggle isDark={isDark} onToggle={toggleTheme} />
        </div>
      </nav>

      {open && (
        <ul className="sm:hidden flex flex-col gap-1 px-6 pb-4 text-sm text-neutral-600 dark:text-neutral-400">
          {links.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className="block py-2"
                onClick={() => setOpen(false)}
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>
      )}
    </header>
  );
}
