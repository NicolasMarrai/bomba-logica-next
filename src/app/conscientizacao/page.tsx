'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ShieldWarning, QrCode, FishSimple } from '@phosphor-icons/react';
import SorteioModal from '../../../components/ui/SorteioModal';

/**
 * @component AwarenessPage
 * @description Página de conscientização que explica os perigos da engenharia social e golpes de QR Code.
 * @returns {JSX.Element}
 */
export default function AwarenessPage() {
  // Estado para controlar a visibilidade do modal de sorteio.
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    // Este timer faz o modal aparecer 10 segundos após a página carregar, incentivando a leitura.
    const timer = setTimeout(() => {
      setShowModal(true);
    }, 10000);

    // Limpa o timer se o componente for desmontado para evitar vazamentos de memória.
    return () => clearTimeout(timer);
  }, []);

  return (
    <main className="flex items-center justify-center min-h-screen text-gray-200 p-4">
      <div className="w-full max-w-4xl bg-gray-900/80 border border-yellow-400/50 p-8 rounded-lg shadow-lg">
        <div className="flex items-center gap-4 border-b border-yellow-400/50 pb-4 mb-6">
          <ShieldWarning size={48} className="text-yellow-400" />
          <h1 className="text-3xl md:text-4xl font-bold text-yellow-400">O Perigo Oculto nos QR Codes</h1>
        </div>
        
        <div className="space-y-6 text-lg leading-relaxed">
          <p>
            Você acabou de escanear um QR Code e preencher um formulário que parecia urgente ou exclusivo. 
            Essa é uma tática clássica de <strong className="text-yellow-400">Engenharia Social</strong>. Em um cenário real, seus dados poderiam estar nas mãos de criminosos.
          </p>

          <h2 className="text-2xl font-bold text-green-400 pt-4">Como os Golpes de QR Code Funcionam?</h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
              <h3 className="flex items-center gap-2 text-xl font-semibold mb-2"><FishSimple size={24} /> Phishing (Roubo de Dados)</h3>
              <p className="text-base text-gray-400">O QR Code te leva para um site falso, idêntico ao original (banco, rede social), para roubar seu login e senha.</p>
            </div>
            <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
              <h3 className="flex items-center gap-2 text-xl font-semibold mb-2"><QrCode size={24} /> Malware (Vírus)</h3>
              <p className="text-base text-gray-400">Ao escanear, seu celular pode baixar um arquivo malicioso que rouba seus dados ou danifica o aparelho.</p>
            </div>
          </div>

          <h2 className="text-2xl font-bold text-green-400 pt-4">Como se Proteger?</h2>
          <ul className="list-disc list-inside space-y-2 text-gray-300">
            <li><strong className="text-white">Desconfie de QR Codes em locais públicos.</strong> Eles podem ser adesivos colados sobre os originais.</li>
            <li><strong className="text-white">Verifique a URL</strong> que aparece na pré-visualização antes de clicar.</li>
            <li><strong className="text-white">Nunca baixe aplicativos</strong> ou forneça dados sensíveis a partir de um QR Code desconhecido.</li>
          </ul>

          <div className="text-center pt-6">
            <Link href="/" className="bg-green-500 text-black font-bold py-3 px-6 rounded-md hover:bg-green-400 transition-all">
                Voltar ao Terminal
            </Link>
          </div>
        </div>
      </div>
      
      {/* O modal de sorteio aparecerá sobre este conteúdo após o timer */}
      {showModal && <SorteioModal onClose={() => setShowModal(false)} />}
    </main>
  );
}
