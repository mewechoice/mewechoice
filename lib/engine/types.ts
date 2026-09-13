export const ENGINE_VERSION = "2.4" as const;
export const SITE_DIAGNOSTIC_VERSION = "V3.7" as const;
export const SCHEMA_VERSION = "1.0" as const;
export const FACT_ENGINE_VERSION = "1.0" as const;
export const OBSERVATION_LIBRARY_VERSION = "1.0" as const;
export const OUTPUT_VALIDATOR_VERSION = "1.0" as const;
export const CONSULTANT_ASSIST_VERSION = "1.0" as const;

export const categories = ["patrimonio", "imovel", "veiculo", "viagem", "educacao", "negocio", "outros", "descobrindo"] as const;
export type Category = (typeof categories)[number];

export const subcategoryMap = {
  patrimonio: ["construir_patrimonio", "ampliar_patrimonio", "aquisicao_futura"],
  imovel: ["primeiro_imovel", "trocar_imovel", "construir", "reformar"],
  veiculo: ["primeiro_veiculo", "trocar_veiculo", "outro_veiculo"],
  viagem: ["lazer", "intercambio", "evento_experiencia", "nao_definida"],
  educacao: ["graduacao", "pos_especializacao", "curso", "educacao_familiar", "outro_educacional"],
  negocio: ["abrir", "expandir", "equipamentos_estrutura", "outro_empresarial"],
  outros: ["contato_humano"],
  descobrindo: ["nao_definida"],
} as const;
export type Subcategory = (typeof subcategoryMap)[Category][number];

export const maturities = ["comecando", "ideia_clara", "comparando", "realizar_breve", "ja_sei"] as const;
export type Maturity = (typeof maturities)[number];

export const priorities = ["rapidez", "custos", "previsibilidade", "flexibilidade", "preservar_recursos", "comparar", "nao_sei"] as const;
export type Priority = (typeof priorities)[number];

export const timelines = ["agora", "ate_6_meses", "6_12_meses", "1_2_anos", "mais_2_anos", "nao_sei"] as const;
export type Timeline = (typeof timelines)[number];

export const valueRanges = [
  "imovel_ate_250k", "imovel_250_500k", "imovel_500k_1m", "imovel_acima_1m",
  "veiculo_ate_50k", "veiculo_50_100k", "veiculo_100_200k", "veiculo_acima_200k",
  "viagem_ate_10k", "viagem_10_30k", "viagem_30_60k", "viagem_acima_60k",
  "educacao_ate_20k", "educacao_20_50k", "educacao_50_100k", "educacao_acima_100k",
  "negocio_ate_50k", "negocio_50_150k", "negocio_150_500k", "negocio_acima_500k",
  "patrimonio_ate_100k", "patrimonio_100_250k", "patrimonio_250_500k", "patrimonio_acima_500k",
  "nao_sei", "prefiro_nao_informar"
] as const;
export type ValueRange = (typeof valueRanges)[number];

export type EngineInput = {
  engine_version: typeof ENGINE_VERSION;
  schema_version: typeof SCHEMA_VERSION;
  category: Category;
  subcategory: Subcategory;
  maturity: Maturity;
  priorities: Priority[];
  timeline: Timeline;
  value_range: ValueRange;
};

export type ContextLevel = "HIGH_CONTEXT" | "MEDIUM_CONTEXT" | "LOW_CONTEXT";
export type TensionLevel = "NONE" | "MILD" | "MATERIAL";

export type ObservationId =
  | "OBS_HORIZONTE_PERMITE_PLANEJAMENTO"
  | "OBS_PRAZO_CURTO_REQUER_CLAREZA"
  | "OBS_PREVISIBILIDADE_RELEVANTE"
  | "OBS_PRESERVACAO_RECURSOS_RELEVANTE"
  | "OBS_FLEXIBILIDADE_RELEVANTE"
  | "OBS_CUSTO_TOTAL_RELEVANTE"
  | "OBS_COMPARACAO_CRITERIOS_COMUNS"
  | "OBS_RAPIDEZ_RELEVANTE"
  | "OBS_URGENCIA_E_PRESERVACAO_EM_TENSAO"
  | "OBS_CUSTO_E_FLEXIBILIDADE_EM_TENSAO"
  | "OBS_OBJETIVO_EM_DESCOBERTA"
  | "OBS_MATURIDADE_COMPARACAO"
  | "OBS_MATURIDADE_INICIAL"
  | "OBS_MATURIDADE_AVANCADA";

export type SafeContext = {
  lineage: {
    session_uuid: string;
    engine_version: string;
    schema_version: string;
    fact_engine_version: string;
    observation_library_version: string;
  };
  known_facts: string[];
  canonical_observations: string[];
  missing_information: string[];
  tension_level: TensionLevel;
  context_level: ContextLevel;
};

export type InterpretationOutput = {
  reading: string;
  clear_points: string[];
  attention_points: string[];
  missing_information: string[];
  next_step: string;
};

export type ConsultantAssist = {
  consultant_summary: string;
  tension_level: TensionLevel;
  missing_information: string[];
  suggested_questions: string[];
  do_not_assume: string[];
  handoff_note: string;
};
