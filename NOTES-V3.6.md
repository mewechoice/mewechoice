# V3.6 — ajustes finais

- Base: ZIP original V3.5 fornecido pelo usuário.
- Marca ME → WE → CHOICE dominante; assinatura serifada em caixa normal, 30–40 px (antes 46–82 px).
- Painel lateral compacto, com colunas flexíveis e textos integrais; adaptação para celular.
- Fast-track limitado a Consórcio, Aquisição planejada e Quero explicar meu objetivo.
- Nome e WhatsApp obrigatórios antes da abertura do canal; erro de armazenamento impede o avanço.
- Número oficial ainda não definido: configurar NEXT_PUBLIC_WHATSAPP_NUMBER e gerar novo build. Sem número, não há redirecionamento.
- Estado FAST_TRACK_CAPTURADO_SEM_CONVERSA permanece após abrir o link: abrir WhatsApp não comprova que a mensagem foi enviada.
- Preservados diagnóstico, Viagem e suas faixas, motor modular, fallback de descoberta, resultado gratuito, CTA VAMOS PLANEJAR JUNTOS →, captura posterior, consentimento e preferências de continuidade da base.
- diagnostic_version atualizado para V3.6 nos dois registros; pacote 0.3.6.
- Texto de transparência comercial deixa de apresentar crédito como oferta.

## Limites herdados da base

CRM-ready significa dados locais preparados para integração, não CRM conectado. As chaves são mwc_last_lead e mwc_fast_track. E-mail e agenda não são operacionais. Os estados internos do diagnóstico foram preservados: NEXT_STEP_NOT_SELECTED, IMMEDIATE_CONTACT, SCHEDULE_REQUESTED, FOLLOW_UP_LATER e do_not_proactive_followup. A integração futura deve mapear esses valores para seus estados oficiais e respeitar a preferência de não contato.

Nenhum repositório, conta ou serviço externo foi alterado. Dados de teste não fazem parte do pacote.

## Validação realizada

- npm run build: aprovado em Next.js 15.5.25, com geração estática da home.
- npm run typecheck: aprovado; build final também validou os tipos.
- Navegador: 320, 375, 768, 1024 e 1440 px sem overflow da página, marca ou cards.
- Fast-track: exatamente três interesses; formulário vazio bloqueado; captura V3.6 persistida antes da continuação; sem número mostra canal em preparação.
- Viagem: ramificação, faixa própria, leitura gratuita antes da captura.
- Descoberta: fallback explícito confirmado.
- Continuidade: preferência de não contato persistida.
- Nenhum erro de página detectado nos cenários testados.
- Redirecionamento externo real não testado: número oficial ainda não definido.

