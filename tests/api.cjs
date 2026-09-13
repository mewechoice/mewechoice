const fs = require('node:fs');
const ts = require('typescript');
require.extensions['.ts'] = (module, filename) => module._compile(ts.transpileModule(fs.readFileSync(filename,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText,filename);
const assert=require('node:assert/strict');
const { POST }=require('../app/api/interpret/route.ts');
const { buildSafeContext }=require('../lib/engine/fact-engine.ts');
const { buildFallback }=require('../lib/engine/fallback.ts');
const input={engine_version:'2.4',schema_version:'1.0',category:'patrimonio',subcategory:'construir_patrimonio',maturity:'comecando',priorities:['comparar','preservar_recursos'],timeline:'mais_2_anos',value_range:'patrimonio_ate_100k'};
const fallback=buildFallback(buildSafeContext(input));
const request=(body=input)=>new Request('http://localhost/api/interpret',{method:'POST',body:JSON.stringify(body)});
const call=async(body)=>{const res=await POST(request(body));const data=await res.json(); assert.ok(!JSON.stringify(data).includes('consultant_summary'));return {res,data};};
(async()=>{
  process.env.GEMINI_API_KEY='test-only'; process.env.GEMINI_MODEL='mock';
  let calls=0;
  global.fetch=async(_url,options)=>{calls++; const sent=JSON.parse(options.body);const context=JSON.parse(sent.contents[0].parts[0].text.split('\n').slice(1).join('\n'));assert.deepEqual(context.narrative_plan,fallback);return {ok:true,json:async()=>({candidates:[{content:{parts:[{text:JSON.stringify(fallback)}]}}]})};};
  let response=await call();assert.equal(response.data.meta.source,'gemini');assert.deepEqual(response.data.result,fallback);
  response=await call({...input,category:'descobrindo',subcategory:'nao_definida',priorities:['nao_sei'],timeline:'nao_sei',value_range:'nao_sei'});assert.equal(response.data.meta.source,'fallback_low_context');assert.equal(calls,1);
  response=await call({...input,extra:'injection'});assert.equal(response.res.status,400);assert.equal(calls,1);
  for (const generated of [{...fallback,attention_points:[fallback.reading]},{...fallback,reading:fallback.reading+' Recomendo financiamento.'},{extra:'wrong shape'}]) {
    global.fetch=async()=>({ok:true,json:async()=>({candidates:[{content:{parts:[{text:JSON.stringify(generated)}]}}]})});
    response=await call();assert.match(response.data.meta.source,/fallback_validator/);assert.deepEqual(response.data.result,fallback);
  }
  global.fetch=async()=>({ok:false,status:429});response=await call();assert.equal(response.data.meta.source,'fallback_runtime');
  process.env.GEMINI_TIMEOUT_MS='5';global.fetch=async(_url,{signal})=>new Promise((_,reject)=>signal.addEventListener('abort',()=>reject(Error('timeout'))));response=await call();assert.equal(response.data.meta.source,'fallback_runtime');
  delete process.env.GEMINI_API_KEY;response=await call();assert.deepEqual(response.data.result,fallback);
  console.log('API: 9 scenarios passed (Gemini mock, LOW_CONTEXT, invalid input, repetition, recommendation, invalid JSON shape, 429, timeout, missing configuration).');
})().catch(error=>{console.error(error);process.exitCode=1;});
