const projects = [
  ["Imóvel", "Comprar, construir, reformar ou investir.", "Comprar", "Construir", "Reformar", "Investir"],
  ["Veículo", "Trocar, adquirir ou planejar sua próxima mobilidade.", "Comprar", "Trocar", "Planejar"],
  ["Viagem", "Transformar um destino em um projeto possível.", "Nacional", "Internacional", "Intercâmbio"],
  ["Educação", "Planejar formação, especialização ou um novo ciclo.", "Graduação", "Curso", "Especialização", "Intercâmbio"],
  ["Negócio", "Organizar uma ideia, expansão ou aquisição antes da solução.", "Começar", "Expandir", "Estruturar"],
  ["Outro projeto", "Conte o que você quer realizar. O ponto de partida é você.", "Quero contar meu projeto"],
];

const method = [
  ["ME", "O projeto é seu.", "Entendemos seu objetivo, seu momento, prazo e prioridades."],
  ["WE", "Construímos juntos.", "Organizamos cenários e possibilidades com clareza, sem começar por uma solução pronta."],
  ["CHOICE", "A escolha é sua.", "Você decide o caminho com mais clareza, segurança e autonomia."],
];

function BrandMark({ compact = false }: { compact?: boolean }) {
  return (
    <div className={`brand-mark ${compact ? "brand-mark--compact" : ""}`} aria-label="ME WE CHOICE">
      <span>ME</span><b>→</b><span className="brand-we">WE</span><b className="brand-arrow-two">→</b><span>CHOICE</span>
    </div>
  );
}

export default function Home() {
  return (
    <main>
      <header className="site-header shell">
        <a href="#top" className="logo-link"><BrandMark compact /></a>
        <nav className="nav" aria-label="Navegação principal">
          <a href="#proposito">Propósito</a>
          <a href="#projetos">Projetos</a>
          <a href="#metodo">Como funciona</a>
          <a href="#sobre">Sobre</a>
        </nav>
        <a className="btn btn--small" href="#diagnostico">Conte seu projeto</a>
      </header>

      <section id="top" className="hero shell">
        <div className="hero-copy">
          <p className="eyebrow">PROJETOS • PLANEJAMENTO • ESCOLHAS</p>
          <BrandMark />
          <h1>PRIMEIRO O PROJETO.<br />DEPOIS, A SOLUÇÃO.</h1>
          <p className="hero-lead">Planejamento para escolhas que fazem sentido — sem começar pela solução antes de entender o que você realmente quer realizar.</p>
          <div className="hero-actions">
            <a className="btn" href="#diagnostico">Conte seu projeto</a>
            <a className="text-link" href="#metodo">Entenda o método <span>→</span></a>
          </div>
        </div>
        <div className="hero-panel" aria-hidden="true">
          <div className="journey-card journey-card--me"><span>ME</span><small>O projeto é seu.</small></div>
          <div className="journey-line" />
          <div className="journey-card journey-card--we"><span>WE</span><small>Construímos juntos.</small></div>
          <div className="journey-line journey-line--two" />
          <div className="journey-card journey-card--choice"><span>CHOICE</span><small>A escolha é sua.</small></div>
        </div>
      </section>

      <section className="promise-band">
        <div className="shell promise-grid">
          <p>Mais que soluções.</p><p>Mais possibilidades para a sua história.</p><p>Planejamento com clareza.</p>
        </div>
      </section>

      <section id="proposito" className="purpose section shell">
        <div className="purpose-kicker">
          <p className="eyebrow">PLANEJAMENTO COM PROPÓSITO</p>
          <h2>Clareza antes da escolha.</h2>
        </div>
        <div className="purpose-copy">
          <p>Organizamos objetivos, possibilidades e caminhos para ajudar você a tomar decisões de aquisição de forma mais consciente.</p>
          <p className="purpose-note">Não começamos perguntando qual produto você quer. Começamos entendendo <strong>o que você quer realizar.</strong></p>
        </div>
      </section>

      <section id="projetos" className="section shell">
        <div className="section-heading">
          <p className="eyebrow">QUAL É O SEU PROJETO?</p>
          <h2>O ponto de partida não é o produto.<br />É aquilo que você quer realizar.</h2>
          <p>Estes são alguns territórios possíveis. O projeto vem primeiro; a solução só entra na conversa depois que o cenário estiver claro.</p>
        </div>
        <div className="project-grid">
          {projects.map(([title, copy], index) => (
            <a className="project-card" href="#diagnostico" key={title}>
              <span className="project-number">0{index + 1}</span>
              <h3>{title}</h3><p>{copy}</p><span className="project-arrow">→</span>
            </a>
          ))}
        </div>
      </section>

      <section id="metodo" className="section section--dark">
        <div className="shell">
          <div className="section-heading section-heading--light">
            <p className="eyebrow eyebrow--light">NOSSO MÉTODO</p>
            <h2>ME → WE → CHOICE</h2>
            <p>Uma jornada simples para decisões mais conscientes.</p>
          </div>
          <div className="method-grid">
            {method.map(([label, title, copy], index) => (
              <article className={`method-card method-card--${index + 1}`} key={label}>
                <div className="method-top"><span>{label}</span><b>{index < 2 ? "→" : "✓"}</b></div>
                <h3>{title}</h3><p>{copy}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="sobre" className="section shell split-section">
        <div><p className="eyebrow">POR QUE EXISTIMOS</p><h2>Entender antes de recomendar.</h2></div>
        <div className="split-copy">
          <p>Nem todo projeto precisa da mesma solução. Nem toda decisão precisa acontecer agora.</p>
          <p>A ME → WE → CHOICE organiza o cenário, esclarece possibilidades e permite que a escolha venha depois do entendimento — não antes.</p>
          <blockquote>“Primeiro o projeto. Depois, a solução.”</blockquote>
        </div>
      </section>

      <section id="diagnostico" className="diagnostic-section">
        <div className="shell">
          <div className="diagnostic-intro">
            <p className="eyebrow eyebrow--light">SEU PROJETO COMEÇA AQUI</p>
            <h2>O que você quer realizar?</h2>
            <p>Escolha um ponto de partida. Nesta versão, a seleção leva ao próximo passo da conversa; o diagnóstico completo será conectado ao fluxo oficial de atendimento.</p>
          </div>
          <div className="diagnostic-grid">
            {projects.map(([title, , ...options]) => (
              <details className="diagnostic-card" key={title}>
                <summary><span>{title}</span><b>+</b></summary>
                <div className="diagnostic-options">
                  {options.map((option) => <span key={option}>{option}</span>)}
                </div>
              </details>
            ))}
          </div>
          <div className="diagnostic-finish">
            <p><strong>Seu projeto começa aqui.</strong><br />Vamos organizar os caminhos possíveis antes de falar em solução.</p>
            <button className="btn btn--disabled" type="button" disabled>Canal de atendimento em breve</button>
          </div>
        </div>
      </section>

      <footer className="footer shell">
        <BrandMark compact /><p>Primeiro o projeto. Depois, a solução.</p><p className="footer-handle">@mewechoice</p>
      </footer>
    </main>
  );
}
