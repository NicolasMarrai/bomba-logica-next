import {
  signInAnonymously,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User,
} from "firebase/auth";
import { ref, get } from "firebase/database";
import { getFirebaseAuth, getFirebaseDatabase } from "./config";

/**
 * @function getAnonymousUser
 * @description Garante que o usuário esteja autenticado anonimamente.
 * Se o usuário já estiver logado, retorna o usuário atual.
 * Caso contrário, tenta realizar o login anônimo e aguarda a mudança de estado de autenticação.
 * @returns {Promise<User>} Uma promessa que resolve com o objeto de usuário autenticado.
 */
export const getAnonymousUser = (): Promise<User> => {
  return new Promise((resolve, reject) => {
    let auth;

    try {
      auth = getFirebaseAuth();
    } catch (error) {
      reject(
        error instanceof Error
          ? error
          : new Error("Falha ao inicializar Firebase Auth."),
      );
      return;
    }

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
      signInAnonymously(auth).catch((error) => {
        unsubscribe();
        reject(
          error instanceof Error ? error : new Error("Falha no login anônimo."),
        );
      });
    }
  });
};

/**
 * @function signInAdmin
 * @description Faz login de um administrador com e-mail e senha (Firebase Authentication).
 * A senha nunca fica no código do site: ela é verificada pelos servidores do Firebase.
 * @param {string} email - E-mail da conta de administrador.
 * @param {string} password - Senha da conta.
 * @returns {Promise<User>} O usuário autenticado.
 */
export const signInAdmin = async (
  email: string,
  password: string,
): Promise<User> => {
  const credential = await signInWithEmailAndPassword(
    getFirebaseAuth(),
    email.trim(),
    password,
  );
  return credential.user;
};

/**
 * @function isAdmin
 * @description Verifica se o usuário está cadastrado em /admins/<uid> no Realtime Database.
 * O cadastro é feito à mão no console do Firebase, e as regras do banco usam o mesmo nó
 * para liberar a leitura das submissões.
 * @param {User} user - Usuário autenticado.
 * @returns {Promise<boolean>} true se for administrador.
 */
export const isAdmin = async (user: User): Promise<boolean> => {
  if (user.isAnonymous) return false;
  const snapshot = await get(ref(getFirebaseDatabase(), `admins/${user.uid}`));
  return snapshot.val() === true;
};

/**
 * @function signOutAdmin
 * @description Encerra a sessão atual.
 */
export const signOutAdmin = (): Promise<void> => signOut(getFirebaseAuth());

/**
 * @function onAuthChange
 * @description Observa mudanças de sessão (login, logout, sessão restaurada ao recarregar).
 * @returns {() => void} Função para cancelar a observação.
 */
export const onAuthChange = (callback: (user: User | null) => void) =>
  onAuthStateChanged(getFirebaseAuth(), callback);
