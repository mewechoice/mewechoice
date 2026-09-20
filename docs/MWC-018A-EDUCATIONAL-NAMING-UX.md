# MWC-018A — Educational Area Naming / UX Gate

STATUS: RESEARCH + DESIGN ONLY / NO IMPLEMENTATION

## Owner concern
The working label "Aprender" may describe MWC's educational intention but may not match the user's click intention. Naming must be evaluated before building the educational area.

## Jobs-to-be-done
A visitor is more likely to seek an answer to a concrete question ("como funciona?", "o que muda?", "quanto custa?", "o que preciso saber antes de decidir?") than to arrive with the abstract goal "aprender".

## Candidate architecture
Separate:
1. internal product/domain name;
2. navigation label;
3. contextual CTA.

They do not need to use the same word.

## Candidate set for adversarial UX evaluation
- Aprender
- Entenda
- Explore
- Guia
- Conteúdos
- Descubra

## Evaluation criteria
Each candidate must be tested against:
- click intent / curiosity;
- immediate comprehension;
- fit with ME → WE → CHOICE;
- educational credibility;
- avoidance of school/course connotation;
- avoidance of aggressive commercial framing;
- scalability beyond consórcio;
- contextual CTA flexibility;
- SEO/content architecture compatibility;
- mobile navigation clarity.

## Initial hypothesis — not a decision
"Entenda" is the strongest challenger to "Aprender" because it is closer to the visitor's immediate information-seeking job. This hypothesis requires red-team before adoption.

## Important UX rule
Even if one umbrella label is selected, article-level and project-level CTAs should be question/task-specific, e.g. "Entenda como funciona", rather than mechanically repeating the section name.

## Gate
No educational-area implementation until naming/UX red-team is complete and the Owner approves the naming decision.


## Owner clarification — editorial reading experience
The educational area is fundamentally an ARTICLE destination. Success is not merely navigation CTR or information retrieval. The experience must make people want to open an article, enjoy reading it, continue to another article, and return later.

Therefore naming and UX evaluation must also test:
- editorial warmth and curiosity;
- perceived reading pleasure;
- whether the label suggests a library/magazine/editorial destination rather than a course or classroom;
- article-to-article discovery;
- return/read-again potential;
- compatibility with narrative, useful and human writing;
- whether article titles can carry most of the click motivation while the umbrella label remains clear.

This clarification weakens any candidate that sounds instructional, bureaucratic or like formal training. "Aprender" and "Entenda" remain hypotheses, not decisions.


## MWC-018B — editorial naming adversarial synthesis

### Reframed job
The umbrella label must invite voluntary reading. It is not the primary hook for every article; article headlines and contextual CTAs carry most of the click motivation. The umbrella must make the destination understandable and attractive without pretending to be a course.

### Candidate red-team
| Candidate | Strength | Material risk | Gate result |
| --- | --- | --- | --- |
| Aprender | clear educational purpose | sounds like effort, lesson or course; describes what MWC wants the visitor to do | HOLD |
| Entenda | useful and action-oriented | imperative/instructional; better for contextual CTAs than for an editorial destination | CTA CANDIDATE |
| Explore | curiosity and discovery | broad/vague; may not communicate articles or knowledge | HOLD |
| Guia | practical and familiar | sounds like a static guide/help center; weak for a growing editorial publication | HOLD |
| Conteúdos | accurate category word | generic, corporate and low-desire; describes inventory rather than reader value | REJECT |
| Descubra | curiosity-oriented | promotional/marketing tone; can overpromise discovery | HOLD |

### Architectural conclusion
Do not force one word to perform three jobs.

1. **Editorial destination / navigation:** should identify a place worth reading.
2. **Article headline:** should carry the concrete curiosity/value proposition.
3. **Contextual CTA:** may use verbs such as "Entenda", "Veja", "Saiba" or a direct question according to context.

### New naming direction
The first candidate set was too verb-heavy. For an article-led destination, the next round should test editorial nouns/constructs that can behave like a publication or reading shelf, while remaining native to MWC.

New independent candidate families:
- **Perspectivas** — editorial and expandable; risk: abstract/corporate.
- **Leituras** — directly signals reading; risk: may sound literary rather than practical.
- **Em Pauta** — editorial/current; risk: news connotation.
- **Por Dentro** — accessible and curiosity-led; risk: colloquial and common.
- **Ponto de Vista** — editorial; risk: opinion rather than factual explanation.
- **Biblioteca** — clear collection; risk: static/academic.
- **Caderno MWC** — strong publication architecture; risk: unfamiliar as main navigation.
- **MWC Explica** — clear editorial promise; risk: brand-centered and instructional.
- **Antes de Escolher** — highly aligned with CHOICE and decision preparation; risk: phrase-length navigation label.

### Strongest concepts to take to Owner gate
No winner is declared by the audit. The most differentiated concepts for a decision test are:
- **Por Dentro** — curiosity/readability direction.
- **Caderno MWC** — editorial-publication direction.
- **Antes de Escolher** — brand-strategy/decision direction.
- **MWC Explica** — clarity/explainer direction.

"Entenda" remains useful primarily as CTA language, not necessarily as the section name.

## MWC-018B gate
A naming decision is now required before information architecture and visual/editorial implementation are frozen. No code implementation should select a section name implicitly.


## Owner direction — "Antes da Escolha"
Owner positively selected **Antes da Escolha** as the leading naming direction.

Status: LEADING CANDIDATE / NOT YET MERGED.

Interpretation:
- names the moment before a decision rather than commanding the user to learn;
- supports an editorial destination made of pleasurable, useful articles;
- aligns structurally with CHOICE while preserving user agency;
- can host content beyond consortium and vehicles.

Next work before freeze:
1. adversarial naming/semantic check;
2. navigation and mobile-fit check;
3. editorial masthead/subtitle system;
4. article-title architecture;
5. SEO/discoverability implications;
6. boundary check against advice/recommendation language;
7. final Owner approval before merge/implementation.

Working masthead hypothesis:
**Antes da Escolha**
Information, stories and explanations that help people understand what matters before deciding.

This subtitle is a working hypothesis, not approved copy.


## MWC-018C — ChatGPT independent red-team: "Antes da Escolha"

### Scope
Adversarial evaluation of the leading name only. This section must remain separate from any second-team/Gemini assessment to avoid cross-contamination.

### Findings

**RT-01 — Semantic fit: PASS**
"Antes da Escolha" names a decision-preparation moment, not a product, financial category or learning obligation. It naturally preserves the user's final agency.

**RT-02 — Brand architecture: PASS**
The expression has a meaningful relationship with CHOICE without requiring the visitor to understand the ME/WE/CHOICE framework first. It can therefore work independently and gain additional meaning inside the brand system.

**RT-03 — Editoriality: PASS WITH WATCH**
It can credibly function as an editorial masthead and supports narrative/explainer articles. Risk: without an editorial subtitle, article cards or visual cues, the phrase alone may be interpreted as a process step rather than a content publication.

**RT-04 — Click desire: PASS WITH WATCH**
The phrase creates anticipatory tension ("before which choice?") and is less effort-coded than "Aprender". However, the umbrella label alone should not be expected to generate article CTR. Headlines, decks, imagery and contextual CTAs must carry concrete curiosity.

**RT-05 — Navigation comprehension: PASS WITH WATCH**
Readable and short enough for normal desktop navigation. On constrained mobile navigation it is longer than one-word labels but remains intelligible. Do not abbreviate it to "Escolha", because that changes the semantics.

**RT-06 — Scope scalability: PASS**
Not bound to vehicle, consortium, finance or acquisition. It can host future editorial material about projects, planning, acquisitions, partners, services and other decision contexts.

**RT-07 — Commercial neutrality: PASS**
The name itself does not imply a preferred solution, ranking, partner or sales outcome.

**RT-08 — Advice/suitability boundary: PASS WITH GUARDRAIL**
"Antes da Escolha" can tempt copywriters to write prescriptive material ("o melhor para você", "qual escolher"). Editorial policy must keep the distinction between explaining decision variables and choosing for the reader.

**RT-09 — SEO/discovery: PASS WITH ARCHITECTURAL CONDITION**
The brand label is not itself a search-query strategy. Organic discovery should be driven by article URLs, titles, headings, structured metadata and topic clusters. Do not distort the masthead merely to stuff financial keywords.

**RT-10 — Linguistic risk: LOW**
"Escolha" is broad and positive, but abstract. The masthead requires a concise descriptor on first exposure so the user immediately knows it is an editorial/article destination.

**RT-11 — Repetition with CHOICE: ACCEPTABLE**
The semantic echo is intentional rather than redundant if "Antes da Escolha" is the understanding/editorial layer and CHOICE remains the explicit user-decision state.

**RT-12 — Premature-decision framing: WATCH**
Not every reader arrives with an imminent decision. The editorial system must also welcome exploratory readers. Article language should avoid implying urgency or that a decision must be made now.

### Adversarial attempts
The name was tested against these hostile readings:
- disguised consortium sales funnel;
- course/training area;
- financial-advice/recommendation section;
- generic corporate blog;
- mandatory step before CHOICE;
- urgency/pressure to decide;
- vehicle-only publication.

No naming-level P0/P1 defect was found. Most risks are implementation/editorial-policy risks rather than defects in the name.

### ChatGPT independent verdict
**PASS WITH GUARDRAILS**
P0 = 0
P1 = 0
P2 = 4 (editorial signaling, mobile density, prescriptive-copy drift, premature-decision framing)

Recommended status: keep **Antes da Escolha** as leading candidate and submit the exact same business problem to a blind independent second team before Owner freeze.


## MWC-018E — Discover navigation hypothesis

Owner preference: **DESCOBRIR** is the current provisional favorite for the first-level navigation label. This is NOT a frozen naming decision.

Proposed architecture under test:
- Navigation label: **Descobrir**
- Editorial property/masthead: **Antes da Escolha**
- Article headline: concrete curiosity/value hook

Semantic roles must remain distinct:
- Descobrir = door / navigation invitation
- Antes da Escolha = editorial identity
- Headline = reason to read

### Adversarial test of DESCOBRIR
1. **Affordance ambiguity — P1 WATCH**
   "Descobrir" invites a click but does not itself specify whether the destination contains articles, products, tools, or company discovery. Destination preview/context and landing-page first viewport must resolve this immediately.
2. **Clickbait drift — P1 WATCH**
   Editorial headlines must not turn the discovery promise into sensationalism, hidden-truth framing, or unsupported revelations.
3. **Commercial discovery confusion — P1 WATCH**
   The area must not become "discover products/partners". Product and partner merchandising cannot redefine the navigation label.
4. **Mobile fit — PASS**
   Short, legible and action-oriented.
5. **Recurring-reader fit — PASS**
   Does not expire after a purchase or decision; supports ongoing exploration.
6. **Course/obligation risk — PASS**
   Does not imply study, curriculum or mandatory preparation.
7. **Product-taxonomy collision — PASS**
   Unlike Caminhos/Cenários, it does not collide with current MWC product semantics.
8. **Brand scalability — PASS**
   Can expand beyond vehicle/consortium into future project and decision domains.
9. **Editorial pleasure — PASS WITH EXECUTION DEPENDENCY**
   The verb opens curiosity, but pleasure comes from article quality, visual presentation, headlines and curation.
10. **User-agency boundary — PASS**
    The verb does not inherently recommend or select a path.

### Kill criteria
DESCOBRIR should be rejected if real-user testing shows material expectation of:
- product/service catalog;
- simulator/tool discovery;
- company/about content;
- a mandatory product step;
or if users fail to identify the destination as a reading/editorial area after first-page exposure.

### Challenger rule
Do not reopen broad synonym generation. A new candidate may replace DESCOBRIR only if it materially improves both:
1. click curiosity; and
2. destination comprehension,
without introducing a product-taxonomy collision or course/obligation semantics.

### Current status
DESCOBRIR = LEADING NAVIGATION HYPOTHESIS.
ANTES DA ESCOLHA = LEADING EDITORIAL-MASTHEAD HYPOTHESIS.
Neither is frozen or approved for merge.
