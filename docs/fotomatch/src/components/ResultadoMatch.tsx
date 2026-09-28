"use client";

// Resultado do FotoMatch. Baseado no ResultadoDump.tsx do DumpAI:
//  - REAPROVEITA o mesmo helper Web Share / download (salvar.ts é o mesmo código).
//  - Em vez de carrossel de 10, mostra UMA foto vencedora grande + a frase +
//    duas alternativas menores (top 3). Mesma identidade visual (coral/paper).

import { useEffect, useState } from "react";
import { MODOS, type ModoId } from "@/lib/types";

interface Props {
  /** URLs (object URLs) das fotos do ranking, já na ordem escolhida pela IA (melhor primeiro). */
  fotos: string[];
  justificativa: string;
  modo: ModoId;
  /** Quantas fotos o usuário enviou (pra mostrar "1 escolhida de N"). */
  totalEnviadas: number;
  /** Gerações restantes nesta compra (quando o paywall está ativo). */
  restantes?: number;
  onReset: () => void;
}

const nomeArquivo = (i: number) =>
  i === 0 ? "fotomatch-perfil.jpg" : `fotomatch-alternativa-${i}.jpg`;

/** Download direto (funciona em desktop/Android; no iOS o navegador costuma abrir a imagem). */
function baixar(src: string, nome: string) {
  const a = document.createElement("a");
  a.href = src;
  a.download = nome;
  document.body.appendChild(a);
  a.click();
  a.remove();
}

function podeCompartilhar(files: File[]): boolean {
  return (
    typeof navigator !== "undefined" &&
    !!navigator.canShare &&
    navigator.canShare({ files })
  );
}

export default function ResultadoMatch({
  fotos,
  justificativa,
  modo,
  totalEnviadas,
  restantes,
  onReset,
}: Props) {
  const opcao = MODOS.find((o) => o.id === modo) ?? MODOS[0];
  const vencedora = fotos[0];
  const alternativas = fotos.slice(1);

  // Pré-converte as fotos em File[] (Web Share API sem perder o gesto do usuário —
  // no iPhone isso abre "Salvar Imagem em Fotos"). Mesma técnica do DumpAI.
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

  async function salvar(files: File[], urls: string[], nomes: string[]) {
    if (files.length && podeCompartilhar(files)) {
      try {
        await navigator.share({ files, title: "Minha foto de perfil 🔥" });
        return;
      } catch {
        // usuário cancelou ou não rolou — cai no download.
      }
    }
    urls.forEach((u, i) => setTimeout(() => baixar(u, nomes[i]), i * 250));
  }

  const salvarVencedora = () =>
    salvar(
      arquivos[0] ? [arquivos[0]] : [],
      [vencedora],
      [nomeArquivo(0)],
    );

  return (
    <div className="animate-fade-up flex flex-1 flex-col px-5 pb-10 pt-2">
      {/* Cabeçalho */}
      <div className="pb-1 pt-2 text-center">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-coral-soft px-3 py-1 text-xs font-bold text-coral-ink">
          {opcao.emoji} Melhor foto pro modo {opcao.titulo}
        </span>
        <h1 className="mt-3 font-display text-2xl font-extrabold tracking-tight">
          Sua foto de perfil é essa 👇
        </h1>
        <p className="mt-1 text-sm text-muted">
          1 escolhida de {totalEnviadas} fotos analisadas pela IA.
        </p>
      </div>

      {/* Foto vencedora — grande, quadrada */}
      <figure className="animate-pop relative mx-auto mt-5 aspect-square w-full max-w-xs overflow-hidden rounded-3xl border border-line bg-paper-2 shadow-sm">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={vencedora}
          alt="Foto de perfil recomendada"
          className="h-full w-full object-cover"
        />
        <figcaption className="absolute left-3 top-3 rounded-full bg-coral px-2.5 py-1 text-xs font-bold text-paper shadow">
          ⭐ Recomendada
        </figcaption>
      </figure>

      {/* Justificativa da IA */}
      <div className="mt-5 rounded-2xl border border-line bg-coral-soft px-4 py-3">
        <div className="text-xs font-bold uppercase tracking-wide text-coral-ink">
          Por que essa foto
        </div>
        <p className="mt-1 text-sm leading-relaxed text-ink">{justificativa}</p>
      </div>

      {/* Alternativas (top 2 restantes) */}
      {alternativas.length > 0 && (
        <div className="mt-6">
          <div className="font-display text-sm font-bold">
            Boas alternativas
          </div>
          <div className="mt-2 grid grid-cols-2 gap-2">
            {alternativas.map((src, i) => (
              <figure
                key={i}
                className="relative aspect-square overflow-hidden rounded-2xl border border-line bg-paper-2"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={src}
                  alt={`Alternativa ${i + 1}`}
                  className="h-full w-full object-cover"
                />
                <button
                  onClick={() =>
                    salvar(
                      arquivos[i + 1] ? [arquivos[i + 1]] : [],
                      [src],
                      [nomeArquivo(i + 1)],
                    )
                  }
                  aria-label={`Salvar alternativa ${i + 1}`}
                  className="absolute bottom-2 right-2 grid h-8 w-8 place-items-center rounded-full bg-ink/85 text-paper backdrop-blur transition active:scale-90"
                >
                  ⬇
                </button>
              </figure>
            ))}
          </div>
        </div>
      )}

      <div className="mt-auto space-y-3 pt-6">
        <button
          onClick={salvarVencedora}
          className="w-full rounded-2xl bg-coral px-6 py-4 font-display text-base font-extrabold text-paper shadow-[0_10px_30px_-8px_rgba(255,84,54,0.7)] transition active:scale-[0.98]"
        >
          ⬇ Salvar minha foto de perfil
        </button>
        <button
          onClick={onReset}
          className="w-full rounded-2xl border border-line bg-paper px-6 py-3.5 font-display text-base font-bold text-ink transition active:scale-[0.98]"
        >
          Analisar outras fotos
        </button>
        {typeof restantes === "number" && (
          <p className="text-center text-xs text-muted">
            {restantes > 0
              ? `Você tem ${restantes} ${restantes === 1 ? "análise restante" : "análises restantes"} nesta compra.`
              : "Essa foi sua última análise desta compra."}
          </p>
        )}
      </div>
    </div>
  );
}
