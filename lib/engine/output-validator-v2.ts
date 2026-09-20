import type { Fact, RequiredDisclosure } from "./fact-engine-v2";
import type { AuthorizedClaim } from "./claim-registry-v2";

export type PublicationSurface="CARD"|"COMPARISON"|"REPORT"|"NARRATIVE";
export type DisclosureScope="FACT"|"CLAIM"|"CARD"|"PUBLICATION";
export type DisclosureBinding=Readonly<{disclosureId:RequiredDisclosure;scope:DisclosureScope;coversFactIds:readonly string[];coversClaimIds:readonly string[]}>;
export type ClaimRealization=Readonly<{claimId:string;text:string;factId:string;renderedValue?:string;label?:string;unit?:Fact["value"]["unit"]}>;
export type PublicationCandidate=Readonly<{publicationId:string;surface:PublicationSurface;claims:readonly AuthorizedClaim[];realizations:readonly ClaimRealization[];disclosureBindings:readonly DisclosureBinding[]}>;
export type OutputFailure =
 "FACT_UNAVAILABLE"|"FACT_INVALID"|"FACT_NOT_AUTHORIZED"|"CLAIM_NOT_REGISTERED"|"CLAIM_FACT_MISMATCH"|"UNSUPPORTED_CLAIM"|
 "VALUE_MISMATCH"|"UNIT_MISMATCH"|"LABEL_MISMATCH"|"SEMANTIC_MISMATCH"|"REQUIRED_DISCLOSURE_MISSING"|"DISCLOSURE_BINDING_MISSING"|
 "DISCLOSURE_SCOPE_INVALID"|"INCOMPLETE_FACT_PRESENTED_AS_COMPLETE"|"COMPARISON_NOT_AUTHORIZED"|"COMPARISON_CONTEXT_MISSING"|
 "UNSTRUCTURED_COMPARISON"|"UNKNOWN_PRESENTED_AS_ZERO"|"DATED_PRESENTED_AS_CURRENT"|"PRODUCT_TERM_INFERRED"|"RESOURCE_ALLOCATION_INFERRED"|
 "RECOMMENDATION_DETECTED"|"RANKING_DETECTED"|"SUITABILITY_INFERENCE_DETECTED"|"PRESENTATION_ASYMMETRY"|"PUBLICATION_MUTATED_AFTER_VALIDATION"|"AI_OUTPUT_VALIDATION_FAILURE";

export type ValidationResult={ok:true;publication:AuthorizedPublication}|{ok:false;reason:OutputFailure};
export type AuthorizedPublication=Readonly<{publicationId:string;payload:PublicationCandidate;validationDigest:string}>;

const forbiddenRecommendation=/\b(melhor|pior|recomendad[oa]|ideal|vantajos[oa]|mais\s+adequad[oa]|faz\s+mais\s+sentido|se\s+destaca|mais\s+atrativ[oa]|mais\s+eficiente)\b/i;
const comparative=/\b(maior|menor|mais|menos|barat[oa]|car[oa]|rápid[oa]|lent[oa]|econ[oô]mic[oa]|eficiente|atrativ[oa]|vantajos[oa]|melhor|pior)\b/i;
const totality=/\b(custo\s+total|valor\s+final|tudo\s+que\s+(?:você\s+)?pag|custo\s+completo|desembolso\s+definitivo)\b/i;
const current=/\b(atual|hoje|vigente|taxa\s+atual)\b/i;

function digest(c:PublicationCandidate):string {
  const s=JSON.stringify(c); let h=2166136261;
  for(let i=0;i<s.length;i++){h^=s.charCodeAt(i);h=Math.imul(h,16777619);}
  return (h>>>0).toString(16).padStart(8,"0");
}
function bound(c:PublicationCandidate,fact:Fact,claim:AuthorizedClaim,d:RequiredDisclosure):boolean{
 return c.disclosureBindings.some(b=>b.disclosureId===d&&(b.coversFactIds.includes(fact.id)||b.coversClaimIds.includes(claim.claimId)));
}

export function validatePublication(facts:readonly Fact[],candidate:PublicationCandidate):ValidationResult{
 const byFact=new Map(facts.map(f=>[f.id,f]));
 const byClaim=new Map(candidate.claims.map(c=>[c.claimId,c]));
 for(const r of candidate.realizations){
   const claim=byClaim.get(r.claimId); if(!claim)return {ok:false,reason:"CLAIM_NOT_REGISTERED"};
   const fact=byFact.get(r.factId); if(!fact)return {ok:false,reason:"CLAIM_FACT_MISMATCH"};
   if(!claim.subjectFactIds.includes(fact.id))return {ok:false,reason:"CLAIM_FACT_MISMATCH"};
   if(fact.state.availability!=="AVAILABLE")return {ok:false,reason:"FACT_UNAVAILABLE"};
   if(fact.state.validation!=="VALIDATED")return {ok:false,reason:"FACT_INVALID"};
   if(fact.state.authorization==="NOT_AUTHORIZED")return {ok:false,reason:"FACT_NOT_AUTHORIZED"};
   if(r.renderedValue!==undefined&&!new Set([String(fact.value.exactValue),fact.value.displayValue]).has(r.renderedValue))return {ok:false,reason:"VALUE_MISMATCH"};
   if(r.unit!==undefined&&r.unit!==fact.value.unit)return {ok:false,reason:"UNIT_MISMATCH"};
   for(const d of new Set([...fact.requiredDisclosures,...claim.requiredDisclosures])) if(!bound(candidate,fact,claim,d))return {ok:false,reason:"DISCLOSURE_BINDING_MISSING"};
   if(fact.state.completeness==="PARTIAL"&&totality.test(r.text))return {ok:false,reason:"INCOMPLETE_FACT_PRESENTED_AS_COMPLETE"};
   if(fact.state.freshness!=="CURRENT"&&current.test(r.text))return {ok:false,reason:"DATED_PRESENTED_AS_CURRENT"};
   if(forbiddenRecommendation.test(r.text))return {ok:false,reason:"RECOMMENDATION_DETECTED"};
   if(comparative.test(r.text)&&claim.claimType!=="COMPARISON_CLAIM")return {ok:false,reason:"UNSTRUCTURED_COMPARISON"};
 }
 const frozen=Object.freeze({...candidate,claims:Object.freeze([...candidate.claims]),realizations:Object.freeze([...candidate.realizations]),disclosureBindings:Object.freeze([...candidate.disclosureBindings])});
 return {ok:true,publication:Object.freeze({publicationId:candidate.publicationId,payload:frozen,validationDigest:digest(frozen)})};
}
