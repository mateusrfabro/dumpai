"use client";

import { useEffect, useState } from "react";

const FRASES = [
  "Analisando a vibe das fotos…",
  "Julgando quem sorriu melhor…",
  "Eliminando as tremidas…",
  "Caçando os melhores ângulos…",
  "Detectando momentos espontâneos…",
  "Cortando as repetidas…",
  "Montando o carrossel perfeito…",
];

export default function LoadingDump() {
  const [i, setI] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setI((p) => (p + 1) % FRASES.length), 2200);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="grid flex-1 place-items-center px-6 py-16 text-center">
      <div>
        <div className="relative mx-auto h-20 w-20">
          <div className="absolute inset-0 animate-spin rounded-full border-4 border-line border-t-coral" />
          <div className="absolute inset-0 grid place-items-center text-2xl">
            ✨
          </div>
        </div>
        <p
          key={i}
          className="animate-fade-up mt-6 font-display text-lg font-bold tracking-tight"
          aria-live="polite"
        >
          {FRASES[i]}
        </p>
        <p className="mt-2 text-sm text-muted">
          A IA tá analisando foto por foto. Leva alguns segundos.
        </p>
      </div>
    </div>
  );
}
