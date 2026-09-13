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

## Verification performed in this workspace
- TypeScript syntax transpile check: PASS for page + all Engine modules.
- Engine contract smoke test: PASS.
- Cross-field invalid category/subcategory test: PASS (rejected).
- Extra field test: PASS (rejected).
- Duplicate priority test: PASS (rejected).
- Priority array >2 test: PASS (rejected).
- Invalid value-range/category test: PASS (rejected).
- Fallback output validator test: PASS.

## Not fully verified here
`npm install` timed out in this execution environment, so a complete `next build` could not be run locally. Vercel should run the production build after upload. If the build fails, use the Vercel build log as the source of truth and correct before production traffic.

## Still required for production launch
- Configure `GEMINI_API_KEY` and `GEMINI_MODEL` in Vercel environment variables if AI rendering is enabled.
- Add durable rate limiting/bot protection for `/api/interpret`.
- Connect CRM/e-mail/WhatsApp through backend-only integrations.
- Keep Consultant Assist off the public frontend/API response.
- Add Golden Set CI and model-drift gate.
- Review privacy policy and commercial/regulatory wording against the actual production operation.
