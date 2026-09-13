# Implementation status — Site V3.7 / Engine V2.4

## Implemented
- Structured Input Only Interpretation Engine.
- Strict enum schema and cross-field validation.
- Deterministic Fact Engine.
- Observation IDs mapped to canonical approved texts.
- Safe Context only sent to Gemini.
- Gemini NLG route with low temperature and strict JSON request.
- Short timeout with deterministic fallback.
- Output safety validator.
- LOW_CONTEXT bypass/fallback.
- Deterministic Consultant Assist helper (server-side only; not exposed by public API).
- Lineage metadata in interpretation API.
- Identity data remains outside the AI call.
- V3.7 hero sizing refinements and compact side journey.
- Fast-track limited to Consórcio / Aquisição planejada / Quero explicar meu objetivo.
- Viagem remains a first-class diagnostic category.

## Verification — NLG refinement
- 93,720 valid input combinations: PASS.
- 31 targeted contract, tone and repetition checks: PASS.
- 9 API scenarios with mocked Gemini: PASS.
- TypeScript typecheck: PASS.
- Next.js production build: PASS (Next.js 15.5.25).
- Live Gemini evaluation: not performed; no real model was called.

Details and example: `NLG_REFINEMENT.md`.
## Still required for production launch
- Configure `GEMINI_API_KEY` and `GEMINI_MODEL` in Vercel environment variables if AI rendering is enabled.
- Add durable rate limiting/bot protection for `/api/interpret`.
- Connect CRM/e-mail/WhatsApp through backend-only integrations.
- Keep Consultant Assist off the public frontend/API response.
- Add Golden Set CI and model-drift gate.
- Review privacy policy and commercial/regulatory wording against the actual production operation.

