import { useState, useEffect, useCallback } from "react";
import {
  updatePrizeCount,
  subscribeToAdminDashboard,
  clearAllData,
  validateRedeemCode,
} from "../lib/firebase";
import type { Submission } from "../types/index";

/**
 * @interface UseAdminDashboardReturn
 * @description Define a estrutura de retorno do hook useAdminDashboard.
 * Contém todos os estados, funções e utilitários necessários para o painel administrativo.
 */
interface UseAdminDashboardReturn {
  // Estados de autenticação
  isAuthenticated: boolean;
  password: string;
  error: string;
  setPassword: (password: string) => void;
  handleLogin: () => void;

  // Estados de dados
  submissions: Submission[];
  remainingPrizes: number;
  isLoading: boolean;

  // Estados de prêmios
  newPrizeCount: string;
  setNewPrizeCount: (count: string) => void;
  handlePrizeUpdate: () => Promise<void>;

  // Estados de limpeza
  showClearModal: boolean;
  setShowClearModal: (show: boolean) => void;
  clearConfirmText: string;
  setClearConfirmText: (text: string) => void;
  handleClearData: () => Promise<void>;

  // Estados de privacidade
  hideEmails: boolean;
  setHideEmails: (hide: boolean) => void;
  hidePhones: boolean;
  setHidePhones: (hide: boolean) => void;

  // Estados de validação de código
  redeemCodeInput: string;
  setRedeemCodeInput: (code: string) => void;
  validationMessage: string;
  validationSuccess: boolean;
  isValidating: boolean;
  handleValidateCode: () => Promise<void>;

  // Estados de visibilidade de códigos
  visibleCodes: Set<string>;
  toggleCodeVisibility: (submissionId: string) => void;

  // Funções utilitárias
  maskEmail: (email: string) => string;
  maskPhone: (phone: string) => string;
}

/**
 * @hook useAdminDashboard
 * @description Hook personalizado para gerenciar toda a lógica do painel administrativo.
 * Encapsula estados de autenticação, dados, prêmios, validação de códigos e funções utilitárias.
 * 
 * Funcionalidades:
 * - Autenticação com senha
 * - Gerenciamento de submissões e prêmios em tempo real
 * - Validação de códigos de resgate
 * - Limpeza de dados de teste
 * - Mascaramento de dados sensíveis (emails e telefones)
 * - Controle de visibilidade de códigos
 * 
 * @returns {UseAdminDashboardReturn} Objeto contendo todos os estados e funções do dashboard
 * 
 * @example
 * const {
 *   isAuthenticated,
 *   handleLogin,
 *   submissions,
 *   remainingPrizes,
 *   handleValidateCode
 * } = useAdminDashboard();
 */
export function useAdminDashboard(): UseAdminDashboardReturn {
  // --- ESTADOS DE AUTENTICAÇÃO ---
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  // --- ESTADOS DE DADOS ---
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [remainingPrizes, setRemainingPrizes] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  // --- ESTADOS DE PRÊMIOS ---
  const [newPrizeCount, setNewPrizeCount] = useState("");

  // --- ESTADOS DE LIMPEZA ---
  const [showClearModal, setShowClearModal] = useState(false);
  const [clearConfirmText, setClearConfirmText] = useState("");

  // --- ESTADOS DE PRIVACIDADE ---
  const [hideEmails, setHideEmails] = useState(true);
  const [hidePhones, setHidePhones] = useState(true);

  // --- ESTADOS DE VALIDAÇÃO DE CÓDIGO ---
  const [redeemCodeInput, setRedeemCodeInput] = useState("");
  const [validationMessage, setValidationMessage] = useState("");
  const [validationSuccess, setValidationSuccess] = useState(false);
  const [isValidating, setIsValidating] = useState(false);

  // --- ESTADOS DE VISIBILIDADE DE CÓDIGOS ---
  const [visibleCodes, setVisibleCodes] = useState<Set<string>>(new Set());

  // Senha carregada a partir de variáveis de ambiente para segurança
  const correctPassword = process.env.NEXT_PUBLIC_ADMIN_PASSWORD;

  /**
   * @function maskEmail
   * @description Mascara o email para apresentações, mostrando apenas o primeiro caractere e o domínio.
   * @param {string} email - Email a ser mascarado
   * @returns {string} Email mascarado no formato "x***@domain.com"
   */
  const maskEmail = useCallback((email: string) => {
    if (!email) return "N/A";
    const [local, domain] = email.split("@");
    if (!domain) return "***@***";
    return `${local[0]}***@${domain}`;
  }, []);

  /**
   * @function maskPhone
   * @description Mascara o telefone para apresentações, mostrando apenas os últimos 4 dígitos.
   * @param {string} phone - Telefone a ser mascarado
   * @returns {string} Telefone mascarado no formato "(***) ***-1234"
   */
  const maskPhone = useCallback((phone: string) => {
    if (!phone) return "N/A";
    const digits = phone.replace(/\D/g, "");
    if (digits.length < 4) return "***";
    return `(***) ***-${digits.slice(-4)}`;
  }, []);

  /**
   * @function toggleCodeVisibility
   * @description Alterna a visibilidade de um código específico de resgate.
   * @param {string} submissionId - ID da submissão cujo código será mostrado/ocultado
   */
  const toggleCodeVisibility = useCallback((submissionId: string) => {
    setVisibleCodes((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(submissionId)) {
        newSet.delete(submissionId);
      } else {
        newSet.add(submissionId);
      }
      return newSet;
    });
  }, []);

  /**
   * @function handleLogin
   * @description Valida a senha inserida pelo usuário e libera o acesso ao painel.
   */
  const handleLogin = useCallback(() => {
    if (password === correctPassword) {
      setIsAuthenticated(true);
      setError("");
    } else {
      setError("Senha incorreta.");
    }
  }, [password, correctPassword]);

  /**
   * @function handlePrizeUpdate
   * @description Envia a nova contagem de prêmios para o Firebase e atualiza o estado local.
   */
  const handlePrizeUpdate = useCallback(async () => {
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
  }, [newPrizeCount]);

  /**
   * @function handleClearData
   * @description Limpa todos os dados de teste do Firebase após confirmação.
   */
  const handleClearData = useCallback(async () => {
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
  }, [clearConfirmText]);

  /**
   * @function handleValidateCode
   * @description Valida um código de resgate de 4 caracteres informado pelo usuário.
   * Verifica se o código existe, se ainda não foi resgatado e marca como resgatado.
   * Exibe mensagem de sucesso ou erro com timeout de 5 segundos.
   */
  const handleValidateCode = useCallback(async () => {
    if (!redeemCodeInput || redeemCodeInput.length !== 4) {
      setValidationMessage("Por favor, insira um código de 4 caracteres.");
      setValidationSuccess(false);
      return;
    }

    setIsValidating(true);
    setValidationMessage("");

    try {
      const result = await validateRedeemCode(redeemCodeInput);
      setValidationSuccess(result.success);

      if (result.success) {
        setValidationMessage(
          `✅ ${result.message}\nParticipante: ${result.participantName}`
        );
        setRedeemCodeInput("");
      } else {
        setValidationMessage(`❌ ${result.message}`);
      }
    } catch (e) {
      console.error("Erro ao validar código:", e);
      setValidationMessage("❌ Erro ao validar código. Tente novamente.");
      setValidationSuccess(false);
    } finally {
      setIsValidating(false);

      // Limpa a mensagem após 5 segundos
      setTimeout(() => {
        setValidationMessage("");
      }, 5000);
    }
  }, [redeemCodeInput]);

  /**
   * @effect Real-time Dashboard Subscription
   * @description Inscreve-se para atualizações em tempo real do Firebase assim que o usuário é autenticado.
   * Atualiza automaticamente submissions, prêmios restantes e limpa a inscrição ao desmontar.
   */
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

  return {
    // Autenticação
    isAuthenticated,
    password,
    error,
    setPassword,
    handleLogin,

    // Dados
    submissions,
    remainingPrizes,
    isLoading,

    // Prêmios
    newPrizeCount,
    setNewPrizeCount,
    handlePrizeUpdate,

    // Limpeza
    showClearModal,
    setShowClearModal,
    clearConfirmText,
    setClearConfirmText,
    handleClearData,

    // Privacidade
    hideEmails,
    setHideEmails,
    hidePhones,
    setHidePhones,

    // Validação de código
    redeemCodeInput,
    setRedeemCodeInput,
    validationMessage,
    validationSuccess,
    isValidating,
    handleValidateCode,

    // Visibilidade de códigos
    visibleCodes,
    toggleCodeVisibility,

    // Utilitários
    maskEmail,
    maskPhone,
  };
}
