# MWC-018N — Editorial Experience & Naming Validation Gate

STATUS: PRE-MERGE OWNER GATE / NO MERGE

## Technical evidence carried forward
MWC-018M hard gates: typecheck PASS, editorial structural test PASS, production build PASS. P0=0, P1=0.

## Experience validation matrix

### Navigation hypothesis — DESCOBRIR
Intended user expectation: an editorial destination with useful things to read.
Strengths:
- active, curiosity-oriented verb;
- avoids course/help-center semantics;
- short enough for desktop/mobile navigation;
- does not collide with Caminhos product taxonomy.

Primary ambiguity:
- without context, Descobrir may mean discover products, services, opportunities or the company itself.

Kill criteria:
- user expects a product/service catalog;
- user expects a simulator/tool;
- user interprets it as a mandatory step before Meu Projeto;
- first viewport fails to resolve the destination as editorial reading.

### Publication hypothesis — ANTES DA ESCOLHA
Intended role: editorial masthead/publication identity, not a navigation instruction or workflow state.
Strengths:
- coherent with CHOICE;
- supports explanatory, reflective editorial content;
- broader than vehicle/consortium.

Primary ambiguity:
- can sound like a required pre-decision stage.

Kill criteria:
- users interpret it as required homework;
- it implies they cannot use Meu Projeto first;
- it is understood as a warning/disclaimer area rather than a publication.

## Five-second comprehension test
Show only the global navigation for five seconds:
INÍCIO | MEU PROJETO | DESCOBRIR
Ask: "O que você espera encontrar se clicar em Descobrir?"
Pass target: spontaneous answer is articles, readings, explanations, ideas or useful content.
Fail: product catalog, offers, simulator, institutional/about, or uncertainty with no editorial expectation.

## First-viewport test
Open /descobrir without explanation.
Ask:
1. "Que tipo de página é esta?"
2. "O que você faria aqui?"
3. "Precisa passar por aqui antes de usar Meu Projeto?"
Pass:
- identifies article/reading/publication surface;
- understands reading is optional;
- understands Meu Projeto remains independently accessible.

## Headline attraction test
Present article headlines without brand explanation.
Ask which one the person would open and why.
Do not optimize toward click alone. Reject a headline if curiosity depends on fear, urgency, unsupported promise, hidden product pitch or misleading incompleteness.

## Return-intent test
After one article ask:
"Você voltaria aqui para ler outro conteúdo? O que faria você voltar?"
This is qualitative. No automatic ranking or personalization is authorized from the answer.

## Naming decision rule
Do not freeze either name from preference alone.
Freeze DESCOBRIR only after comprehension evidence clears its product/catalog ambiguity.
Freeze ANTES DA ESCOLHA only after first-viewport evidence clears mandatory-step/disclaimer ambiguity.
Names may be frozen independently.

## Minimum evidence before Owner naming decision
- 5 independent five-second navigation tests;
- 5 first-viewport tests;
- at least 3 headline-attraction conversations;
- record verbatim expectation/misinterpretation, not only yes/no;
- no P0/P1 boundary failure.

## Current verdict
IMPLEMENTATION READY FOR HUMAN EXPERIENCE VALIDATION.
No technical blocker in MWC-018 itself.
Naming freeze and merge remain Owner decisions.
