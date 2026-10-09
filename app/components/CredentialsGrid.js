"use client";

import { useState } from "react";

export default function CredentialsGrid({ credenciales, emisores, labels }) {
  const [filtro, setFiltro] = useState(null);
  const visibles = filtro ? credenciales.filter((c) => c.emisor === filtro) : credenciales;

  const chip = (activo) =>
    `rounded-full px-3 py-1 text-xs font-medium border transition-colors ${
      activo
        ? "bg-blue-600 border-blue-600 text-white"
        : "border-neutral-300 dark:border-neutral-700 text-neutral-600 dark:text-neutral-400 hover:border-blue-600 hover:text-blue-600 dark:hover:border-blue-400 dark:hover:text-blue-400"
    }`;

  return (
    <>
      <div className="flex flex-wrap gap-2 mb-8" role="group">
        <button type="button" className={chip(filtro === null)} aria-pressed={filtro === null} onClick={() => setFiltro(null)}>
          {labels.todos} ({credenciales.length})
        </button>
        {emisores.map(({ emisor, total }) => (
          <button
            key={emisor}
            type="button"
            className={chip(filtro === emisor)}
            aria-pressed={filtro === emisor}
            onClick={() => setFiltro(emisor)}
          >
            {emisor} ({total})
          </button>
        ))}
      </div>

      <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {visibles.map((c) => (
          <li
            key={c.id}
            className="flex gap-4 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-4 shadow-sm hover:shadow-md dark:shadow-none hover:border-blue-200 dark:hover:border-blue-800 transition-all"
          >
            {/* Insignias: imagen cuadrada. Certificados PDF: miniatura de la primera página. */}
            <div className="shrink-0 w-20 h-20 flex items-center justify-center">
              {/* eslint-disable-next-line @next/next/no-img-element -- export estático, imágenes ya optimizadas */}
              <img
                src={c.imagen}
                alt=""
                loading="lazy"
                className={
                  c.pdf
                    ? "max-w-full max-h-full rounded border border-neutral-200 dark:border-neutral-700"
                    : "max-w-full max-h-full object-contain"
                }
              />
            </div>
            <div className="min-w-0 flex flex-col">
              <p className="text-sm font-semibold text-neutral-900 dark:text-neutral-100 leading-snug">
                {c.titulo}
              </p>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                {c.emisor} · {c.fechaTexto}
              </p>
              <div className="mt-auto pt-2 flex flex-wrap gap-x-3 text-xs font-medium">
                {c.url && (
                  <a href={c.url} target="_blank" rel="noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline">
                    {labels.verificar} →
                  </a>
                )}
                {c.pdf && (
                  <a href={c.pdf} target="_blank" rel="noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline">
                    {labels.verCertificado} (PDF) →
                  </a>
                )}
              </div>
            </div>
          </li>
        ))}
      </ul>
    </>
  );
}
