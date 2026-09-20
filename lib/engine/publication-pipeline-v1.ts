import type { Fact, Freshness, RequiredDisclosure, SemanticId } from "./fact-engine-v2";
import { buildAccumulationFacts, buildConsortiumFacts, buildFinancingFacts } from "./fact-engine-v2";
import { calculateAccumulationForFacts, calculateConsortiumForFacts, calculateFinancingForFacts } from "./fact-calculation-boundary";
import { buildFactValueClaim, type AuthorizedClaim } from "./claim-registry-v2";
import { validatePublication, type AuthorizedPublication, type DisclosureBinding, type PublicationCandidate } from "./output-validator-v2";
import type { ConsortiumAdminFeeReference, DiRateReference, VehicleFinancingRateReference } from "../reference-data/types";

type PipelineFailure={ok:false;stage:"CALCULATION"|"FACT"|"CLAIM"|"VALIDATION";reason:string};
export type PipelineResult={ok:true;publication:AuthorizedPublication;facts:readonly Fact[]}|PipelineFailure;
type Route="ACCUMULATION"|"FINANCING"|"CONSORTIUM";
const allowed:Record<Route,readonly SemanticId[]>={
 ACCUMULATION:["ACCUMULATION_WITHOUT_YIELD","ACCUMULATION_GROSS_DI_REFERENCE_PROJECTION"],
 FINANCING:["FINANCING_MATHEMATICAL_PRICE_INSTALLMENT","FINANCING_PROJECTED_OUTLAY","FINANCING_MATHEMATICAL_INTEREST"],
 CONSORTIUM:["CONSORTIUM_ADMINISTRATION_REFERENCE_AMOUNT","CONSORTIUM_BASE_SIMULATED_TOTAL","CONSORTIUM_BASE_MATHEMATICAL_INSTALLMENT"]
};
const labels:Partial<Record<SemanticId,string>>={
 ACCUMULATION_WITHOUT_YIELD:"Acúmulo sem rendimento",
 ACCUMULATION_GROSS_DI_REFERENCE_PROJECTION:"Projeção bruta de referência DI",
 FINANCING_MATHEMATICAL_PRICE_INSTALLMENT:"Parcela matemática",
 FINANCING_PROJECTED_OUTLAY:"Desembolso projetado",
 FINANCING_MATHEMATICAL_INTEREST:"Juros matemáticos",
 CONSORTIUM_ADMINISTRATION_REFERENCE_AMOUNT:"Referência matemática de administração",
 CONSORTIUM_BASE_SIMULATED_TOTAL:"Base matemática simulada",
 CONSORTIUM_BASE_MATHEMATICAL_INSTALLMENT:"Parcela matemática base"
};
function publication(route:Route,facts:readonly Fact[],publicationId:string):PipelineResult{
 try{
  const selected=facts.filter(f=>allowed[route].includes(f.semanticId));
  const claims:AuthorizedClaim[]=selected.map(buildFactValueClaim);
  const realizations=selected.map((f,i)=>({claimId:claims[i].claimId,factId:f.id,text:(labels[f.semanticId]??f.semanticId)+": "+f.value.displayValue,renderedValue:f.value.displayValue,label:labels[f.semanticId],unit:f.value.unit}));
  const disclosureBindings:DisclosureBinding[]=[];
  selected.forEach((f,i)=>{for(const d of new Set<RequiredDisclosure>([...f.requiredDisclosures,...claims[i].requiredDisclosures]))disclosureBindings.push({disclosureId:d,scope:"FACT",coversFactIds:[f.id],coversClaimIds:[claims[i].claimId]})});
  const candidate:PublicationCandidate={publicationId,surface:"REPORT",claims,realizations,disclosureBindings};
  const result=validatePublication(facts,candidate);
  return result.ok?{ok:true,publication:result.publication,facts}:{ok:false,stage:"VALIDATION",reason:result.reason};
 }catch(e){return{ok:false,stage:"CLAIM",reason:e instanceof Error?e.message:"CLAIM_FAILURE"}}
}
export function publishAccumulation(input:{currentResources:number;monthlyContribution:number;projectHorizonMonths:number;diReference?:DiRateReference;referenceFreshness?:Freshness;publicationId?:string}):PipelineResult{
 try{const calc=calculateAccumulationForFacts(input);const facts=buildAccumulationFacts({calculation:calc,referenceFreshness:input.referenceFreshness});return publication("ACCUMULATION",facts,input.publicationId??"accumulation")}catch(e){return{ok:false,stage:"CALCULATION",reason:e instanceof Error?e.message:"CALCULATION_FAILURE"}}
}
export function publishFinancing(input:{vehicleReferenceValue:number;allocatedDownPayment:number;productTermMonths:number;rateReference:VehicleFinancingRateReference;referenceFreshness?:Freshness;publicationId?:string}):PipelineResult{
 try{const calc=calculateFinancingForFacts(input);const facts=buildFinancingFacts({calculation:calc,referenceFreshness:input.referenceFreshness});return publication("FINANCING",facts,input.publicationId??"financing")}catch(e){return{ok:false,stage:"CALCULATION",reason:e instanceof Error?e.message:"CALCULATION_FAILURE"}}
}
export function publishConsortium(input:{creditReference:number;productTermMonths:number;adminFeeReference:ConsortiumAdminFeeReference;referenceFreshness?:Freshness;publicationId?:string}):PipelineResult{
 try{const calc=calculateConsortiumForFacts(input);const facts=buildConsortiumFacts({calculation:calc,referenceFreshness:input.referenceFreshness});return publication("CONSORTIUM",facts,input.publicationId??"consortium")}catch(e){return{ok:false,stage:"CALCULATION",reason:e instanceof Error?e.message:"CALCULATION_FAILURE"}}
}
