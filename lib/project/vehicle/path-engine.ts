import type {
  ConsortiumAdminFeeReference,
  DiRateReference,
  VehicleFinancingRateReference,
  VehiclePathReference,
} from "../../reference-data/types";
import { validateVehiclePathReference } from "../../reference-data/schema";

export type Money = number;

function assertInputMoney(value: number, name: string): void {
  if (!Number.isFinite(value) || value < 0 || !Number.isSafeInteger(value * 100)) {
    throw new RangeError(`${name} must be a non-negative amount exactly representable in cents`);
  }
}

function assertDerivedMoney(value: number, name: string): void {
  if (!Number.isFinite(value) || value < 0 || !Number.isSafeInteger(Math.round(value * 100))) {
    throw new RangeError(`${name} must be a non-negative finite amount safe after cent rounding`);
  }
}

function assertPositiveTerm(months: number): void {
  if (!Number.isSafeInteger(months) || months <= 0) {
    throw new RangeError("productTermMonths must be a positive safe integer");
  }
}

function assertProjectHorizon(months: number): void {
  if (!Number.isSafeInteger(months) || months < 0) {
    throw new RangeError("projectHorizonMonths must be a non-negative safe integer");
  }
}

function validatedReference<T extends VehiclePathReference>(raw: T, expectedKind: T["kind"]): T {
  const result = validateVehiclePathReference(raw);
  if (!result.ok || result.value.kind !== expectedKind) {
    throw new RangeError("INVALID_REFERENCE");
  }
  return result.value as T;
}

export function calculateAccumulation(input: {
  currentResources: Money;
  monthlyContribution: Money;
  projectHorizonMonths: number;
  diReference?: DiRateReference;
}) {
  assertInputMoney(input.currentResources, "currentResources");
  assertInputMoney(input.monthlyContribution, "monthlyContribution");
  assertProjectHorizon(input.projectHorizonMonths);

  const withoutYield = input.currentResources + input.monthlyContribution * input.projectHorizonMonths;
  assertDerivedMoney(withoutYield, "withoutYield");

  if (!input.diReference) return { withoutYield, withDiReference: null };

  const reference = validatedReference(input.diReference, "DI_RATE");
  const annual = reference.value / 100;
  const monthlyEquivalent = Math.pow(1 + annual, 1 / 12) - 1;
  const n = input.projectHorizonMonths;

  const withDiReference =
    monthlyEquivalent === 0
      ? withoutYield
      : input.currentResources * Math.pow(1 + monthlyEquivalent, n) +
        input.monthlyContribution *
          ((Math.pow(1 + monthlyEquivalent, n) - 1) / monthlyEquivalent);

  assertDerivedMoney(withDiReference, "withDiReference");
  return { withoutYield, withDiReference };
}

export function calculateFinancing(input: {
  vehicleReferenceValue: Money;
  downPayment: Money;
  productTermMonths: number;
  rateReference: VehicleFinancingRateReference;
}) {
  assertInputMoney(input.vehicleReferenceValue, "vehicleReferenceValue");
  assertInputMoney(input.downPayment, "downPayment");
  assertPositiveTerm(input.productTermMonths);

  if (input.downPayment > input.vehicleReferenceValue) {
    throw new RangeError("DOWN_PAYMENT_EXCEEDS_VEHICLE_REFERENCE");
  }

  const reference = validatedReference(input.rateReference, "VEHICLE_FINANCING_AVERAGE_RATE");
  const principal = input.vehicleReferenceValue - input.downPayment;
  const monthlyRate = reference.value / 100;
  const n = input.productTermMonths;

  const payment =
    principal === 0
      ? 0
      : monthlyRate === 0
        ? principal / n
        : principal *
          ((monthlyRate * Math.pow(1 + monthlyRate, n)) /
            (Math.pow(1 + monthlyRate, n) - 1));

  const installmentsTotal = payment * n;
  const projectedOutlay = input.downPayment + installmentsTotal;
  const mathematicalInterest = installmentsTotal - principal;

  assertDerivedMoney(principal, "principal");
  assertDerivedMoney(payment, "payment");
  assertDerivedMoney(installmentsTotal, "installmentsTotal");
  assertDerivedMoney(projectedOutlay, "projectedOutlay");
  assertDerivedMoney(mathematicalInterest, "mathematicalInterest");

  return {
    principal,
    payment,
    installmentsTotal,
    projectedOutlay,
    mathematicalInterest,
    productTermMonths: n,
  };
}

export function calculateConsortiumReference(input: {
  creditReference: Money;
  productTermMonths: number;
  adminFeeReference: ConsortiumAdminFeeReference;
}) {
  assertInputMoney(input.creditReference, "creditReference");
  assertPositiveTerm(input.productTermMonths);

  const reference = validatedReference(input.adminFeeReference, "CONSORTIUM_ADMIN_FEE_AVERAGE");
  const administrationRate = reference.value / 100;
  const administrationReference = input.creditReference * administrationRate;
  const baseSimulatedTotal = input.creditReference + administrationReference;
  const baseMathematicalInstallment = baseSimulatedTotal / input.productTermMonths;

  assertDerivedMoney(administrationReference, "administrationReference");
  assertDerivedMoney(baseSimulatedTotal, "baseSimulatedTotal");
  assertDerivedMoney(baseMathematicalInstallment, "baseMathematicalInstallment");

  return {
    administrationReference,
    baseSimulatedTotal,
    baseMathematicalInstallment,
    productTermMonths: input.productTermMonths,
  };
}
