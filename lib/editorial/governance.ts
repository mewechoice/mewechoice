export type KnowledgeLifecycleStatus =
  | "LEARNING"
  | "DEMONSTRATED"
  | "AUDITED"
  | "PUBLISHABLE"
  | "PUBLISHED"
  | "RETESTED";

export type GateStatus = "NOT_REQUIRED" | "PENDING" | "PASS" | "FAIL";
export type EvidenceStatus = "NOT_ESTABLISHED" | "ESTABLISHED";
export type LegacyReviewStatus = "NOT_LEGACY" | "LEGACY_EDITORIAL_REVIEW_REQUIRED" | "REVIEWED";
export type RetestStatus = "NOT_DUE" | "PENDING" | "PASS" | "FAIL";

export type EvidenceReference = Readonly<{
  kind: "LEARNING" | "TEACH_BACK" | "TECHNICAL_AUDIT" | "SOURCE_AUDIT" | "REGULATORY_REVIEW" | "RETEST";
  ref: string;
}>;

export type KnowledgeGovernance = Readonly<{
  knowledgeUnitId: string;
  lifecycleStatus: KnowledgeLifecycleStatus;
  learningStatus: EvidenceStatus;
  teachBackRequired: boolean;
  teachBackStatus: GateStatus;
  technicalAuditStatus: GateStatus;
  sourceAuditRequired: boolean;
  sourceAuditStatus: GateStatus;
  sourceAuditAt?: string;
  regulatoryReviewRequired: boolean;
  regulatoryReviewStatus: GateStatus;
  retestStatus: RetestStatus;
  legacyReviewStatus: LegacyReviewStatus;
  evidenceRefs: readonly EvidenceReference[];
}>;

export type PublishabilityDecision = Readonly<{
  publishable: boolean;
  reasons: readonly string[];
}>;

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

function evidence(governance: KnowledgeGovernance, kind: EvidenceReference["kind"]) {
  return governance.evidenceRefs.some((item) => item.kind === kind && item.ref.trim().length > 0);
}

export function assertValidKnowledgeGovernance(governance: KnowledgeGovernance): void {
  if (!/^MWC-KU-[A-Z0-9-]+$/.test(governance.knowledgeUnitId)) throw new Error("INVALID_KNOWLEDGE_UNIT_ID");
  if (governance.learningStatus === "ESTABLISHED" && !evidence(governance, "LEARNING")) throw new Error("LEARNING_EVIDENCE_REQUIRED");
  if (governance.teachBackStatus === "PASS" && !evidence(governance, "TEACH_BACK")) throw new Error("TEACH_BACK_EVIDENCE_REQUIRED");
  if (governance.technicalAuditStatus === "PASS" && !evidence(governance, "TECHNICAL_AUDIT")) throw new Error("TECHNICAL_AUDIT_EVIDENCE_REQUIRED");
  if (governance.sourceAuditStatus === "PASS" && (!evidence(governance, "SOURCE_AUDIT") || !governance.sourceAuditAt || !ISO_DATE.test(governance.sourceAuditAt))) throw new Error("SOURCE_AUDIT_EVIDENCE_REQUIRED");
  if (governance.regulatoryReviewStatus === "PASS" && !evidence(governance, "REGULATORY_REVIEW")) throw new Error("REGULATORY_REVIEW_EVIDENCE_REQUIRED");
  if (governance.retestStatus === "PASS" && !evidence(governance, "RETEST")) throw new Error("RETEST_EVIDENCE_REQUIRED");
  if (!governance.sourceAuditRequired && governance.sourceAuditStatus === "PENDING") throw new Error("SOURCE_AUDIT_STATUS_INVALID");
  if (!governance.regulatoryReviewRequired && governance.regulatoryReviewStatus === "PENDING") throw new Error("REGULATORY_REVIEW_STATUS_INVALID");
  if (governance.legacyReviewStatus === "LEGACY_EDITORIAL_REVIEW_REQUIRED" && governance.lifecycleStatus !== "LEARNING") throw new Error("LEGACY_CANNOT_INHERIT_NEW_LIFECYCLE_STATE");
}

export function derivePublishability(governance: KnowledgeGovernance): PublishabilityDecision {
  assertValidKnowledgeGovernance(governance);
  const reasons: string[] = [];
  if (governance.legacyReviewStatus === "LEGACY_EDITORIAL_REVIEW_REQUIRED") reasons.push("LEGACY_REVIEW_REQUIRED");
  if (governance.learningStatus !== "ESTABLISHED" || !evidence(governance, "LEARNING")) reasons.push("LEARNING_NOT_ESTABLISHED");
  if (governance.teachBackRequired && (governance.teachBackStatus !== "PASS" || !evidence(governance, "TEACH_BACK"))) reasons.push("TEACH_BACK_NOT_PASSED");
  if (governance.technicalAuditStatus !== "PASS" || !evidence(governance, "TECHNICAL_AUDIT")) reasons.push("TECHNICAL_AUDIT_NOT_PASSED");
  if (governance.sourceAuditRequired && (governance.sourceAuditStatus !== "PASS" || !governance.sourceAuditAt || !evidence(governance, "SOURCE_AUDIT"))) reasons.push("SOURCE_AUDIT_NOT_PASSED");
  if (governance.regulatoryReviewRequired && (governance.regulatoryReviewStatus !== "PASS" || !evidence(governance, "REGULATORY_REVIEW"))) reasons.push("REGULATORY_REVIEW_NOT_PASSED");
  return Object.freeze({ publishable: reasons.length === 0, reasons: Object.freeze(reasons) });
}

export function assertLifecycleConsistency(governance: KnowledgeGovernance, publishedAt?: string): void {
  const decision = derivePublishability(governance);
  if (["PUBLISHABLE", "PUBLISHED", "RETESTED"].includes(governance.lifecycleStatus) && !decision.publishable) throw new Error("FAIL_CLOSED_NOT_PUBLISHABLE");
  if (governance.lifecycleStatus === "PUBLISHED" && !publishedAt) throw new Error("PUBLISHED_AT_REQUIRED");
  if (publishedAt && !ISO_DATE.test(publishedAt)) throw new Error("INVALID_PUBLISHED_AT");
  if (governance.lifecycleStatus === "RETESTED" && governance.retestStatus !== "PASS") throw new Error("RETEST_PASS_REQUIRED");
}
