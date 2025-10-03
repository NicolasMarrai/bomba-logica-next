import type { Metadata } from "next";
import { IBM_Plex_Mono } from "next/font/google";
import "./globals.css";

// Importando uma fonte com cara de terminal
const ibmPlexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "700"],
});

export const metadata: Metadata = {
  title: "Bomba Lógica - ENTEC 2025",
  description: "Um experimento de cibersegurança sobre os perigos dos QR Codes.",
};

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
