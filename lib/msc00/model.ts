export type Confidence = "LOW" | "MEDIUM" | "HIGH";
export type SessionState =
  | "BLOCK_READY" | "UNIT_PRESENTED" | "RESPONSE_DRAFT"
  | "RESPONSE_FINALIZED" | "CONFIDENCE_PENDING" | "LOCKED"
  | "NEXT_UNIT_ELIGIBLE" | "PAUSED" | "BLOCK_COMPLETE" | "ASSESSMENT_COMPLETE";

export type SyntheticUnit = {
  unitId: string; blockId: "SYN"; version: 1; releaseStatus: "PASS";
  resourceMode: "SYNTHETIC"; content: string; responseFormat: "TEXT";
  contentValidityStatus: "PASS"; readabilityStatus: "PASS";
};

export type LockedEvidence = {
  unitId: string; initialResponse: string; finalResponse: string;
  confidence: Confidence; lockedAt: string;
};

export type Session = {
  sessionId: string; assessmentId: "MSC00-SYNTHETIC-WEB";
  assessmentVersion: "SYN-1"; assessmentMode: "OWNER_VOLUNTARY_BLIND";
  blockId: "SYN"; state: SessionState; resourceAcknowledged: boolean;
  unitIndex: number; draft: string; finalized: string | null;
  confidence: Confidence | null; evidence: LockedEvidence[];
  contamination: "NO" | "YES" | "UNSURE" | null; pausedAt: string | null;
};