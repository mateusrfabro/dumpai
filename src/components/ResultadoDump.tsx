"use client";

interface Props {
  /** URLs (object URLs) das fotos selecionadas, já na ordem escolhida pela IA. */
  fotos: string[];
  justificativa: string;
  onReset: () => void;
}

export default function ResultadoDump({ fotos, justificativa, onReset }: Props) {
  return (
    <div className="animate-fade-up flex flex-1 flex-col px-5 pb-10 pt-2">
      <div className="text-center">
        <h1 className="font-display text-2xl font-extrabold tracking-tight">
          Seu dump tá pronto 🔥
        </h1>
        <p className="mt-1 text-sm text-muted">
          As {fotos.length} melhores, na ordem certa pro carrossel.
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
              className="relative aspect-square w-[78%] shrink-0 snap-center overflow-hidden rounded-3xl border border-line bg-paper-2 shadow-sm"
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
