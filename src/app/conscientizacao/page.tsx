"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ShieldWarning,
  EnvelopeSimple,
  UserCircle,
  Warning,
  CheckCircle,
} from "@phosphor-icons/react";
import SorteioModal from "../../../components/ui/SorteioModal";

/**
 * @component AwarenessPage
 * @description Página de conscientização que explica os perigos de sorteios falsos e captura de dados.
 * @returns {JSX.Element}
 */
export default function AwarenessPage() {
  // Estado para controlar a visibilidade do modal de sorteio.
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    // Este timer faz o modal aparecer 8 segundos após a página carregar, incentivando a leitura.
    const timer = setTimeout(() => {
      setShowModal(true);
    }, 8000);

    // Limpa o timer se o componente for desmontado para evitar vazamentos de memória.
    return () => clearTimeout(timer);
  }, []);

  return (
    <main className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-gray-200 p-4 page-transition">
      <div className="w-full max-w-4xl bg-white/10 backdrop-blur-lg border border-gray-700/80 p-8 rounded-2xl shadow-2xl animate-slide-in-up">
        <div className="flex items-center gap-4 border-b border-gray-700/80 pb-4 mb-6 animate-fade-in">
          <ShieldWarning
            size={48}
            className="text-yellow-400 animate-bounce-subtle"
          />
          <h1 className="text-3xl md:text-4xl font-bold text-yellow-400">
            Você Acabou de Cair em uma Armadilha!
          </h1>
        </div>

        <div className="space-y-6 text-lg leading-relaxed">
          <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-4">
            <p className="text-white">
              Você preencheu um formulário de sorteio e entregou seus dados
              pessoais sem verificar se o site era legítimo. Em uma situação
              real, suas informações já estariam nas mãos de golpistas.
            </p>
          </div>

          <h2 className="text-2xl font-bold text-purple-400 pt-4">
            Como Funcionam os Golpes de Sorteios Falsos?
          </h2>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-gray-800/50 p-5 rounded-lg border border-purple-500/30 card-hover">
              <h3 className="flex items-center gap-2 text-xl font-semibold mb-3 text-purple-300">
                <EnvelopeSimple size={24} weight="fill" /> Spam em Massa
              </h3>
              <p className="text-base text-gray-300">
                Seu email é adicionado a listas de spam e você passa a receber
                centenas de emails indesejados, incluindo outros golpes.
              </p>
            </div>
            <div className="bg-gray-800/50 p-5 rounded-lg border border-red-500/30 card-hover">
              <h3 className="flex items-center gap-2 text-xl font-semibold mb-3 text-red-300">
                <UserCircle size={24} weight="fill" /> Venda de Dados
              </h3>
              <p className="text-base text-gray-300">
                Suas informações são vendidas para empresas de marketing ou
                usadas em golpes personalizados de phishing.
              </p>
            </div>
            <div className="bg-gray-800/50 p-5 rounded-lg border border-orange-500/30 card-hover">
              <h3 className="flex items-center gap-2 text-xl font-semibold mb-3 text-orange-300">
                <Warning size={24} weight="fill" /> Golpes Dirigidos
              </h3>
              <p className="text-base text-gray-300">
                Criminosos usam seu nome e email para criar mensagens
                convincentes, fingindo ser empresas conhecidas.
              </p>
            </div>
            <div className="bg-gray-800/50 p-5 rounded-lg border border-yellow-500/30 card-hover">
              <h3 className="flex items-center gap-2 text-xl font-semibold mb-3 text-yellow-300">
                <ShieldWarning size={24} weight="fill" /> Roubo de Identidade
              </h3>
              <p className="text-base text-gray-300">
                Com mais dados coletados de outras fontes, podem tentar abrir
                contas ou fazer compras em seu nome.
              </p>
            </div>
          </div>

          <h2 className="text-2xl font-bold text-green-400 pt-6">
            Como se Proteger de Sorteios Falsos?
          </h2>
          <ul className="space-y-3 text-gray-300">
            <li className="flex items-start gap-3">
              <CheckCircle
                size={24}
                className="text-green-400 flex-shrink-0 mt-1"
                weight="fill"
              />
              <div>
                <strong className="text-white">
                  Verifique a legitimidade:
                </strong>{" "}
                Pesquise o nome da promoção no Google. Sorteios reais têm
                regulamentos claros e empresas conhecidas por trás.
              </div>
            </li>
            <li className="flex items-start gap-3">
              <CheckCircle
                size={24}
                className="text-green-400 flex-shrink-0 mt-1"
                weight="fill"
              />
              <div>
                <strong className="text-white">Desconfie de urgência:</strong>{" "}
                Cronômetros regressivos e frases como &ldquo;últimas
                vagas&rdquo; são táticas para forçar decisões rápidas.
              </div>
            </li>
            <li className="flex items-start gap-3">
              <CheckCircle
                size={24}
                className="text-green-400 flex-shrink-0 mt-1"
                weight="fill"
              />
              <div>
                <strong className="text-white">Observe o domínio:</strong> Sites
                legítimos têm URLs profissionais. Desconfie de domínios
                estranhos ou muito genéricos.
              </div>
            </li>
            <li className="flex items-start gap-3">
              <CheckCircle
                size={24}
                className="text-green-400 flex-shrink-0 mt-1"
                weight="fill"
              />
              <div>
                <strong className="text-white">
                  Nunca forneça dados sensíveis:
                </strong>{" "}
                Sorteios legítimos não pedem CPF, senhas ou dados bancários no
                cadastro inicial.
              </div>
            </li>
            <li className="flex items-start gap-3">
              <CheckCircle
                size={24}
                className="text-green-400 flex-shrink-0 mt-1"
                weight="fill"
              />
              <div>
                <strong className="text-white">Use emails descartáveis:</strong>{" "}
                Para sorteios que você não tem certeza, use serviços de email
                temporário.
              </div>
            </li>
          </ul>

          <div className="bg-blue-500/20 border border-blue-500/50 rounded-lg p-4 mt-6">
            <p className="text-blue-200">
              💡 <strong>Dica:</strong> Se algo parece bom demais para ser
              verdade (prêmios incríveis com participação muito fácil),
              provavelmente é um golpe!
            </p>
          </div>

          <div className="text-center pt-6">
            <Link
              href="/"
              className="inline-block bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold py-3 px-8 rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg"
            >
              ← Voltar ao Início
            </Link>
          </div>

          {/* Rodapé com informações da UNIUBE e ENTEC */}
          <div className="mt-8 pt-6 border-t border-gray-700/50 text-center">
            {/* Logo UNIUBE - versão discreta */}
            <div className="flex justify-center mb-4">
              <div className="bg-white/90 px-3 py-1.5 rounded-sm shadow-sm opacity-80 hover:opacity-100 transition-opacity">
                <Image
                  src="/logo_uniube.svg"
                  alt="Logo UNIUBE"
                  width={120}
                  height={37}
                  priority
                  className="h-auto"
                />
              </div>
            </div>
            <p className="text-gray-400 text-sm">
              <strong className="text-white">UNIUBE - Campus Aeroporto</strong>
            </p>
            <p className="text-gray-400 text-sm mb-2">
              Projeto desenvolvido para a{" "}
              <strong className="text-white">ENTEC 2025</strong>
            </p>
            <p className="text-gray-500 text-xs mt-2">
              Conscientização sobre Segurança Digital e Engenharia Social
            </p>
          </div>
        </div>
      </div>

      {/* O modal de sorteio verdadeiro aparecerá sobre este conteúdo após o timer */}
      {showModal && <SorteioModal onClose={() => setShowModal(false)} />}
    </main>
  );
}
