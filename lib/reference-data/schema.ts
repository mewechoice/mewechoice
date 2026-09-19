import type {
  ConsortiumAdminFeeReference,
  DiRateReference,
  ReferenceLineage,
  VehicleFinancingRateReference,
  VehiclePathReference,
} from "./types";

export type ReferenceValidationResult =
  | { ok: true; value: VehiclePathReference }
  | { ok: false; error: string };

function nonEmpty(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function validRate(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value) && value >= 0;
}

function validLineage(value: unknown): value is ReferenceLineage {
  if (!value || typeof value !== "object" || Array.isArray(value)) return false;
  const x = value as Record<string, unknown>;
  const allowed = new Set(["source", "referenceId", "referencePeriod", "retrievedAt", "methodology"]);
  if (Object.keys(x).some((key) => !allowed.has(key))) return false;
  return (
    (x.source === "B3" || x.source === "BCB") &&
    nonEmpty(x.referenceId) &&
    nonEmpty(x.referencePeriod) &&
    nonEmpty(x.retrievedAt) &&
    nonEmpty(x.methodology)
  );
}

export function validateVehiclePathReference(raw: unknown): ReferenceValidationResult {
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) return { ok: false, error: "INVALID_REFERENCE" };
  const x = raw as Record<string, unknown>;
  if (!validRate(x.value) || !validLineage(x.lineage)) return { ok: false, error: "INVALID_REFERENCE_DATA" };

  if (x.kind === "DI_RATE") {
    if (x.unit !== "PERCENT_PER_YEAR" || (x.lineage as ReferenceLineage).source !== "B3") {
      return { ok: false, error: "INVALID_DI_REFERENCE" };
    }
    return { ok: true, value: raw as DiRateReference };
  }

  if (x.kind === "VEHICLE_FINANCING_AVERAGE_RATE") {
    if (x.unit !== "PERCENT_PER_MONTH" || (x.lineage as ReferenceLineage).source !== "BCB") {
      return { ok: false, error: "INVALID_FINANCING_REFERENCE" };
    }
    return { ok: true, value: raw as VehicleFinancingRateReference };
  }

  if (x.kind === "CONSORTIUM_ADMIN_FEE_AVERAGE") {
    if (
      x.unit !== "PERCENT_OF_CREDIT" ||
      x.vehicleCategory !== "AUTOMOBILE" ||
      (x.lineage as ReferenceLineage).source !== "BCB"
    ) {
      return { ok: false, error: "INVALID_CONSORTIUM_REFERENCE" };
    }
    return { ok: true, value: raw as ConsortiumAdminFeeReference };
  }

  return { ok: false, error: "UNKNOWN_REFERENCE_KIND" };
}
