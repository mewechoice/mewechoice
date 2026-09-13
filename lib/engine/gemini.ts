import { INTERPRETATION_SYSTEM_PROMPT } from "./system-prompt";
import { type InterpretationOutput, type SafeContext } from "./types";

const DEFAULT_GEMINI_MODEL = "gemini-3.5-flash";

const INTERPRETATION_RESPONSE_SCHEMA = {
  type: "object",
  additionalProperties: false,
  properties: {
    reading: { type: "string" },
    clear_points: {
      type: "array",
      items: { type: "string" },
      minItems: 1,
      maxItems: 3,
    },
    attention_points: {
      type: "array",
      items: { type: "string" },
      minItems: 1,
      maxItems: 3,
    },
    missing_information: {
      type: "array",
      items: { type: "string" },
      minItems: 0,
      maxItems: 3,
    },
    next_step: { type: "string" },
  },
  required: [
    "reading",
    "clear_points",
    "attention_points",
    "missing_information",
    "next_step",
  ],
} as const;

export async function generateWithGemini(
  context: SafeContext,
  signal: AbortSignal,
): Promise<InterpretationOutput> {
  const apiKey = process.env.GEMINI_API_KEY;
  const model = process.env.GEMINI_MODEL?.trim() || DEFAULT_GEMINI_MODEL;

  if (!apiKey) throw new Error("GEMINI_NOT_CONFIGURED");

  const url = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent`;

  const body = {
    system_instruction: {
      parts: [{ text: INTERPRETATION_SYSTEM_PROMPT }],
    },
    contents: [
      {
        role: "user",
        parts: [
          {
            text: [
              "CONTEXTO SEGURO:",
              JSON.stringify(context),
              "",
              "Produza somente a leitura em português brasileiro, obedecendo integralmente ao schema JSON definido pela API.",
              "Use exclusivamente os fatos e observações fornecidos no contexto seguro.",
              "Não acrescente fatos, causalidades, produtos, recomendações, promessas ou inferências financeiras.",
            ].join("\n"),
          },
        ],
      },
    ],
    generationConfig: {
      responseMimeType: "application/json",
      responseSchema: INTERPRETATION_RESPONSE_SCHEMA,
      maxOutputTokens: 650,
    },
  };

  const res = await fetch(url, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-goog-api-key": apiKey,
    },
    body: JSON.stringify(body),
    signal,
    cache: "no-store",
  });

  if (!res.ok) {
    const errorBody = await res.text().catch(() => "");
    console.error("Gemini API request failed", {
      status: res.status,
      model,
      body: errorBody.slice(0, 500),
    });
    throw new Error(`GEMINI_HTTP_${res.status}`);
  }

  const json = await res.json();
  const text = json?.candidates?.[0]?.content?.parts?.[0]?.text;

  if (typeof text !== "string" || !text.trim()) {
    throw new Error("GEMINI_EMPTY_OUTPUT");
  }

  try {
    return JSON.parse(text) as InterpretationOutput;
  } catch {
    throw new Error("GEMINI_INVALID_JSON");
  }
}
