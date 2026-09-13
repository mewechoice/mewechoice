import { NextResponse } from "next/server";
import { validateEngineInput } from "../../../lib/engine/schema";
import { buildSafeContext } from "../../../lib/engine/fact-engine";
import { buildFallback } from "../../../lib/engine/fallback";
import { generateWithGemini } from "../../../lib/engine/gemini";
import { validateInterpretationOutput } from "../../../lib/engine/output-validator";
import { OUTPUT_VALIDATOR_VERSION } from "../../../lib/engine/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function metadata(context: ReturnType<typeof buildSafeContext>, source: string, validationStatus: string) {
  return {
    source,
    validation_status: validationStatus,
    lineage: {
      ...context.lineage,
      output_validator_version: OUTPUT_VALIDATOR_VERSION,
      model_id: process.env.GEMINI_MODEL || "fallback-only",
    },
  };
}

export async function POST(request: Request) {
  try {
    const raw = await request.json();
    const parsed = validateEngineInput(raw);
    if (!parsed.ok) return NextResponse.json({ error: parsed.error }, { status: 400 });
    const sessionUuid = request.headers.get("x-mwc-session") || undefined;
    const context = buildSafeContext(parsed.value, sessionUuid);
    const fallback = buildFallback(context);

    if (context.context_level === "LOW_CONTEXT") {
      return NextResponse.json({ result: fallback, meta: metadata(context, "fallback_low_context", "PASS") });
    }

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), Number(process.env.GEMINI_TIMEOUT_MS || 3500));
    try {
      const generated = await generateWithGemini(context, controller.signal);
      const validation = validateInterpretationOutput(generated, context);
      if (!validation.ok) {
        return NextResponse.json({ result: fallback, meta: metadata(context, `fallback_validator_${validation.reason}`, "FAIL") });
      }
      return NextResponse.json({ result: generated, meta: metadata(context, "gemini", "PASS") });
    } catch {
      return NextResponse.json({ result: fallback, meta: metadata(context, "fallback_runtime", "PASS") });
    } finally {
      clearTimeout(timeout);
    }
  } catch {
    return NextResponse.json({ error: "INVALID_REQUEST" }, { status: 400 });
  }
}
