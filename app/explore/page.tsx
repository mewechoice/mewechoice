import Site031Explore from "../experiencia-031/explore/explore-content";
import "../experiencia-031/site031.css";
export const metadata={title:"Explore | MWeC",description:"Artigos e conteúdos educativos sobre dinheiro, educação financeira e investimentos."};
export default function Explore({searchParams}:{searchParams:Promise<{q?:string;categoria?:string}>}){return <div className="s31"><Site031Explore searchParams={searchParams}/></div>;}
