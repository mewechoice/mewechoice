# MWeC | ADMIN-001 — Painel único: Artigos + CRM
**Escopo aprovado pelo Owner:** um login Google para o editor e CRM; e-mail/senha como alternativa. Apenas em branch de desenvolvimento.

## Sistema proposto na branch
- /admin: entrada única, tela de módulos e logout.
- /admin/artigos: editor textual; salvar rascunho, enviar para revisão, aprovar e publicar.
- /admin/contatos: solicitações do site, status de atendimento.
- /api/mwec/crm/session: cookies únicos e verificação independente de mwec_editor_roles e mwec_crm_access.
- /explore: listagem somente de artigos com publicação editorial e RLS.

## Segurança e gates
- Uma identidade do Supabase Auth para duas permissões distintas. Ter Google não concede acesso por si só.
- PKCE e estado de proteção no callback Google; retorno ao /admin.
- Sem usuários autorizados cadastrados atualmente; OAuth Google exige credenciais próprias e configuração no Supabase.
- Captura CRM bloqueada sem MWEC_CRM_ACCEPT_LEADS=true; nenhuma publicação de formulário em produção.
- Editor inicial textual, sem upload de imagens. Versão visual completa requer integração posterior.
- TOPIC-001 histórico não é cadastrado nem publicado automaticamente.
- Antes da produção: validar Google, e-mail/senha, direitos/privacidade, edição completa, regras RLS, responsividade, deploy, auditoria e aprovação.
