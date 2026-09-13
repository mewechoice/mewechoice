import { type EngineInput, type ContextLevel, type TensionLevel, type InterpretationOutput, type Priority } from "./types";
import { valueLabels } from "./value-labels";

const priorities: Record<Priority, string> = {
  rapidez: "realizar mais rápido", custos: "planejar os custos", previsibilidade: "ter previsibilidade",
  flexibilidade: "manter flexibilidade", preservar_recursos: "preservar seus recursos", comparar: "comparar possibilidades", nao_sei: "",
};
const criteria: Record<Priority, string[]> = {
  rapidez: ["as datas e as etapas envolvidas"], custos: ["o custo total", "os compromissos ao longo do tempo"],
  previsibilidade: ["os compromissos ao longo do tempo", "o que pode variar nas condições"],
  flexibilidade: ["a possibilidade de ajustar o plano"], preservar_recursos: ["o valor inicial", "os compromissos ao longo do tempo"],
  comparar: ["as condições de cada alternativa"], nao_sei: ["os critérios que mais importam para você"],
};
const join = (parts: string[]) => parts.length < 2 ? parts.join("") : `${parts.slice(0,-1).join(", ")} e ${parts.at(-1)}`;

export function composeNarrative(input: EngineInput, goal: string, level: ContextLevel, tension: TensionLevel, missing: string[]): InterpretationOutput {
  const moment = {
    comecando: "Você está começando a pensar no seu objetivo",
    ideia_clara: "Você já tem uma ideia mais clara do seu objetivo",
    comparando: "Você está comparando possibilidades para o seu objetivo",
    realizar_breve: "Você quer realizar seu objetivo em breve",
    ja_sei: "Você já sabe o que quer realizar",
  }[input.maturity];
  const time = {
    agora: "e quer avançar o quanto antes", ate_6_meses: "e considera um prazo de até 6 meses",
    "6_12_meses": "e considera um prazo de 6 a 12 meses", "1_2_anos": "e considera um prazo de 1 a 2 anos",
    mais_2_anos: "e considera um prazo de mais de 2 anos", nao_sei: "com o prazo ainda em definição",
  }[input.timeline];
  const ps = input.priorities.filter(p=>p !== "nao_sei");
  const priorityText = ps.length ? ` Nesse planejamento, ${join(ps.map(p=>priorities[p]))} ${ps.length === 1 ? "é uma prioridade sua" : "são suas prioridades"}.` : " O que mais importa nessa decisão ainda está em definição.";
  const reading = level === "LOW_CONTEXT"
    ? "Você está descobrindo o que pretende realizar, com prazo e prioridades ainda em definição."
    : `${moment}: ${goal.toLocaleLowerCase("pt-BR")} ${time}.${priorityText}`;
  const points = [...new Set(input.priorities.flatMap(p=>criteria[p]))];
  const attention = level === "LOW_CONTEXT" ? "Vale começar pelo que você gostaria de mudar ou realizar para dar forma ao objetivo."
    : `Ao avaliar possibilidades, vale observar em conjunto ${join(points)}.`;
  const range = ["nao_sei", "prefiro_nao_informar"].includes(input.value_range) ? ""
    : ` A faixa de ${valueLabels[input.value_range].replace(/^Até/, "até").replace(/^Acima/, "acima")} é uma referência para essa comparação.`;
  const tensions = tension === "MATERIAL" ? "Avançar mais rápido e preservar recursos são pontos a considerar juntos; vale esclarecer como você prefere equilibrá-los."
    : tension === "MILD" ? "Controlar custos e manter flexibilidade podem envolver escolhas diferentes; vale entender o peso de cada um na decisão." : "";
  return {
    reading,
    clear_points: [goal],
    attention_points: [attention, ...(range ? [range.trim()] : []), ...(tensions ? [tensions] : [])],
    missing_information: [...missing],
    next_step: "Podemos conversar sobre esses pontos e organizar os critérios para sua decisão.",
  };
}
