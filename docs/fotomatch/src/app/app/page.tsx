"use client";

// Tela única do FotoMatch. Cópia adaptada do app/page.tsx do DumpAI.
// Mudanças:
//  - chama /api/analisar (não /api/curate); payload { images, modo }.
//  - QuizModo no lugar de QuizObjetivo; ResultadoMatch no lugar de ResultadoDump.
//  - validação 6..15 fotos.
// REUTILIZA sem mudança: estaLiberado (unlock.ts), comprimirVarias (images.ts),
// LoadingDump, e todo o fluxo de claim por e-mail (paywall).

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { estaLiberado } from "@/lib/unlock";
import { comprimirVarias } from "@/lib/images";
import {
  MAX_FOTOS,
  MIN_FOTOS,
  MODO_PADRAO,
  type ModoId,
  type ResultadoAnalise,
} from "@/lib/types";
import LoadingDump from "@/components/LoadingDump";
import ResultadoMatch from "@/components/ResultadoMatch";
import QuizModo, { lerModo } from "@/components/QuizModo";

type Estado = "checando" | "upload" | "carregando" | "resultado";

interface Foto {
  file: File;
  url: string; // object URL p/ preview (qualidade original)
}

export default function AppPage() {
  const router = useRouter();
  const [estado, setEstado] = useState<Estado>("checando");
  const [fotos, setFotos] = useState<Foto[]>([]);
  const [erro, setErro] = useState<string | null>(null);
  const [resultado, setResultado] = useState<{
    fotos: string[];
    justificativa: string;
    restantes?: number;
  } | null>(null);
  const [modo, setModo] = useState<ModoId>(MODO_PADRAO);
  const [prep, setPrep] = useState<{ feitas: number; total: number } | null>(
    null,
  );
  // Paywall: quando a IA responde 401, pedimos o e-mail da compra pra liberar.
  const [claimNecessario, setClaimNecessario] = useState(false);
  const [claimEmail, setClaimEmail] = useState("");
  const [claimMsg, setClaimMsg] = useState<string | null>(null);
  const [claimLoading, setClaimLoading] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const fotosRef = useRef<Foto[]>([]);
  fotosRef.current = fotos;

  // Guard de acesso: sem flag de pagamento, volta pra landing.
  useEffect(() => {
    if (estaLiberado()) {
      setModo(lerModo());
      setEstado("upload");
    } else {
      router.replace("/");
    }
  }, [router]);

  // Limpa object URLs ao desmontar.
  useEffect(() => {
    return () => {
      fotosRef.current.forEach((f) => URL.revokeObjectURL(f.url));
    };
  }, []);

  const adicionarArquivos = useCallback((lista: FileList | null) => {
    if (!lista) return;
    setErro(null);
    const novos = Array.from(lista).filter((f) => f.type.startsWith("image/"));
    setFotos((atuais) => {
      const espaco = MAX_FOTOS - atuais.length;
      if (espaco <= 0) {
        setErro(`Você já atingiu o limite de ${MAX_FOTOS} fotos.`);
        return atuais;
      }
      const aceitos = novos.slice(0, espaco).map((file) => ({
        file,
        url: URL.createObjectURL(file),
      }));
      if (novos.length > espaco) {
        setErro(`Limite de ${MAX_FOTOS} fotos — algumas não foram adicionadas.`);
      }
      return [...atuais, ...aceitos];
    });
    if (inputRef.current) inputRef.current.value = "";
  }, []);

  const removerFoto = useCallback((idx: number) => {
    setErro(null);
    setFotos((atuais) => {
      const f = atuais[idx];
      if (f) URL.revokeObjectURL(f.url);
      return atuais.filter((_, i) => i !== idx);
    });
  }, []);

  const reiniciar = useCallback(() => {
    fotosRef.current.forEach((f) => URL.revokeObjectURL(f.url));
    setFotos([]);
    setResultado(null);
    setErro(null);
    setEstado("upload");
  }, []);

  const gerar = useCallback(async () => {
    if (fotos.length < MIN_FOTOS) {
      setErro(`Envie pelo menos ${MIN_FOTOS} fotos suas.`);
      return;
    }
    setErro(null);
    setEstado("carregando");
    setPrep({ feitas: 0, total: fotos.length });
    try {
      const images = await comprimirVarias(
        fotos.map((f) => f.file),
        (feitas, total) => setPrep({ feitas, total }),
      );
      setPrep(null);
      const resp = await fetch("/api/analisar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ images, modo }),
      });

      if (resp.status === 401) {
        setClaimNecessario(true);
        setEstado("upload");
        return;
      }
      if (!resp.ok) {
        const data = (await resp.json().catch(() => null)) as {
          error?: string;
        } | null;
        throw new Error(data?.error || "Não foi possível analisar agora.");
      }

      const data = (await resp.json()) as ResultadoAnalise;
      const selecionadas = data.ranking
        .map((i) => fotos[i]?.url)
        .filter((u): u is string => Boolean(u));

      if (selecionadas.length === 0) {
        throw new Error("A IA não retornou fotos válidas. Tente de novo.");
      }

      setResultado({
        fotos: selecionadas,
        justificativa: data.justificativa,
        restantes: data.restantes,
      });
      setEstado("resultado");
    } catch (e) {
      setPrep(null);
      setErro(e instanceof Error ? e.message : "Erro inesperado.");
      setEstado("upload");
    }
  }, [fotos, modo]);

  // Libera o acesso confirmando o e-mail da compra (paywall), depois tenta gerar.
  const liberarAcesso = useCallback(async () => {
    const email = claimEmail.trim().toLowerCase();
    if (!email.includes("@")) {
      setClaimMsg("Digite o e-mail que você usou na compra.");
      return;
    }
    setClaimLoading(true);
    setClaimMsg(null);
    try {
      const resp = await fetch("/api/claim", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (resp.ok) {
        setClaimNecessario(false);
        setClaimMsg(null);
        gerar();
      } else {
        const d = (await resp.json().catch(() => null)) as {
          error?: string;
        } | null;
        setClaimMsg(d?.error || "Não foi possível liberar o acesso.");
      }
    } catch {
      setClaimMsg("Erro de conexão. Tente de novo.");
    } finally {
      setClaimLoading(false);
    }
  }, [claimEmail, gerar]);

  // ── Render por estado ────────────────────────────────────────────────────

  if (estado === "checando") {
    return (
      <main className="grid flex-1 place-items-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-line border-t-coral" />
      </main>
    );
  }

  if (estado === "carregando") {
    return (
      <main className="flex flex-1 flex-col">
        {prep ? (
          <div className="grid flex-1 place-items-center px-6 text-center">
            <div className="w-full max-w-xs">
              <p className="font-display text-lg font-bold">
                Preparando suas fotos…
              </p>
              <p className="mt-1 text-sm text-muted">
                {prep.feitas} de {prep.total}
              </p>
              <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-line">
                <div
                  className="h-full rounded-full bg-coral transition-all"
                  style={{
                    width: `${Math.round((prep.feitas / Math.max(1, prep.total)) * 100)}%`,
                  }}
                />
              </div>
            </div>
          </div>
        ) : (
          <LoadingDump />
        )}
      </main>
    );
  }

  if (estado === "resultado" && resultado) {
    return (
      <main className="mx-auto flex w-full max-w-md flex-1 flex-col">
        <ResultadoMatch
          fotos={resultado.fotos}
          justificativa={resultado.justificativa}
          modo={modo}
          totalEnviadas={fotos.length}
          restantes={resultado.restantes}
          onReset={reiniciar}
        />
      </main>
    );
  }

  // estado === "upload"
  const podeGerar = fotos.length >= MIN_FOTOS;
  return (
    <main className="bg-grain mx-auto flex w-full max-w-md flex-1 flex-col px-5 pb-32 pt-6">
      <header className="flex items-center justify-between">
        <span className="font-display text-lg font-extrabold tracking-tight">
          Foto<span className="text-coral">Match</span>
        </span>
        <span className="rounded-full border border-line bg-paper px-3 py-1 text-xs font-medium text-muted">
          {fotos.length}/{MAX_FOTOS} fotos
        </span>
      </header>

      <h1 className="mt-6 font-display text-2xl font-extrabold leading-tight tracking-tight">
        Suba suas fotos e a IA escolhe a melhor pro seu perfil
      </h1>
      <p className="mt-1 text-sm text-muted">
        Escolha de {MIN_FOTOS} a {MAX_FOTOS} fotos suas. Quanto mais variedade,
        melhor a escolha.
      </p>

      {/* Liberação por e-mail (paywall) */}
      {claimNecessario && (
        <div className="animate-pop mt-6 rounded-3xl border border-coral/40 bg-coral-soft p-5">
          <h2 className="font-display text-base font-bold text-coral-ink">
            🔓 Confirme sua compra
          </h2>
          <p className="mt-1 text-sm text-ink">
            Digite o e-mail que você usou na compra pra liberar a IA neste
            aparelho.
          </p>
          <input
            type="email"
            inputMode="email"
            autoComplete="email"
            value={claimEmail}
            onChange={(e) => setClaimEmail(e.target.value)}
            placeholder="seu@email.com"
            className="mt-3 w-full rounded-xl border border-line bg-paper px-4 py-3 text-sm outline-none focus:border-coral"
          />
          {claimMsg && <p className="mt-2 text-sm text-coral-ink">{claimMsg}</p>}
          <button
            onClick={liberarAcesso}
            disabled={claimLoading}
            className="mt-3 w-full rounded-xl bg-coral px-6 py-3 font-display text-sm font-bold text-paper transition active:scale-[0.98] disabled:opacity-60"
          >
            {claimLoading ? "Liberando…" : "Liberar acesso"}
          </button>
          <p className="mt-2 text-center text-xs text-muted">
            Pagou agora? Aguarde ~1 min e tente. Ainda não comprou?{" "}
            <a href="/" className="font-semibold text-coral-ink underline">
              Ver oferta
            </a>
          </p>
        </div>
      )}

      {/* Modo — ajusta o critério da IA */}
      <div className="mt-6 rounded-3xl border border-line bg-paper/60 p-4">
        <QuizModo variante="app" onSelect={setModo} />
        <p className="mt-2 text-xs text-muted">
          A IA escolhe a foto com mais cara de perfil pro modo certo. 🎯
        </p>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={(e) => adicionarArquivos(e.target.files)}
      />

      {/* Drop zone / botão de seleção */}
      <button
        onClick={() => inputRef.current?.click()}
        className="mt-6 flex flex-col items-center justify-center gap-2 rounded-3xl border-2 border-dashed border-coral/50 bg-coral-soft/50 px-6 py-10 text-center transition active:scale-[0.99]"
      >
        <span className="text-4xl">📲</span>
        <span className="font-display text-base font-bold">
          Toque para escolher fotos
        </span>
        <span className="text-xs text-muted">JPG, PNG ou WEBP da sua galeria</span>
      </button>

      {erro && (
        <p className="mt-4 rounded-xl border border-coral/40 bg-coral-soft px-3 py-2 text-sm text-coral-ink">
          {erro}
        </p>
      )}

      {/* Grade de miniaturas */}
      {fotos.length > 0 && (
        <div className="mt-6 grid grid-cols-3 gap-2">
          {fotos.map((f, i) => (
            <div
              key={f.url}
              className="animate-pop relative aspect-square overflow-hidden rounded-xl border border-line bg-paper-2"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={f.url}
                alt={`Foto ${i + 1}`}
                className="h-full w-full object-cover"
              />
              <button
                onClick={() => removerFoto(i)}
                aria-label={`Remover foto ${i + 1}`}
                className="absolute right-1 top-1 grid h-6 w-6 place-items-center rounded-full bg-ink/80 text-xs font-bold text-paper backdrop-blur transition active:scale-90"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}

      {/* CTA fixo no rodapé */}
      <div className="fixed inset-x-0 bottom-0 border-t border-line bg-paper/90 px-5 py-4 backdrop-blur">
        <div className="mx-auto w-full max-w-md">
          <button
            onClick={gerar}
            disabled={!podeGerar}
            className="w-full rounded-2xl bg-coral px-6 py-4 font-display text-lg font-extrabold text-paper shadow-[0_10px_30px_-8px_rgba(255,84,54,0.7)] transition active:scale-[0.98] disabled:cursor-not-allowed disabled:bg-line disabled:text-muted disabled:shadow-none"
          >
            {podeGerar
              ? "Achar Minha Melhor Foto"
              : `Escolha pelo menos ${MIN_FOTOS} fotos`}
          </button>
        </div>
      </div>
    </main>
  );
}
