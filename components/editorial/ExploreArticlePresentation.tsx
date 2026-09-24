import type { EditorialArtifact, ExploreArticleContent } from "../../lib/editorial/artifacts";

export function ExploreArticlePresentation({artifact,content}:{artifact:EditorialArtifact;content:ExploreArticleContent}) {
  return (
    <article className="article-shell" data-artifact-id={artifact.artifactId}>
      <p className="eyebrow">EXPLORE · CONTEÚDO EDUCACIONAL</p>
      <h1>{artifact.title}</h1>
      <p className="article-deck">{artifact.summary}</p>
      <p>{content.opening}</p>
      <section>
        <h2>Entenda a ideia</h2>
        {content.explanation.map((paragraph)=><p key={paragraph}>{paragraph}</p>)}
      </section>
      {content.examples?.length ? <section><h2>Exemplo</h2>{content.examples.map((item)=><p key={item}>{item}</p>)}</section> : null}
      {content.calculations?.length ? <section><h2>Conta, quando ajuda</h2>{content.calculations.map((item)=><p key={item}>{item}</p>)}</section> : null}
      <section><h2>O que levar daqui</h2><p>{content.takeaway}</p></section>
      {content.references?.length ? <section aria-label="Fontes e referências"><h2>Fontes e referências</h2><ul>{content.references.map((ref)=><li key={ref}>{ref}</li>)}</ul></section> : null}
      {content.educationalBoundary ? <aside className="article-note"><strong>Sobre este conteúdo</strong><p>{content.educationalBoundary}</p></aside> : null}
      <footer>
        <small>Criado em {artifact.createdAt} · Atualizado em {artifact.updatedAt}{artifact.publishedAt ? " · Publicado em "+artifact.publishedAt : ""}</small>
      </footer>
    </article>
  );
}
