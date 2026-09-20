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
