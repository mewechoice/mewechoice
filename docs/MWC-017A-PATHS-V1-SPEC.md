# MWC-017A — Caminhos V1 Specification

STATUS: DESIGN ONLY / NO IMPLEMENTATION / NO RECOMMENDATION

## Purpose
Define the neutral Paths layer opened only after explicit user initiative from CHOICE. It explains three mechanisms without choosing one: ACUMULAR RECURSOS, FINANCIAMENTO, CONSÓRCIO. Objective selection never selects a path, product, partner, institution or offer.

## Entry authority
Paths opens only from explicit CHOICE intent equivalent to “Entender caminhos possíveis” or an explicit request naming a path. Never from income, resources, horizon, engagement, lead value, commercial metadata or inferred suitability.

## Neutral contract
Equal contract-level presentation priority. No ranking, scoring, badges, preselection, suitability language, commercial sorting, or hiding a path because another looks attractive. Fixed taxonomy order: Acumular recursos; Financiamento; Consórcio. This is not a ranking.

## Acumular recursos
Educational views: without yield reference; and gross projection using 100% DI reference when authorized DI data exists. Contribution timing END_OF_PERIOD. DI is a gross mathematical reference, not product recommendation or promised return. Unavailable DI does not block the no-yield view. UNKNOWN/UNAVAILABLE never becomes zero.

## Financiamento
Uses authorized BCB SGS 25471 average vehicle-financing rate and Price educational convention. The BCB average is not CET, proposal, approval or guaranteed user rate. currentResources is not automatically allocatedDownPayment. projectHorizon is not productTerm. Down payment and product term require explicit user values.

## Consórcio
Uses the dated official BCB statistical administration-fee reference already authorized. It is not offer, quote or contractual condition. Preserve PARTIAL completeness where applicable. Unknown reserve fund, insurance, adjustments and other components are not presumed zero. No contemplation prediction, recommended bid or guarantee.

## Cross-path comparison firewall
No automatic numerical comparison among paths. Independent cards may coexist, but coexistence is not a comparative claim. No winner, cheapest-path claim, suitability inference or normalized score. Future cross-path comparison requires a separately audited semantic-comparability contract.

## Publication authority
All numerical/public claims pass the existing chain: official source → validated reference → Calculation Engine → Fact Engine → Claim Builder → Output Validator → AuthorizedPublication. Paths cannot construct numbers, override freshness/completeness, alter disclosures or bypass MWC-015.

## Presentation symmetry
Each available path card uses the same hierarchy: path name; mechanism meaning; explicit required inputs; authorized numerical output when available; reference/context; disclosures; neutral inspect/simulate action. Unavailable data is shown unavailable, not hidden or zero. Commercial partner/contact actions are outside default path-card hierarchy.

## CHOICE preservation
Viewing Paths does not replace CHOICE authority. User may return, adjust planning, inspect another path, save the project or explicitly request human contact. Path selection never creates automatic commercial handoff.

## Contact/data
No email or phone required to view Paths. Email only after value delivery for save/receive. Phone/WhatsApp only after explicit human-contact intent.

## Failure semantics
A path result is AUTHORIZED or UNAVAILABLE. No invented values, stale substitutes, third-party commercial rates or zero fallback. Failure in one path does not invalidate independently authorized paths.

## Mandatory adversarial tests
1. Paths cannot open from profile/income/resource inference.
2. No default path selection.
3. Fixed neutral order cannot be commercially reordered.
4. projectHorizon cannot populate productTerm.
5. currentResources cannot populate allocatedDownPayment.
6. unavailable DI does not block accumulation without yield.
7. financing reference cannot be represented as CET/offer.
8. consortium PARTIAL cannot be labeled total contractual cost.
9. unknown components never become zero.
10. no contemplation prediction/recommended bid.
11. no automatic cross-path comparison/winner.
12. failure of one path remains isolated.
13. no contact gate before path value.
14. all numerical outputs are existing AuthorizedPublication objects, not Paths-created arithmetic.

## Gate
Specification only. Next: MWC-017B independent adversarial red-team. No implementation authorized.


## MWC-017B — Independent adversarial red-team
Result: FAIL — P0=0; P1=4; P2=1.

### P1-017B-01 — entry intent is semantic, not typed authority
The specification says Paths opens after explicit intent, but defines no closed token/state proving that intent. Any caller could invoke the future Paths layer directly and label the invocation explicit.

Required correction: V1 must accept a typed PathsEntryAuthority created only by the CHOICE action UNDERSTAND_PATHS or by an explicit named-path user action. No profile-derived/internal boolean is sufficient.

### P1-017B-02 — “equal presentation priority” is not machine-testable
The current Output Validator exposes PRESENTATION_ASYMMETRY but does not implement a symmetry check. The spec therefore relies on prose while cards could differ in prominence, missing fields or CTA priority.

Required correction: define a deterministic PathCardViewModel with the same ordered field slots and action class for every path. Missing values occupy UNAVAILABLE slots rather than disappearing. No featured/recommended/promoted property exists in V1.

### P1-017B-03 — path availability can become implicit recommendation
The spec permits unavailable paths, but does not forbid the remaining available path from being elevated, auto-opened or described as the surviving/viable option. That would convert failure isolation into recommendation.

Required correction: availability changes status only. It must not change ordering, emphasis, CTA priority or automatically select another path. An unavailable path remains visible in its taxonomy position with a neutral reason.

### P1-017B-04 — path-specific input acquisition can smuggle inferred product parameters
The spec states product term/down payment require explicit values but does not define provenance. A UI/service could prefill those values from project horizon/current resources and later treat them as user inputs.

Required correction: path-dependent inputs must carry explicit USER_ENTERED provenance. Financing allocatedDownPayment/productTermMonths and consortium productTermMonths cannot be initialized from project fields, defaults, presets or partner terms. Reference data is SYSTEM_REFERENCE and cannot be user-edited.

### P2-017B-05 — static taxonomy order needs accessibility/interaction neutrality
Visual order alone is insufficient if keyboard focus, DOM order or default expanded state differs.

Required correction: DOM/focus order follows the same fixed taxonomy; no path is expanded/focused by default; explicit user interaction may expand exactly the requested path.

## MWC-017B gate
Specification is NOT implementation-eligible until all P1 findings are bound into the contract and re-audited.


## MWC-017C — Binding corrections
The following rules are normative for V1 and supersede any looser wording above.

1. ENTRY AUTHORITY FIREWALL
Paths accepts only a PathsEntryAuthority with origin CHOICE_UNDERSTAND_PATHS or EXPLICIT_NAMED_PATH_REQUEST. Authority is created at the user-action boundary and is not derivable from profile, resources, horizon, analytics, CRM or commercial state.

2. SYMMETRIC CARD CONTRACT
Every path maps to the same ordered PathCardViewModel slots: pathId, title, explanation, requiredInputs, publicationStatus, publication, referenceContext, disclosures, action. V1 has no featured, recommended, promoted, score, rank or commercialPriority field. An unavailable slot remains present with status UNAVAILABLE.

3. AVAILABILITY NON-SELECTION
AUTHORIZED/UNAVAILABLE affects only that path's status/content. It never changes taxonomy order, visual emphasis, CTA priority, default expansion or selection. No surviving-path logic exists.

4. EXPLICIT INPUT PROVENANCE
Path-dependent user variables use provenance USER_ENTERED. Financing allocatedDownPayment and productTermMonths, and consortium productTermMonths, must originate from explicit user entry after that path is opened. They cannot be copied, defaulted or suggested from projectHorizon, currentResources, partner terms or analytics. Official rates/fees use SYSTEM_REFERENCE provenance and are not user-editable.

5. INTERACTION NEUTRALITY
DOM order, keyboard focus order and visual order are identical to the fixed taxonomy: ACCUMULATION, FINANCING, CONSORTIUM. No path is expanded or focused by default. An explicit user action may expand only the requested path.

6. NO CROSS-PATH DERIVED LANGUAGE
The Paths layer may not derive prose from relative numerical outcomes across path cards. Existing publications remain independent objects.

### Corrected mandatory tests
In addition to the original 14 cases, implementation must prove:
15. invalid/missing PathsEntryAuthority fails closed;
16. authority cannot be constructed from profile/commercial state through the Paths API;
17. all three cards expose identical ordered field-slot classes;
18. UNAVAILABLE does not reorder, hide, elevate or auto-open another path;
19. user-input provenance cannot be replaced by project/default/system values;
20. SYSTEM_REFERENCE fields cannot be edited through path-input API;
21. DOM/focus/view-model order is taxonomy order;
22. no default expanded/focused path exists.

## MWC-017D — Specification re-audit
Result: PASS — P0=0; P1=0; P2=0 open at specification level.

017B-01 CLOSED by typed entry authority.
017B-02 CLOSED by deterministic symmetric PathCardViewModel.
017B-03 CLOSED by availability non-selection.
017B-04 CLOSED by explicit provenance firewall.
017B-05 CLOSED by interaction-neutrality contract.

Implementation is eligible to begin. Merge remains prohibited until implementation audit and Owner authorization.
