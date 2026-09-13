import {
  ENGINE_VERSION, SCHEMA_VERSION, categories, maturities, priorities, timelines, valueRanges,
  subcategoryMap, type Category, type EngineInput, type Priority, type ValueRange
} from "./types";

const allowed = <T extends readonly string[]>(list: T, value: unknown): value is T[number] => typeof value === "string" && (list as readonly string[]).includes(value);

const allowedRangesByCategory: Record<Category, readonly ValueRange[]> = {
  patrimonio: ["patrimonio_ate_100k", "patrimonio_100_250k", "patrimonio_250_500k", "patrimonio_acima_500k", "nao_sei", "prefiro_nao_informar"],
  imovel: ["imovel_ate_250k", "imovel_250_500k", "imovel_500k_1m", "imovel_acima_1m", "nao_sei", "prefiro_nao_informar"],
  veiculo: ["veiculo_ate_50k", "veiculo_50_100k", "veiculo_100_200k", "veiculo_acima_200k", "nao_sei", "prefiro_nao_informar"],
  viagem: ["viagem_ate_10k", "viagem_10_30k", "viagem_30_60k", "viagem_acima_60k", "nao_sei", "prefiro_nao_informar"],
  educacao: ["educacao_ate_20k", "educacao_20_50k", "educacao_50_100k", "educacao_acima_100k", "nao_sei", "prefiro_nao_informar"],
  negocio: ["negocio_ate_50k", "negocio_50_150k", "negocio_150_500k", "negocio_acima_500k", "nao_sei", "prefiro_nao_informar"],
  outros: ["nao_sei", "prefiro_nao_informar"],
  descobrindo: ["nao_sei", "prefiro_nao_informar"],
};

export type ValidationResult = { ok: true; value: EngineInput } | { ok: false; error: string };

export function validateEngineInput(payload: unknown): ValidationResult {
  if (!payload || typeof payload !== "object" || Array.isArray(payload)) return { ok: false, error: "INVALID_BODY" };
  const obj = payload as Record<string, unknown>;
  const exactKeys = ["engine_version", "schema_version", "category", "subcategory", "maturity", "priorities", "timeline", "value_range"];
  const keys = Object.keys(obj);
  if (keys.length !== exactKeys.length || keys.some((k) => !exactKeys.includes(k))) return { ok: false, error: "EXTRA_OR_MISSING_FIELDS" };
  if (obj.engine_version !== ENGINE_VERSION) return { ok: false, error: "UNSUPPORTED_ENGINE_VERSION" };
  if (obj.schema_version !== SCHEMA_VERSION) return { ok: false, error: "UNSUPPORTED_SCHEMA_VERSION" };
  if (!allowed(categories, obj.category)) return { ok: false, error: "INVALID_CATEGORY" };
  const category = obj.category as Category;
  const validSubs = subcategoryMap[category] as readonly string[];
  if (!allowed(validSubs, obj.subcategory)) return { ok: false, error: "INVALID_SUBCATEGORY_FOR_CATEGORY" };
  if (!allowed(maturities, obj.maturity)) return { ok: false, error: "INVALID_MATURITY" };
  if (!Array.isArray(obj.priorities) || obj.priorities.length < 1 || obj.priorities.length > 2) return { ok: false, error: "INVALID_PRIORITIES_LENGTH" };
  if (new Set(obj.priorities).size !== obj.priorities.length) return { ok: false, error: "DUPLICATE_PRIORITIES" };
  if (!obj.priorities.every((p) => allowed(priorities, p))) return { ok: false, error: "INVALID_PRIORITY" };
  const ps = obj.priorities as Priority[];
  if (ps.includes("nao_sei") && ps.length > 1) return { ok: false, error: "NAO_SEI_MUST_BE_EXCLUSIVE" };
  if (!allowed(timelines, obj.timeline)) return { ok: false, error: "INVALID_TIMELINE" };
  if (!allowed(valueRanges, obj.value_range)) return { ok: false, error: "INVALID_VALUE_RANGE" };
  if (!allowedRangesByCategory[category].includes(obj.value_range as ValueRange)) return { ok: false, error: "INVALID_VALUE_RANGE_FOR_CATEGORY" };
  return { ok: true, value: obj as EngineInput };
}
