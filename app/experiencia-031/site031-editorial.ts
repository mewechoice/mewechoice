import { EDITORIAL_ARTICLES, type EditorialArticle } from "../../lib/editorial/registry";
import { derivePublishability } from "../../lib/editorial/governance";

// An article is visible only after explicit publication lifecycle and evidence gates.
// Historical 'publishedAt' dates alone are insufficient to qualify it for display.
export function getPublishedSite031Articles(): readonly EditorialArticle[] {
  return EDITORIAL_ARTICLES.filter((article) =>
    article.governance.lifecycleStatus === "PUBLISHED" &&
    article.governance.legacyReviewStatus !== "LEGACY_EDITORIAL_REVIEW_REQUIRED" &&
    derivePublishability(article.governance).publishable
  );
}

export const SITE031_TOPICS = [
  "Educação financeira",
  "Organização do dinheiro",
  "Planejamento",
  "Fundamentos dos investimentos",
  "Decisões financeiras",
] as const;

// Categories are candidate UX taxonomy, not approval of content or advice.
export function site031Topic(article: EditorialArticle): string {
  const label = article.topicId.replace("editorial:", "");
  if (["planejamento", "financiamento", "consorcio"].includes(label)) return "Planejamento";
  if (label === "investimentos") return "Fundamentos dos investimentos";
  if (label === "organizacao") return "Organização do dinheiro";
  return "Decisões financeiras";
}