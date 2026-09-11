import type { Metadata } from "next";
import { Cormorant_Garamond, Montserrat } from "next/font/google";
import "./globals.css";

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
  display: "swap",
});

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  variable: "--font-cormorant",
  weight: ["500", "600"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "ME → WE → CHOICE",
  description: "Primeiro o projeto. Depois, a solução. Planejamento para escolhas que fazem sentido.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR" className={`${montserrat.variable} ${cormorant.variable}`}>
      <body>{children}</body>
    </html>
  );
}
