import type { PathId } from "./paths-v1";
import { isChoicePathsIntent, type ChoicePathsIntent } from "./choice-paths-boundary";

const PATH_INPUTS=new WeakSet<object>();
export type ExplicitPathInput<K extends string=string,T=number>=Readonly<{pathId:PathId;field:K;value:T}>;

export function recordExplicitPathInput<K extends string,T>(intent:ChoicePathsIntent,pathId:PathId,field:K,value:T):ExplicitPathInput<K,T>{
 if(!isChoicePathsIntent(intent))throw new Error("PATH_INPUT_SESSION_NOT_AUTHORIZED");
 const x=Object.freeze({pathId,field,value});PATH_INPUTS.add(x);return x;
}
export function readExplicitPathInput<K extends string,T>(x:ExplicitPathInput<K,T>|undefined,pathId:PathId,field:K):T{
 if(!x||!PATH_INPUTS.has(x as object)||x.pathId!==pathId||x.field!==field)throw new Error("EXPLICIT_PATH_INPUT_REQUIRED:"+field);
 return x.value;
}
