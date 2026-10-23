"use client";
import {useEffect,useState,type FormEvent} from "react";
import Link from "next/link";

type Session={configured:boolean;authenticated:boolean;googleAvailable:boolean;role:"owner"|"attendant"|null;editorRole:"owner"|"editor"|null;email:string|null};
async function request(path:string,init:RequestInit={}):Promise<Record<string,unknown>>{
  const res=await fetch(path,{...init,credentials:"same-origin",cache:"no-store",
    headers:{"Content-Type":"application/json",...init.headers}});
  const response=await res.json() as Record<string,unknown>;
  if(!res.ok)throw new Error(String(response.error||"Não foi possível completar a operação."));
  return response;
}
export default function AdminHub(){
  const [session,setSession]=useState<Session|null>(null);
  const [loading,setLoading]=useState(true);
  const [email,setEmail]=useState("");
  const [password,setPassword]=useState("");
  const [busy,setBusy]=useState(false);
  const [feedback,setFeedback]=useState("");
  useEffect(()=>{
    let active=true;
    request("/api/mwec/crm/session").then(result=>{
      if(!active)return;
      setSession(result as unknown as Session);
      const error=new URLSearchParams(window.location.search).get("auth");
      if(error==="google-failed")setFeedback("Não foi possível concluir o login pelo Google.");
      if(error==="google-denied")setFeedback("Sua conta Google não tem permissão na administração da MWeC.");
    }).catch(()=>{if(active)setFeedback("Não foi possível verificar a sessão.")}).finally(()=>{if(active)setLoading(false)});
    return()=>{active=false};
  },[]);
  async function signIn(e:FormEvent){
    e.preventDefault();if(busy)return;setBusy(true);setFeedback("");
    try{
      const result=await request("/api/mwec/crm/session",{method:"POST",body:JSON.stringify({email,password})});
      setSession({configured:true,authenticated:true,googleAvailable:!!session?.googleAvailable,role:(result.role??null) as Session["role"],editorRole:(result.editorRole??null) as Session["editorRole"],email:String(result.email||email)});
      setPassword("");
    }catch(err){setFeedback(err instanceof Error?err.message:"Acesso não autorizado.")}
    finally{setBusy(false)}
  }
  async function signOut(){
    setBusy(true);try{
      await request("/api/mwec/crm/session",{method:"DELETE"});
      setSession(current=>current?{...current,authenticated:false,role:null,editorRole:null,email:null}:current);
      setPassword("");setFeedback("");
    }catch{setFeedback("Não foi possível encerrar esta sessão.")}
    finally{setBusy(false)}
  }
  const canEdit=Boolean(session?.editorRole),canCrm=Boolean(session?.role);
  return <div className="mwc-unified"><header className="mwc-unified-top"><Link href="/" aria-label="Voltar para o site da MWeC"><img src="/site031/v03-logo-claro-preview.webp" width={156} height={46} alt="MWeC"/></Link><span>ADMINISTRAÇÃO</span><Link href="/" className="mwc-unified-site">Site público ↗</Link></header>
    {loading?<main className="mwc-unified-gate"><p>Verificando acesso ao painel...</p></main>:
    !session?.configured?<main className="mwc-unified-gate"><section className="mwc-unified-card"><small>MWeC / ÁREA RESTRITA</small><h1>Painel em preparação</h1><p>A autenticação da administração ainda não foi ativada neste ambiente.</p></section></main>:
    !session.authenticated?<main className="mwc-unified-gate"><form className="mwc-unified-card" onSubmit={signIn}>
      <small>ME → WE → CHOICE / PAINEL ADMINISTRATIVO</small><h1>Bem-vindo à MWeC.</h1><p>Uma única entrada para o editor de artigos e o acompanhamento de contatos. O acesso depende da autorização de sua conta.</p>
      {session.googleAvailable?<><a className="mwc-unified-google" href="/api/mwec/crm/oauth/google">Continuar com Google</a><div className="mwc-unified-separator">ou entrar com e-mail e senha</div></>:null}
      <label>E-mail<input autoComplete="username" type="email" required value={email} onChange={e=>setEmail(e.target.value)}/></label>
      <label>Senha<input autoComplete="current-password" type="password" required value={password} onChange={e=>setPassword(e.target.value)}/></label>
      <button className="mwc-unified-primary" disabled={busy} type="submit">{busy?"Verificando...":"Entrar no painel"}</button>
      {feedback?<p role="status" className="mwc-unified-alert">{feedback}</p>:null}
      <p className="mwc-unified-footnote">Sem cadastro público de administradores. Somente usuários convidados e autorizados.</p>
    </form></main>:
    <main className="mwc-unified-main"><div className="mwc-unified-welcome"><div><p className="mwc-unified-eyebrow">MWeC / ÁREA ADMINISTRATIVA</p><h1>Seu espaço de gestão.</h1><p>Escolha o que você precisa organizar agora. Primeiro o projeto. Depois, a solução.</p></div><div className="mwc-unified-user"><span>{session.email}</span><button onClick={signOut} disabled={busy}>Sair</button></div></div>
      <div className="mwc-unified-grid"><section className="mwc-unified-module"><span className="mwc-unified-number">01 / CONTEÚDOS</span><h2>Artigos e Explore</h2><p>Escreva, salve rascunhos e envie conteúdos para revisão. A publicação exige aprovação editorial.</p>{canEdit?<Link href="/admin/artigos" className="mwc-unified-open">Abrir editor de artigos <span aria-hidden="true">→</span></Link>:<span className="mwc-unified-locked">Seu usuário não tem permissão editorial</span>}</section>
      <section className="mwc-unified-module"><span className="mwc-unified-number">02 / RELACIONAMENTO</span><h2>Contatos e CRM</h2><p>Consulte solicitações recebidas pelo site e acompanhe o andamento de cada atendimento.</p>{canCrm?<Link href="/admin/contatos" className="mwc-unified-open">Abrir caixa de entrada <span aria-hidden="true">→</span></Link>:<span className="mwc-unified-locked">Seu usuário não tem permissão de CRM</span>}</section></div>
      {feedback?<p role="status" className="mwc-unified-alert">{feedback}</p>:null}
      <p className="mwc-unified-footnote">A sessão Google ou por senha é compartilhada. As permissões para editar artigos e consultar contatos são verificadas separadamente.</p>
    </main>}</div>;
}
