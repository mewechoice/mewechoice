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

## Selection authorization
The publication allowlist is closed per route and semanticId. Only facts explicitly listed by the route contract may be selected. A presentation policy may omit an allowed fact, but MUST NOT add an unlisted semanticId. Selection MUST preserve the exact Fact object produced by Fact Engine V2; no reconstructed substitute is accepted by the orchestrator.

## Disclosure binding
Every RequiredDisclosure attached to a selected Fact/Claim MUST generate an explicit FACT-scoped DisclosureBinding covering that fact. The orchestrator does not remove, deduplicate across unrelated facts, or downgrade disclosures. In 015A, each realization is rendered as an atomic publication card whose disclosure bindings are carried in the same card payload; publication-level or cross-card disclosure substitution is prohibited. UI pixel-distance/proximity policy remains outside this no-UI mission and MUST be enforced by the future renderer before display.

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
21. route isolation: consortium cannot consume DI/financing reference kinds;
22. route allowlist rejects an unlisted semanticId even if the Fact is otherwise valid;
23. disclosure binding for one card cannot satisfy another card's required disclosure.

## MWC-015B independent adversarial review
Result: FAIL → CORRECTED IN SPEC.

P1-015B-01 — selection authority was implicit. A valid but route-unlisted Fact could have been selected by an over-broad presentation policy. Corrected with a closed per-route semantic allowlist and exact Fact-object preservation.

P1-015B-02 — disclosure binding defined semantic coverage but not integration-level card locality. Corrected by requiring atomic card-local bindings and prohibiting publication/cross-card substitution. Pixel-distance is explicitly deferred to the future UI renderer, where it can be tested meaningfully.

Post-correction status: P0=0; open P1=0 at specification level. Mandatory adversarial matrix expanded from 21 to 23 cases.

## MWC-015C final specification re-audit
Result: PASS. P0=0; P1=0. The corrected contract is implementation-eligible. Re-audit verified the closed route allowlist, exact Fact-object preservation, atomic card-local disclosure binding, no automatic comparison, fail-closed publication behavior, and the prohibition on Narrative AI/recommendation authority. The 23-case adversarial matrix is mandatory for implementation audit.

## Gate
015A is specification only. MWC-015B completed with two P1 findings corrected in-spec. Implementation is prohibited until 015B findings are synthesized/corrected and the final integration spec passes re-audit.
