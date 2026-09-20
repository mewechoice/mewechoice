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


---

# MWC-018G — Independent Adversarial Spec Audit

## Audit posture
Read-only adversarial review of MWC-018F. Objective: falsify the specification before implementation.

## Findings

### P0 — none
No critical architecture defect requires abandonment of the editorial model.

### P1-01 — Editorial → product CTA authority is underspecified
The spec says transitions to Meu Projeto must be contextual and voluntary, but does not define a typed/explicit authority boundary. An implementation could infer a CTA or prefill from article/topic behavior while claiming it is contextual.

**Required correction:** editorial surfaces may display a neutral static entry to Meu Projeto, but no article-derived parameter, path, topic, reading behavior or inferred intent may be transferred into product state unless the user explicitly enters it in the product surface.

### P1-02 — Related-reading personalization boundary is too permissive
"Content relationships" is undefined. A recommender could use behavioral profiling and still describe the output as content-related.

**Required correction:** V1 related reading must be deterministic/editorial (topic/tag/manual relation) and must not use financial profile, CRM state, product state, commercial value, partner economics, inferred suitability or behavioral scoring.

### P1-03 — Advertising boundary defers too much
A future policy is mentioned, but the current spec does not state whether V1 itself contains ads. This leaves an implementation ambiguity.

**Required correction:** V1 advertising = OFF. Monetization requires a separate Owner-approved mission. No sponsored placement, affiliate prioritization or native-ad simulation in V1.

### P1-04 — Factual article governance lacks publication authority
"Sources/methodology when factual claims require them" is discretionary and no distinction is made between evergreen explanation, current rates, statistics and modeled examples.

**Required correction:** define article claim classes and minimum provenance rules. Current rates/statistics require dated source/reference metadata; modeled examples must be labeled examples; product-specific conditions require authoritative product source and must not be generalized.

### P1-05 — Success metrics can create optimization pressure inconsistent with editorial quality
Open rate/scroll/second article can incentivize clickbait or infinite-scroll mechanics.

**Required correction:** metrics are observational in V1; no automated ranking, headline optimization, content suppression or product-state changes based on engagement metrics.

### P1-06 — "Antes da Escolha" can still look like a mandatory stage
The spec separates navigation and masthead but does not explicitly prevent progress indicators or journey sequencing around the editorial masthead.

**Required correction:** no step number, progress bar, required-completion language or visual sequence may position the editorial area as a prerequisite to CHOICE/Meu Projeto.

## P2 observations
1. Reading-time metadata may imply precision; define it as optional estimate if used.
2. Byline/review metadata needs ownership semantics before external contributors exist.
3. Topic families could eventually collide with product taxonomy; maintain separate editorial topic IDs.
4. Search/social deep links need a first-visit cue that identifies MWC and the editorial nature without requiring Home context.
5. Accessibility requirements are absent (semantic headings, keyboard navigation, readable contrast, alt text, reduced motion).

## Adversarial scenarios
- User reads consortium article then enters Meu Projeto: **must start neutral**, with no consortium path selected or inferred.
- User reads five financing articles: **must not become "financing-interested" for product logic**.
- High-CTR sensational headline: engagement must not override editorial claim rules.
- Future advertiser pays more: cannot alter article/path ranking in V1.
- User lands from Google directly on an article: article must stand alone as editorial content and not masquerade as product advice.
- User has already purchased a vehicle: editorial destination remains valid; no forced "before your decision" journey semantics.
- DI/BCB rate becomes stale: article must not present historical/current-sensitive values as current without dated provenance.

## Verdict
**FAIL — CORRECTABLE**
P0 = 0
P1 = 6
P2 = 5

The architecture is viable, but implementation should not begin until the six P1 controls are made binding and re-audited.
