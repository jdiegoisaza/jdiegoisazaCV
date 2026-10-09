"use client";

import { useEffect, useState } from "react";
import ThemeToggle from "@/app/components/ThemeToggle";

// Los ids de sección son los mismos en ambos idiomas; solo cambia la etiqueta (ui.nav).
const sectionIds = ["inicio", "experiencia", "habilidades", "credenciales", "portafolio", "contacto"];
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";

export default function Nav({ ui }) {
  const links = sectionIds.map((id) => ({ href: `#${id}`, label: ui.nav[id] }));
  const otroIdiomaHref = `${basePath}${ui.otroIdioma.href}`;
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("inicio");
  const [isDark, setIsDark] = useState(null);

  useEffect(() => {
    const sections = sectionIds
      .map((id) => document.getElementById(id))
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

        <div className="flex items-center gap-2 lg:hidden">
          <LangLink href={otroIdiomaHref} ui={ui} />
          <ThemeToggle isDark={isDark} onToggle={toggleTheme} ui={ui} />
          <button
            type="button"
            className="text-neutral-700 dark:text-neutral-300"
            onClick={() => setOpen((v) => !v)}
            aria-label={ui.nav.abrirMenu}
          >
            {open ? "✕" : "☰"}
          </button>
        </div>

        <div className="hidden lg:flex items-center gap-6">
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
          <div className="flex items-center gap-1">
            <LangLink href={otroIdiomaHref} ui={ui} />
            <ThemeToggle isDark={isDark} onToggle={toggleTheme} ui={ui} />
          </div>
        </div>
      </nav>

      {open && (
        <ul className="lg:hidden flex flex-col gap-1 px-6 pb-4 text-sm text-neutral-600 dark:text-neutral-400">
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

function LangLink({ href, ui }) {
  return (
    <a
      href={href}
      hrefLang={ui.lang === "es" ? "en" : "es"}
      title={ui.otroIdioma.titulo}
      aria-label={ui.otroIdioma.titulo}
      className="inline-flex items-center justify-center h-9 px-2 rounded-md text-xs font-semibold tracking-wide text-neutral-600 hover:text-blue-600 hover:bg-neutral-100 dark:text-neutral-300 dark:hover:text-blue-400 dark:hover:bg-neutral-800 transition-colors"
    >
      {ui.otroIdioma.label}
    </a>
  );
}
