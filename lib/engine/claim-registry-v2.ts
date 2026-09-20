import type { Fact, RequiredDisclosure, SemanticId } from "./fact-engine-v2";

const CLAIM_AUTHORITY = Symbol("MWC_CLAIM_AUTHORITY_V2");
export type ClaimType="FACT_CLAIM"|"CONTEXT_CLAIM"|"COMPARISON_CLAIM";
export type SemanticClaimId="FACT_VALUE"|"FINANCING_RATE_IS_STATISTICAL_AVERAGE"|"FINANCING_RATE_IS_NOT_USER_RATE"|"FINANCING_INSTALLMENT_IS_MATHEMATICAL_PRICE_RESULT"|"FINANCING_PROJECTED_OUTLAY_IS_MODEL_RESULT"|"FINANCING_PROJECTED_OUTLAY_IS_NOT_CET"|"DI_PROJECTION_IS_GROSS_REFERENCE"|"DI_TAXES_NOT_MODELED"|"DI_FEES_NOT_MODELED"|"DI_FUTURE_RATE_NOT_GUARANTEED"|"CONSORTIUM_ADMIN_FEE_IS_STATISTICAL_REFERENCE"|"CONSORTIUM_REFERENCE_IS_DATED"|"CONSORTIUM_BASE_TOTAL_IS_PARTIAL"|"CONSORTIUM_BASE_INSTALLMENT_IS_MATHEMATICAL"|"CONSORTIUM_CONTRACT_COMPONENTS_MAY_DIFFER"|"AUTHORIZED_NUMERIC_COMPARISON";
export type ComparisonRelation="GREATER_THAN"|"LESS_THAN"|"EQUAL";
export type ComparisonContract=Readonly<{leftFactId:string;rightFactId:string;exactLeftValue:number;exactRightValue:number;unit:Fact["value"]["unit"];temporalBasis:string;valueNature:string;completenessCompatibility:boolean;modeledComponents:readonly string[];unmodeledComponents:readonly string[];relation:ComparisonRelation}>;
export type AuthorizedClaim=Readonly<{[CLAIM_AUTHORITY]:true;claimId:string;claimType:ClaimType;semanticClaimId:SemanticClaimId;subjectFactIds:readonly string[];requiredDisclosures:readonly RequiredDisclosure[];comparison?:ComparisonContract}>;
const semanticCompatibility:Partial<Record<SemanticClaimId,readonly SemanticId[]>>={
 FINANCING_RATE_IS_STATISTICAL_AVERAGE:["FINANCING_AVERAGE_MONTHLY_RATE"],FINANCING_RATE_IS_NOT_USER_RATE:["FINANCING_AVERAGE_MONTHLY_RATE"],
 FINANCING_INSTALLMENT_IS_MATHEMATICAL_PRICE_RESULT:["FINANCING_MATHEMATICAL_PRICE_INSTALLMENT"],FINANCING_PROJECTED_OUTLAY_IS_MODEL_RESULT:["FINANCING_PROJECTED_OUTLAY"],FINANCING_PROJECTED_OUTLAY_IS_NOT_CET:["FINANCING_PROJECTED_OUTLAY"],
 DI_PROJECTION_IS_GROSS_REFERENCE:["ACCUMULATION_GROSS_DI_REFERENCE_PROJECTION"],DI_TAXES_NOT_MODELED:["ACCUMULATION_GROSS_DI_REFERENCE_PROJECTION"],DI_FEES_NOT_MODELED:["ACCUMULATION_GROSS_DI_REFERENCE_PROJECTION"],DI_FUTURE_RATE_NOT_GUARANTEED:["ACCUMULATION_GROSS_DI_REFERENCE_PROJECTION"],
 CONSORTIUM_ADMIN_FEE_IS_STATISTICAL_REFERENCE:["CONSORTIUM_STATISTICAL_ADMIN_FEE_RATE"],CONSORTIUM_REFERENCE_IS_DATED:["CONSORTIUM_STATISTICAL_ADMIN_FEE_RATE"],
 CONSORTIUM_BASE_TOTAL_IS_PARTIAL:["CONSORTIUM_BASE_SIMULATED_TOTAL"],CONSORTIUM_BASE_INSTALLMENT_IS_MATHEMATICAL:["CONSORTIUM_BASE_MATHEMATICAL_INSTALLMENT"],CONSORTIUM_CONTRACT_COMPONENTS_MAY_DIFFER:["CONSORTIUM_BASE_SIMULATED_TOTAL","CONSORTIUM_BASE_MATHEMATICAL_INSTALLMENT"]
};
type ComparisonRule=Readonly<{semanticId:SemanticId;temporalBasis:string;valueNature:string;requireComplete:boolean;modeledComponents:readonly string[];unmodeledComponents:readonly string[]}>;
const COMPARISON_REGISTRY:readonly ComparisonRule[]=[
 {semanticId:"FINANCING_PROJECTED_OUTLAY",temporalBasis:"SAME_PRODUCT_TERM",valueNature:"PROJECTED_OUTLAY",requireComplete:true,modeledComponents:["DOWN_PAYMENT","INSTALLMENTS"],unmodeledComponents:["CET","CONTRACT_SPECIFIC_COSTS"]},
 {semanticId:"FINANCING_MATHEMATICAL_PRICE_INSTALLMENT",temporalBasis:"SAME_PRODUCT_TERM",valueNature:"MATHEMATICAL_PRICE_INSTALLMENT",requireComplete:true,modeledComponents:["PRINCIPAL","RATE","TERM"],unmodeledComponents:["CET","CONTRACT_SPECIFIC_COSTS"]}
];
function ruleFor(left:Fact,right:Fact):ComparisonRule|undefined{return left.semanticId===right.semanticId?COMPARISON_REGISTRY.find(r=>r.semanticId===left.semanticId):undefined}
function seal(x:Omit<AuthorizedClaim,typeof CLAIM_AUTHORITY>):AuthorizedClaim{return Object.freeze({...x,[CLAIM_AUTHORITY]:true} as AuthorizedClaim)}
export function isAuthorizedClaim(x:unknown):x is AuthorizedClaim{return !!x&&typeof x==="object"&&(x as AuthorizedClaim)[CLAIM_AUTHORITY]===true}
export function isClaimCompatible(claim:AuthorizedClaim,facts:readonly Fact[]):boolean{if(claim.semanticClaimId==="FACT_VALUE")return claim.subjectFactIds.length===1&&facts.some(f=>f.id===claim.subjectFactIds[0]);if(claim.semanticClaimId==="AUTHORIZED_NUMERIC_COMPARISON"){if(claim.claimType!=="COMPARISON_CLAIM"||!claim.comparison||facts.length!==2)return false;const r=ruleFor(facts[0],facts[1]);return !!r&&claim.comparison.temporalBasis===r.temporalBasis&&claim.comparison.valueNature===r.valueNature}const allowed=semanticCompatibility[claim.semanticClaimId];return !!allowed&&claim.subjectFactIds.every(id=>{const f=facts.find(x=>x.id===id);return !!f&&allowed.includes(f.semanticId)})}
export function buildFactValueClaim(fact:Fact):AuthorizedClaim{return seal({claimId:`claim.${fact.id}`,claimType:"FACT_CLAIM",semanticClaimId:"FACT_VALUE",subjectFactIds:Object.freeze([fact.id]),requiredDisclosures:Object.freeze([...fact.requiredDisclosures])})}
export function buildComparisonClaim(left:Fact,right:Fact):AuthorizedClaim{
 const rule=ruleFor(left,right);if(!rule)throw new Error("COMPARISON_NOT_AUTHORIZED");
 if(left.comparisonPolicy==="NOT_DIRECTLY_COMPARABLE"||right.comparisonPolicy==="NOT_DIRECTLY_COMPARABLE")throw new Error("COMPARISON_NOT_AUTHORIZED");
 if(left.value.unit!==right.value.unit)throw new Error("UNIT_MISMATCH");
 if(rule.requireComplete&&(left.state.completeness!=="COMPLETE"||right.state.completeness!=="COMPLETE"))throw new Error("COMPARISON_CONTEXT_MISSING");
 const relation=left.value.exactValue===right.value.exactValue?"EQUAL":left.value.exactValue>right.value.exactValue?"GREATER_THAN":"LESS_THAN";
 const comparison=Object.freeze({leftFactId:left.id,rightFactId:right.id,exactLeftValue:left.value.exactValue,exactRightValue:right.value.exactValue,unit:left.value.unit,temporalBasis:rule.temporalBasis,valueNature:rule.valueNature,completenessCompatibility:true,modeledComponents:Object.freeze([...rule.modeledComponents]),unmodeledComponents:Object.freeze([...rule.unmodeledComponents]),relation});
 return seal({claimId:`comparison.${left.id}.${right.id}`,claimType:"COMPARISON_CLAIM",semanticClaimId:"AUTHORIZED_NUMERIC_COMPARISON",subjectFactIds:Object.freeze([left.id,right.id]),requiredDisclosures:Object.freeze([...new Set([...left.requiredDisclosures,...right.requiredDisclosures])]),comparison})
}
