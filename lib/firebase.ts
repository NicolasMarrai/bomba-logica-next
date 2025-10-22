/**
 * @file firebase.ts
 * @description Arquivo de retrocompatibilidade que re-exporta as funcionalidades do Firebase.
 * Este arquivo mantém a compatibilidade com importações existentes.
 * As funcionalidades foram movidas para módulos separados em /lib/firebase/
 *
 * @deprecated Use importações diretas de /lib/firebase/ para novas implementações
 */

export * from "./firebase/index";
