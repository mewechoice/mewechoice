import Link from "next/link";
import { PreviewFooter, PreviewHeader } from "./components";
import { getPublishedSite031Articles } from "./site031-editorial";

export default function Site031Home({ preview = false }: { preview?: boolean }) {
  const base = preview ? "/experiencia-031" : "";
  const articles = getPublishedSite031Articles().slice(0, 3);
  return <>
    <PreviewHeader preview={preview} />
    <main id="conteudo">
      <section className="s31-hero" aria-labelledby="s31-hero-title">
        <div className="s31-hero-photo" role="img" aria-label="Mesa de trabalho diante de uma vista urbana ao entardecer" />
        <div className="s31-wrap s31-hero-inner">
          <div className="s31-hero-copy">
            <p className="s31-kicker">CONHECIMENTO · ORGANIZAÇÃO · AUTONOMIA</p>
            <img className="s31-hero-logo" src="/site031/v03-logo-escuro-preview.webp" width="420" height="101" alt="Logotipo V03 da MWeC, MW, seta híbrida azul e C" />
            <p className="s31-small-philosophy">ME → WE → CHOICE</p>
            <h1 id="s31-hero-title">Primeiro o projeto.<br/><em>Depois, a solução.</em></h1>
            <p className="s31-hero-lead">Educação financeira e investimentos explicados com clareza, para fazer mais sentido no seu dia a dia.</p>
            <div className="s31-hero-actions">
              <Link className="s31-button" href={`${base}/explore`}>Explorar conteúdos <span aria-hidden="true">→</span></Link>
              <Link className="s31-button-secondary" href="#sobre">Conhecer a MWeC <span aria-hidden="true">↘</span></Link>
            </div>
          </div>
        </div>
      </section>

      <section id="sobre" className="s31-section s31-about"><div className="s31-wrap s31-about-grid">
        <div><p className="s31-eyebrow">SOBRE A MWeC</p><h2>Conhecimento que se aproxima da vida real.</h2></div>
        <div><p className="s31-large-body">A MWeC é um espaço para aprender sobre educação financeira e investimentos de forma simples, clara e didática. Queremos tornar o conhecimento mais próximo do cotidiano e ajudar cada pessoa a desenvolver compreensão, organização e autonomia para suas escolhas.</p><Link className="s31-inline-link" href={`${base}/explore`}>Conheça nossos conteúdos <span aria-hidden="true">→</span></Link></div>
      </div></section>

      <section id="filosofia" className="s31-section s31-philosophy"><div className="s31-wrap">
        <p className="s31-eyebrow">NOSSA FILOSOFIA</p><h2>Da sua realidade às suas escolhas.</h2>
        <div className="s31-principles">
          <article><span>01 / ME</span><h3>Começa por você.</h3><p>Seu momento, suas perguntas e os objetivos que fazem sentido para sua vida.</p></article>
          <article><span>02 / WE</span><h3>Aprendemos juntos.</h3><p>Informação organizada, exemplos claros e espaço para construir compreensão.</p></article>
          <article><span>03 / CHOICE</span><h3>A escolha é sua.</h3><p>Mais entendimento e autonomia para tomar decisões com consciência.</p></article>
        </div>
      </div></section>

      <section className="s31-section s31-learning"><div className="s31-wrap s31-learning-grid">
        <div><p className="s31-eyebrow">NOSSA PROPOSTA EDUCACIONAL</p><h2>Compreender é o primeiro passo.</h2><p>Sem atalhos, promessas de resultado ou soluções prontas. Começamos pelos fundamentos e avançamos conforme o entendimento.</p></div>
        <div className="s31-topic-list"><div><span>01</span>Organização do dinheiro</div><div><span>02</span>Planejamento financeiro</div><div><span>03</span>Fundamentos dos investimentos</div><div><span>04</span>Escolhas financeiras conscientes</div></div>
      </div></section>

      <section className="s31-section s31-featured"><div className="s31-wrap">
        <div className="s31-heading-row"><div><p className="s31-eyebrow">EXPLORE</p><h2>Conteúdos para descobrir.</h2></div><Link href={`${base}/explore`} className="s31-inline-link">Ver biblioteca <span aria-hidden="true">→</span></Link></div>
        {articles.length ? <div className="s31-feature-grid">{articles.map((a) => <Link href={`${base}/explore/${a.slug}`} className="s31-article-card" key={a.id}><small>LEITURA · {a.readingTimeEstimate}</small><h3>{a.headline}</h3><p>{a.deck}</p><span aria-hidden="true">→</span></Link>)}</div> : <div className="s31-coming-soon"><p className="s31-eyebrow">BIBLIOTECA EM PREPARAÇÃO</p><h3>As próximas leituras estão em revisão.</h3><p>Estamos organizando os conteúdos com critérios editoriais antes de disponibilizá-los como artigos definitivos.</p><Link className="s31-inline-link" href={`${base}/explore`}>Explorar categorias <span aria-hidden="true">→</span></Link></div>}
      </div></section>
      <section className="s31-cta-bottom"><div className="s31-wrap"><p>O próximo passo pode ser uma boa pergunta.</p><h2>Explore no seu tempo.</h2><Link className="s31-button" href={`${base}/explore`}>Explorar conteúdos <span aria-hidden="true">→</span></Link></div></section>
    </main>
    <PreviewFooter preview={preview} />
  </>;
}