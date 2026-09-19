const fs=require('node:fs');
const ts=require('typescript');
require.extensions['.ts']=(module,filename)=>module._compile(ts.transpileModule(fs.readFileSync(filename,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022,esModuleInterop:true}}).outputText,filename);
const assert=require('node:assert/strict');
const {parseBcbVehicleFinancingPayload,fetchLatestBcbVehicleFinancingReference,BCB_SGS_LATEST_URL}=require('../lib/reference-data/bcb/sgs25471.ts');
const {MemoryLastKnownGoodStore}=require('../lib/reference-data/store.ts');

const at='2026-09-19T16:13:00.000Z';
const good=[{data:'01/08/2026',valor:'1.99'}];
const parsed=parseBcbVehicleFinancingPayload(good,at);
assert.equal(parsed.ok,true);
assert.equal(parsed.value.value,1.99);
assert.equal(parsed.value.unit,'PERCENT_PER_MONTH');
assert.equal(parsed.value.lineage.source,'BCB');
assert.equal(parsed.value.lineage.referenceId,'SGS-25471');
assert.equal(parsed.value.lineage.referencePeriod,'2026-08');
assert.equal(parsed.value.lineage.retrievedAt,at);

for(const payload of [
  null, {}, [], good.concat(good),
  [{data:'01/08/2026'}],
  [{data:'01/08/2026',valor:'x'}],
  [{data:'31/02/2026',valor:'1.99'}],
  [{data:'01/08/2026',valor:'-1'}],
  [{data:'01/08/2026',valor:'1.99',extra:'x'}],
]) assert.equal(parseBcbVehicleFinancingPayload(payload,at).ok,false,JSON.stringify(payload));

(async()=>{
  let requested='';
  const fakeFetch=async(url)=>{requested=String(url);return {ok:true,json:async()=>good}};
  const fetched=await fetchLatestBcbVehicleFinancingReference(fakeFetch,()=>new Date(at));
  assert.equal(fetched.ok,true);
  assert.equal(requested,BCB_SGS_LATEST_URL);

  const fail=await fetchLatestBcbVehicleFinancingReference(async()=>({ok:false}),()=>new Date(at));
  assert.deepEqual(fail,{ok:false,error:'FETCH_FAILED'});

  const store=new MemoryLastKnownGoodStore();
  assert.equal(await store.read(),null);
  await store.replaceIfValid(parsed.value);
  assert.deepEqual(await store.read(),parsed.value);
  console.log('BCB SGS 25471 collector: parser, fetch isolation and LKG interface passed.');
})().catch(e=>{console.error(e);process.exit(1)});
