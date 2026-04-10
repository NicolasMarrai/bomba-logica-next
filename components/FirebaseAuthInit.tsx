"use client";

import { useEffect } from "react";
import { getAnonymousUser } from "../lib/firebase/auth";
import { hasFirebaseClientConfig } from "../lib/firebase/config";

/**
 * @component FirebaseAuthInit
 * @description Componente que inicializa a autenticação anônima do Firebase
 * assim que o usuário entra no site, garantindo que o usuário esteja
 * autenticado antes de realizar qualquer operação.
 *
 * @returns {null} Não renderiza nada na UI
 */
export default function FirebaseAuthInit() {
  useEffect(() => {
    // Evita erro em ambiente sem .env.local configurado.
    if (!hasFirebaseClientConfig()) {
      return;
    }

    // Inicializa autenticação anônima ao montar o componente
    getAnonymousUser().catch((error: Error) => {
      console.error("Erro ao inicializar autenticação:", error);
    });
  }, []);

  return null; // Não renderiza nada
}
