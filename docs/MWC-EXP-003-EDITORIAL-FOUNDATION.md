# MWC-EXP-003 — Editorial Publishing Foundation

## Boundary

Knowledge governance remains authoritative for learning and publishability. Editorial artifacts are representations of a knowledge unit and cannot mutate or upgrade its evidence state.

Git is the version-history system. Artifact metadata stores lightweight provenance references for Owner draft, editorial revision, technical review and publication approval; EXP-003 does not add a parallel CMS/version-control system.

## Surfaces

- EXPLORE_ARTICLE: long-form educational presentation.
- INSTAGRAM_YAP: talking points using hook → core idea → simple example → takeaway.
- YOUTUBE: opening question → concept → example → common misunderstanding → practical interpretation → closing takeaway.

All derivatives retain the same knowledgeUnitId. A derivative is not independent learning evidence.

## Educational boundary

The supported public class is GENERAL_EDUCATIONAL_CONTENT. Metadata can explicitly flag professional-service and securities-recommendation boundaries, but EXP-003 implements no personalized advice, portfolio recommendation or regulated-service claim.

## AdSense future seam

ADSENSE_ARCHITECTURE_READY is distinct from site readiness, application, approval and activation.

The article presentation has no advertising dependency and remains complete without ad code. A future advertising layer, if separately authorized, should be mounted outside the semantic article content and independently tested for layout stability, performance, accessibility and mobile readability.

No AdSense script, publisher/client ID, ad unit or Auto Ads configuration is introduced here.

## Privacy / data seams

Future work remains separated into:
1. privacy/data and storage inventory;
2. analytics decision;
3. consent/CMP architecture when applicable;
4. AdSense readiness audit;
5. Owner authorization;
6. application/integration.

EXP-003 adds no analytics, CMP, cookies, advertising storage or definitive legal language. Future consent design must be based on the technologies and traffic actually in scope at that time.

## Synthetic-only implementation

Synthetic fixtures validate the model. They are not routed into public navigation, are not published, and contain no real TOPIC-001 content or learning evidence.

## Dependency provenance

EXP-003 is based on frozen EXP-002 HEAD `2c09da0dbb35941de3d9989fd6bc8e5533e2d6e9`; PR #28 remains a separate unmerged dependency.
