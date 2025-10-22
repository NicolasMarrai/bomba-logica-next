import { ref, get, set, onValue, off } from "firebase/database";
import { database } from "./config";
import type { SubmissionData, ParticipantData } from "../../types";

/**
 * @typedef {object} AdminDashboardData
 * @property {Array<object>} submissions - Lista de submissões, cada uma contendo dados do formulário e se o usuário ganhou um prêmio.
 * @property {number} remainingPrizes - A contagem de prêmios restantes.
 */

/**
 * @function getAdminDashboardData
 * @description Busca e combina dados de submissões, participantes e prêmios para o painel de administração.
 * As submissões são enriquecidas com a informação se o participante ganhou um prêmio.
 * @returns {Promise<AdminDashboardData>} Os dados consolidados para o dashboard, ordenados por data de submissão.
 */
export const getAdminDashboardData = async () => {
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
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
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
  const submissionsRef = ref(database, "submissions");
  const participantsRef = ref(database, "participants");

  // Remove todas as submissões
  await set(submissionsRef, null);

  // Remove todos os participantes
  await set(participantsRef, null);
};

/**
 * @function validateRedeemCode
 * @description Valida um código de resgate e marca o prêmio como resgatado.
 * @param {string} code - O código de 4 caracteres a ser validado.
 * @returns {Promise<{success: boolean, message: string, participantName?: string}>}
 */
export const validateRedeemCode = async (
  code: string
): Promise<{
  success: boolean;
  message: string;
  participantName?: string;
}> => {
  const participantsRef = ref(database, "participants");
  const participantsSnap = await get(participantsRef);
  const participants = participantsSnap.val() || {};

  // Busca o participante com o código fornecido
  const participantEntry = Object.entries(participants).find(
    ([, data]) => (data as ParticipantData).redeemCode === code.toUpperCase()
  );

  if (!participantEntry) {
    return { success: false, message: "Código inválido!" };
  }

  const [userId, participantData] = participantEntry as [
    string,
    ParticipantData
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
    (sub) => (sub as SubmissionData).userId === userId
  ) as SubmissionData | undefined;

  // Marca como resgatado
  await set(ref(database, `participants/${userId}/redeemed`), true);
  await set(
    ref(database, `participants/${userId}/redeemedAt`),
    new Date().toISOString()
  );

  return {
    success: true,
    message: "Prêmio validado com sucesso! 🎉",
    participantName: submission?.name || "Participante",
  };
};

/**
 * @function subscribeToAdminDashboard
 * @description Inscreve-se para receber atualizações em tempo real dos dados do dashboard de admin.
 * @param {function} callback - Função a ser chamada quando os dados forem atualizados.
 * @returns {function} Função para cancelar a inscrição (unsubscribe).
 */
export const subscribeToAdminDashboard = (
  callback: (data: {
    submissions: Array<SubmissionData & { id: string; wonPrize: boolean }>;
    remainingPrizes: number;
  }) => void
) => {
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
          new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
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
