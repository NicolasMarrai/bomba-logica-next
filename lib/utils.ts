import { UAParser } from "ua-parser-js";

/**
 * @function getSystemInfo
 * @description Analisa a string do user agent para extrair informações legíveis sobre o sistema.
 * @returns {object} Um objeto contendo o navegador, SO e tipo de dispositivo.
 */
export const getSystemInfo = () => {
  const parser = new UAParser();
  const result = parser.getResult();
  return {
    browser: `${result.browser.name || "Navegador desconhecido"} ${
      result.browser.version || ""
    }`.trim(),
    os: `${result.os.name || "SO desconhecido"} ${
      result.os.version || ""
    }`.trim(),
    device:
      `${result.device.vendor || ""} ${result.device.model || ""}`.trim() ||
      result.device.type ||
      "desktop",
  };
};

/**
 * @function generateRedeemCode
 * @description Gera um código único de 4 caracteres alfanuméricos.
 * @returns {string} Código de resgate único.
 */
export const generateRedeemCode = (): string => {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // Exclui letras/números confusos (I, O, 0, 1)
  let code = "";
  for (let i = 0; i < 4; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
};