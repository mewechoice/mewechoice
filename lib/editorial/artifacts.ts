import type { KnowledgeGovernance } from "./governance";
import { derivePublishability } from "./governance";

export type EditorialArtifactType = "EXPLORE_ARTICLE" | "INSTAGRAM_YAP" | "YOUTUBE";
export type EditorialStatus = "OWNER_DRAFT" | "EDITORIALLY_REFINED" | "TECHNICALLY_AUDITED" | "PUBLICATION_APPROVED";
export type ArtifactOrigin = "OWNER" | "OWNER_WITH_AI_EDITORIAL_ASSISTANCE";
export type RegulatoryBoundary = "GENERAL_EDUCATIONAL_CONTENT" | "PROFESSIONAL_SERVICE_BOUNDARY" | "SECURITIES_RECOMMENDATION_BOUNDARY";

export type ArtifactProvenanceReference = Readonly<{
  stage: "OWNER_DRAFT" | "EDITORIAL_REVISION" | "TECHNICAL_REVIEW" | "PUBLICATION_APPROVAL";
  ref: string;
}>;

export type EditorialArtifact = Readonly<{
  artifactId: string;
  knowledgeUnitId: string;
  artifactType: EditorialArtifactType;
  title: string;
  slug?: string;
  summary: string;
  contentRef: string;
  author: string;
  origin: ArtifactOrigin;
  editorialStatus: EditorialStatus;
  technicalReviewReference?: string;
  sourceReferences: readonly string[];
  regulatoryBoundary: RegulatoryBoundary;
  provenanceRefs: readonly ArtifactProvenanceReference[];
  canonicalArtifactId?: string;
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
}>;

export type ExploreArticleContent = Readonly<{
  opening: string;
  explanation: readonly string[];
  examples?: readonly string[];
  calculations?: readonly string[];
  takeaway: string;
  references?: readonly string[];
  educationalBoundary?: string;
}>;

export type InstagramYapContent = Readonly<{
  hook: string;
  coreIdea: readonly string[];
  simpleExample?: string;
  takeaway: string;
}>;

export type YouTubeContent = Readonly<{
  openingQuestion: string;
  concept: readonly string[];
  example?: string;
  commonMisunderstanding?: string;
  practicalInterpretation?: string;
  closingTakeaway: string;
}>;

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

export function assertValidEditorialArtifact(artifact: EditorialArtifact): void {
  if (!/^MWC-ART-[A-Z0-9-]+$/.test(artifact.artifactId)) throw new Error("INVALID_ARTIFACT_ID");
  if (!/^MWC-KU-[A-Z0-9-]+$/.test(artifact.knowledgeUnitId)) throw new Error("INVALID_ARTIFACT_KNOWLEDGE_UNIT_ID");
  if (artifact.artifactType === "EXPLORE_ARTICLE" && !artifact.slug) throw new Error("EXPLORE_SLUG_REQUIRED");
  if (artifact.artifactType !== "EXPLORE_ARTICLE" && artifact.slug) throw new Error("DERIVATIVE_SLUG_NOT_ALLOWED");
  if (artifact.publishedAt && !ISO_DATE.test(artifact.publishedAt)) throw new Error("INVALID_ARTIFACT_PUBLISHED_AT");
  if (artifact.origin === "OWNER_WITH_AI_EDITORIAL_ASSISTANCE" && !artifact.provenanceRefs.some(x=>x.stage==="OWNER_DRAFT")) throw new Error("OWNER_DRAFT_PROVENANCE_REQUIRED");
  if (artifact.editorialStatus === "TECHNICALLY_AUDITED" && !artifact.technicalReviewReference) throw new Error("TECHNICAL_REVIEW_REFERENCE_REQUIRED");
  if (artifact.editorialStatus === "PUBLICATION_APPROVED") {
    if (!artifact.technicalReviewReference) throw new Error("TECHNICAL_REVIEW_REFERENCE_REQUIRED");
    if (!artifact.provenanceRefs.some(x=>x.stage==="PUBLICATION_APPROVAL")) throw new Error("PUBLICATION_APPROVAL_REFERENCE_REQUIRED");
  }
}

export function deriveArtifactPublishability(artifact: EditorialArtifact, knowledge: KnowledgeGovernance) {
  assertValidEditorialArtifact(artifact);
  if (artifact.knowledgeUnitId !== knowledge.knowledgeUnitId) throw new Error("ARTIFACT_KNOWLEDGE_MISMATCH");
  const knowledgeDecision = derivePublishability(knowledge);
  const reasons = [...knowledgeDecision.reasons];
  if (artifact.editorialStatus !== "PUBLICATION_APPROVED") reasons.push("ARTIFACT_NOT_PUBLICATION_APPROVED");
  if (!artifact.technicalReviewReference) reasons.push("ARTIFACT_TECHNICAL_REVIEW_MISSING");
  return Object.freeze({ publishable: reasons.length === 0, reasons: Object.freeze(reasons) });
}

// Editorial artifacts are representations only. This module never mutates or upgrades KnowledgeGovernance.
