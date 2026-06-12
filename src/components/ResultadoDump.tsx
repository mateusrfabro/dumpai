"use client";

import { OBJETIVOS, type ObjetivoId } from "@/lib/types";

interface Props {
  /** URLs (object URLs) das fotos selecionadas, já na ordem escolhida pela IA. */
  fotos: string[];
  justificativa: string;
  objetivo: ObjetivoId;
  /** Quantas fotos o usuário enviou (pra mostrar "10 de N"). */
  totalEnviadas: number;
  onReset: () => void;
}

// Posições/delays fixos (evita hidratação não-determinística).
const HEARTS = [
  { e: "❤️", left: "10%", delay: "0s" },
  { e: "✨", left: "24%", delay: "0.5s" },
  { e: "❤️", left: "38%", delay: "0.2s" },
  { e: "💛", left: "52%", delay: "0.8s" },
  { e: "❤️", left: "66%", delay: "0.35s" },
  { e: "✨", left: "80%", delay: "0.65s" },
  { e: "💜", left: "47%", delay: "1.1s" },
];

export default function ResultadoDump({
  fotos,
  justificativa,
  objetivo,
  totalEnviadas,
  onReset,
}: Props) {
  const opcao = OBJETIVOS.find((o) => o.id === objetivo) ?? OBJETIVOS[0];

  return (
    <div className="animate-fade-up flex flex-1 flex-col px-5 pb-10 pt-2">
      {/* Cabeçalho com corações subindo */}
      <div className="relative overflow-hidden pb-1 pt-2 text-center">
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-44">
          {HEARTS.map((h, i) => (
            <span
              key={i}
              className="dump-heart"
              style={{ left: h.left, animationDelay: h.delay }}
            >
              {h.e}
            </span>
          ))}
        </div>

        <span className="relative inline-flex items-center gap-1.5 rounded-full bg-coral-soft px-3 py-1 text-xs font-bold text-coral-ink">
          🎯 Otimizado pra {opcao.titulo}
        </span>
        <h1 className="relative mt-3 font-display text-2xl font-extrabold tracking-tight">
          Seu dump com mais chance de
          <br />
          <span className="text-coral">{opcao.titulo.toLowerCase()}</span> 🔥
        </h1>
        <p className="relative mt-1 text-sm text-muted">
          {fotos.length} selecionadas de {totalEnviadas} — na ordem certa pro
          carrossel.
        </p>
      </div>

      {/* Justificativa da IA */}
      <div className="mt-5 rounded-2xl border border-line bg-coral-soft px-4 py-3">
        <div className="text-xs font-bold uppercase tracking-wide text-coral-ink">
          Por que essa combinação
        </div>
        <p className="mt-1 text-sm leading-relaxed text-ink">{justificativa}</p>
      </div>

      {/* Carrossel estilo Instagram (swipe horizontal com snap) */}
      <div className="mt-6 -mx-5">
        <div className="flex snap-x snap-mandatory gap-3 overflow-x-auto px-5 pb-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {fotos.map((src, i) => (
            <figure
              key={i}
              className="animate-pop relative aspect-square w-[78%] shrink-0 snap-center overflow-hidden rounded-3xl border border-line bg-paper-2 shadow-sm"
              style={{ animationDelay: `${i * 80}ms` }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={src}
                alt={`Foto selecionada ${i + 1}`}
                className="h-full w-full object-cover"
              />
              <figcaption className="absolute left-3 top-3 rounded-full bg-ink/85 px-2.5 py-1 text-xs font-bold text-paper backdrop-blur">
                {i + 1}/{fotos.length}
              </figcaption>
            </figure>
          ))}
        </div>
        <p className="px-5 text-center text-xs text-muted">
          ← arraste pra ver todas →
        </p>
      </div>

      <div className="mt-auto space-y-3 pt-8">
        <p className="text-center text-xs text-muted">
          Toque e segure numa foto pra salvar, ou tire print do carrossel.
        </p>
        <button
          onClick={onReset}
          className="w-full rounded-2xl bg-ink px-6 py-4 font-display text-base font-bold text-paper transition active:scale-[0.98]"
        >
          Gerar outro dump
        </button>
      </div>
    </div>
  );
}
