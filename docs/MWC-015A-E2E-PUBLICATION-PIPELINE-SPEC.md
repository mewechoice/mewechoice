# MWC-015A — End-to-End Publication Pipeline Specification

Status: DESIGN / INTEGRATION CONTRACT / NO UI / NO NARRATIVE AI
Base: main @ 21eba8a624bc3c343201a97c960d0221c654b9ec

## Purpose
Connect the already-authorized calculation, Fact Engine V2, Claim Registry V2, and Output Validator V2 into one deterministic publication pipeline without adding recommendation authority or product-selection authority.

## Canonical pipeline
Validated input/reference → CalculationEvidence → Fact[] → deterministic claim selection → PublicationCandidate → validatePublication → AuthorizedPublication.

## Authority boundaries
1. Calculation values come only from fact-calculation-boundary/path-engine.
2. Facts come only from Fact Engine V2 builders.
3. Claims come only from Claim Registry V2 builders.
4. The orchestrator MUST NOT manufacture AuthorizedClaim objects.
5. The orchestrator MUST NOT rewrite exactValue, unit, semanticId, completeness, freshness, disclosures, lineage, or comparison contracts.
6. Publication is returned only when Output Validator V2 returns ok=true.
7. Failure is fail-closed and returns the validator failure code; no partial publication is emitted.
8. No ranking, recommendation, suitability inference, product choice, or Narrative AI in this mission.

## Route contracts
### Accumulation
Input: currentResources, monthlyContribution, projectHorizonMonths, optional validated DI reference/freshness.
Output facts: canonical accumulation Fact Engine set.
Default publication facts: ACCUMULATION_WITHOUT_YIELD and, when available, ACCUMULATION_GROSS_DI_REFERENCE_PROJECTION.
DI projection disclosures remain bound to the projection claim.

### Financing
Input: vehicleReferenceValue, explicit allocatedDownPayment, explicit productTermMonths, validated financing reference/freshness.
Default publication facts: FINANCING_MATHEMATICAL_PRICE_INSTALLMENT, FINANCING_PROJECTED_OUTLAY, FINANCING_MATHEMATICAL_INTEREST, plus source rate when explicitly requested by presentation policy.
No project-horizon→product-term inference. No currentResources→down-payment inference.

### Consortium
Input: creditReference, explicit productTermMonths, validated consortium reference. Default freshness is DATED.
Default publication facts: CONSORTIUM_ADMINISTRATION_REFERENCE_AMOUNT, CONSORTIUM_BASE_SIMULATED_TOTAL, CONSORTIUM_BASE_MATHEMATICAL_INSTALLMENT.
PARTIAL state and missing components MUST survive unchanged.

## Deterministic realization
For each selected fact, buildFactValueClaim(fact) is the only value-claim constructor. renderedValue MUST equal fact.value.displayValue; unit MUST equal fact.value.unit. Labels are selected from a closed route/semantic map, never free text.

## Disclosure binding
Every RequiredDisclosure attached to a selected Fact/Claim MUST generate an explicit FACT-scoped DisclosureBinding covering that fact. The orchestrator does not remove, deduplicate across unrelated facts, or downgrade disclosures.

## Comparison
No automatic cross-path comparison in 015A. Comparison publication requires an explicit future comparison request and buildComparisonClaim; absence of a request means no comparative claim.

## Failure contract
Pipeline returns {ok:false, stage, reason} for calculation/fact/claim/validation failures. It MUST NOT silently fall back to an unvalidated publication. Narrative fallback is outside scope.

## Mandatory adversarial tests before implementation PASS
1. financing happy path publishes only validator-authorized payload;
2. consortium retains PARTIAL + disclosures;
3. accumulation DI disclosures bind to projection;
4. no-DI accumulation omits DI claim;
5. down payment is explicit and not inferred;
6. product term is explicit and not inferred from project horizon;
7. tampered rendered value fails;
8. missing disclosure binding fails;
9. forged claim fails;
10. mutated comparison claim fails if comparison is later enabled;
11. validator failure yields no partial publication;
12. recommendation/ranking text cannot enter deterministic realization;
13. labels are closed and semantic-specific;
14. UNKNOWN/DATED state is preserved;
15. consortium base total is never labeled total contractual cost;
16. financing projected outlay is never labeled CET;
17. exact values are not recomputed in presentation layer;
18. input/reference lineage remains reachable through Facts;
19. route isolation: accumulation cannot consume financing/consortium reference kinds;
20. route isolation: financing cannot consume DI/consortium reference kinds;
21. route isolation: consortium cannot consume DI/financing reference kinds.

## Gate
015A is specification only. Next: independent adversarial review MWC-015B. Implementation is prohibited until 015B findings are synthesized/corrected and the final integration spec passes re-audit.
