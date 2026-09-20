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
