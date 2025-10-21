// --- INTERFACES ---

/**
 * @interface SubmissionData
 * @description Define a estrutura dos dados de submissão do formulário salvos no Firebase.
 * Contém informações do participante e dados do sistema para auditoria.
 * @property {string} name - Nome completo do participante.
 * @property {string} email - Endereço de email do participante.
 * @property {string} phone - Número de telefone do participante.
 * @property {string} userId - ID único do usuário autenticado anonimamente no Firebase.
 * @property {string} timestamp - Data e hora da submissão (gerado pelo servidor Firebase).
 * @property {object} systemInfo - Informações do sistema do participante.
 * @property {string} systemInfo.browser - Nome e versão do navegador utilizado.
 * @property {string} systemInfo.os - Sistema operacional e versão.
 * @property {string} systemInfo.device - Tipo e modelo do dispositivo.
 */
export interface SubmissionData {
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

/**
 * @interface ParticipantData
 * @description Define a estrutura dos dados do participante no sorteio salvos no Firebase.
 * Registra a participação, prêmios ganhos e status de resgate.
 * @property {string} playedAt - Data e hora em que o participante jogou (formato ISO string).
 * @property {boolean} wonPrize - Indica se o participante ganhou um prêmio no sorteio.
 * @property {string} [redeemCode] - Código de resgate de 4 caracteres para ganhadores (opcional).
 * @property {boolean} [redeemed] - Indica se o prêmio já foi resgatado (opcional).
 * @property {string} [redeemedAt] - Data e hora do resgate do prêmio em formato ISO string (opcional).
 */
export interface ParticipantData {
  playedAt: string;
  wonPrize: boolean;
  redeemCode?: string;
  redeemed?: boolean;
  redeemedAt?: string;
}

/**
 * @interface Submission
 * @description Define a estrutura de um registro de submissão para a listagem no painel.
 * Combina dados de submissão com informações de participação no sorteio.
 * @property {string} id - ID único do registro de submissão no Firebase.
 * @property {string} name - Nome completo do participante.
 * @property {string} email - Endereço de email do participante.
 * @property {string} phone - Número de telefone do participante.
 * @property {string} timestamp - Data e hora da submissão.
 * @property {boolean} wonPrize - Indica se o participante ganhou um prêmio no sorteio.
 * @property {string} userId - ID único do usuário autenticado anonimamente no Firebase.
 * @property {string} [redeemCode] - Código de resgate de 4 caracteres para ganhadores (opcional).
 * @property {boolean} [redeemed] - Indica se o prêmio já foi resgatado (opcional).
 * @property {string} [redeemedAt] - Data e hora do resgate do prêmio em formato ISO string (opcional).
 * @property {object} systemInfo - Informações do sistema do participante.
 * @property {string} systemInfo.browser - Nome e versão do navegador utilizado.
 * @property {string} systemInfo.os - Sistema operacional e versão.
 * @property {string} systemInfo.device - Tipo e modelo do dispositivo.
 */
export interface Submission {
  id: string;
  name: string;
  email: string;
  phone: string;
  timestamp: string;
  wonPrize: boolean;
  userId: string;
  redeemCode?: string;
  redeemed?: boolean;
  redeemedAt?: string;
  systemInfo: {
    browser: string;
    os: string;
    device: string;
  };
}

/**
 * @interface FormData
 * @description Define a estrutura dos dados do formulário de sorteio.
 * Utilizada para validação e tipagem dos dados de entrada do usuário.
 * @property {string} name - Nome completo do participante.
 * @property {string} email - Endereço de email do participante.
 * @property {string} phone - Número de telefone do participante.
 */
export interface FormData {
  name: string;
  email: string;
  phone: string;
}
