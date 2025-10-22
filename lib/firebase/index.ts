// --- EXPORTAÇÕES CENTRALIZADAS ---
// Este arquivo serve como ponto único de exportação para todas as funcionalidades do Firebase

// Configuração
export { database, auth } from "./config";

// Autenticação
export { getAnonymousUser } from "./auth";

// Submissões
export { saveSubmission } from "./submissions";

// Sorteio
export { handleSorteio } from "./sorteio";

// Admin
export {
  getAdminDashboardData,
  updatePrizeCount,
  clearAllData,
  validateRedeemCode,
  subscribeToAdminDashboard,
} from "./admin";
