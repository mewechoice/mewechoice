import type { ChoiceState } from "./choice";

export const PATHS_VERSION = "1.0.0" as const;
export type PathId = "ACCUMULATION" | "FINANCING" | "CONSORTIUM";
export type PathIntent = "EXPLORE" | "KNOWN_PATH";

export type PathDescriptor = {
  id: PathId;
  label: "Acumular recursos" | "Financiamento" | "Consórcio";
  description: string;
  rank: null;
  score: null;
  recommended: false;
  selected: false;
};

const PATHS: readonly PathDescriptor[] = [
  {id:"ACCUMULATION",label:"Acumular recursos",description:"Entenda a lógica de formar recursos ao longo do tempo antes da aquisição.",rank:null,score:null,recommended:false,selected:false},
  {id:"FINANCING",label:"Financiamento",description:"Entenda a lógica de antecipar a aquisição e pagar o valor financiado ao longo do tempo.",rank:null,score:null,recommended:false,selected:false},
  {id:"CONSORTIUM",label:"Consórcio",description:"Entenda a lógica de aquisição planejada em grupo, sem pressupor data de contemplação.",rank:null,score:null,recommended:false,selected:false},
];

export function openPaths(choice: ChoiceState, intent: PathIntent): {version:typeof PATHS_VERSION;intent:PathIntent;paths:readonly PathDescriptor[];recommendation:null} {
  if (!choice || choice.version !== "1.0.0" || choice.selectedPath !== null || choice.recommendation !== null) throw new Error("INVALID_PATHS_SOURCE");
  if (intent !== "EXPLORE" && intent !== "KNOWN_PATH") throw new Error("INVALID_PATHS_INTENT");
  return {version:PATHS_VERSION,intent,paths:PATHS.map(path=>({...path})),recommendation:null};
}
