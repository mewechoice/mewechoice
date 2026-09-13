import { type InterpretationOutput, type SafeContext } from "./types";

// Same pre-approved narrative feeds NLG and the deterministic V1 fallback.
export function buildFallback(context: SafeContext): InterpretationOutput {
  return structuredClone(context.narrative_plan);
}
