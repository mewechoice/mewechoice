"use client";
import {useCallback,useEffect,useState,type FormEvent} from "react";
import Link from "next/link";
type Status="new"|"in_progress"|"replied"|"closed";
type Item={id:string;contact_id:string;contact_name:string;email:string|null;whatsapp:string|null;interest:string;message:string;status:Status;created_at:string;updated_at:string};
type Role="owner"|"attendant";
const statusNames:Record<Status,string>={new:"Novo",in_progress:"Em atendimento",replied:"Respondido",closed:"Encerrado"};
const subjectNames:Record<string,string>={duvida:"Dúvida",diagnostico:"Informações sobre diagnóstico",sugestao:"Sugestão",outro:"Outro assunto"};
async function call(path:string,init:RequestInit={}){
  const r=await fetch(path,{...init,cache:"no-store",credentials:"same-origin",
    headers:{"Content-Type":"application/json",...init.headers}});
  const j=await r.json() as Record<string,unknown>;
  if(!r.ok)throw new Error(String(j.error||"Não foi possível concluir esta ação."));
  return j;
}
export default function Inbox(){
  const [phase,setPhase]=useState<"loading"|"configure"|"login"|"inbox">("loading");
  const [role,setRole]=useState<Role|null>(null);
  const [google,setGoogle]=useState(false);
  const [email,setEmail]=useState("");
  const [password,setPassword]=useState("");
  const [items,setItems]=useState<Item[]>([]);
  const [selected,setSelected]=useState<string|null>(null);
  const [filter,setFilter]=useState<string>("all");
  const [busy,setBusy]=useState(false);
  const [message,setMessage]=useState("");
  const load=useCallback(async()=>{
    const data=await call("/api/mwec/crm/requests");
    setItems((data.requests??[]) as Item[]);
  },[]);
  useEffect(()=>{
    let active=true;
    call("/api/mwec/crm/session").then(async session=>{
      if(!active)return;
      setGoogle(session.googleAvailable===true);
      if(session.configured!==true){setPhase("configure");return}
      const err=new URLSearchParams(window.location.search).get("auth");
      if(err==="google-failed")setMessage("Falha na autenticação Google.");
      if(err==="google-denied")setMessage("Essa conta Google não tem permissão de acesso.");
      if(session.authenticated===true && session.role){
        setRole(session.role as Role);setEmail(String(session.email||""));setPhase("inbox");
        try{await load()}catch{setMessage("Não foi possível carregar as solicitações.")}
      }else {if(session.authenticated===true)setMessage("Sua conta não possui acesso ao CRM.");setPhase("login");}
    }).catch(()=>{if(active)setPhase("configure")});
    return()=>{active=false};
  },[load]);
  async function signIn(e:FormEvent){
    e.preventDefault();if(busy)return;setBusy(true);setMessage("");
    try{
      const d=await call("/api/mwec/crm/session",{method:"POST",body:JSON.stringify({email,password})});
      if(!d.role)throw new Error("Essa conta não tem permissão para consultar o CRM.");
      setRole(d.role as Role);setPassword("");setPhase("inbox");await load();
    }catch(e){setMessage(e instanceof Error?e.message:"Acesso não autorizado.")}
    finally{setBusy(false)}
  }
  async function logOut(){
    setBusy(true);try{await call("/api/mwec/crm/session",{method:"DELETE"});setItems([]);setRole(null);setPassword("");setPhase("login")}
    catch{setMessage("Não foi possível encerrar a sessão agora.")}
    finally{setBusy(false)}
  }
  async function changeStatus(item:Item,status:Status){
    if(busy)return;setBusy(true);setMessage("");
    try{
      await call("/api/mwec/crm/requests",{method:"PATCH",body:JSON.stringify({id:item.id,status})});
      await load();setMessage("Situação atualizada.");
    }catch(e){setMessage(e instanceof Error?e.message:"Não foi possível atualizar.")}
    finally{setBusy(false)}
  }
  const visible=filter==="all"?items:items.filter(x=>x.status===filter);
  const active=visible.find(x=>x.id===selected)??visible[0];
  const newCount=items.filter(x=>x.status==="new").length;
  return <div className="mwc-crm">
    <header className="mwc-crm-top"><Link className="mwc-crm-brand" href="/"><img src="/site031/v03-logo-claro-preview.webp" alt="MWeC" width={150} height={48}/><span>GESTÃO DE CONTATOS</span></Link><Link href="/admin" className="mwc-crm-back">← Painel MWeC</Link></header>
    {phase==="loading"?<main className="mwc-crm-gate"><p>Verificando acesso...</p></main>:
    phase==="configure"?<main className="mwc-crm-gate"><div className="mwc-crm-login"><small>ÁREA RESTRITA</small><h1>CRM em preparação</h1><p>O módulo está em ambiente de testes. É necessário configurar a autenticação e autorizar o responsável antes do primeiro acesso.</p></div></main>:
    phase==="login"?<main className="mwc-crm-gate"><form className="mwc-crm-login" onSubmit={signIn}><small>MWeC / ACESSO RESTRITO</small><h1>Caixa de entrada</h1><p>Use a mesma conta Google ou senha do painel MWeC.</p><p><Link href="/admin">Entrar pelo painel único →</Link></p>{google?<a className="mwc-crm-google" href="/api/mwec/crm/oauth/google">Entrar com Google</a>:
          <><button type="button" className="mwc-crm-google" disabled aria-describedby="mwc-google-not-ready">Entrar com Google</button><p id="mwc-google-not-ready" className="mwc-crm-not-ready">Google ainda não ativado. Faça login pelo painel único quando a configuração estiver concluída.</p></>}
        <p className="mwc-crm-or">ou entre com sua senha</p><label>E-mail<input required type="email" autoComplete="username" value={email} onChange={e=>setEmail(e.target.value)}/></label><label>Senha<input required type="password" autoComplete="current-password" value={password} onChange={e=>setPassword(e.target.value)}/></label><button disabled={busy} type="submit">{busy?"Verificando...":"Entrar no CRM"}</button>{message?<p role="status" className="mwc-crm-notice">{message}</p>:null}</form></main>:
    <main className="mwc-crm-body">
      <div className="mwc-crm-head"><div><p className="mwc-crm-eyebrow">ME → WE → CHOICE / RELACIONAMENTO</p><h1>Contatos recebidos</h1><p>Organização de solicitações. Informações restritas aos responsáveis autorizados.</p></div><div className="mwc-crm-user"><span>{email} · {role==="owner"?"Responsável":"Atendimento"}</span><button onClick={logOut} disabled={busy}>Sair</button></div></div>
      <div className="mwc-crm-stats"><div><strong>{items.length}</strong><span>Solicitações recentes</span></div><div><strong>{newCount}</strong><span>Aguardando atendimento</span></div><div><strong>{items.filter(x=>x.status==="in_progress").length}</strong><span>Em atendimento</span></div></div>
      <div className="mwc-crm-workspace"><section className="mwc-crm-list" aria-label="Solicitações"><div className="mwc-crm-filter"><label htmlFor="crm-state">Filtrar por situação</label><select id="crm-state" value={filter} onChange={e=>{setFilter(e.target.value);setSelected(null)}}><option value="all">Todas</option>{(Object.keys(statusNames) as Status[]).map(s=><option key={s} value={s}>{statusNames[s]}</option>)}</select><button onClick={()=>load().catch(()=>setMessage("Erro ao atualizar."))}>Atualizar</button></div>{visible.length?visible.map(item=><button type="button" key={item.id} className={active?.id===item.id?"mwc-crm-entry active":"mwc-crm-entry"} onClick={()=>setSelected(item.id)}><span className="mwc-crm-entry-title">{item.contact_name}<em>{statusNames[item.status]}</em></span><small>{subjectNames[item.interest]??item.interest} · {new Date(item.created_at).toLocaleDateString("pt-BR")}</small><span>{item.message.slice(0,92)}{item.message.length>92?"…":""}</span></button>):<p className="mwc-crm-empty">Nenhuma solicitação neste filtro.</p>}</section>
      <section className="mwc-crm-detail" aria-label="Detalhes da solicitação">{active?<><p className="mwc-crm-eyebrow">SOLICITAÇÃO RECEBIDA</p><h2>{active.contact_name}</h2><p className="mwc-crm-subject">{subjectNames[active.interest]??active.interest}</p><dl><div><dt>Recebida</dt><dd>{new Date(active.created_at).toLocaleString("pt-BR")}</dd></div><div><dt>E-mail</dt><dd>{active.email?<a href={"mailto:"+active.email}>{active.email}</a>:"Não informado"}</dd></div><div><dt>WhatsApp</dt><dd>{active.whatsapp?<a href={"https://wa.me/"+active.whatsapp.replace(/\D/g,"")} target="_blank" rel="noopener noreferrer">{active.whatsapp}</a>:"Não informado"}</dd></div></dl><h3>Mensagem</h3><p className="mwc-crm-message">{active.message}</p><div className="mwc-crm-state"><label htmlFor="request-status">Situação do atendimento</label><select disabled={busy} id="request-status" value={active.status} onChange={e=>changeStatus(active,e.target.value as Status)}>{(Object.keys(statusNames) as Status[]).map(s=><option key={s} value={s}>{statusNames[s]}</option>)}</select></div><p className="mwc-crm-hint">O envio da solicitação não autoriza campanhas comerciais ou compartilhamento com outros projetos. O histórico de comunicação externa ainda não é registrado automaticamente.</p></>:<div className="mwc-crm-empty"><h2>Nenhuma solicitação selecionada.</h2><p>Os contatos recebidos pelo formulário serão exibidos aqui após autorização do acesso.</p></div>}</section></div>
      {message?<p role="status" className="mwc-crm-notice">{message}</p>:null}
      <p className="mwc-crm-footer">MWeC · CRM em validação · Não compartilhar dados fora dos canais autorizados.</p>
    </main>}
  </div>;
}
