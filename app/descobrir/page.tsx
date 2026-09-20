import Link from "next/link";
import { EDITORIAL_ARTICLES, EDITORIAL_HYPOTHESES } from "../../lib/editorial/registry";

export default function DescobrirPage() {
  return (
    <main className="editorial-page">
      <header className="editorial-nav shell">
        <Link href="/" className="editorial-brand">ME → <b>WE</b> → CHOICE<small>PRIMEIRO O PROJETO. DEPOIS, A SOLUÇÃO.</small></Link>
        <nav aria-label="Navegação principal">
          <Link href="/">Início</Link>
          <Link href="/#diagnostico">Meu Projeto</Link>
          <strong>{EDITORIAL_HYPOTHESES.navigationLabel}</strong>
        </nav>
        <Link className="editorial-consult" href="/#diagnostico">Falar com um consultor →</Link>
      </header>

      <section className="editorial-visual-hero">
        <div className="shell editorial-visual-copy">
          <p className="eyebrow">{EDITORIAL_HYPOTHESES.navigationLabel}</p>
          <h1>{EDITORIAL_HYPOTHESES.masthead}</h1>
          <p>Histórias, explicações e perguntas para enxergar melhor o que existe por trás de decisões e projetos. Sem pressa. No seu tempo.</p>
          <div className="editorial-values" aria-label="Princípios editoriais">
            <span>Informação com contexto</span><span>Diferentes perspectivas</span><span>Mais clareza para o seu projeto</span>
          </div>
        </div>
        <div className="editorial-visual-quote" aria-hidden="true">Grandes escolhas<br/>começam com<br/>boas perguntas.</div>
      </section>

      <section className="editorial-featured shell" aria-label="Artigos em destaque">
        <div className="editorial-section-head">
          <div><p className="eyebrow">ARTIGOS EM DESTAQUE</p><h2>Temas reais para decisões mais conscientes.</h2></div>
        </div>
        <div className="editorial-card-grid">
          {EDITORIAL_ARTICLES.map((a,index)=><Link className={"editorial-story editorial-story--"+(index+1)} href={"/descobrir/"+a.slug} key={a.id}>
            <div className="editorial-story-image" aria-hidden="true" />
            <div className="editorial-story-body">
              <div className="editorial-story-meta"><span>{a.topicId.replace("editorial:","")}</span><small>{a.readingTimeEstimate} de leitura</small></div>
              <h3>{a.headline}</h3><p>{a.deck}</p><b aria-hidden="true">→</b>
            </div>
          </Link>)}
        </div>
      </section>

      <section className="editorial-deeper">
        <div className="shell">
          <p className="eyebrow">EXPLORE MAIS</p><h2>Novas perspectivas,<br/>o mesmo propósito.</h2>
          <p>Um espaço para pensar, comparar e construir suas próprias perspectivas.</p>
        </div>
      </section>

      <section className="editorial-project shell">
        <div><p className="eyebrow">SEU PROJETO</p><h2>Quer organizar suas próprias informações?</h2><p>Meu Projeto começa neutro. Nada do que você leu aqui escolhe um caminho ou preenche suas respostas.</p></div>
        <Link className="btn" href="/#diagnostico">Ir para Meu Projeto</Link>
      </section>
    </main>
  );
}
