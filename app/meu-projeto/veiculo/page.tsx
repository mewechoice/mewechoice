"use client";

import { useMemo, useState } from "react";
import { calculateVehicleProject } from "../../../lib/project/vehicle/engine";
import { buildProjectEngineReading } from "../../../lib/project/engine";
import { buildScenarioLab } from "../../../lib/project/scenario-lab";
import { buildChoiceState, authorizePathsFromProjectChoice } from "../../../lib/project/choice";
import { emitChoicePathsIntent } from "../../../lib/engine/choice-paths-boundary";
import { buildPathsView, type PathsViewModel } from "../../../lib/engine/paths-v1";

type Horizon = "IMMEDIATE" | "12" | "24" | "36" | "48" | "60" | "OTHER";

const money = new Intl.NumberFormat("pt-BR",{style:"currency",currency:"BRL"});

function parseMoney(value:string){
 const raw=value.trim().replace(/R\\$/gi,"").replace(/\\s/g,"");
 if(!raw)return null;
 let normalized=raw;
 if(raw.includes(",")){
  if((raw.match(/,/g)||[]).length!==1)return null;
  normalized=raw.replace(/\\./g,"").replace(",",".");
 }else if(raw.includes(".")){
  const parts=raw.split(".");
  if(parts.length===2&&parts[1].length<=2) normalized=raw;
  else if(parts.slice(1).every(part=>part.length===3)) normalized=parts.join("");
  else return null;
 }
 if(!/^\\d+(?:\\.\\d{1,2})?$/.test(normalized))return null;
 const n=Number(normalized);
 return Number.isFinite(n)&&n>=0?n:null;
}

export default function MeuProjetoVeiculo(){
 const [target,setTarget]=useState(""); const [resources,setResources]=useState(""); const [monthly,setMonthly]=useState("");
 const [horizon,setHorizon]=useState<Horizon>("36"); const [other,setOther]=useState("");
 const [paths,setPaths]=useState<PathsViewModel|null>(null);
 const [focusedPath,setFocusedPath]=useState<"ACCUMULATION"|"FINANCING"|"CONSORTIUM"|null>(null);
 const [financingDownPayment,setFinancingDownPayment]=useState(""); const [financingTerm,setFinancingTerm]=useState(""); const [consortiumTerm,setConsortiumTerm]=useState("");
 const result=useMemo(()=>{const t=parseMoney(target),r=parseMoney(resources),m=parseMoney(monthly);if(t===null||r===null||m===null)return null;const h=horizon==="IMMEDIATE"?{mode:"IMMEDIATE" as const}:{mode:"MONTHS" as const,months:horizon==="OTHER"?Number(other):Number(horizon)};try{return calculateVehicleProject({targetValue:t,currentResources:r,monthlyAmount:m,horizon:h});}catch{return null;}},[target,resources,monthly,horizon,other]);
 const choice=useMemo(()=>{if(!result)return null;try{return buildChoiceState(buildScenarioLab(buildProjectEngineReading(result)));}catch{return null;}},[result]);
 function requestPaths(){if(!choice||!result)return;try{const authorized=authorizePathsFromProjectChoice(choice);const intent=emitChoicePathsIntent(authorized);setFocusedPath(null);setPaths(buildPathsView({intent,accumulation:result.horizon.mode==="MONTHS"?{currentResources:result.currentResources,monthlyContribution:result.monthlyAmount,projectHorizonMonths:result.horizon.months}:undefined}));}catch{setPaths(null);}}
 return <main className="project-page">
  <header className="project-header shell"><a href="/" className="project-brand">ME <b>→</b> WE <b>→</b> CHOICE</a><nav><a href="/">Início</a><a href="/descobrir">Explore</a></nav></header>
  <section className="project-hero shell"><p className="eyebrow">MEU PROJETO • VEÍCULO</p><h1>Comece pelo seu projeto.<br/>Os caminhos vêm depois.</h1><p>Organize quatro informações do seu objetivo. Esta leitura não escolhe produto, parceiro ou forma de aquisição.</p></section>
  <section className="project-workspace shell">
   <form className="project-form" onSubmit={e=>e.preventDefault()}>
    <div className="project-field"><label htmlFor="target">Valor aproximado do veículo</label><span>Uma referência atual. Não projetamos o preço futuro.</span><input id="target" inputMode="decimal" placeholder="Ex.: 80.000" value={target} onChange={e=>setTarget(e.target.value)}/></div>
    <div className="project-field"><label htmlFor="resources">Recursos que você tem hoje</label><span>Pode ser zero ou maior que o valor do veículo.</span><input id="resources" inputMode="decimal" placeholder="Ex.: 20.000" value={resources} onChange={e=>setResources(e.target.value)}/></div>
    <div className="project-field"><label htmlFor="monthly">Quanto pretende separar por mês?</label><span>Use um valor que represente o seu planejamento atual.</span><input id="monthly" inputMode="decimal" placeholder="Ex.: 1.500" value={monthly} onChange={e=>setMonthly(e.target.value)}/></div>
    <fieldset className="project-field project-horizon"><legend>Prazo desejado para o projeto</legend><span>Prazo do projeto não é prazo de produto.</span><div>{([["IMMEDIATE","O quanto antes"],["12","12 meses"],["24","24 meses"],["36","36 meses"],["48","48 meses"],["60","60 meses"],["OTHER","Outro"]] as const).map(([v,l])=><button key={v} type="button" className={horizon===v?"selected":""} onClick={()=>setHorizon(v)}>{l}</button>)}</div>{horizon==="OTHER"&&<input aria-label="Prazo em meses" inputMode="numeric" placeholder="Meses" value={other} onChange={e=>setOther(e.target.value)}/>}</fieldset>
   </form>
   <aside className="project-reading" aria-live="polite"><p className="eyebrow">LEITURA DO PROJETO</p>{result?<><h2>Seu ponto de partida</h2><dl><div><dt>Objetivo informado</dt><dd>{money.format(result.targetValue??0)}</dd></div><div><dt>Recursos atuais</dt><dd>{money.format(result.currentResources)}</dd></div>{result.horizon.mode==="MONTHS"&&<div><dt>Recursos projetados no prazo</dt><dd>{money.format(result.projectedResources)}</dd></div>}<div><dt>Diferença de referência</dt><dd>{result.referenceDifference===null?"—":money.format(result.referenceDifference)}</dd></div></dl><p className="project-reading-note">{result.horizon.mode==="IMMEDIATE"?"“O quanto antes” mostra somente sua posição atual. Não tratamos esse prazo como zero meses.":"Projeção linear: sem rendimento, inflação, taxas ou custos. Aportes constantes no período."}</p><p className="project-neutral">Isto organiza o projeto. Nenhum caminho ou produto foi selecionado.</p></>:<><h2>Preencha seu ponto de partida.</h2><p>Quando as quatro informações estiverem válidas, a leitura matemática aparece aqui — antes de qualquer dado de contato.</p></>}</aside>
  </section>{choice&&<section className="project-choice shell" aria-label="Choice"><p className="eyebrow">CHOICE</p><h2>{choice.message}</h2><p>Até aqui, organizamos somente o seu projeto. Se quiser avançar, você decide como continuar.</p><div className="project-choice-actions"><button type="button" onClick={requestPaths}>{choice.actions[0]}</button><button type="button">{choice.actions[1]}</button></div><p className="project-neutral">Nenhum caminho, produto ou parceiro foi escolhido por você ou pela MWC.</p></section>}{paths&&<section className="project-paths shell" aria-label="Caminhos possíveis"><p className="eyebrow">CAMINHOS</p><h2>Entenda as diferenças antes de escolher.</h2><p className="project-paths-intro">Os caminhos aparecem na mesma ordem, sem ranking e sem seleção automática.</p><div className="project-path-grid">{paths.cards.map(card=><article key={card.pathId} className={`project-path-card ${focusedPath===card.pathId?"is-focused":""}`}><span>{card.pathId}</span><h3>{card.title}</h3><p>{card.explanation}</p><small>{card.publicationStatus==="AUTHORIZED"?"Leitura disponível":"Mais informações são necessárias para simular este caminho."}</small><button type="button" aria-expanded={focusedPath===card.pathId} onClick={()=>setFocusedPath(focusedPath===card.pathId?null:card.pathId)}>Entender este caminho →</button>{focusedPath===card.pathId&&<div className="project-path-detail"><strong>{card.title}</strong>{card.pathId==="ACCUMULATION"?<p>Este caminho usa somente os dados do seu projeto. A leitura disponível não presume rendimento.</p>:card.pathId==="FINANCING"?<p>Para simular financiamento, ainda precisamos de duas escolhas suas: quanto dos recursos atuais você quer destinar à entrada e qual prazo do produto deseja testar. A taxa de referência oficial é uma etapa separada e não representa proposta ou CET.</p>:<p>Para simular consórcio, ainda precisamos que você informe qual prazo do produto deseja testar. A referência de taxa de administração é estatística e não representa oferta ou contrato.</p>}{card.pathId==="FINANCING"&&<div className="project-path-inputs"><label>Quanto dos seus recursos deseja destinar à entrada?<input inputMode="decimal" placeholder="Ex.: 20.000" value={financingDownPayment} onChange={e=>setFinancingDownPayment(e.target.value)}/></label><label>Qual prazo do produto deseja testar?<input inputMode="numeric" placeholder="Ex.: 48 meses" value={financingTerm} onChange={e=>setFinancingTerm(e.target.value)}/></label><small>Esses valores são informados por você. A taxa média oficial será tratada separadamente e não é uma proposta ou CET.</small></div>}{card.pathId==="CONSORTIUM"&&<div className="project-path-inputs"><label>Qual prazo do produto deseja testar?<input inputMode="numeric" placeholder="Ex.: 60 meses" value={consortiumTerm} onChange={e=>setConsortiumTerm(e.target.value)}/></label><small>O prazo é uma escolha sua. A referência estatística de taxa de administração será tratada separadamente e não é oferta ou condição contratual.</small></div>}<p className="project-neutral">Abrir este caminho não significa escolhê-lo.</p></div>}</article>)}</div><p className="project-paths-note">Nenhum caminho foi selecionado. Você decide se quer aprofundar algum deles.</p></section>}
 </main>;
}
