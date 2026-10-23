import {NextRequest} from "next/server";
import {configured,context,fail,finished,ok,sameOrigin,supabase} from "../../../../../lib/mwec-crm/server";
export const runtime="nodejs";
export const dynamic="force-dynamic";
const states=["new","in_progress","replied","closed"];
export async function GET(req:NextRequest){
  if(!configured())return fail("Painel ainda não configurado.",503);
  const ctx=await context(req);if(!ctx)return fail("Acesso não autorizado.",401);
  const status=req.nextUrl.searchParams.get("status");
  const part=status&&states.includes(status)?"&status=eq."+status:"";
  try{
    const rows=await supabase("/rest/v1/mwec_crm_requests?select=id,contact_id,contact_name,email,whatsapp,interest,message,status,created_at,updated_at&order=created_at.desc&limit=100"+part,ctx.token);
    return finished(ok({requests:rows,role:ctx.role}),ctx);
  }catch{return fail("Não foi possível consultar as solicitações.",503)}
}
export async function PATCH(req:NextRequest){
  if(!configured())return fail("Painel ainda não configurado.",503);
  if(!sameOrigin(req))return fail("Origem não autorizada.",403);
  const ctx=await context(req);if(!ctx)return fail("Acesso não autorizado.",401);
  if(Number(req.headers.get("content-length")||0)>1200)return fail("Dados inválidos.",400);
  try{
    const data=await req.json() as Record<string,unknown>;
    const id=String(data.id??""); const status=String(data.status??"");
    if(!/^[a-f0-9-]{36}$/i.test(id)||!states.includes(status))return fail("Dados inválidos.",400);
    const rows=await supabase("/rest/v1/mwec_crm_requests?id=eq."+id+"&select=id,status,updated_at",ctx.token,{
      method:"PATCH",headers:{"Content-Type":"application/json",Prefer:"return=representation"},
      body:JSON.stringify({status,updated_at:new Date().toISOString()})
    }) as unknown[];
    if(!rows.length)return fail("Solicitação não encontrada ou operação não permitida.",404);
    return finished(ok({request:rows[0]}),ctx);
  }catch{return fail("Não foi possível atualizar a solicitação.",503)}
}
