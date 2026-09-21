import type { ScenarioLabResult } from "./scenario-lab";
import { buildChoiceState as buildAuthorizedEngineChoiceState, type ChoiceState as AuthorizedEngineChoiceState } from "../engine/scenario-lab-v1";

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


/** Bridges the user-visible project CHOICE into the hardened engine authority boundary. */
export function authorizePathsFromProjectChoice(choice: ChoiceState): AuthorizedEngineChoiceState {
  if (!choice || choice.version !== CHOICE_VERSION || choice.canRequestPaths !== true) throw new Error("PROJECT_CHOICE_NOT_AUTHORIZED");
  if (choice.message !== "O próximo passo é seu." || choice.actions[0] !== "Quero entender caminhos possíveis") throw new Error("PROJECT_CHOICE_NOT_AUTHORIZED");
  if (choice.selectedPath !== null || choice.recommendation !== null) throw new Error("PROJECT_CHOICE_AUTHORITY_BREACH");
  return buildAuthorizedEngineChoiceState("PATHS");
}
