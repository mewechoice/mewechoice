import type { DiRateReference, VehicleFinancingRateReference, ConsortiumAdminFeeReference } from "../../reference-data/types";
import { validateVehiclePathReference } from "../../reference-data/schema";

export type Money = number;

function assertMoney(value: number, name: string): void {
  if (!Number.isFinite(value) || value < 0 || !Number.isSafeInteger(value * 100)) {
    throw new RangeError(`${name} must be a non-negative amount safe to represent in cents`);
  }
}
function assertTerm(months: number): void {
  if (!Number.isSafeInteger(months) || months <= 0) throw new RangeError("productTermMonths must be a positive safe integer");
}
function assertSafeMoney(value: number, name: string): void {
  assertMoney(value, name);
}
export function calculateAccumulation(input: { currentResources: Money; monthlyContribution: Money; projectHorizonMonths: number; diReference?: DiRateReference }) {
  assertMoney(input.currentResources, "currentResources");
  assertMoney(input.monthlyContribution, "monthlyContribution");
  if (!Number.isSafeInteger(input.projectHorizonMonths) || input.projectHorizonMonths < 0) throw new RangeError("projectHorizonMonths must be a non-negative safe integer");
  const withoutYield = input.currentResources + input.monthlyContribution * input.projectHorizonMonths;
  assertSafeMoney(withoutYield, "withoutYield");
  if (!input.diReference) return { withoutYield, withDiReference: null };
  const annual = input.diReference.value / 100;
  if (!Number.isFinite(annual) || annual < 0) throw new RangeError("DI reference must be non-negative");
  const r = Math.pow(1 + annual, 1 / 12) - 1;
  const n = input.projectHorizonMonths;
  const withDiReference = r === 0
    ? withoutYield
    : input.currentResources * Math.pow(1 + r, n) + input.monthlyContribution * ((Math.pow(1 + r, n) - 1) / r);
  assertSafeMoney(withDiReference, "withDiReference");
  return { withoutYield, withDiReference };
}
export function calculateFinancing(input: { vehicleReferenceValue: Money; downPayment: Money; productTermMonths: number; rateReference: VehicleFinancingRateReference }) {
  assertMoney(input.vehicleReferenceValue, "vehicleReferenceValue");
  assertMoney(input.downPayment, "downPayment");
  assertTerm(input.productTermMonths);
  const principal = Math.max(0, input.vehicleReferenceValue - input.downPayment);
  const i = input.rateReference.value / 100;
  if (!Number.isFinite(i) || i < 0) throw new RangeError("financing reference must be non-negative");
  const n = input.productTermMonths;
  const payment = principal === 0 ? 0 : i === 0 ? principal / n : principal * (i * Math.pow(1 + i, n)) / (Math.pow(1 + i, n) - 1);
  const installmentsTotal = payment * n;
  const projectedOutlay = input.downPayment + installmentsTotal;
  const mathematicalInterest = installmentsTotal - principal;
  [principal,payment,installmentsTotal,projectedOutlay,mathematicalInterest].forEach((v,j)=>assertSafeMoney(v,["principal","payment","installmentsTotal","projectedOutlay","mathematicalInterest"][j]));
  return { principal, payment, installmentsTotal, projectedOutlay, mathematicalInterest, productTermMonths:n };
}
export function calculateConsortiumReference(input: { creditReference: Money; productTermMonths: number; adminFeeReference: ConsortiumAdminFeeReference }) {
  assertMoney(input.creditReference, "creditReference");
  assertTerm(input.productTermMonths);
  const adminFeeReference = assertReference(input.adminFeeReference, "CONSORTIUM_ADMIN_FEE_AVERAGE");
  const fee = adminFeeReference.value / 100;
  if (!Number.isFinite(fee) || fee < 0) throw new RangeError("consortium administration reference must be non-negative");
  const administrationReference = input.creditReference * fee;
  const baseSimulatedTotal = input.creditReference + administrationReference;
  const baseMathematicalInstallment = baseSimulatedTotal / input.productTermMonths;
  [administrationReference,baseSimulatedTotal,baseMathematicalInstallment].forEach((v,j)=>assertSafeMoney(v,["administrationReference","baseSimulatedTotal","baseMathematicalInstallment"][j]));
  return { administrationReference, baseSimulatedTotal, baseMathematicalInstallment, productTermMonths:input.productTermMonths };
}
