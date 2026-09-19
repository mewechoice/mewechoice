export const VEHICLE_ENGINE_VERSION = "1.0.0" as const;

export type VehicleHorizon =
  | { mode: "IMMEDIATE" }
  | { mode: "MONTHS"; months: number };

export type VehicleProjectInput = {
  targetValue: number | null;
  currentResources: number;
  monthlyAmount: number;
  horizon: VehicleHorizon;
};

export type VehicleProjectResult = {
  engineVersion: typeof VEHICLE_ENGINE_VERSION;
  targetValue: number | null;
  currentResources: number;
  monthlyAmount: number;
  horizon: VehicleHorizon;
  currentGap: number | null;
  currentSurplus: number | null;
  futureContributions: number | null;
  projectedResources: number;
  referenceDifference: number | null;
  requiredMonthlyAmount: number | null;
  requiredMonths: number | null;
  assumptions: string[];
};
