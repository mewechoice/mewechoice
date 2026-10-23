import {timingSafeEqual} from "node:crypto";
import {NextRequest,NextResponse} from "next/server";
import {clearTemp,googleOrigin,grantsFor,supabase,tempCookieNames,withAuth} from "../../../../../../lib/mwec-crm/server";
export const runtime="nodejs";
export const dynamic="force-dynamic";
function eq(a:string,b:string){
  const left=Buffer.from(a);const right=Buffer.from(b);
  return left.length===right.length&&timingSafeEqual(left,right);
}
function finish(origin:string,code:string|null){
  const uri=new URL("/admin",origin);
  if(code)uri.searchParams.set("auth",code);
  const res=NextResponse.redirect(uri,{status:303});
  res.headers.set("Cache-Control","no-store");res.headers.set("Referrer-Policy","no-referrer");
  return clearTemp(res);
}
export async function GET(req:NextRequest){
  const origin=googleOrigin();
  if(!origin||req.nextUrl.origin!==origin)return new NextResponse("Google ainda não configurado.",{status:503});
  const code=req.nextUrl.searchParams.get("code")||"";
  const state=req.nextUrl.searchParams.get("state")||"";
  const cookieState=req.cookies.get(tempCookieNames.state)?.value||"";
  const verifier=req.cookies.get(tempCookieNames.pkce)?.value||"";
  if(code.length<4||code.length>2000||!state||state.length>200||!cookieState||!verifier||!eq(state,cookieState))
    return finish(origin,"google-failed");
  try{
    const session=await supabase("/auth/v1/token?grant_type=pkce",undefined,{
      method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({auth_code:code,code_verifier:verifier})
    }) as {access_token:string;refresh_token:string;expires_in:number;user?:{id?:string;email?:string}};
    if(!session.access_token||!session.refresh_token)return finish(origin,"google-failed");
    const user=session.user?.id?session.user:await supabase("/auth/v1/user",session.access_token) as {id?:string};
    if(!user.id)return finish(origin,"google-denied");
    const {role,editorRole}=await grantsFor(session.access_token,user.id);
    if(!role&&!editorRole)return finish(origin,"google-denied");
    return withAuth(finish(origin,null),session);
  }catch{return finish(origin,"google-failed")}
}
