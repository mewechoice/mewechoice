import { NextRequest, NextResponse } from "next/server";

export type Role = "owner" | "attendant";
export type EditorialRole = "owner" | "editor";
type AuthSession = {access_token:string;refresh_token:string;expires_in:number;user?:{id?:string;email?:string}};
export type Context = {token:string;id:string;email:string;role:Role|null;editorRole:EditorialRole|null;renewed?:AuthSession};
const ACCESS = "mwec_crm_access";
const REFRESH = "mwec_crm_refresh";
const ORIGIN_COOKIE = "mwec_crm_pkce";
const STATE_COOKIE = "mwec_crm_state";

export function configured() {
  const url=process.env.MWEC_SUPABASE_URL??"";
  return /^https:\/\/[a-z0-9-]+\.supabase\.co$/.test(url.replace(/\/$/,"")) &&
    (process.env.MWEC_SUPABASE_PUBLISHABLE_KEY??"").length>20;
}
export function googleOrigin() {
  if (!configured()) return null;
  const raw=process.env.MWEC_CRM_APP_ORIGIN;
  if (!raw) return null;
  try {
    const url=new URL(raw);
    return url.protocol==="https:" && !url.username && !url.password &&
      !url.search && !url.hash && url.pathname==="/" ? url.origin : null;
  } catch { return null; }
}
export function sameOrigin(req:NextRequest) {return req.headers.get("origin")===req.nextUrl.origin}
export function fail(error:string,status=400) {return NextResponse.json({error},{status,headers:{"Cache-Control":"no-store"}})}
export function ok(data:unknown,status=200) {return NextResponse.json(data,{status,headers:{"Cache-Control":"no-store"}})}
export function options() {return {httpOnly:true,secure:process.env.NODE_ENV==="production",sameSite:"strict" as const,path:"/"}}
export async function supabase(path:string,token?:string,init:RequestInit={}) {
  if(!configured())throw Error("NOT_CONFIGURED");
  const base=process.env.MWEC_SUPABASE_URL!.replace(/\/$/,"");
  const resp=await fetch(base+path,{...init,cache:"no-store",
    headers:{apikey:process.env.MWEC_SUPABASE_PUBLISHABLE_KEY!,...(token?{Authorization:"Bearer "+token}:{}),...init.headers}});
  const text=await resp.text();let result:unknown=null;
  try{result=text?JSON.parse(text):null}catch{result=text}
  if(!resp.ok)throw Error("SUPABASE_HTTP_"+resp.status);
  return result;
}
export async function roleFor(token:string,id:string):Promise<Role|null> {
  const rows=await supabase("/rest/v1/mwec_crm_access?select=role&user_id=eq."+encodeURIComponent(id)+"&limit=1",token) as {role:string}[];
  return rows?.[0]?.role==="owner"?"owner":rows?.[0]?.role==="attendant"?"attendant":null;
}
export async function editorRoleFor(token:string,id:string):Promise<EditorialRole|null> {
  const rows=await supabase("/rest/v1/mwec_editor_roles?select=role&user_id=eq."+encodeURIComponent(id)+"&limit=1",token) as {role:string}[];
  return rows?.[0]?.role==="owner"?"owner":rows?.[0]?.role==="editor"?"editor":null;
}
export async function grantsFor(token:string,id:string){
  const [role,editorRole]=await Promise.all([roleFor(token,id),editorRoleFor(token,id)]);
  return {role,editorRole};
}
export function withAuth(res:NextResponse,session:AuthSession) {
  const cookie=options();
  res.cookies.set(ACCESS,session.access_token,{...cookie,maxAge:Math.max(120,Math.min(session.expires_in||3600,7200))});
  res.cookies.set(REFRESH,session.refresh_token,{...cookie,maxAge:14*86400});
  return res;
}
export function clearAuth(res:NextResponse) {
  for(const key of [ACCESS,REFRESH])res.cookies.set(key,"",{...options(),maxAge:0});
  return res;
}
export async function context(req:NextRequest):Promise<Context|null>{
  if(!configured())return null;
  let token=req.cookies.get(ACCESS)?.value;
  const refresh=req.cookies.get(REFRESH)?.value;
  if(!token&&!refresh)return null;
  let user:{id?:string;email?:string}|null=null;
  let renewed:AuthSession|undefined;
  if(token)try{user=await supabase("/auth/v1/user",token) as typeof user}catch{/* expired */}
  if(!user&&refresh){
    try{
      renewed=await supabase("/auth/v1/token?grant_type=refresh_token",undefined,
        {method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({refresh_token:refresh})}) as AuthSession;
      token=renewed.access_token;user=renewed.user??await supabase("/auth/v1/user",token) as typeof user;
    }catch{return null}
  }
  if(!token||!user?.id)return null;
  try{
    const {role,editorRole}=await grantsFor(token,user.id);
    return role||editorRole?{token,id:user.id,email:user.email??"",role,editorRole,renewed}:null;
  }catch{return null}
}
export function finished(res:NextResponse,ctx:Context|null){return ctx?.renewed?withAuth(res,ctx.renewed):res}
export const tempCookieNames={pkce:ORIGIN_COOKIE,state:STATE_COOKIE};
export function clearTemp(res:NextResponse){
  for(const k of [ORIGIN_COOKIE,STATE_COOKIE])res.cookies.set(k,"",{httpOnly:true,secure:true,sameSite:"lax",path:"/api/mwec/crm/oauth",maxAge:0});
  return res;
}
