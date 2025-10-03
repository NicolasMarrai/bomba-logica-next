import { initializeApp, getApp, getApps, FirebaseApp } from "firebase/app";
import { getDatabase, Database, ref, runTransaction, get, set, child, push } from "firebase/database";
import { getAuth, signInAnonymously, onAuthStateChanged, Auth, User } from "firebase/auth";

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
const app: FirebaseApp = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const database: Database = getDatabase(app);
const auth: Auth = getAuth(app);

export { database, auth };

// --- LÓGICA DE AUTENTICAÇÃO ANÔNIMA ---
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
        signInAnonymously(auth).catch(error => console.error("Falha no login anônimo:", error));
    }
  });
};

// --- LÓGICA DE SUBMISSÃO DO FORMULÁRIO ---
export const saveSubmission = async (agentId: string, activationCode: string, payloadMessage: string) => {
    const user = await getAnonymousUser();
    const submissionData = {
        agentId,
        activationCode,
        payloadMessage,
        userId: user.uid,
        timestamp: new Date().toISOString(),
    };
    const newSubmissionKey = push(child(ref(database), 'submissions')).key;
    return set(ref(database, 'submissions/' + newSubmissionKey), submissionData);
};


// --- LÓGICA DO SORTEIO ---
interface SorteioResult {
  won: boolean;
  message: string;
  alreadyPlayed: boolean;
}

export const handleSorteio = async (): Promise<SorteioResult> => {
  const user = await getAnonymousUser();
  if (!user) throw new Error("Autenticação anônima falhou.");

  const participantRef = ref(database, `participants/${user.uid}`);
  const prizesRef = ref(database, 'prizes');
  
  const snapshot = await get(participantRef);
  if (snapshot.exists()) {
    return { won: false, message: "Você já tentou a sua sorte, agente.", alreadyPlayed: true };
  }

  let result: SorteioResult = { won: false, message: "Não foi desta vez. Mas seus dados foram... analisados.", alreadyPlayed: false };
  let wonPrize = false;

  await runTransaction(prizesRef, (currentData) => {
    if (currentData === null) return { remaining: 30 };
    if (currentData.remaining > 0) {
      if (Math.random() <= 0.25) { 
        currentData.remaining--;
        wonPrize = true;
        result = { won: true, message: "PARABÉNS! Seu payload continha um prêmio. Resgate seu Sonho de Valsa com a equipe.", alreadyPlayed: false };
      }
    } else {
      result.message = "Os prêmios acabaram, mas a conscientização fica!";
    }
    return currentData;
  });

  await set(participantRef, { playedAt: new Date().toISOString(), wonPrize });
  return result;
};


// --- FUNÇÕES DO PAINEL DE ADMIN ---

export const getAdminDashboardData = async () => {
    const submissionsRef = ref(database, 'submissions');
    const participantsRef = ref(database, 'participants');
    const prizesRef = ref(database, 'prizes/remaining');

    const submissionsSnap = await get(submissionsRef);
    const participantsSnap = await get(participantsRef);
    const prizesSnap = await get(prizesRef);

    const submissions = submissionsSnap.val() || {};
    const participants = participantsSnap.val() || {};
    const remainingPrizes = prizesSnap.val() || 0;
    
    const combinedData = Object.keys(submissions).map(key => {
        const submission = submissions[key];
        const participantInfo = participants[submission.userId] || { wonPrize: false };
        return {
            id: key,
            ...submission,
            wonPrize: participantInfo.wonPrize,
        };
    }).sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()); // Ordena do mais novo para o mais antigo

    return { submissions: combinedData, remainingPrizes };
};

export const updatePrizeCount = (newCount: number) => {
    const prizesRef = ref(database, 'prizes/remaining');
    return set(prizesRef, newCount);
};

