import {NextRequest} from "next/server";
import {configured,context,fail,finished,ok,sameOrigin,supabase} from "../../../../lib/mwec-crm/server";
import {type Article,parseArticle,slug,isId} from "../../../../lib/mwec-editorial/article";
export const runtime="nodejs";export const dynamic="force-dynamic";
const path="/rest/v1/mwec_cms_articles";
function error(e:unknown){return fail(e instanceof Error&&e.message.startsWith("SUPABASE_HTTP")?"Não foi possível concluir. Verifique se o artigo mudou ou se o título já existe.":e instanceof Error?e.message:"Falha na operação.",400)}
async function parse(req:NextRequest){
 const txt=await req.text();
 if(txt.length>60000)throw Error("Conteúdo muito grande.");
 return JSON.parse(txt) as unknown;
}
export async function GET(req:NextRequest){
  if(!configured())return fail("Editor não configurado.",503);
  const ctx=await context(req);if(!ctx?.editorRole)return fail("Permissão editorial necessária.",403);
  try{
    const articles=await supabase(path+"?select=*&order=updated_at.desc&limit=100",ctx.token) as Article[];
    return finished(ok({articles,role:ctx.editorRole}),ctx);
  }catch{return fail("Falha ao consultar artigos.",503)}
}
export async function POST(req:NextRequest){
  if(!sameOrigin(req))return fail("Origem não autorizada.",403);
  const ctx=await context(req);if(!ctx?.editorRole)return fail("Permissão editorial necessária.",403);
  try{
    const data=parseArticle(await parse(req));const articleSlug=slug(data.title);
    if(articleSlug.length<4)throw Error("Título não gera um endereço válido.");
    const result=await supabase(path,ctx.token,{method:"POST",headers:{"Content-Type":"application/json",Prefer:"return=representation"},body:JSON.stringify({...data,slug:articleSlug,author_id:ctx.id,status:"draft"})}) as Article[];
    return finished(ok({article:result[0]},201),ctx);
  }catch(e){return error(e)}
}
export async function PATCH(req:NextRequest){
  if(!sameOrigin(req))return fail("Origem não autorizada.",403);
  const ctx=await context(req);if(!ctx?.editorRole)return fail("Permissão editorial necessária.",403);
  try{
    const data=await parse(req) as Record<string,unknown>;const id=String(data.id??"");
    if(!isId(id))throw Error("ID inválido.");
    const article=parseArticle(data);
    const result=await supabase(path+"?id=eq."+id+"&status=in.(draft,in_review)&select=id,author_id,status",ctx.token) as Article[];
    const previous=result[0];if(!previous)throw Error("Artigo não disponível para edição.");
    if(ctx.editorRole==="editor"&&previous.author_id!==ctx.id)return fail("Permissão insuficiente.",403);
    const saved=await supabase(path+"?id=eq."+id+"&status=eq."+previous.status+"&select=*",ctx.token,{method:"PATCH",headers:{"Content-Type":"application/json",Prefer:"return=representation"},body:JSON.stringify({...article,status:"draft",approved_by:null,approved_at:null,updated_at:new Date().toISOString()})}) as Article[];
    if(!saved.length)return fail("O artigo mudou. Atualize a página.",409);
    return finished(ok({article:saved[0]}),ctx);
  }catch(e){return error(e)}
}
export async function PUT(req:NextRequest){
  if(!sameOrigin(req))return fail("Origem não autorizada.",403);
  const ctx=await context(req);if(!ctx?.editorRole)return fail("Permissão editorial necessária.",403);
  try{
    const data=await parse(req) as Record<string,unknown>;const id=String(data.id??"");
    const action=String(data.action??"");
    if(!isId(id))throw Error("ID inválido.");
    const rows=await supabase(path+"?id=eq."+id+"&select=*&limit=1",ctx.token) as Article[];
    const article=rows[0];if(!article)throw Error("Artigo não encontrado.");
    let patch:Record<string,unknown>;
    if(action==="submit"){
      if(article.status!=="draft")throw Error("Somente rascunhos podem ser enviados.");
      if(ctx.editorRole==="editor"&&article.author_id!==ctx.id)return fail("Permissão insuficiente.",403);
      if(article.excerpt.trim().length<25||article.body_markdown.trim().length<120)throw Error("Complete o resumo e o texto antes de enviar.");
      patch={status:"in_review"};
    }else if(action==="return"){
      if(ctx.editorRole!=="owner"||!["in_review","approved"].includes(article.status))return fail("Somente o responsável editorial pode devolver.",403);
      patch={status:"draft",approved_by:null,approved_at:null,published_at:null};
    }else if(action==="approve"){
      if(ctx.editorRole!=="owner"||article.status!=="in_review")return fail("Aprovação não permitida.",403);
      if(data.reviewed!==true||data.rightsConfirmed!==true)throw Error("Confirme a revisão e os direitos dos materiais.");
      patch={status:"approved",approved_by:ctx.id,approved_at:new Date().toISOString()};
    }else if(action==="publish"){
      if(ctx.editorRole!=="owner"||article.status!=="approved"||!article.approved_by||!article.approved_at)return fail("Aprovação editorial obrigatória.",403);
      patch={status:"published",published_at:new Date().toISOString()};
    }else throw Error("Ação inválida.");
    const saved=await supabase(path+"?id=eq."+id+"&status=eq."+article.status+"&select=*",ctx.token,{method:"PATCH",headers:{"Content-Type":"application/json",Prefer:"return=representation"},body:JSON.stringify({...patch,updated_at:new Date().toISOString()})}) as Article[];
    if(!saved.length)return fail("Estado alterado por outra sessão. Atualize.",409);
    return finished(ok({article:saved[0]}),ctx);
  }catch(e){return error(e)}
}
