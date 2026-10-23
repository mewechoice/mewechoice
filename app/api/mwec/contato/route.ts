import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

type Interest = "duvida" | "diagnostico" | "sugestao" | "outro";
const interests: readonly Interest[] = ["duvida", "diagnostico", "sugestao", "outro"];

function reply(message: string, status: number) {
  return NextResponse.json({ message }, { status, headers: { "Cache-Control": "no-store" } });
}

function field(data: Record<string, unknown>, name: string): string {
  return typeof data[name] === "string" ? data[name].trim() : "";
}

export async function POST(request: NextRequest) {
  // Browser-origin check is defense in depth; database RLS is the primary boundary.
  const origin = request.headers.get("origin");
  if (origin) {
    try {
      if (new URL(origin).origin !== new URL(request.url).origin) return reply("Origem não autorizada.", 403);
    } catch {
      return reply("Origem inválida.", 403);
    }
  }
  if (!(request.headers.get("content-type") || "").toLowerCase().startsWith("application/json"))
    return reply("Formato de solicitação inválido.", 415);
  const length = Number(request.headers.get("content-length") || "0");
  if (length > 6000) return reply("Mensagem muito longa.", 413);

  let data: Record<string, unknown>;
  try {
    const raw = await request.text();
    if (raw.length > 6000) return reply("Mensagem muito longa.", 413);
    const parsed: unknown = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) return reply("Dados inválidos.", 400);
    data = parsed as Record<string, unknown>;
  } catch {
    return reply("Dados inválidos.", 400);
  }

  // Honeypot: do not persist or signal to spambots that the field was detected.
  if (field(data, "website")) return reply("Recebemos sua solicitação.", 200);

  const name = field(data, "name");
  const email = field(data, "email").toLowerCase();
  const whatsapp = field(data, "whatsapp");
  const message = field(data, "message");
  const interest = field(data, "interest");
  const accepted = data.privacyAcknowledged === true;
  const digits = whatsapp.replace(/\D/g, "");

  if (name.length < 2 || name.length > 100 || message.length < 10 || message.length > 1500)
    return reply("Revise o nome e a mensagem.", 400);
  if (!email && !whatsapp) return reply("Informe um e-mail ou WhatsApp.", 400);
  if (email && (email.length > 190 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)))
    return reply("Informe um e-mail válido.", 400);
  if (whatsapp && (digits.length < 10 || digits.length > 13))
    return reply("Informe um número de WhatsApp válido.", 400);
  if (!interests.includes(interest as Interest)) return reply("Escolha o motivo do contato.", 400);
  if (!accepted) return reply("Leia as informações de privacidade para continuar.", 400);

  const endpoint = process.env.MWEC_SUPABASE_URL;
  const key = process.env.MWEC_SUPABASE_PUBLISHABLE_KEY;
  if (!endpoint || !key) return reply("O formulário ainda não está disponível. Tente novamente depois.", 503);

  try {
    const base = new URL(endpoint);
    if (base.protocol !== "https:" || !base.hostname.endsWith(".supabase.co"))
      return reply("O formulário ainda não está disponível.", 503);

    const response = await fetch(new URL("/rest/v1/mwec_crm_requests", base), {
      method: "POST",
      headers: { apikey: key, "Content-Type": "application/json", Prefer: "return=minimal" },
      body: JSON.stringify({
        contact_name: name,
        email: email || null,
        whatsapp: whatsapp || null,
        interest,
        message,
        privacy_acknowledged: true,
        bot_guard: "",
      }),
      cache: "no-store",
      signal: AbortSignal.timeout(8000),
    });
    if (response.ok) return reply("Recebemos sua solicitação. Obrigado pelo contato.", 201);
    const details = await response.text();
    if (details.includes("TOO_MANY_REQUESTS")) return reply("Já recebemos uma solicitação recente. Tente novamente mais tarde.", 429);
  } catch {
    // Never log personal data or upstream response bodies.
  }
  return reply("Não foi possível enviar agora. Tente novamente mais tarde.", 503);
}
