import type {
  ConsortiumAdminFeeReference,
  DiRateReference,
  ReferenceLineage,
  VehicleFinancingRateReference,
  VehiclePathReference,
} from "./types";

const VALIDATED_REFERENCES=new WeakSet<object>();
export type ValidatedVehiclePathReference=Readonly<{value:VehiclePathReference}>;
const VALIDATED_ARTIFACTS=new WeakSet<object>();
export function authorizeValidatedVehiclePathReference(raw:unknown):ValidatedVehiclePathReference{const r=validateVehiclePathReference(raw);if(!r.ok)throw new Error(r.error);VALIDATED_REFERENCES.add(r.value as object);const a=Object.freeze({value:r.value});VALIDATED_ARTIFACTS.add(a);return a}
export function readValidatedVehiclePathReference(a:ValidatedVehiclePathReference):VehiclePathReference{if(!VALIDATED_ARTIFACTS.has(a as object)||!VALIDATED_REFERENCES.has(a.value as object))throw new Error("REFERENCE_NOT_AUTHORIZED");return a.value}

export type ReferenceValidationResult =
  | { ok: true; value: VehiclePathReference }
  | { ok: false; error: string };

function nonEmpty(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function exactKeys(value: Record<string, unknown>, allowedKeys: string[]): boolean {
  const keys = Object.keys(value);
  return keys.length === allowedKeys.length && keys.every((key) => allowedKeys.includes(key));
}

function validTimestamp(value: unknown): value is string {
  if (typeof value !== "string") return false;
  const isoWithTimezone = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{1,3})?(?:Z|[+-]\d{2}:\d{2})$/;
  return isoWithTimezone.test(value) && Number.isFinite(Date.parse(value));
}

function validRate(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value) && value >= 0;
}

function validLineage(value: unknown): value is ReferenceLineage {
  if (!value || typeof value !== "object" || Array.isArray(value)) return false;
  const x = value as Record<string, unknown>;
  if (!exactKeys(x, ["source", "referenceId", "referencePeriod", "retrievedAt", "methodology"])) return false;
  return (
    (x.source === "B3" || x.source === "BCB") &&
    nonEmpty(x.referenceId) &&
    nonEmpty(x.referencePeriod) &&
    validTimestamp(x.retrievedAt) &&
    nonEmpty(x.methodology)
  );
}

export function validateVehiclePathReference(raw: unknown): ReferenceValidationResult {
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) return { ok: false, error: "INVALID_REFERENCE" };
  const x = raw as Record<string, unknown>;
  if (!validRate(x.value) || !validLineage(x.lineage)) return { ok: false, error: "INVALID_REFERENCE_DATA" };

  if (x.kind === "DI_RATE") {
    if (
      !exactKeys(x, ["kind", "value", "unit", "lineage"]) ||
      x.unit !== "PERCENT_PER_YEAR" ||
      (x.lineage as ReferenceLineage).source !== "B3"
    ) return { ok: false, error: "INVALID_DI_REFERENCE" };
    return { ok: true, value: raw as DiRateReference };
  }

  if (x.kind === "VEHICLE_FINANCING_AVERAGE_RATE") {
    if (
      !exactKeys(x, ["kind", "value", "unit", "lineage"]) ||
      x.unit !== "PERCENT_PER_MONTH" ||
      (x.lineage as ReferenceLineage).source !== "BCB"
    ) return { ok: false, error: "INVALID_FINANCING_REFERENCE" };
    return { ok: true, value: raw as VehicleFinancingRateReference };
  }

  if (x.kind === "CONSORTIUM_ADMIN_FEE_AVERAGE") {
    if (
      !exactKeys(x, ["kind", "value", "unit", "vehicleCategory", "lineage"]) ||
      x.unit !== "PERCENT_OF_CREDIT" ||
      x.vehicleCategory !== "AUTOMOBILE" ||
      (x.lineage as ReferenceLineage).source !== "BCB"
    ) return { ok: false, error: "INVALID_CONSORTIUM_REFERENCE" };
    return { ok: true, value: raw as ConsortiumAdminFeeReference };
  }

  return { ok: false, error: "UNKNOWN_REFERENCE_KIND" };
}
