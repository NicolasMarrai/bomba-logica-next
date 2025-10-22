import { signInAnonymously, onAuthStateChanged, User } from "firebase/auth";
import { auth } from "./config";

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
