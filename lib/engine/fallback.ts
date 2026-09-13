import { type InterpretationOutput, type SafeContext } from "./types";

export function buildFallback(context: SafeContext): InterpretationOutput {
  const reading = context.context_level === "LOW_CONTEXT"
    ? "Seu objetivo ainda está em formação, e isso já é uma informação útil. Neste momento, mais importante do que comparar soluções é dar mais forma ao que você pretende realizar, ao horizonte que imagina e ao que mais importa nessa decisão."
    : [context.canonical_observations[0], context.canonical_observations[1]].filter(Boolean).join(" ");

  return {
    reading: reading || "Seu ponto de partida já reúne informações úteis para organizar a próxima conversa com mais clareza.",
    clear_points: context.known_facts.slice(0, 3),
    attention_points: context.canonical_observations.slice(context.context_level === "LOW_CONTEXT" ? 0 : 1, 4),
    missing_information: context.missing_information.slice(0, 3),
    next_step: "O próximo passo é organizar as variáveis que ainda estão abertas antes de avaliar caminhos possíveis.",
  };
}
