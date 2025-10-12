'use client';

import { useState, useEffect } from 'react';
import { Gift, X, Sparkle } from '@phosphor-icons/react';
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
  const [result, setResult] = useState<{ won: boolean; message: string; redeemCode?: string } | null>(null);

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

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-md flex items-center justify-center z-50 p-4 animate-fade-in">
      <div className="bg-gradient-to-br from-purple-900 to-pink-900 border-2 border-yellow-400 rounded-2xl shadow-2xl w-full max-w-md text-center p-8 relative">
        {/* Botão para fechar o modal */}
        <button 
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-300 hover:text-white transition-colors bg-black/30 rounded-full p-1"
          aria-label="Fechar"
        >
          <X size={24} weight="bold" />
        </button>

        <div className="mb-6">
          <div className="flex justify-center mb-4">
            <div className="bg-yellow-400/20 p-4 rounded-full">
              <Gift size={48} weight="fill" className="text-yellow-400" />
            </div>
          </div>
          <h2 className="text-3xl font-bold text-yellow-400 mb-2">
            Sorteio Verdadeiro!
          </h2>
          <p className="text-white/80">
            Agora que você aprendeu sobre os perigos, vamos fazer o sorteio de verdade! 🎉
          </p>
        </div>
        
        {/* Exibido enquanto o sorteio está em andamento */}
        {loading && (
          <div className="space-y-6 my-8">
            <div className="flex justify-center">
              <Sparkle size={64} className="text-yellow-400 animate-spin" weight="fill" />
            </div>
            <div className="space-y-2">
              <p className="text-xl text-white font-semibold">Girando a roda da sorte...</p>
              <div className="flex justify-center gap-2">
                <div className="w-2 h-2 bg-yellow-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                <div className="w-2 h-2 bg-yellow-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                <div className="w-2 h-2 bg-yellow-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
              </div>
            </div>
          </div>
        )}

        {/* Exibido após o sorteio ser concluído */}
        {!loading && result && (
          <div className="space-y-6 my-8">
            <div className={`text-2xl font-bold ${result.won ? 'text-green-400' : 'text-orange-400'}`}>
              {result.won ? '🎊 PARABÉNS! 🎊' : '😢 Que pena!'}
            </div>
            <p className={`text-lg ${result.won ? 'text-white' : 'text-gray-200'}`}>
              {result.message}
            </p>
            {result.won && (
              <div className="bg-green-500/20 border border-green-500/50 rounded-lg p-4 space-y-3">
                <p className="text-green-300 text-sm">
                  🍫 Informe este código para a equipe e resgate seu Sonho de Valsa!
                </p>
                
                {/* Código de Resgate em Destaque */}
                <div className="bg-black/40 rounded-lg p-4 border-2 border-green-400">
                  <p className="text-gray-300 text-xs uppercase tracking-wider mb-2">
                    Código de Resgate:
                  </p>
                  <p className="text-5xl font-black text-green-400 tracking-[0.5em] text-center font-mono">
                    {result.redeemCode}
                  </p>
                </div>

                <p className="text-yellow-300 text-xs">
                  ⚠️ Guarde este código! Ele será necessário para retirar seu prêmio.
                </p>
              </div>
            )}
            <button
              onClick={onClose}
              className="w-full bg-gradient-to-r from-yellow-400 to-orange-500 text-black font-bold py-3 px-6 rounded-lg hover:from-yellow-500 hover:to-orange-600 transition-all shadow-lg transform hover:scale-105"
            >
              {result.won ? '🎉 Resgatar Prêmio' : 'Fechar'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

