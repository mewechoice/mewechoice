# MWeC | CRM-001 — Captação institucional de contatos

## O que foi feito
- Implementação isolada da página \`/contato\`, formulário e API \`POST /api/mwec/contato\`.
- Banco **mwec-editorial** na região \`sa-east-1\`, com migração Supabase \`mwec_crm_lead_capture_foundation\`.
- Tabelas \`mwec_crm_access\`, \`mwec_crm_contacts\` e \`mwec_crm_requests\`; RLS ativada.
- Cada envio válido gera uma **solicitação** nova, vinculada ao contato existente pela chave de e-mail normalizado ou WhatsApp normalizado. Não transfere dados a FINATECH/Side by Side.
- A API do Next.js utiliza exclusivamente a chave **publishable/anon**, que não tem SELECT público nos contatos ou solicitações.
- Validação duplicada no aplicativo e no banco; honeypot, limite de tamanho, controle de repetição por contato (1/10 min, máximo 4/24 h).
- Banco restringe os usuários administrativos via \`mwec_crm_access\`. **Nenhuma conta foi autorizada ainda**.
- Supabase: \`mwec_editor_roles\` / \`mwec_cms_articles\` continuam independentes do CRM.

## Limites e decisões
- Captura e organização de solicitações, **não diagnóstico financeiro automatizado** nem proposta comercial.
- Envio não constitui consentimento para marketing; aviso de privacidade deve ser revisado por responsável antes da liberação de produção.
- Critério de duplicidade: e-mail se fornecido; na ausência, número WhatsApp. Duas pessoas compartilhando um meio de contato podem ser vinculadas; esse risco exige tratamento manual. Não se devem unificar contatos apenas por nome.
- Bloqueio de bots é parcial; monitorar volume e introduzir Turnstile/rate limit por IP após revisão de privacidade se houver abuso.
- Cadastro via API pública não concede leitura ou alteração de dados.
- Não solicitar CPF, dados bancários ou documentos em formulários institucionais.
- Política de retenção, canal formal de direitos, responsabilidades e consentimentos adicionais seguem pendentes de aprovação.
- Notificações e painel visual de CRM ficam fora do escopo CRM-001; por ora, o acesso administrativo aos dados só pode ocorrer pelo Supabase Studio, por usuários com permissões na organização, ou futura tela com \`mwec_crm_access\`.

## Configuração em Preview (sem colocar chaves no GitHub)
Variáveis de ambiente para \`mewechoice\`, **somente na branch** \`crm-001-captura-site\`:
- \`MWEC_SUPABASE_URL\`
- \`MWEC_SUPABASE_PUBLISHABLE_KEY\`

A API responde **503** se não estiver configurada. Não configurar chave \`service_role\` nem \`sb_secret_\` na aplicação pública.

## Gates antes da publicação em main
1. Compilação, testes TypeScript/CI e avaliação de rotas em Preview.
2. Testar envio válido, repetição, honeypot e negação de leitura pública sem persistir dados reais.
3. Resolver responsável pelo tratamento, canal oficial de privacidade e prazo de retenção.
4. Inspecionar interface em celular e desktop.
5. Definir operadores do CRM e provisionar acesso com verificação independente; nenhum usuário é administrador por padrão.
6. Aprovação explícita do Owner para publicar o módulo no site de produção.

**STATUS:** implementação isolada, não publicada em produção.

## Verificação adicional 2026-10-23
- GitHub Actions PR Validation: sucesso (typecheck, governança, testes e build).
- Supabase RLS: SELECT pelo papel anon negado, como previsto.
- Variáveis somente para Preview da branch; a implantação deve ser reconstruída após sua configuração.
- Os dados do CRM permanecem restritos; nenhuma conta administrativa foi provisionada.


## CRM-001B | Dashboard de atendimento e controle de ativação
- Dashboard criado em `/admin/contatos`. Em ambiente de testes, autenticação por e-mail/senha e integração OAuth Google condicionada à configuração `MWEC_CRM_APP_ORIGIN` e do provedor Google no Supabase.
- Todas as consultas e transições de estado são validadas no servidor por token Supabase e permissão `mwec_crm_access`; usuário não autorizado não vê dados.
- Cookies `httpOnly`, `SameSite=Strict` e `Secure` em produção. Fluxo OAuth PKCE utiliza cookies temporários com SameSite=Lax.
- Filtro e marcação de andamento: Novo, Em atendimento, Respondido e Encerrado. Sem envio automático de respostas.
- Sem usuários cadastrados em `auth.users` nem em `mwec_crm_access` na inspeção inicial: não é possível autenticar na prévia até o Owner habilitar sua conta de maneira verificada.
- **Novo gate de privacidade**: `MWEC_CRM_ACCEPT_LEADS` deve ser `true` para captar. Ausente ou `false`, o endpoint responde 503 e **não coleta** dados.
- Pendente a revisão de: responsável pelo tratamento, prazo de retenção, canal oficial de direitos, testes ponta a ponta por navegador, proteções anti-bot/abuso e identidade verificada do primeiro responsável.
- Não criar contas por SQL sem identidade confirmada. Não habilitar Google sem parâmetros oficiais OAuth.
- Preview apenas. Não realizar merge na `main` ou deploy em produção até todos os gates concluídos.


## CRM-001D | Google: exibição e ativação

Causa diagnosticada em 23/10/2026: falta a variável MWEC_CRM_APP_ORIGIN na branch Preview, e não há contas autorizadas nem credenciais Google configuradas. O botão anterior ficava oculto por googleAvailable=false.

Correção de UX: o botão passa a ser exibido na entrada central, desabilitado e com motivo explícito quando a autenticação ainda não estiver operacional. Assim, não se declara acesso funcional antes da configuração.

Procedimento de ativação:
1. Criar credenciais OAuth para aplicação Web no Google Cloud; guardar Client ID e Client Secret exclusivamente no painel de autenticação, nunca em chat ou GitHub.
2. Registrar o URI de callback do provedor no Google Cloud: https://hffuxkrjymomhpfnosbp.supabase.co/auth/v1/callback
3. No Supabase mwec-editorial, em Authentication > Providers > Google, habilitar o provedor com as credenciais.
4. Em Supabase Authentication > URL Configuration, permitir o callback da aplicação: https://mewechoice-git-crm-001-captura-site-me-we-choice.vercel.app/api/mwec/crm/oauth/callback
5. Na Vercel Preview somente para crm-001-captura-site, configurar MWEC_CRM_APP_ORIGIN=https://mewechoice-git-crm-001-captura-site-me-we-choice.vercel.app, após configurar o provedor.
6. Verificar a identidade da conta Google administrativa e só então associar seu UID nas permissões mwec_editor_roles e mwec_crm_access.
7. Reimplantar Preview e testar OAuth, sessão, negação a usuários não autorizados e separação de permissões.

Não adicionar essa variável antecipadamente como falso sinal de prontidão. Não publicar em produção antes das verificações.
