# MWC-020 — Meu Projeto: Veículo

STATUS: IMPLEMENTED / CI GATE REQUIRED / NO MERGE WITHOUT OWNER AUTHORIZATION

## Scope
First production vertical for Meu Projeto.

## Canonical inputs
1. Valor aproximado do veículo.
2. Recursos atuais.
3. Valor mensal que pretende separar.
4. Prazo desejado: O quanto antes / 12 / 24 / 36 / 48 / 60 / Outro.

## Semantics
- Project horizon is not product term.
- IMMEDIATE is a distinct state and never zero months.
- Current resources may be zero or exceed target value.
- Calculation shown before contact data.
- No path, product, partner, financing or consortium is selected from this screen.
- Current V1 reading is deterministic linear arithmetic without yield, inflation, fees or costs.

## Safety correction
Closed the previously documented cent-safe arithmetic validation gap for large currentResources values before exposing the production UI.

## Non-goals
No Scenario Lab, product comparison, partner selection, CRM gate, contemplation prediction, financing recommendation or consortium recommendation.

## Merge gate
CI and re-audit may proceed autonomously. Merge remains Owner-gated.


## Final re-audit — CI #28

Exact audited HEAD before this documentation commit: `ee32da311582d3f07785672bac21b2473365d618`.

CI run #28 completed SUCCESS. Hard gates passed: dependency install, TypeScript, editorial structural regression, Home production architecture, Vehicle Project UX and safety, legacy regression, production build, external BCB collector integration, vehicle arithmetic-boundary test, and environment-dependent API integration.

Final manual audit also closed blank/malformed monetary-input handling: empty input no longer becomes zero, Brazilian thousands/decimal forms are parsed explicitly, and ambiguous malformed forms are rejected.

No product/path/partner recommendation was introduced. No contact gate was introduced. `IMMEDIATE` remains semantically distinct from zero months. The monetary safety envelope is technical arithmetic headroom only, not a commercial product cap.

STATUS: READY FOR OWNER MERGE AUTHORIZATION. Any commit after this re-audit requires CI on the new exact HEAD before merge.
