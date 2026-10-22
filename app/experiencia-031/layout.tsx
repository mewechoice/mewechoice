import type { Metadata } from "next";
import "./site031.css";

export const metadata: Metadata = {
  title: "MWeC | Prévia SITE-031 — Educação financeira",
  description: "Prévia isolada da experiência educacional da MWeC. Não publicada como versão oficial.",
  robots: { index: false, follow: false },
};

export default function Site031Layout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <div className="s31">{children}</div>;
}