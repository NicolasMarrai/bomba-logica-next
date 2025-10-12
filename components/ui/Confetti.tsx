"use client";

import { useEffect, useState } from "react";

interface ConfettiPiece {
  id: number;
  left: number;
  backgroundColor: string;
  animationDuration: number;
  animationDelay: number;
}

/**
 * @component Confetti
 * @description Componente de confetes que cai da parte superior da tela.
 * Cria uma celebração visual quando o usuário "ganha" o sorteio.
 */
export default function Confetti() {
  const [confettiPieces, setConfettiPieces] = useState<ConfettiPiece[]>([]);

  useEffect(() => {
    // Gera 50 pedaços de confete com posições e cores aleatórias
    const pieces: ConfettiPiece[] = [];
    const colors = [
      "#FF6B6B", // vermelho
      "#4ECDC4", // azul turquesa
      "#FFE66D", // amarelo
      "#A8E6CF", // verde menta
      "#FF8B94", // rosa
      "#C7CEEA", // lavanda
      "#FFDAC1", // pêssego
      "#B4F8C8", // verde claro
    ];

    for (let i = 0; i < 50; i++) {
      pieces.push({
        id: i,
        left: Math.random() * 100, // posição horizontal aleatória (0-100%)
        backgroundColor: colors[Math.floor(Math.random() * colors.length)],
        animationDuration: 2 + Math.random() * 3, // 2-5 segundos
        animationDelay: Math.random() * 0.5, // atraso de 0-0.5s
      });
    }

    setConfettiPieces(pieces);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {confettiPieces.map((piece) => (
        <div
          key={piece.id}
          className="absolute w-3 h-3 opacity-0 animate-confetti-fall"
          style={{
            left: `${piece.left}%`,
            backgroundColor: piece.backgroundColor,
            animationDuration: `${piece.animationDuration}s`,
            animationDelay: `${piece.animationDelay}s`,
            top: "-20px",
          }}
        />
      ))}
    </div>
  );
}
