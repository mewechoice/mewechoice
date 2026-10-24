import type { Metadata } from "next";
import { PreviewFooter, PreviewHeader } from "../experiencia-031/components";
import ContactForm from "./contact-form";
import "../experiencia-031/site031.css";
import "./contact.css";

export const metadata: Metadata = {
  title: "Contato | MWeC",
  description: "Envie sua dúvida, sugestão ou solicitação de informações à MWeC.",
};

export default function ContactPage() {
  return <div className="s31">
    <PreviewHeader preview={false} />
    <main id="conteudo" className="mwc-contact-page">
      <section className="mwc-contact-intro">
        <div className="s31-wrap">
          <p className="s31-kicker">MWeC / CONTATO</p>
          <h1>Vamos conversar?</h1>
          <p>Se você tem uma dúvida, sugestão ou quer entender melhor a proposta da MWeC, conte um pouco sobre o que procura.</p>
        </div>
      </section>
      <section className="mwc-contact-main">
        <div className="s31-wrap mwc-contact-layout">
          <div className="mwc-contact-aside">
            <p className="s31-eyebrow">PRIMEIRO O PROJETO</p>
            <h2>Começamos escutando.</h2>
            <p>Sua mensagem será recebida pela equipe da MWeC e organizada para acompanhamento. Não é necessário compartilhar dados financeiros neste primeiro contato.</p>
            <p>Solicitar informações sobre diagnóstico não constitui contratação, recomendação de investimento ou análise individual.</p>
          </div>
          <div className="mwc-contact-card">
            <h2>Envie sua mensagem</h2>
            <p>Responderemos pelo meio de contato que você informar. Não realizamos cadastro automático para publicidade.</p>
            <ContactForm />
          </div>
        </div>
      </section>
    </main>
    <PreviewFooter preview={false} />
  </div>;
}
