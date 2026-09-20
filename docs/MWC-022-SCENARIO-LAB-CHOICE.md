# MWC-022 — Scenario Lab + CHOICE

STATUS: IMPLEMENTED / CI REQUIRED

Scenario Lab V1 converts the Project Engine reading into neutral observations only. It does not enumerate, rank, prioritize, recommend, preselect, or infer paths/products/partners.

CHOICE is the explicit user-control boundary. It exposes exactly two neutral continuation intents:
- Quero entender caminhos possíveis
- Já tenho um caminho em mente

No click behavior for paths is implemented in MWC-022. That belongs to the later Caminhos mission and prevents this mission from silently introducing solution authority.

Fail-closed invariants:
- Scenario Lab rejects upstream authority contamination.
- CHOICE rejects a scenario that already claims paths were requested.
- CHOICE rejects selected path/product/partner/recommendation contamination.
- No editorial state is consumed.
- No contact/CRM gate is introduced.
- No commercial partner is selected.

Canonical message: “O próximo passo é seu.”


## Final adversarial re-audit — CI #35

Audited implementation HEAD: `dea143ec37c07c140af60473c71e0484aed22921`.

CI #35 completed SUCCESS after the expanded adversarial boundary suite. The validated contract rejects null or version-invalid Scenario/CHOICE sources, upstream authority contamination, preselected paths, injected recommendations, and a false claim that paths were already requested.

Scenario Lab remains observational. CHOICE remains an explicit user-control boundary. No path enumeration or click behavior is implemented here, so MWC-022 cannot silently enter the later Caminhos layer.

STATUS: READY FOR MERGE under the Owner's standing authorization for MWC-022. This documentation commit changes HEAD and therefore requires exact-HEAD CI success before merge.
