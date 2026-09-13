import { randomUUID } from "crypto";
import {
  FACT_ENGINE_VERSION, OBSERVATION_LIBRARY_VERSION, type EngineInput, type ObservationId,
  type SafeContext, type TensionLevel, type ContextLevel
} from "./types";
import { canonicalize } from "./observation-library";

const labels = {
  category: {
    patrimonio: "Patrimônio", imovel: "Imóvel", veiculo: "Veículo", viagem: "Viagem", educacao: "Educação", negocio: "Negócio", outros: "Outro objetivo", descobrindo: "Ainda estou descobrindo",
  },
  subcategory: {
    construir_patrimonio: "Construir patrimônio", ampliar_patrimonio: "Ampliar patrimônio", aquisicao_futura: "Planejar uma aquisição futura",
    primeiro_imovel: "Comprar o primeiro imóvel", trocar_imovel: "Comprar ou trocar outro imóvel", construir: "Construir", reformar: "Reformar",
    primeiro_veiculo: "Comprar o primeiro veículo", trocar_veiculo: "Trocar de veículo", outro_veiculo: "Comprar outro veículo",
    lazer: "Viagem de lazer", intercambio: "Intercâmbio", evento_experiencia: "Evento ou experiência", nao_definida: "Ainda não definido",
    graduacao: "Graduação", pos_especializacao: "Pós ou especialização", curso: "Curso", educacao_familiar: "Educação de familiar", outro_educacional: "Outro objetivo educacional",
    abrir: "Abrir um negócio", expandir: "Expandir um negócio", equipamentos_estrutura: "Equipamentos ou estrutura", outro_empresarial: "Outro objetivo empresarial",
    contato_humano: "Objetivo para conversa humana",
  } as Record<string,string>,
  maturity: { comecando: "Começando a pensar", ideia_clara: "Ideia mais clara", comparando: "Comparando possibilidades", realizar_breve: "Pretende realizar em breve", ja_sei: "Já sabe o que quer" },
  timeline: { agora: "O quanto antes", ate_6_meses: "Até 6 meses", "6_12_meses": "6 a 12 meses", "1_2_anos": "1 a 2 anos", mais_2_anos: "Mais de 2 anos", nao_sei: "Prazo ainda não definido" },
  priority: { rapidez: "Realizar mais rápido", custos: "Planejar melhor os custos", previsibilidade: "Ter previsibilidade", flexibilidade: "Manter flexibilidade", preservar_recursos: "Preservar recursos", comparar: "Comparar possibilidades", nao_sei: "Prioridade ainda não definida" },
};

function tension(input: EngineInput): TensionLevel {
  const p = new Set(input.priorities);
  if (p.has("rapidez") && p.has("preservar_recursos")) return "MATERIAL";
  if (p.has("custos") && p.has("flexibilidade")) return "MILD";
  if (input.timeline === "agora" && p.has("preservar_recursos")) return "MATERIAL";
  return "NONE";
}

function contextLevel(input: EngineInput): ContextLevel {
  const low = input.category === "descobrindo" && input.timeline === "nao_sei" && input.priorities.includes("nao_sei") && ["nao_sei", "prefiro_nao_informar"].includes(input.value_range);
  if (low) return "LOW_CONTEXT";
  const missing = Number(input.timeline === "nao_sei") + Number(input.priorities.includes("nao_sei")) + Number(["nao_sei", "prefiro_nao_informar"].includes(input.value_range));
  return missing === 0 ? "HIGH_CONTEXT" : "MEDIUM_CONTEXT";
}

function missingFor(input: EngineInput): string[] {
  const out: string[] = [];
  if (["nao_sei", "prefiro_nao_informar"].includes(input.value_range)) out.push("Faixa aproximada do objetivo");
  if (input.timeline === "nao_sei") out.push("Horizonte desejado");
  if (input.priorities.includes("nao_sei")) out.push("Prioridades para a decisão");
  if (input.category === "imovel") out.push("Disponibilidade inicial", "Compromisso mensal confortável");
  else if (input.category === "veiculo") out.push("Se existe veículo para troca", "Uso principal do veículo");
  else if (input.category === "viagem") out.push("Datas ou janela da viagem", "Flexibilidade de calendário");
  else if (input.category === "educacao") out.push("Data de início", "Duração prevista");
  else if (input.category === "negocio") out.push("Prazo de implementação", "Capital próprio disponível");
  else if (input.category === "patrimonio") out.push("Horizonte patrimonial", "Liquidez que precisa ser preservada");
  return Array.from(new Set(out)).slice(0, 3);
}

function observations(input: EngineInput, level: ContextLevel, t: TensionLevel): ObservationId[] {
  if (level === "LOW_CONTEXT") return ["OBS_OBJETIVO_EM_DESCOBERTA"];
  const ids: ObservationId[] = [];
  if (["1_2_anos", "mais_2_anos"].includes(input.timeline)) ids.push("OBS_HORIZONTE_PERMITE_PLANEJAMENTO");
  if (["agora", "ate_6_meses"].includes(input.timeline)) ids.push("OBS_PRAZO_CURTO_REQUER_CLAREZA");
  if (input.maturity === "comecando") ids.push("OBS_MATURIDADE_INICIAL");
  if (input.maturity === "comparando") ids.push("OBS_MATURIDADE_COMPARACAO");
  if (["realizar_breve", "ja_sei"].includes(input.maturity)) ids.push("OBS_MATURIDADE_AVANCADA");
  if (input.priorities.includes("previsibilidade")) ids.push("OBS_PREVISIBILIDADE_RELEVANTE");
  if (input.priorities.includes("preservar_recursos")) ids.push("OBS_PRESERVACAO_RECURSOS_RELEVANTE");
  if (input.priorities.includes("flexibilidade")) ids.push("OBS_FLEXIBILIDADE_RELEVANTE");
  if (input.priorities.includes("custos")) ids.push("OBS_CUSTO_TOTAL_RELEVANTE");
  if (input.priorities.includes("comparar")) ids.push("OBS_COMPARACAO_CRITERIOS_COMUNS");
  if (input.priorities.includes("rapidez")) ids.push("OBS_RAPIDEZ_RELEVANTE");
  if (t === "MATERIAL") ids.push("OBS_URGENCIA_E_PRESERVACAO_EM_TENSAO");
  if (t === "MILD") ids.push("OBS_CUSTO_E_FLEXIBILIDADE_EM_TENSAO");
  return Array.from(new Set(ids)).slice(0, 4);
}

export function buildSafeContext(input: EngineInput, sessionUuid?: string): SafeContext {
  const t = tension(input);
  const level = contextLevel(input);
  const obsIds = observations(input, level, t);
  return {
    lineage: {
      session_uuid: sessionUuid || randomUUID(),
      engine_version: input.engine_version,
      schema_version: input.schema_version,
      fact_engine_version: FACT_ENGINE_VERSION,
      observation_library_version: OBSERVATION_LIBRARY_VERSION,
    },
    known_facts: [
      `Objetivo: ${labels.subcategory[input.subcategory] || labels.category[input.category]}`,
      `Momento: ${labels.maturity[input.maturity]}`,
      `Prazo: ${labels.timeline[input.timeline]}`,
      `Prioridades: ${input.priorities.map((p) => labels.priority[p]).join(" e ")}`,
    ],
    canonical_observations: canonicalize(obsIds),
    missing_information: missingFor(input),
    tension_level: t,
    context_level: level,
  };
}
