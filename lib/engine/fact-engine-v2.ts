import type { ConsortiumAdminFeeReference, DiRateReference, VehicleFinancingRateReference, VehiclePathReference } from "../reference-data/types";
import type { CalculationEvidence } from "./fact-calculation-boundary";
import { assertCalculationEvidence } from "./fact-calculation-boundary";

export type FactUnit = "BRL" | "MONTHS" | "PERCENT_PER_YEAR" | "PERCENT_PER_MONTH" | "PERCENT_OF_CREDIT";
export type FactOrigin = "USER_INPUT" | "SOURCE_FACT" | "CALCULATED_FACT" | "DERIVED_PRESENTATION_FACT";
export type Availability = "AVAILABLE" | "UNAVAILABLE" | "NOT_APPLICABLE";
export type ValidationState = "VALIDATED" | "INVALID";
export type Freshness = "CURRENT" | "DATED" | "UNKNOWN";
export type Authorization = "AUTHORIZED" | "AUTHORIZED_WITH_DISCLOSURE" | "NOT_AUTHORIZED";
export type Completeness = "COMPLETE" | "PARTIAL" | "NOT_APPLICABLE" | "UNKNOWN";
export type ComparisonPolicy = "DIRECTLY_COMPARABLE" | "COMPARABLE_WITH_CONTEXT" | "NOT_DIRECTLY_COMPARABLE";
export type Applicability = "APPLIES" | "IF_APPLICABLE" | "UNKNOWN";

export type SemanticId =
  | "CURRENT_RESOURCES"
  | "MONTHLY_CONTRIBUTION"
  | "PROJECT_HORIZON"
  | "ACCUMULATION_WITHOUT_YIELD"
  | "ACCUMULATION_DI_REFERENCE_RATE"
  | "ACCUMULATION_GROSS_DI_REFERENCE_PROJECTION"
  | "VEHICLE_REFERENCE_VALUE"
  | "FINANCING_ALLOCATED_DOWN_PAYMENT"
  | "FINANCING_PRINCIPAL"
  | "FINANCING_PRODUCT_TERM"
  | "FINANCING_AVERAGE_MONTHLY_RATE"
  | "FINANCING_MATHEMATICAL_PRICE_INSTALLMENT"
  | "FINANCING_INSTALLMENTS_TOTAL"
  | "FINANCING_PROJECTED_OUTLAY"
  | "FINANCING_MATHEMATICAL_INTEREST"
  | "CONSORTIUM_CREDIT_REFERENCE"
  | "CONSORTIUM_STATISTICAL_ADMIN_FEE_RATE"
  | "CONSORTIUM_ADMINISTRATION_REFERENCE_AMOUNT"
  | "CONSORTIUM_PRODUCT_TERM"
  | "CONSORTIUM_BASE_SIMULATED_TOTAL"
  | "CONSORTIUM_BASE_MATHEMATICAL_INSTALLMENT";

export type RequiredDisclosure =
  | "STATISTICAL_REFERENCE" | "DATED_REFERENCE" | "NOT_AN_OFFER" | "NOT_A_QUOTE"
  | "CONTRACT_CONDITIONS_MAY_DIFFER" | "UNKNOWN_COSTS_NOT_ASSUMED"
  | "AVERAGE_REFERENCE_NOT_USER_RATE" | "NOT_CET" | "GROSS_REFERENCE_PROJECTION"
  | "TAXES_NOT_MODELED" | "FEES_NOT_MODELED" | "FUTURE_RATE_NOT_GUARANTEED";

export type MissingComponent = {
  id: "RESERVE_FUND" | "INSURANCE" | "FUTURE_ADJUSTMENTS" | "OTHER_CONTRACTUAL_CONDITIONS";
  applicability: Applicability;
};

export type Fact = {
  id: string;
  kind: "SOURCE_FACT" | "CALCULATED_FACT" | "INPUT_FACT";
  semanticId: SemanticId;
  value: { exactValue: number; displayValue: string; unit: FactUnit };
  provenance: {
    origin: FactOrigin;
    sourceLineage: Array<VehiclePathReference["lineage"]>;
    calculationLineage: string[];
    parentFactIds: string[];
  };
  state: {
    availability: Availability;
    validation: ValidationState;
    freshness: Freshness;
    authorization: Authorization;
    completeness: Completeness;
  };
  missingComponents: MissingComponent[];
  comparisonPolicy: ComparisonPolicy;
  requiredDisclosures: RequiredDisclosure[];
  methodology: string[];
  createdAt: string;
};

const brl = (v:number) => new Intl.NumberFormat("pt-BR",{style:"currency",currency:"BRL"}).format(v);
const pct = (v:number) => new Intl.NumberFormat("pt-BR",{maximumFractionDigits:2}).format(v)+"%";
const baseState = { availability:"AVAILABLE", validation:"VALIDATED", freshness:"CURRENT", authorization:"AUTHORIZED", completeness:"COMPLETE" } as const;

function fact(args: Omit<Fact,"createdAt">): Fact {
  if (!Number.isFinite(args.value.exactValue)) throw new RangeError("FACT_VALUE_NOT_FINITE");
  if (!args.value.unit) throw new RangeError("FACT_UNIT_REQUIRED");
  return {...args, createdAt:new Date().toISOString()};
}
function input(id:string, semanticId:SemanticId, exactValue:number, unit:FactUnit, displayValue:string):Fact {
  return fact({id,kind:"INPUT_FACT",semanticId,value:{exactValue,displayValue,unit},provenance:{origin:"USER_INPUT",sourceLineage:[],calculationLineage:[],parentFactIds:[]},state:{...baseState},missingComponents:[],comparisonPolicy:"COMPARABLE_WITH_CONTEXT",requiredDisclosures:[],methodology:[]});
}
function source(id:string, semanticId:SemanticId, ref:VehiclePathReference, freshness:Freshness, disclosures:RequiredDisclosure[]):Fact {
  return fact({id,kind:"SOURCE_FACT",semanticId,value:{exactValue:ref.value,displayValue:pct(ref.value),unit:ref.unit},provenance:{origin:"SOURCE_FACT",sourceLineage:[ref.lineage],calculationLineage:[],parentFactIds:[]},state:{...baseState,freshness,authorization:disclosures.length?"AUTHORIZED_WITH_DISCLOSURE":"AUTHORIZED"},missingComponents:[],comparisonPolicy:"NOT_DIRECTLY_COMPARABLE",requiredDisclosures:disclosures,methodology:[ref.lineage.methodology]});
}

export function buildAccumulationFacts(inputData:{currentResources:number;monthlyContribution:number;projectHorizonMonths:number;calculation:CalculationEvidence<{withoutYield:number;withDiReference:number|null}>;diReference?:DiRateReference;referenceFreshness?:Freshness}):Fact[]{
  assertCalculationEvidence(inputData.calculation);
  const {withoutYield,withDiReference}=inputData.calculation.result;
  const parents=[input("acc.current","CURRENT_RESOURCES",inputData.currentResources,"BRL",brl(inputData.currentResources)),input("acc.monthly","MONTHLY_CONTRIBUTION",inputData.monthlyContribution,"BRL",brl(inputData.monthlyContribution)),input("acc.horizon","PROJECT_HORIZON",inputData.projectHorizonMonths,"MONTHS",String(inputData.projectHorizonMonths))];
  const noYield=fact({id:"acc.no-yield",kind:"CALCULATED_FACT",semanticId:"ACCUMULATION_WITHOUT_YIELD",value:{exactValue:withoutYield,displayValue:brl(withoutYield),unit:"BRL"},provenance:{origin:"CALCULATED_FACT",sourceLineage:[],calculationLineage:["FV=P0+A*N","contributionTiming=END_OF_PERIOD"],parentFactIds:parents.map(x=>x.id)},state:{...baseState},missingComponents:[],comparisonPolicy:"COMPARABLE_WITH_CONTEXT",requiredDisclosures:[],methodology:["CONTRIBUTION_TIMING_END_OF_PERIOD"]});
  if(withDiReference===null||!inputData.diReference)return [...parents,noYield];
  const rate=source("acc.di-rate","ACCUMULATION_DI_REFERENCE_RATE",inputData.diReference,inputData.referenceFreshness ?? "UNKNOWN",["GROSS_REFERENCE_PROJECTION","TAXES_NOT_MODELED","FEES_NOT_MODELED","FUTURE_RATE_NOT_GUARANTEED"]);
  const projection=fact({id:"acc.di-projection",kind:"CALCULATED_FACT",semanticId:"ACCUMULATION_GROSS_DI_REFERENCE_PROJECTION",value:{exactValue:withDiReference,displayValue:brl(withDiReference),unit:"BRL"},provenance:{origin:"CALCULATED_FACT",sourceLineage:[inputData.diReference.lineage],calculationLineage:["MONTHLY_EQUIVALENT_FROM_ANNUAL_DI","FV_END_OF_PERIOD_CONTRIBUTIONS"],parentFactIds:[...parents.map(x=>x.id),rate.id]},state:{...baseState,freshness:"UNKNOWN",authorization:"AUTHORIZED_WITH_DISCLOSURE"},missingComponents:[],comparisonPolicy:"COMPARABLE_WITH_CONTEXT",requiredDisclosures:["GROSS_REFERENCE_PROJECTION","TAXES_NOT_MODELED","FEES_NOT_MODELED","FUTURE_RATE_NOT_GUARANTEED"],methodology:["CONTRIBUTION_TIMING_END_OF_PERIOD","SPECIFIC_INVESTMENT_PRODUCT_NONE"]});
  return [...parents,rate,projection,noYield];
}

export function buildFinancingFacts(d:{vehicleReferenceValue:number;allocatedDownPayment:number;productTermMonths:number;calculation:CalculationEvidence<{principal:number;payment:number;installmentsTotal:number;projectedOutlay:number;mathematicalInterest:number;productTermMonths:number}>;rateReference:VehicleFinancingRateReference;referenceFreshness?:Freshness}):Fact[]{
  assertCalculationEvidence(d.calculation);
  const {principal,payment,installmentsTotal,projectedOutlay,mathematicalInterest}=d.calculation.result;
  if(d.calculation.result.productTermMonths!==d.productTermMonths) throw new RangeError("CALCULATION_TERM_MISMATCH");
  const vehicle=input("fin.vehicle","VEHICLE_REFERENCE_VALUE",d.vehicleReferenceValue,"BRL",brl(d.vehicleReferenceValue));
  const down=input("fin.down","FINANCING_ALLOCATED_DOWN_PAYMENT",d.allocatedDownPayment,"BRL",brl(d.allocatedDownPayment));
  const term=input("fin.term","FINANCING_PRODUCT_TERM",d.productTermMonths,"MONTHS",String(d.productTermMonths));
  const rate=source("fin.rate","FINANCING_AVERAGE_MONTHLY_RATE",d.rateReference,d.referenceFreshness ?? "UNKNOWN",["AVERAGE_REFERENCE_NOT_USER_RATE","NOT_CET","NOT_AN_OFFER","NOT_A_QUOTE"]);
  const calc=(id:string,semanticId:SemanticId,v:number,formula:string,parents:string[])=>fact({id,kind:"CALCULATED_FACT",semanticId,value:{exactValue:v,displayValue:brl(v),unit:"BRL"},provenance:{origin:"CALCULATED_FACT",sourceLineage:[d.rateReference.lineage],calculationLineage:[formula],parentFactIds:parents},state:{...baseState,authorization:"AUTHORIZED_WITH_DISCLOSURE"},missingComponents:[],comparisonPolicy:"COMPARABLE_WITH_CONTEXT",requiredDisclosures:["AVERAGE_REFERENCE_NOT_USER_RATE","NOT_CET","NOT_AN_OFFER"],methodology:["PRICE_EDUCATIONAL_CONVENTION"]});
  const p=[vehicle.id,down.id,term.id,rate.id];
  return [vehicle,down,term,rate,calc("fin.principal","FINANCING_PRINCIPAL",principal,"PV=vehicle-downPayment",[vehicle.id,down.id]),calc("fin.payment","FINANCING_MATHEMATICAL_PRICE_INSTALLMENT",payment,"PRICE_PMT",p),calc("fin.installments","FINANCING_INSTALLMENTS_TOTAL",installmentsTotal,"PMT*n",p),calc("fin.outlay","FINANCING_PROJECTED_OUTLAY",projectedOutlay,"downPayment+PMT*n",p),calc("fin.interest","FINANCING_MATHEMATICAL_INTEREST",mathematicalInterest,"installmentsTotal-principal",p)];
}

export function buildConsortiumFacts(d:{creditReference:number;productTermMonths:number;calculation:CalculationEvidence<{administrationReference:number;baseSimulatedTotal:number;baseMathematicalInstallment:number;productTermMonths:number}>;adminFeeReference:ConsortiumAdminFeeReference;referenceFreshness?:Freshness}):Fact[]{
  assertCalculationEvidence(d.calculation);
  const {administrationReference,baseSimulatedTotal,baseMathematicalInstallment}=d.calculation.result;
  if(d.calculation.result.productTermMonths!==d.productTermMonths) throw new RangeError("CALCULATION_TERM_MISMATCH");
  const credit=input("con.credit","CONSORTIUM_CREDIT_REFERENCE",d.creditReference,"BRL",brl(d.creditReference));
  const term=input("con.term","CONSORTIUM_PRODUCT_TERM",d.productTermMonths,"MONTHS",String(d.productTermMonths));
  const rate=source("con.admin-rate","CONSORTIUM_STATISTICAL_ADMIN_FEE_RATE",d.adminFeeReference,d.referenceFreshness ?? "DATED",["STATISTICAL_REFERENCE","DATED_REFERENCE","NOT_AN_OFFER","NOT_A_QUOTE","CONTRACT_CONDITIONS_MAY_DIFFER","UNKNOWN_COSTS_NOT_ASSUMED"]);
  const missing:MissingComponent[]=[{id:"RESERVE_FUND",applicability:"IF_APPLICABLE"},{id:"INSURANCE",applicability:"IF_APPLICABLE"},{id:"FUTURE_ADJUSTMENTS",applicability:"IF_APPLICABLE"},{id:"OTHER_CONTRACTUAL_CONDITIONS",applicability:"IF_APPLICABLE"}];
  const calc=(id:string,semanticId:SemanticId,v:number,formula:string,partial:boolean)=>fact({id,kind:"CALCULATED_FACT",semanticId,value:{exactValue:v,displayValue:brl(v),unit:"BRL"},provenance:{origin:"CALCULATED_FACT",sourceLineage:[d.adminFeeReference.lineage],calculationLineage:[formula],parentFactIds:[credit.id,rate.id,...(semanticId==="CONSORTIUM_BASE_MATHEMATICAL_INSTALLMENT"?[term.id]:[])]},state:{...baseState,freshness:d.referenceFreshness ?? "DATED",authorization:"AUTHORIZED_WITH_DISCLOSURE",completeness:partial?"PARTIAL":"COMPLETE"},missingComponents:partial?missing:[],comparisonPolicy:"COMPARABLE_WITH_CONTEXT",requiredDisclosures:["STATISTICAL_REFERENCE","DATED_REFERENCE","NOT_AN_OFFER","NOT_A_QUOTE","CONTRACT_CONDITIONS_MAY_DIFFER","UNKNOWN_COSTS_NOT_ASSUMED"],methodology:["STATISTICAL_REFERENCE_NOT_CONTRACTUAL_QUOTE"]});
  return [credit,term,rate,calc("con.admin-amount","CONSORTIUM_ADMINISTRATION_REFERENCE_AMOUNT",administrationReference,"credit*adminRate",false),calc("con.base-total","CONSORTIUM_BASE_SIMULATED_TOTAL",baseSimulatedTotal,"credit+administrationReference",true),calc("con.base-installment","CONSORTIUM_BASE_MATHEMATICAL_INSTALLMENT",baseMathematicalInstallment,"baseSimulatedTotal/productTerm",true)];
}

export function canDirectlyCompare(a:Fact,b:Fact):boolean {
  return a.value.unit===b.value.unit && a.comparisonPolicy==="DIRECTLY_COMPARABLE" && b.comparisonPolicy==="DIRECTLY_COMPARABLE" && a.state.completeness==="COMPLETE" && b.state.completeness==="COMPLETE";
}
