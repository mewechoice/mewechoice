import type { ScenarioLabResult } from "./scenario-lab";

export const CHOICE_VERSION = "1.0.0" as const;
export type ChoiceState = {
  version: typeof CHOICE_VERSION;
  message: "O próximo passo é seu.";
  canRequestPaths: true;
  actions: readonly ["Quero entender caminhos possíveis","Já tenho um caminho em mente"];
  selectedPath: null;
  recommendation: null;
};

export function buildChoiceState(scenario: ScenarioLabResult): ChoiceState {
  if (!scenario || scenario.version !== "1.0.0" || scenario.choices.pathsRequested !== false) throw new Error("INVALID_CHOICE_SOURCE");
  if (scenario.choices.selectedPath !== null || scenario.choices.selectedProduct !== null || scenario.choices.selectedPartner !== null || scenario.choices.recommendation !== null) throw new Error("CHOICE_AUTHORITY_BREACH");
  return {version:CHOICE_VERSION,message:"O próximo passo é seu.",canRequestPaths:true,actions:["Quero entender caminhos possíveis","Já tenho um caminho em mente"] as const,selectedPath:null,recommendation:null};
}
