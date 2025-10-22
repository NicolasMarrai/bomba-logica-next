import { ref, get, set, runTransaction } from "firebase/database";
import { database } from "./config";
import { getAnonymousUser } from "./auth";
import type { ParticipantData, SorteioResult } from "../../types";
import { generateRedeemCode } from "../utils";

/**
 * @function handleSorteio
 * @description Processa a participação de um usuário no sorteio, verificando se ele já jogou e determinando se ganhou um prêmio.
 * @returns {Promise<SorteioResult>} O resultado do sorteio.
 */
export const handleSorteio = async (): Promise<SorteioResult> => {
  const user = await getAnonymousUser();
  if (!user) throw new Error("Autenticação anônima falhou.");

  const participantRef = ref(database, `participants/${user.uid}`);
  const prizesRef = ref(database, "prizes");

  const snapshot = await get(participantRef);
  if (snapshot.exists()) {
    const participantData = snapshot.val() as ParticipantData;
    
    // Se já participou e ganhou
    if (participantData.wonPrize && participantData.redeemCode) {
      // Se já resgatou o prêmio
      if (participantData.redeemed) {
        return {
          won: true,
          message: "Você já resgatou seu prêmio anteriormente!",
          alreadyPlayed: true,
          redeemed: true,
          redeemCode: participantData.redeemCode,
        };
      }
      // Se ganhou mas ainda não resgatou
      return {
        won: true,
        message: "Você já participou e GANHOU! Aqui está seu código novamente.",
        alreadyPlayed: true,
        redeemed: false,
        redeemCode: participantData.redeemCode,
      };
    }
    
    // Se já participou mas não ganhou
    return {
      won: false,
      message: "Você já participou do sorteio anteriormente!",
      alreadyPlayed: true,
    };
  }

  let result: SorteioResult = {
    won: false,
    message:
      "Não foi desta vez, mas obrigado por participar! Continue atento às dicas de segurança.",
    alreadyPlayed: false,
  };
  let wonPrize = false;
  let redeemCode = "";

  await runTransaction(prizesRef, (currentData) => {
    if (currentData === null) return { remaining: 30 }; // Valor inicial de prêmios
    if (currentData.remaining > 0) {
      // 25% de chance de ganhar
      if (Math.random() <= 0.25) {
        currentData.remaining--;
        wonPrize = true;
        redeemCode = generateRedeemCode();
        result = {
          won: true,
          message:
            "VOCÊ GANHOU um delicioso Sonho de Valsa! 🍫 Use o código abaixo para resgatar seu prêmio.",
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
