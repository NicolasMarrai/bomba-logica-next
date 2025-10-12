"use client";

/**
 * @component LoadingSkeleton
 * @description Componente de loading skeleton para melhor percepção de carregamento.
 * Exibe placeholders animados enquanto o conteúdo real carrega.
 */
export default function LoadingSkeleton() {
  return (
    <div className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden animate-pulse">
      {/* Header Skeleton */}
      <div className="bg-gradient-to-r from-gray-300 to-gray-400 p-6 text-center">
        <div className="h-10 bg-gray-400 rounded w-3/4 mx-auto mb-4"></div>
        <div className="h-6 bg-gray-400 rounded w-1/2 mx-auto mb-4"></div>
        <div className="h-16 bg-gray-400/50 rounded-lg w-32 mx-auto"></div>
      </div>

      {/* Form Skeleton */}
      <div className="p-8 space-y-5">
        {/* Alert */}
        <div className="bg-gray-200 rounded-lg p-4 h-20"></div>

        {/* Input 1 */}
        <div>
          <div className="h-4 bg-gray-300 rounded w-32 mb-2"></div>
          <div className="h-12 bg-gray-200 rounded-lg"></div>
        </div>

        {/* Input 2 */}
        <div>
          <div className="h-4 bg-gray-300 rounded w-24 mb-2"></div>
          <div className="h-12 bg-gray-200 rounded-lg"></div>
        </div>

        {/* Input 3 */}
        <div>
          <div className="h-4 bg-gray-300 rounded w-40 mb-2"></div>
          <div className="h-12 bg-gray-200 rounded-lg"></div>
        </div>

        {/* Button */}
        <div className="h-14 bg-gray-300 rounded-lg"></div>

        {/* Footer text */}
        <div className="h-3 bg-gray-200 rounded w-2/3 mx-auto"></div>
      </div>
    </div>
  );
}
