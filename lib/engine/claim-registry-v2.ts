import type { Fact, RequiredDisclosure } from "./fact-engine-v2";

export type ClaimType = "FACT_CLAIM" | "CONTEXT_CLAIM" | "COMPARISON_CLAIM";
export type SemanticClaimId =
  | "FACT_VALUE"
  | "FINANCING_RATE_IS_STATISTICAL_AVERAGE"
  | "FINANCING_RATE_IS_NOT_USER_RATE"
  | "FINANCING_INSTALLMENT_IS_MATHEMATICAL_PRICE_RESULT"
  | "FINANCING_PROJECTED_OUTLAY_IS_MODEL_RESULT"
  | "FINANCING_PROJECTED_OUTLAY_IS_NOT_CET"
  | "DI_PROJECTION_IS_GROSS_REFERENCE"
  | "DI_TAXES_NOT_MODELED"
  | "DI_FEES_NOT_MODELED"
  | "DI_FUTURE_RATE_NOT_GUARANTEED"
  | "CONSORTIUM_ADMIN_FEE_IS_STATISTICAL_REFERENCE"
  | "CONSORTIUM_REFERENCE_IS_DATED"
  | "CONSORTIUM_BASE_TOTAL_IS_PARTIAL"
  | "CONSORTIUM_BASE_INSTALLMENT_IS_MATHEMATICAL"
  | "CONSORTIUM_CONTRACT_COMPONENTS_MAY_DIFFER"
  | "AUTHORIZED_NUMERIC_COMPARISON";

export type AuthorizedClaim = Readonly<{
  claimId:string; claimType:ClaimType; semanticClaimId:SemanticClaimId;
  subjectFactIds:readonly string[]; requiredDisclosures:readonly RequiredDisclosure[];
}>;

export function buildFactValueClaim(fact:Fact):AuthorizedClaim {
  return Object.freeze({claimId:`claim.${fact.id}`,claimType:"FACT_CLAIM",semanticClaimId:"FACT_VALUE",subjectFactIds:Object.freeze([fact.id]),requiredDisclosures:Object.freeze([...fact.requiredDisclosures])});
}
