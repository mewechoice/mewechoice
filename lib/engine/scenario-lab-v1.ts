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
export type ChoiceState=Readonly<{headline:"O próximo passo é seu.";actions:readonly ChoiceAction[];primaryAction?:Exclude<ChoiceAction,"CONTACT_CONSULTANT">|"CONTACT_CONSULTANT"}>;

function clone<T>(x:T):T{return structuredClone(x)}
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
 const r=run(input),core={scenarioId:input.scenarioId,baselineProjectId:input.baselineProjectId,route:input.route,createdOrder:input.createdOrder,changedFields:Object.freeze(changed(base,input)),input:Object.freeze(clone(input))};
 return Object.freeze(r.ok?{...core,status:"AUTHORIZED" as const,publication:r.publication}:{...core,status:"UNAVAILABLE" as const,unavailableReason:r.reason});
}
export function createBaseline(input:ScenarioInput):ScenarioRecord{return record(clone(input),input)}
export function createUserScenario(baseline:ScenarioInput,edit:Partial<ScenarioInput>&{scenarioId:string;createdOrder:number}):ScenarioRecord{
 if(edit.route!==undefined&&edit.route!==baseline.route)throw new RangeError("ROUTE_CHANGE_NOT_ALLOWED");
 const next={...clone(baseline),...clone(edit),baselineProjectId:baseline.baselineProjectId,route:baseline.route} as ScenarioInput;
 return record(next,baseline);
}
export function orderScenarios(scenarios:readonly ScenarioRecord[]):readonly ScenarioRecord[]{return Object.freeze([...scenarios].sort((a,b)=>a.createdOrder-b.createdOrder))}
export function canCompareFinancingScenarios(a:ScenarioRecord,b:ScenarioRecord):boolean{
 return a.status==="AUTHORIZED"&&b.status==="AUTHORIZED"&&a.route==="FINANCING"&&b.route==="FINANCING"&&(a.input as FinancingScenarioInput).productTermMonths===(b.input as FinancingScenarioInput).productTermMonths;
}
const actions:readonly ChoiceAction[]=Object.freeze(["ADJUST_PLAN","VIEW_SCENARIO_DETAILS","UNDERSTAND_PATHS","SAVE_PROJECT","CONTACT_CONSULTANT"]);
export function buildChoiceState(intent?:"ADJUST"|"PATHS"|"CONTACT"):ChoiceState{
 const primary=intent==="ADJUST"?"ADJUST_PLAN":intent==="PATHS"?"UNDERSTAND_PATHS":intent==="CONTACT"?"CONTACT_CONSULTANT":undefined;
 return Object.freeze({headline:"O próximo passo é seu." as const,actions,primaryAction:primary});
}
