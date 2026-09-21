import type { SyntheticUnit } from "./model";

export const SYNTHETIC_UNITS: SyntheticUnit[] = [
  { unitId:"SYN-001", blockId:"SYN", version:1, releaseStatus:"PASS", resourceMode:"SYNTHETIC",
    content:"Digite exatamente: ALFA-LUA-27", responseFormat:"TEXT", contentValidityStatus:"PASS", readabilityStatus:"PASS" },
  { unitId:"SYN-002", blockId:"SYN", version:1, releaseStatus:"PASS", resourceMode:"SYNTHETIC",
    content:"Digite exatamente: BETA-PONTE-41", responseFormat:"TEXT", contentValidityStatus:"PASS", readabilityStatus:"PASS" },
  { unitId:"SYN-003", blockId:"SYN", version:1, releaseStatus:"PASS", resourceMode:"SYNTHETIC",
    content:"Digite exatamente: GAMA-NORTE-63", responseFormat:"TEXT", contentValidityStatus:"PASS", readabilityStatus:"PASS" },
];

export function publicUnit(index:number) {
  const u=SYNTHETIC_UNITS[index];
  if(!u || u.releaseStatus!=="PASS" || u.contentValidityStatus!=="PASS" || u.readabilityStatus!=="PASS") return null;
  return { unitId:u.unitId, content:u.content, responseFormat:u.responseFormat, resourceMode:u.resourceMode };
}