import type { Fact, RequiredDisclosure } from "./fact-engine-v2";

export type FactPublication = { factId:string; renderedValue:string; disclosures:RequiredDisclosure[] };

export function validateFactPublication(fact:Fact, publication:FactPublication):{ok:true}|{ok:false;reason:string}{
  if(publication.factId!==fact.id) return {ok:false,reason:"FACT_ID_MISMATCH"};
  if(fact.state.availability!=="AVAILABLE") return {ok:false,reason:"FACT_UNAVAILABLE"};
  if(fact.state.validation!=="VALIDATED") return {ok:false,reason:"FACT_INVALID"};
  if(fact.state.authorization==="NOT_AUTHORIZED") return {ok:false,reason:"FACT_NOT_AUTHORIZED"};
  const supplied=new Set(publication.disclosures);
  if(fact.requiredDisclosures.some(d=>!supplied.has(d))) return {ok:false,reason:"REQUIRED_DISCLOSURE_MISSING"};
  const allowed=new Set([String(fact.value.exactValue),fact.value.displayValue]);
  if(!allowed.has(publication.renderedValue)) return {ok:false,reason:"UNAUTHORIZED_VALUE_REPRESENTATION"};
  return {ok:true};
}

export function assertNoDisplayValueAsCalculationInput(_value:never):never {
  throw new Error("DISPLAY_VALUE_MUST_NOT_ENTER_CALCULATION_ENGINE");
}
