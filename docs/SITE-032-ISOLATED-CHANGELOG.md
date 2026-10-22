# MWeC | SITE-032 | Integração isolada (parcial)
**Branch:** site-032-integracao-isolada

- Base imutável de referência: d738e4b2a40118d49d6d4e6f3c35c37b09b1f5f5.
- Escopo deste commit: blindagem *fail-closed* do catálogo e acesso direto dos artigos históricos em `/descobrir`, usando os gates de `lib/editorial/governance.ts`.
- Os quatro artigos históricos permanecem em `LEARNING` e não devem ser publicados.
- O pacote completo SITE-031 (UI, ativos V03, fotos e styles) foi preparado e checado localmente; sua integração remota ainda não está representada neste commit.
- Fotos ilustrativas sem licença final e identidade V03 derivada ainda necessitam validação para uso público.
- Os testes deste commit devem ser executados em clone integral: `node tests/site032-legacy-gate.cjs`, `npm run typecheck`, `npm test`, `npm run build`.
- **Proibido merge ou deploy de produção sem gate Owner.**
