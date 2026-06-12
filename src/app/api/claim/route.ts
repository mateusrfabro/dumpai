import { NextResponse } from "next/server";
import {
  COOKIE_NAME,
  assinarAcesso,
  estaPagoEmail,
  emailDoPedido,
} from "@/lib/acesso";

export const runtime = "nodejs";

const MAX_AGE = 180 * 24 * 60 * 60;

// Recebe { email } ou { orderId } e, se houver pagamento confirmado no KV,
// devolve um cookie de acesso assinado (HttpOnly).
export async function POST(req: Request) {
  let body: { email?: string; orderId?: string };
  try {
    body = (await req.json()) as { email?: string; orderId?: string };
  } catch {
    return NextResponse.json({ error: "Requisição inválida." }, { status: 400 });
  }

  let email = (body.email || "").trim().toLowerCase();

  // Auto-claim por pedido (caso a Kiwify passe o order_id no redirect).
  if (!email && body.orderId) {
    const achado = await emailDoPedido(body.orderId.trim());
    if (achado) email = achado;
  }

  if (!email || !email.includes("@")) {
    return NextResponse.json(
      { error: "Informe o e-mail usado na compra." },
      { status: 400 },
    );
  }

  const pago = await estaPagoEmail(email);
  if (!pago) {
    return NextResponse.json(
      {
        error:
          "Não encontramos uma compra com esse e-mail. Se você acabou de pagar, aguarde ~1 minuto e tente de novo.",
      },
      { status: 403 },
    );
  }

  const res = NextResponse.json({ ok: true });
  res.cookies.set(COOKIE_NAME, assinarAcesso(email), {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: MAX_AGE,
  });
  return res;
}
