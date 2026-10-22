import Site031Article from "../../experiencia-031/explore/[slug]/article-content";
import "../../experiencia-031/site031.css";
export default function Article({params}:{params:Promise<{slug:string}>}){return <div className="s31"><Site031Article params={params}/></div>;}
