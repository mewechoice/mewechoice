import { validateVehicleProjectInput } from "./schema";
import { VEHICLE_ENGINE_VERSION, type VehicleProjectInput, type VehicleProjectResult } from "./types";

const roundMoney = (value: number) => Math.round((value + Number.EPSILON) * 100) / 100;

export function calculateVehicleProject(raw: unknown): VehicleProjectResult {
  const parsed = validateVehicleProjectInput(raw);
  if (!parsed.ok) throw new Error(parsed.error);
  const input: VehicleProjectInput = parsed.value;
  const { targetValue, currentResources, monthlyAmount, horizon } = input;

  const currentGap = targetValue === null ? null : roundMoney(Math.max(targetValue - currentResources, 0));
  const currentSurplus = targetValue === null ? null : roundMoney(Math.max(currentResources - targetValue, 0));

  if (horizon.mode === "IMMEDIATE") {
    return {
      engineVersion: VEHICLE_ENGINE_VERSION,
      ...input,
      currentGap,
      currentSurplus,
      futureContributions: null,
      projectedResources: roundMoney(currentResources),
      referenceDifference: targetValue === null ? null : roundMoney(currentResources - targetValue),
      requiredMonthlyAmount: null,
      requiredMonths: null,
      assumptions: [
        "IMMEDIATE calcula somente a posição financeira atual.",
        "O valor do veículo no futuro não é estimado.",
      ],
    };
  }

  const months = horizon.months;
  const futureContributions = roundMoney(monthlyAmount * months);
  const projectedResources = roundMoney(currentResources + futureContributions);
  const referenceDifference = targetValue === null ? null : roundMoney(projectedResources - targetValue);

  let requiredMonthlyAmount: number | null = null;
  let requiredMonths: number | null = null;
  if (targetValue !== null) {
    const remaining = Math.max(targetValue - currentResources, 0);
    requiredMonthlyAmount = roundMoney(remaining / months);
    if (remaining === 0) requiredMonths = 0;
    else if (monthlyAmount > 0) requiredMonths = Math.ceil(remaining / monthlyAmount);
  }

  return {
    engineVersion: VEHICLE_ENGINE_VERSION,
    ...input,
    currentGap,
    currentSurplus,
    futureContributions,
    projectedResources,
    referenceDifference,
    requiredMonthlyAmount,
    requiredMonths,
    assumptions: [
      "Projeção linear sem rendimento, inflação, taxas ou custos.",
      "O valor informado do veículo é uma referência atual; o valor futuro não é estimado.",
      "Aportes são considerados constantes durante o horizonte informado.",
    ],
  };
}
