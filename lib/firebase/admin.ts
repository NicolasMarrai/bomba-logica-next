import { ref, get, set, onValue, off } from "firebase/database";
import { getFirebaseDatabase } from "./config";
import type {
  SubmissionData,
  ParticipantData,
  AdminDashboardData,
} from "../../types";

/**
 * @function getAdminDashboardData
 * @description Busca e combina dados de submissões, participantes e prêmios para o painel de administração.
 * As submissões são enriquecidas com a informação se o participante ganhou um prêmio.
 * @returns {Promise<AdminDashboardData>} Os dados consolidados para o dashboard, ordenados por data de submissão.
 */
export const getAdminDashboardData = async (): Promise<AdminDashboardData> => {
  const database = getFirebaseDatabase();
  const submissionsRef = ref(database, "submissions");
  const participantsRef = ref(database, "participants");
  const prizesRef = ref(database, "prizes/remaining");

  const submissionsSnap = await get(submissionsRef);
  const participantsSnap = await get(participantsRef);
  const prizesSnap = await get(prizesRef);

  const submissions = submissionsSnap.val() || {};
  const participants = participantsSnap.val() || {};
  const remainingPrizes = prizesSnap.val() || 0;

  // Combina os dados de submissão com a informação de prêmio do participante
  const combinedData = Object.keys(submissions)
    .map((key) => {
      const submission = submissions[key];
      const participantInfo = participants[submission.userId] || {
        wonPrize: false,
      };
      return {
        id: key,
        ...submission,
        wonPrize: participantInfo.wonPrize,
        redeemCode: participantInfo.redeemCode,
        redeemed: participantInfo.redeemed,
        redeemedAt: participantInfo.redeemedAt,
      };
    })
    .sort(
      (a, b) =>
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
    ); // Ordena do mais novo para o mais antigo

  return { submissions: combinedData, remainingPrizes };
};

/**
 * @function updatePrizeCount
 * @description Atualiza a contagem de prêmios restantes no banco de dados.
 * @param {number} newCount - O novo número de prêmios.
 * @returns {Promise<void>}
 */
export const updatePrizeCount = (newCount: number) => {
  const database = getFirebaseDatabase();
  const prizesRef = ref(database, "prizes/remaining");
  return set(prizesRef, newCount);
};

/**
 * @function clearAllData
 * @description Remove todos os dados de submissões e participantes do banco de dados.
 * ATENÇÃO: Esta é uma operação destrutiva e irreversível!
 * @returns {Promise<void>}
 */
export const clearAllData = async () => {
  const database = getFirebaseDatabase();
  const submissionsRef = ref(database, "submissions");
  const participantsRef = ref(database, "participants");

  // Remove todas as submissões
  await set(submissionsRef, null);

  // Remove todos os participantes
  await set(participantsRef, null);
};

/**
 * @function validateRedeemCode
 * @description Valida um código de resgate de 4 caracteres e marca o prêmio como resgatado se válido.
 * Verifica se o código existe, se já foi resgatado e busca o nome do participante.
 *
 * @param {string} code - Código de 4 caracteres a ser validado (será convertido para uppercase).
 * @returns {Promise<{success: boolean, message: string, participantName?: string}>}
 *          Objeto com resultado da validação, mensagem e nome do participante (se encontrado).
 *
 * @example
 * const result = await validateRedeemCode("A3B7");
 * if (result.success) {
 *   console.log(`Prêmio validado para ${result.participantName}`);
 * }
 */
export const validateRedeemCode = async (
  code: string,
): Promise<{
  success: boolean;
  message: string;
  participantName?: string;
}> => {
  const database = getFirebaseDatabase();
  const participantsRef = ref(database, "participants");
  const participantsSnap = await get(participantsRef);
  const participants = participantsSnap.val() || {};

  // Busca o participante com o código fornecido
  const participantEntry = Object.entries(participants).find(
    ([, data]) => (data as ParticipantData).redeemCode === code.toUpperCase(),
  );

  if (!participantEntry) {
    return { success: false, message: "Código inválido!" };
  }

  const [userId, participantData] = participantEntry as [
    string,
    ParticipantData,
  ];

  if (participantData.redeemed) {
    return {
      success: false,
      message: "Este código já foi resgatado!",
    };
  }

  // Busca o nome do participante nas submissões
  const submissionsRef = ref(database, "submissions");
  const submissionsSnap = await get(submissionsRef);
  const submissions = submissionsSnap.val() || {};

  const submission = Object.values(submissions).find(
    (sub) => (sub as SubmissionData).userId === userId,
  ) as SubmissionData | undefined;

  // Marca como resgatado
  await set(ref(database, `participants/${userId}/redeemed`), true);
  await set(
    ref(database, `participants/${userId}/redeemedAt`),
    new Date().toISOString(),
  );

  return {
    success: true,
    message: "Prêmio validado com sucesso! 🎉",
    participantName: submission?.name || "Participante",
  };
};

/**
 * @function subscribeToAdminDashboard
 * @description Inscreve-se para receber atualizações em tempo real dos dados do dashboard administrativo.
 * Monitora mudanças em submissões, participantes e prêmios no Firebase Realtime Database.
 *
 * @param {function} callback - Função callback que será executada sempre que houver atualizações nos dados.
 *                              Recebe um objeto com submissions e remainingPrizes.
 * @returns {function} Função unsubscribe para cancelar todas as inscrições e limpar listeners.
 *
 * @example
 * const unsubscribe = subscribeToAdminDashboard((data) => {
 *   console.log('Dados atualizados:', data);
 * });
 * // Para cancelar a inscrição:
 * unsubscribe();
 */
export const subscribeToAdminDashboard = (
  callback: (data: {
    submissions: Array<SubmissionData & { id: string; wonPrize: boolean }>;
    remainingPrizes: number;
  }) => void,
) => {
  const database = getFirebaseDatabase();
  const submissionsRef = ref(database, "submissions");
  const participantsRef = ref(database, "participants");
  const prizesRef = ref(database, "prizes/remaining");

  let submissionsData: Record<string, SubmissionData> = {};
  let participantsData: Record<string, ParticipantData> = {};
  let prizesData: number = 0;

  const updateCallback = () => {
    const submissions = submissionsData || {};
    const participants = participantsData || {};

    const combinedData = Object.keys(submissions)
      .map((key) => {
        const submission = submissions[key];
        const participantInfo = participants[submission.userId] || {
          wonPrize: false,
        };
        return {
          id: key,
          ...submission,
          wonPrize: participantInfo.wonPrize,
          redeemCode: participantInfo.redeemCode,
          redeemed: participantInfo.redeemed,
          redeemedAt: participantInfo.redeemedAt,
        };
      })
      .sort(
        (a, b) =>
          new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
      );

    callback({
      submissions: combinedData,
      remainingPrizes: prizesData,
    });
  };

  // Escuta mudanças nas submissões
  onValue(submissionsRef, (snapshot) => {
    submissionsData = snapshot.val() || {};
    updateCallback();
  });

  // Escuta mudanças nos participantes
  onValue(participantsRef, (snapshot) => {
    participantsData = snapshot.val() || {};
    updateCallback();
  });

  // Escuta mudanças nos prêmios
  onValue(prizesRef, (snapshot) => {
    prizesData = snapshot.val() || 0;
    updateCallback();
  });

  // Retorna função para cancelar todas as inscrições
  return () => {
    off(submissionsRef);
    off(participantsRef);
    off(prizesRef);
  };
};
