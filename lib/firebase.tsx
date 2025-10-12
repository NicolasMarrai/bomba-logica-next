import { initializeApp, getApp, getApps, FirebaseApp } from "firebase/app";
import {
  getDatabase,
  Database,
  ref,
  runTransaction,
  get,
  set,
  child,
  push,
  serverTimestamp,
  onValue,
  off,
} from "firebase/database";
import {
  getAuth,
  signInAnonymously,
  onAuthStateChanged,
  Auth,
  User,
} from "firebase/auth";
import { UAParser } from "ua-parser-js";

// --- INTERFACES ---
interface SubmissionData {
  name: string;
  email: string;
  phone: string;
  userId: string;
  timestamp: string;
  systemInfo: {
    browser: string;
    os: string;
    device: string;
  };
}

interface ParticipantData {
  playedAt: string;
  wonPrize: boolean;
}

// --- CONFIGURAÇÃO DO FIREBASE ---
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

// --- INICIALIZAÇÃO E EXPORTAÇÕES PRINCIPAIS ---
const app: FirebaseApp = !getApps().length
  ? initializeApp(firebaseConfig)
  : getApp();
const database: Database = getDatabase(app);
const auth: Auth = getAuth(app);

export { database, auth };

// --- LÓGICA DE AUTENTICAÇÃO ANÔNIMA ---
/**
 * @function getAnonymousUser
 * @description Garante que o usuário esteja autenticado anonimamente.
 * Se o usuário já estiver logado, retorna o usuário atual.
 * Caso contrário, tenta realizar o login anônimo e aguarda a mudança de estado de autenticação.
 * @returns {Promise<User>} Uma promessa que resolve com o objeto de usuário autenticado.
 */
export const getAnonymousUser = (): Promise<User> => {
  return new Promise((resolve) => {
    if (auth.currentUser) {
      return resolve(auth.currentUser);
    }
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        resolve(user);
        unsubscribe();
      }
    });
    if (!auth.currentUser) {
      signInAnonymously(auth).catch((error) =>
        console.error("Falha no login anônimo:", error)
      );
    }
  });
};

// --- LÓGICA DE INFORMAÇÕES DO SISTEMA ---
/**
 * @function getSystemInfo
 * @description Analisa a string do user agent para extrair informações legíveis sobre o sistema.
 * @returns {object} Um objeto contendo o navegador, SO e tipo de dispositivo.
 */
const getSystemInfo = () => {
  const parser = new UAParser();
  const result = parser.getResult();
  return {
    browser: `${result.browser.name || "Navegador desconhecido"} ${
      result.browser.version || ""
    }`.trim(),
    os: `${result.os.name || "SO desconhecido"} ${
      result.os.version || ""
    }`.trim(),
    device:
      `${result.device.vendor || ""} ${result.device.model || ""}`.trim() ||
      result.device.type ||
      "desktop",
  };
};

// --- LÓGICA DE SUBMISSÃO DO FORMULÁRIO ---
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

// --- LÓGICA DO SORTEIO ---
/**
 * @interface SorteioResult
 * @description Define a estrutura do objeto de resultado do sorteio.
 * @property {boolean} won - Indica se o usuário ganhou o prêmio.
 * @property {string} message - A mensagem a ser exibida para o usuário.
 * @property {boolean} alreadyPlayed - Indica se o usuário já participou do sorteio.
 */
interface SorteioResult {
  won: boolean;
  message: string;
  alreadyPlayed: boolean;
}

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
    return {
      won: false,
      message: "Você já participou do sorteio anteriormente!",
      alreadyPlayed: true,
    };
  }

  let result: SorteioResult = {
    won: false,
    message: "Não foi desta vez, mas obrigado por participar! Continue atento às dicas de segurança.",
    alreadyPlayed: false,
  };
  let wonPrize = false;

  await runTransaction(prizesRef, (currentData) => {
    if (currentData === null) return { remaining: 30 }; // Valor inicial de prêmios
    if (currentData.remaining > 0) {
      // 25% de chance de ganhar
      if (Math.random() <= 0.25) {
        currentData.remaining--;
        wonPrize = true;
        result = {
          won: true,
          message:
            "VOCÊ GANHOU um delicioso Sonho de Valsa! 🍫 Mostre esta tela para resgatar seu prêmio.",
          alreadyPlayed: false,
        };
      }
    } else {
      result.message = "Os prêmios acabaram, mas você ganhou conhecimento sobre segurança digital!";
    }
    return currentData;
  });

  // Registra a participação do usuário para evitar múltiplas tentativas
  await set(participantRef, { playedAt: new Date().toISOString(), wonPrize });
  return result;
};

// --- FUNÇÕES DO PAINEL DE ADMIN ---

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
 * @function subscribeToAdminDashboard
 * @description Inscreve-se para receber atualizações em tempo real dos dados do dashboard de admin.
 * @param {function} callback - Função a ser chamada quando os dados forem atualizados.
 * @returns {function} Função para cancelar a inscrição (unsubscribe).
 */
export const subscribeToAdminDashboard = (
  callback: (data: {
    submissions: Array<
      SubmissionData & { id: string; wonPrize: boolean }
    >;
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
