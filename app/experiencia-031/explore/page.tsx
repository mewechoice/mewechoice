import Link from "next/link";
import { PreviewFooter, PreviewHeader, PublicationNotice } from "../components";
import { getPublishedSite031Articles, site031Topic, SITE031_TOPICS } from "../site031-editorial";

const base = "/experiencia-031/explore";

type SearchInput = { q?: string; categoria?: string };
export default async function Site031Explore({searchParams}:{searchParams: Promise<SearchInput>}) {
  const params = await searchParams;
  const q = typeof params.q === "string" ? params.q.trim().slice(0, 100) : "";
  const categoria = typeof params.categoria === "string" ? params.categoria : "";
  const articles = getPublishedSite031Articles().filter((a) =>
    (!categoria || site031Topic(a) === categoria) &&
    (!q || `${a.headline} ${a.deck} ${a.sections.map(s => s.heading).join(" ")}`.toLocaleLowerCase("pt-BR").includes(q.toLocaleLowerCase("pt-BR")))
  );
  return <>
    <PreviewHeader />
    <main id="conteudo">
      <section className="s31-explore-hero"><div className="s31-wrap"><p className="s31-kicker">MWeC / BIBLIOTECA EDUCACIONAL</p><h1>Explore<span>.</span></h1><p>Uma biblioteca para aprender, questionar e desenvolver sua própria compreensão sobre o dinheiro e os investimentos.</p><small>Antes da Escolha · Leitura no seu ritmo</small></div></section>
      <section className="s31-library s31-section"><div className="s31-wrap">
        <div className="s31-heading-row"><div><p className="s31-eyebrow">CATÁLOGO DE ARTIGOS</p><h2>Um assunto de cada vez.</h2></div><p>Informação com contexto, sem recomendações de produtos.</p></div>
        <form className="s31-filters" method="get" action={base} role="search">
          <label htmlFor="s31-search">Pesquisar conteúdos</label>
          <div className="s31-filter-row"><input id="s31-search" name="q" type="search" defaultValue={q} placeholder="Busque por temas ou perguntas" maxLength={100} />
          <label htmlFor="s31-category" className="s31-visually-hidden">Filtrar por categoria</label><select id="s31-category" name="categoria" defaultValue={categoria}><option value="">Todas as categorias</option>{SITE031_TOPICS.map((t)=><option key={t} value={t}>{t}</option>)}</select><button type="submit">Pesquisar</button></div>
        </form>
        <div className="s31-categories" aria-label="Temas candidatos">{SITE031_TOPICS.map(t=><span key={t}>{t}</span>)}</div>
        <PublicationNotice />
        {articles.length ? <div className="s31-feature-grid">{articles.map(a=><Link className="s31-article-card" key={a.id} href={`${base}/${a.slug}`}><small>{site031Topic(a)} · {a.readingTimeEstimate}</small><h3>{a.headline}</h3><p>{a.deck}</p><span aria-hidden="true">→</span></Link>)}</div> : <div className="s31-empty"><h3>{q || categoria ? "Nenhum artigo aprovado encontrado para esse filtro." : "Estamos preparando as próximas leituras."}</h3><p>O catálogo mostra apenas materiais que passaram pela aprovação editorial. As categorias acima são uma proposta de navegação, não uma lista de artigos publicados.</p>{q || categoria ? <Link className="s31-inline-link" href={base}>Limpar filtros →</Link> : null}</div>}
        <aside className="s31-ad-placeholder" aria-label="Espaço reservado para publicidade"><strong>Espaço reservado para publicidade</strong><p>Área de demonstração. Nenhuma rede de anúncios está instalada ou ativa.</p></aside>
      </div></section>
    </main>
    <PreviewFooter />
  </>;
}