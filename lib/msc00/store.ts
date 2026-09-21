import { Redis } from "@upstash/redis";
import type { Session } from "./model";

const redis = Redis.fromEnv();
const PREFIX = "mwc:msc00:synthetic:session:";
const TTL_SECONDS = 60 * 60 * 24;

export const store = {
  async get(id: string): Promise<Session | null> {
    return (await redis.get<Session>(PREFIX + id)) ?? null;
  },
  async set(s: Session): Promise<Session> {
    await redis.set(PREFIX + s.sessionId, s, { ex: TTL_SECONDS });
    return s;
  }
};

// SYNTHETIC/PREVIEW ONLY. Durable persistence is isolated under a synthetic
// namespace with a 24h TTL. REAL_MSC00_CONTENT_LOAD remains prohibited.
