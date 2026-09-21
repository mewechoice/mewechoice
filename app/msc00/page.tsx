"use client";
import { useState } from "react";

type View={sessionId:string;state:string;unitIndex:number;resourceAcknowledged:boolean;contamination:string|null;currentUnit:null|{unitId:string;content:string};lockedCount:number};
export default function MSC00(){
 const [token,setToken]=useState(""); const [v,setV]=useState<View|null>(null); const [answer,setAnswer]=useState(""); const [msg,setMsg]=useState("");
 async function call(action:string,extra:any={}){
   const r=await fetch("/api/msc00",{method:"POST",headers:{"content-type":"application/json","x-msc00-token":token},body:JSON.stringify({action,sessionId:v?.sessionId,...extra}),cache:"no-store"});
   const j=await r.json(); if(!r.ok){setMsg(j.error||"ERRO");return;} setV(j);setMsg(action==="LOCK"?"RESPOSTA REGISTRADA":""); if(action==="NEXT")setAnswer("");
 }
 return <main style={{maxWidth:720,margin:"48px auto",padding:24,fontFamily:"system-ui"}}>
  <h1>MSC-00</h1><p>Ambiente sintético de verificação. Nenhum conteúdo real do baseline está carregado.</p>
  {!v&&<><label>Token de acesso<br/><input type="password" value={token} onChange={e=>setToken(e.target.value)} autoComplete="off"/></label><br/><button onClick={()=>call("START")}>Iniciar teste sintético</button></>}
  {v?.state==="BLOCK_READY"&&<section><h2>Declaração de recursos — teste sintético</h2><p>Este ambiente contém apenas marcadores sem conteúdo financeiro.</p><button onClick={()=>call("ACK_RESOURCES")}>Entendi as regras</button></section>}
  {v?.currentUnit&&<section><p><b>{v.currentUnit.unitId}</b></p><p>{v.currentUnit.content}</p>
    {["UNIT_PRESENTED","RESPONSE_DRAFT"].includes(v.state)&&<><textarea value={answer} onChange={e=>setAnswer(e.target.value)}/><br/><button onClick={()=>call("DRAFT",{response:answer})}>Salvar rascunho</button>{v.state==="RESPONSE_DRAFT"&&<button onClick={()=>call("FINALIZE")}>Finalizar resposta</button>}</>}
    {v.state==="CONFIDENCE_PENDING"&&<><p>Confiança</p>{(["LOW","MEDIUM","HIGH"] as const).map(c=><button key={c} onClick={()=>call("LOCK",{confidence:c})}>{c}</button>)}</>}
    {v.state==="LOCKED"&&<button onClick={()=>call("NEXT")}>Próxima unidade</button>}
  </section>}
  {v&&v.state!=="PAUSED"&&!["BLOCK_COMPLETE","ASSESSMENT_COMPLETE"].includes(v.state)&&<button onClick={()=>call("PAUSE")}>Pausar</button>}
  {v?.state==="PAUSED"&&<section><p>Declaração de contaminação para retomada</p>{["NO","YES","UNSURE"].map(x=><button key={x} onClick={()=>call("RESUME",{contamination:x})}>{x}</button>)}</section>}
  {v?.state==="BLOCK_COMPLETE"&&<p>Teste sintético concluído.</p>}
  {msg&&<p aria-live="polite">{msg}</p>}
  <p style={{marginTop:32,fontSize:12}}>ASSESSMENT_ASSURANCE = OWNER_VOLUNTARY_BLIND · INDEPENDENT_CUSTODY = NO</p>
 </main>;
}