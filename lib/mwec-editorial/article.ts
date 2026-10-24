export const categories=["Educação financeira","Organização do dinheiro","Planejamento","Fundamentos dos investimentos","Decisões financeiras"] as const;
export const states=["draft","in_review","approved","published"] as const;
export type Article={id:string;author_id:string;title:string;slug:string;excerpt:string;body_markdown:string;category:string;status:string;approved_by:string|null;approved_at:string|null;published_at:string|null;updated_at:string};
export function parseArticle(value:unknown){
  if(!value||typeof value!=="object"||Array.isArray(value))throw Error("Dados inválidos.");
  const v=value as Record<string,unknown>;
  const title=typeof v.title==="string"?v.title.trim():"";
  const excerpt=typeof v.excerpt==="string"?v.excerpt.trim():"";
  const category=typeof v.category==="string"?v.category:"";
  const body_markdown=typeof v.body_markdown==="string"?v.body_markdown.trim():"";
  if(title.length<5||title.length>160)throw Error("Título entre 5 e 160 caracteres.");
  if(excerpt.length>350)throw Error("Resumo muito longo.");
  if(body_markdown.length>45000)throw Error("Artigo muito longo.");
  if(!categories.some(x=>x===category))throw Error("Categoria inválida.");
  return {title,excerpt,category,body_markdown};
}
export function slug(title:string){
  return title.normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"").slice(0,110);
}
export const isId=(s:string)=>/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(s);
