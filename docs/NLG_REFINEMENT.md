# V3.7 / Engine V2.4 — revisão de linguagem

## Alterações

- O Fact Engine produz um `narrative_plan` determinístico a partir dos enums validados. Objetivo, momento, prazo e prioridades compõem a leitura; critérios e faixa compõem as observações; informações ausentes permanecem em um bloco próprio.
- O Gemini recebe esse plano dentro do Safe Context e pode trabalhar sua linguagem, sem autorização para criar fatos ou relações. O fallback V1 usa uma cópia do mesmo plano.
- O resultado local da página usa essa mesma composição quando a API está indisponível. Não há uma segunda biblioteca de textos antigos.
- A faixa agora integra os fatos conhecidos e é descrita como referência do objetivo, sem afirmar renda, recursos disponíveis ou patrimônio atual.
- Removido o corte que descartava observações de prioridades e tensão depois dos quatro primeiros IDs.
- Novo título: “O QUE PODEMOS ENTENDER MELHOR”. Perguntas patrimoniais usam linguagem acessível e não repetem a pergunta sobre prazo já respondida.
- Validador ampliado para frases repetidas, forte sobreposição lexical entre frases, expressões de tom inadequado e perguntas ausentes divergentes do plano. Preservadas as verificações anteriores de formato e segurança; corrigida a detecção de “seu perfil é” com acento.
- Consultant Assist continua determinístico, com perguntas mapeadas e resumo de todos os fatos, sem exportação pela API pública.
- Fact Engine, Observation Library, Output Validator e Consultant Assist passam para revisão 1.1. Engine 2.4, schema 1.0 e site V3.7 permanecem.
- Configuração de build limita o rastreamento de arquivos à pasta do projeto.

## Caso de referência

**O QUE ISSO INDICA**

Você está começando a pensar no seu objetivo: construir patrimônio e considera um prazo de mais de 2 anos. Nesse planejamento, comparar possibilidades e preservar seus recursos são suas prioridades.

**O QUE VALE OBSERVAR**

Ao avaliar possibilidades, vale observar em conjunto as condições de cada alternativa, o valor inicial e os compromissos ao longo do tempo.

A faixa de até R$ 100 mil é uma referência para essa comparação.

**O QUE PODEMOS ENTENDER MELHOR**

O que você espera construir com esse patrimônio ao longo do tempo.

Quanto você pretende manter disponível para outras necessidades.

## Verificação

Execute com Node.js 24 e dependências instaladas:

```sh
npm ci
npm test
npm run typecheck
npm run build
```

A matriz verifica 93.720 combinações válidas: todas as categorias/subcategorias, momentos, prazos, prioridades individuais e pares permitidos, e faixas compatíveis. Verifica o contrato de saída, o tom, a ausência de repetição detectável e a presença das tensões no fallback. Inclui 31 verificações dirigidas para o caso de referência e entradas/saídas rejeitadas.

Nove cenários de API usam Gemini simulado: sucesso, LOW_CONTEXT sem chamada ao modelo, entrada inválida, repetição, recomendação, formato inválido, HTTP 429, timeout e falta de configuração. Confirmam também que o Consultant Assist não aparece na resposta pública.

O teste do Gemini é simulado. A qualidade das paráfrases de um modelo real depende da configuração e deve ser avaliada com o mesmo caso de referência. O detector de repetição usa igualdade e sobreposição lexical; não é uma garantia de equivalência semântica nem substitui todos os controles de segurança. Os controles de produção já pendentes na versão original permanecem documentados em IMPLEMENTATION_STATUS.md.
