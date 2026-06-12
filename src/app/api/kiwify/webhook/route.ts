import crypto from "crypto";
import { marcarPago, revogarPagoPorEmail } from "@/lib/acesso";

export const runtime = "nodejs";

// A Kiwify chama este endpoint quando um pedido muda de status.
// Validamos a assinatura (HMAC com o token do webhook) antes de confiar no corpo.
export async function POST(req: Request) {
  const token = process.env.KIWIFY_WEBHOOK_TOKEN || "";
  if (!token) {
    // Sem token configurado, não dá pra validar — rejeita por segurança.
    return new Response("webhook não configurado", { status: 503 });
  }

  const raw = await req.text();
  const url = new URL(req.url);
  const assinaturaRecebida =
    url.searchParams.get("signature") ||
    req.headers.get("x-kiwify-signature") ||
    "";

  const sha1 = crypto.createHmac("sha1", token).update(raw).digest("hex");
  const sha256 = crypto.createHmac("sha256", token).update(raw).digest("hex");
  const valido =
    assinaturaRecebida === sha1 || assinaturaRecebida === sha256;

  if (!valido) {
    return new Response("assinatura inválida", { status: 401 });
  }

  let body: Record<string, unknown>;
  try {
    body = JSON.parse(raw) as Record<string, unknown>;
  } catch {
    return new Response("json inválido", { status: 400 });
  }

  // Extração defensiva (nomes de campo variam entre versões da Kiwify).
  const customer = (body.Customer ?? body.customer) as
    | Record<string, unknown>
    | undefined;
  const email = String(
    customer?.email ?? body.email ?? body.customer_email ?? "",
  );
  const orderId = String(body.order_id ?? body.id ?? "");
  const status = String(body.order_status ?? body.status ?? "").toLowerCase();
  const evento = String(
    body.webhook_event_type ?? body.event ?? body.event_type ?? "",
  ).toLowerCase();

  const pago =
    ["paid", "approved", "aprovado"].includes(status) ||
    evento.includes("aprovad") ||
    evento.includes("paid");
  const cancelado =
    ["refunded", "chargedback", "refused", "reembolsado"].includes(status) ||
    evento.includes("reembols") ||
    evento.includes("refund") ||
    evento.includes("chargeback");

  if (email) {
    if (cancelado) {
      await revogarPagoPorEmail(email);
    } else if (pago) {
      await marcarPago(email, orderId);
    }
  }

  return new Response("ok", { status: 200 });
}
