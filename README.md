# ME → WE → CHOICE — Site V3.7 + Interpretation Engine V2.4

NLG refinement: shared deterministic composition, clearer Portuguese, range grounding and repetition checks. See docs/NLG_REFINEMENT.md for the example and verification results.

## What changed
- Hero proportions refined: smaller “PRIMEIRO O PROJETO. DEPOIS, A SOLUÇÃO.” and more compact ME/WE/CHOICE side panel.
- Fast-track options reduced to: Consórcio, Aquisição planejada, Quero explicar meu objetivo.
- Structured Input Only: the client never writes free text to the AI.
- Gemini receives only Safe Structured Context produced by the deterministic Fact Engine.
- Strict schema and cross-field validation.
- Observation IDs → canonical approved texts.
- Output validator blocks recommendations, promises, shadow-advising patterns and unsupported numeric claims.
- Deterministic V1 fallback on timeout, configuration failure or validator rejection.
- Consultant Assist implemented as a deterministic server-side helper and must never be returned by the public interpretation endpoint.
- Identity data stays outside the AI prompt.

## Environment
Optional AI rendering:

```env
GEMINI_API_KEY=...
GEMINI_MODEL=...
GEMINI_TIMEOUT_MS=3500
```

If Gemini is not configured, the site works with deterministic fallback automatically.

## Commands

```bash
npm ci
npm test
npm run typecheck
npm run build
npm run dev
```

## Production controls still required before commercial launch
- CRM/e-mail/WhatsApp integrations.
- Rate limiting / bot protection on `/api/interpret`.
- Separate private CRM webhook for Consultant Assist.
- Safe observability without PII.
- Golden Set regression suite and model-drift gate.
- Privacy policy / consent implementation reviewed for the real production stack.

Full engine specification: `docs/ENGINE_V2_4.md`.

