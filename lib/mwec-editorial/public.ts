import {configured,supabase} from "../mwec-crm/server";
export type PublicArticle={id:string;title:string;slug:string;excerpt:string;category:string;body_markdown:string;published_at:string;cover_url:string|null};
export async function publishedArticles():Promise<PublicArticle[]>{
 if(!configured())return [];
 try{
   const result=await supabase("/rest/v1/mwec_cms_articles?select=id,title,slug,excerpt,category,body_markdown,published_at,cover_url&status=eq.published&approved_at=not.is.null&published_at=not.is.null&order=published_at.desc&limit=100") as PublicArticle[];
   return result.filter(a=>Boolean(a.slug&&a.published_at));
 }catch{return []}
}
export async function publishedArticle(slug:string):Promise<PublicArticle|null>{
 if(!configured()||!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug))return null;
 try{
   const a=await supabase("/rest/v1/mwec_cms_articles?select=id,title,slug,excerpt,category,body_markdown,published_at,cover_url&status=eq.published&approved_at=not.is.null&published_at=not.is.null&slug=eq."+encodeURIComponent(slug)+"&limit=1") as PublicArticle[];
   return a[0]??null;
 }catch{return null}
}
