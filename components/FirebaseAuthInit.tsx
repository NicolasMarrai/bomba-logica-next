"use client";

import { useEffect } from "react";
import { getAnonymousUser } from "../lib/firebase/auth";

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
    // Inicializa autenticação anônima ao montar o componente
    getAnonymousUser().catch((error: Error) => {
      console.error("Erro ao inicializar autenticação:", error);
    });
  }, []);

  return null; // Não renderiza nada
}
