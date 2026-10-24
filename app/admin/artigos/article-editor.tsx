"use client";
import {useEffect,useState,type FormEvent} from "react";
import Link from "next/link";
import {categories,type Article} from "../../../lib/mwec-editorial/article";
type Status="draft"|"in_review"|"approved"|"published";
const statuses:Record<Status,string>={draft:"Rascunho",in_review:"Em revisão",approved:"Aprovado",published:"Publicado"};
type Draft={id?:string;title:string;category:string;excerpt:string;body_markdown:string;status:Status};
const fresh=():Draft=>({title:"",category:categories[0],excerpt:"",body_markdown:"",status:"draft"});
async function api(init:RequestInit={}){
  const response=await fetch("/api/mwec/articles",{...init,cache:"no-store",
    headers:{"Content-Type":"application/json",...init.headers}});
  const data=await response.json() as Record<string,unknown>;
  if(!response.ok)throw Error(String(data.error||"Falha na operação."));
  return data;
}
export default function ArticleEditor(){
 const [phase,setPhase]=useState<"loading"|"login"|"ready"|"unavailable">("loading");
 const [role,setRole]=useState<"owner"|"editor"|null>(null);
 const [articles,setArticles]=useState<Article[]>([]);
 const [draft,setDraft]=useState<Draft>(fresh);
 const [mode,setMode]=useState<"edit"|"preview">("edit");
 const [review,setReview]=useState(false);
 const [rights,setRights]=useState(false);
 const [busy,setBusy]=useState(false);
 const [notice,setNotice]=useState("");
 async function refresh(){const v=await api();setArticles((v.articles||[]) as Article[])}
 useEffect(()=>{
  let active=true;
  fetch("/api/mwec/crm/session",{cache:"no-store"}).then(r=>r.json()).then(async s=>{
    if(!active)return;
    if(!s.configured){setPhase("unavailable");return}
    if(!s.authenticated||!s.editorRole){setPhase("login");return}
    setRole(s.editorRole);setPhase("ready");
    try{await refresh()}catch{if(active)setNotice("Não foi possível carregar os artigos.")}
  }).catch(()=>{if(active)setPhase("unavailable")});
  return()=>{active=false}
 },[]);
 function choose(article:Article){
   setDraft({id:article.id,title:article.title,excerpt:article.excerpt,category:article.category,body_markdown:article.body_markdown,status:article.status as Status});
   setReview(false);setRights(false);setMode("edit");setNotice("");
 }
 function update<K extends keyof Draft>(name:K,value:Draft[K]){setDraft(d=>({...d,[name]:value}))}
 async function run(doWork:()=>Promise<void>,message:string){
   setBusy(true);setNotice("");
   try{await doWork();await refresh();setNotice(message)}
   catch(e){setNotice(e instanceof Error?e.message:"Não foi possível concluir.")}
   finally{setBusy(false)}
 }
 function save(e:FormEvent){e.preventDefault();run(async()=>{
   const result=await api({method:draft.id?"PATCH":"POST",body:JSON.stringify(draft)});
   choose(result.article as Article);
 },"Rascunho salvo.")}
 function transition(action:string){
   if(!draft.id)return;
   if(action==="publish"&&!window.confirm("Publicar este artigo no Explore? A partir daí o texto ficará visível ao público."))return;
   run(async()=>{
     const result=await api({method:"PUT",body:JSON.stringify({id:draft.id,action,reviewed:review,rightsConfirmed:rights})});
     choose(result.article as Article);
   },action==="publish"?"Artigo publicado.":"Etapa editorial atualizada.");
 }
 return <div className="mwc-article-app"><header className="mwc-article-header"><Link href="/admin">← Painel MWeC</Link><strong>CONTEÚDOS / ARTIGOS</strong><Link href="/admin/contatos">CRM ↗</Link></header>
 {phase==="loading"?<main className="mwc-article-block"><p>Verificando acesso editorial...</p></main>:
 phase==="unavailable"?<main className="mwc-article-block"><h1>Editor em preparação</h1><p>O acesso ao sistema editorial não está configurado neste ambiente.</p><Link href="/admin">Voltar ao painel</Link></main>:
 phase==="login"?<main className="mwc-article-block"><h1>Permissão editorial necessária</h1><p>Entre no painel único com a sua conta Google ou senha autorizada.</p><Link href="/admin">Entrar no painel MWeC →</Link></main>:
 <main className="mwc-article-workspace"><aside className="mwc-article-list"><div className="mwc-article-list-head"><p className="mwc-article-tag">EXPLORE / BIBLIOTECA</p><h2>Seus artigos</h2><button onClick={()=>{setDraft(fresh());setReview(false);setRights(false);setMode("edit");setNotice("")}} disabled={busy}>+ Novo artigo</button></div>
 {articles.length?articles.map(a=><button className={draft.id===a.id?"selected":""} onClick={()=>choose(a)} key={a.id}><strong>{a.title}</strong><span>{statuses[a.status as Status]||a.status}</span></button>):<p className="mwc-article-muted">Nenhum artigo cadastrado.</p>}
 </aside><section className="mwc-article-editor"><div className="mwc-article-editor-heading"><div><p className="mwc-article-tag">ME → WE → CHOICE</p><h1>{draft.id?"Editar artigo":"Novo artigo"}</h1><p>Os textos passam por revisão antes de aparecer no Explore.</p></div><span className="mwc-article-status">{statuses[draft.status]}</span></div>
 <div className="mwc-article-tabs"><button onClick={()=>setMode("edit")} className={mode==="edit"?"current":""}>Escrever</button><button onClick={()=>setMode("preview")} className={mode==="preview"?"current":""}>Pré-visualizar</button></div>
 {mode==="preview"?<article className="mwc-article-preview"><small>{draft.category}</small><h2>{draft.title||"Título do artigo"}</h2><p><strong>{draft.excerpt||"Resumo do artigo"}</strong></p>{draft.body_markdown.split(/\n{2,}/).map((block,i)=>block.startsWith("## ")?<h3 key={i}>{block.slice(3)}</h3>:<p key={i}>{block}</p>)}</article>:
 <form id="mwcArticleForm" className="mwc-article-form" onSubmit={save}>
  <label>Título<input required minLength={5} maxLength={160} disabled={busy||["approved","published"].includes(draft.status)} value={draft.title} onChange={e=>update("title",e.target.value)} placeholder="Ex.: Como entender o rendimento real?"/></label>
  <label>Categoria<select value={draft.category} disabled={busy||["approved","published"].includes(draft.status)} onChange={e=>update("category",e.target.value)}>{categories.map(c=><option value={c} key={c}>{c}</option>)}</select></label>
  <label>Resumo para o Explore<textarea maxLength={350} rows={3} value={draft.excerpt} disabled={busy||["approved","published"].includes(draft.status)} onChange={e=>update("excerpt",e.target.value)} placeholder="Uma explicação breve do que a pessoa aprenderá."/><small>{draft.excerpt.length}/350 caracteres</small></label>
  <label>Conteúdo do artigo<textarea rows={19} maxLength={45000} disabled={busy||["approved","published"].includes(draft.status)} value={draft.body_markdown} onChange={e=>update("body_markdown",e.target.value)} placeholder={"## Primeiro subtítulo\n\nDesenvolva seu conteúdo com clareza..."}/><small>Use ## para subtítulos e linhas em branco entre parágrafos.</small></label>
 </form>}
 <div className="mwc-article-actions">
 {["draft","in_review"].includes(draft.status)&&<button type="submit" form="mwcArticleForm" disabled={busy||!draft.title.trim()} className="primary">Salvar rascunho</button>}
 {draft.id&&draft.status==="draft"&&<button disabled={busy} onClick={()=>transition("submit")}>Enviar para revisão</button>}
 {role==="owner"&&draft.id&&draft.status==="in_review"&&<><div className="mwc-article-confirm"><label><input type="checkbox" checked={review} onChange={e=>setReview(e.target.checked)}/> Confirmei a revisão do conteúdo e das fontes.</label><label><input type="checkbox" checked={rights} onChange={e=>setRights(e.target.checked)}/> Verifiquei direitos de materiais usados.</label></div><button className="primary" disabled={busy||!review||!rights} onClick={()=>transition("approve")}>Aprovar</button></>}
 {role==="owner"&&draft.id&&draft.status==="approved"&&<button className="primary" disabled={busy} onClick={()=>transition("publish")}>Publicar no Explore</button>}
 {role==="owner"&&draft.id&&["approved","in_review"].includes(draft.status)&&<button disabled={busy} onClick={()=>transition("return")}>Devolver para ajustes</button>}
 </div>{notice?<p className="mwc-article-note" role="status">{notice}</p>:null}
 <p className="mwc-article-footnote">O TOPIC-001 histórico permanece intocado até sua revisão e autorização editorial específica. Imagens e versões após publicação exigem uma etapa posterior.</p></section></main>}
 </div>;
}
