const fs=require('node:fs');
const ts=require('typescript');
require.extensions['.ts']=(module,filename)=>module._compile(ts.transpileModule(fs.readFileSync(filename,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText,filename);
const assert=require('node:assert/strict');
const {validateVehiclePathReference}=require('../lib/reference-data/schema.ts');

const lineage=(source,id,period)=>({source,referenceId:id,referencePeriod:period,retrievedAt:'2026-09-19T12:00:00-03:00',methodology:'validated official-source reference'});

const di={kind:'DI_RATE',value:1,unit:'PERCENT_PER_YEAR',lineage:lineage('B3','DI','2026-09-19')};
const financing={kind:'VEHICLE_FINANCING_AVERAGE_RATE',value:1,unit:'PERCENT_PER_MONTH',lineage:lineage('BCB','SGS-25471','2026-08')};
const consortium={kind:'CONSORTIUM_ADMIN_FEE_AVERAGE',value:15,unit:'PERCENT_OF_CREDIT',vehicleCategory:'AUTOMOBILE',lineage:lineage('BCB','PANORAMA-CONSORCIOS-2024','2024')};

for(const ref of [di,financing,consortium]) assert.equal(validateVehiclePathReference(ref).ok,true);

for(const ref of [
  {...di,unit:'PERCENT_PER_MONTH'},
  {...di,lineage:lineage('BCB','DI','2026-09-19')},
  {...financing,unit:'PERCENT_PER_YEAR'},
  {...financing,lineage:lineage('B3','SGS-25471','2026-08')},
  {...consortium,vehicleCategory:'VEHICLE'},
  {...consortium,lineage:lineage('B3','X','2024')},
  {...di,value:-1},
  {...di,value:Infinity},
  {...di,kind:'UNKNOWN'},
  {...di,lineage:{...di.lineage,referencePeriod:''}},
  {...di,unexpected:'must-fail'},
  {...financing,recommendedProduct:'must-fail'},
  {...consortium,partner:'must-fail'},
  {...di,lineage:{...di.lineage,unexpected:'must-fail'}},
  {...di,lineage:{...di.lineage,retrievedAt:'ontem'}},
  {...di,lineage:{...di.lineage,retrievedAt:'2026-09-19'}},
  {...di,lineage:{...di.lineage,retrievedAt:'2026-13-99T12:00:00Z'}},
]) assert.equal(validateVehiclePathReference(ref).ok,false,JSON.stringify(ref));

assert.equal(validateVehiclePathReference({...di,lineage:{...di.lineage,retrievedAt:'2026-09-19T15:00:00Z'}}).ok,true);
assert.equal(validateVehiclePathReference({...di,lineage:{...di.lineage,retrievedAt:'2026-09-19T15:00:00.123Z'}}).ok,true);

console.log('Reference Data Contracts: exact keys, source/unit/kind/lineage and timestamp constraints passed.');
