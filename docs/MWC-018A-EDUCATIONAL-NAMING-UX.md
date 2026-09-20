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
