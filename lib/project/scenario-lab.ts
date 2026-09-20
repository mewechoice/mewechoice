import type { ProjectEngineReading } from "./engine";

export const SCENARIO_LAB_VERSION = "1.0.0" as const;

export type ScenarioLabResult = {
  version: typeof SCENARIO_LAB_VERSION;
  vertical: "VEHICLE";
  basis: "CURRENT_POSITION" | "HORIZON_POSITION";
  observations: {
    targetKnown: boolean;
    resourcesNow: number;
    resourcesAtHorizon: number;
    referenceDifference: number | null;
    monthlyPlan: number;
    horizonMonths: number | null;
  };
  choices: {
    pathsRequested: false;
    selectedPath: null;
    selectedProduct: null;
    selectedPartner: null;
    recommendation: null;
  };
};

export function buildScenarioLab(reading: ProjectEngineReading): ScenarioLabResult {
  if (!reading || reading.engineVersion !== "1.0.0" || reading.vertical !== "VEHICLE") throw new Error("INVALID_SCENARIO_SOURCE");
  if (reading.authority.selectedPath !== null || reading.authority.selectedProduct !== null || reading.authority.selectedPartner !== null || reading.authority.recommendation !== null) throw new Error("SCENARIO_AUTHORITY_BREACH");
  return {
    version: SCENARIO_LAB_VERSION,
    vertical: "VEHICLE",
    basis: reading.state,
    observations: {
      targetKnown: reading.targetKnown,
      resourcesNow: reading.currentResources,
      resourcesAtHorizon: reading.projectedResources,
      referenceDifference: reading.referenceDifference,
      monthlyPlan: reading.monthlyAmount,
      horizonMonths: reading.horizonMonths,
    },
    choices: { pathsRequested:false, selectedPath:null, selectedProduct:null, selectedPartner:null, recommendation:null },
  };
}
