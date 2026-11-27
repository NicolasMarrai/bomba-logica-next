'use client';

import { useState, useEffect } from 'react';
import { X } from '@phosphor-icons/react';
import { handleSorteio } from '../../lib/firebase';

/**
 * @interface SorteioModalProps
 * @description Define as propriedades que o componente SorteioModal espera receber.
 * @property {() => void} onClose - Função a ser chamada quando o modal for fechado.
 */
interface SorteioModalProps {
  onClose: () => void;
}

/**
 * @component SorteioModal
 * @description Modal que realiza o sorteio verdadeiro de bombons após a conscientização.
 * @param {SorteioModalProps} { onClose } - As propriedades do componente.
 * @returns {JSX.Element}
 */
export default function SorteioModal({ onClose }: SorteioModalProps) {
  // Estado para controlar o carregamento do sorteio.
  const [loading, setLoading] = useState(true);
  // Estado para armazenar o resultado do sorteio.
  const [result, setResult] = useState<{ won: boolean; message: string; redeemCode?: string; redeemed?: boolean } | null>(null);
  // Estado para controlar a exibição do diálogo de confirmação.
  const [showConfirmation, setShowConfirmation] = useState(false);

  useEffect(() => {
    /**
     * @function performSorteio
     * @description Função assíncrona que executa a lógica do sorteio verdadeiro.
     */
    const performSorteio = async () => {
      try {
        const sorteioResult = await handleSorteio();
        setResult(sorteioResult);
      } catch (error) {
        console.error("Erro no sorteio:", error);
        setResult({ won: false, message: "Ocorreu um erro no sistema. Tente novamente." });
      } finally {
        // Adiciona um delay de 2.5 segundos para criar suspense antes de mostrar o resultado.
        setTimeout(() => {
          setLoading(false);
        }, 2500);
      }
    };

    performSorteio();
  }, []);

  /**
   * @function handleClose
   * @description Função que gerencia o fechamento do modal, exibindo confirmação se o usuário ganhou e não resgatou.
   */
  const handleClose = () => {
    if (result?.won && !result?.redeemed && !showConfirmation) {
      setShowConfirmation(true);
    } else {
      onClose();
    }
  };

  const won = Boolean(result?.won);
  const redeemed = Boolean(result?.redeemed);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-ink/60 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="sorteio-title"
    >
      <div className="fade-up relative max-h-[95vh] w-full max-w-md overflow-y-auto rounded-3xl bg-white p-7 text-ink shadow-xl sm:p-8">
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 rounded-full p-1.5 text-ink-muted transition-colors hover:bg-paper hover:text-ink"
          aria-label="Fechar"
        >
          <X size={20} weight="bold" />
        </button>

        <p className="font-mono text-xs tracking-wide text-accent">AGORA É DE VERDADE</p>
        <h2 id="sorteio-title" className="mt-2 text-2xl font-semibold tracking-tight">
          Sorteio de Ouro Branco
        </h2>
        <p className="mt-2 leading-relaxed text-ink-muted">
          Você aprendeu como funciona o golpe. Como agradecimento, este sorteio é real e não pede nenhum dado.
        </p>

        {loading && (
          <div className="my-10 flex flex-col items-center gap-4" aria-live="polite">
            <span className="size-10 animate-spin rounded-full border-4 border-line border-t-accent" />
            <p className="font-medium">Sorteando…</p>
          </div>
        )}

        {!loading && result && (
          <div className="mt-7 space-y-5" aria-live="polite">
            <div>
              <p className={`text-xl font-semibold ${won ? 'text-emerald-700' : 'text-ink'}`}>
                {won ? (redeemed ? 'Prêmio já resgatado' : 'Você ganhou!') : 'Não foi desta vez'}
              </p>
              <p className="mt-1 leading-relaxed text-ink-muted">{result.message}</p>
            </div>

            {won && result.redeemCode && (
              <div className={`rounded-2xl border p-5 text-center ${redeemed ? 'border-line bg-paper' : 'border-emerald-200 bg-emerald-50'}`}>
                <p className="font-mono text-xs tracking-wide text-ink-muted">CÓDIGO DE RESGATE</p>
                <p className={`mt-2 font-mono text-5xl font-bold tracking-[0.35em] ${redeemed ? 'text-ink-muted' : 'text-emerald-800'}`}>
                  {result.redeemCode}
                </p>
                <p className="mt-3 text-sm text-ink-muted">
                  {redeemed
                    ? 'Este código já foi usado.'
                    : 'Mostre este código para alguém da equipe e retire seu chocolate.'}
                </p>
              </div>
            )}

            {showConfirmation && won && !redeemed ? (
              <div className="space-y-4 rounded-2xl border border-amber-200 bg-amber-50 p-5">
                <p className="leading-relaxed">
                  Você anotou ou fotografou o código{' '}
                  <span className="font-mono font-bold">{result.redeemCode}</span>? Sem ele não dá para retirar o prêmio.
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowConfirmation(false)}
                    className="h-11 flex-1 rounded-xl border border-line bg-white font-semibold transition-colors hover:border-stone-300"
                  >
                    Voltar
                  </button>
                  <button
                    onClick={onClose}
                    className="h-11 flex-1 rounded-xl bg-ink font-semibold text-white transition-colors hover:bg-black"
                  >
                    Já guardei
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={handleClose}
                className="h-12 w-full rounded-xl bg-ink font-semibold text-white transition-colors hover:bg-black"
              >
                {won && !redeemed ? 'Fechar' : 'Ok, entendi'}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
