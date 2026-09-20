# MWC-023 — Caminhos V1 integration

STATUS: INTEGRATION / CI REQUIRED

## Audit finding

The repository already contains a materially stronger canonical Caminhos implementation under `lib/engine/paths-v1.ts` and its authorization boundaries. MWC-023 therefore does not introduce a second competing Paths engine.

A temporary duplicate contract created during initial inspection was removed before PR creation.

## Canonical protections retained

- entry requires a minted ChoicePathsIntent;
- forged ChoiceState and forged Paths intents fail closed;
- taxonomy remains Acumular recursos / Financiamento / Consórcio;
- no default selection, focus, ranking, scoring or recommendation;
- cards preserve symmetric slots and actions;
- product-specific inputs require explicit user input artifacts;
- cross-path and forged input artifacts fail closed;
- financing reference requires validated BCB lineage;
- reference artifacts cannot be forged by shape alone;
- path availability cannot reorder or select another path;
- accumulation may remain deterministic without a yield reference;
- financing/consortium publication remains unavailable or input-required when prerequisites are absent.

## MWC-023 change

The existing mandatory `tests/paths-v1.cjs` suite is promoted into the PR Validation workflow as a hard gate so future changes cannot bypass the established Caminhos boundary silently.

No new recommendation authority is introduced.
