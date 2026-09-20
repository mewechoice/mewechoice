import type { AuthorizedPublication } from "./output-validator-v2";
import type { ConsortiumAdminFeeReference, DiRateReference, VehicleFinancingRateReference } from "../reference-data/types";
import { publishAccumulation, publishConsortium, publishFinancing } from "./publication-pipeline-v1";

export type PathId="ACCUMULATION"|"FINANCING"|"CONSORTIUM";
export type PathStatus="AUTHORIZED"|"UNAVAILABLE"|"INPUT_REQUIRED";
export type InputProvenance="USER_ENTERED"|"SYSTEM_REFERENCE";
const USER_VALUES=new WeakSet<object>();\nconst SYSTEM_VALUES=new WeakSet<object>();\nexport type UserValue<T>=Readonly<{value:T;provenance:"USER_ENTERED"}>;\nexport type SystemValue<T>=Readonly<{value:T;provenance:"SYSTEM_REFERENCE"}>;\nexport function captureUserValue<T>(value:T):UserValue<T>{const x=Object.freeze({value,provenance:"USER_ENTERED" as const});USER_VALUES.add(x);return x}\nexport function captureSystemReference<T>(value:T):SystemValue<T>{const x=Object.freeze({value,provenance:"SYSTEM_REFERENCE" as const});SYSTEM_VALUES.add(x);return x}
export type PathsEntryOrigin="CHOICE_UNDERSTAND_PATHS"|"EXPLICIT_NAMED_PATH_REQUEST";
const ENTRY_AUTHORITY=new WeakSet<object>();
export type PathsEntryAuthority=Readonly<{origin:PathsEntryOrigin;requestedPath?:PathId}>;

export type PathCardViewModel=Readonly<{
 pathId:PathId;title:string;explanation:string;requiredInputs:readonly string[];
 publicationStatus:PathStatus;publication:AuthorizedPublication|null;referenceContext:string;
 disclosures:readonly string[];action:"INSPECT_OR_SIMULATE";expanded:false;
}>;

export type PathsViewModel=Readonly<{cards:readonly [PathCardViewModel,PathCardViewModel,PathCardViewModel];focusedPath:null}>;

const USER_ACTIONS=new WeakSet<object>();\nexport type ExplicitUserAction=Readonly<{action:"UNDERSTAND_PATHS";requestedPath?:PathId}>;\nexport function captureExplicitUserAction(action:"UNDERSTAND_PATHS",requestedPath?:PathId):ExplicitUserAction{const x=Object.freeze({action,...(requestedPath?{requestedPath}: {})});USER_ACTIONS.add(x);return x}\nexport function authorizePathsEntryFromUserAction(action:ExplicitUserAction):PathsEntryAuthority{\n if(!USER_ACTIONS.has(action as object)||action.action!=="UNDERSTAND_PATHS")throw new Error("USER_ACTION_NOT_AUTHORIZED");\n const origin:PathsEntryOrigin=action.requestedPath?"EXPLICIT_NAMED_PATH_REQUEST":"CHOICE_UNDERSTAND_PATHS";\n const a=Object.freeze({origin,...(action.requestedPath?{requestedPath:action.requestedPath}: {})});ENTRY_AUTHORITY.add(a);return a;\n}
function requireAuthority(a:PathsEntryAuthority){if(!ENTRY_AUTHORITY.has(a as object))throw new Error("PATHS_ENTRY_NOT_AUTHORIZED")}

type Common={authority:PathsEntryAuthority};
export type PathsInput=Readonly<Common&{
 accumulation?:Readonly<{currentResources:UserValue<number>;monthlyContribution:UserValue<number>;projectHorizonMonths:UserValue<number>;diReference?:SystemValue<DiRateReference>}>;
 financing?:Readonly<{vehicleReferenceValue:UserValue<number>;allocatedDownPayment?:UserValue<number>;productTermMonths?:UserValue<number>;rateReference:SystemValue<VehicleFinancingRateReference>}>;
 consortium?:Readonly<{creditReference:UserValue<number>;productTermMonths?:UserValue<number>;adminFeeReference:SystemValue<ConsortiumAdminFeeReference>}>;
}>;

const title:Record<PathId,string>={ACCUMULATION:"Acumular recursos",FINANCING:"Financiamento",CONSORTIUM:"Consórcio"};
const explanation:Record<PathId,string>={
 ACCUMULATION:"Organiza o acúmulo do projeto com os valores informados por você.",
 FINANCING:"Mostra uma simulação matemática com referência estatística oficial.",
 CONSORTIUM:"Mostra uma simulação matemática com referência estatística oficial de administração."
};
const required:Record<PathId,readonly string[]>={
 ACCUMULATION:Object.freeze(["currentResources","monthlyContribution","projectHorizonMonths"]),
 FINANCING:Object.freeze(["vehicleReferenceValue","allocatedDownPayment","productTermMonths"]),
 CONSORTIUM:Object.freeze(["creditReference","productTermMonths"])
};
function user<T>(x:UserValue<T>|undefined,name:string):T{if(!x||!USER_VALUES.has(x as object))throw new Error("USER_INPUT_REQUIRED:"+name);return x.value}\nfunction system<T>(x:SystemValue<T>|undefined,name:string):T{if(!x||!SYSTEM_VALUES.has(x as object))throw new Error("SYSTEM_REFERENCE_REQUIRED:"+name);return x.value}
function card(pathId:PathId,status:PathStatus,publication:AuthorizedPublication|undefined,referenceContext:string,disclosures:readonly string[]):PathCardViewModel{
 return Object.freeze({pathId,title:title[pathId],explanation:explanation[pathId],requiredInputs:required[pathId],publicationStatus:status,publication:publication??null,referenceContext,disclosures:Object.freeze([...disclosures]),action:"INSPECT_OR_SIMULATE" as const,expanded:false as const});
}
function accumulation(i:PathsInput["accumulation"]):PathCardViewModel{
 if(!i)return card("ACCUMULATION","INPUT_REQUIRED",undefined,"","Informe os dados do projeto.".split("|"));
 try{const r=publishAccumulation({currentResources:user(i.currentResources,"currentResources"),monthlyContribution:user(i.monthlyContribution,"monthlyContribution"),projectHorizonMonths:user(i.projectHorizonMonths,"projectHorizonMonths"),diReference:i.diReference?system(i.diReference,"diReference"):undefined,publicationId:"paths.accumulation"});return r.ok?card("ACCUMULATION","AUTHORIZED",r.publication,i.diReference?"Referência DI autorizada.":"Sem referência de rendimento.",[]):card("ACCUMULATION","UNAVAILABLE",undefined,"",Object.freeze([r.reason]))}catch(e){return card("ACCUMULATION","UNAVAILABLE",undefined,"",Object.freeze([e instanceof Error?e.message:"UNAVAILABLE"]))}
}
function financing(i:PathsInput["financing"]):PathCardViewModel{
 if(!i||!i.allocatedDownPayment||!i.productTermMonths)return card("FINANCING","INPUT_REQUIRED",undefined,"Referência BCB SGS 25471.",["Entrada alocada e prazo do produto exigem informação explícita do usuário."]);
 try{const r=publishFinancing({vehicleReferenceValue:user(i.vehicleReferenceValue,"vehicleReferenceValue"),allocatedDownPayment:user(i.allocatedDownPayment,"allocatedDownPayment"),productTermMonths:user(i.productTermMonths,"productTermMonths"),rateReference:system(i.rateReference,"rateReference"),publicationId:"paths.financing"});return r.ok?card("FINANCING","AUTHORIZED",r.publication,"BCB SGS 25471 — taxa média estatística, não CET ou proposta.",[]):card("FINANCING","UNAVAILABLE",undefined,"BCB SGS 25471.",[r.reason])}catch(e){return card("FINANCING","UNAVAILABLE",undefined,"BCB SGS 25471.",[e instanceof Error?e.message:"UNAVAILABLE"])}
}
function consortium(i:PathsInput["consortium"]):PathCardViewModel{
 if(!i||!i.productTermMonths)return card("CONSORTIUM","INPUT_REQUIRED",undefined,"Referência estatística BCB.",["Prazo do produto exige informação explícita do usuário."]);
 try{const r=publishConsortium({creditReference:user(i.creditReference,"creditReference"),productTermMonths:user(i.productTermMonths,"productTermMonths"),adminFeeReference:system(i.adminFeeReference,"adminFeeReference"),publicationId:"paths.consortium"});return r.ok?card("CONSORTIUM","AUTHORIZED",r.publication,"Referência estatística BCB; não é oferta ou condição contratual.",["Componentes contratuais desconhecidos não são presumidos zero."]):card("CONSORTIUM","UNAVAILABLE",undefined,"Referência estatística BCB.",[r.reason])}catch(e){return card("CONSORTIUM","UNAVAILABLE",undefined,"Referência estatística BCB.",[e instanceof Error?e.message:"UNAVAILABLE"])}
}
export function buildPathsView(input:PathsInput):PathsViewModel{
 requireAuthority(input.authority);
 const cards=[accumulation(input.accumulation),financing(input.financing),consortium(input.consortium)] as const;
 return Object.freeze({cards:Object.freeze(cards),focusedPath:null});
}
