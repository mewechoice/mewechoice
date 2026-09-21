import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "MSC-00 | Administração privada",
  robots: { index:false, follow:false, nocache:true, googleBot:{index:false,follow:false,noimageindex:true} }
};
export default function Layout({children}:{children:React.ReactNode}){ return children; }