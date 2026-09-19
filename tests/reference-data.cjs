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
]) assert.equal(validateVehiclePathReference(ref).ok,false,JSON.stringify(ref));

console.log('Reference Data Contracts: source/unit/kind/lineage constraints passed.');
