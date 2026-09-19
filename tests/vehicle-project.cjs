const fs=require('node:fs');
const ts=require('typescript');
require.extensions['.ts']=(module,filename)=>module._compile(ts.transpileModule(fs.readFileSync(filename,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText,filename);
const assert=require('node:assert/strict');
const {calculateVehicleProject}=require('../lib/project/vehicle/engine.ts');
const {validateVehicleProjectInput}=require('../lib/project/vehicle/schema.ts');

const base={targetValue:80000,currentResources:20000,monthlyAmount:1500,horizon:{mode:'MONTHS',months:36}};
const r=calculateVehicleProject(base);
assert.equal(r.futureContributions,54000);
assert.equal(r.projectedResources,74000);
assert.equal(r.referenceDifference,-6000);
assert.equal(r.currentGap,60000);
assert.equal(r.requiredMonthlyAmount,1666.67);
assert.equal(r.requiredMonths,40);

const immediate=calculateVehicleProject({...base,horizon:{mode:'IMMEDIATE'}});
assert.equal(immediate.futureContributions,null);
assert.equal(immediate.requiredMonthlyAmount,null);
assert.equal(immediate.requiredMonths,null);
assert.equal(immediate.referenceDifference,-60000);

const zero=calculateVehicleProject({...base,currentResources:0,monthlyAmount:0});
assert.equal(zero.projectedResources,0);
assert.equal(zero.requiredMonths,null);
assert.equal(zero.requiredMonthlyAmount,2222.22);

const covered=calculateVehicleProject({...base,currentResources:80000});
assert.equal(covered.currentGap,0);
assert.equal(covered.currentSurplus,0);
assert.equal(covered.requiredMonthlyAmount,0);
assert.equal(covered.requiredMonths,0);

const surplus=calculateVehicleProject({...base,currentResources:90000});
assert.equal(surplus.currentGap,0);
assert.equal(surplus.currentSurplus,10000);
assert.equal(surplus.referenceDifference,64000);

const unknown=calculateVehicleProject({...base,targetValue:null});
assert.equal(unknown.currentGap,null);
assert.equal(unknown.referenceDifference,null);
assert.equal(unknown.requiredMonthlyAmount,null);
assert.equal(unknown.requiredMonths,null);

const custom=calculateVehicleProject({...base,horizon:{mode:'MONTHS',months:17}});
assert.equal(custom.futureContributions,25500);

// No arbitrary product caps: large values are accepted while cent-safe arithmetic remains safe.
const largeSafe={targetValue:2000000000,currentResources:1000000000,monthlyAmount:1000000,horizon:{mode:'MONTHS',months:1201}};
assert.equal(validateVehicleProjectInput(largeSafe).ok,true);
assert.equal(calculateVehicleProject(largeSafe).projectedResources,2201000000);

for (const invalid of [
  {...base,targetValue:-1},
  {...base,currentResources:-1},
  {...base,monthlyAmount:-1},
  {...base,targetValue:Infinity},
  {...base,targetValue:Number.MAX_SAFE_INTEGER},
  {...base,horizon:{mode:'MONTHS',months:0}},
  {...base,horizon:{mode:'MONTHS',months:12.5}},
  {...base,horizon:{mode:'MONTHS',months:Number.MAX_SAFE_INTEGER}},
  {...base,currentResources:90000000000000,monthlyAmount:1,horizon:{mode:'MONTHS',months:1}},
  {...base,monthlyAmount:90000000000000,horizon:{mode:'MONTHS',months:2}},
  {...base,horizon:{mode:'IMMEDIATE',months:0}},
  {...base,extra:'nope'},
]) assert.equal(validateVehicleProjectInput(invalid).ok,false,JSON.stringify(invalid));

console.log('Vehicle Project Engine: base, IMMEDIATE, zero, covered, surplus, unknown target, custom horizon, large-safe values and arithmetic-safety rejection cases passed.');
