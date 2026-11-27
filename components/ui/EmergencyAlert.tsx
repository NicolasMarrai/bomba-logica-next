"use client";

import { useEffect, useRef, useState } from "react";
import { WarningOctagon } from "@phosphor-icons/react";

interface EmergencyAlertProps {
  /** Nome que a pessoa digitou no formulário (usamos só o primeiro nome). */
  name: string;
  /** E-mail digitado, mostrado mascarado. */
  email: string;
  /** Se a pessoa informou telefone. */
  hasPhone: boolean;
  /** Chamado quando a pessoa toca em OK. */
  onAcknowledge: () => void;
}

/** Segundos até o botão OK liberar, para a pessoa ler o alerta. */
const LOCK_SECONDS = 4;

/**
 * Toca o sinal de atenção usado em alertas de emergência: dois tons simultâneos
 * (853 Hz + 960 Hz), em pulsos. Gerado com Web Audio, sem arquivo de som.
 * O navegador só permite som depois de um gesto do usuário; o envio do formulário conta.
 */
function playAttentionSignal(): () => void {
  const AudioCtx =
    window.AudioContext ||
    (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!AudioCtx) return () => {};

  const ctx = new AudioCtx();
  const gain = ctx.createGain();
  gain.gain.value = 0;
  gain.connect(ctx.destination);

  const oscillators = [853, 960].map((frequency) => {
    const osc = ctx.createOscillator();
    osc.type = "sine";
    osc.frequency.value = frequency;
    osc.connect(gain);
    osc.start();
    return osc;
  });

  // 4 pulsos de 0,8 s com 0,25 s de pausa
  const start = ctx.currentTime + 0.05;
  for (let i = 0; i < 4; i++) {
    const t = start + i * 1.05;
    gain.gain.setValueAtTime(0, t);
    gain.gain.linearRampToValueAtTime(0.18, t + 0.02);
    gain.gain.setValueAtTime(0.18, t + 0.78);
    gain.gain.linearRampToValueAtTime(0, t + 0.8);
  }
  const end = start + 4 * 1.05;
  oscillators.forEach((osc) => osc.stop(end));

  return () => {
    oscillators.forEach((osc) => {
      try {
        osc.stop();
      } catch {}
    });
    ctx.close().catch(() => {});
  };
}

function maskEmail(email: string): string {
  const [local, domain] = email.split("@");
  if (!local || !domain) return email;
  return `${local.slice(0, 2)}${"•".repeat(Math.max(local.length - 2, 3))}@${domain}`;
}

/**
 * @component EmergencyAlert
 * @description Alerta em tela cheia no estilo dos alertas extremos do celular,
 * mostrado logo após o envio do formulário falso. Usa os dados que a pessoa
 * acabou de digitar para causar impacto, toca o sinal de atenção e vibra.
 */
export default function EmergencyAlert({
  name,
  email,
  hasPhone,
  onAcknowledge,
}: EmergencyAlertProps) {
  const [secondsLeft, setSecondsLeft] = useState(LOCK_SECONDS);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const firstName = name.trim().split(/\s+/)[0] || "Você";
  const now = new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });

  useEffect(() => {
    const stopSound = playAttentionSignal();
    navigator.vibrate?.([700, 250, 700, 250, 700, 250, 700]);
    return () => {
      stopSound();
      navigator.vibrate?.(0);
    };
  }, []);

  useEffect(() => {
    if (secondsLeft <= 0) {
      buttonRef.current?.focus();
      return;
    }
    const timer = setTimeout(() => setSecondsLeft((s) => s - 1), 1000);
    return () => clearTimeout(timer);
  }, [secondsLeft]);

  const leaked = ["nome completo", "e-mail", ...(hasPhone ? ["telefone"] : [])];

  return (
    <div
      className="alert-backdrop fixed inset-0 z-50 flex items-start justify-center overflow-y-auto p-4 pt-[12vh]"
      role="alertdialog"
      aria-modal="true"
      aria-labelledby="alert-title"
      aria-describedby="alert-body"
    >
      <div className="alert-card w-full max-w-md overflow-hidden rounded-3xl border-2 border-alert bg-[#1c1c1e] text-white">
        <div className="flex items-center gap-3 bg-alert px-5 py-3">
          <WarningOctagon size={26} weight="fill" aria-hidden />
          <p className="flex-1 font-mono text-sm font-bold tracking-[0.18em]">ALERTA EXTREMO</p>
          <p className="font-mono text-xs opacity-90">{now}</p>
        </div>

        <div className="space-y-4 px-5 py-6">
          <h2 id="alert-title" className="text-2xl leading-tight font-semibold">
            {firstName}, seus dados acabaram de ser enviados para um servidor desconhecido.
          </h2>

          <div id="alert-body" className="space-y-3 text-[15px] leading-relaxed text-white/80">
            <p>
              O cadastro que você preencheu não pertence a nenhum sorteio oficial. As informações abaixo já saíram
              deste aparelho:
            </p>
            <ul className="space-y-1.5 rounded-xl bg-black/40 px-4 py-3 font-mono text-sm text-white">
              {leaked.map((item) => (
                <li key={item} className="flex items-center gap-2">
                  <span aria-hidden className="size-1.5 rounded-full bg-alert" />
                  {item}
                  {item === "e-mail" ? <span className="text-white/60">· {maskEmail(email)}</span> : null}
                </li>
              ))}
            </ul>
            <p className="font-medium text-white">Não ignore este aviso.</p>
          </div>

          <button
            ref={buttonRef}
            type="button"
            onClick={onAcknowledge}
            disabled={secondsLeft > 0}
            className="h-12 w-full rounded-xl bg-white text-base font-semibold text-black transition-opacity disabled:opacity-40"
          >
            {secondsLeft > 0 ? `OK (${secondsLeft})` : "OK"}
          </button>
        </div>
      </div>
    </div>
  );
}
