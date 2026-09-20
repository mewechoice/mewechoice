# MWC-018L — Editorial V1 Implementation Red-Team

STATUS: NARROW IMPLEMENTATION AUDIT

## Initial findings
P0 = 0
P1 = 2
P2 = 2

P1-01: Editorial CTA targeted /#meu-projeto, but the current home page has no meu-projeto anchor. This created a misleading/broken destination contract.
Correction: use the existing neutral #diagnostico entry surface. No article-derived parameters are transferred.

P1-02: Article UI hard-coded the publication date rather than rendering the registry value.
Correction: render publishedAt from the governed editorial record.

P2-01: Vercel deployment status is currently blocked by account deployment-rate limits, not by a demonstrated code failure. Therefore this audit cannot claim a successful current build/deployment from Vercel evidence.
P2-02: No GitHub Actions workflow run exists for this head, so independent CI execution evidence is absent.

## Static governance re-audit
- editorial registry separated from product/path state: PASS
- manual deterministic related reading: PASS
- ads/sponsors/affiliate fields absent: PASS
- behavioral/CRM scoring absent: PASS
- neutral product transition contains no article-derived query parameters: PASS
- target anchor exists on current home page: PASS after correction
- editorial topic namespace: PASS
- current-reference provenance guard exists: PASS
- modeled-example assumption guard exists: PASS
- naming hypotheses centralized: PASS
- accessibility focus/reduced-motion/responsive rules: PASS at static inspection
- home navigation exposes provisional Descobrir: PASS
- publication date derives from record: PASS after correction

## Verdict
PASS WITH RESIDUAL EXECUTION EVIDENCE GAP
P0 = 0
P1 = 0
Residual P2 = 2

Do not represent Vercel's deployment-rate-limit failure as an application build failure. Conversely, do not claim typecheck/build/test execution passed without execution evidence.

PR remains draft. Naming remains provisional. Merge remains Owner-gated.


## MWC-018M — Execution Evidence Closure
GitHub Actions run 10 on head d65117fca8278ea7072f26522a3a09038f7f19f6 established the editorial hard gates:
- npm ci: PASS
- TypeScript typecheck: PASS
- editorial-v1 structural/adversarial test: PASS
- production build: PASS

The diagnostic legacy/API/external-source lanes still expose pre-existing issues under CI:
- API integration expects Gemini but CI receives fallback_runtime;
- BCB collector integration can return FETCH_FAILED where the test fixture expects INVALID_REFERENCE;
- Vehicle Project arithmetic-boundary test disagrees with current schema semantics for an extreme safe-integer input.
These are not caused by the editorial diff and were not silently changed in MWC-018.

### Final implementation verdict
PASS WITH PRE-EXISTING DIAGNOSTIC DEBT
P0 = 0
P1 = 0
Editorial hard gates = PASS
Production build = PASS

Naming remains a hypothesis gate: DESCOBRIR and ANTES DA ESCOLHA are not frozen by this technical PASS.
