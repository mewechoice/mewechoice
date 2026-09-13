import { INTERPRETATION_SYSTEM_PROMPT } from "./system-prompt";
import { type InterpretationOutput, type SafeContext } from "./types";

export async function generateWithGemini(context: SafeContext, signal: AbortSignal): Promise<InterpretationOutput> {
  const apiKey = process.env.GEMINI_API_KEY;
  const model = process.env.GEMINI_MODEL;
  if (!apiKey || !model) throw new Error("GEMINI_NOT_CONFIGURED");

  const url = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent?key=${encodeURIComponent(apiKey)}`;
  const body = {
    system_instruction: { parts: [{ text: INTERPRETATION_SYSTEM_PROMPT }] },
    contents: [{ role: "user", parts: [{ text: `CONTEXTO SEGURO:\n${JSON.stringify(context)}` }] }],
    generationConfig: {
      temperature: 0.1,
      responseMimeType: "application/json",
      maxOutputTokens: 650,
    },
  };
  const res = await fetch(url, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(body), signal, cache: "no-store" });
  if (!res.ok) throw new Error(`GEMINI_HTTP_${res.status}`);
  const json = await res.json();
  const text = json?.candidates?.[0]?.content?.parts?.[0]?.text;
  if (typeof text !== "string") throw new Error("GEMINI_EMPTY_OUTPUT");
  return JSON.parse(text) as InterpretationOutput;
}
