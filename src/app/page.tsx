import Link from "next/link";

const PAYMENT_LINK = process.env.NEXT_PUBLIC_PAYMENT_LINK || "#";

// Cartões decorativos que imitam um photo dump (sem imagens externas).
const CARDS = [
  { emoji: "📸", bg: "bg-coral", rot: "-rotate-6", delay: "0s" },
  { emoji: "🎉", bg: "bg-amber", rot: "rotate-3", delay: "0.6s" },
  { emoji: "🌅", bg: "bg-[#7BC4A4]", rot: "-rotate-2", delay: "1.2s" },
  { emoji: "😎", bg: "bg-[#8E7CC3]", rot: "rotate-6", delay: "1.8s" },
];

function Brand() {
  return (
    <div className="flex items-center gap-2">
      <span className="grid h-8 w-8 place-items-center rounded-xl bg-ink text-paper text-lg font-display font-extrabold">
        D
      </span>
      <span className="font-display text-lg font-extrabold tracking-tight">
        Dump<span className="text-coral">AI</span>
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
          <span className="rounded-full border border-line bg-paper px-3 py-1 text-xs font-medium text-muted">
            Pix • R$ 19,90
          </span>
        </header>

        {/* Hero */}
        <section className="mt-10 animate-fade-up">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-coral-soft px-3 py-1 text-xs font-semibold text-coral-ink">
            ✨ Curadoria por Inteligência Artificial
          </span>
          <h1 className="mt-4 font-display text-[2.1rem] font-extrabold leading-[1.05] tracking-tight">
            A IA que escolhe as{" "}
            <span className="text-coral">10 melhores fotos</span> para o seu
            Photo Dump no Instagram
          </h1>
          <p className="mt-4 text-[15px] leading-relaxed text-muted">
            Suba até 30 fotos da rolê e deixa a IA fazer a parte chata: ela
            escolhe as nítidas, com sorrisos e momentos espontâneos — sem
            repetição — e monta o carrossel perfeito.
          </p>
        </section>

        {/* Pilha de fotos animada */}
        <section className="relative mt-10 mb-2 grid h-44 place-items-center">
          <div className="flex items-center">
            {CARDS.map((c, i) => (
              <div
                key={i}
                className={`animate-float ${c.rot} ${c.bg} -ml-4 first:ml-0 grid h-28 w-24 place-items-center rounded-2xl border-4 border-paper text-4xl shadow-lg`}
                style={{ animationDelay: c.delay }}
              >
                {c.emoji}
              </div>
            ))}
          </div>
        </section>

        {/* Bullets */}
        <ul className="mt-6 grid grid-cols-3 gap-2 text-center">
          {[
            ["🔍", "Nítidas"],
            ["😄", "Sorrisos"],
            ["🚫", "Sem repetir"],
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

        {/* CTA */}
        <section className="mt-10">
          <Link
            href={PAYMENT_LINK}
            className="group block rounded-2xl bg-coral px-6 py-5 text-center shadow-[0_10px_30px_-8px_rgba(255,84,54,0.7)] transition active:scale-[0.98]"
          >
            <span className="block font-display text-xl font-extrabold text-paper">
              Liberar IA por apenas R$ 19,90
            </span>
            <span className="mt-0.5 block text-xs font-medium text-paper/80">
              Pagamento único • Pix na hora • Acesso imediato
            </span>
          </Link>
          <p className="mt-3 text-center text-xs text-muted">
            Sem assinatura. Sem mensalidade. Liberou, é seu.
          </p>
        </section>

        {/* Como funciona */}
        <section className="mt-12">
          <h2 className="font-display text-sm font-bold uppercase tracking-wide text-muted">
            Como funciona
          </h2>
          <ol className="mt-4 space-y-3">
            {[
              ["1", "Libere o acesso", "Pague R$ 19,90 no Pix — acesso na hora."],
              ["2", "Suba suas fotos", "Selecione até 30 fotos do seu rolê."],
              [
                "3",
                "Receba o dump pronto",
                "A IA devolve as 10 melhores num carrossel estilo Insta.",
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
          DumpAI © {new Date().getFullYear()} — feito pra quem tem foto demais e
          paciência de menos.
        </footer>
      </div>
    </main>
  );
}
