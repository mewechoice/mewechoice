import type { Metadata } from "next";
import Link from "next/link";
import { PreviewHeader, PreviewFooter } from "../experiencia-031/components";
import "../experiencia-031/site031.css";

export const metadata: Metadata = { title: "Informações de privacidade | MWeC" };

export default function PrivacyPage() {
  return <div className="s31">
    <PreviewHeader preview={false} />
    <main id="conteudo" className="s31-wrap" style={{ maxWidth: 820, padding: "72px 0 100px" }}>
      <p className="s31-eyebrow">MWeC / PRIVACIDADE</p>
      <h1 style={{ fontSize: "clamp(36px,5vw,56px)" }}>Seus dados, com finalidade definida.</h1>
      <p>Este aviso descreve o uso de dados enviados voluntariamente pelo formulário de contato da MWeC.</p>
      <h2>Quais informações recebemos?</h2>
      <p>Nome, e-mail ou WhatsApp, assunto, mensagem, confirmação de leitura do aviso e data do envio.</p>
      <h2>Para que usamos?</h2>
      <p>Para responder sua solicitação, organizar o atendimento e evitar contatos duplicados. O envio não autoriza anúncios, campanhas ou o compartilhamento automático dos dados com FINATECH, Side by Side ou outros projetos.</p>
      <h2>Quem pode consultar?</h2>
      <p>Apenas pessoas expressamente autorizadas para o atendimento e a administração da MWeC. O CRM utiliza controles técnicos de acesso.</p>
      <h2>Seus direitos</h2>
      <p>Você pode solicitar informações, correção ou exclusão de dados, conforme a legislação aplicável, utilizando o próprio <Link href="/contato" style={{ color: "#0075b4", textDecoration: "underline" }}>formulário de contato</Link> e selecionando “Outro assunto”.</p>
      <h2>O que não enviar</h2>
      <p>Não compartilhe CPF, RG, CNH, documentos, dados bancários, senhas ou informações financeiras sensíveis neste contato inicial.</p>
      <h2>Política de retenção</h2>
      <p>O prazo formal de retenção e os dados completos do responsável pelo tratamento ainda precisam de validação institucional antes da liberação definitiva do formulário ao público.</p>
      <p><Link className="s31-inline-link" href="/contato">Voltar ao contato →</Link></p>
    </main>
    <PreviewFooter preview={false} />
  </div>;
}
