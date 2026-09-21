import { NextRequest, NextResponse } from "next/server";
import { randomUUID, timingSafeEqual } from "crypto";
import { store } from "../../../lib/msc00/store";
import { publicUnit, SYNTHETIC_UNITS } from "../../../lib/msc00/synthetic-content";
import type { Confidence, Session } from "../../../lib/msc00/model";

export const dynamic = "force-dynamic";
const noStore={"Cache-Control":"no-store, no-cache, must-revalidate, private","X-Robots-Tag":"noindex, nofollow, noarchive"};

function reply(body:unknown,status=200){ return NextResponse.json(body,{status,headers:noStore}); }
function auth(req:NextRequest){
  const expected=process.env.MSC00_SYNTHETIC_ACCESS_TOKEN;
  const got=req.headers.get("x-msc00-token")||"";
  if(!expected || expected.length!==got.length) return false;
  return timingSafeEqual(Buffer.from(expected),Buffer.from(got));
}
function current(s:Session){ return publicUnit(s.unitIndex); }
function safe(s:Session){ return {sessionId:s.sessionId,state:s.state,unitIndex:s.unitIndex,
  resourceAcknowledged:s.resourceAcknowledged,contamination:s.contamination,
  currentUnit:(["UNIT_PRESENTED","RESPONSE_DRAFT","RESPONSE_FINALIZED","CONFIDENCE_PENDING","LOCKED"].includes(s.state)?current(s):null),
  lockedCount:s.evidence.length}; }

export async function GET(req:NextRequest){
  if(!auth(req)) return reply({error:"UNAUTHORIZED"},401);
  const id=req.nextUrl.searchParams.get("sessionId");
  if(!id) return reply({error:"SESSION_REQUIRED"},400);
  const s=await store.get(id); if(!s) return reply({error:"SESSION_NOT_FOUND"},404);
  return reply(safe(s));
}

export async function POST(req:NextRequest){
  if(!auth(req)) return reply({error:"UNAUTHORIZED"},401);
  const b=await req.json().catch(()=>null) as any;
  if(!b?.action) return reply({error:"ACTION_REQUIRED"},400);

  if(b.action==="START"){
    const s:Session={sessionId:randomUUID(),assessmentId:"MSC00-SYNTHETIC-WEB",assessmentVersion:"SYN-1",
      assessmentMode:"OWNER_VOLUNTARY_BLIND",blockId:"SYN",state:"BLOCK_READY",resourceAcknowledged:false,
      unitIndex:0,draft:"",finalized:null,confidence:null,evidence:[],contamination:null,pausedAt:null};
    await store.set(s); return reply(safe(s),201);
  }
  const s=await store.get(String(b.sessionId||"")); if(!s) return reply({error:"SESSION_NOT_FOUND"},404);

  switch(b.action){
    case "ACK_RESOURCES":
      if(s.state!=="BLOCK_READY") return reply({error:"ILLEGAL_TRANSITION"},409);
      s.resourceAcknowledged=true; s.state="UNIT_PRESENTED"; break;
    case "DRAFT":
      if(!["UNIT_PRESENTED","RESPONSE_DRAFT"].includes(s.state)) return reply({error:"ILLEGAL_TRANSITION"},409);
      s.draft=String(b.response??""); s.state="RESPONSE_DRAFT"; break;
    case "FINALIZE":
      if(s.state!=="RESPONSE_DRAFT" || !s.draft.trim()) return reply({error:"ILLEGAL_TRANSITION"},409);
      s.finalized=s.draft; s.state="CONFIDENCE_PENDING"; break;
    case "LOCK": {
      if(s.state!=="CONFIDENCE_PENDING") return reply({error:"ILLEGAL_TRANSITION"},409);
      const c=b.confidence as Confidence; if(!["LOW","MEDIUM","HIGH"].includes(c)) return reply({error:"CONFIDENCE_REQUIRED"},400);
      const u=current(s); if(!u || !s.finalized) return reply({error:"UNIT_NOT_RELEASABLE"},409);
      s.confidence=c; s.evidence.push({unitId:u.unitId,initialResponse:s.draft,finalResponse:s.finalized,confidence:c,lockedAt:new Date().toISOString()});
      s.state="LOCKED"; break;
    }
    case "NEXT":
      if(s.state!=="LOCKED") return reply({error:"ILLEGAL_TRANSITION"},409);
      s.unitIndex++; s.draft="";s.finalized=null;s.confidence=null;
      s.state=s.unitIndex>=SYNTHETIC_UNITS.length?"BLOCK_COMPLETE":"UNIT_PRESENTED"; break;
    case "PAUSE":
      if(["BLOCK_COMPLETE","ASSESSMENT_COMPLETE"].includes(s.state)) return reply({error:"ILLEGAL_TRANSITION"},409);
      s.pausedAt=new Date().toISOString(); s.state="PAUSED"; break;
    case "RESUME":
      if(s.state!=="PAUSED") return reply({error:"ILLEGAL_TRANSITION"},409);
      if(!["NO","YES","UNSURE"].includes(b.contamination)) return reply({error:"CONTAMINATION_DECLARATION_REQUIRED"},400);
      s.contamination=b.contamination; s.pausedAt=null;
      s.state=s.evidence.length>s.unitIndex?"LOCKED":(s.draft?"RESPONSE_DRAFT":"UNIT_PRESENTED"); break;
    default: return reply({error:"UNKNOWN_ACTION"},400);
  }
  await store.set(s); return reply(safe(s));
}