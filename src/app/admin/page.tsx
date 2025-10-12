"use client";

import { useState, useEffect } from "react";
import {
  updatePrizeCount,
  subscribeToAdminDashboard,
  clearAllData,
} from "../../../lib/firebase";
import { Lock, FloppyDisk, Users, Gift, TrendUp, CheckCircle, XCircle, ChartBar, Trash, Warning } from "@phosphor-icons/react/dist/ssr";

/**
 * @interface Submission
 * @description Define a estrutura de um registro de submissão para a listagem no painel.
 */
interface Submission {
  id: string;
  name: string;
  email: string;
  phone: string;
  timestamp: string;
  wonPrize: boolean;
  userId: string;
  systemInfo: {
    browser: string;
    os: string;
    device: string;
  };
}

/**
 * @component AdminPage
 * @description Painel de administração para visualizar submissões e gerenciar o estoque de prêmios.
 * @returns {JSX.Element}
 */
export default function AdminPage() {
  // --- ESTADOS DE AUTENTICAÇÃO E DADOS ---
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [remainingPrizes, setRemainingPrizes] = useState(0);
  const [newPrizeCount, setNewPrizeCount] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [showClearModal, setShowClearModal] = useState(false);
  const [clearConfirmText, setClearConfirmText] = useState("");

  // A senha é carregada a partir de variáveis de ambiente para segurança.
  const correctPassword = process.env.NEXT_PUBLIC_ADMIN_PASSWORD;

  // Efeito que se inscreve para atualizações em tempo real assim que o usuário é autenticado.
  useEffect(() => {
    if (isAuthenticated) {
      setIsLoading(true);

      // Inscreve-se para atualizações em tempo real
      const unsubscribe = subscribeToAdminDashboard((data) => {
        setSubmissions(data.submissions);
        setRemainingPrizes(data.remainingPrizes);
        setNewPrizeCount(String(data.remainingPrizes));
        setIsLoading(false);
      });

      // Limpa a inscrição quando o componente for desmontado ou o usuário deslogar
      return () => {
        unsubscribe();
      };
    }
  }, [isAuthenticated]);

  /**
   * @function handleLogin
   * @description Valida a senha inserida pelo usuário e libera o acesso ao painel.
   */
  const handleLogin = () => {
    if (password === correctPassword) {
      setIsAuthenticated(true);
      setError("");
    } else {
      setError("Senha incorreta.");
    }
  };

  /**
   * @function handlePrizeUpdate
   * @description Envia a nova contagem de prêmios para o Firebase e atualiza o estado local
   * para refletir a mudança na interface.
   */
  const handlePrizeUpdate = async () => {
    const count = parseInt(newPrizeCount, 10);
    if (!isNaN(count) && count >= 0) {
      try {
        await updatePrizeCount(count);
        setRemainingPrizes(count);
        alert("Estoque de prêmios atualizado com sucesso!");
      } catch (e) {
        console.error("Falha ao atualizar o estoque:", e);
        alert("Falha ao atualizar o estoque.");
      }
    } else {
      alert("Por favor, insira um número válido.");
    }
  };

  /**
   * @function handleClearData
   * @description Limpa todos os dados de teste do Firebase após confirmação.
   */
  const handleClearData = async () => {
    if (clearConfirmText !== "LIMPAR") {
      alert("Digite 'LIMPAR' para confirmar a exclusão.");
      return;
    }

    try {
      await clearAllData();
      setShowClearModal(false);
      setClearConfirmText("");
      alert("Todos os dados foram removidos com sucesso!");
    } catch (e) {
      console.error("Erro ao limpar dados:", e);
      alert("Erro ao limpar os dados. Verifique o console.");
    }
  };

  // --- TELA DE LOGIN ---
  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
        <div className="w-full max-w-sm p-8 bg-gray-800 border border-yellow-400/50 rounded-lg">
          <h1 className="text-2xl font-bold text-center mb-6 text-yellow-400">
            Acesso Restrito
          </h1>
          <div className="space-y-4">
            <div>
              <label className="block mb-2">Senha de Acesso</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleLogin()}
                className="w-full p-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400"
              />
            </div>
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <button
              onClick={handleLogin}
              className="w-full flex items-center justify-center gap-2 bg-yellow-500 text-black font-bold py-2 px-4 rounded-md hover:bg-yellow-400"
            >
              <Lock size={20} />
              Desbloquear
            </button>
          </div>
        </div>
      </div>
    );
  }

  // --- PAINEL PRINCIPAL ---
  return (
    <main className="min-h-screen bg-gray-900 text-gray-200 p-4 md:p-8 page-transition">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-yellow-400 animate-fade-in">
          Painel Administrativo - Sorteio de Bombons
        </h1>

        {/* Cards de Estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Total de Participantes */}
          <div className="bg-gradient-to-br from-blue-600 to-blue-800 p-6 rounded-lg shadow-lg card-hover animate-slide-in-up">
            <div className="flex items-center justify-between mb-4">
              <Users size={40} weight="fill" className="text-white/80" />
              <TrendUp size={24} className="text-white/60" />
            </div>
            <h3 className="text-white/80 text-sm font-semibold uppercase mb-1">
              Total de Participantes
            </h3>
            <p className="text-4xl font-bold text-white">
              {submissions.length}
            </p>
          </div>

          {/* Ganhadores */}
          <div className="bg-gradient-to-br from-green-600 to-green-800 p-6 rounded-lg shadow-lg card-hover animate-slide-in-up" style={{ animationDelay: '0.1s' }}>
            <div className="flex items-center justify-between mb-4">
              <CheckCircle size={40} weight="fill" className="text-white/80" />
              <Gift size={24} className="text-white/60" />
            </div>
            <h3 className="text-white/80 text-sm font-semibold uppercase mb-1">
              Ganhadores
            </h3>
            <p className="text-4xl font-bold text-white">
              {submissions.filter((s) => s.wonPrize).length}
            </p>
            <p className="text-white/70 text-sm mt-1">
              {submissions.length > 0
                ? `${((submissions.filter((s) => s.wonPrize).length / submissions.length) * 100).toFixed(1)}%`
                : "0%"}{" "}
              de vitórias
            </p>
          </div>

          {/* Não Ganhadores */}
          <div className="bg-gradient-to-br from-red-600 to-red-800 p-6 rounded-lg shadow-lg card-hover animate-slide-in-up" style={{ animationDelay: '0.2s' }}>
            <div className="flex items-center justify-between mb-4">
              <XCircle size={40} weight="fill" className="text-white/80" />
              <ChartBar size={24} className="text-white/60" />
            </div>
            <h3 className="text-white/80 text-sm font-semibold uppercase mb-1">
              Sem Prêmio
            </h3>
            <p className="text-4xl font-bold text-white">
              {submissions.filter((s) => !s.wonPrize).length}
            </p>
            <p className="text-white/70 text-sm mt-1">
              {submissions.length > 0
                ? `${((submissions.filter((s) => !s.wonPrize).length / submissions.length) * 100).toFixed(1)}%`
                : "0%"}{" "}
              dos participantes
            </p>
          </div>

          {/* Prêmios Restantes */}
          <div className="bg-gradient-to-br from-yellow-600 to-orange-600 p-6 rounded-lg shadow-lg card-hover animate-slide-in-up" style={{ animationDelay: '0.3s' }}>
            <div className="flex items-center justify-between mb-4">
              <Gift size={40} weight="fill" className="text-white/80" />
              <span className="text-white/60 text-sm font-semibold">
                {remainingPrizes > 0 ? "Disponível" : "Esgotado"}
              </span>
            </div>
            <h3 className="text-white/80 text-sm font-semibold uppercase mb-1">
              Prêmios Restantes
            </h3>
            <p className="text-4xl font-bold text-white">{remainingPrizes}</p>
            <p className="text-white/70 text-sm mt-1">
              {submissions.filter((s) => s.wonPrize).length} já distribuídos
            </p>
          </div>
        </div>

        {/* Seção de Controle de Estoque */}
        <div className="bg-gray-800 p-6 rounded-lg mb-8 border border-gray-700">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <Gift size={28} /> Controle de Prêmios (Bombons)
          </h2>
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex flex-col md:flex-row items-center gap-4">
              <p className="text-lg">
                Prêmios restantes:{" "}
                <span className="font-bold text-2xl text-yellow-400">
                  {remainingPrizes}
                </span>
              </p>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={newPrizeCount}
                  onChange={(e) => setNewPrizeCount(e.target.value)}
                  className="p-2 w-24 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400"
                />
                <button
                  onClick={handlePrizeUpdate}
                  className="flex items-center gap-2 bg-yellow-500 text-black font-bold py-2 px-4 rounded-md hover:bg-yellow-400"
                >
                  <FloppyDisk size={20} /> Salvar
                </button>
              </div>
            </div>
            
            {/* Botão de Limpeza */}
            <button
              onClick={() => setShowClearModal(true)}
              className="flex items-center gap-2 bg-red-600 text-white font-bold py-2 px-4 rounded-md hover:bg-red-700 transition-colors"
              title="Limpar todos os dados de teste"
            >
              <Trash size={20} weight="bold" /> Limpar Dados de Teste
            </button>
          </div>
        </div>

        {/* Seção de Logs de Submissão */}
        <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <Users size={28} /> Participantes do Sorteio
          </h2>

          {/* Resumo Rápido */}
          {!isLoading && submissions.length > 0 && (
            <div className="bg-gray-700/30 p-4 rounded-lg mb-6 grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <p className="text-gray-400 text-sm">Última Participação</p>
                <p className="text-white font-semibold text-sm mt-1">
                  {new Date(
                    Math.max(...submissions.map((s) => new Date(s.timestamp).getTime()))
                  ).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}
                </p>
              </div>
              <div className="text-center">
                <p className="text-gray-400 text-sm">Taxa de Vitória</p>
                <p className="text-white font-semibold text-sm mt-1">
                  {((submissions.filter((s) => s.wonPrize).length / submissions.length) * 100).toFixed(1)}%
                </p>
              </div>
              <div className="text-center">
                <p className="text-gray-400 text-sm">Emails Únicos</p>
                <p className="text-white font-semibold text-sm mt-1">
                  {new Set(submissions.map((s) => s.email)).size}
                </p>
              </div>
              <div className="text-center">
                <p className="text-gray-400 text-sm">Com Telefone</p>
                <p className="text-white font-semibold text-sm mt-1">
                  {submissions.filter((s) => s.phone).length} ({((submissions.filter((s) => s.phone).length / submissions.length) * 100).toFixed(0)}%)
                </p>
              </div>
            </div>
          )}

          {isLoading ? (
            <p>Carregando dados...</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-gray-700">
                    <th className="p-2">Nome</th>
                    <th className="p-2">Email</th>
                    <th className="p-2">Telefone</th>
                    <th className="p-2">Sistema</th>
                    <th className="p-2">Data/Hora</th>
                    <th className="p-2 text-center">Ganhou?</th>
                  </tr>
                </thead>
                <tbody>
                  {submissions.map((sub) => (
                    <tr
                      key={sub.id}
                      className="border-b border-gray-700/50 hover:bg-gray-700/50"
                    >
                      <td className="p-2">{sub.name}</td>
                      <td className="p-2 font-mono text-sm">{sub.email}</td>
                      <td className="p-2">{sub.phone || "N/A"}</td>
                      <td className="p-2 font-mono text-xs">
                        {sub.systemInfo
                          ? `${sub.systemInfo.browser} on ${sub.systemInfo.os}`
                          : "N/A"}
                      </td>
                      <td className="p-2 text-sm">
                        {new Date(sub.timestamp).toLocaleString("pt-BR")}
                      </td>
                      <td className="p-2 text-center">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-bold ${
                            sub.wonPrize
                              ? "bg-green-500/20 text-green-400"
                              : "bg-red-500/20 text-red-400"
                          }`}
                        >
                          {sub.wonPrize ? "SIM" : "NÃO"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Estatísticas Adicionais */}
          {!isLoading && submissions.length > 0 && (
            <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Distribuição de Dispositivos */}
              <div className="bg-gray-700/50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                  <ChartBar size={20} /> Dispositivos
                </h3>
                <div className="space-y-2">
                  {(() => {
                    const devices = submissions.reduce((acc: Record<string, number>, sub) => {
                      const device = sub.systemInfo?.device || "desktop";
                      acc[device] = (acc[device] || 0) + 1;
                      return acc;
                    }, {});
                    return Object.entries(devices).map(([device, count]) => (
                      <div key={device} className="flex justify-between items-center">
                        <span className="text-gray-300 capitalize">{device}</span>
                        <div className="flex items-center gap-2">
                          <div className="w-24 bg-gray-600 rounded-full h-2">
                            <div
                              className="bg-blue-500 h-2 rounded-full"
                              style={{ width: `${(count / submissions.length) * 100}%` }}
                            ></div>
                          </div>
                          <span className="text-white font-semibold text-sm w-8">
                            {count}
                          </span>
                        </div>
                      </div>
                    ));
                  })()}
                </div>
              </div>

              {/* Navegadores Mais Usados */}
              <div className="bg-gray-700/50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                  <ChartBar size={20} /> Navegadores
                </h3>
                <div className="space-y-2">
                  {(() => {
                    const browsers = submissions.reduce((acc: Record<string, number>, sub) => {
                      const browser = sub.systemInfo?.browser?.split(" ")[0] || "Desconhecido";
                      acc[browser] = (acc[browser] || 0) + 1;
                      return acc;
                    }, {});
                    return Object.entries(browsers)
                      .sort(([, a], [, b]) => b - a)
                      .slice(0, 5)
                      .map(([browser, count]) => (
                        <div key={browser} className="flex justify-between items-center">
                          <span className="text-gray-300">{browser}</span>
                          <div className="flex items-center gap-2">
                            <div className="w-24 bg-gray-600 rounded-full h-2">
                              <div
                                className="bg-green-500 h-2 rounded-full"
                                style={{ width: `${(count / submissions.length) * 100}%` }}
                              ></div>
                            </div>
                            <span className="text-white font-semibold text-sm w-8">
                              {count}
                            </span>
                          </div>
                        </div>
                      ));
                  })()}
                </div>
              </div>

              {/* Sistemas Operacionais */}
              <div className="bg-gray-700/50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                  <ChartBar size={20} /> Sistemas
                </h3>
                <div className="space-y-2">
                  {(() => {
                    const systems = submissions.reduce((acc: Record<string, number>, sub) => {
                      const os = sub.systemInfo?.os?.split(" ")[0] || "Desconhecido";
                      acc[os] = (acc[os] || 0) + 1;
                      return acc;
                    }, {});
                    return Object.entries(systems)
                      .sort(([, a], [, b]) => b - a)
                      .map(([os, count]) => (
                        <div key={os} className="flex justify-between items-center">
                          <span className="text-gray-300">{os}</span>
                          <div className="flex items-center gap-2">
                            <div className="w-24 bg-gray-600 rounded-full h-2">
                              <div
                                className="bg-purple-500 h-2 rounded-full"
                                style={{ width: `${(count / submissions.length) * 100}%` }}
                              ></div>
                            </div>
                            <span className="text-white font-semibold text-sm w-8">
                              {count}
                            </span>
                          </div>
                        </div>
                      ));
                  })()}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Gráfico de Taxa de Conversão */}
        {!isLoading && submissions.length > 0 && (
          <div className="bg-gray-800 p-6 rounded-lg border border-gray-700 mt-8">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <ChartBar size={28} /> Análise Geral
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Gráfico de Pizza Visual */}
              <div className="bg-gray-700/30 p-6 rounded-lg">
                <h3 className="text-lg font-semibold mb-4 text-center">
                  Distribuição de Resultados
                </h3>
                <div className="flex items-center justify-center gap-8">
                  <div className="relative">
                    <svg width="200" height="200" viewBox="0 0 200 200">
                      {/* Background circle */}
                      <circle
                        cx="100"
                        cy="100"
                        r="80"
                        fill="transparent"
                        stroke="#374151"
                        strokeWidth="40"
                      />
                      {/* Winners arc */}
                      <circle
                        cx="100"
                        cy="100"
                        r="80"
                        fill="transparent"
                        stroke="#10B981"
                        strokeWidth="40"
                        strokeDasharray={`${(submissions.filter((s) => s.wonPrize).length / submissions.length) * 502.4} 502.4`}
                        transform="rotate(-90 100 100)"
                        strokeLinecap="round"
                      />
                      {/* Center text */}
                      <text
                        x="100"
                        y="95"
                        textAnchor="middle"
                        fill="white"
                        fontSize="32"
                        fontWeight="bold"
                      >
                        {((submissions.filter((s) => s.wonPrize).length / submissions.length) * 100).toFixed(0)}%
                      </text>
                      <text
                        x="100"
                        y="115"
                        textAnchor="middle"
                        fill="#9CA3AF"
                        fontSize="14"
                      >
                        Vitórias
                      </text>
                    </svg>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-4 h-4 bg-green-500 rounded"></div>
                      <div>
                        <p className="text-white font-semibold">
                          {submissions.filter((s) => s.wonPrize).length} Ganharam
                        </p>
                        <p className="text-gray-400 text-sm">
                          Receberam prêmios
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-4 h-4 bg-gray-600 rounded"></div>
                      <div>
                        <p className="text-white font-semibold">
                          {submissions.filter((s) => !s.wonPrize).length} Não Ganharam
                        </p>
                        <p className="text-gray-400 text-sm">
                          Tentaram a sorte
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Métricas de Engajamento */}
              <div className="bg-gray-700/30 p-6 rounded-lg">
                <h3 className="text-lg font-semibold mb-4">Métricas de Engajamento</h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-gray-300">Preencheram Telefone</span>
                      <span className="text-white font-semibold">
                        {((submissions.filter((s) => s.phone).length / submissions.length) * 100).toFixed(0)}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-600 rounded-full h-3">
                      <div
                        className="bg-blue-500 h-3 rounded-full transition-all duration-500"
                        style={{ width: `${(submissions.filter((s) => s.phone).length / submissions.length) * 100}%` }}
                      ></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-gray-300">Taxa de Sucesso</span>
                      <span className="text-white font-semibold">
                        {((submissions.filter((s) => s.wonPrize).length / submissions.length) * 100).toFixed(1)}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-600 rounded-full h-3">
                      <div
                        className="bg-green-500 h-3 rounded-full transition-all duration-500"
                        style={{ width: `${(submissions.filter((s) => s.wonPrize).length / submissions.length) * 100}%` }}
                      ></div>
                    </div>
                    <p className="text-gray-400 text-xs mt-1">
                      Meta teórica: 25% (sorteio aleatório)
                    </p>
                  </div>

                  <div className="pt-4 border-t border-gray-600">
                    <p className="text-gray-300 mb-2">
                      <strong className="text-white">
                        {submissions.length}
                      </strong>{" "}
                      participações totais
                    </p>
                    <p className="text-gray-300">
                      <strong className="text-white">
                        {new Set(submissions.map((s) => s.email)).size}
                      </strong>{" "}
                      emails únicos
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modal de Confirmação de Limpeza */}
      {showClearModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 border-2 border-red-500 rounded-lg shadow-2xl w-full max-w-md p-6">
            <div className="flex items-center gap-3 mb-4">
              <Warning size={40} weight="fill" className="text-red-500" />
              <h2 className="text-2xl font-bold text-red-500">
                ⚠️ ATENÇÃO!
              </h2>
            </div>
            
            <div className="space-y-4 mb-6">
              <p className="text-white font-semibold">
                Você está prestes a EXCLUIR TODOS OS DADOS:
              </p>
              <ul className="list-disc list-inside text-gray-300 space-y-1 ml-4">
                <li>Todas as {submissions.length} participações</li>
                <li>Todos os registros de ganhadores</li>
                <li>Histórico completo de submissões</li>
              </ul>
              
              <div className="bg-red-900/30 border border-red-500/50 rounded p-3">
                <p className="text-red-300 text-sm font-semibold">
                  ⚠️ Esta ação é IRREVERSÍVEL!
                </p>
                <p className="text-red-400 text-xs mt-1">
                  Os dados não poderão ser recuperados após a exclusão.
                </p>
              </div>

              <div className="bg-yellow-900/30 border border-yellow-500/50 rounded p-3">
                <p className="text-yellow-300 text-sm">
                  💡 <strong>Dica:</strong> Use esta função apenas para limpar dados de teste antes da feira começar.
                </p>
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-white font-semibold mb-2">
                Digite <span className="text-red-500 font-mono">LIMPAR</span> para confirmar:
              </label>
              <input
                type="text"
                value={clearConfirmText}
                onChange={(e) => setClearConfirmText(e.target.value.toUpperCase())}
                placeholder="Digite LIMPAR"
                className="w-full p-3 bg-gray-700 border-2 border-gray-600 rounded-md focus:outline-none focus:border-red-500 text-white font-mono"
                autoFocus
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowClearModal(false);
                  setClearConfirmText("");
                }}
                className="flex-1 bg-gray-700 text-white font-bold py-3 px-4 rounded-md hover:bg-gray-600 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleClearData}
                disabled={clearConfirmText !== "LIMPAR"}
                className="flex-1 bg-red-600 text-white font-bold py-3 px-4 rounded-md hover:bg-red-700 disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
              >
                <Trash size={20} weight="bold" />
                Excluir Tudo
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
