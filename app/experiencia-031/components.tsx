import Link from "next/link";

const base = "/experiencia-031";

export function PreviewHeader() {
  return <>
    <a className="s31-skip" href="#conteudo">Pular para o conteúdo</a>
    <div className="s31-preview-strip" role="status">Prévia de desenvolvimento SITE-031 · Não publicada · Identidade V03 preservada</div>
    <header className="s31-header">
      <div className="s31-wrap s31-header-inner">
        <Link href={base} className="s31-brand" aria-label="MWeC, página inicial da prévia">
          <img src="/site031/v03-logo-claro-preview.webp" alt="MWeC — identidade gráfica V03" width="250" height="58" />
        </Link>
        <nav aria-label="Navegação principal da prévia" className="s31-nav">
          <Link href={base}>Início</Link>
          <Link href={`${base}/#sobre`}>Conhecer a MWeC</Link>
          <Link href={`${base}/#filosofia`}>Filosofia</Link>
          <Link href={`${base}/explore`}>Explore</Link>
        </nav>
        <Link href={`${base}/explore`} className="s31-header-cta">Explorar conteúdos <span aria-hidden="true">↗</span></Link>
      </div>
    </header>
  </>;
}

export function PreviewFooter() {
  return <footer className="s31-footer"><div className="s31-wrap s31-footer-grid">
    <div><strong>MWeC</strong><p>ME → WE → CHOICE</p><small>Primeiro o projeto. Depois, a solução.</small></div>
    <div><Link href={base}>Início</Link><Link href={`${base}/explore`}>Explore</Link><Link href={`${base}/#sobre`}>Conhecer a MWeC</Link></div>
    <p className="s31-footer-note">Ambiente isolado de prévia. O conteúdo é educacional, não constitui aconselhamento personalizado, oferta de produtos nem indicação de investimentos.</p>
  </div></footer>;
}

export function PublicationNotice({ short = false }: { short?: boolean }) {
  return <p className="s31-publication-notice">{short ? "Somente artigos com publicação editorial aprovada são exibidos." : "Os artigos históricos permanecem sob revisão editorial e não são apresentados como publicações definitivas nesta prévia."}</p>;
}