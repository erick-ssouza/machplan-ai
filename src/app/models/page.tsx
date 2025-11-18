"use client";

import MyModelsList from "@/components/MyModelsList";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";

export default function ModelsPage() {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000, // 1 minuto
            refetchOnWindowFocus: false,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
              Meus Modelos
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Gerencie seus modelos de IA personalizados
            </p>
          </div>

          <MyModelsList />
        </div>
      </div>
    </QueryClientProvider>
  );
}
