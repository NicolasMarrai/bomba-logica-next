"use client";

import { useState, useEffect, FormEvent } from "react";
import Link from "next/link";
import { saveSubmission } from "../../lib/firebase";
import { Gift, Clock } from "@phosphor-icons/react";
import Confetti from "../../components/ui/Confetti";
import LoadingSkeleton from "../../components/ui/LoadingSkeleton";

/**
 * @interface FormData
 * @description Define a estrutura dos dados do formulário de sorteio.
 */
interface FormData {
  name: string;
  email: string;
  phone: string;
}

/**
 * @component SorteioPage
 * @description Página principal de sorteio que simula um site legítimo de promoção.
 * @returns {JSX.Element}
 */
export default function SorteioPage() {
  // --- ESTADOS DO COMPONENTE ---
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    phone: "",
  });
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [countdown, setCountdown] = useState<number>(300); // 5 minutos em segundos
  const [showConfetti, setShowConfetti] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // --- EFEITO DE LOADING INICIAL ---
  useEffect(() => {
    // Simula carregamento inicial da página
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  // --- EFEITO PARA O CRONÔMETRO REGRESSIVO ---
  useEffect(() => {
    if (countdown <= 0) {
      return;
    }
    const timer = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [countdown]);

  /**
   * @function handleSubmit
   * @description Lida com a submissão do formulário e salva os dados.
   * @param {FormEvent<HTMLFormElement>} e - O evento de submissão do formulário.
   */
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);

    try {
      // Simula um delay para a "processamento"
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Envia os dados para o Firebase
      await saveSubmission(formData.name, formData.email, formData.phone);

      console.log("Dados capturados:", formData);
      
      // Ativa confetes por 4 segundos
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 4000);
      
      setSubmitted(true);
    } catch (error) {
      console.error("Erro ao enviar:", error);
      alert("Erro ao processar. Tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  /**
   * @function handleChange
   * @description Atualiza o estado do formulário conforme o usuário digita.
   * @param {React.ChangeEvent<HTMLInputElement>} e - O evento de mudança do input.
   */
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
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
    return `${minutes.toString().padStart(2, "0")}:${remainingSeconds
      .toString()
      .padStart(2, "0")}`;
  };

  return (
    <main className="flex items-center justify-center min-h-screen bg-gradient-to-br from-purple-600 via-pink-500 to-red-500 p-4 page-transition">
      {/* Confetes quando ganha */}
      {showConfetti && <Confetti />}
      
      {/* Loading Skeleton */}
      {isLoading ? (
        <LoadingSkeleton />
      ) : (
        <div className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden animate-slide-in-up">
          {!submitted ? (
            <>
              {/* Header com countdown */}
              <div className="bg-gradient-to-r from-yellow-400 to-orange-500 p-6 text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Gift size={40} weight="fill" className="text-white animate-bounce-subtle" />
                  <h1 className="text-3xl md:text-4xl font-bold text-white">
                    SORTEIO RELÂMPAGO!
                  </h1>
                </div>
                <p className="text-white text-lg font-semibold">
                  Ganhe um delicioso Sonho de Valsa! 🍫
                </p>
                <div className="mt-4 flex items-center justify-center gap-2 bg-white/20 backdrop-blur-sm rounded-lg p-3 max-w-xs mx-auto animate-pulse-glow">
                  <Clock size={24} className="text-white" weight="bold" />
                  <span className="text-2xl font-bold text-white">
                    {formatTime(countdown)}
                  </span>
                </div>
                <p className="text-white/90 text-sm mt-2">
                  ⚡ Promoção termina em breve!
              </p>
            </div>

            {/* Formulário */}
            <div className="p-8">
              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
                <p className="text-yellow-800 font-semibold">
                  🎉 Apenas preencha o formulário para participar!
                </p>
                <p className="text-yellow-700 text-sm mt-1">
                  São apenas 30 bombons disponíveis. Corre!
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-gray-700 font-semibold mb-2"
                  >
                    Seu Nome Completo *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full border-2 border-gray-300 p-3 rounded-lg focus:outline-none focus:border-purple-500 text-gray-800"
                    placeholder="Ex: João da Silva"
                  />
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="block text-gray-700 font-semibold mb-2"
                  >
                    Seu E-mail *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full border-2 border-gray-300 p-3 rounded-lg focus:outline-none focus:border-purple-500 text-gray-800"
                    placeholder="seuemail@exemplo.com"
                  />
                </div>

                <div>
                  <label
                    htmlFor="phone"
                    className="block text-gray-700 font-semibold mb-2"
                  >
                    Telefone (opcional)
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full border-2 border-gray-300 p-3 rounded-lg focus:outline-none focus:border-purple-500 text-gray-800"
                    placeholder="(11) 99999-9999"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white font-bold text-lg p-4 rounded-lg hover:from-green-600 hover:to-green-700 transition-all duration-300 disabled:bg-gray-400 disabled:cursor-not-allowed shadow-lg transform hover:scale-105"
                >
                  {isSubmitting ? "Processando..." : "🎁 QUERO PARTICIPAR DO SORTEIO!"}
                </button>

                <p className="text-gray-500 text-xs text-center mt-4">
                  Ao participar, você concorda com nossos termos e condições.
                </p>
              </form>
            </div>
          </>
        ) : (
          // --- TELA DE "SUCESSO" / REVELAÇÃO ---
          <div className="p-8 text-center animate-card-flip">
            <div className="mb-6">
              <div className="inline-block p-4 bg-red-100 rounded-full mb-4 animate-bounce-subtle">
                <svg
                  className="w-16 h-16 text-red-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
              </div>
              <h2 className="text-3xl font-bold text-red-600 mb-4">
                ATENÇÃO: DADOS CAPTURADOS!
              </h2>
              <p className="text-gray-700 text-lg mb-4">
                Você acabou de entregar suas informações pessoais para um site desconhecido.
              </p>
              <p className="text-gray-600 mb-6">
                Em uma situação real, seus dados poderiam estar sendo vendidos, 
                usados para spam, phishing ou golpes mais elaborados.
              </p>
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6 text-left">
                <p className="text-yellow-800 font-semibold mb-2">
                  ⚠️ O que golpistas fariam com seus dados:
                </p>
                <ul className="text-yellow-700 text-sm space-y-1 list-disc list-inside">
                  <li>Enviar emails de phishing personalizados</li>
                  <li>Vender sua lista de contatos</li>
                  <li>Aplicar golpes via WhatsApp/SMS</li>
                  <li>Criar perfis falsos em seu nome</li>
                </ul>
              </div>
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 text-left">
                <p className="text-red-800 font-extrabold mb-2">
                  ⚠️ <u>IMPORTANTE:</u> 
                </p>
                <p className="text-red-700 font-semibold text-sm">
                  ‼️OS DADOS INFORMADOS FORAM USADOS APENAS PARA FINS ACADÊMICOS. 
                </p>
                <p className="text-red-700 font-semibold text-sm">
                  ‼️NENHUMA INFORMAÇÃO SERÁ UTILIZADA POR TERCEIROS.
                </p>
              </div>
            </div>
            <Link
              href="/conscientizacao"
              className="inline-block bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold text-lg py-4 px-8 rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all duration-300 shadow-lg"
            >
              Entenda como se proteger →
            </Link>
          </div>
        )}
        </div>
      )}
    </main>
  );
}
