"use client";

import { useState, useEffect, FormEvent } from "react";
import Link from "next/link";
import { ArrowRight, ShieldCheck } from "@phosphor-icons/react";
import { saveSubmission, hasFirebaseClientConfig } from "../../lib/firebase";
import EmergencyAlert from "../../components/ui/EmergencyAlert";
import type { FormData } from "../../types/index";

/** Duração da "promoção" em segundos: a urgência faz parte da isca. */
const DURATION = 300;

type Phase = "form" | "alert" | "reveal";

/**
 * @component SorteioPage
 * @description Isca de engenharia social: parece um sorteio comum, com urgência e
 * recompensa. Depois do envio, mostra um alerta de emergência e, em seguida,
 * revela que tudo foi uma simulação.
 */
export default function SorteioPage() {
  const [formData, setFormData] = useState<FormData>({ name: "", email: "", phone: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [phase, setPhase] = useState<Phase>("form");
  const [countdown, setCountdown] = useState(DURATION);

  useEffect(() => {
    if (countdown <= 0 || phase !== "form") return;
    const timer = setInterval(() => setCountdown((prev) => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [countdown, phase]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      // Pequena espera para parecer "processamento"
      await new Promise((resolve) => setTimeout(resolve, 1200));
      await saveSubmission(formData.name, formData.email, formData.phone);
      setPhase("alert");
    } catch (error) {
      console.error("Erro ao enviar:", error);
      alert(
        hasFirebaseClientConfig()
          ? "Não foi possível enviar agora. Verifique sua conexão e tente novamente."
          : "O sistema está temporariamente indisponível. Tente novamente mais tarde.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: name === "phone" ? formatPhoneNumber(value) : value }));
  };

  const expired = countdown <= 0;

  return (
    <main className="flex min-h-dvh flex-col bg-paper text-ink">
      <div className="mx-auto flex w-full max-w-md flex-1 flex-col px-5 py-8 sm:py-14">
        {phase === "reveal" ? (
          <Reveal />
        ) : (
          <>
            <header className="mb-6 flex items-center justify-between">
              <p className="font-mono text-xs tracking-wide text-ink-muted">ENTEC 2025</p>
              <p className="flex items-center gap-2 font-mono text-xs text-alert">
                <span className="relative flex size-2">
                  <span className="absolute inline-flex size-full animate-ping rounded-full bg-alert opacity-60 motion-reduce:hidden" />
                  <span className="relative inline-flex size-2 rounded-full bg-alert" />
                </span>
                ao vivo
              </p>
            </header>

            <section className="fade-up rounded-2xl border border-line bg-white p-6 shadow-[0_1px_2px_rgb(0_0_0/0.04)] sm:p-8">
              <p className="text-sm font-medium text-accent">Sorteio relâmpago</p>
              <h1 className="mt-2 text-3xl leading-tight font-semibold tracking-tight">
                Ganhe um Ouro Branco agora
              </h1>
              <p className="mt-3 leading-relaxed text-ink-muted">
                São só 30 unidades. Preencha seus dados para entrar no sorteio desta rodada.
              </p>

              <div className="mt-6">
                <div className="flex items-baseline justify-between text-sm">
                  <span className="text-ink-muted">{expired ? "Rodada encerrada" : "Encerra em"}</span>
                  <span className="font-mono font-medium tabular-nums">{formatTime(countdown)}</span>
                </div>
                <div className="mt-2 h-1 overflow-hidden rounded-full bg-line">
                  <div
                    className="h-full rounded-full bg-accent transition-[width] duration-1000 ease-linear"
                    style={{ width: `${(countdown / DURATION) * 100}%` }}
                  />
                </div>
              </div>

              <form onSubmit={handleSubmit} className="mt-7 space-y-4">
                <Field label="Nome completo" htmlFor="name">
                  <input
                    id="name"
                    type="text"
                    name="name"
                    autoComplete="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    placeholder="Ex.: João da Silva"
                    className={inputClass}
                  />
                </Field>
                <Field label="E-mail" htmlFor="email">
                  <input
                    id="email"
                    type="email"
                    name="email"
                    autoComplete="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="voce@email.com"
                    className={inputClass}
                  />
                </Field>
                <Field label="Telefone" hint="opcional" htmlFor="phone">
                  <input
                    id="phone"
                    type="tel"
                    name="phone"
                    autoComplete="tel"
                    inputMode="numeric"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="(34) 99999-9999"
                    className={inputClass}
                  />
                </Field>

                <button
                  type="submit"
                  disabled={isSubmitting || expired}
                  className="mt-2 flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-ink font-semibold text-white transition-colors hover:bg-black disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <span className="size-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                      Enviando…
                    </>
                  ) : expired ? (
                    "Rodada encerrada"
                  ) : (
                    "Participar do sorteio"
                  )}
                </button>
                <p className="text-center text-xs text-ink-muted">
                  Ao participar, você concorda com os termos do sorteio.
                </p>
              </form>
            </section>

            <p className="mt-auto pt-8 text-center text-xs text-ink-muted">Sorteio Relâmpago · 2025</p>
          </>
        )}
      </div>

      {phase === "alert" ? (
        <EmergencyAlert
          name={formData.name}
          email={formData.email}
          hasPhone={formData.phone.trim().length > 0}
          onAcknowledge={() => setPhase("reveal")}
        />
      ) : null}
    </main>
  );
}

/** Tela calma depois do alerta: revela a simulação e leva à explicação. */
function Reveal() {
  return (
    <section className="fade-up my-auto">
      <p className="font-mono text-xs tracking-wide text-ink-muted">SIMULAÇÃO · ENTEC 2025</p>
      <h1 className="mt-3 text-4xl leading-[1.1] font-semibold tracking-tight">Calma. Isso foi um teste.</h1>
      <p className="mt-4 text-lg leading-relaxed text-ink-muted">
        Este sorteio era uma isca de engenharia social, criada por alunos de Engenharia da Computação e Elétrica da
        Uniube. Em poucos segundos, você entregou seus dados pessoais para um site que nunca tinha visto.
      </p>

      <div className="mt-6 flex gap-3 rounded-2xl border border-line bg-white p-4">
        <ShieldCheck size={24} weight="fill" className="mt-0.5 shrink-0 text-emerald-700" aria-hidden />
        <p className="text-sm leading-relaxed">
          <strong className="font-semibold">Seus dados estão seguros.</strong> Eles ficam só com o projeto, para fins
          acadêmicos, e não serão repassados a ninguém.
        </p>
      </div>

      <Link
        href="/conscientizacao"
        className="mt-8 flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-ink font-semibold text-white transition-colors hover:bg-black"
      >
        Entender o golpe
        <ArrowRight size={18} weight="bold" aria-hidden />
      </Link>
    </section>
  );
}

const inputClass =
  "h-12 w-full rounded-xl border border-line bg-paper/60 px-4 text-ink placeholder:text-stone-400 transition-colors focus:border-accent focus:bg-white focus:outline-none focus:ring-4 focus:ring-accent/15";

function Field({
  label,
  hint,
  htmlFor,
  children,
}: {
  label: string;
  hint?: string;
  htmlFor: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label htmlFor={htmlFor} className="mb-1.5 flex items-baseline gap-2 text-sm font-medium">
        {label}
        {hint ? <span className="font-normal text-ink-muted">{hint}</span> : null}
      </label>
      {children}
    </div>
  );
}

/** Formata o telefone no padrão (xx) xxxxx-xxxx. */
function formatPhoneNumber(value: string) {
  const digits = value.replace(/\D/g, "").slice(0, 11);
  if (digits.length <= 2) return digits;
  if (digits.length <= 7) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
}

/** Converte segundos para MM:SS. */
function formatTime(seconds: number) {
  const s = Math.max(seconds, 0);
  return `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;
}
