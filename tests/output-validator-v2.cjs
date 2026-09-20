const fs=require("fs"),path=require("path"),ts=require("typescript"),Module=require("module");
function load(file){const src=fs.readFileSync(file,"utf8");const js=ts.transpileModule(src,{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2020}}).outputText;const m=new Module(file,module);m.filename=file;m.paths=module.paths;m._compile(js,file);return m.exports;}
const v=load(path.join(__dirname,"../lib/engine/output-validator-v2.ts"));
const base={id:"x",kind:"CALCULATED_FACT",semanticId:"FINANCING_MATHEMATICAL_PRICE_INSTALLMENT",value:{exactValue:2100.49,displayValue:"R$ 2.100,49",unit:"BRL"},provenance:{origin:"CALCULATED_FACT",sourceLineage:[],calculationLineage:[],parentFactIds:[]},state:{availability:"AVAILABLE",validation:"VALIDATED",freshness:"CURRENT",authorization:"AUTHORIZED",completeness:"COMPLETE"},missingComponents:[],comparisonPolicy:"COMPARABLE_WITH_CONTEXT",requiredDisclosures:[],methodology:[],createdAt:"2026-09-19T00:00:00Z"};
const claim={claimId:"c1",claimType:"FACT_CLAIM",semanticClaimId:"FACT_VALUE",subjectFactIds:["x"],requiredDisclosures:[]};
function c(text,value="R$ 2.100,49"){return {publicationId:"p",surface:"NARRATIVE",claims:[claim],realizations:[{claimId:"c1",factId:"x",text,renderedValue:value,unit:"BRL"}],disclosureBindings:[]};}
if(!v.validatePublication([base],c("Parcela matemática: R$ 2.100,49")).ok)throw Error("valid publication rejected");
if(v.validatePublication([base],c("Melhor opção: R$ 2.100,49")).ok)throw Error("recommendation accepted");
if(v.validatePublication([base],c("Parcela: R$ 2.101,00","R$ 2.101,00")).ok)throw Error("invented value accepted");
const partial={...base,state:{...base.state,completeness:"PARTIAL"}};
if(v.validatePublication([partial],c("Custo total: R$ 2.100,49")).ok)throw Error("partial presented as total");
const dated={...base,state:{...base.state,freshness:"DATED"}};
if(v.validatePublication([dated],c("Taxa atual: R$ 2.100,49")).ok)throw Error("dated presented current");
if(v.validatePublication([base],c("Valor menor: R$ 2.100,49")).ok)throw Error("unstructured comparison accepted");
console.log("output-validator-v2 tests passed");
