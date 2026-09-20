"use client";

import { useMemo, useState } from "react";
import { calculateVehicleProject } from "../../lib/project/vehicle/engine";

type Horizon = "IMMEDIATE" | "12" | "24" | "36" | "48" | "60" | "OTHER";

const money = new Intl.NumberFormat("pt-BR",{style:"currency",currency:"BRL"});

function parseMoney(value:string){const n=Number(value.replace(/\./g,"").replace(",",".").replace(/[^0-9.-]/g,""));return Number.isFinite(n)&&n>=0?n:null;}

export default function MeuProjetoVeiculo(){
 const [target,setTarget]=useState(""); const [resources,setResources]=useState(""); const [monthly,setMonthly]=useState("");
 const [horizon,setHorizon]=useState<Horizon>("36"); const [other,setOther]=useState("");
 const result=useMemo(()=>{const t=parseMoney(target),r=parseMoney(resources),m=parseMoney(monthly);if(t===null||r===null||m===null)return null;const h=horizon==="IMMEDIATE"?{mode:"IMMEDIATE" as const}:{mode:"MONTHS" as const,months:horizon==="OTHER"?Number(other):Number(horizon)};try{return calculateVehicleProject({targetValue:t,currentResources:r,monthlyAmount:m,horizon:h});}catch{return null;}},[target,resources,monthly,horizon,other]);
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
  </section>
 </main>;
}
