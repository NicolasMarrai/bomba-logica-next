'use client';

import { useState, useEffect } from 'react';
import { Gift, X, Hourglass } from '@phosphor-icons/react';
import { handleSorteio } from '../../lib/firebase';

// 1. Definimos a "planta" das propriedades (props) que o componente espera.
// Aqui dizemos que ele DEVE receber uma função chamada 'onClose'.
interface SorteioModalProps {
  onClose: () => void;
}

// 2. Usamos a planta para definir o componente.
export default function SorteioModal({ onClose }: SorteioModalProps) {
  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState<{ won: boolean; message: string } | null>(null);

  useEffect(() => {
    const performSorteio = async () => {
      try {
        const sorteioResult = await handleSorteio();
        setResult(sorteioResult);
      } catch (error) {
        console.error("Erro no sorteio:", error);
        setResult({ won: false, message: "Ocorreu um erro no sistema. Tente novamente." });
      } finally {
        // Adiciona um delay de 2 segundos para criar suspense
        setTimeout(() => {
          setLoading(false);
        }, 2000);
      }
    };

    performSorteio();
  }, []);

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 border border-yellow-500 rounded-lg shadow-xl w-full max-w-md text-center p-6 relative animate-fade-in">
        <button 
          onClick={onClose} // 3. O botão de fechar agora usa a função que veio de fora.
          className="absolute top-2 right-2 text-gray-400 hover:text-white transition-colors"
        >
          <X size={24} />
        </button>

        <h2 className="text-2xl font-bold text-yellow-400 mb-4 flex items-center justify-center gap-2">
          <Gift size={28} />
          Sorteio Surpresa!
        </h2>
        
        {loading && (
          <div className="space-y-4 my-8">
            <div className="flex justify-center">
              <Hourglass size={48} className="text-yellow-400 animate-spin" />
            </div>
            <p className="text-lg">Analisando seu payload para prêmios...</p>
          </div>
        )}

        {!loading && result && (
          <div className="space-y-4 my-8">
            <p className={`text-xl font-bold ${result.won ? 'text-green-400' : 'text-red-400'}`}>
              {result.message}
            </p>
            <button
              onClick={onClose}
              className="bg-yellow-500 text-black font-bold py-2 px-6 rounded-md hover:bg-yellow-400 transition-all"
            >
              Fechar
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

