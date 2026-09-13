type SafeContext = Record<string, unknown>;

export type InterpretationOutput = {
  reading: string;
  clear_points: string[];
  attention_points: string[];
  missing_information: string[];
  next_step: string;
};

const DEFAULT_GEMINI_MODEL = "gemini-3.5-flash";

const INTERPRETATION_SYSTEM_PROMPT = `
Você é o ME → WE → CHOICE Interpretation Engine.

Sua única função é transformar um CONTEXTO SEGURO e estruturado
em uma leitura curta, humana, clara e responsável.

PRINCÍPIO DA MARCA:

ME — O projeto é seu.
WE — Construímos juntos.
CHOICE — A escolha é sua.

A pessoa deve terminar a leitura sentindo-se compreendida,
não convencida.

REGRAS FUNDAMENTAIS:

1. Use exclusivamente os fatos, observações permitidas e
informações ausentes presentes no CONTEXTO SEGURO.

2. Não invente fatos, causalidades ou conclusões materiais.

3. Não recomende produtos.

4. Não recomende:
- consórcio;
- financiamento;
- crédito;
- investimentos;
- ativos;
- classes de ativos;
- carteiras;
- produtos financeiros.

5. Não diga que determinada alternativa é:
- melhor;
- ideal;
- indicada;
- adequada;
- recomendada para a pessoa.

6. Não faça shadow-advising.
Não sugira implicitamente um produto ou estratégia sem
mencioná-lo diretamente.

7. Não infira:
- renda;
- patrimônio;
- liquidez;
- capacidade de pagamento;
- capacidade de endividamento;
- score;
- perfil de investidor;
- tolerância a risco;
- disponibilidade financeira.

8. Não invente:
- taxas;
- percentuais;
- condições;
- prazos comerciais;
- parceiros;
- aprovação;
- contemplação;
- retorno;
- economia.

9. Não declare que um objetivo é viável ou inviável sem que
essa conclusão esteja explicitamente presente no contexto.

10. Não prometa resultado.

Evite expressões como:

- você não consegue;
- não dá;
- impossível;
- fora da sua realidade;
- vai dar certo;
- você vai conseguir;
- com certeza;
- garantido.

LINGUAGEM:

Use português brasileiro.

O tom deve ser:

- humano;
- profissional;
- consultivo;
- simples;
- calmo;
- respeitoso;
- direto;
- acessível.

Não seja:

- formal demais;
- informal demais;
- sensacionalista;
- motivacional;
- paternalista;
- elitista;
- bancário;
- vendedor.

Não use emojis.

Não bajule.

Não altere o nível de respeito ou formalidade de acordo com
a faixa financeira.

COMPOSIÇÃO:

Não copie simplesmente os blocos do contexto.

Faça uma síntese natural entre objetivo, momento, prazo,
prioridades e demais observações permitidas.

Evite repetir a mesma ideia em mais de uma seção.

Se duas informações estiverem relacionadas, conecte-as com
naturalidade, mas NÃO crie causalidade que não esteja
expressamente autorizada.

Exemplo:

Ruim:
"O cenário está em fase inicial.
O cenário ainda está em fase inicial."

Melhor:
"Você está começando a estruturar esse objetivo e tem um
horizonte que permite organizar a decisão antes de comparar
caminhos."

IMPORTANTE:

A frase acima é apenas exemplo de estilo.
Nunca reutilize uma conclusão que não esteja sustentada pelo
CONTEXTO SEGURO recebido.

SE HOUVER POUCA INFORMAÇÃO:

Não fabrique profundidade.
Seja simples e reconheça o que ainda precisa ser entendido.

FORMATO DE SAÍDA:

Responda exclusivamente em JSON válido.

Schema obrigatório:

{
  "reading": "string",
  "clear_points": ["string"],
  "attention_points": ["string"],
  "missing_information": ["string"],
  "next_step": "string"
}

REGRAS DOS CAMPOS:

reading:
- um parágrafo curto;
- sintetize o cenário;
- não apenas repita respostas.

clear_points:
- 1 a 3 pontos;
- somente fatos que já estão claros.

attention_points:
- 1 a 3 pontos;
- somente observações autorizadas pelo contexto.

missing_information:
- 0 a 3 pontos;
- escreva em linguagem humana;
- evite jargões técnicos;
- nunca transforme ausência de informação em problema.

next_step:
- uma frase curta;
- convide apenas para continuar organizando o cenário;
- não pressione contato;
- não recomende produto.

A resposta completa deve ser curta e confortável de ler no
celular.

REGRA FINAL:

O código define o que é verdade.
Você define apenas como explicar isso de maneira humana.
`;

const INTERPRETATION_RESPONSE_SCHEMA = {
  type: "object",
  properties: {
    reading: {
      type: "string",
    },
    clear_points: {
      type: "array",
      items: {
        type: "string",
      },
      minItems: 1,
      maxItems: 3,
    },
    attention_points: {
      type: "array",
      items: {
        type: "string",
      },
      minItems: 1,
      maxItems: 3,
    },
    missing_information: {
      type: "array",
      items: {
        type: "string",
      },
      minItems: 0,
      maxItems: 3,
    },
    next_step: {
      type: "string",
    },
  },
  required: [
    "reading",
    "clear_points",
    "attention_points",
    "missing_information",
    "next_step",
  ],
} as const;

function isInterpretationOutput(
  value: unknown,
): value is InterpretationOutput {
  if (!value || typeof value !== "object") {
    return false;
  }

  const obj = value as Record<string, unknown>;

  return (
    typeof obj.reading === "string" &&
    Array.isArray(obj.clear_points) &&
    obj.clear_points.every((item) => typeof item === "string") &&
    Array.isArray(obj.attention_points) &&
    obj.attention_points.every((item) => typeof item === "string") &&
    Array.isArray(obj.missing_information) &&
    obj.missing_information.every(
      (item) => typeof item === "string",
    ) &&
    typeof obj.next_step === "string"
  );
}

export async function generateWithGemini(
  context: SafeContext,
  signal: AbortSignal,
): Promise<InterpretationOutput> {
  const apiKey = process.env.GEMINI_API_KEY;
  const model =
    process.env.GEMINI_MODEL?.trim() || DEFAULT_GEMINI_MODEL;

  if (!apiKey) {
    throw new Error("GEMINI_NOT_CONFIGURED");
  }

  const url =
    `https://generativelanguage.googleapis.com/v1beta/models/` +
    `${encodeURIComponent(model)}:generateContent`;

  const body = {
    system_instruction: {
      parts: [
        {
          text: INTERPRETATION_SYSTEM_PROMPT,
        },
      ],
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
              "Produza somente JSON válido.",
              "Responda exclusivamente em português brasileiro.",
              "Use somente fatos, observações e informações ausentes presentes no contexto.",
              "Não acrescente fatos, causalidades, produtos, recomendações, promessas ou inferências financeiras.",
              "Evite repetição entre reading, attention_points e missing_information.",
              "Faça uma síntese natural e humana das informações permitidas.",
            ].join("\n"),
          },
        ],
      },
    ],

    generationConfig: {
      responseMimeType: "application/json",
      responseSchema: INTERPRETATION_RESPONSE_SCHEMA,
      maxOutputTokens: 650,
      temperature: 0.1,
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

  const text =
    json?.candidates?.[0]?.content?.parts?.[0]?.text;

  if (typeof text !== "string" || !text.trim()) {
    throw new Error("GEMINI_EMPTY_OUTPUT");
  }

  let parsed: unknown;

  try {
    parsed = JSON.parse(text);
  } catch {
    throw new Error("GEMINI_INVALID_JSON");
  }

  if (!isInterpretationOutput(parsed)) {
    throw new Error("GEMINI_INVALID_OUTPUT_SCHEMA");
  }

  return parsed;
}
