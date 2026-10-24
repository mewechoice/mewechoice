import Site031Explore from "../experiencia-031/explore/explore-content";
import {publishedArticles} from "../../lib/mwec-editorial/public";
import "../experiencia-031/site031.css";
export const dynamic="force-dynamic";
export const metadata={title:"Explore | MWeC",description:"Artigos e conteúdos educativos sobre dinheiro, educação financeira e investimentos."};
export default async function Explore({searchParams}:{searchParams:Promise<{q?:string;categoria?:string}>}){
  const cmsArticles=await publishedArticles();
  return <div className="s31"><Site031Explore searchParams={searchParams} cmsArticles={cmsArticles}/></div>;
}
