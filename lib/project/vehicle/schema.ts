import type { VehicleProjectInput } from "./types";

export type VehicleValidationResult =
  | { ok: true; value: VehicleProjectInput }
  | { ok: false; error: string };

function validMoney(value: unknown, nullable = false): boolean {
  if (nullable && value === null) return true;
  return typeof value === "number" && Number.isSafeInteger(value * 100) && value >= 0;
}

function validMonths(value: unknown): value is number {
  return typeof value === "number" && Number.isSafeInteger(value) && value >= 1;
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
    if (!validMonths(horizon.months)) return { ok: false, error: "INVALID_HORIZON_MONTHS" };
    if (Object.keys(horizon).some((key) => !["mode", "months"].includes(key))) return { ok: false, error: "INVALID_HORIZON" };
    if (!Number.isSafeInteger(input.monthlyAmount as number * horizon.months * 100)) return { ok: false, error: "UNSAFE_PROJECTION" };\n    if (!Number.isSafeInteger(input.currentResources as number * 100)) return { ok: false, error: "UNSAFE_PROJECTION" };
    if (!Number.isSafeInteger(((input.currentResources as number) + (input.monthlyAmount as number * horizon.months)) * 100)) {
      return { ok: false, error: "UNSAFE_PROJECTION" };
    }
  } else {
    return { ok: false, error: "INVALID_HORIZON_MODE" };
  }
  return { ok: true, value: input as VehicleProjectInput };
}
