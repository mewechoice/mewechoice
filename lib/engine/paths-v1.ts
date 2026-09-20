import type { AuthorizedPublication } from "./output-validator-v2";
import type { ConsortiumAdminFeeReference, DiRateReference, VehicleFinancingRateReference } from "../reference-data/types";
import { publishAccumulation, publishConsortium, publishFinancing } from "./publication-pipeline-v1";
import { isChoicePathsIntent, type ChoicePathsIntent } from "./choice-paths-boundary";

export type PathId="ACCUMULATION"|"FINANCING"|"CONSORTIUM";
export type PathStatus="AUTHORIZED"|"UNAVAILABLE"|"INPUT_REQUIRED";
export type PathsEntryOrigin="CHOICE_UNDERSTAND_PATHS"|"EXPLICIT_NAMED_PATH_REQUEST";


type Common={intent:ChoicePathsIntent};
export type PathsInput=Readonly<Common&{
 accumulation?:Readonly<{currentResources:number;monthlyContribution:number;projectHorizonMonths:number;diReference?:DiRateReference}>;
 financing?:Readonly<{vehicleReferenceValue:number;allocatedDownPayment?:number;productTermMonths?:number;rateReference:VehicleFinancingRateReference}>;
 consortium?:Readonly<{creditReference:number;productTermMonths?:number;adminFeeReference:ConsortiumAdminFeeReference}>;
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
function card(pathId:PathId,status:PathStatus,publication:AuthorizedPublication|undefined,referenceContext:string,disclosures:readonly string[]):PathCardViewModel{
 return Object.freeze({pathId,title:title[pathId],explanation:explanation[pathId],requiredInputs:required[pathId],publicationStatus:status,publication:publication??null,referenceContext,disclosures:Object.freeze([...disclosures]),action:"INSPECT_OR_SIMULATE" as const,expanded:false as const});
}
function accumulation(i:PathsInput["accumulation"]):PathCardViewModel{
 if(!i)return card("ACCUMULATION","INPUT_REQUIRED",undefined,"","Informe os dados do projeto.".split("|"));
 try{const r=publishAccumulation({currentResources:i.currentResources,monthlyContribution:i.monthlyContribution,projectHorizonMonths:i.projectHorizonMonths,diReference:i.diReference?i.diReference:undefined,publicationId:"paths.accumulation"});return r.ok?card("ACCUMULATION","AUTHORIZED",r.publication,i.diReference?"Referência DI autorizada.":"Sem referência de rendimento.",[]):card("ACCUMULATION","UNAVAILABLE",undefined,"",Object.freeze([r.reason]))}catch(e){return card("ACCUMULATION","UNAVAILABLE",undefined,"",Object.freeze([e instanceof Error?e.message:"UNAVAILABLE"]))}
}
function financing(i:PathsInput["financing"]):PathCardViewModel{
 if(!i||!i.allocatedDownPayment||!i.productTermMonths)return card("FINANCING","INPUT_REQUIRED",undefined,"Referência BCB SGS 25471.",["Entrada alocada e prazo do produto exigem informação explícita do usuário."]);
 try{const r=publishFinancing({vehicleReferenceValue:i.vehicleReferenceValue,allocatedDownPayment:i.allocatedDownPayment,productTermMonths:i.productTermMonths,rateReference:i.rateReference,publicationId:"paths.financing"});return r.ok?card("FINANCING","AUTHORIZED",r.publication,"BCB SGS 25471 — taxa média estatística, não CET ou proposta.",[]):card("FINANCING","UNAVAILABLE",undefined,"BCB SGS 25471.",[r.reason])}catch(e){return card("FINANCING","UNAVAILABLE",undefined,"BCB SGS 25471.",[e instanceof Error?e.message:"UNAVAILABLE"])}
}
function consortium(i:PathsInput["consortium"]):PathCardViewModel{
 if(!i||!i.productTermMonths)return card("CONSORTIUM","INPUT_REQUIRED",undefined,"Referência estatística BCB.",["Prazo do produto exige informação explícita do usuário."]);
 try{const r=publishConsortium({creditReference:i.creditReference,productTermMonths:i.productTermMonths,adminFeeReference:i.adminFeeReference,publicationId:"paths.consortium"});return r.ok?card("CONSORTIUM","AUTHORIZED",r.publication,"Referência estatística BCB; não é oferta ou condição contratual.",["Componentes contratuais desconhecidos não são presumidos zero."]):card("CONSORTIUM","UNAVAILABLE",undefined,"Referência estatística BCB.",[r.reason])}catch(e){return card("CONSORTIUM","UNAVAILABLE",undefined,"Referência estatística BCB.",[e instanceof Error?e.message:"UNAVAILABLE"])}
}
export function buildPathsView(input:PathsInput):PathsViewModel{
 if(!isChoicePathsIntent(input.intent))throw new Error("PATHS_ENTRY_NOT_AUTHORIZED");
 const cards=[accumulation(input.accumulation),financing(input.financing),consortium(input.consortium)] as const;
 return Object.freeze({cards:Object.freeze(cards),focusedPath:null});
}
