"use client";

import { FormEvent, useMemo, useState } from "react";

type GoalKey = "patrimonio" | "imovel" | "veiculo" | "educacao" | "negocio" | "outros" | "descobrindo";

type Answers = {
  goal?: GoalKey;
  subgoal?: string;
  timing?: string;
  priorities: string[];
  stage?: string;
  value?: string;
};

type Lead = {
  name: string;
  email: string;
  phone: string;
  marketing: boolean;
};

const goalOptions: { key: GoalKey; title: string; copy: string; accent: string }[] = [
  { key: "patrimonio", title: "Patrimônio", copy: "Construir ou ampliar patrimônio com organização.", accent: "blue" },
  { key: "imovel", title: "Imóvel", copy: "Comprar, trocar, construir ou reformar.", accent: "teal" },
  { key: "veiculo", title: "Veículo", copy: "Primeiro veículo, troca ou próxima aquisição.", accent: "terra" },
  { key: "educacao", title: "Educação", copy: "Formação, especialização ou novos ciclos.", accent: "blue" },
  { key: "negocio", title: "Negócio", copy: "Estrutura, expansão, equipamentos ou capitalização.", accent: "teal" },
  { key: "outros", title: "Outros objetivos", copy: "Um projeto que não cabe nas categorias acima.", accent: "terra" },
  { key: "descobrindo", title: "Ainda estou descobrindo", copy: "Você não precisa ter tudo definido para começar.", accent: "muted" },
];

const subgoals: Partial<Record<GoalKey, string[]>> = {
  patrimonio: ["Construir patrimônio", "Ampliar patrimônio", "Organizar uma aquisição futura"],
  imovel: ["Comprar meu primeiro imóvel", "Comprar ou trocar outro imóvel", "Construir", "Reformar"],
  veiculo: ["Comprar meu primeiro veículo", "Trocar de veículo", "Comprar outro veículo"],
  educacao: ["Graduação ou formação", "Especialização", "Intercâmbio ou experiência educacional"],
  negocio: ["Abrir um negócio", "Expandir um negócio", "Equipamentos ou estrutura", "Outro objetivo empresarial"],
};

const timings = ["O quanto antes", "Até 6 meses", "6 a 12 meses", "1 a 2 anos", "Mais de 2 anos", "Ainda não sei"];
const priorities = [
  "Realizar mais rápido",
  "Planejar melhor os custos",
  "Ter previsibilidade",
  "Manter flexibilidade",
  "Preservar minha organização financeira",
  "Comparar possibilidades",
  "Ainda não sei",
];
const stages = ["Ainda não pesquisei", "Estou começando", "Já comparei alternativas", "Já recebi propostas", "Prefiro conversar antes de pesquisar mais"];

function valueRanges(goal?: GoalKey) {
  if (goal === "imovel") return ["Até R$ 250 mil", "R$ 250 mil a R$ 500 mil", "R$ 500 mil a R$ 1 milhão", "Acima de R$ 1 milhão", "Ainda não sei", "Prefiro não informar agora"];
  if (goal === "veiculo") return ["Até R$ 50 mil", "R$ 50 mil a R$ 100 mil", "R$ 100 mil a R$ 200 mil", "Acima de R$ 200 mil", "Ainda não sei", "Prefiro não informar agora"];
  if (goal === "negocio") return ["Até R$ 100 mil", "R$ 100 mil a R$ 300 mil", "R$ 300 mil a R$ 1 milhão", "Acima de R$ 1 milhão", "Ainda não sei", "Prefiro não informar agora"];
  return ["Até R$ 50 mil", "R$ 50 mil a R$ 150 mil", "R$ 150 mil a R$ 500 mil", "Acima de R$ 500 mil", "Ainda não sei", "Prefiro não informar agora"];
}

const goalLabels: Record<GoalKey, string> = {
  patrimonio: "Patrimônio",
  imovel: "Imóvel",
  veiculo: "Veículo",
  educacao: "Educação",
  negocio: "Negócio",
  outros: "Outro objetivo",
  descobrindo: "Ainda estou descobrindo",
};

function BrandMark({ compact = false, light = false }: { compact?: boolean; light?: boolean }) {
  return (
    <div className={`brand-mark ${compact ? "brand-mark--compact" : ""} ${light ? "brand-mark--light" : ""}`} aria-label="ME WE CHOICE">
      <span>ME</span><b>→</b><span className="brand-we">WE</span><b className="brand-arrow-two">→</b><span className="brand-choice">CHOICE</span>
    </div>
  );
}

function MethodJourney() {
  const items = [
    ["ME", "O projeto é seu.", "Seu objetivo, seu momento e suas prioridades são o ponto de partida.", "blue"],
    ["WE", "Construímos juntos.", "Organizamos cenários e possibilidades para tornar a decisão mais clara.", "teal"],
    ["CHOICE", "A escolha é sua.", "Você entende os caminhos e decide o que faz sentido para você.", "terra"],
  ];
  return (
    <div className="method-journey">
      {items.map(([label, title, copy, accent], index) => (
        <div className="method-step-wrap" key={label}>
          <article className={`method-step method-step--${accent}`}>
            <span className="method-label">{label}</span>
            <h3>{title}</h3>
            <p>{copy}</p>
          </article>
          {index < items.length - 1 && <div className={`flow-arrow flow-arrow--${index + 1}`} aria-hidden="true">→</div>}
        </div>
      ))}
    </div>
  );
}

function ProcessFlow() {
  const items = [
    ["ENTENDER", "Objetivo, momento e prioridades."],
    ["ORGANIZAR", "Cenários, possibilidades e caminhos."],
    ["AVALIAR", "Entre as soluções disponíveis em nossa atuação, quais merecem ser consideradas."],
  ];
  return (
    <div className="process-flow">
      {items.map(([title, copy], index) => (
        <div className="process-wrap" key={title}>
          <div className="process-item"><span>0{index + 1}</span><h3>{title}</h3><p>{copy}</p></div>
          {index < items.length - 1 && <div className="process-arrow">→</div>}
        </div>
      ))}
    </div>
  );
}

function Quiz({ onClose }: { onClose: () => void }) {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Answers>({ priorities: [] });
  const [lead, setLead] = useState<Lead>({ name: "", email: "", phone: "", marketing: false });
  const [saved, setSaved] = useState(false);
  const [nextChoice, setNextChoice] = useState<string | null>(null);
  const [followUp, setFollowUp] = useState<string | null>(null);

  const hasSubgoal = !!(answers.goal && subgoals[answers.goal]);
  const totalCoreSteps = hasSubgoal ? 6 : 5;

  const mappedStep = useMemo(() => {
    const flow = ["goal"];
    if (hasSubgoal) flow.push("subgoal");
    flow.push("timing", "priorities", "stage", "value", "result", "lead", "next");
    return flow[step] || "goal";
  }, [step, hasSubgoal]);

  const coreIndex = Math.min(step + 1, totalCoreSteps);

  function chooseGoal(goal: GoalKey) {
    setAnswers({ priorities: [], goal, subgoal: undefined, timing: undefined, stage: undefined, value: undefined });
    setStep(1);
  }

  function goBack() {
    if (step === 0) return;
    setStep((s) => Math.max(0, s - 1));
  }

  function togglePriority(priority: string) {
    setAnswers((current) => {
      if (current.priorities.includes(priority)) return { ...current, priorities: current.priorities.filter((p) => p !== priority) };
      if (current.priorities.length >= 2) return current;
      return { ...current, priorities: [...current.priorities, priority] };
    });
  }

  function interpret() {
    const p = answers.priorities;
    const pieces: string[] = [];
    if (answers.timing === "1 a 2 anos" || answers.timing === "Mais de 2 anos") pieces.push("Seu horizonte permite organizar a decisão com antecedência, sem transformar urgência em critério principal.");
    if (answers.timing === "O quanto antes" || answers.timing === "Até 6 meses") pieces.push("Seu horizonte é curto, então prazo, disponibilidade e velocidade de execução terão peso maior na comparação dos caminhos.");
    if (p.includes("Ter previsibilidade")) pieces.push("Como previsibilidade está entre suas prioridades, vale comparar caminhos considerando compromisso financeiro ao longo do tempo, não apenas o valor inicial.");
    if (p.includes("Manter flexibilidade")) pieces.push("Flexibilidade aparece como critério relevante, então soluções muito rígidas merecem atenção adicional antes de qualquer decisão.");
    if (p.includes("Planejar melhor os custos") || p.includes("Preservar minha organização financeira")) pieces.push("Organização de custos é central para você; a próxima etapa deve separar custo total, prazo e impacto no orçamento.");
    if (p.includes("Comparar possibilidades")) pieces.push("Você indicou que comparar possibilidades é importante, então a próxima etapa deve tornar diferenças de prazo, custo, flexibilidade e condições explícitas.");
    if (!pieces.length) pieces.push("Seu ponto de partida já permite organizar as próximas perguntas sem presumir uma solução. O próximo passo é entender melhor contexto, faixa e grau de flexibilidade desejado.");
    return pieces.slice(0, 2);
  }

  function handleLead(e: FormEvent) {
    e.preventDefault();
    if (!lead.name.trim() || !lead.email.trim() || !lead.phone.trim()) return;
    const record = {
      diagnostic_version: "V3.3",
      source: "site",
      status: "NEXT_STEP_NOT_SELECTED",
      answers,
      lead,
      created_at: new Date().toISOString(),
    };
    try { localStorage.setItem("mwc_last_lead", JSON.stringify(record)); } catch {}
    setSaved(true);
    setStep((s) => s + 1);
  }

  function chooseNext(choice: string) {
    setNextChoice(choice);
    try {
      const raw = localStorage.getItem("mwc_last_lead");
      if (raw) {
        const record = JSON.parse(raw);
        record.next_choice = choice;
        record.status = choice === "whatsapp" ? "IMMEDIATE_CONTACT" : choice === "schedule" ? "SCHEDULE_REQUESTED" : "FOLLOW_UP_LATER";
        localStorage.setItem("mwc_last_lead", JSON.stringify(record));
      }
    } catch {}
  }

  function saveFollowUp(option: string) {
    setFollowUp(option);
    try {
      const raw = localStorage.getItem("mwc_last_lead");
      if (raw) {
        const record = JSON.parse(raw);
        record.follow_up_preference = option;
        if (option === "Prefiro entrar em contato quando estiver pronto") record.do_not_proactive_followup = true;
        localStorage.setItem("mwc_last_lead", JSON.stringify(record));
      }
    } catch {}
  }

  function optionButton(label: string, selected: boolean, onClick: () => void, key?: string) {
    return <button type="button" key={key || label} className={`quiz-option ${selected ? "quiz-option--selected" : ""}`} onClick={onClick}>{label}<span>→</span></button>;
  }

  const render = () => {
    if (mappedStep === "goal") return <>
      <p className="quiz-kicker">SEU PONTO DE PARTIDA</p>
      <h2>O que você quer realizar?</h2>
      <p className="quiz-intro">Escolha a opção que mais se aproxima do seu objetivo. Você poderá ajustar isso depois.</p>
      <div className="quiz-grid">{goalOptions.map((goal) => <button type="button" key={goal.key} className={`goal-option goal-option--${goal.accent}`} onClick={() => chooseGoal(goal.key)}><strong>{goal.title}</strong><span>{goal.copy}</span><b>→</b></button>)}</div>
    </>;

    if (mappedStep === "subgoal") return <>
      <p className="quiz-kicker">OBJETIVO</p><h2>Qual opção se aproxima mais?</h2>
      <div className="quiz-list">{subgoals[answers.goal!]?.map((item) => optionButton(item, answers.subgoal === item, () => { setAnswers((a) => ({ ...a, subgoal: item })); setStep((s) => s + 1); }))}</div>
    </>;

    if (mappedStep === "timing") return <>
      <p className="quiz-kicker">MOMENTO</p><h2>Quando você gostaria de realizar isso?</h2>
      <div className="quiz-list">{timings.map((item) => optionButton(item, answers.timing === item, () => { setAnswers((a) => ({ ...a, timing: item })); setStep((s) => s + 1); }))}</div>
    </>;

    if (mappedStep === "priorities") return <>
      <p className="quiz-kicker">PRIORIDADES</p><h2>O que mais importa para você neste momento?</h2><p className="quiz-intro">Escolha até duas opções.</p>
      <div className="quiz-list">{priorities.map((item) => optionButton(item, answers.priorities.includes(item), () => togglePriority(item)))}</div>
      <button className="btn quiz-next" type="button" disabled={!answers.priorities.length} onClick={() => setStep((s) => s + 1)}>Continuar →</button>
    </>;

    if (mappedStep === "stage") return <>
      <p className="quiz-kicker">ESTÁGIO</p><h2>Quanto você já pesquisou sobre os caminhos possíveis?</h2>
      <div className="quiz-list">{stages.map((item) => optionButton(item, answers.stage === item, () => { setAnswers((a) => ({ ...a, stage: item })); setStep((s) => s + 1); }))}</div>
    </>;

    if (mappedStep === "value") return <>
      <p className="quiz-kicker">FAIXA DO PROJETO — OPCIONAL</p><h2>Você já tem uma faixa de valor em mente?</h2>
      <div className="quiz-list">{valueRanges(answers.goal).map((item) => optionButton(item, answers.value === item, () => { setAnswers((a) => ({ ...a, value: item })); setStep((s) => s + 1); }))}</div>
      <button type="button" className="quiz-skip" onClick={() => setStep((s) => s + 1)}>Pular esta pergunta</button>
    </>;

    if (mappedStep === "result") {
      const insights = interpret();
      return <>
        <p className="quiz-kicker">LEITURA INICIAL</p><h2>Seu ponto de partida está organizado.</h2>
        <div className="result-grid">
          <div><span>Objetivo</span><strong>{answers.subgoal || (answers.goal ? goalLabels[answers.goal] : "—")}</strong></div>
          <div><span>Momento</span><strong>{answers.timing || "—"}</strong></div>
          <div><span>Prioridades</span><strong>{answers.priorities.join(" + ") || "—"}</strong></div>
          <div><span>Estágio</span><strong>{answers.stage || "—"}</strong></div>
          <div><span>Faixa</span><strong>{answers.value || "Não informada"}</strong></div>
        </div>
        <div className="insight-card"><span>O QUE ISSO INDICA</span>{insights.map((x) => <p key={x}>{x}</p>)}</div>
        <div className="insight-card insight-card--muted"><span>O QUE AINDA PRECISAMOS ENTENDER</span><p>Faixa de valor, disponibilidade financeira e grau de flexibilidade podem mudar bastante os caminhos possíveis. Esta leitura organiza o ponto de partida; ela não recomenda automaticamente nenhum produto.</p></div>
        <p className="legal-note">Esta leitura é informativa e representa apenas uma organização inicial das informações fornecidas por você. Não constitui recomendação de investimento, concessão ou oferta de crédito, nem indicação automática de produto financeiro.</p>
        <button className="btn quiz-next" type="button" onClick={() => setStep((s) => s + 1)}>Quero organizar os caminhos →</button>
      </>;
    }

    if (mappedStep === "lead") return <>
      <p className="quiz-kicker">CONTINUIDADE</p><h2>Salve seu atendimento e continue daqui.</h2>
      <p className="quiz-intro">Esses dados permitem registrar seu ponto de partida e retomar seu objetivo sem que você precise começar novamente.</p>
      <form className="lead-form" onSubmit={handleLead}>
        <label>Nome<input required value={lead.name} onChange={(e) => setLead((l) => ({ ...l, name: e.target.value }))} placeholder="Seu nome" /></label>
        <label>E-mail<input required type="email" value={lead.email} onChange={(e) => setLead((l) => ({ ...l, email: e.target.value }))} placeholder="voce@exemplo.com" /></label>
        <label>WhatsApp<input required value={lead.phone} onChange={(e) => setLead((l) => ({ ...l, phone: e.target.value }))} placeholder="(00) 00000-0000" /></label>
        <label className="check-row"><input type="checkbox" checked={lead.marketing} onChange={(e) => setLead((l) => ({ ...l, marketing: e.target.checked }))} /><span>Quero receber conteúdos e novidades da ME WE CHOICE.</span></label>
        <p className="privacy-copy">Usaremos seus dados para registrar este atendimento e permitir a continuidade relacionada a este objetivo. A integração real com CRM e e-mail será conectada antes do lançamento comercial.</p>
        <button className="btn" type="submit">Salvar e continuar →</button>
      </form>
    </>;

    if (mappedStep === "next") return <>
      <p className="quiz-kicker">PRÓXIMO PASSO</p><h2>{saved ? "Seus dados foram salvos." : "Como você prefere continuar?"}</h2>
      <p className="quiz-intro">O que você prefere fazer agora?</p>
      {!nextChoice && <div className="next-grid">
        <button type="button" onClick={() => chooseNext("whatsapp")}><strong>Conversar agora</strong><span>WhatsApp →</span><small>Canal será conectado antes do lançamento.</small></button>
        <button type="button" onClick={() => chooseNext("schedule")}><strong>Escolher um horário</strong><span>Agendar →</span><small>Agenda será integrada na próxima etapa.</small></button>
        <button type="button" onClick={() => chooseNext("later")}><strong>Continuar depois</strong><span>Quero analisar primeiro →</span><small>Você escolhe quando retomamos.</small></button>
      </div>}
      {nextChoice === "later" && !followUp && <div className="followup-box"><h3>Quando podemos retomar este assunto?</h3>{["Daqui a 3 dias", "Na próxima semana", "Daqui a 30 dias", "Prefiro entrar em contato quando estiver pronto"].map((item) => optionButton(item, false, () => saveFollowUp(item), item))}</div>}
      {nextChoice && nextChoice !== "later" && <div className="stage-message"><strong>Fluxo preparado.</strong><p>Esta rota está pronta para receber a integração do canal oficial antes do lançamento comercial.</p></div>}
      {followUp && <div className="stage-message"><strong>Preferência registrada.</strong><p>{followUp === "Prefiro entrar em contato quando estiver pronto" ? "Nenhum follow-up proativo será feito neste protótipo." : `Preferência de retomada: ${followUp}.`}</p></div>}
      <p className="choice-note">Sem pressão. No seu momento. A escolha continua sendo sua.</p>
    </>;

    return null;
  };

  return (
    <div className="quiz-overlay" role="dialog" aria-modal="true" aria-label="Diagnóstico ME WE CHOICE">
      <div className="quiz-shell">
        <div className="quiz-header">
          <BrandMark compact />
          <div className="quiz-progress"><span>{mappedStep === "result" || mappedStep === "lead" || mappedStep === "next" ? "PONTO DE PARTIDA" : `${coreIndex} / ${totalCoreSteps}`}</span><div><i style={{ width: `${Math.min((coreIndex / totalCoreSteps) * 100, 100)}%` }} /></div></div>
          <button type="button" className="quiz-close" onClick={onClose} aria-label="Fechar diagnóstico">×</button>
        </div>
        <div className="quiz-body">
          {step > 0 && mappedStep !== "next" && <button type="button" className="quiz-back" onClick={goBack}>← Voltar</button>}
          {render()}
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  const [quizOpen, setQuizOpen] = useState(false);
  const [fastTrack, setFastTrack] = useState(false);

  return (
    <main>
      <header className="site-header shell">
        <a href="#top" className="logo-link"><BrandMark compact /></a>
        <nav className="nav" aria-label="Navegação principal">
          <a href="#metodo">Nosso método</a>
          <a href="#processo">Como funciona</a>
          <a href="#transparencia">Transparência</a>
        </nav>
        <button className="header-consult" type="button" onClick={() => setFastTrack(true)}>Falar com um consultor →</button>
      </header>

      <section id="top" className="hero shell">
        <div className="hero-copy">
          <p className="eyebrow">ME → WE → CHOICE</p>
          <h1>PRIMEIRO O PROJETO.<br />DEPOIS, A SOLUÇÃO.</h1>
          <p className="hero-lead">Organizamos objetivos, possibilidades e caminhos para decisões de aquisição, patrimônio e projetos pessoais.</p>
          <div className="hero-actions">
            <button className="btn" type="button" onClick={() => setQuizOpen(true)}>O que você quer realizar? →</button>
            <a className="text-link" href="#processo">Entenda como funciona ↓</a>
          </div>
          <button type="button" className="hero-fast" onClick={() => setFastTrack(true)}>Já sabe o que procura? <strong>Fale com um consultor →</strong></button>
        </div>
        <div className="hero-panel">
          <div className="vertical-journey">
            <div className="mini-card mini-card--me"><span>ME</span><strong>O projeto é seu.</strong></div>
            <div className="mini-arrow mini-arrow--one">↓</div>
            <div className="mini-card mini-card--we"><span>WE</span><strong>Construímos juntos.</strong></div>
            <div className="mini-arrow mini-arrow--two">↓</div>
            <div className="mini-card mini-card--choice"><span>CHOICE</span><strong>A escolha é sua.</strong></div>
          </div>
        </div>
      </section>

      <section className="clarity-band">
        <div className="shell clarity-inner">
          <p className="eyebrow">CLAREZA ANTES DA ESCOLHA</p>
          <h2>Entendemos seu objetivo, seu momento e suas prioridades.</h2>
          <p>Depois organizamos caminhos possíveis para que a decisão faça sentido para você.</p>
        </div>
      </section>

      <section id="metodo" className="section section--dark">
        <div className="shell">
          <div className="section-heading section-heading--light">
            <p className="eyebrow eyebrow--light">NOSSO MÉTODO</p>
            <h2>ME → WE → CHOICE</h2>
            <p>Você traz o objetivo. Nós construímos possibilidades juntos. A escolha continua sendo sua.</p>
          </div>
          <MethodJourney />
        </div>
      </section>

      <section id="processo" className="section shell">
        <div className="section-heading">
          <p className="eyebrow">COMO TRABALHAMOS</p>
          <h2>A solução vem depois da clareza.</h2>
          <p>ME → WE → CHOICE descreve nossa relação com você. Entender → Organizar → Avaliar descreve como trabalhamos.</p>
        </div>
        <ProcessFlow />
        <p className="process-note">Nem todo projeto pede a mesma solução. Nem toda decisão precisa acontecer agora.</p>
      </section>

      <section id="transparencia" className="section transparency-section">
        <div className="shell transparency-grid">
          <div>
            <p className="eyebrow">TRANSPARÊNCIA COMERCIAL</p>
            <h2>Diferentes objetivos podem ter diferentes caminhos.</h2>
          </div>
          <div className="transparency-copy">
            <p>Dependendo do objetivo e do momento, podem existir alternativas de aquisição planejada, consórcio, crédito ou outras soluções disponíveis por meio de parceiros.</p>
            <p>Nosso papel é organizar possibilidades e avaliar, entre os caminhos disponíveis em nossa atuação, quais merecem ser considerados.</p>
            <div className="transparency-callout">Sempre deixamos claro quem oferece a solução e qual é nossa relação comercial com esse parceiro.</div>
          </div>
        </div>
      </section>

      <section className="section shell trust-section">
        <div className="section-heading">
          <p className="eyebrow">POR QUE FAZEMOS DIFERENTE?</p>
          <h2>Confiança construída no processo.</h2>
        </div>
        <div className="trust-grid">
          <article><span>01</span><h3>Começamos pelo objetivo</h3><p>Não por um produto pré-selecionado.</p></article>
          <article><span>02</span><h3>Mostramos nossa relação com a solução</h3><p>Você sabe quem oferece e qual é nosso papel.</p></article>
          <article><span>03</span><h3>Você mantém a decisão</h3><p>Organizamos caminhos. A escolha permanece sua.</p></article>
        </div>
      </section>

      <section id="diagnostico" className="diagnostic-section">
        <div className="shell diagnostic-card">
          <div>
            <p className="eyebrow eyebrow--light">SEU PONTO DE PARTIDA</p>
            <h2>O que você quer realizar?</h2>
            <p>Em poucos passos, organize objetivo, momento e prioridades. Você recebe a leitura inicial antes de informar seus dados.</p>
          </div>
          <div className="diagnostic-actions">
            <button className="btn" type="button" onClick={() => setQuizOpen(true)}>Começar agora →</button>
            <span>≈ 30–45 segundos</span>
          </div>
        </div>
      </section>

      <footer className="footer shell">
        <div><BrandMark compact /><p>Primeiro o projeto. Depois, a solução.</p></div>
        <nav><a href="https://instagram.com/mewechoice" target="_blank" rel="noreferrer">Instagram</a><button type="button" onClick={() => setFastTrack(true)}>Contato</button><a href="#privacidade">Privacidade</a></nav>
        <p className="footer-right">Planejamento para escolhas que fazem sentido.<br />© 2026 ME WE CHOICE</p>
      </footer>
      <div id="privacidade" className="privacy-strip"><div className="shell"><strong>Privacidade:</strong> esta V3.3 é um protótipo de pré-lançamento. O diagnóstico salva dados apenas no navegador para teste; CRM, e-mail e canais oficiais serão conectados antes do lançamento comercial.</div></div>

      {quizOpen && <Quiz onClose={() => setQuizOpen(false)} />}
      {fastTrack && <div className="modal-overlay" role="dialog" aria-modal="true"><div className="fast-modal"><button className="modal-close" type="button" onClick={() => setFastTrack(false)}>×</button><p className="eyebrow">FAST-TRACK</p><h2>Já sabe o que procura?</h2><p>Podemos ir direto à conversa. O canal oficial de WhatsApp será conectado antes do lançamento comercial.</p><button className="btn" type="button" onClick={() => { setFastTrack(false); setQuizOpen(true); }}>Enquanto isso, organizar meu ponto de partida →</button></div></div>}
    </main>
  );
}
