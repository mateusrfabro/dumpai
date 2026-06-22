"use client";

import { useEffect, useState } from "react";
import { OBJETIVOS, type ObjetivoId } from "@/lib/types";

interface Props {
  /** URLs (object URLs) das fotos selecionadas, já na ordem escolhida pela IA. */
  fotos: string[];
  justificativa: string;
  objetivo: ObjetivoId;
  /** Quantas fotos o usuário enviou (pra mostrar "10 de N"). */
  totalEnviadas: number;
  /** Gerações restantes nesta compra (quando o paywall está ativo). */
  restantes?: number;
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

const nomeArquivo = (i: number) => `dump-${String(i + 1).padStart(2, "0")}.jpg`;

/** Download direto (funciona em desktop/Android; no iOS o navegador costuma abrir a imagem). */
function baixar(src: string, nome: string) {
  const a = document.createElement("a");
  a.href = src;
  a.download = nome;
  document.body.appendChild(a);
  a.click();
  a.remove();
}

export default function ResultadoDump({
  fotos,
  justificativa,
  objetivo,
  totalEnviadas,
  restantes,
  onReset,
}: Props) {
  const opcao = OBJETIVOS.find((o) => o.id === objetivo) ?? OBJETIVOS[0];

  // Pré-converte as fotos em File[] (pra usar o Web Share API sem perder o gesto
  // do usuário — no iPhone isso abre "Salvar X Imagens em Fotos").
  const [arquivos, setArquivos] = useState<File[]>([]);
  useEffect(() => {
    let vivo = true;
    Promise.all(
      fotos.map(async (url, i) => {
        const blob = await (await fetch(url)).blob();
        return new File([blob], nomeArquivo(i), {
          type: blob.type || "image/jpeg",
        });
      }),
    )
      .then((fs) => vivo && setArquivos(fs))
      .catch(() => {});
    return () => {
      vivo = false;
    };
  }, [fotos]);

  function podeCompartilhar(files: File[]): boolean {
    return (
      typeof navigator !== "undefined" &&
      !!navigator.canShare &&
      navigator.canShare({ files })
    );
  }

  async function salvar(files: File[], urls: string[]) {
    // iPhone/mobile: share sheet com "Salvar em Fotos".
    if (files.length && podeCompartilhar(files)) {
      try {
        await navigator.share({ files, title: "Meu Photo Dump 🔥" });
        return;
      } catch {
        // usuário cancelou ou não rolou — cai no download.
      }
    }
    // Desktop/Android: baixa cada uma.
    urls.forEach((u, i) =>
      setTimeout(() => baixar(u, nomeArquivo(i)), i * 250),
    );
  }

  const salvarTodas = () => salvar(arquivos, fotos);

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
              <button
                onClick={() => salvar(arquivos[i] ? [arquivos[i]] : [], [src])}
                aria-label={`Salvar foto ${i + 1}`}
                className="absolute bottom-3 right-3 grid h-9 w-9 place-items-center rounded-full bg-ink/85 text-paper backdrop-blur transition active:scale-90"
              >
                ⬇
              </button>
            </figure>
          ))}
        </div>
        <p className="px-5 text-center text-xs text-muted">
          ← arraste pra ver todas →
        </p>
      </div>

      {/* Como postar */}
      <div className="mt-6 rounded-2xl border border-line bg-paper-2 px-4 py-3 text-sm">
        <div className="font-display font-bold">📲 Como postar seu dump</div>
        <ol className="mt-1 list-decimal space-y-0.5 pl-5 text-muted">
          <li>
            Toque em <strong className="text-ink">Salvar as {fotos.length}{" "}
            fotos</strong> (no iPhone, escolha “Salvar em Fotos”).
          </li>
          <li>
            No Instagram, crie um carrossel e selecione na ordem{" "}
            <strong className="text-ink">1 → {fotos.length}</strong>.
          </li>
        </ol>
      </div>

      <div className="mt-auto space-y-3 pt-6">
        <button
          onClick={salvarTodas}
          className="w-full rounded-2xl bg-coral px-6 py-4 font-display text-base font-extrabold text-paper shadow-[0_10px_30px_-8px_rgba(255,84,54,0.7)] transition active:scale-[0.98]"
        >
          ⬇ Salvar as {fotos.length} fotos
        </button>
        <button
          onClick={onReset}
          className="w-full rounded-2xl border border-line bg-paper px-6 py-3.5 font-display text-base font-bold text-ink transition active:scale-[0.98]"
        >
          Gerar outro dump
        </button>
        {typeof restantes === "number" && (
          <p className="text-center text-xs text-muted">
            {restantes > 0
              ? `Você tem ${restantes} ${restantes === 1 ? "geração restante" : "gerações restantes"} nesta compra.`
              : "Essa foi sua última geração desta compra."}
          </p>
        )}
      </div>
    </div>
  );
}
