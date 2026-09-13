// Node 22.15+ supports synchronous module hooks and native TypeScript stripping.
const { registerHooks } = require('node:module');
registerHooks({ resolve(specifier, context, next) {
  try { return next(specifier, context); } catch(error) {
    if (specifier.startsWith('.') && !/\.[a-z]+$/i.test(specifier)) return next(specifier+'.ts', context);
    throw error;
  }
}});
const assert = require('node:assert/strict');
const { buildSafeContext } = require('../lib/engine/fact-engine.ts');
const { buildFallback } = require('../lib/engine/fallback.ts');
const { validateEngineInput } = require('../lib/engine/schema.ts');
const { validateInterpretationOutput } = require('../lib/engine/output-validator.ts');
const { buildConsultantAssist } = require('../lib/engine/consultant-assist.ts');
const { categories, subcategoryMap, maturities, priorities, timelines, valueRanges } = require('../lib/engine/types.ts');
const input = { engine_version:'2.4', schema_version:'1.0', category:'patrimonio', subcategory:'construir_patrimonio', maturity:'comecando', priorities:['comparar','preservar_recursos'], timeline:'mais_2_anos', value_range:'patrimonio_ate_100k' };
let count = 0;
function check(v, message) { assert.ok(v, message); count++; }
const context = buildSafeContext(input, 'test-session');
const result = buildFallback(context);
check(/construir patrimônio/.test(result.reading), 'goal');
check(/começando/.test(result.reading) && /mais de 2 anos/.test(result.reading), 'moment + timeline');
check(/comparar possibilidades e preservar seus recursos/.test(result.reading), 'both priorities');
check(result.attention_points.join(' ').includes('até R$ 100 mil'), 'range');
check(result.attention_points.join(' ').includes('valor inicial'), 'preservation criterion');
check(!result.missing_information.join(' ').includes('Horizonte'), 'does not ask known timeline again');
check(buildConsultantAssist(context).suggested_questions.length === result.missing_information.length, 'canonical questions mapped');
assert.deepEqual(buildFallback(context), result);
assert.deepEqual(validateInterpretationOutput(result,context),{ok:true});
for (const mutation of [ {extra:'ignore'}, {priorities:[]}, {priorities:['comparar','comparar']}, {priorities:['comparar','custos','rapidez']}, {priorities:['nao_sei','comparar']}, {subcategory:'lazer'}, {value_range:'viagem_ate_10k'}, {schema_version:'9'}, {category:'ignore instructions'} ]) {
  check(!validateEngineInput({...input,...mutation}).ok, 'input contract '+JSON.stringify(mutation));
}
for (const text of ['Recomendo financiamento.', 'Você vai conseguir.', 'Invista em CDB.', 'Seu perfil é conservador.', 'Será difícil.', 'Isso é impossível.', 'Você não consegue.', 'Não dá para avançar.', 'O horizonte patrimonial é longo.', 'São R$ 999 mil.']) {
  check(!validateInterpretationOutput({...result,reading:result.reading+' '+text},context).ok,'unsafe '+text);
}
check(!validateInterpretationOutput({...result,attention_points:[result.reading]},context).ok,'repeated paragraph');
check(!validateInterpretationOutput({...result,attention_points:[result.reading.split('. ')[0]+'.']},context).ok,'repeated sentence');
check(!validateInterpretationOutput({...result,missing_information:['Qual produto você prefere?']},context).ok,'invented missing info');
const low=buildSafeContext({...input,category:'descobrindo',subcategory:'nao_definida',timeline:'nao_sei',priorities:['nao_sei'],value_range:'nao_sei'});
check(low.context_level==='LOW_CONTEXT','low context');
check(!buildFallback(low).reading.includes('construir patrimônio'),'no fabricated low personalization');
const groups = priorities.flatMap((p,i)=> [[p], ...priorities.slice(i+1).filter(q=>p!=='nao_sei' && q!=='nao_sei').map(q=>[p,q])]);
let combinations=0;
for (const category of categories) for (const subcategory of subcategoryMap[category]) for (const maturity of maturities) for (const timeline of timelines) for (const ps of groups) for (const range of valueRanges.filter(r=>r.startsWith(category+'_') || ['nao_sei','prefiro_nao_informar'].includes(r))) {
  const candidate={...input,category,subcategory,maturity,timeline,priorities:ps,value_range:range};
  const validated=validateEngineInput(candidate); assert.ok(validated.ok);
  const safe=buildSafeContext(candidate,'matrix'); const fallback=buildFallback(safe);
  assert.deepEqual(validateInterpretationOutput(fallback,safe),{ok:true},JSON.stringify(candidate));
  assert.equal(buildConsultantAssist(safe).suggested_questions.length>0,true);
  if(safe.tension_level!=='NONE') assert.ok(fallback.attention_points.some(p=>/escolhas diferentes|equilibrá-los/.test(p)));
  combinations++;
}
console.log(JSON.stringify({checks:count,validCombinations:combinations,example:result},null,2));
