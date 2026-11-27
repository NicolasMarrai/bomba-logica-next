"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Check } from "@phosphor-icons/react";
import SorteioModal from "../../../components/ui/SorteioModal";

/** Os três gatilhos que a isca usou. */
const TRIGGERS = [
  {
    title: "Urgência",
    text: "O cronômetro e o “só 30 unidades” existem para você decidir rápido, antes de pensar se o site é confiável.",
  },
  {
    title: "Recompensa",
    text: "Um prêmio pequeno e fácil de ganhar baixa a guarda. Ninguém desconfia de um chocolate.",
  },
  {
    title: "Pedido de dados",
    text: "Nome, e-mail e telefone parecem inofensivos, mas são o ponto de partida de quase todo golpe direcionado.",
  },
];

/** O que um golpista faria com os dados. */
const RISKS = [
  { title: "Phishing personalizado", text: "Mensagens com o seu nome, fingindo ser banco, loja ou faculdade." },
  { title: "Golpes por WhatsApp e SMS", text: "Com o seu telefone, alguém pode se passar por você ou por um parente." },
  { title: "Venda de dados", text: "Listas de contatos reais valem dinheiro e circulam entre golpistas." },
  { title: "Perfis falsos", text: "Somado a fotos e redes sociais, o seu nome vira uma identidade falsa." },
];

/** Como se proteger. */
const TIPS = [
  {
    title: "Desconfie da pressa",
    text: "Cronômetro, “últimas vagas” e “só hoje” são técnicas para você não pensar.",
  },
  {
    title: "Confira quem está por trás",
    text: "Sorteio de verdade tem empresa identificada, regulamento e canal oficial. Pesquise antes.",
  },
  {
    title: "Olhe o endereço do site",
    text: "Domínios genéricos ou estranhos são um sinal de alerta. Na dúvida, não preencha.",
  },
  {
    title: "Entregue o mínimo",
    text: "Nenhum sorteio legítimo pede CPF, senha ou dados bancários no cadastro.",
  },
  {
    title: "Use um e-mail separado",
    text: "Para cadastros duvidosos, um e-mail secundário protege o seu principal.",
  },
];

/**
 * @component AwarenessPage
 * @description Explica a simulação: como a isca funcionou, o que um golpista faria
 * com os dados e como se proteger. Depois de alguns segundos, abre o sorteio verdadeiro.
 */
export default function AwarenessPage() {
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    // O sorteio verdadeiro aparece depois de 8 segundos, para incentivar a leitura
    const timer = setTimeout(() => setShowModal(true), 8000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <main className="min-h-dvh bg-paper text-ink">
      <article className="mx-auto max-w-2xl px-5 py-14 sm:py-20">
        <header className="fade-up">
          <p className="font-mono text-xs tracking-wide text-ink-muted">ENTEC 2025 · ENGENHARIA SOCIAL</p>
          <h1 className="mt-4 text-4xl leading-[1.08] font-semibold tracking-tight sm:text-5xl">
            Você acabou de cair num golpe.
          </h1>
          <p className="mt-5 text-lg leading-relaxed text-ink-muted">
            Foi de propósito. O sorteio era uma simulação para mostrar como é fácil entregar dados pessoais quando a
            isca é bem montada. Ninguém está livre disso, e entender o truque é o primeiro passo para não cair.
          </p>
        </header>

        <Section title="Como a isca funcionou">
          <ol className="divide-y divide-line border-y border-line">
            {TRIGGERS.map((item, i) => (
              <li key={item.title} className="grid grid-cols-[2.5rem_1fr] gap-4 py-5">
                <span className="font-mono text-sm text-accent">{String(i + 1).padStart(2, "0")}</span>
                <div>
                  <h3 className="font-semibold">{item.title}</h3>
                  <p className="mt-1 leading-relaxed text-ink-muted">{item.text}</p>
                </div>
              </li>
            ))}
          </ol>
        </Section>

        <Section title="O que um golpista faria com seus dados">
          <div className="grid gap-x-8 gap-y-6 sm:grid-cols-2">
            {RISKS.map((item) => (
              <div key={item.title} className="border-t-2 border-alert/70 pt-3">
                <h3 className="font-semibold">{item.title}</h3>
                <p className="mt-1 text-[15px] leading-relaxed text-ink-muted">{item.text}</p>
              </div>
            ))}
          </div>
        </Section>

        <Section title="Como se proteger">
          <ul className="space-y-4">
            {TIPS.map((item) => (
              <li key={item.title} className="flex gap-3">
                <span className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full bg-emerald-700 text-white">
                  <Check size={14} weight="bold" aria-hidden />
                </span>
                <p className="leading-relaxed">
                  <strong className="font-semibold">{item.title}.</strong>{" "}
                  <span className="text-ink-muted">{item.text}</span>
                </p>
              </li>
            ))}
          </ul>
        </Section>

        <blockquote className="mt-14 rounded-2xl bg-ink px-6 py-6 text-lg leading-relaxed text-white">
          Se parece bom demais para ser verdade, provavelmente é golpe.
        </blockquote>

        <div className="mt-10 flex flex-col gap-3 sm:flex-row">
          <button
            type="button"
            onClick={() => setShowModal(true)}
            className="flex h-12 flex-1 items-center justify-center rounded-xl bg-accent font-semibold text-white transition-colors hover:bg-amber-800"
          >
            Participar do sorteio de verdade
          </button>
          <Link
            href="/"
            className="flex h-12 flex-1 items-center justify-center rounded-xl border border-line bg-white font-semibold transition-colors hover:border-stone-300"
          >
            Voltar ao início
          </Link>
        </div>

        <footer className="mt-16 flex flex-col items-center gap-3 border-t border-line pt-8 text-center">
          <Image src="/logo_uniube.svg" alt="Uniube" width={110} height={34} className="h-auto opacity-80" />
          <p className="text-sm text-ink-muted">
            Projeto da <strong className="font-semibold text-ink">ENTEC 2025</strong> · Uniube, Campus Aeroporto
          </p>
          <p className="max-w-md text-xs leading-relaxed text-ink-muted">
            Os dados informados são usados apenas para fins acadêmicos e não serão repassados a terceiros.
          </p>
        </footer>
      </article>

      {showModal && <SorteioModal onClose={() => setShowModal(false)} />}
    </main>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-14">
      <h2 className="mb-6 text-2xl font-semibold tracking-tight">{title}</h2>
      {children}
    </section>
  );
}
