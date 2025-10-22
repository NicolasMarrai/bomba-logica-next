import { ref, child, push, set, serverTimestamp } from "firebase/database";
import { database } from "./config";
import { getAnonymousUser } from "./auth";
import { getSystemInfo } from "../utils";

/**
 * @function saveSubmission
 * @description Salva os dados de uma submissão de formulário no banco de dados.
 * @param {string} name - O nome do participante.
 * @param {string} email - O email do participante.
 * @param {string} phone - O telefone do participante (opcional).
 * @returns {Promise<void>}
 */
export const saveSubmission = async (
  name: string,
  email: string,
  phone: string
) => {
  const user = await getAnonymousUser();
  const submissionData = {
    name,
    email,
    phone,
    userId: user.uid,
    timestamp: serverTimestamp(),
    systemInfo: getSystemInfo(),
  };
  const newSubmissionKey = push(child(ref(database), "submissions")).key;
  return set(ref(database, "submissions/" + newSubmissionKey), submissionData);
};
