require("typescript");
const fs=require("fs"), vm=require("vm"), ts=require("typescript"), path=require("path");
const cache={};
function load(p){
  p=path.normalize(p);
  if(cache[p]) return cache[p].exports;
  let s=fs.readFileSync(p,"utf8");
  s=ts.transpile(s,{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2020});
  let m={exports:{}}; cache[p]=m;
  const localRequire=(id)=>{
    if(id.startsWith(".")){
      let target=path.resolve(path.dirname(p),id);
      if(!path.extname(target)) target+=".ts";
      return load(target);
    }
    return require(id);
  };
  new vm.Script(`(function(require,module,exports){${s}\n})`)(localRequire,m,m.exports);return m.exports
}
const {calculateAccumulation,calculateFinancing,calculateConsortiumReference}=load("lib/project/vehicle/path-engine.ts");
const ok=(x,m)=>{if(!x)throw Error(m)};
const throws=(fn,msg)=>{let did=false;try{fn()}catch(_){did=true}ok(did,msg)};
const lineage=(source,id)=>({source,referenceId:id,referencePeriod:"2024-12",retrievedAt:"2026-09-19T20:00:00Z",methodology:"deterministic test fixture"});
const di={kind:"DI_RATE",value:12,unit:"PERCENT_PER_YEAR",lineage:lineage("B3","TEST-DI")};
const fin={kind:"VEHICLE_FINANCING_AVERAGE_RATE",value:2,unit:"PERCENT_PER_MONTH",lineage:lineage("BCB","SGS-25471")};
const finZero={...fin,value:0};
const con={kind:"CONSORTIUM_ADMIN_FEE_AVERAGE",vehicleCategory:"AUTOMOBILE",value:15.01,unit:"PERCENT_OF_CREDIT",lineage:lineage("BCB","PANORAMA-2024")};

let a=calculateAccumulation({currentResources:20000,monthlyContribution:1500,projectHorizonMonths:36});
ok(a.withoutYield===74000&&a.withDiReference===null,"accumulation base");
a=calculateAccumulation({currentResources:20000,monthlyContribution:1500,projectHorizonMonths:36,diReference:di});
ok(a.withDiReference>a.withoutYield,"DI projection");
a=calculateAccumulation({currentResources:20000,monthlyContribution:1500,projectHorizonMonths:0,diReference:di});
ok(a.withoutYield===20000&&Math.abs(a.withDiReference-20000)<1e-8,"immediate accumulation horizon");

let f=calculateFinancing({vehicleReferenceValue:80000,downPayment:20000,productTermMonths:36,rateReference:fin});
ok(f.principal===60000&&f.payment>0&&f.projectedOutlay>80000,"financing math");
f=calculateFinancing({vehicleReferenceValue:80000,downPayment:20000,productTermMonths:36,rateReference:finZero});
ok(Math.abs(f.payment-(60000/36))<1e-8&&f.mathematicalInterest===0,"zero-rate financing");
f=calculateFinancing({vehicleReferenceValue:80000,downPayment:80000,productTermMonths:36,rateReference:fin});
ok(f.principal===0&&f.payment===0&&f.projectedOutlay===80000,"zero principal");
throws(()=>calculateFinancing({vehicleReferenceValue:80000,downPayment:100000,productTermMonths:36,rateReference:fin}),"down payment above vehicle rejected");
throws(()=>calculateFinancing({vehicleReferenceValue:80000,downPayment:20000,productTermMonths:0,rateReference:fin}),"invalid term rejected");

let c=calculateConsortiumReference({creditReference:80000,productTermMonths:90,adminFeeReference:con});
ok(Math.abs(c.administrationReference-12008)<1e-8,"15.01 percent reference");
ok(Math.abs(c.baseSimulatedTotal-92008)<1e-8,"consortium base total");
ok(c.productTermMonths===90,"independent product term");

throws(()=>calculateAccumulation({currentResources:0.001,monthlyContribution:0,projectHorizonMonths:1}),"fractional cent rejected");
throws(()=>calculateFinancing({vehicleReferenceValue:80000,downPayment:20000,productTermMonths:36,rateReference:{...fin,lineage:{}}}),"invalid financing reference rejected");
throws(()=>calculateConsortiumReference({creditReference:80000,productTermMonths:90,adminFeeReference:{...con,lineage:{}}}),"invalid consortium reference rejected");
throws(()=>calculateAccumulation({currentResources:20000,monthlyContribution:1500,projectHorizonMonths:36,diReference:{...di,lineage:{}}}),"invalid DI reference rejected");
throws(()=>calculateAccumulation({currentResources:Number.MAX_SAFE_INTEGER/100,monthlyContribution:1,projectHorizonMonths:2}),"unsafe projection rejected");
console.log("vehicle-path-engine tests passed");
