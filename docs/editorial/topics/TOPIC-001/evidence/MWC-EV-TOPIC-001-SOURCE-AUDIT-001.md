# MWC-EV-TOPIC-001-SOURCE-AUDIT-001

## Audit identity

- **MISSION ID:** MWC-TOPIC-001-SOURCE-AUDIT-001
- **AUDIT TYPE:** NEW prospective Source Audit
- **AUDIT TARGET:** `docs/editorial/topics/TOPIC-001/V6_FINAL.md`
- **TARGET SHA-256:** `5ce6ffa75bf54452ff2fd63fd68cb0bb2a3afa6f1920403de0e6b4dcedeb1eb8`
- **TARGET BYTE SIZE:** `9215`
- **AUDIT DATE:** 2026-09-28
- **AUDITOR ROLE:** MWC Independent Auditor
- **REPOSITORY:** `mewechoice/mewechoice`
- **VERIFIED BASELINE:** `origin/main` at `2dc73beb7058291018ce6468537b095b9c62fff6`
- **PRIOR TECHNICAL-AUDIT EVIDENCE SHA-256:** `e0f9dddba214e34cabec36d5bd328714ef6dd740b903d84807675a987d9a00a4`

## Provenance

This is a new prospective Source Audit. It is not a reconstruction, recovery, continuation, or restatement of a historical source review.

The audited object is the exact frozen V6 FINAL identified by SHA-256 `5ce6ffa75bf54452ff2fd63fd68cb0bb2a3afa6f1920403de0e6b4dcedeb1eb8` and byte size 9215. The file was retrieved from the verified repository baseline and independently hashed before source work began. Findings in this report apply only to those exact bytes.

The previously preserved Technical Audit was integrity-checked against its companion hash. Its PASS verdict was treated only as prior evidence of technical correctness; it was not used as proof of source support.

This report and its claim-to-source matrix were created as part of the prospective Source Audit process. No source document was copied into the repository. Source metadata, canonical URLs, access date, quality assessment, and claim mapping are preserved below.

## Scope

The audit determines whether the material externally verifiable claims actually made in frozen V6 have adequate authoritative support. It inventories mathematical/derived, definitional, conceptual, empirical/external, and pedagogical/illustrative claims; identifies which require sources; and tests each source-required claim for direct support.

## Exclusions

This report does not perform or establish:

- a new Technical Audit;
- Learning or Teach-Back assessment;
- Regulatory Review;
- Retest;
- Publication Approval;
- editorial, brand, SEO, or style review;
- product-specific investment analysis;
- tax, fee, or investor-specific outcome analysis;
- governance registration or promotion.

Frozen V6 was not edited. No citation was inserted into V6. No V7, public artifact, derivative, route, publication, or deployment was created.

## Source-quality method

Each cited source was assessed for authority, directness, relevance, currentness, and traceability. Current official Brazilian sources were used for present inflation-index methodology. Older institutional sources were used only for stable definitions or mathematical relationships whose validity is not time-sensitive. No low-authority blog, affiliate page, sales page, anonymous summary, or AI-generated summary was used.

## Source register

The source register is an integral part of the claim-to-source matrix. Every matrix source ID resolves to the complete organization/author, title, canonical URL, access date, and quality assessment below.

| Source ID | Organization / author | Title | Canonical URL | Publication / status | Access date | Source quality |
|---|---|---|---|---|---|---|
| S01 | Instituto Brasileiro de Geografia e Estatística (IBGE) | *Inflação* | https://www.ibge.gov.br/explica/inflacao.php | Current official explanatory page | 2026-09-28 | **HIGH** — primary Brazilian statistical authority; direct support for price-index basket, measured price variation, household-expenditure weights, single-item limitation, and purchasing-power comparisons; current and traceable. |
| S02 | Banco Central do Brasil (BCB) | *O que é inflação* | https://www.bcb.gov.br/controleinflacao/oqueinflacao/ | Current official explanatory page | 2026-09-28 | **HIGH** — Brazilian monetary authority; direct support for inflation as changes in goods/services prices, measurement by price indices, and loss of currency purchasing power; current and traceable. |
| S03 | Comitê Nacional de Educação Financeira (CONEF), hosted by Portal do Investidor | *Educação Financeira nas Escolas — Livro 1: Você Aqui e Agora* | https://gmw.investidor.gov.br/wp-content/uploads/2021/03/EM-Livro1-VoceAquieAgora.pdf | Institutional financial-education material; stable concepts | 2026-09-28 | **HIGH / CORROBORATIVE** — official Brazilian investor-education host and national financial-education material; directly distinguishes nominal return from real return and connects real return to purchasing capacity. Used with current S01/S02/S04 support. |
| S04 | Associação Brasileira das Entidades dos Mercados Financeiro e de Capitais (ANBIMA) | *O que é rentabilidade?* | https://comoinvestir.anbima.com.br/escolha/compreensao-de-conceitos/o-que-e-rentabilidade/ | Current institutional educational page | 2026-09-28 | **HIGH / INSTITUTIONAL** — recognized Brazilian financial-market institution; direct support for nominal versus real return, inflation adjustment, purchasing-power preservation, and the greater/equal/less-than sign interpretation. |
| S05 | New Zealand Treasury; Louise Young | *Determining the Discount Rate for Government Projects (WP 02/21)* | https://www.treasury.govt.nz/publications/wp/determining-discount-rate-government-projects-wp-02-21 | Working paper, issued 2002; repository status current; author-view disclaimer | 2026-09-28 | **HIGH / TECHNICAL** — official Treasury publication with an explicit multiplicative nominal/real/inflation relationship and exact rearranged formula; also requires time-frame consistency. The relationship is stable mathematics; the paper is not treated as current New Zealand policy. |
| S06 | International Monetary Fund; Michael Bleaney | *Can Switching Between Inflationary Regimes Explain Fluctuations in Real Interest Rates? (WP/97/131)* | https://www.imf.org/external/pubs/ft/wp/wp97131.pdf | IMF working paper, 1997 | 2026-09-28 | **HIGH / TECHNICAL** — authoritative institutional technical source; explicitly gives `(1+i)=(1+r)(1+pi)` and states that the additive form omits the cross-product and is an approximation valid when inflation is small. Stable mathematical relationship. |

## Claim inventory summary

- **TOTAL MATERIAL CLAIMS:** 21
- **SOURCE REQUIRED:** 13
- **SOURCE NOT REQUIRED:** 8

Pure arithmetic and transparent derivations already addressed by the separate Technical Audit are inventoried but do not require external citation merely to prove arithmetic. Pedagogical values explicitly introduced as hypothetical are not treated as empirical claims.

## Claim-to-source matrix

Support-status counts apply to the 13 source-required claims. For source-not-required claims, the status is `NOT_APPLICABLE` and does not enter those counts.

| Claim ID | Article location / context | Claim or faithful paraphrase | Claim class | Source required? | Source evidence | Support status | Auditor note |
|---|---|---|---|---|---|---|---|
| C01 | Lines 7–17; opening example | An 8% return on R$1,000 produces R$80 gain and R$1,080 final nominal value. | MATHEMATICAL / PEDAGOGICAL | NO | — | NOT_APPLICABLE | Transparent hypothetical arithmetic; no empirical proposition. |
| C02 | Lines 13–15 | Nominal return describes investment growth before considering inflation. | DEFINITIONAL / CONCEPTUAL | YES | S03 — CONEF, *Você Aqui e Agora*; S04 — ANBIMA, *O que é rentabilidade?* | SUPPORTED | Both sources distinguish the displayed/nominal investment return from inflation-adjusted real return. |
| C03 | Lines 19–31 | Nominal return alone does not establish an equal increase in purchasing power; prices over the same period also matter. | CONCEPTUAL | YES | S02 — BCB, *O que é inflação*; S03 — CONEF, *Você Aqui e Agora*; S04 — ANBIMA, *O que é rentabilidade?* | SUPPORTED | Direct support that inflation affects purchasing power and must be considered when interpreting nominal investment growth. |
| C04 | Lines 23–25 | Purchasing power describes what money can buy. | DEFINITIONAL | YES | S02 — BCB, *O que é inflação*; S03 — CONEF, *Você Aqui e Agora* | SUPPORTED | The sources tie currency purchasing power to the quantity of goods/services money can obtain. |
| C05 | Lines 27–31 | If prices rise proportionally more than the money amount, a person may have more currency units yet buy less. | CONCEPTUAL | YES | S01 — IBGE, *Inflação*; S02 — BCB, *O que é inflação*; S03 — CONEF, *Você Aqui e Agora* | SUPPORTED | IBGE gives the same sign comparison for income versus IPCA; BCB states that inflation reduces currency purchasing power; CONEF applies it to investment return. |
| C06 | Lines 35–43 | Inflation is measured through price variation across a set/basket of goods and services. | DEFINITIONAL / EMPIRICAL-EXTERNAL | YES | S01 — IBGE, *Inflação*; S02 — BCB, *O que é inflação* | SUPPORTED | IBGE directly states that IPCA/INPC measure the variation of prices in a basket; BCB identifies price indices as the measurement mechanism. |
| C07 | Lines 39–51 | A price increase in one product, by itself, does not establish the general inflation rate. | CONCEPTUAL / GENERALIZATION | YES | S01 — IBGE, *Inflação* | SUPPORTED | The official method aggregates price changes over a basket and applies expenditure weights; one item alone cannot establish the aggregate index. |
| C08 | Lines 41–43 | Individual goods and services can show different price movements, so multiple items are considered in the index. | CONCEPTUAL / EMPIRICAL-EXTERNAL | YES | S01 — IBGE, *Inflação* | SUPPORTED | IBGE describes extensive collection across goods/services and an aggregate result reflecting overall consumer-price variation. |
| C09 | Lines 45–49 | Basket items can have different weights, so some influence the price index more than others. | DEFINITIONAL / METHODOLOGICAL | YES | S01 — IBGE, *Inflação* | SUPPORTED | IBGE directly states that indices consider both each item's price variation and its weight in household budgets. |
| C10 | Lines 47–51; rice illustration | A hypothetical 20% rise in rice does not imply 20% general inflation when other prices and weights differ. | PEDAGOGICAL / ILLUSTRATIVE | NO | — | NOT_APPLICABLE | The 20% value is explicitly illustrative. The governing external proposition is separately supported under C07–C09. |
| C11 | Lines 55–59 | Real return reflects the increase or decrease in an investment's purchasing power after inflation is considered. | DEFINITIONAL / CONCEPTUAL | YES | S03 — CONEF, *Você Aqui e Agora*; S04 — ANBIMA, *O que é rentabilidade?* | SUPPORTED | Both sources directly connect real investment return with inflation adjustment and purchasing capacity/power. |
| C12 | Lines 76–82 and 318–326 | Nominal return minus inflation is an approximation, while the exact multiplicative result can differ. | MATHEMATICAL / CONVENTIONAL | YES | S06 — IMF, WP/97/131 | SUPPORTED | IMF explicitly presents the multiplicative relation and explains that the additive form omits the cross-product and is only an approximation. V6 does not overstate the shortcut as exact. |
| C13 | Lines 86–127; simplified basket | The R$100 basket, 10% hypothetical inflation, and R$1,080 investment illustrate a fall from 10 to about 9.82 baskets. | PEDAGOGICAL / MATHEMATICAL | NO | — | NOT_APPLICABLE | Explicitly identified as a simplified visualization and hypothetical rate; not presented as an actual IPCA basket or observed dataset. |
| C14 | Lines 129–199 | Comparing the later quantity purchasable with the initial quantity measures the proportion of purchasing power preserved. | CONCEPTUAL / DERIVED | YES | S02 — BCB, *O que é inflação*; S05 — New Zealand Treasury, WP 02/21 | SUPPORTED | BCB supports the purchasing-power interpretation; S05 supports dividing the nominal growth factor by the inflation factor to convert nominal data to real terms. |
| C15 | Lines 201–248 | Percentage rates can be represented as growth factors such as 1.08 and 1.10, whose ratio is about 0.9818. | MATHEMATICAL / DERIVED | NO | — | NOT_APPLICABLE | Decimal conversion and division are transparent derivations independently checked in the Technical Audit. |
| C16 | Lines 250–286 | Exact one-period real return is `(1 + nominal return) / (1 + inflation) - 1`. | MATHEMATICAL / DEFINITIONAL | YES | S05 — New Zealand Treasury, WP 02/21; S06 — IMF, WP/97/131 | SUPPORTED | S05 prints the same rearranged formula; S06 gives the equivalent exact multiplicative relationship. Both support the distinction from simple subtraction. |
| C17 | Lines 268–276 | Subtracting 1 removes the starting 100% baseline; multiplying the decimal change by 100 expresses a percentage. | MATHEMATICAL / DERIVED | NO | — | NOT_APPLICABLE | Algebra and unit conversion; no external evidence needed. |
| C18 | Lines 288–326; second example | For 15% nominal return and 6% inflation, exact real return is about 8.49%, while 9% is the subtraction approximation. | MATHEMATICAL / PEDAGOGICAL | NO | — | NOT_APPLICABLE | Hypothetical inputs and independently verified arithmetic. The general approximation claim is supported under C12. |
| C19 | Lines 328–346 | In the 8%/10% hypothetical, nominal money rises while purchasing power falls, giving about -1.82% real return. | MATHEMATICAL / PEDAGOGICAL | NO | — | NOT_APPLICABLE | Direct result of the disclosed hypothetical inputs and exact formula; no empirical claim. |
| C20 | Lines 348–354 | With a positive inflation growth factor, nominal return greater than/equal to/less than inflation implies positive/zero/negative real return. | MATHEMATICAL / DERIVED | NO | — | NOT_APPLICABLE | Algebraic consequence of C16; independently confirmed by the Technical Audit. S04 also corroborates the interpretation, but external support is unnecessary for the derivation. |
| C21 | Lines 356–368 | A nominal return figure alone is insufficient for purchasing-power analysis; inflation for the same period is required. | CONCEPTUAL / METHODOLOGICAL | YES | S03 — CONEF, *Você Aqui e Agora*; S04 — ANBIMA, *O que é rentabilidade?*; S05 — New Zealand Treasury, WP 02/21 | SUPPORTED | S03/S04 require inflation adjustment to interpret real return; S05 explicitly requires time-frame consistency between the nominal rate and inflation input. |

## Support-status totals

- **SUPPORTED:** 13
- **PARTIALLY_SUPPORTED:** 0
- **NOT_SUPPORTED:** 0
- **CONTRADICTED:** 0
- **NOT_APPLICABLE:** 8 source-not-required claims

## Exact-support assessment

All 13 source-required claims are supported at the level actually asserted by V6. No source was stretched from a nearby concept to a stronger proposition:

- S01 directly covers basket construction, price variation, weights, and purchasing-power comparisons in the Brazilian context.
- S02 directly covers inflation, price indices, and currency purchasing power.
- S03 and S04 directly cover nominal versus real investment return and purchasing power.
- S05 directly supplies the exact rearranged formula and period-consistency requirement.
- S06 directly supplies the exact multiplicative relationship and the reason subtraction is approximate.

The article does not assert a particular current IPCA rate, basket composition, item weight, observed rice-price change, investment product result, tax treatment, or fee treatment. No time-sensitive numerical external claim therefore required verification.

## Currentness assessment

S01 and S02 are current official Brazilian pages as accessed on 2026-09-28 and are adequate for the article's statements about present price-index concepts. S04 is a current institutional investment-education page.

S03 is older educational material, but it is used only for stable nominal/real-return concepts and is corroborated by S02 and S04. S05 and S06 are older technical publications, but the cited multiplicative identity and approximation distinction are stable mathematics. Their age does not reduce support for those propositions. S05's author-view disclaimer is recorded and the paper is not represented as current Treasury policy.

## Regulatory boundary

No material regulated-service claim was found. V6 explains general educational concepts and hypothetical arithmetic; it does not recommend an asset, portfolio, transaction, provider, or regulated service. This audit does not establish a CVM legal review or professional-authorization review.

## Findings

### P0

None.

### P1

None.

### P2

None.

### Observations

1. The simplified R$100 basket is clearly labeled as a visualization and is not presented as the official IPCA basket. Its invented values are therefore pedagogical rather than empirical.
2. V6 consistently compares nominal return and inflation over the same period; the authoritative exact-formula source expressly supports time-frame consistency.
3. Taxes, fees, product mechanics, and selection of a particular inflation index are outside the claims made by V6 and were not silently added to the audit target.
4. The source package uses six institutional sources, four of them Brazilian, while the exact formula and approximation distinction receive explicit support from official international technical publications.
5. Preserving this report does not register `sourceAuditStatus`, create an `evidenceRef`, or authorize publication.

## Limitations

- This report evaluates source support for claims actually present in the exact frozen V6; it does not audit absent historical examples or conversational context.
- Source availability and page content were assessed on 2026-09-28. URLs and institutional webpages may change after that date.
- The audit records source metadata and support notes rather than copying source documents.
- Source support is separate from technical correctness, governance registration, and publication approval.
- The verdict applies only to the exact target hash and does not automatically transfer to any future revision.

## Verdict

PASS

Every material source-required claim is adequately supported. No material claim is contradicted, partially supported, or left without authoritative support. No P0, P1, or P2 finding was identified.

This verdict establishes only the result of the prospective Source Audit. Durable evidence preservation is not governance promotion, evidenceRefs registration, merge authorization, or publication approval.
