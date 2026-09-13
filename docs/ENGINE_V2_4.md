# ME → WE → CHOICE — Interpretation Engine V2.4

## Status
READY FOR IMPLEMENTATION / runtime validation pending.

## Boundary
Structured input only. No chat and no free-text. The client chooses closed enum values. Identity data (name, e-mail, WhatsApp) is not sent to Gemini.

## Pipeline
1. strict schema validation
2. cross-field validation
3. deterministic Fact Engine
4. observation IDs → canonical approved texts
5. Safe Structured Context
6. Gemini used only for linguistic rendering (NLG)
7. strict JSON validation
8. output safety validation
9. deterministic V1 fallback on any failure

## Consultant Assist
Consultant Assist is deterministic. It must never be returned by the public interpretation endpoint. In production it should be built server-side and sent only to the CRM integration.

## Required production controls
- rate limit / bot protection
- short LLM timeout and circuit breaker
- model version pinning when provider supports it
- strict cache invalidation by payload hash + versions
- no PII in observability logs
- separate public result endpoint from CRM webhook
- lineage: session UUID, engine/schema/fact/prompt/model/observation/validator versions
- Golden Set and runtime regression tests
- human feedback is analytical only; never automatically trains or rewrites prompts

## Environment
- `GEMINI_API_KEY`
- `GEMINI_MODEL`
- optional `GEMINI_TIMEOUT_MS` (default 3500)

If Gemini is not configured or fails, the website returns the deterministic V1 fallback.
