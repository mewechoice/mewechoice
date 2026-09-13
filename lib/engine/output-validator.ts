import { type InterpretationOutput, type SafeContext } from "./types";

const bannedRecommendation = /\b(recomendo|recomendamos|ideal para (voce|você)|melhor op[cç][aã]o|indicado para (voce|você)|voce deve|você deve|prefira|compre|invista em|fa[cç]a financiamento|fa[cç]a cons[oó]rcio)\b/i;
const bannedProducts = /\b(CDB|Tesouro\s+(Direto|Selic|IPCA)|renda fixa|a[cç][oõ]es|fundos? imobili[aá]rios?|FII|cripto|bitcoin|ETF)\b/i;
const bannedPromises = /\b(vai conseguir|garantid[oa]|com certeza|ser[aá] aprovado|ser[aá] contemplado|vai economizar|vai render|retorno garantido)\b/i;
const bannedUrgency = /\b(agora mesmo|n[aã]o perca|[uú]ltima chance|antes que acabe|urgente)\b/i;
const bannedInference = /\b(seu perfil (e|é)|capacidade financeira|score|renda estimada|patrim[oô]nio estimado|perfil conservador|perfil agressivo)\b/i;
const productDirection = /\b(cons[oó]rcio|financiamento|cr[eé]dito|empr[eé]stimo)\b.{0,60}\b(faz sentido|adequad[oa]|ideal|melhor|indicado|combina|recomend)/i;

export type OutputValidation = { ok: true } | { ok: false; reason: string };

function isStringArray(v: unknown, max: number): v is string[] {
  return Array.isArray(v) && v.length <= max && v.every((x) => typeof x === "string" && x.trim().length > 0 && x.length <= 320);
}

export function validateInterpretationOutput(value: unknown, context: SafeContext): OutputValidation {
  if (!value || typeof value !== "object" || Array.isArray(value)) return { ok: false, reason: "INVALID_JSON_SHAPE" };
  const obj = value as Record<string, unknown>;
  const keys = Object.keys(obj);
  const expected = ["reading", "clear_points", "attention_points", "missing_information", "next_step"];
  if (keys.length !== expected.length || keys.some((k) => !expected.includes(k))) return { ok: false, reason: "INVALID_OUTPUT_FIELDS" };
  if (typeof obj.reading !== "string" || obj.reading.length < 20 || obj.reading.length > 900) return { ok: false, reason: "INVALID_READING" };
  if (!isStringArray(obj.clear_points, 3) || !isStringArray(obj.attention_points, 3) || !isStringArray(obj.missing_information, 3)) return { ok: false, reason: "INVALID_ARRAYS" };
  if (typeof obj.next_step !== "string" || obj.next_step.length < 5 || obj.next_step.length > 240) return { ok: false, reason: "INVALID_NEXT_STEP" };
  const all = [obj.reading, ...(obj.clear_points as string[]), ...(obj.attention_points as string[]), ...(obj.missing_information as string[]), obj.next_step].join(" ");
  if (/[😀-🙏🌀-🫿]/u.test(all)) return { ok: false, reason: "EMOJI" };
  if ((all.match(/!/g) || []).length > 1) return { ok: false, reason: "PROMOTIONAL_TONE" };
  if (bannedRecommendation.test(all)) return { ok: false, reason: "EXPLICIT_RECOMMENDATION" };
  if (bannedPromises.test(all)) return { ok: false, reason: "PROMISE" };
  if (bannedUrgency.test(all)) return { ok: false, reason: "URGENCY" };
  if (bannedInference.test(all)) return { ok: false, reason: "UNAUTHORIZED_INFERENCE" };
  if (productDirection.test(all)) return { ok: false, reason: "SHADOW_ADVISING" };
  // Product terms are acceptable only if not directionally recommended; the engine normally has no reason to mention them.
  if (bannedProducts.test(all)) return { ok: false, reason: "REGULATED_PRODUCT_OR_CLASS" };
  // Prevent new numeric claims beyond ordinary enumerations already contained in known facts.
  const safeNumbers = new Set((context.known_facts.join(" ").match(/[0-9]+(?:[.,][0-9]+)?/g) || []));
  const outputNumbers = all.match(/[0-9]+(?:[.,][0-9]+)?/g) || [];
  if (outputNumbers.some((n) => !safeNumbers.has(n))) return { ok: false, reason: "UNSUPPORTED_NUMERIC_CLAIM" };
  return { ok: true };
}
