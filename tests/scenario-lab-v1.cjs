const fs=require("fs"),path=require("path"),ts=require("typescript"),Module=require("module");
const cache=new Map();function load(file){file=path.resolve(file);if(cache.has(file))return cache.get(file);let src=fs.readFileSync(file,"utf8"),js=ts.transpileModule(src,{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText,m=new Module(file,module);cache.set(file,m.exports);m.filename=file;m.paths=module.paths;m.require=function(id){if(id.startsWith(".")){let p=path.resolve(path.dirname(file),id);if(!path.extname(p))p+=".ts";if(fs.existsSync(p))return load(p)}return Module.prototype.require.call(m,id)};m._compile(js,file);cache.set(file,m.exports);return m.exports}
const s=load(path.join(__dirname,"../lib/engine/scenario-lab-v1.ts"));
const fin={kind:"VEHICLE_FINANCING_AVERAGE_RATE",value:1.9,unit:"PERCENT_PER_MONTH",lineage:{source:"BCB",referenceId:"SGS25471",referencePeriod:"2026-08",retrievedAt:"2026-09-20T00:00:00Z",methodology:"official"}};
const base={scenarioId:"base",baselineProjectId:"p1",createdOrder:0,route:"FINANCING",vehicleReferenceValue:100000,allocatedDownPayment:20000,productTermMonths:48,rateReference:fin,referenceFreshness:"CURRENT"};
const snapshot=JSON.stringify(base),b=s.createBaseline(base);if(!b.publication||b.status!=="AUTHORIZED")throw Error("01 baseline not authorized");
const x=s.createUserScenario(base,{scenarioId:"s1",createdOrder:1,allocatedDownPayment:30000});if(JSON.stringify(base)!==snapshot)throw Error("02 baseline mutated");
if(JSON.stringify(x.changedFields)!==JSON.stringify(["allocatedDownPayment"]))throw Error("03 changedFields not exact explicit edit");
let blocked=false;try{s.createBaseline({...base,createdOrder:1})}catch(e){blocked=String(e).includes("BASELINE_ORDER_MUST_BE_ZERO")}if(!blocked)throw Error("04 invalid baseline order accepted");
const y=s.createUserScenario(base,{scenarioId:"s2",createdOrder:2,productTermMonths:60});if(s.canCompareFinancingScenarios(x,y))throw Error("05 unequal terms comparable");
const z=s.createUserScenario(base,{scenarioId:"s3",createdOrder:3,allocatedDownPayment:10000});if(!s.canCompareFinancingScenarios(x,z))throw Error("06 equal terms blocked");
const ordered=s.orderScenarios([z,b,x]);if(ordered.map(q=>q.scenarioId).join(",")!=="base,s1,s3")throw Error("07 creation order not preserved");
const fail=s.createUserScenario(base,{scenarioId:"fail",createdOrder:4,productTermMonths:0});if(fail.status!=="UNAVAILABLE"||fail.publication!==undefined)throw Error("08 unavailable has numeric publication");
const ch=s.buildChoiceState();if(ch.primaryAction!==undefined)throw Error("09 default action preselected");
const contact=s.buildChoiceState("CONTACT");if(contact.primaryAction!=="CONTACT_CONSULTANT")throw Error("10 explicit contact intent not honored");
if(ch.actions[0]!=="ADJUST_PLAN"||ch.actions[ch.actions.length-1]!=="CONTACT_CONSULTANT")throw Error("11 neutral CTA order changed");
console.log("MWC-016 Scenario Lab runtime adversarial tests passed (11)");
