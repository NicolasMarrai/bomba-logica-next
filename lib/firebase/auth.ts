import { signInAnonymously, onAuthStateChanged, User } from "firebase/auth";
import { getFirebaseAuth } from "./config";

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
