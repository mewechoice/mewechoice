import { NextRequest } from "next/server";
import {clearAuth,configured,context,fail,finished,googleOrigin,ok,roleFor,sameOrigin,supabase,withAuth} from "../../../../../lib/mwec-crm/server";
export const runtime="nodejs";
export const dynamic="force-dynamic";
export async function GET(req:NextRequest){
  if(!configured())return ok({configured:false,authenticated:false,googleAvailable:false});
  const ctx=await context(req);
  return finished(ok({configured:true,authenticated:!!ctx,role:ctx?.role??null,email:ctx?.email??null,googleAvailable:!!googleOrigin()}),ctx);
}
export async function POST(req:NextRequest){
  if(!configured())return fail("Painel ainda não configurado.",503);
  if(!sameOrigin(req))return fail("Origem não autorizada.",403);
  if(Number(req.headers.get("content-length")||0)>2500)return fail("Solicitação inválida.",400);
  try{
    const data=await req.json() as Record<string,unknown>;
    const email=typeof data.email==="string"?data.email.trim().toLowerCase():"";
    const password=typeof data.password==="string"?data.password:"";
    if(email.length>190||password.length>250||!email.includes("@")||!password)return fail("Credenciais inválidas.",400);
    const session=await supabase("/auth/v1/token?grant_type=password",undefined,{
      method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({email,password})
    }) as {access_token:string;refresh_token:string;expires_in:number;user?:{id?:string;email?:string}};
    const user=session.user?.id?session.user:await supabase("/auth/v1/user",session.access_token) as {id?:string;email?:string};
    if(!user.id||!await roleFor(session.access_token,user.id))return fail("Acesso não autorizado.",403);
    return withAuth(ok({authenticated:true,role:await roleFor(session.access_token,user.id),email:user.email}),session);
  }catch{return fail("Credenciais inválidas ou acesso não autorizado.",401)}
}
export async function DELETE(req:NextRequest){
  if(!sameOrigin(req))return fail("Origem não autorizada.",403);
  const ctx=await context(req);
  if(ctx)try{await supabase("/auth/v1/logout",ctx.token,{method:"POST"})}catch{/* server session cookie still cleared */}
  return clearAuth(ok({authenticated:false}));
}
