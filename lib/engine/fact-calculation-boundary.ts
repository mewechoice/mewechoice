import type { ConsortiumAdminFeeReference, DiRateReference, VehicleFinancingRateReference } from "../reference-data/types";
import { validateVehiclePathReference } from "../reference-data/schema";
import { calculateAccumulation, calculateConsortiumReference, calculateFinancing } from "../project/vehicle/path-engine";

export const CALCULATION_EVIDENCE = Symbol("MWC_CALCULATION_EVIDENCE");
export type CalculationEvidence<T> = Readonly<{ [CALCULATION_EVIDENCE]: true; result: Readonly<T> }>;

function evidence<T>(result:T):CalculationEvidence<T>{ return Object.freeze({[CALCULATION_EVIDENCE]:true,result:Object.freeze(result)}) as CalculationEvidence<T>; }
function validateRef<T>(ref:T,kind:string):T {
  const r=validateVehiclePathReference(ref as never);
  if(!r.ok||r.value.kind!==kind) throw new RangeError("INVALID_REFERENCE_KIND");
  return r.value as T;
}

export function calculateAccumulationForFacts(input:{currentResources:number;monthlyContribution:number;projectHorizonMonths:number;diReference?:DiRateReference}){
  const ref=input.diReference?validateRef(input.diReference,"DI_RATE"):undefined;
  return evidence(calculateAccumulation({...input,diReference:ref}));
}
export function calculateFinancingForFacts(input:{vehicleReferenceValue:number;allocatedDownPayment:number;productTermMonths:number;rateReference:VehicleFinancingRateReference}){
  const rateReference=validateRef(input.rateReference,"VEHICLE_FINANCING_AVERAGE_RATE");
  return evidence(calculateFinancing({vehicleReferenceValue:input.vehicleReferenceValue,downPayment:input.allocatedDownPayment,productTermMonths:input.productTermMonths,rateReference}));
}
export function calculateConsortiumForFacts(input:{creditReference:number;productTermMonths:number;adminFeeReference:ConsortiumAdminFeeReference}){
  const adminFeeReference=validateRef(input.adminFeeReference,"CONSORTIUM_ADMIN_FEE_AVERAGE");
  return evidence(calculateConsortiumReference({...input,adminFeeReference}));
}
export function assertCalculationEvidence<T>(value:CalculationEvidence<T>):void{
  if(!value||value[CALCULATION_EVIDENCE]!==true||!Object.isFrozen(value)||!Object.isFrozen(value.result)) throw new RangeError("CALCULATION_EVIDENCE_REQUIRED");
}
