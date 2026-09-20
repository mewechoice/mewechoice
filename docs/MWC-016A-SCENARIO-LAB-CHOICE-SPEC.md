# MWC-016A — Scenario Lab + CHOICE Specification

Status: DESIGN ONLY / NO IMPLEMENTATION / NO PRODUCT RECOMMENDATION
Base: main @ 98a45ed2d7ee0da6f6e76dd5b32db6007d2d4902

## Purpose
Define the first Scenario Lab and CHOICE contract on top of the authorized MWC-015 publication pipeline.

## Governing principle
ME supplies the person's project. WE organizes deterministic scenarios. CHOICE returns authority to the person. Scenario Lab explains consequences of user-controlled project variables; it does not choose a financial product or infer suitability.

## V1 scope — vehicle project
Scenario Lab may vary only explicit project variables:
- current resources;
- monthly amount the user intends to separate;
- project horizon;
- when a financing path is explicitly opened later: allocated down payment and product term;
- when a consortium path is explicitly opened later: credit reference and product term.

A scenario is not a recommendation. It is an alternate deterministic calculation produced from an explicit user change or an explicitly neutral system-generated sensitivity set authorized by a future audited policy.

## Scenario identity
Each scenario MUST contain:
- scenarioId;
- baselineProjectId;
- route;
- exact explicit inputs;
- references and reference freshness used;
- resulting AuthorizedPublication from MWC-015;
- changedFields relative to baseline;
- deterministic lineage to the baseline.

No scenario may mutate the baseline.

## Comparison boundary
V1 does NOT compare financing vs consortium vs accumulation automatically.
Within the same route, two scenarios may be displayed side by side only after an explicit comparison request and only through authorized comparison claims where Claim Registry permits them.
If comparison authority is absent, display independent scenario cards without comparative adjectives.

## CHOICE contract
After Scenario Lab, the system displays:
“O próximo passo é seu.”

Permitted neutral actions:
1. Ajustar meu planejamento.
2. Ver os detalhes deste cenário.
3. Entender caminhos possíveis.
4. Salvar/receber meu projeto.
5. Falar com um consultor.

CHOICE MUST NOT preselect, rank, badge, highlight, reorder by commercial preference, or label a scenario as best, recommended, ideal, cheaper, smarter, safer, or more suitable.

## Contact/data boundary
Scenario Lab and CHOICE remain usable without email or phone.
Email may be requested only after value delivery to save/receive the project.
Phone/WhatsApp may be requested only after explicit human-contact intent.

## Failure behavior
A scenario is publishable only if its MWC-015 pipeline returns AuthorizedPublication.
One failed scenario MUST NOT be silently replaced with invented values.
Partial scenario sets must identify unavailable scenarios without converting UNKNOWN/UNAVAILABLE into zero.

## Mandatory red-team questions
1. Can scenario ordering become an indirect recommendation?
2. Can default values steer the user toward a product?
3. Can “scenario” become a disguised product comparison?
4. Can project horizon leak into product term?
5. Can current resources leak into financing down payment?
6. Can missing/dated references create misleading symmetry?
7. Can UI emphasis create a winner without textual recommendation?
8. Can CHOICE CTA order create commercial steering?
9. Can contact capture gate value?
10. Can a failed scenario fall back to unvalidated content?
11. Can baseline be mutated by scenario generation?
12. Can Narrative AI introduce comparative/suitability language?

## Gate
MWC-016A is specification only. Independent adversarial review is mandatory before implementation.


## MWC-016B — Independent adversarial review
Result: FAIL — correction required before implementation.

### P1-016B-01 — neutral system-generated scenarios are underspecified
The phrase “explicitly neutral system-generated sensitivity set authorized by a future audited policy” leaves future scenario-generation authority undefined. A default sensitivity generator can steer through variable choice, range, step size, anchoring, or omission even without recommendation text.

Correction required: V1 MUST be USER-DIRECTED ONLY. Every non-baseline scenario must arise from an explicit user-edited field/value. System-generated alternative values, presets, “common scenarios”, optimized ranges, or suggested deltas are prohibited in V1.

### P1-016B-02 — ordering and emphasis can create a non-textual recommendation
The spec prohibits commercial ranking but does not define deterministic presentation order/symmetry. Sorting by outcome, lower payment, earlier horizon, commercial value, or any derived metric can create an implicit winner.

Correction required: scenario order MUST be creation order (baseline first, then user-created scenarios) and MUST NOT depend on calculated outcomes, route, commercial metadata, or inferred suitability. Same-route scenario cards MUST use symmetric presentation fields and visual priority at the contract level; UI styling implementation remains a later audited layer.

### P1-016B-03 — CHOICE action order can steer toward conversion
The permitted CTA list includes human contact but does not define whether ordering/visual prominence is neutral. “Falar com um consultor” could become the primary/default action and convert CHOICE into commercial steering.

Correction required: CHOICE MUST have no preselected/default action. The primary continuation is “Ajustar meu planejamento” or “Entender caminhos possíveis” according to the user's explicit current intent; human contact MUST be secondary and only become primary after explicit human-contact intent. No CTA ordering may be driven by partner/commercial value.

### P1-016B-04 — comparison authority is too permissive for scenario semantics
The current Claim Registry authorizes comparisons for financing projected outlay/installment when semantic IDs and completeness match, but its temporal rule is a static string (“SAME_PRODUCT_TERM”) and compatibility does not itself prove the two facts actually came from equal product terms. Scenario Lab could therefore compare facts from different financing terms under a claim whose contract says SAME_PRODUCT_TERM.

Correction required: before buildComparisonClaim is permitted, Scenario Lab MUST independently prove equality of every comparison precondition required by the registry, including productTermMonths for current financing comparison rules, and preserve that proof in scenario comparison lineage. If equality cannot be proven from canonical scenario inputs, comparison is prohibited. This is an integration guard; it does not expand Claim Registry authority.

### P2-016B-05 — failure representation needs explicit non-zero semantics
The spec says unavailable scenarios must not become zero, but it does not define a display contract.

Correction required: failed/unavailable scenario result carries status UNAVAILABLE with no numeric result payload; zero is allowed only when zero is a validated numeric result.

Post-review gate: open P1=4 until corrections are incorporated and re-audited.


## MWC-016C — Master specification correction
The MWC-016B findings are incorporated as binding V1 rules:

1. USER-DIRECTED ONLY — baseline plus scenarios created from explicit user edits. No generated alternatives, presets, optimized ranges, suggested values, “popular” values, or system-selected deltas.
2. ORDER FIREWALL — baseline first; subsequent scenarios remain in immutable user creation order. No sort/reorder by outcome, route, payment, horizon, commercial metadata, engagement, or inferred suitability.
3. PRESENTATION SYMMETRY — scenario cards in the same comparison/view expose the same classes of fields with equal contract-level priority. Missing/unavailable fields are represented as unavailable, never hidden to make another scenario appear stronger.
4. CHOICE FIREWALL — no preselected/default action. Human contact is secondary unless the user has explicitly requested human contact. CTA ordering/priority cannot depend on partner or commercial value.
5. COMPARISON PRECONDITION PROOF — before invoking buildComparisonClaim, Scenario Lab proves from canonical scenario inputs every registry-required equality. For current financing comparison rules, productTermMonths MUST be exactly equal. The comparison record stores the scenario IDs and the proven equal input fields. If proof is absent, comparison is prohibited.
6. UNAVAILABLE ≠ ZERO — scenario status is AUTHORIZED or UNAVAILABLE. UNAVAILABLE carries a typed reason and no numeric publication/result payload. Numeric zero may appear only inside an AUTHORIZED publication when produced and validated by the canonical pipeline.
7. BASELINE IMMUTABILITY — scenario creation copies canonical baseline inputs into a new scenario input record and applies only the user's explicit edits; it never mutates the baseline record.
8. NO NARRATIVE AI — all V1 scenario labels/statuses/CHOICE actions are closed deterministic strings. Narrative AI remains outside scope.

### Corrected mandatory tests
In addition to the original red-team questions, implementation MUST prove:
- no API for system-generated alternative values exists in V1;
- creation order is preserved when calculated values would sort differently;
- same-route cards expose symmetric field classes;
- human-contact CTA is not promoted without explicit contact intent;
- financing comparison with unequal productTermMonths is rejected before Claim Registry invocation;
- financing comparison with equal productTermMonths may proceed only if Claim Registry independently authorizes it;
- unavailable scenario has no numeric publication payload;
- validated zero remains distinguishable from unavailable;
- baseline object remains unchanged after scenario creation;
- scenario changedFields exactly equals explicit user edits.

## MWC-016D — Corrected-spec re-audit
Result: PASS. P0=0; P1=0. P2=0 open at specification level.

The four P1 findings from MWC-016B are closed by explicit user-directed scenario generation, deterministic creation-order presentation, CHOICE steering firewall, and canonical-input comparison-precondition proof. The P2 unavailable/zero ambiguity is also closed. Implementation is eligible, but remains prohibited from merge until implementation audit and Owner authorization.
