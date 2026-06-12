"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { UNLOCK_KEY } from "@/lib/unlock";

export default function SuccessPage() {
  const router = useRouter();
  const [fase, setFase] = useState<"ativando" | "email">("ativando");
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const irProApp = useCallback(() => {
    try {
      localStorage.setItem(UNLOCK_KEY, "true");
    } catch {
      // ignora
    }
    router.replace("/app");
  }, [router]);

  // Ao chegar do pagamento: tenta liberar automático se a Kiwify passar algum
  // identificador no redirect. Se não passar, pede o e-mail da compra.
  useEffect(() => {
    let cancelado = false;
    (async () => {
      try {
        const params = new URLSearchParams(window.location.search);
        const orderId =
          params.get("order_id") || params.get("order") || params.get("id");
        const emailParam =
          params.get("email") || params.get("customer_email");
        if (orderId || emailParam) {
          const r = await fetch("/api/claim", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              orderId: orderId || undefined,
              email: emailParam || undefined,
            }),
          });
          if (!cancelado && r.ok) {
            irProApp();
            return;
          }
        }
      } catch {
        // ignora
      }
      if (!cancelado) setFase("email");
    })();
    return () => {
      cancelado = true;
    };
  }, [irProApp]);

  const ativar = useCallback(async () => {
    const e = email.trim().toLowerCase();
    if (!e.includes("@")) {
      setMsg("Digite o e-mail que você usou na compra.");
      return;
    }
    setLoading(true);
    setMsg(null);
    try {
      const r = await fetch("/api/claim", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: e }),
      });
      if (r.ok) {
        irProApp();
      } else {
        const d = (await r.json().catch(() => null)) as {
          error?: string;
        } | null;
        setMsg(d?.error || "Não foi possível ativar o acesso.");
      }
    } catch {
      setMsg("Erro de conexão. Tente de novo.");
    } finally {
      setLoading(false);
    }
  }, [email, irProApp]);

  return (
    <main className="bg-grain grid flex-1 place-items-center px-6">
      <div className="animate-pop w-full max-w-sm rounded-3xl border border-line bg-paper p-8 text-center shadow-sm">
        <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-coral text-3xl text-paper shadow-[0_10px_30px_-8px_rgba(255,84,54,0.7)]">
          ✓
        </div>
        <h1 className="mt-5 font-display text-2xl font-extrabold tracking-tight">
          Pagamento confirmado! 🎉
        </h1>

        {fase === "ativando" ? (
          <>
            <p className="mt-2 text-sm text-muted">Ativando seu acesso…</p>
            <div className="mt-6 flex items-center justify-center gap-1.5 text-coral">
              <span className="h-2 w-2 animate-bounce rounded-full bg-coral [animation-delay:-0.2s]" />
              <span className="h-2 w-2 animate-bounce rounded-full bg-coral [animation-delay:-0.1s]" />
              <span className="h-2 w-2 animate-bounce rounded-full bg-coral" />
            </div>
          </>
        ) : (
          <>
            <p className="mt-2 text-sm text-muted">
              Confirme o e-mail que você usou na compra pra ativar seu acesso
              neste aparelho.
            </p>
            <input
              type="email"
              inputMode="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && ativar()}
              placeholder="seu@email.com"
              className="mt-4 w-full rounded-xl border border-line bg-paper px-4 py-3 text-sm outline-none focus:border-coral"
            />
            {msg && <p className="mt-2 text-sm text-coral-ink">{msg}</p>}
            <button
              onClick={ativar}
              disabled={loading}
              className="mt-3 w-full rounded-2xl bg-coral px-6 py-3 font-display text-base font-bold text-paper shadow-[0_10px_30px_-8px_rgba(255,84,54,0.7)] transition active:scale-[0.98] disabled:opacity-60"
            >
              {loading ? "Ativando…" : "Ativar meu acesso"}
            </button>
            <p className="mt-3 text-xs text-muted">
              Pagou agora e não encontrou? Aguarde ~1 min e tente de novo.
            </p>
          </>
        )}
      </div>
    </main>
  );
}
