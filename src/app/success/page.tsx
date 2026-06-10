"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { UNLOCK_KEY } from "@/lib/unlock";

export default function SuccessPage() {
  const router = useRouter();

  useEffect(() => {
    // A plataforma de pagamento (Kiwify) redireciona pra cá após o Pix.
    // Liberamos o acesso e mandamos pro app.
    try {
      localStorage.setItem(UNLOCK_KEY, "true");
    } catch {
      // localStorage indisponível (modo privado raro) — segue mesmo assim.
    }
    const t = setTimeout(() => router.replace("/app"), 1600);
    return () => clearTimeout(t);
  }, [router]);

  return (
    <main className="bg-grain grid flex-1 place-items-center px-6">
      <div className="animate-pop w-full max-w-sm rounded-3xl border border-line bg-paper p-8 text-center shadow-sm">
        <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-coral text-3xl text-paper shadow-[0_10px_30px_-8px_rgba(255,84,54,0.7)]">
          ✓
        </div>
        <h1 className="mt-5 font-display text-2xl font-extrabold tracking-tight">
          Pagamento confirmado!
        </h1>
        <p className="mt-2 text-sm text-muted">
          Acesso liberado. Te levando pro DumpAI…
        </p>
        <div className="mt-6 flex items-center justify-center gap-1.5 text-coral">
          <span className="h-2 w-2 animate-bounce rounded-full bg-coral [animation-delay:-0.2s]" />
          <span className="h-2 w-2 animate-bounce rounded-full bg-coral [animation-delay:-0.1s]" />
          <span className="h-2 w-2 animate-bounce rounded-full bg-coral" />
        </div>
        <p className="mt-6 text-xs text-muted">
          Não foi redirecionado?{" "}
          <a href="/app" className="font-semibold text-coral-ink underline">
            Entrar no app
          </a>
        </p>
      </div>
    </main>
  );
}
