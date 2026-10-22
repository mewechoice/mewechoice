# MWeC | SITE-032: Experiência SITE-031 na branch isolada

Branch: `site-032-integracao-isolada`. Ambiente de preview; a Home pública e o domínio oficial não foram alterados.

## Endpoints para avaliar
- `/experiencia-031`: Home educacional premium.
- `/experiencia-031/explore`: biblioteca editorial, busca, filtros e reserva para publicidade SEM AdSense.
- `/experiencia-031/explore/[slug]`: somente artigo PUBLISHED com governança aprovada; demais retornam 404.
- `/descobrir` e `/descobrir/[slug]`: preservados com guard de publicação SITE-032.

## Origem visual
- `v03-historico-claro-original.png`: raster histórico de referência, preservado sem reconstrução.
- `v03-logo-claro-preview.webp` e `v03-logo-escuro-preview.webp`: derivados visuais de prévia, não equivalentes a homologação técnica de exportação.
- `hero-preview.webp`: otimização de fotografia ilustrativa da SITE-031; proveniência e direitos de uso precisam de validação para publicação.

## Gates de validação
Executar `npm ci`, `npm run typecheck`, `npm test`, `npm run build`, navegar em 320/375/1440px, validar acessibilidade e corrigir eventuais regressões.
O build de prévia não autoriza merge, produção ou ativação do Google AdSense. Artigos históricos permanecem não publicados.
