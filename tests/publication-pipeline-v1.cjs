const fs=require("fs"),path=require("path"),ts=require("typescript"),Module=require("module");
const cache=new Map();function load(file){file=path.resolve(file);if(cache.has(file))return cache.get(file);let src=fs.readFileSync(file,"utf8"),js=ts.transpileModule(src,{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2020}}).outputText,m=new Module(file,module);cache.set(file,m.exports);m.filename=file;m.paths=module.paths;m.require=function(id){if(id.startsWith(".")){let p=path.resolve(path.dirname(file),id);if(!path.extname(p))p+=".ts";if(fs.existsSync(p))return load(p)}return Module.prototype.require.call(m,id)};m._compile(js,file);cache.set(file,m.exports);return m.exports}
const p=load(path.join(__dirname,"../lib/engine/publication-pipeline-v1.ts"));
function ok(n,r){if(!r.ok)throw Error(n+": "+JSON.stringify(r));return r}
function no(n,r){if(r.ok)throw Error(n+": unexpectedly published")}
const di={kind:"DI_RATE",source:"B3",referenceId:"DI",referencePeriod:"2026-09-19",retrievedAt:"2026-09-20T00:00:00Z",methodology:"official",rate:14.9,unit:"PERCENT_PER_YEAR"};
const fin={kind:"VEHICLE_FINANCING_AVERAGE_RATE",source:"BCB",referenceId:"SGS25471",referencePeriod:"2026-08",retrievedAt:"2026-09-20T00:00:00Z",methodology:"official",rate:1.9,unit:"PERCENT_PER_MONTH"};
const con={kind:"CONSORTIUM_ADMIN_FEE_AVERAGE",source:"BCB",referenceId:"PANORAMA_2024_AUTO_NEW_GROUPS",referencePeriod:"2024",retrievedAt:"2026-09-20T00:00:00Z",methodology:"official",rate:15.01,unit:"PERCENT_OF_CREDIT"};
let a=ok("accumulation",p.publishAccumulation({currentResources:10000,monthlyContribution:1000,projectHorizonMonths:12,diReference:di,referenceFreshness:"CURRENT"}));
if(!a.publication.payload.claims.length)throw Error("01 empty accumulation publication");
let a0=ok("accumulation no DI",p.publishAccumulation({currentResources:10000,monthlyContribution:1000,projectHorizonMonths:12}));
if(a0.facts.some(x=>x.semanticId==="ACCUMULATION_GROSS_DI_REFERENCE_PROJECTION"))throw Error("02 DI projection invented");
let f=ok("financing",p.publishFinancing({vehicleReferenceValue:100000,allocatedDownPayment:20000,productTermMonths:48,rateReference:fin,referenceFreshness:"CURRENT"}));
if(f.facts.some(x=>x.semanticId==="FINANCING_AVERAGE_MONTHLY_RATE"&&f.publication.payload.realizations.some(r=>r.factId===x.id)))throw Error("03 source rate published by default");
no("04 down payment > vehicle",p.publishFinancing({vehicleReferenceValue:100000,allocatedDownPayment:110000,productTermMonths:48,rateReference:fin}));
no("05 invalid term",p.publishFinancing({vehicleReferenceValue:100000,allocatedDownPayment:20000,productTermMonths:0,rateReference:fin}));
let c=ok("consortium",p.publishConsortium({creditReference:100000,productTermMonths:80,adminFeeReference:con,referenceFreshness:"DATED"}));
for(const x of c.facts.filter(x=>["CONSORTIUM_ADMINISTRATION_REFERENCE_AMOUNT","CONSORTIUM_BASE_SIMULATED_TOTAL","CONSORTIUM_BASE_MATHEMATICAL_INSTALLMENT"].includes(x.semanticId))){if(x.state.completeness!=="PARTIAL")throw Error("06 consortium completeness lost");}
if(!c.publication.payload.realizations.every(r=>!/(custo total|parcela contratual|cet|melhor|recomendad)/i.test(r.text)))throw Error("07 prohibited label/text");
for(const pub of [a.publication,f.publication,c.publication]){for(const r of pub.payload.realizations){const fact=[...a.facts,...f.facts,...c.facts].find(x=>x.id===r.factId);if(fact&&r.renderedValue!==fact.value.displayValue)throw Error("08 presentation recomputed value");}}
if(c.publication.payload.claims.some(x=>x.kind==="COMPARISON"))throw Error("09 automatic comparison");
console.log("MWC-015 runtime integration checks passed");
