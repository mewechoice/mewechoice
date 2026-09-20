import type { VehicleProjectResult } from "./vehicle/types";

export const PROJECT_ENGINE_VERSION = "1.0.0" as const;

export type ProjectEngineReading = {
  engineVersion: typeof PROJECT_ENGINE_VERSION;
  vertical: "VEHICLE";
  state: "CURRENT_POSITION" | "HORIZON_POSITION";
  targetKnown: boolean;
  targetValue: number | null;
  currentResources: number;
  monthlyAmount: number;
  horizonMonths: number | null;
  currentGap: number | null;
  currentSurplus: number | null;
  projectedResources: number;
  referenceDifference: number | null;
  requiredMonthlyAmount: number | null;
  requiredMonths: number | null;
  assumptions: string[];
  authority: {
    selectedPath: null;
    selectedProduct: null;
    selectedPartner: null;
    recommendation: null;
  };
};

export function buildProjectEngineReading(result: VehicleProjectResult): ProjectEngineReading {
  return {
    engineVersion: PROJECT_ENGINE_VERSION,
    vertical: "VEHICLE",
    state: result.horizon.mode === "IMMEDIATE" ? "CURRENT_POSITION" : "HORIZON_POSITION",
    targetKnown: result.targetValue !== null,
    targetValue: result.targetValue,
    currentResources: result.currentResources,
    monthlyAmount: result.monthlyAmount,
    horizonMonths: result.horizon.mode === "MONTHS" ? result.horizon.months : null,
    currentGap: result.currentGap,
    currentSurplus: result.currentSurplus,
    projectedResources: result.projectedResources,
    referenceDifference: result.referenceDifference,
    requiredMonthlyAmount: result.requiredMonthlyAmount,
    requiredMonths: result.requiredMonths,
    assumptions: [...result.assumptions],
    authority: {
      selectedPath: null,
      selectedProduct: null,
      selectedPartner: null,
      recommendation: null,
    },
  };
}
