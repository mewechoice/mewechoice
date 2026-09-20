# MWC-021 — Project Engine V1

STATUS: IMPLEMENTED / CI GATE REQUIRED / OWNER MERGE GATE

## Purpose

Create the first canonical Project Engine reading contract above the Vehicle calculation engine without granting commercial or advisory authority.

## Contract

The engine normalizes a deterministic vehicle calculation into a project reading with:
- current or horizon position;
- known/unknown target state;
- current resources and planned monthly amount;
- current gap/surplus;
- projected resources and reference difference;
- mathematical required monthly amount/months when applicable;
- inherited assumptions.

## Authority firewall

The Project Engine V1 does not choose or rank paths, products, partners, financing, consortium, accumulation strategies, or commercial providers.

The authority object is intentionally closed with null values for selectedPath, selectedProduct, selectedPartner, and recommendation.

## Semantic invariants

- IMMEDIATE is CURRENT_POSITION and horizonMonths=null.
- MONTHS is HORIZON_POSITION.
- Project horizon is not a product term.
- Resources may be zero or exceed target value.
- Arithmetic remains delegated to the validated Vehicle calculation engine.
- Narrative AI has no role in this calculation/normalization layer.

## CI

`tests/project-engine-v1.cjs` is a hard PR gate and covers timed horizon, immediate semantics, surplus state, deterministic arithmetic transfer, and the authority firewall.

## Non-goals

Scenario Lab, path comparison, product data, partner data, recommendation, CRM/contact gating, contemplation prediction, financing selection, consortium selection, and investment recommendation are outside MWC-021.


## Final adversarial re-audit — CI #32

Audited implementation HEAD: `9c1f0605a36ef21061d048aff0897b9d34ee8b1d`.

CI #32 completed SUCCESS. Hard gates passed: dependency install, TypeScript, editorial structural regression, Home production architecture, Vehicle Project UX/safety, Project Engine V1 contract, legacy regression step, production build, external BCB collector integration step, vehicle arithmetic-boundary step, and environment-dependent API integration step. The vehicle boundary discrepancy reporter was skipped because no discrepancy was present.

The adversarial pass tested runtime bypass of TypeScript assumptions. Project Engine V1 now fails closed with `INVALID_PROJECT_ENGINE_SOURCE` when its source is null, structurally invalid, missing horizon/assumptions, or not the expected Vehicle Engine version.

No path, product, partner, or recommendation authority was introduced.

STATUS: READY FOR OWNER MERGE AUTHORIZATION. This documentation commit changes the PR HEAD; the exact resulting HEAD must receive CI SUCCESS before merge.
