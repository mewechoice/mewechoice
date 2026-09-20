import type { ChoiceState } from "./scenario-lab-v1";
import type { PathId } from "./paths-v1";

const CHOICE_INTENTS=new WeakSet<object>();
export type ChoicePathsIntent=Readonly<{action:"UNDERSTAND_PATHS";requestedPath?:PathId}>;

export function emitChoicePathsIntent(choice:ChoiceState,requestedPath?:PathId):ChoicePathsIntent{
 if(!choice.actions.includes("UNDERSTAND_PATHS"))throw new Error("CHOICE_PATHS_ACTION_NOT_AVAILABLE");
 if(choice.primaryAction!==undefined&&choice.primaryAction!=="UNDERSTAND_PATHS")throw new Error("CHOICE_PATHS_NOT_SELECTED");
 const x=Object.freeze({action:"UNDERSTAND_PATHS" as const,...(requestedPath?{requestedPath}: {})});
 CHOICE_INTENTS.add(x);return x;
}
export function isChoicePathsIntent(x:unknown):x is ChoicePathsIntent{return !!x&&typeof x==="object"&&CHOICE_INTENTS.has(x as object)}
