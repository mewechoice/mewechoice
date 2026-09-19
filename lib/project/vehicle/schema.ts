import type { VehicleProjectInput } from "./types";

export type VehicleValidationResult =
  | { ok: true; value: VehicleProjectInput }
  | { ok: false; error: string };

const MAX_MONEY = 1_000_000_000;
const MAX_MONTHS = 1_200;

function validMoney(value: unknown, nullable = false): boolean {
  if (nullable && value === null) return true;
  return typeof value === "number" && Number.isFinite(value) && value >= 0 && value <= MAX_MONEY;
}

export function validateVehicleProjectInput(raw: unknown): VehicleValidationResult {
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) return { ok: false, error: "INVALID_INPUT" };
  const input = raw as Record<string, unknown>;
  const allowed = new Set(["targetValue", "currentResources", "monthlyAmount", "horizon"]);
  if (Object.keys(input).some((key) => !allowed.has(key))) return { ok: false, error: "UNKNOWN_FIELD" };
  if (!validMoney(input.targetValue, true)) return { ok: false, error: "INVALID_TARGET_VALUE" };
  if (!validMoney(input.currentResources)) return { ok: false, error: "INVALID_CURRENT_RESOURCES" };
  if (!validMoney(input.monthlyAmount)) return { ok: false, error: "INVALID_MONTHLY_AMOUNT" };
  if (!input.horizon || typeof input.horizon !== "object" || Array.isArray(input.horizon)) return { ok: false, error: "INVALID_HORIZON" };
  const horizon = input.horizon as Record<string, unknown>;
  if (horizon.mode === "IMMEDIATE") {
    if (Object.keys(horizon).some((key) => key !== "mode")) return { ok: false, error: "INVALID_IMMEDIATE_HORIZON" };
  } else if (horizon.mode === "MONTHS") {
    if (!Number.isInteger(horizon.months) || (horizon.months as number) < 1 || (horizon.months as number) > MAX_MONTHS) {
      return { ok: false, error: "INVALID_HORIZON_MONTHS" };
    }
    if (Object.keys(horizon).some((key) => !["mode", "months"].includes(key))) return { ok: false, error: "INVALID_HORIZON" };
  } else {
    return { ok: false, error: "INVALID_HORIZON_MODE" };
  }
  return { ok: true, value: input as VehicleProjectInput };
}
