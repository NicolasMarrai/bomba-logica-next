import { ref, get, set, runTransaction } from "firebase/database";
import { database } from "./config";
import { getAnonymousUser } from "./auth";
import type { ParticipantData, SorteioResult } from "../../types";
import { generateRedeemCode } from "../utils";

/**
 * @function handleSorteio
 * @description Processa a participação de um usuário no sorteio de prêmios.
 *
 * Fluxo de funcionamento:
 * 1. Verifica se o usuário já participou anteriormente
 * 2. Se sim, retorna o status anterior (ganhou, já resgatou, etc)
 * 3. Se não, realiza o sorteio com 25% de chance de ganhar
 * 4. Decrementa o estoque de prêmios se ganhar
 * 5. Gera código de resgate único de 4 caracteres
 * 6. Registra a participação no Firebase
 *
 * @returns {Promise<SorteioResult>} Resultado do sorteio contendo:
 *          - won: se ganhou ou não
 *          - message: mensagem para exibir ao usuário
 *          - alreadyPlayed: se já havia participado
 *          - redeemCode: código para resgatar (apenas se ganhou)
 *          - redeemed: se já resgatou o prêmio (apenas se aplicável)
 *
 * @throws {Error} Se a autenticação anônima falhar
 *
 * @example
 * const result = await handleSorteio();
 * if (result.won) {
 *   console.log(`Código de resgate: ${result.redeemCode}`);
 * }
 */
export const handleSorteio = async (): Promise<SorteioResult> => {
  const user = await getAnonymousUser();
  if (!user) throw new Error("Autenticação anônima falhou.");

  const participantRef = ref(database, `participants/${user.uid}`);
  const prizesRef = ref(database, "prizes");

  // Verifica se o usuário já participou do sorteio
  const snapshot = await get(participantRef);
  if (snapshot.exists()) {
    const participantData = snapshot.val() as ParticipantData;

    // Caso 1: Usuário já ganhou anteriormente
    if (participantData.wonPrize && participantData.redeemCode) {
      // Caso 1a: Prêmio já foi resgatado
      if (participantData.redeemed) {
        return {
          won: true,
          message: "Você já resgatou seu prêmio anteriormente!",
          alreadyPlayed: true,
          redeemed: true,
          redeemCode: participantData.redeemCode,
        };
      }
      // Caso 1b: Ganhou mas ainda não resgatou - retorna código novamente
      return {
        won: true,
        message: "Você já participou e GANHOU! Aqui está seu código novamente.",
        alreadyPlayed: true,
        redeemed: false,
        redeemCode: participantData.redeemCode,
      };
    }

    // Caso 2: Usuário já participou mas não ganhou
    return {
      won: false,
      message: "Você já participou do sorteio anteriormente!",
      alreadyPlayed: true,
    };
  }

  // Caso 3: Primeira participação - executar sorteio
  let result: SorteioResult = {
    won: false,
    message:
      "Não foi desta vez, mas obrigado por participar! Continue atento às dicas de segurança.",
    alreadyPlayed: false,
  };
  let wonPrize = false;
  let redeemCode = "";

  // Usa transação para garantir consistência ao decrementar prêmios
  await runTransaction(prizesRef, (currentData) => {
    if (currentData === null) return { remaining: 30 }; // Valor inicial de prêmios
    if (currentData.remaining > 0) {
      // Sorteia com 25% de probabilidade de ganhar
      if (Math.random() <= 0.25) {
        currentData.remaining--;
        wonPrize = true;
        redeemCode = generateRedeemCode();
        result = {
          won: true,
          message:
            "VOCÊ GANHOU um delicioso Ouro Branco! 🍫 Use o código abaixo para resgatar seu prêmio.",
          alreadyPlayed: false,
          redeemCode,
        };
      }
    } else {
      result.message =
        "Os prêmios acabaram, mas você ganhou conhecimento sobre segurança digital!";
    }
    return currentData;
  });

  // Registra a participação do usuário para evitar múltiplas tentativas
  const participantData: ParticipantData = {
    playedAt: new Date().toISOString(),
    wonPrize,
  };
  if (wonPrize) {
    participantData.redeemCode = redeemCode;
    participantData.redeemed = false;
  }
  await set(participantRef, participantData);
  return result;
};
