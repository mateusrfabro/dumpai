import Link from "next/link";
import QuizModo from "@/components/QuizModo";

// LANDING do FotoMatch — ESTRUTURA/placeholders. Mesma arquitetura da landing do
// DumpAI (hero → prova → quiz → CTA → como funciona → footer + CTA fixo).
//
// >>> A COPY entra nos pontos marcados com {/* COPY: ... */}. Já temos copy pronta
//     do copywriter — colar nesses pontos. NÃO inventar promessa nova aqui.
//
// Reaproveita o sistema de design (coral/paper/ink) e o caminho "Já comprei? Entrar"
// → /success, idêntico ao DumpAI.

const PAYMENT_LINK =
  process.env.NEXT_PUBLIC_PAYMENT_LINK || "https://pay.kiwify.com.br/SEU-LINK";

function Brand() {
  return (
    <div className="flex items-center gap-2">
      <span className="grid h-8 w-8 place-items-center rounded-xl bg-ink text-paper text-lg font-display font-extrabold">
        F
      </span>
      <span className="font-display text-lg font-extrabold tracking-tight">
        Foto<span className="text-coral">Match</span>
      </span>
    </div>
  );
}

export default function LandingPage() {
  return (
    <main className="bg-grain flex flex-1 flex-col">
      <div className="mx-auto flex w-full max-w-md flex-1 flex-col px-5 pb-10 pt-6">
        <header className="flex items-center justify-between">
          <Brand />
          <Link
            href="/success"
            className="rounded-full border border-line bg-paper px-3 py-1 text-xs font-semibold text-coral-ink transition active:scale-95"
          >
            Já comprei? Entrar
          </Link>
        </header>

        {/* Hero */}
        <section className="mt-10 animate-fade-up">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-coral-soft px-3 py-1 text-xs font-semibold text-coral-ink">
            {/* COPY: selo/eyebrow — ex.: "✨ Análise por Inteligência Artificial" */}
            ✨ Sua foto de perfil escolhida por IA
          </span>
          <h1 className="mt-4 font-display text-[2.1rem] font-extrabold leading-[1.05] tracking-tight">
            {/* COPY: HEADLINE principal (a IA escolhe sua melhor foto de perfil) */}
            A IA escolhe a sua{" "}
            <span className="text-coral">melhor foto</span> de perfil
          </h1>
          <p className="mt-4 text-[15px] leading-relaxed text-muted">
            {/* COPY: SUBHEADLINE — explicar a oferta em 1-2 frases. Honesto:
                a IA ANALISA suas fotos e escolhe a melhor; não gera foto nova. */}
            Suba de 6 a 15 fotos suas e a IA aponta a que mais funciona pro seu
            perfil — pra Match (apps de namoro) ou pro LinkedIn — e explica o
            porquê em uma frase.
          </p>
        </section>

        {/* Prova visual / bullets — placeholders */}
        <ul className="mt-8 grid grid-cols-3 gap-2 text-center">
          {[
            ["🔍", "Nitidez"],
            ["😄", "Expressão"],
            ["💡", "Luz certa"],
          ].map(([emoji, label]) => (
            <li
              key={label}
              className="rounded-2xl border border-line bg-paper px-2 py-3"
            >
              <div className="text-xl">{emoji}</div>
              <div className="mt-1 text-xs font-semibold">{label}</div>
            </li>
          ))}
        </ul>

        {/* Quiz de modo — engaja e personaliza a análise */}
        <section className="mt-8 rounded-3xl border border-line bg-paper/60 p-5">
          <QuizModo variante="landing" />
          <p className="mt-3 text-xs text-muted">
            {/* COPY: micro-texto sob o quiz */}
            A IA usa o modo certo pra escolher sua foto. Escolhe pra ver depois.
            👇
          </p>
        </section>

        {/* CTA */}
        <section className="mt-8">
          <div className="mb-3 flex items-center justify-center">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-amber/20 px-3 py-1 text-xs font-bold text-ink">
              {/* COPY: selo de oferta — ex.: "🔥 Oferta de lançamento" */}
              🔥 Oferta de lançamento
            </span>
          </div>
          <Link
            href={PAYMENT_LINK}
            className="group block rounded-2xl bg-coral px-6 py-5 text-center shadow-[0_10px_30px_-8px_rgba(255,84,54,0.7)] transition active:scale-[0.98]"
          >
            <span className="block font-display text-xl font-extrabold text-paper">
              {/* COPY: rótulo do botão + ancoragem de preço. Preço REAL: R$ 19,90 */}
              Liberar IA por{" "}
              <span className="font-semibold text-paper/60 line-through">
                R$ 29,90
              </span>{" "}
              R$ 19,90
            </span>
            <span className="mt-0.5 block text-xs font-medium text-paper/80">
              {/* COPY: sub-rótulo do botão. Manter honesto com o nº de usos da env. */}
              Pagamento único • Pix na hora • Inclui análises da sua compra
            </span>
          </Link>
          <p className="mt-3 text-center text-xs text-muted">
            Já comprou?{" "}
            <Link
              href="/success"
              className="font-semibold text-coral-ink underline"
            >
              Entrar com seu e-mail
            </Link>
          </p>

          {/* Sinais de confiança (honestos) */}
          <div className="mt-5 grid grid-cols-3 gap-2 text-center">
            {[
              ["🛡️", "7 dias de garantia"],
              ["🔒", "Pix seguro (Kiwify)"],
              ["✨", "IA da Anthropic"],
            ].map(([emoji, label]) => (
              <div
                key={label}
                className="rounded-2xl border border-line bg-paper px-2 py-3"
              >
                <div className="text-lg">{emoji}</div>
                <div className="mt-1 text-[11px] font-semibold leading-tight">
                  {label}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Como funciona */}
        <section className="mt-12">
          <h2 className="font-display text-sm font-bold uppercase tracking-wide text-muted">
            Como funciona
          </h2>
          <ol className="mt-4 space-y-3">
            {[
              ["1", "Libere o acesso", "Pague R$ 19,90 no Pix — acesso na hora."],
              ["2", "Suba suas fotos", "Selecione de 6 a 15 fotos suas."],
              [
                "3",
                "Receba a escolha da IA",
                "A IA aponta a melhor foto pro seu perfil e explica o porquê.",
              ],
            ].map(([n, titulo, desc]) => (
              <li key={n} className="flex gap-3">
                <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-ink text-sm font-bold text-paper">
                  {n}
                </span>
                <div>
                  <div className="text-sm font-semibold">{titulo}</div>
                  <div className="text-sm text-muted">{desc}</div>
                </div>
              </li>
            ))}
          </ol>
        </section>

        <footer className="mt-auto pt-12 text-center text-xs text-muted">
          {/* COPY: rodapé/tagline */}
          FotoMatch © {new Date().getFullYear()} — sua melhor foto, escolhida por
          IA.
        </footer>
      </div>

      {/* CTA fixo no rodapé (sempre visível) */}
      <div className="sticky bottom-0 z-10 border-t border-line bg-paper/90 px-5 py-3 backdrop-blur">
        <Link
          href={PAYMENT_LINK}
          className="mx-auto flex w-full max-w-md items-center justify-center gap-2 rounded-2xl bg-coral px-6 py-3.5 text-center font-display text-base font-extrabold text-paper shadow-[0_8px_24px_-8px_rgba(255,84,54,0.7)] transition active:scale-[0.98]"
        >
          {/* COPY: rótulo do CTA fixo */}
          Liberar IA — R$ 19,90 no Pix
        </Link>
      </div>
    </main>
  );
}
