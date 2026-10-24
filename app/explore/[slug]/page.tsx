import Link from "next/link";
import Site031Article from "../../experiencia-031/explore/[slug]/article-content";
import {PreviewHeader,PreviewFooter} from "../../experiencia-031/components";
import {publishedArticle} from "../../../lib/mwec-editorial/public";
import "../../experiencia-031/site031.css";
export const dynamic="force-dynamic";
export default async function Article({params}:{params:Promise<{slug:string}>}){
 const {slug}=await params;
 const article=await publishedArticle(slug);
 if(!article)return <div className="s31"><Site031Article params={params}/></div>;
 return <div className="s31"><PreviewHeader preview={false}/><main id="conteudo"><div className="s31-wrap s31-read-layout"><article className="s31-article">
 <Link className="s31-inline-link" href="/explore">← Voltar ao Explore</Link>
 <p className="s31-eyebrow">{article.category.toUpperCase()} · CONTEÚDO EDUCACIONAL</p>
 <h1>{article.title}</h1><p className="s31-article-deck">{article.excerpt}</p>
 <p className="s31-article-meta">Publicado em {new Intl.DateTimeFormat("pt-BR",{dateStyle:"long",timeZone:"UTC"}).format(new Date(article.published_at))}</p>
 <div style={{whiteSpace:"pre-wrap",overflowWrap:"anywhere",lineHeight:1.85}}>{article.body_markdown.split(/\n{2,}/).map((block,i)=>block.startsWith("## ")?<h2 key={i}>{block.slice(3)}</h2>:<p key={i}>{block}</p>)}</div>
 <p className="s31-reading-disclaimer">Este conteúdo é educativo e não constitui recomendação individual de investimento.</p>
 </article><aside className="s31-read-aside"><div className="s31-read-aside-card"><p className="s31-eyebrow">ME → WE → CHOICE</p><p>Primeiro compreender. Depois escolher.</p></div></aside></div></main><PreviewFooter preview={false}/></div>;
}
