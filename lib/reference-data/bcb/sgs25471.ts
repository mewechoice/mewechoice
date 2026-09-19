import { validateVehiclePathReference } from "../schema";
import type { LastKnownGoodStore } from "../store";
import type { VehicleFinancingRateReference } from "../types";

export const BCB_VEHICLE_FINANCING_SERIES = 25471;
export const BCB_VEHICLE_FINANCING_REFERENCE_ID = "SGS-25471";
export const BCB_SGS_LATEST_URL =
  "https://api.bcb.gov.br/dados/serie/bcdata.sgs.25471/dados/ultimos/1?formato=json";

type BcbSgsObservation = { data: string; valor: string };

export type FinancingReferenceFetchResult =
  | { ok: true; value: VehicleFinancingRateReference }
  | { ok: false; error: "FETCH_FAILED" | "INVALID_PAYLOAD" | "INVALID_REFERENCE" };

export type FinancingReferenceRefreshResult =
  | { ok: true; status: "UPDATED"; value: VehicleFinancingRateReference }
  | { ok: false; status: "PRESERVED"; error: FinancingReferenceFetchResult extends infer R ? R extends { ok: false; error: infer E } ? E : never : never };

function isExactObservation(value: unknown): value is BcbSgsObservation {
  if (!value || typeof value !== "object" || Array.isArray(value)) return false;
  const x = value as Record<string, unknown>;
  const keys = Object.keys(x);
  return (
    keys.length === 2 &&
    keys.includes("data") &&
    keys.includes("valor") &&
    typeof x.data === "string" &&
    /^\d{2}\/\d{2}\/\d{4}$/.test(x.data) &&
    typeof x.valor === "string" &&
    /^\d+(?:\.\d+)?$/.test(x.valor)
  );
}

function periodFromBcbDate(date: string): string | null {
  const [day, month, year] = date.split("/").map(Number);
  const parsed = new Date(Date.UTC(year, month - 1, day));
  if (
    parsed.getUTCFullYear() !== year ||
    parsed.getUTCMonth() !== month - 1 ||
    parsed.getUTCDate() !== day
  ) return null;
  return `${year}-${String(month).padStart(2, "0")}`;
}

export function parseBcbVehicleFinancingPayload(
  raw: unknown,
  retrievedAt: string,
): FinancingReferenceFetchResult {
  if (!Array.isArray(raw) || raw.length !== 1 || !isExactObservation(raw[0])) {
    return { ok: false, error: "INVALID_PAYLOAD" };
  }

  const referencePeriod = periodFromBcbDate(raw[0].data);
  const value = Number(raw[0].valor);
  if (!referencePeriod || !Number.isFinite(value) || value < 0) {
    return { ok: false, error: "INVALID_PAYLOAD" };
  }

  const candidate: VehicleFinancingRateReference = {
    kind: "VEHICLE_FINANCING_AVERAGE_RATE",
    value,
    unit: "PERCENT_PER_MONTH",
    lineage: {
      source: "BCB",
      referenceId: BCB_VEHICLE_FINANCING_REFERENCE_ID,
      referencePeriod,
      retrievedAt,
      methodology:
        "BCB SGS 25471: taxa media mensal de juros das novas operacoes de credito livre para pessoas fisicas - aquisicao de veiculos.",
    },
  };

  const validated = validateVehiclePathReference(candidate);
  return validated.ok
    ? { ok: true, value: candidate }
    : { ok: false, error: "INVALID_REFERENCE" };
}

export async function fetchLatestBcbVehicleFinancingReference(
  fetchImpl: typeof fetch = fetch,
  now: () => Date = () => new Date(),
): Promise<FinancingReferenceFetchResult> {
  try {
    const response = await fetchImpl(BCB_SGS_LATEST_URL, {
      headers: { accept: "application/json" },
      cache: "no-store",
    });
    if (!response.ok) return { ok: false, error: "FETCH_FAILED" };
    const raw: unknown = await response.json();
    return parseBcbVehicleFinancingPayload(raw, now().toISOString());
  } catch {
    return { ok: false, error: "FETCH_FAILED" };
  }
}

export async function refreshBcbVehicleFinancingReference(
  store: LastKnownGoodStore<VehicleFinancingRateReference>,
  fetchImpl: typeof fetch = fetch,
  now: () => Date = () => new Date(),
): Promise<FinancingReferenceRefreshResult> {
  const acquired = await fetchLatestBcbVehicleFinancingReference(fetchImpl, now);
  if (!acquired.ok) return { ok: false, status: "PRESERVED", error: acquired.error };

  const validated = validateVehiclePathReference(acquired.value);
  if (!validated.ok || validated.value.kind !== "VEHICLE_FINANCING_AVERAGE_RATE") {
    return { ok: false, status: "PRESERVED", error: "INVALID_REFERENCE" };
  }

  await store.replace(acquired.value);
  return { ok: true, status: "UPDATED", value: acquired.value };
}
