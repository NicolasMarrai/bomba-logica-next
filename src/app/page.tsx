'use client';

import { useState, useEffect, FormEvent } from 'react';
import Link from 'next/link';
import { saveSubmission } from '../../lib/firebase'; 

/**
 * @interface FormData
 * @description Define a estrutura dos dados do formulário do terminal.
 */
interface FormData {
  agentName: string;
  secretCode: string;
  message: string;
}

/**
 * @component LogicBombPage
 * @description A página principal da aplicação, que simula um terminal para "desarmar uma bomba lógica".
 * @returns {JSX.Element}
 */
export default function LogicBombPage() {
  // --- ESTADOS DO COMPONENTE ---
  const [formData, setFormData] = useState<FormData>({
    agentName: '',
    secretCode: '',
    message: '',
  });
  // Máquina de estados para controlar a UI: AWAITING_INPUT | TRANSMITTING_PAYLOAD | PAYLOAD_DELIVERED | SYSTEM_LOCKDOWN
  const [status, setStatus] = useState<string>('AWAITING_INPUT');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [countdown, setCountdown] = useState<number>(180); // 3 minutos em segundos

  // --- EFEITO PARA O CRONÔMETRO REGRESSIVO ---
  useEffect(() => {
    if (countdown <= 0) {
      setStatus('SYSTEM_LOCKDOWN');
      return;
    }
    const timer = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer); // Limpa o timer ao desmontar o componente
  }, [countdown]);

  /**
   * @function handleSubmit
   * @description Lida com a submissão do formulário, salva os dados e atualiza o estado da aplicação.
   * @param {FormEvent<HTMLFormElement>} e - O evento de submissão do formulário.
   */
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isSubmitting || countdown <= 0) return;

    setIsSubmitting(true);
    setStatus('TRANSMITTING_PAYLOAD');

    try {
      // Simula um delay para a "transmissão"
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Envia os dados para o Firebase através da função centralizada
      await saveSubmission(
        formData.agentName,
        formData.secretCode,
        formData.message
      );

      console.log('Payload enviado:', formData);
      setStatus('PAYLOAD_DELIVERED');
    } catch (error) {
      console.error("Transmission Error: ", error);
      setStatus('TRANSMISSION_FAILED');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  /**
   * @function handleChange
   * @description Atualiza o estado do formulário conforme o usuário digita, convertendo para maiúsculas.
   * @param {React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>} e - O evento de mudança do input.
   */
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value.toUpperCase() }));
  };

  /**
   * @function formatTime
   * @description Formata o tempo restante em segundos para o formato MM:SS.
   * @param {number} seconds - O total de segundos.
   * @returns {string} O tempo formatado.
   */
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <main className="flex items-center justify-center min-h-screen text-green-400 p-4">
      <div className="w-full max-w-2xl border-2 border-green-500/50 bg-black/50 p-6 md:p-8 rounded-lg shadow-[0_0_15px_rgba(0,255,0,0.3)] backdrop-blur-sm">
        
        {/* Renderização condicional baseada no estado do sistema */}
        {status !== 'PAYLOAD_DELIVERED' ? (
          <>
            <div className="flex justify-between items-center border-b-2 border-green-500/50 pb-4 mb-6">
              <h1 className="text-xl md:text-3xl font-bold animate-pulse">LOGIC BOMB TERMINAL</h1>
              <div className={`text-2xl md:text-4xl font-bold ${countdown < 60 ? 'text-red-500 animate-ping' : 'text-green-400'}`}>
                {formatTime(countdown)}
              </div>
            </div>

            <div className="mb-6">
              <p className="text-sm text-green-300/80">{ '>'} SYSTEM_STATUS: {status}</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="agentName" className="block text-sm font-bold mb-2">{ '>'} AGENT_ID</label>
                <input
                  type="text"
                  name="agentName"
                  value={formData.agentName}
                  onChange={handleChange}
                  required
                  className="w-full bg-gray-900/50 border-2 border-green-500/30 p-3 rounded-md focus:outline-none focus:border-green-400 caret-green-400"
                  placeholder="INSIRA SEU CÓDIGO DE AGENTE"
                />
              </div>
              <div>
                <label htmlFor="secretCode" className="block text-sm font-bold mb-2">{ '>'} ACTIVATION_CODE</label>
                <input
                  type="password"
                  name="secretCode"
                  value={formData.secretCode}
                  onChange={handleChange}
                  required
                  className="w-full bg-gray-900/50 border-2 border-green-500/30 p-3 rounded-md focus:outline-none focus:border-green-400 caret-green-400"
                  placeholder="********"
                />
              </div>
              <div>
                <label htmlFor="message" className="block text-sm font-bold mb-2">{ '>'} PAYLOAD_MESSAGE (OPTIONAL)</label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows={3}
                  className="w-full bg-gray-900/50 border-2 border-green-500/30 p-3 rounded-md focus:outline-none focus:border-green-400 caret-green-400"
                  placeholder="INSIRA SUA MENSAGEM SECRETA..."
                />
              </div>
              <button
                type="submit"
                disabled={isSubmitting || countdown <= 0}
                className="w-full bg-green-500 text-black font-bold text-lg p-4 rounded-md hover:bg-green-400 transition-all duration-300 disabled:bg-gray-700 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'TRANSMITTING...' : 'ARM & SEND PAYLOAD'}
              </button>
            </form>
          </>
        ) : (
          // --- TELA DE SUCESSO / INTERCEPTAÇÃO ---
          <div className="text-center flex flex-col items-center gap-6">
             <h2 className="text-3xl font-bold text-yellow-400">PAYLOAD INTERCEPTADO</h2>
             <p className="text-lg">Seus dados foram enviados. Mas para onde? E com qual propósito?</p>
             <p>Em um ataque real, suas informações poderiam ter sido roubadas agora mesmo.</p>
             <Link href="/conscientizacao" className="w-full max-w-sm bg-yellow-400 text-black font-bold text-lg p-4 rounded-md hover:bg-yellow-300 transition-all duration-300">
                Entenda o perigo que você correu
             </Link>
          </div>
        )}
      </div>
    </main>
  );
}
