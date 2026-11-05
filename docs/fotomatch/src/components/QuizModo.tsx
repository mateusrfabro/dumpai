"use client";

// Seletor de modo (Match vs Pro). Cópia fiel do QuizObjetivo.tsx do DumpAI,
// trocando OBJETIVOS→MODOS e a grid de 3 colunas por 2 (só dois modos).

import { useEffect, useState } from "react";
import { MODOS, MODO_KEY, MODO_PADRAO, type ModoId } from "@/lib/types";

interface Props {
  /** Chamado quando o usuário escolhe um modo. */
  onSelect?: (id: ModoId) => void;
  /** "app" reflete na análise; "landing" é teaser. */
  variante?: "landing" | "app";
}

/** Lê o modo salvo no localStorage (ou o padrão). */
export function lerModo(): ModoId {
  try {
    const v = localStorage.getItem(MODO_KEY);
    if (v && MODOS.some((o) => o.id === v)) return v as ModoId;
  } catch {
    // localStorage indisponível
  }
  return MODO_PADRAO;
}

export default function QuizModo({ onSelect, variante = "app" }: Props) {
  const [sel, setSel] = useState<ModoId>(MODO_PADRAO);

  // Hidrata a seleção do localStorage no cliente (evita mismatch de SSR).
  useEffect(() => {
    setSel(lerModo());
  }, []);

  function escolher(id: ModoId) {
    setSel(id);
    try {
      localStorage.setItem(MODO_KEY, id);
    } catch {
      // ignora
    }
    onSelect?.(id);
  }

  return (
    <div>
      <p className="text-sm font-semibold">
        {variante === "landing"
          ? "Você quer sua foto pra…"
          : "Sua foto é pra:"}
      </p>
      <div className="mt-3 grid grid-cols-2 gap-2">
        {MODOS.map((o) => {
          const ativo = sel === o.id;
          return (
            <button
              key={o.id}
              type="button"
              onClick={() => escolher(o.id)}
              aria-pressed={ativo}
              className={`flex flex-col items-center gap-1 rounded-2xl border px-2 py-4 text-center transition active:scale-95 ${
                ativo
                  ? "border-coral bg-coral-soft ring-2 ring-coral/40"
                  : "border-line bg-paper"
              }`}
            >
              <span className="text-2xl">{o.emoji}</span>
              <span className="w-full break-words text-xs font-bold leading-tight">
                {o.titulo}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
