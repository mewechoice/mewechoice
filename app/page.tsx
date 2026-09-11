const projects = [
  ["Imóvel", "Comprar, construir, reformar ou mudar."],
  ["Veículo", "Trocar, adquirir ou organizar o próximo passo."],
  ["Viagem", "Planejar o tempo, o orçamento e as escolhas."],
  ["Educação", "Cursos, formação, intercâmbio e novos ciclos."],
  ["Negócio", "Estruturar uma ideia antes de escolher a solução."],
  ["Outro projeto", "Conte o que você quer realizar. O ponto de partida é você."],
];

const method = [
  ["ME", "O projeto é seu.", "Começamos entendendo sua realidade, seus objetivos e o momento certo."],
  ["WE", "Construímos juntos.", "Organizamos possibilidades com clareza, sem começar por uma solução pronta."],
  ["CHOICE", "A escolha é sua.", "Depois de entender o cenário, você decide com mais segurança e autonomia."],
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
          <a href="#projetos">Projetos</a>
          <a href="#metodo">Como funciona</a>
          <a href="#sobre">Sobre</a>
        </nav>
        <a className="btn btn--small" href="#contato">Conte seu projeto</a>
      </header>

      <section id="top" className="hero shell">
        <div className="hero-copy">
          <p className="eyebrow">PROJETOS • PLANEJAMENTO • ESCOLHAS</p>
          <BrandMark />
          <h1>PRIMEIRO O PROJETO.<br />DEPOIS, A SOLUÇÃO.</h1>
          <p className="hero-lead">Planejamento para escolhas que fazem sentido — sem começar pela solução antes de entender o que você realmente quer construir.</p>
          <div className="hero-actions">
            <a className="btn" href="#contato">Conte seu projeto</a>
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
          <p>Mais que soluções.</p>
          <p>Mais possibilidades para a sua história.</p>
          <p>Planejamento com clareza.</p>
        </div>
      </section>

      <section id="projetos" className="section shell">
        <div className="section-heading">
          <p className="eyebrow">QUAL É O SEU PROJETO?</p>
          <h2>O ponto de partida não é o produto.<br />É aquilo que você quer realizar.</h2>
          <p>Os exemplos abaixo são apenas alguns caminhos. A ME → WE → CHOICE existe para começar pela sua intenção e organizar possibilidades antes de falar em solução.</p>
        </div>
        <div className="project-grid">
          {projects.map(([title, copy], index) => (
            <article className="project-card" key={title}>
              <span className="project-number">0{index + 1}</span>
              <h3>{title}</h3>
              <p>{copy}</p>
              <span className="project-arrow">→</span>
            </article>
          ))}
        </div>
      </section>

      <section id="metodo" className="section section--dark">
        <div className="shell">
          <div className="section-heading section-heading--light">
            <p className="eyebrow eyebrow--light">ME → WE → CHOICE</p>
            <h2>Uma jornada simples para decisões mais conscientes.</h2>
          </div>
          <div className="method-grid">
            {method.map(([label, title, copy], index) => (
              <article className={`method-card method-card--${index + 1}`} key={label}>
                <div className="method-top"><span>{label}</span><b>{index < 2 ? "→" : "✓"}</b></div>
                <h3>{title}</h3>
                <p>{copy}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="sobre" className="section shell split-section">
        <div>
          <p className="eyebrow">POR QUE EXISTIMOS</p>
          <h2>Entender antes de recomendar.</h2>
        </div>
        <div className="split-copy">
          <p>Nem todo projeto precisa da mesma solução. Nem toda decisão precisa acontecer agora.</p>
          <p>A proposta da ME → WE → CHOICE é organizar o cenário, esclarecer possibilidades e permitir que a escolha venha depois do entendimento — não antes.</p>
          <blockquote>“Primeiro o projeto. Depois, a solução.”</blockquote>
        </div>
      </section>

      <section id="contato" className="cta-section">
        <div className="shell cta-card">
          <div>
            <p className="eyebrow eyebrow--light">VAMOS PLANEJAR MELHOR?</p>
            <h2>Conte seu projeto.</h2>
            <p>Por enquanto, esta primeira versão do site está em construção. O canal de contato será conectado quando você decidir o fluxo oficial de atendimento.</p>
          </div>
          <button className="btn btn--disabled" type="button" disabled>Canal de contato em breve</button>
        </div>
      </section>

      <footer className="footer shell">
        <BrandMark compact />
        <p>Primeiro o projeto. Depois, a solução.</p>
        <p className="footer-handle">@mewechoice</p>
      </footer>
    </main>
  );
}
