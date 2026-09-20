const fs=require("fs"),path=require("path"),ts=require("typescript"),Module=require("module");
const cache=new Map();function load(file){file=path.resolve(file);if(cache.has(file))return cache.get(file);let src=fs.readFileSync(file,"utf8"),js=ts.transpileModule(src,{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2020}}).outputText,m=new Module(file,module);cache.set(file,m.exports);m.filename=file;m.paths=module.paths;m.require=function(id){if(id.startsWith(".")){let p=path.resolve(path.dirname(file),id);if(!path.extname(p))p+=".ts";if(fs.existsSync(p))return load(p)}return Module.prototype.require.call(m,id)};m._compile(js,file);cache.set(file,m.exports);return m.exports}
const root=path.join(__dirname,"../lib/engine"),v=load(path.join(root,"output-validator-v2.ts")),cr=load(path.join(root,"claim-registry-v2.ts"));
const state={availability:"AVAILABLE",validation:"VALIDATED",freshness:"CURRENT",authorization:"AUTHORIZED",completeness:"COMPLETE"};
function fact(id,semanticId,value=2100.49,unit="BRL",extra={}){return {id,kind:"CALCULATED_FACT",semanticId,value:{exactValue:value,displayValue:String(value),unit},provenance:{origin:"CALCULATED_FACT",sourceLineage:[],calculationLineage:[],parentFactIds:[]},state:{...state,...extra.state},missingComponents:[],comparisonPolicy:extra.comparisonPolicy||"COMPARABLE_WITH_CONTEXT",requiredDisclosures:extra.requiredDisclosures||[],methodology:[],createdAt:"2026-09-19T00:00:00Z"}}
const f=fact("x","FINANCING_MATHEMATICAL_PRICE_INSTALLMENT"),claim=cr.buildFactValueClaim(f);
function cand(text,opts={}){return {publicationId:"p",surface:opts.surface||"NARRATIVE",claims:opts.claims||[claim],realizations:opts.realizations||[{claimId:claim.claimId,factId:"x",text,renderedValue:opts.value===undefined?String(f.value.exactValue):opts.value,unit:opts.unit||"BRL",label:opts.label}],disclosureBindings:opts.bindings||[]}}
function reject(name,res,reason){if(res.ok||res.reason!==reason)throw Error(name+": "+JSON.stringify(res))}
if(!v.validatePublication([f],cand("Parcela matemática")).ok)throw Error("valid rejected");
reject("invented",v.validatePublication([f],cand("Parcela",{value:"999"})),"VALUE_MISMATCH");
reject("unit",v.validatePublication([f],cand("Parcela",{unit:"MONTHS"})),"UNIT_MISMATCH");
reject("label",v.validatePublication([f],cand("Parcela",{label:"Custo total do consórcio"})),"LABEL_MISMATCH");
reject("recommendation",v.validatePublication([f],cand("Melhor opção")),"RECOMMENDATION_DETECTED");
reject("comparison",v.validatePublication([f],cand("Valor menor")),"UNSTRUCTURED_COMPARISON");
const partial=fact("x","FINANCING_MATHEMATICAL_PRICE_INSTALLMENT",2100.49,"BRL",{state:{completeness:"PARTIAL"}});reject("partial",v.validatePublication([partial],cand("Custo total")),"INCOMPLETE_FACT_PRESENTED_AS_COMPLETE");
const dated=fact("x","FINANCING_MATHEMATICAL_PRICE_INSTALLMENT",2100.49,"BRL",{state:{freshness:"DATED"}});reject("dated",v.validatePublication([dated],cand("Valor atual")),"DATED_PRESENTED_AS_CURRENT");
const forged={...claim};reject("forged",v.validatePublication([f],{...cand("Parcela"),claims:[forged]}),"CLAIM_NOT_REGISTERED");
const disc=fact("d","FINANCING_AVERAGE_MONTHLY_RATE",1.2,"PERCENT_PER_MONTH",{requiredDisclosures:["AVERAGE_REFERENCE_NOT_USER_RATE"]}),dc=cr.buildFactValueClaim(disc);
const baseD={publicationId:"d",surface:"CARD",claims:[dc],realizations:[{claimId:dc.claimId,factId:"d",text:"Taxa média de referência",renderedValue:"1.2",unit:"PERCENT_PER_MONTH",label:"Taxa média de referência"}],disclosureBindings:[]};
reject("missing disclosure",v.validatePublication([disc],baseD),"DISCLOSURE_BINDING_MISSING");
if(!v.validatePublication([disc],{...baseD,disclosureBindings:[{disclosureId:"AVERAGE_REFERENCE_NOT_USER_RATE",scope:"FACT",coversFactIds:["d"],coversClaimIds:[]}]}).ok)throw Error("valid disclosure rejected");
const a=fact("a","FINANCING_PROJECTED_OUTLAY",100),b=fact("b","FINANCING_PROJECTED_OUTLAY",120),cc=cr.buildComparisonClaim(a,b);
const comp={publicationId:"cmp",surface:"COMPARISON",claims:[cc],realizations:[{claimId:cc.claimId,factId:"a",text:"Valor menor",renderedValue:"100",unit:"BRL"},{claimId:cc.claimId,factId:"b",text:"Valor maior",renderedValue:"120",unit:"BRL"}],disclosureBindings:[]};if(!v.validatePublication([a,b],comp).ok)throw Error("authorized exact comparison rejected");
const badCmp={...comp,claims:[{...cc,comparison:{...cc.comparison,exactLeftValue:999}}]};reject("mutated comparison",v.validatePublication([a,b],badCmp),"CLAIM_NOT_REGISTERED");
const di=fact("di","ACCUMULATION_GROSS_DI_REFERENCE_PROJECTION",120);let blocked=false;try{cr.buildComparisonClaim(di,a)}catch(e){blocked=String(e).includes("COMPARISON_NOT_AUTHORIZED")}if(!blocked)throw Error("cross-semantic comparison authorized");
const consortium=fact("co","CONSORTIUM_BASE_SIMULATED_TOTAL",90,"BRL",{state:{completeness:"PARTIAL"}});blocked=false;try{cr.buildComparisonClaim(consortium,a)}catch(e){blocked=String(e).includes("COMPARISON_NOT_AUTHORIZED")}if(!blocked)throw Error("partial consortium comparison authorized");
const good=v.validatePublication([f],cand("Parcela matemática"));if(!good.ok)throw Error("atomic setup");let threw=false;try{good.publication.payload.realizations[0].text="mutated"}catch(e){threw=true}if(good.publication.payload.realizations[0].text==="mutated")throw Error("authorized payload mutable");
console.log("output-validator-v2 adversarial tests passed");
