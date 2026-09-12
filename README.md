# ME → WE → CHOICE — Site V3.3

Candidata de implementação pós-red-team da marca **ME → WE → CHOICE**.

## O que mudou na V3.3

- Hero refinado com a assinatura **PRIMEIRO O PROJETO. DEPOIS, A SOLUÇÃO.**
- Duas rotas: diagnóstico guiado e fast-track para lead de alta intenção.
- Método visual **ME → WE → CHOICE** com progressão horizontal no desktop e vertical no mobile.
- Processo separado: **ENTENDER → ORGANIZAR → AVALIAR**.
- Transparência comercial explícita sobre soluções e parceiros.
- Seção de confiança sem prova social inventada.
- Diagnóstico guiado mobile-first, com ramificações por objetivo.
- Resultado gratuito antes da captura de contato.
- Interpretação inicial sem recomendar produto automaticamente.
- Captura posterior de Nome + E-mail + WhatsApp.
- Preferência de próximo passo: WhatsApp, agendamento ou continuar depois.
- Preferência temporal de follow-up e opção de não receber contato proativo.
- Modelo de dados CRM-ready salvo apenas em `localStorage` nesta versão de pré-lançamento.
- Estado preparado para `NEXT_STEP_NOT_SELECTED` caso o usuário abandone após salvar dados.
- Disclaimer informativo no resultado.

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
