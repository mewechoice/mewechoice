# ME → WE → CHOICE — Site V3.5

Versão pós-red-team e pós-aprovação do diagnóstico guiado da marca **ME → WE → CHOICE**.

## Principais mudanças da V3.5

- Hero restaurado para a hierarquia visual preferida: **PROJETOS • PLANEJAMENTO • ESCOLHAS**, marca grande **ME → WE → CHOICE** e assinatura **PRIMEIRO O PROJETO. DEPOIS, A SOLUÇÃO.**
- Categoria **Viagem** adicionada ao diagnóstico, com ramificações e faixas próprias.
- CTA pós-resultado alterado para **VAMOS PLANEJAR JUNTOS →**, marcando a passagem de ME para WE.
- Etapas do diagnóstico reorganizadas: categoria/subcategoria → momento de maturidade → prioridades → prazo → faixa opcional.
- Prioridade atualizada para **Preservar meus recursos**.
- Faixas de valor dinâmicas para Patrimônio, Imóvel, Veículo, Viagem, Educação e Negócio.
- Motor de Interpretação V1 ampliado para cruzar maturidade, prazo, prioridades e categoria.
- Resultado gratuito inclui: **O que isso indica**, **O que vale observar** e **O que ainda precisamos entender**.
- Nenhuma recomendação automática de produto.
- Captura posterior de Nome + E-mail + WhatsApp mantém consentimento de marketing separado.
- Estado CRM-ready atualizado para `diagnostic_version = V3.5`.
- Fast-track para lead quente inclui mini escolha de interesse e captura mínima de Nome + WhatsApp antes do redirect, com estado `FAST_TRACK_CAPTURADO_SEM_CONVERSA`.
- Motor de Interpretação V1 mantém composição modular e inclui fallback explícito para cenário de descoberta quase total, evitando falsa personalização.

## Importante: pré-lançamento

Esta build **não envia dados para servidor, CRM, e-mail ou WhatsApp**. Para testes, o último lead fica apenas no navegador (`localStorage`, chave `mwc_last_lead`). Isso evita prometer integrações que ainda não foram conectadas.

Antes do lançamento comercial, conectar:

1. CRM / persistência segura server-side.
2. E-mail transacional do resumo.
3. WhatsApp oficial / canal comercial.
4. Agenda oficial.
5. Política de Privacidade final e revisão jurídica/compliance.
6. Analytics e funil de conversão.

## Rodar localmente

```bash
npm install
npm run dev
```

Abra `http://localhost:3000`.

## Build

```bash
npm run build
```

## Deploy na Vercel

Importe o repositório no projeto da ME WE CHOICE. Framework: Next.js. Root: `./`.
