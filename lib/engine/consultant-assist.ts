import { type ConsultantAssist, type SafeContext } from "./types";

const questionMap: Record<string, string> = {
  "Faixa aproximada do objetivo": "Você já tem uma faixa aproximada para esse objetivo?",
  "Horizonte desejado": "Existe um prazo desejado ou esse horizonte ainda está aberto?",
  "Prioridades para a decisão": "O que mais pesa nessa decisão para você hoje?",
  "Disponibilidade inicial": "Existe algum valor que você considera utilizar inicialmente nesse projeto?",
  "Compromisso mensal confortável": "Qual compromisso mensal seria confortável sem pressionar sua organização atual?",
  "Se existe veículo para troca": "Existe um veículo atual que possa fazer parte dessa decisão?",
  "Uso principal do veículo": "O uso principal será pessoal, profissional ou misto?",
  "Datas ou janela da viagem": "Você já tem uma janela de datas em mente?",
  "Flexibilidade de calendário": "As datas são fixas ou existe flexibilidade para organizar melhor o projeto?",
  "Data de início": "Quando você gostaria de iniciar esse projeto de educação?",
  "Duração prevista": "Você já sabe a duração aproximada desse ciclo?",
  "Prazo de implementação": "Em que horizonte essa etapa do negócio precisa estar implementada?",
  "Capital próprio disponível": "Existe algum recurso próprio já reservado para esse projeto?",
  "Horizonte patrimonial": "Esse objetivo tem um horizonte definido ou ainda está em construção?",
  "Liquidez que precisa ser preservada": "Existe algum nível de liquidez que você prefere preservar fora desse projeto?",
};

export function buildConsultantAssist(context: SafeContext): ConsultantAssist {
  const summary = `${context.known_facts.slice(0, 4).join(". ")}.`;
  const suggested = context.missing_information.map((m) => questionMap[m]).filter(Boolean).slice(0, 3);
  if (context.tension_level !== "NONE") suggested.unshift("Entre as prioridades que você marcou, qual pesa mais para você neste momento?");
  return {
    consultant_summary: summary,
    tension_level: context.tension_level,
    missing_information: context.missing_information,
    suggested_questions: Array.from(new Set(suggested)).slice(0, 3),
    do_not_assume: ["Não inferir renda ou capacidade financeira.", "Não assumir disponibilidade de entrada.", "Não assumir que uma solução específica é desejada."],
    handoff_note: context.tension_level === "MATERIAL" ? "Começar esclarecendo a tensão entre prioridades antes de discutir qualquer caminho." : "Começar confirmando objetivo, prazo e informações ainda abertas antes de discutir qualquer solução.",
  };
}
