const fs=require("fs"),path=require("path"),ts=require("typescript"),Module=require("module");
const cache=new Map();function load(file){file=path.resolve(file);if(cache.has(file))return cache.get(file);let src=fs.readFileSync(file,"utf8"),js=ts.transpileModule(src,{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText,m=new Module(file,module);cache.set(file,m.exports);m.filename=file;m.paths=module.paths;m.require=function(id){if(id.startsWith(".")){let p=path.resolve(path.dirname(file),id);if(!path.extname(p))p+=".ts";if(fs.existsSync(p))return load(p)}return Module.prototype.require.call(m,id)};m._compile(js,file);cache.set(file,m.exports);return m.exports}
const p=load(path.join(__dirname,"../lib/engine/paths-v1.ts"));
let blocked=false;try{p.buildPathsView({authority:{origin:"CHOICE_UNDERSTAND_PATHS"}})}catch(e){blocked=String(e).includes("PATHS_ENTRY_NOT_AUTHORIZED")}if(!blocked)throw Error("01 forged authority accepted");
const auth=p.authorizePathsEntry("CHOICE_UNDERSTAND_PATHS");const v=p.buildPathsView({authority:auth});
if(v.cards.map(x=>x.pathId).join(",")!=="ACCUMULATION,FINANCING,CONSORTIUM")throw Error("02 taxonomy order changed");
if(v.focusedPath!==null||v.cards.some(x=>x.expanded))throw Error("03 default focus/expansion");
if(v.cards.some(x=>x.action!=="INSPECT_OR_SIMULATE"))throw Error("04 asymmetric action");
if(v.cards.map(x=>Object.keys(x).sort().join(",")).some((x,_,a)=>x!==a[0]))throw Error("05 asymmetric card slots");
let named=false;try{p.authorizePathsEntry("EXPLICIT_NAMED_PATH_REQUEST")}catch(e){named=String(e).includes("NAMED_PATH_REQUIRED")}if(!named)throw Error("06 unnamed explicit path accepted");
const fin={kind:"VEHICLE_FINANCING_AVERAGE_RATE",value:1.9,unit:"PERCENT_PER_MONTH",lineage:{source:"BCB",referenceId:"SGS25471",referencePeriod:"2026-08",retrievedAt:"2026-09-20T00:00:00Z",methodology:"official"}};
const fv=p.buildPathsView({authority:auth,financing:{vehicleReferenceValue:{value:100000,provenance:"USER_ENTERED"},rateReference:{value:fin,provenance:"SYSTEM_REFERENCE"}}});
if(fv.cards[1].publicationStatus!=="INPUT_REQUIRED")throw Error("07 financing inferred missing inputs");
if(fv.cards[0].pathId!=="ACCUMULATION"||fv.cards[2].pathId!=="CONSORTIUM")throw Error("08 unavailable/input-required reordered paths");
const av=p.buildPathsView({authority:auth,accumulation:{currentResources:{value:10000,provenance:"USER_ENTERED"},monthlyContribution:{value:1000,provenance:"USER_ENTERED"},projectHorizonMonths:{value:12,provenance:"USER_ENTERED"}}});
if(av.cards[0].publicationStatus!=="AUTHORIZED")throw Error("09 no-yield accumulation blocked");
if(av.cards[1].publicationStatus!=="INPUT_REQUIRED"||av.cards[2].publicationStatus!=="INPUT_REQUIRED")throw Error("10 failure isolation broken");
console.log("MWC-017 Paths V1 adversarial tests passed (10 structural/runtime cases; remaining semantic cases covered by underlying publication validators)");
