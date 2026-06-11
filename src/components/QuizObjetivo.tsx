"use client";

import { useEffect, useState } from "react";
import {
  OBJETIVOS,
  OBJETIVO_KEY,
  OBJETIVO_PADRAO,
  type ObjetivoId,
} from "@/lib/types";

interface Props {
  /** Chamado quando o usuário escolhe um objetivo. */
  onSelect?: (id: ObjetivoId) => void;
  /** "app" mostra o objetivo já refletindo na curadoria; "landing" é teaser. */
  variante?: "landing" | "app";
}

/** Lê o objetivo salvo no localStorage (ou o padrão). */
export function lerObjetivo(): ObjetivoId {
  try {
    const v = localStorage.getItem(OBJETIVO_KEY);
    if (v && OBJETIVOS.some((o) => o.id === v)) return v as ObjetivoId;
  } catch {
    // localStorage indisponível
  }
  return OBJETIVO_PADRAO;
}

export default function QuizObjetivo({ onSelect, variante = "app" }: Props) {
  const [sel, setSel] = useState<ObjetivoId>(OBJETIVO_PADRAO);

  // Hidrata a seleção do localStorage no cliente (evita mismatch de SSR).
  useEffect(() => {
    setSel(lerObjetivo());
  }, []);

  function escolher(id: ObjetivoId) {
    setSel(id);
    try {
      localStorage.setItem(OBJETIVO_KEY, id);
    } catch {
      // ignora
    }
    onSelect?.(id);
  }

  return (
    <div>
      <p className="text-sm font-semibold">
        {variante === "landing"
          ? "Você quer suas fotos pra…"
          : "Seu objetivo nesse dump:"}
      </p>
      <div className="mt-3 grid grid-cols-3 gap-2">
        {OBJETIVOS.map((o) => {
          const ativo = sel === o.id;
          return (
            <button
              key={o.id}
              type="button"
              onClick={() => escolher(o.id)}
              aria-pressed={ativo}
              className={`flex flex-col items-center gap-1 rounded-2xl border px-2 py-3 text-center transition active:scale-95 ${
                ativo
                  ? "border-coral bg-coral-soft ring-2 ring-coral/40"
                  : "border-line bg-paper"
              }`}
            >
              <span className="text-xl">{o.emoji}</span>
              <span className="text-xs font-bold leading-tight">
                {o.titulo}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
