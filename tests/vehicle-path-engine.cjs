require("typescript");
const fs=require("fs"), vm=require("vm"), ts=require("typescript");
function load(p){let s=fs.readFileSync(p,"utf8");s=ts.transpile(s,{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2020});let m={exports:{}};new vm.Script(`(function(require,module,exports){${s}\n})`)(require,m,m.exports);return m.exports}
const {calculateAccumulation,calculateFinancing,calculateConsortiumReference}=load("lib/project/vehicle/path-engine.ts");
const ok=(x,m)=>{if(!x)throw Error(m)};
const di={kind:"DI_RATE",value:12,unit:"PERCENT_PER_YEAR",lineage:{}};
const fin={kind:"VEHICLE_FINANCING_AVERAGE_RATE",value:2,unit:"PERCENT_PER_MONTH",lineage:{}};
const con={kind:"CONSORTIUM_ADMIN_FEE_AVERAGE",vehicleCategory:"AUTOMOBILE",value:15.01,unit:"PERCENT_OF_CREDIT",lineage:{}};
let a=calculateAccumulation({currentResources:20000,monthlyContribution:1500,projectHorizonMonths:36});
ok(a.withoutYield===74000&&a.withDiReference===null,"accumulation base");
a=calculateAccumulation({currentResources:20000,monthlyContribution:1500,projectHorizonMonths:36,diReference:di});
ok(a.withDiReference>a.withoutYield,"DI projection");
let f=calculateFinancing({vehicleReferenceValue:80000,downPayment:20000,productTermMonths:36,rateReference:fin});
ok(f.principal===60000&&f.payment>0&&f.projectedOutlay>80000,"financing math");
let c=calculateConsortiumReference({creditReference:80000,productTermMonths:90,adminFeeReference:con});
ok(Math.abs(c.administrationReference-12008)<1e-8,"15.01 percent reference");
ok(Math.abs(c.baseSimulatedTotal-92008)<1e-8,"consortium base total");
ok(c.productTermMonths===90,"independent product term");
console.log("vehicle-path-engine tests passed");
