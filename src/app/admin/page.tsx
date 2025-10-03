'use client';

import { useState, useEffect } from 'react';
import { getAdminDashboardData, updatePrizeCount } from '../../../lib/firebase'; // Ajuste o caminho se necessário
import { Lock, FloppyDisk, Users, Gift, Eye } from '@phosphor-icons/react/dist/ssr';

interface Submission {
  id: string;
  agentId: string;
  timestamp: string;
  wonPrize: boolean;
  payloadMessage: string;
}

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [remainingPrizes, setRemainingPrizes] = useState(0);
  const [newPrizeCount, setNewPrizeCount] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const correctPassword = process.env.NEXT_PUBLIC_ADMIN_PASSWORD;

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const data = await getAdminDashboardData();
      setSubmissions(data.submissions);
      setRemainingPrizes(data.remainingPrizes);
      setNewPrizeCount(String(data.remainingPrizes));
    } catch (e) {
      console.error("Failed to fetch admin data:", e);
      setError("Failed to load dashboard data.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchData();
    }
  }, [isAuthenticated]);

  const handleLogin = () => {
    if (password === correctPassword) {
      setIsAuthenticated(true);
      setError('');
    } else {
      setError('Senha incorreta.');
    }
  };

  const handlePrizeUpdate = async () => {
    const count = parseInt(newPrizeCount, 10);
    if (!isNaN(count) && count >= 0) {
      try {
        await updatePrizeCount(count);
        setRemainingPrizes(count);
        alert('Estoque de prêmios atualizado com sucesso!');
      } catch (e) {
        alert('Falha ao atualizar o estoque.');
      }
    } else {
      alert('Por favor, insira um número válido.');
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
        <div className="w-full max-w-sm p-8 bg-gray-800 border border-yellow-400/50 rounded-lg">
          <h1 className="text-2xl font-bold text-center mb-6 text-yellow-400">Acesso Restrito</h1>
          <div className="space-y-4">
            <div>
              <label className="block mb-2">Senha de Acesso</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
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

  return (
    <main className="min-h-screen bg-gray-900 text-gray-200 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-yellow-400">Painel de Controle</h1>
        
        {/* Seção de Controle de Estoque */}
        <div className="bg-gray-800 p-6 rounded-lg mb-8 border border-gray-700">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2"><Gift size={28}/> Controle de Prêmios</h2>
            <div className="flex flex-col md:flex-row items-center gap-4">
                <p className="text-lg">Prêmios restantes: <span className="font-bold text-2xl text-yellow-400">{remainingPrizes}</span></p>
                <div className="flex items-center gap-2">
                    <input 
                        type="number"
                        value={newPrizeCount}
                        onChange={(e) => setNewPrizeCount(e.target.value)}
                        className="p-2 w-24 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400"
                    />
                    <button onClick={handlePrizeUpdate} className="flex items-center gap-2 bg-yellow-500 text-black font-bold py-2 px-4 rounded-md hover:bg-yellow-400">
                        <FloppyDisk size={20}/> Salvar
                    </button>
                </div>
            </div>
        </div>

        {/* Seção de Logs de Submissão */}
        <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2"><Users size={28}/> Logs de Submissão</h2>
            {isLoading ? <p>Carregando dados...</p> : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-gray-700">
                    <th className="p-2">Agente ID</th>
                    <th className="p-2">Data/Hora</th>
                    <th className="p-2 text-center">Ganhou Prêmio?</th>
                    <th className="p-2">Mensagem</th>
                  </tr>
                </thead>
                <tbody>
                  {submissions.map(sub => (
                    <tr key={sub.id} className="border-b border-gray-700/50 hover:bg-gray-700/50">
                      <td className="p-2 font-mono">{sub.agentId}</td>
                      <td className="p-2">{new Date(sub.timestamp).toLocaleString('pt-BR')}</td>
                      <td className="p-2 text-center">
                        <span className={`px-2 py-1 rounded-full text-xs font-bold ${sub.wonPrize ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                          {sub.wonPrize ? 'SIM' : 'NÃO'}
                        </span>
                      </td>
                      <td className="p-2 font-mono text-sm text-gray-400">{sub.payloadMessage || 'N/A'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            )}
        </div>
      </div>
    </main>
  );
}
