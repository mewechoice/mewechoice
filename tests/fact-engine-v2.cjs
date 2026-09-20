const fs=require("fs"),vm=require("vm"),ts=require("typescript"),assert=require("assert");
function load(path,extra={}){const src=fs.readFileSync(path,"utf8");const js=ts.transpileModule(src,{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText;const module={exports:{}};vm.runInNewContext(js,{module,exports:module.exports,require:(p)=>extra[p]||require(p),Intl,Date,Set,Number,RangeError,Error});return module.exports}
const ref={kind:"CONSORTIUM_ADMIN_FEE_AVERAGE",value:15.01,unit:"PERCENT_OF_CREDIT",vehicleCategory:"AUTOMOBILE",lineage:{source:"BCB",referenceId:"PANORAMA-2024",referencePeriod:"2024",retrievedAt:"2026-09-19T00:00:00Z",methodology:"new automobile groups"}};
const f=load("lib/engine/fact-engine-v2.ts");
const c=f.buildConsortiumFacts({creditReference:80000,productTermMonths:60,administrationReference:12008,baseSimulatedTotal:92008,baseMathematicalInstallment:1533.4666666667,adminFeeReference:ref});
const total=c.find(x=>x.semanticId==="CONSORTIUM_BASE_SIMULATED_TOTAL");assert.equal(total.state.completeness,"PARTIAL");assert(total.missingComponents.every(x=>x.applicability==="IF_APPLICABLE"));assert(total.requiredDisclosures.includes("UNKNOWN_COSTS_NOT_ASSUMED"));
const finRef={kind:"VEHICLE_FINANCING_AVERAGE_RATE",value:1.5,unit:"PERCENT_PER_MONTH",lineage:{source:"BCB",referenceId:"SGS25471",referencePeriod:"2026-08",retrievedAt:"2026-09-19T00:00:00Z",methodology:"average"}};
const fin=f.buildFinancingFacts({vehicleReferenceValue:80000,allocatedDownPayment:20000,productTermMonths:36,principal:60000,payment:2169.14,installmentsTotal:78089.04,projectedOutlay:98089.04,mathematicalInterest:18089.04,rateReference:finRef});
assert(fin.find(x=>x.semanticId==="FINANCING_MATHEMATICAL_PRICE_INSTALLMENT").provenance.parentFactIds.includes("fin.rate"));
assert.equal(f.canDirectlyCompare(total,fin.find(x=>x.semanticId==="FINANCING_PROJECTED_OUTLAY")),false);
const di={kind:"DI_RATE",value:14.9,unit:"PERCENT_PER_YEAR",lineage:{source:"B3",referenceId:"DI",referencePeriod:"2026-09-19",retrievedAt:"2026-09-19T00:00:00Z",methodology:"official"}};
const acc=f.buildAccumulationFacts({currentResources:20000,monthlyContribution:1500,projectHorizonMonths:36,withoutYield:74000,withDiReference:90000,diReference:di});
assert(acc.find(x=>x.id==="acc.di-projection").methodology.includes("CONTRIBUTION_TIMING_END_OF_PERIOD"));
const v=load("lib/engine/fact-output-validator-v2.ts",{"./fact-engine-v2":f});
assert.equal(v.validateFactPublication(total,{factId:total.id,renderedValue:total.value.displayValue,disclosures:[]}).ok,false);
assert.equal(v.validateFactPublication(total,{factId:total.id,renderedValue:total.value.displayValue,disclosures:total.requiredDisclosures}).ok,true);
console.log("fact-engine-v2: ok");
