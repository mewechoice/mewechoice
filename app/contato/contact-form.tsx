"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";

type Values = {
  name: string;
  email: string;
  whatsapp: string;
  interest: string;
  message: string;
  privacyAcknowledged: boolean;
  website: string;
};

const initial: Values = {
  name: "", email: "", whatsapp: "", interest: "", message: "",
  privacyAcknowledged: false, website: "",
};

export default function ContactForm() {
  const [values, setValues] = useState<Values>(initial);
  const [sending, setSending] = useState(false);
  const [notice, setNotice] = useState<{ ok: boolean; text: string } | null>(null);

  function set<K extends keyof Values>(key: K, value: Values[K]) {
    setValues(old => ({ ...old, [key]: value }));
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (sending) return;
    setNotice(null);
    if (!values.email.trim() && !values.whatsapp.trim()) {
      setNotice({ ok: false, text: "Informe um e-mail ou WhatsApp para resposta." });
      return;
    }
    setSending(true);
    try {
      const response = await fetch("/api/mwec/contato", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const result: { message?: string } = await response.json();
      const ok = response.ok;
      setNotice({ ok, text: result.message || (ok ? "Mensagem enviada." : "Não foi possível enviar.") });
      if (ok) setValues(initial);
    } catch {
      setNotice({ ok: false, text: "Não foi possível conectar. Verifique a internet e tente novamente." });
    } finally {
      setSending(false);
    }
  }

  return <form className="mwc-contact-form" onSubmit={submit} aria-label="Formulário de contato MWeC">
    <div className="mwc-contact-form-grid">
      <label>Seu nome <span aria-hidden="true">*</span>
        <input autoComplete="name" maxLength={100} minLength={2} required value={values.name}
          onChange={e => set("name", e.target.value)} placeholder="Como podemos chamar você?" />
      </label>
      <label>E-mail
        <input type="email" autoComplete="email" maxLength={190} value={values.email}
          onChange={e => set("email", e.target.value)} placeholder="seuemail@exemplo.com" />
      </label>
      <label>WhatsApp
        <input type="tel" autoComplete="tel" maxLength={25} value={values.whatsapp}
          onChange={e => set("whatsapp", e.target.value)} placeholder="(82) 99999-9999" />
      </label>
      <label>Motivo do contato <span aria-hidden="true">*</span>
        <select required value={values.interest} onChange={e => set("interest", e.target.value)}>
          <option value="">Selecione uma opção</option>
          <option value="duvida">Tenho uma dúvida</option>
          <option value="diagnostico">Gostaria de saber sobre diagnóstico</option>
          <option value="sugestao">Quero enviar uma sugestão</option>
          <option value="outro">Outro assunto</option>
        </select>
      </label>
    </div>
    <label>Sua mensagem <span aria-hidden="true">*</span>
      <textarea minLength={10} maxLength={1500} rows={6} required value={values.message}
        onChange={e => set("message", e.target.value)} placeholder="Conte, de forma breve, o motivo do seu contato." />
    </label>
    <label className="mwc-honeypot" aria-hidden="true">Deixe este campo vazio
      <input tabIndex={-1} autoComplete="off" value={values.website}
        onChange={e => set("website", e.target.value)} />
    </label>
    <p className="mwc-contact-help">Informe pelo menos um meio de contato: e-mail ou WhatsApp. Não envie CPF, documentos, senhas, dados bancários ou informações financeiras sensíveis neste formulário.</p>
    <label className="mwc-contact-check">
      <input type="checkbox" checked={values.privacyAcknowledged}
        onChange={e => set("privacyAcknowledged", e.target.checked)} required />
      <span>Li as <Link href="/privacidade">informações de privacidade</Link> e estou enviando esta mensagem para receber uma resposta da MWeC.</span>
    </label>
    <button type="submit" disabled={sending} className="mwc-contact-submit">
      {sending ? "Enviando..." : "Enviar mensagem"} <span aria-hidden="true">→</span>
    </button>
    {notice && <p role="status" aria-live="polite" className={notice.ok ? "mwc-contact-success" : "mwc-contact-error"}>{notice.text}</p>}
  </form>;
}
