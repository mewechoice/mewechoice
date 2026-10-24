import {createHash,randomBytes} from "node:crypto";
import {NextRequest,NextResponse} from "next/server";
import {googleOrigin,tempCookieNames} from "../../../../../../lib/mwec-crm/server";
export const runtime="nodejs";
export const dynamic="force-dynamic";
export async function GET(req:NextRequest) {
  const origin=googleOrigin();
  if(!origin||req.nextUrl.origin!==origin)return new NextResponse("Google ainda não configurado.",{status:503});
  const verifier=randomBytes(48).toString("base64url");
  const challenge=createHash("sha256").update(verifier).digest("base64url");
  const state=randomBytes(28).toString("base64url");
  const redirect=new URL("/api/mwec/crm/oauth/callback",origin);
  redirect.searchParams.set("state",state);
  const auth=new URL("/auth/v1/authorize",process.env.MWEC_SUPABASE_URL!);
  auth.searchParams.set("provider","google");
  auth.searchParams.set("redirect_to",redirect.toString());
  auth.searchParams.set("code_challenge",challenge);
  auth.searchParams.set("code_challenge_method","s256");
  const res=NextResponse.redirect(auth,{status:302});
  res.headers.set("Cache-Control","no-store");
  res.headers.set("Referrer-Policy","no-referrer");
  const opt={httpOnly:true,secure:true,sameSite:"lax" as const,path:"/api/mwec/crm/oauth",maxAge:600};
  res.cookies.set(tempCookieNames.pkce,verifier,opt);
  res.cookies.set(tempCookieNames.state,state,opt);
  return res;
}
