import { initializeApp, getApp, getApps, FirebaseApp } from "firebase/app";
import { getDatabase, Database } from "firebase/database";
import { getAuth, Auth } from "firebase/auth";

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
let authInstance: Auth | null = null;
let databaseInstance: Database | null = null;

/**
 * Verifica se as variáveis públicas mínimas do Firebase estão definidas.
 */
export const hasFirebaseClientConfig = (): boolean => {
  return Boolean(
    firebaseConfig.apiKey?.trim() &&
    firebaseConfig.authDomain?.trim() &&
    firebaseConfig.projectId?.trim() &&
    firebaseConfig.appId?.trim(),
  );
};

/**
 * Inicializa o Firebase Auth sob demanda para evitar erro fatal
 * durante avaliação do módulo quando a API key está inválida ou ausente.
 */
export const getFirebaseAuth = (): Auth => {
  if (authInstance) return authInstance;

  if (!hasFirebaseClientConfig()) {
    throw new Error(
      "Firebase Auth não configurado. Defina NEXT_PUBLIC_FIREBASE_API_KEY, NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN, NEXT_PUBLIC_FIREBASE_PROJECT_ID e NEXT_PUBLIC_FIREBASE_APP_ID no .env.local.",
    );
  }

  authInstance = getAuth(app);
  return authInstance;
};

/**
 * Retorna a URL do Realtime Database a partir das variáveis de ambiente.
 * Se a URL explícita não existir, usa fallback com projectId.
 */
const resolveDatabaseURL = (): string | null => {
  const explicitURL = process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL?.trim();
  if (explicitURL) return explicitURL;

  const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID?.trim();
  if (!projectId) return null;

  return `https://${projectId}-default-rtdb.firebaseio.com`;
};

/**
 * Inicializa o Realtime Database sob demanda para evitar erro fatal
 * durante avaliação do módulo quando variáveis de ambiente estão ausentes.
 */
export const getFirebaseDatabase = (): Database => {
  if (databaseInstance) return databaseInstance;

  const databaseURL = resolveDatabaseURL();
  if (!databaseURL) {
    throw new Error(
      "Firebase Realtime Database não configurado. Defina NEXT_PUBLIC_FIREBASE_DATABASE_URL ou NEXT_PUBLIC_FIREBASE_PROJECT_ID no .env.local.",
    );
  }

  databaseInstance = getDatabase(app, databaseURL);
  return databaseInstance;
};
