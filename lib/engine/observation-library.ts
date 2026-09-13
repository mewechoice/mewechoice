import { type ObservationId } from "./types";

export const observationLibrary: Record<ObservationId, string> = {
  OBS_HORIZONTE_PERMITE_PLANEJAMENTO: "O prazo informado oferece espaço para organizar a decisão antes de comparar caminhos.",
  OBS_PRAZO_CURTO_REQUER_CLAREZA: "O prazo informado torna datas e etapas de preparação critérios especialmente relevantes.",
  OBS_PREVISIBILIDADE_RELEVANTE: "Previsibilidade aparece entre as prioridades e deve ser considerada ao organizar os critérios de comparação.",
  OBS_PRESERVACAO_RECURSOS_RELEVANTE: "Preservar recursos aparece entre as prioridades, tornando valor inicial e compromisso ao longo do tempo pontos importantes para esclarecer.",
  OBS_FLEXIBILIDADE_RELEVANTE: "Flexibilidade aparece entre as prioridades e merece ser considerada antes de comparar caminhos.",
  OBS_CUSTO_TOTAL_RELEVANTE: "Organização de custos aparece entre as prioridades, então custo total e compromissos ao longo do tempo são critérios que merecem ser separados.",
  OBS_COMPARACAO_CRITERIOS_COMUNS: "Como comparar possibilidades é importante, os caminhos devem ser observados pelos mesmos critérios antes da decisão.",
  OBS_RAPIDEZ_RELEVANTE: "Rapidez aparece entre as prioridades, tornando prazo e disponibilidade critérios centrais para a próxima etapa.",
  OBS_URGENCIA_E_PRESERVACAO_EM_TENSAO: "Rapidez e preservação de recursos podem puxar a decisão em direções diferentes e precisam ser esclarecidas antes de avaliar caminhos.",
  OBS_CUSTO_E_FLEXIBILIDADE_EM_TENSAO: "Controle de custos e flexibilidade podem exigir escolhas diferentes e devem ser observados em conjunto.",
  OBS_OBJETIVO_EM_DESCOBERTA: "O objetivo ainda está em formação; nesta etapa, organizar o que se pretende realizar é mais útil do que comparar soluções.",
  OBS_MATURIDADE_COMPARACAO: "O cenário já está em fase de comparação, então critérios consistentes ajudam a evitar decisões baseadas em uma condição isolada.",
  OBS_MATURIDADE_INICIAL: "Você está começando a pensar no objetivo; esta etapa pode ser dedicada a definir o que pretende realizar.",
  OBS_MATURIDADE_AVANCADA: "O objetivo está mais definido, então as variáveis ainda ausentes ganham importância antes de qualquer avaliação de caminhos.",
};

export function canonicalize(ids: ObservationId[]): string[] {
  return ids.map((id) => observationLibrary[id]);
}
