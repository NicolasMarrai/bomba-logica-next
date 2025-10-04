import type { Metadata } from "next";
import { IBM_Plex_Mono } from "next/font/google";
import "./globals.css";

/**
 * @description Configuração da fonte IBM Plex Mono para ser usada em toda a aplicação, 
 * garantindo uma estética de terminal.
 */
const ibmPlexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "700"],
});

/**
 * @description Metadados da página, importantes para SEO e para o navegador.
 */
export const metadata: Metadata = {
  title: "Bomba Lógica - ENTEC 2025",
  description: "Um experimento de cibersegurança sobre os perigos dos QR Codes.",
};

/**
 * @component RootLayout
 * @description Componente de layout raiz que envolve todas as páginas da aplicação.
 * @param {Readonly<{ children: React.ReactNode }>} { children } - O conteúdo da página aninhada.
 * @returns {JSX.Element}
 */
export default function RootLayout({
  children,
}: Readonly<{ 
  children: React.ReactNode; 
}>) {
  return (
    <html lang="pt-br">
      <body className={`${ibmPlexMono.className} bg-black`}>{children}</body>
    </html>
  );
}
