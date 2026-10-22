import Link from "next/link";

export function PreviewHeader({ preview = true }: { preview?: boolean }) {
  const base = preview ? "/experiencia-031" : "";
  const homeHref = base || "/";
  return <>
    <a className="s31-skip" href="#conteudo">Pular para o conteúdo</a>
    {preview ? <div className="s31-preview-strip" role="status">Prévia de desenvolvimento SITE-031 · Não publicada · Identidade V03 preservada</div> : null}
    <header className="s31-header">
      <div className="s31-wrap s31-header-inner">
        <Link href={homeHref} className="s31-brand" aria-label="MWeC, página inicial">
          <img src="/site031/v03-logo-claro-preview.webp" alt="MWeC — identidade gráfica V03" width="250" height="58" />
        </Link>
        <nav aria-label="Navegação principal da prévia" className="s31-nav">
          <Link href={homeHref}>Início</Link>
          <Link href={`${homeHref}#sobre`}>Conhecer a MWeC</Link>
          <Link href={`${homeHref}#filosofia`}>Filosofia</Link>
          <Link href={`${base}/explore`}>Explore</Link>
        </nav>
        <Link href={`${base}/explore`} className="s31-header-cta">Explorar conteúdos <span aria-hidden="true">↗</span></Link>
      </div>
    </header>
  </>;
}

export function PreviewFooter({ preview = true }: { preview?: boolean }) {
  const base = preview ? "/experiencia-031" : "";
  const homeHref = base || "/";
  return <footer className="s31-footer"><div className="s31-wrap s31-footer-grid">
    <div><strong>MWeC</strong><p>ME → WE → CHOICE</p><small>Primeiro o projeto. Depois, a solução.</small></div>
    <div><Link href={homeHref}>Início</Link><Link href={`${base}/explore`}>Explore</Link><Link href={`${homeHref}#sobre`}>Conhecer a MWeC</Link></div>
    <p className="s31-footer-note">Conteúdo educacional. Não constitui aconselhamento personalizado, oferta de produtos nem indicação de investimentos.</p>
  </div></footer>;
}

export function PublicationNotice({ short = false }: { short?: boolean }) {
  return <p className="s31-publication-notice">{short ? "Somente artigos com publicação editorial aprovada são exibidos." : "Os artigos históricos permanecem sob revisão editorial e não são apresentados como publicações definitivas nesta biblioteca."}</p>;
}