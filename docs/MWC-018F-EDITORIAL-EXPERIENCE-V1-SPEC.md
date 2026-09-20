# MWC-018F — Editorial Experience V1 Specification

STATUS: DESIGN / SPECIFICATION ONLY
NAVIGATION HYPOTHESIS: DESCOBRIR
EDITORIAL MASTHEAD HYPOTHESIS: ANTES DA ESCOLHA

## 1. Purpose
Create an editorial reading destination that makes useful subjects pleasant to discover and read, without becoming a course, help center, commercial funnel, product catalog or disguised advice surface.

## 2. Architecture
Navigation label and editorial identity are intentionally separate:
- Global navigation: **Descobrir**
- Editorial masthead: **Antes da Escolha**
- Article headline: concrete reader-level curiosity/value proposition

The global label is the door. The masthead is the publication identity. The headline is the reason to read.

## 3. Entry and exit
Entry may originate from global navigation, search, social, article deep links or contextual editorial links.
No user must pass through the editorial area to use Meu Projeto.
No article completion is required before any product capability.
Exit may lead to another article, a topic collection, Home, or Meu Projeto. A transition to Meu Projeto must be contextual and voluntary.

## 4. First viewport
The landing page must make the destination legible as an editorial/article area immediately.
Required:
- masthead;
- concise descriptor identifying useful editorial reading;
- one lead story;
- visible secondary stories/topics.
Forbidden:
- lead form;
- phone/email gate;
- partner/product offer;
- preselected financial path;
- dominant sales CTA.

## 5. Article card contract
Each card:
- articleId
- headline
- deck/summary
- topic
- reading metadata where useful
- editorial image/illustration when available
- destination URL

Cards may not contain recommendation badges, partner priority, financial-product ranking, or commercial scoring.

## 6. Article page
Required hierarchy:
1. topic/context
2. headline
3. deck
4. byline/date/review metadata when applicable
5. article body
6. sources/methodology when factual claims require them
7. related reading
8. optional contextual next step

The next step must never imply that reading produced a recommendation.

## 7. Editorial voice
Human, clear, curious, specific, non-paternalistic.
Prefer questions, concrete situations, examples and explanatory narratives.
Avoid classroom framing, jargon dumping, artificial suspense and generic AI prose.

## 8. Headline policy
Headlines may create curiosity but must not:
- promise hidden secrets without evidence;
- manufacture fear/urgency;
- imply guaranteed savings/results;
- claim one path is universally best;
- disguise advertising as editorial;
- use unsupported numerical claims.

Headline promise must be fulfilled in the article.

## 9. Topic architecture V1
Initial topic families may include:
- veículos e aquisições;
- planejamento;
- dinheiro e custos;
- financiamento;
- consórcio;
- decisões e situações reais.

Topics are editorial taxonomy, not product recommendations.

## 10. Editorial-to-product boundary
Articles may explain variables and demonstrate neutral examples.
They may link to Meu Projeto when the reader explicitly wants to apply information to their own project.
They may not infer suitability, preselect a path, silently transfer article context into product inputs, or convert reading behavior into financial-profile assumptions.

## 11. Personalization boundary
Reading history, article clicks, dwell time or topic interest must not be used to infer financial suitability or automatically alter Project Engine/Scenario Lab/Paths behavior.
Editorial recommendations for another article may use content relationships, but not financial suitability claims.

## 12. Advertising boundary
Advertising/monetization may exist only in editorial surfaces under a future separately approved policy.
No ads in Meu Projeto, Scenario Lab, comparison, report, CHOICE or human handoff.
Editorial ads must never masquerade as MWC analysis or determine path ordering.

## 13. Search/discovery
SEO is article-level: descriptive URLs, accurate titles/headings, metadata and topic clusters.
Do not distort the navigation label or masthead for keyword stuffing.

## 14. Naming experiment
DESCOBRIR and ANTES DA ESCOLHA remain hypotheses until user testing/freeze.
Kill DESCOBRIR if testing materially maps it to products/services/tools/about-company rather than editorial discovery.
A challenger must improve both curiosity and destination comprehension.

## 15. V1 success signals
Measure separately:
- navigation comprehension;
- click curiosity;
- article open rate;
- meaningful reading/scroll completion;
- second-article discovery;
- return reading;
- voluntary Meu Projeto transition.

Do not optimize CTR at the expense of expectation accuracy or article quality.

## 16. Acceptance gates
Before implementation freeze:
- independent red-team of this spec;
- explicit tests for funnel illusion, commercial contamination, advice drift, clickbait and taxonomy collision;
- Owner naming freeze after sufficient evidence;
- implementation only after corrected spec passes re-audit.
