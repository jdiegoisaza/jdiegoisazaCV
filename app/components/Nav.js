"use client";

import { useEffect, useState } from "react";

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
    return () => observer.disconnect();
  }, []);

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-neutral-200">
      <nav className="max-w-5xl mx-auto flex items-center justify-between px-6 py-4">
        <a href="#inicio" className="font-semibold text-neutral-900">
          Juan Diego Isaza
        </a>

        <button
          type="button"
          className="sm:hidden text-neutral-700"
          onClick={() => setOpen((v) => !v)}
          aria-label="Abrir menú"
        >
          {open ? "✕" : "☰"}
        </button>

        <ul className="hidden sm:flex gap-6 text-sm">
          {links.map((link) => {
            const isActive = active === link.href.slice(1);
            return (
              <li key={link.href}>
                <a
                  href={link.href}
                  className={`relative pb-1 transition-colors ${
                    isActive ? "text-blue-600 font-medium" : "text-neutral-600 hover:text-blue-600"
                  }`}
                >
                  {link.label}
                  <span
                    className={`absolute -bottom-[1px] left-0 h-[2px] bg-blue-600 transition-all duration-300 ${
                      isActive ? "w-full" : "w-0"
                    }`}
                  />
                </a>
              </li>
            );
          })}
        </ul>
      </nav>

      {open && (
        <ul className="sm:hidden flex flex-col gap-1 px-6 pb-4 text-sm text-neutral-600">
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
