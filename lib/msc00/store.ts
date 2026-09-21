import type { Session } from "./model";
const sessions = new Map<string, Session>();
export const store = {
  get(id:string){ return sessions.get(id) ?? null; },
  set(s:Session){ sessions.set(s.sessionId,s); return s; }
};
// SYNTHETIC/PREVIEW ONLY. In-memory state is intentionally not production-authoritative
// on serverless runtimes. REAL_MSC00_CONTENT_LOAD remains prohibited until durable
// server-side persistence is selected and runtime-verified.