const fs=require("node:fs"),assert=require("node:assert/strict"),ts=require("typescript");
require.extensions[".ts"]=(m,f)=>m._compile(ts.transpileModule(fs.readFileSync(f,"utf8"),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText,f);
const {calculateVehicleProject}=require("../lib/project/vehicle/engine.ts");
const {buildProjectEngineReading}=require("../lib/project/engine.ts");

const timed=buildProjectEngineReading(calculateVehicleProject({targetValue:80000,currentResources:20000,monthlyAmount:1500,horizon:{mode:"MONTHS",months:36}}));
assert.equal(timed.vertical,"VEHICLE");
assert.equal(timed.state,"HORIZON_POSITION");
assert.equal(timed.targetKnown,true);
assert.equal(timed.projectedResources,74000);
assert.equal(timed.referenceDifference,-6000);
assert.equal(timed.requiredMonthlyAmount,1666.67);
assert.equal(timed.requiredMonths,40);
assert.deepEqual(timed.authority,{selectedPath:null,selectedProduct:null,selectedPartner:null,recommendation:null});

const immediate=buildProjectEngineReading(calculateVehicleProject({targetValue:80000,currentResources:20000,monthlyAmount:1500,horizon:{mode:"IMMEDIATE"}}));
assert.equal(immediate.state,"CURRENT_POSITION");
assert.equal(immediate.horizonMonths,null);
assert.equal(immediate.requiredMonthlyAmount,null);
assert.equal(immediate.requiredMonths,null);

const surplus=buildProjectEngineReading(calculateVehicleProject({targetValue:80000,currentResources:100000,monthlyAmount:0,horizon:{mode:"MONTHS",months:12}}));
assert.equal(surplus.currentGap,0);
assert.equal(surplus.currentSurplus,20000);
assert.equal(surplus.requiredMonthlyAmount,0);
assert.equal(surplus.requiredMonths,0);
assert.equal(surplus.authority.recommendation,null);

console.log("project-engine-v1: PASS");
