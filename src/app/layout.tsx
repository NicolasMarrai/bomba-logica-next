import type { Metadata } from "next";
import { Inter, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";
import FirebaseAuthInit from "../../components/FirebaseAuthInit";

/**
 * @description Inter no texto e IBM Plex Mono em rótulos e códigos.
 */
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const ibmPlexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-plex-mono",
});

/**
 * @description Metadados da página, importantes para SEO e para o navegador.
 */
export const metadata: Metadata = {
  title: "Sorteio Relâmpago - ENTEC 2025",
  description:
    "Projeto educacional sobre segurança digital e conscientização contra golpes de sorteios falsos.",
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon.ico", sizes: "any" },
    ],
    apple: "/apple-touch-icon.svg",
  },
  openGraph: {
    title: "Sorteio Relâmpago - ENTEC 2025",
    description: "Aprenda sobre segurança digital de forma interativa",
    type: "website",
  },
};

/**
 * @component RootLayout
 * @description Componente de layout raiz que envolve todas as páginas da aplicação.
 * Inicializa a autenticação anônima do Firebase assim que o usuário acessa o site.
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
      <body className={`${inter.variable} ${ibmPlexMono.variable} font-sans antialiased`}>
        <FirebaseAuthInit />
        {children}
      </body>
    </html>
  );
}
