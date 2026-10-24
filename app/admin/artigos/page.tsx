import type {Metadata} from "next";
import ArticleEditor from "./article-editor";
import "./article-editor.css";
export const metadata:Metadata={title:"Artigos | Painel MWeC",robots:{index:false,follow:false}};
export default function ArticlesPage(){return <ArticleEditor/>}
