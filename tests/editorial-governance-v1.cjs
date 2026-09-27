const fs=require("node:fs"),assert=require("node:assert/strict"),ts=require("typescript");
require.extensions[".ts"]=(m,f)=>m._compile(ts.transpileModule(fs.readFileSync(f,"utf8"),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText,f);
const {derivePublishability,assertLifecycleConsistency,assertValidKnowledgeGovernance}=require("../lib/editorial/governance.ts");
const {EDITORIAL_ARTICLES,validateEditorialRegistry}=require("../lib/editorial/registry.ts");
const {TOPIC_001,TOPIC_001_PUBLISHABILITY,validateKnowledgeUnitRecord}=require("../lib/editorial/knowledge-units.ts");

const ev=(kind,ref)=>({kind,ref});
const base={
 knowledgeUnitId:"MWC-KU-TEST",lifecycleStatus:"LEARNING",learningStatus:"NOT_ESTABLISHED",
 teachBackRequired:true,teachBackStatus:"PENDING",technicalAuditStatus:"PENDING",
 sourceAuditRequired:false,sourceAuditStatus:"NOT_REQUIRED",regulatoryReviewRequired:false,
 regulatoryReviewStatus:"NOT_REQUIRED",retestStatus:"NOT_DUE",legacyReviewStatus:"NOT_LEGACY",evidenceRefs:[]
};
assert.equal(derivePublishability(base).publishable,false,"LEARNING cannot publish");

const learned={...base,learningStatus:"ESTABLISHED",evidenceRefs:[ev("LEARNING","test:learning")]};
assert.equal(derivePublishability(learned).publishable,false,"missing teach-back cannot publish");

const demonstrated={...learned,teachBackStatus:"PASS",evidenceRefs:[...learned.evidenceRefs,ev("TEACH_BACK","test:teachback")]};
assert.equal(derivePublishability(demonstrated).publishable,false,"missing technical audit cannot publish");

const audited={...demonstrated,technicalAuditStatus:"PASS",evidenceRefs:[...demonstrated.evidenceRefs,ev("TECHNICAL_AUDIT","test:audit")]};
assert.equal(derivePublishability(audited).publishable,true,"all required gates permit publishability");

const regulatory={...audited,regulatoryReviewRequired:true,regulatoryReviewStatus:"PENDING"};
assert.equal(derivePublishability(regulatory).publishable,false,"pending regulatory review must fail closed");

const fakePublishedLegacy={...base,knowledgeUnitId:"MWC-KU-LEGACY-TEST",legacyReviewStatus:"LEGACY_EDITORIAL_REVIEW_REQUIRED"};
assert.equal(derivePublishability(fakePublishedLegacy).publishable,false,"legacy publishedAt cannot grant validation");
assert.doesNotThrow(()=>assertLifecycleConsistency(fakePublishedLegacy,"2026-09-20"),"historical publishedAt is metadata only");
assert.throws(()=>assertValidKnowledgeGovernance({...fakePublishedLegacy,lifecycleStatus:"AUDITED"}),/LEGACY_CANNOT_INHERIT/);

assert.throws(()=>assertValidKnowledgeGovernance({...learned,evidenceRefs:[]}),/LEARNING_EVIDENCE_REQUIRED/,"invalid evidence state fails explicitly");
assert.throws(()=>assertLifecycleConsistency({...base,lifecycleStatus:"PUBLISHABLE"}),/FAIL_CLOSED_NOT_PUBLISHABLE/);

assert.equal(EDITORIAL_ARTICLES.length,4);
for(const article of EDITORIAL_ARTICLES){
 assert.equal(article.governance.legacyReviewStatus,"LEGACY_EDITORIAL_REVIEW_REQUIRED");
 assert.equal(article.governance.learningStatus,"NOT_ESTABLISHED");
 assert.equal(article.governance.technicalAuditStatus,"PENDING");
 assert.equal(derivePublishability(article.governance).publishable,false);
}
assert.equal(validateEditorialRegistry(),true);

validateKnowledgeUnitRecord(TOPIC_001);
assert.equal(TOPIC_001.draftExists,false);
assert.equal(TOPIC_001_PUBLISHABILITY.publishable,false);
assert.equal(TOPIC_001.governance.learningStatus,"NOT_ESTABLISHED");
assert.equal(TOPIC_001.governance.teachBackStatus,"PENDING");
assert.equal(TOPIC_001.governance.technicalAuditStatus,"PENDING");

for(const file of ["lib/project/engine.ts","lib/project/scenario-lab.ts","lib/project/choice.ts","lib/engine/paths-v1.ts"]){
 assert.ok(fs.existsSync(file),"preserved engine missing: "+file);
}
console.log("editorial-governance-v1: PASS");
