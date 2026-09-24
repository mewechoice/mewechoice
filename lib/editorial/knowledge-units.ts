import type { KnowledgeGovernance } from "./governance";
import { derivePublishability, assertLifecycleConsistency } from "./governance";

export type KnowledgeUnitRecord = Readonly<{
  topicId: string;
  title: string;
  governance: KnowledgeGovernance;
  draftExists: boolean;
}>;

export const TOPIC_001: KnowledgeUnitRecord = Object.freeze({
  topicId: "TOPIC-001",
  title: "Rendimento nominal × inflação × rendimento real",
  draftExists: false,
  governance: Object.freeze({
    knowledgeUnitId: "MWC-KU-TOPIC-001",
    lifecycleStatus: "LEARNING",
    learningStatus: "NOT_ESTABLISHED",
    teachBackRequired: true,
    teachBackStatus: "PENDING",
    technicalAuditStatus: "PENDING",
    sourceAuditRequired: true,
    sourceAuditStatus: "PENDING",
    regulatoryReviewRequired: false,
    regulatoryReviewStatus: "NOT_REQUIRED",
    retestStatus: "NOT_DUE",
    legacyReviewStatus: "NOT_LEGACY",
    evidenceRefs: Object.freeze([])
  })
});

export function validateKnowledgeUnitRecord(unit: KnowledgeUnitRecord): void {
  assertLifecycleConsistency(unit.governance);
  const decision = derivePublishability(unit.governance);
  if (unit.topicId === "TOPIC-001" && decision.publishable) throw new Error("TOPIC_001_MUST_REMAIN_NOT_PUBLISHABLE_IN_EXP_002");
}

export const TOPIC_001_PUBLISHABILITY = derivePublishability(TOPIC_001.governance);
