import type { EditorialArtifact, ExploreArticleContent, InstagramYapContent, YouTubeContent } from "./artifacts";
import type { KnowledgeGovernance } from "./governance";

export const SYNTHETIC_KNOWLEDGE: KnowledgeGovernance = Object.freeze({
  knowledgeUnitId: "MWC-KU-SYNTHETIC-EXP003",
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
});

const base = {
  knowledgeUnitId: SYNTHETIC_KNOWLEDGE.knowledgeUnitId,
  author: "MWC Owner",
  origin: "OWNER_WITH_AI_EDITORIAL_ASSISTANCE" as const,
  editorialStatus: "EDITORIALLY_REFINED" as const,
  sourceReferences: Object.freeze(["synthetic:source-placeholder"]),
  regulatoryBoundary: "GENERAL_EDUCATIONAL_CONTENT" as const,
  provenanceRefs: Object.freeze([
    { stage: "OWNER_DRAFT" as const, ref: "synthetic:owner-draft" },
    { stage: "EDITORIAL_REVISION" as const, ref: "synthetic:editorial-revision" }
  ]),
  createdAt: "2026-09-24",
  updatedAt: "2026-09-24"
};

export const SYNTHETIC_EXPLORE_ARTICLE: EditorialArtifact = Object.freeze({
  ...base,
  artifactId: "MWC-ART-SYNTHETIC-EXPLORE",
  artifactType: "EXPLORE_ARTICLE",
  title: "Exemplo sintético de arquitetura editorial",
  slug: "synthetic-exp003-not-public",
  summary: "Fixture sintética usada somente para validar a arquitetura.",
  contentRef: "synthetic:explore-content"
});

export const SYNTHETIC_INSTAGRAM_YAP: EditorialArtifact = Object.freeze({
  ...base,
  artifactId: "MWC-ART-SYNTHETIC-YAP",
  artifactType: "INSTAGRAM_YAP",
  title: "Adaptação sintética curta",
  summary: "Pontos de fala sintéticos, não um roteiro obrigatório.",
  contentRef: "synthetic:yap-content",
  canonicalArtifactId: SYNTHETIC_EXPLORE_ARTICLE.artifactId
});

export const SYNTHETIC_YOUTUBE: EditorialArtifact = Object.freeze({
  ...base,
  artifactId: "MWC-ART-SYNTHETIC-YOUTUBE",
  artifactType: "YOUTUBE",
  title: "Adaptação sintética longa",
  summary: "Estrutura conversacional sintética para vídeo.",
  contentRef: "synthetic:youtube-content",
  canonicalArtifactId: SYNTHETIC_EXPLORE_ARTICLE.artifactId
});

export const SYNTHETIC_EXPLORE_CONTENT: ExploreArticleContent = Object.freeze({
  opening: "Esta abertura é sintética e existe apenas para testar apresentação.",
  explanation: Object.freeze(["Uma explicação sintética demonstra a estrutura sem ensinar um tópico financeiro real."]),
  examples: Object.freeze(["Exemplo sintético sem números, produtos ou recomendação."]),
  takeaway: "O conteúdo continua educacional e depende da governança da unidade de conhecimento.",
  references: Object.freeze(["Referência sintética para teste de layout."]),
  educationalBoundary: "Conteúdo educacional geral. Não constitui orientação personalizada nem recomendação de valores mobiliários."
});

export const SYNTHETIC_YAP_CONTENT: InstagramYapContent = Object.freeze({
  hook: "Uma pergunta sintética para abrir a conversa.",
  coreIdea: Object.freeze(["Uma ideia central sintética.", "Um ponto de apoio sintético."]),
  simpleExample: "Exemplo curto e sintético.",
  takeaway: "Fechamento sintético em linguagem natural."
});

export const SYNTHETIC_YOUTUBE_CONTENT: YouTubeContent = Object.freeze({
  openingQuestion: "Uma pergunta sintética de abertura?",
  concept: Object.freeze(["Conceito sintético em linguagem conversacional."]),
  example: "Exemplo sintético.",
  commonMisunderstanding: "Equívoco sintético para testar a estrutura.",
  practicalInterpretation: "Interpretação sintética sem recomendação individual.",
  closingTakeaway: "Fechamento sintético."
});
