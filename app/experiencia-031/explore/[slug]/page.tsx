import Link from "next/link";
import { notFound } from "next/navigation";
import { getEditorialArticle, getRelatedArticles } from "../../../../lib/editorial/registry";
import { PreviewFooter, PreviewHeader } from "../../components";
import { getPublishedSite031Articles, site031Topic } from "../../site031-editorial";

const base = "/experiencia-031/explore";
export default async function Site031Article({ params }: {params: Promise<{slug:string}>}) {
  const { slug } = await params;
  const article = getEditorialArticle(slug);
  const published = getPublishedSite031Articles();
  if (!article || !published.some(a=>a.id === article.id)) notFound();
  const related = getRelatedArticles(article).filter(a=>published.some(p=>p.id===a.id));
  return <>
    <PreviewHeader />
    <main id="conteudo"><div className="s31-wrap s31-read-layout">
      <article className="s31-article">
        <Link className="s31-inline-link" href={base}>← Voltar ao Explore</Link>
        <p className="s31-eyebrow">{site031Topic(article)} · CONTEÚDO EDUCACIONAL</p>
        <h1>{article.headline}</h1><p className="s31-article-deck">{article.deck}</p>
        <p className="s31-article-meta">Leitura estimada: {article.readingTimeEstimate}{article.publishedAt ? ` · ${new Intl.DateTimeFormat("pt-BR",{dateStyle:"long",timeZone:"UTC"}).format(new Date(`${article.publishedAt}T00:00:00Z`))}` : ""}</p>
        {article.assumptions?.map(s=><aside className="s31-article-note" key={s}>{s}</aside>)}
        {article.sections.map((section)=><section key={section.heading}><h2>{section.heading}</h2>{section.paragraphs.map((p)=><p key={p}>{p}</p>)}</section>)}
        <p className="s31-reading-disclaimer">Este conteúdo é educativo. Não constitui indicação de investimentos ou recomendação individual.</p>
      </article>
      <aside className="s31-read-aside"><div className="s31-read-aside-card"><p className="s31-eyebrow">LEITURA TRANQUILA</p><p>Sem anúncios interrompendo o texto. Conteúdos relacionados aparecem ao fim da leitura.</p></div><div className="s31-ad-placeholder"><strong>Publicidade · espaço reservado</strong><p>Sem anúncios ativos.</p></div></aside>
    </div>
    {related.length ? <section className="s31-section s31-related"><div className="s31-wrap"><p className="s31-eyebrow">CONTINUE EXPLORANDO</p><h2>Leituras relacionadas</h2><div className="s31-feature-grid">{related.map(a=><Link key={a.id} className="s31-article-card" href={`${base}/${a.slug}`}><h3>{a.headline}</h3><p>{a.deck}</p></Link>)}</div></div></section>:null}</main>
    <PreviewFooter />
  </>;
}