const fs=require('node:fs');
const ts=require('typescript');
require.extensions['.ts']=(module,filename)=>module._compile(ts.transpileModule(fs.readFileSync(filename,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022,esModuleInterop:true}}).outputText,filename);
const assert=require('node:assert/strict');
const mod=require('../lib/reference-data/bcb/sgs25471.ts');
const {parseBcbVehicleFinancingPayload,fetchLatestBcbVehicleFinancingReference,refreshBcbVehicleFinancingReference,BCB_SGS_LATEST_URL}=mod;
const {MemoryLastKnownGoodStore}=require('../lib/reference-data/store.ts');

const at='2026-09-19T16:13:00.000Z';
const oldAt='2026-08-19T16:13:00.000Z';
const good=[{data:'01/08/2026',valor:'1.99'}];
const old=parseBcbVehicleFinancingPayload([{data:'01/07/2026',valor:'1.80'}],oldAt).value;
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
  await store.replace(old);

  const fetchFailure=await refreshBcbVehicleFinancingReference(store,async()=>({ok:false}),()=>new Date(at));
  assert.deepEqual(fetchFailure,{ok:false,status:'PRESERVED',error:'FETCH_FAILED'});
  assert.deepEqual(await store.read(),old);

  const invalidPayload=await refreshBcbVehicleFinancingReference(store,async()=>({ok:true,json:async()=>[{data:'31/02/2026',valor:'1.99'}]}),()=>new Date(at));
  assert.deepEqual(invalidPayload,{ok:false,status:'PRESERVED',error:'INVALID_PAYLOAD'});
  assert.deepEqual(await store.read(),old);

  const invalidReference=await refreshBcbVehicleFinancingReference(store,async()=>({ok:true,json:async()=>good}),()=>new Date('invalid'));
  assert.deepEqual(invalidReference,{ok:false,status:'PRESERVED',error:'INVALID_REFERENCE'});
  assert.deepEqual(await store.read(),old);

  const updated=await refreshBcbVehicleFinancingReference(store,fakeFetch,()=>new Date(at));
  assert.equal(updated.ok,true);
  assert.equal(updated.status,'UPDATED');
  assert.deepEqual(await store.read(),parsed.value);

  console.log('BCB SGS 25471 collector: acquisition failures preserve LKG; validated acquisition replaces it.');
})().catch(e=>{console.error(e);process.exit(1)});
