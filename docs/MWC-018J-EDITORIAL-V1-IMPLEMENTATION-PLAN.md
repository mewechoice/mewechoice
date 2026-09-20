# MWC-018J — Editorial V1 Implementation Plan

STATUS: IMPLEMENTATION PLAN / NAMES REMAIN HYPOTHESES

## Repository observations
Current app is a single Next.js client home page (app/page.tsx) with the existing MWC visual system in app/globals.css. Root metadata exists in app/layout.tsx. Existing engine/test suite must remain non-regressed.

## V1 implementation slice
Create an isolated editorial surface rather than expanding the already-large home component.

Routes:
- /descobrir — editorial landing. Route slug is provisional and replaceable until naming freeze.
- /descobrir/[slug] — article page.

## Content architecture
Use a local typed editorial registry for V1, not CMS/network dependencies.
Each article record contains id, slug, editorial topicId, headline, deck, publication metadata, optional reading-time estimate, claim-class metadata, source notes where required, manual relatedArticleIds and body sections.
No product/path IDs are accepted by the editorial registry.

## Navigation
Home global navigation may expose provisional label Descobrir.
The destination must resolve ambiguity in the first viewport with provisional masthead Antes da Escolha plus an explicit editorial descriptor.
No progress/step styling.

## Product boundary
A neutral Meu Projeto action may return to the existing product entry surface. It carries no query parameter, article ID, topic, selected path, financial value or inferred state.

## V1 seed content
Use clearly labeled editorial demonstration content sufficient to test layout and comprehension. Do not publish invented current rates/statistics.
Suggested cards:
1. Financiamento parece caber no mês. Mas quanto ele representa no projeto inteiro?
2. Consórcio tem juros? A resposta curta não conta a história toda.
3. Você tem R$ 20 mil para o carro. Usar agora ou continuar juntando?
4. O preço é o mesmo. O caminho até ele pode não ser.

Until factual sourcing review, seed articles must avoid unsupported live market values and product-specific claims.

## Accessibility
Semantic main/nav/article/headings; keyboard-operable links; visible focus; meaningful alt text or decorative imagery hidden; no motion dependency; responsive/mobile navigation.

## Tests
Add an editorial V1 structural/adversarial test covering:
1. registry has no product/path selection fields;
2. related reading is manual/deterministic;
3. no ad/sponsor/affiliate fields;
4. no behavioral/profile/CRM scoring fields;
5. neutral Meu Projeto URL has no article-derived params;
6. masthead has no step/progress semantics;
7. topic IDs are editorial-prefixed;
8. claim classes are approved;
9. current-reference records require source/as-of metadata;
10. modeled-example records require assumption metadata;
11. names are centralized hypotheses, not duplicated across logic;
12. existing test suite remains invoked.

## Implementation order
1. typed editorial registry + governance assertions;
2. tests;
3. editorial landing;
4. article route;
5. minimal home navigation entry;
6. responsive/accessibility styling;
7. typecheck/build/test;
8. implementation red-team;
9. corrections + re-audit;
10. Owner merge gate.

## Non-goals
CMS, ads/AdSense, newsletter, personalization, behavioral recommendation, affiliate links, partner placement, automated headline optimization, automatic product prefill, naming freeze.

## Merge gate
No merge without explicit Owner authorization.
