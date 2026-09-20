import type { Freshness } from "./fact-engine-v2";
import type { AuthorizedPublication } from "./output-validator-v2";
import type { ConsortiumAdminFeeReference, DiRateReference, VehicleFinancingRateReference } from "../reference-data/types";
import { publishAccumulation, publishConsortium, publishFinancing, type PipelineResult } from "./publication-pipeline-v1";

export type ScenarioRoute="ACCUMULATION"|"FINANCING"|"CONSORTIUM";
export type ScenarioStatus="AUTHORIZED"|"UNAVAILABLE";
type Common={scenarioId:string;baselineProjectId:string;createdOrder:number;referenceFreshness?:Freshness};
export type AccumulationScenarioInput=Common&{route:"ACCUMULATION";currentResources:number;monthlyContribution:number;projectHorizonMonths:number;diReference?:DiRateReference};
export type FinancingScenarioInput=Common&{route:"FINANCING";vehicleReferenceValue:number;allocatedDownPayment:number;productTermMonths:number;rateReference:VehicleFinancingRateReference};
export type ConsortiumScenarioInput=Common&{route:"CONSORTIUM";creditReference:number;productTermMonths:number;adminFeeReference:ConsortiumAdminFeeReference};
export type ScenarioInput=AccumulationScenarioInput|FinancingScenarioInput|ConsortiumScenarioInput;
export type ScenarioRecord=Readonly<{scenarioId:string;baselineProjectId:string;route:ScenarioRoute;createdOrder:number;changedFields:readonly string[];input:Readonly<ScenarioInput>;status:ScenarioStatus;publication?:AuthorizedPublication;unavailableReason?:string}>;
export type ChoiceAction="ADJUST_PLAN"|"VIEW_SCENARIO_DETAILS"|"UNDERSTAND_PATHS"|"SAVE_PROJECT"|"CONTACT_CONSULTANT";
export type ChoiceState=Readonly<{headline:"O próximo passo é seu.";actions:readonly ChoiceAction[];primaryAction?:ChoiceAction}>;
export type AccumulationScenarioEdit=Readonly<{scenarioId:string;createdOrder:number;currentResources?:number;monthlyContribution?:number;projectHorizonMonths?:number}>;
export type FinancingScenarioEdit=Readonly<{scenarioId:string;createdOrder:number;vehicleReferenceValue?:number;allocatedDownPayment?:number;productTermMonths?:number}>;
export type ConsortiumScenarioEdit=Readonly<{scenarioId:string;createdOrder:number;creditReference?:number;productTermMonths?:number}>;
export type UserScenarioEdit=AccumulationScenarioEdit|FinancingScenarioEdit|ConsortiumScenarioEdit;
export type ComparisonPreconditionProof=Readonly<{leftScenarioId:string;rightScenarioId:string;route:"FINANCING";provenEqualFields:readonly ["productTermMonths"];productTermMonths:number}>;

function clone<T>(x:T):T{return structuredClone(x)}
function deepFreeze<T>(x:T):T{if(x&&typeof x==="object"){Object.freeze(x);for(const v of Object.values(x as any))deepFreeze(v)}return x}
function changed(base:ScenarioInput,next:ScenarioInput):string[]{
 const ignored=new Set(["scenarioId","baselineProjectId","createdOrder","referenceFreshness","route"]);
 return Object.keys(next).filter(k=>!ignored.has(k)&&JSON.stringify((base as any)[k])!==JSON.stringify((next as any)[k])).sort();
}
function run(i:ScenarioInput):PipelineResult{
 if(i.route==="ACCUMULATION")return publishAccumulation({...i,publicationId:`scenario.${i.scenarioId}`});
 if(i.route==="FINANCING")return publishFinancing({...i,publicationId:`scenario.${i.scenarioId}`});
 return publishConsortium({...i,publicationId:`scenario.${i.scenarioId}`});
}
function record(input:ScenarioInput,base:ScenarioInput):ScenarioRecord{
 const r=run(input),core={scenarioId:input.scenarioId,baselineProjectId:input.baselineProjectId,route:input.route,createdOrder:input.createdOrder,changedFields:Object.freeze(changed(base,input)),input:deepFreeze(clone(input))};
 return Object.freeze(r.ok?{...core,status:"AUTHORIZED" as const,publication:r.publication}:{...core,status:"UNAVAILABLE" as const,unavailableReason:r.reason});
}
export function createBaseline(input:ScenarioInput):ScenarioRecord{if(input.createdOrder!==0)throw new RangeError("BASELINE_ORDER_MUST_BE_ZERO");return record(clone(input),input)}
export function createUserScenario(baseline:ScenarioInput,edit:UserScenarioEdit):ScenarioRecord{
 if(!Number.isInteger(edit.createdOrder)||edit.createdOrder<=0)throw new RangeError("INVALID_SCENARIO_ORDER");
 const next={...clone(baseline),...clone(edit),baselineProjectId:baseline.baselineProjectId,route:baseline.route} as ScenarioInput;
 return record(next,baseline);
}
export function orderScenarios(scenarios:readonly ScenarioRecord[]):readonly ScenarioRecord[]{const ids=new Set<string>(),orders=new Set<number>();for(const s of scenarios){if(ids.has(s.scenarioId))throw new Error("DUPLICATE_SCENARIO_ID");if(orders.has(s.createdOrder))throw new Error("DUPLICATE_SCENARIO_ORDER");if(!Number.isInteger(s.createdOrder)||s.createdOrder<0)throw new Error("INVALID_SCENARIO_ORDER");ids.add(s.scenarioId);orders.add(s.createdOrder)}return Object.freeze([...scenarios].sort((a,b)=>a.createdOrder-b.createdOrder))}
export function proveFinancingComparison(a:ScenarioRecord,b:ScenarioRecord):ComparisonPreconditionProof{
 if(a.status!=="AUTHORIZED"||b.status!=="AUTHORIZED"||a.route!=="FINANCING"||b.route!=="FINANCING")throw new Error("COMPARISON_PRECONDITION_FAILED");const at=(a.input as FinancingScenarioInput).productTermMonths,bt=(b.input as FinancingScenarioInput).productTermMonths;if(at!==bt)throw new Error("PRODUCT_TERM_MISMATCH");return deepFreeze({leftScenarioId:a.scenarioId,rightScenarioId:b.scenarioId,route:"FINANCING" as const,provenEqualFields:["productTermMonths"] as const,productTermMonths:at});
}
export function canCompareFinancingScenarios(a:ScenarioRecord,b:ScenarioRecord):boolean{try{proveFinancingComparison(a,b);return true}catch{return false}}
const actions:readonly ChoiceAction[]=Object.freeze(["ADJUST_PLAN","VIEW_SCENARIO_DETAILS","UNDERSTAND_PATHS","SAVE_PROJECT","CONTACT_CONSULTANT"]);
export function buildChoiceState(intent?:"ADJUST"|"PATHS"|"CONTACT"):ChoiceState{
 const primary=intent==="ADJUST"?"ADJUST_PLAN":intent==="PATHS"?"UNDERSTAND_PATHS":intent==="CONTACT"?"CONTACT_CONSULTANT":undefined;
 return Object.freeze({headline:"O próximo passo é seu." as const,actions,primaryAction:primary});
}
