const fs=require("node:fs"),assert=require("node:assert/strict"),ts=require("typescript");
require.extensions[".ts"]=(m,f)=>m._compile(ts.transpileModule(fs.readFileSync(f,"utf8"),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText,f);
const {deriveArtifactPublishability,assertValidEditorialArtifact}=require("../lib/editorial/artifacts.ts");
const {derivePublishability}=require("../lib/editorial/governance.ts");
const {TOPIC_001,TOPIC_001_PUBLISHABILITY}=require("../lib/editorial/knowledge-units.ts");
const {EDITORIAL_ARTICLES}=require("../lib/editorial/registry.ts");
const F=require("../lib/editorial/synthetic-fixtures.ts");

assert.equal(derivePublishability(F.SYNTHETIC_KNOWLEDGE).publishable,false,"TEST-01 synthetic existence must not publish knowledge");
assert.equal(deriveArtifactPublishability(F.SYNTHETIC_EXPLORE_ARTICLE,F.SYNTHETIC_KNOWLEDGE).publishable,false,"TEST-03 non-publishable knowledge blocks artifact");
const before=JSON.stringify(F.SYNTHETIC_KNOWLEDGE);
for(const a of [F.SYNTHETIC_EXPLORE_ARTICLE,F.SYNTHETIC_INSTAGRAM_YAP,F.SYNTHETIC_YOUTUBE]) deriveArtifactPublishability(a,F.SYNTHETIC_KNOWLEDGE);
assert.equal(JSON.stringify(F.SYNTHETIC_KNOWLEDGE),before,"TEST-02/07 artifacts cannot upgrade knowledge");

assert.ok(F.SYNTHETIC_EXPLORE_ARTICLE.provenanceRefs.some(x=>x.stage==="OWNER_DRAFT"),"TEST-04 Owner draft provenance");
assert.equal(F.SYNTHETIC_INSTAGRAM_YAP.knowledgeUnitId,F.SYNTHETIC_EXPLORE_ARTICLE.knowledgeUnitId,"TEST-05 Yap same KU");
assert.equal(F.SYNTHETIC_YOUTUBE.knowledgeUnitId,F.SYNTHETIC_EXPLORE_ARTICLE.knowledgeUnitId,"TEST-06 YouTube same KU");

for(const a of EDITORIAL_ARTICLES) assert.equal(a.governance.legacyReviewStatus,"LEGACY_EDITORIAL_REVIEW_REQUIRED","TEST-08 legacy remains review-required");
assert.equal(TOPIC_001_PUBLISHABILITY.publishable,false,"TEST-09 TOPIC-001 blocked");
assert.equal(TOPIC_001.draftExists,false,"TEST-09 no TOPIC-001 draft");
assert.equal(TOPIC_001.governance.evidenceRefs.length,0,"TEST-09 no real evidence");

const inspectedPublishingArtifacts=[
 "lib/editorial/artifacts.ts","lib/editorial/synthetic-fixtures.ts",
 "components/editorial/ExploreArticlePresentation.tsx","docs/MWC-EXP-003-EDITORIAL-FOUNDATION.md"
];
const publishingSource=inspectedPublishingArtifacts.filter(fs.existsSync).map(f=>fs.readFileSync(f,"utf8")).join("\n").toLowerCase();
const assertForbiddenAbsent=(source,terms,label)=>{
 for(const forbidden of terms) assert.equal(source.includes(forbidden),false,label+": "+forbidden);
};
const advertisingTerms=["adsby"+"google","google"+"syndication","google_ad_"+"client","ca-"+"pub-"];
const analyticsTerms=["gtag"+"(","google"+"tagmanager","google-"+"analytics.com","analytics"+".js"];
const cmpTerms=["__tcf"+"api(","consent"+"manager.net","cookie"+"bot.com","one"+"trust"];
assertForbiddenAbsent(publishingSource,advertisingTerms,"TEST-10/11 advertising implementation forbidden");
assertForbiddenAbsent(publishingSource,analyticsTerms,"TEST-13 analytics implementation forbidden");
assertForbiddenAbsent(publishingSource,cmpTerms,"TEST-14 CMP implementation forbidden");
assert.throws(()=>assertForbiddenAbsent("synthetic "+advertisingTerms[0]+" violation",advertisingTerms,"NEGATIVE-CONTROL"),/NEGATIVE-CONTROL/,"detector must reject a deliberately violating artifact");

const presentation=fs.readFileSync("components/editorial/ExploreArticlePresentation.tsx","utf8");
assert.ok(presentation.includes("content.opening")&&presentation.includes("content.takeaway"),"TEST-12 article content renders independently of advertising");

for(const file of ["lib/project/engine.ts","lib/project/scenario-lab.ts","lib/project/choice.ts","lib/engine/paths-v1.ts"]) assert.ok(fs.existsSync(file),"TEST-15 preserved engine missing: "+file);

const approval=(ref="synthetic:approval")=>({...F.SYNTHETIC_EXPLORE_ARTICLE,editorialStatus:"PUBLICATION_APPROVED",technicalReviewReference:"synthetic:review",provenanceRefs:[...F.SYNTHETIC_EXPLORE_ARTICLE.provenanceRefs,{stage:"PUBLICATION_APPROVAL",ref}]});
const fakeApproved=approval();
assertValidEditorialArtifact(fakeApproved);
assert.equal(deriveArtifactPublishability(fakeApproved,F.SYNTHETIC_KNOWLEDGE).publishable,false,"knowledge gate remains authoritative even after editorial approval");
assert.throws(()=>assertValidEditorialArtifact(approval("")),/PUBLICATION_APPROVAL_REFERENCE_REQUIRED/,"empty approval reference must fail closed");
assert.throws(()=>assertValidEditorialArtifact(approval("   ")),/PUBLICATION_APPROVAL_REFERENCE_REQUIRED/,"whitespace-only approval reference must fail closed");
const missingApproval={...F.SYNTHETIC_EXPLORE_ARTICLE,editorialStatus:"PUBLICATION_APPROVED",technicalReviewReference:"synthetic:review"};
assert.throws(()=>assertValidEditorialArtifact(missingApproval),/PUBLICATION_APPROVAL_REFERENCE_REQUIRED/,"missing approval reference must fail closed");
assert.throws(()=>assertValidEditorialArtifact({...fakeApproved,technicalReviewReference:"   "}),/TECHNICAL_REVIEW_REFERENCE_REQUIRED/,"blank technical review reference must fail closed");

console.log("editorial-publishing-v1: PASS");
