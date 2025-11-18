'use client'

import { useEffect } from 'react'
import { AlertTriangle, RefreshCcw, Home } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log do erro para monitoramento
    console.error('Erro capturado:', error)
  }, [error])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/20 text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-red-500 to-orange-600 rounded-full mb-6 shadow-2xl shadow-red-500/50">
            <AlertTriangle className="w-10 h-10 text-white" />
          </div>

          <h2 className="text-3xl font-bold text-white mb-3">
            Algo deu errado
          </h2>
          
          <p className="text-slate-400 mb-6">
            Ocorreu um erro inesperado. Tente novamente ou volte para a página inicial.
          </p>

          {error.message && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 mb-6">
              <p className="text-red-400 text-sm font-mono break-words">
                {error.message}
              </p>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button
              onClick={reset}
              className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-semibold px-6 py-3 rounded-xl transition-all duration-300 hover:scale-105 shadow-lg shadow-cyan-500/30"
            >
              <RefreshCcw className="w-4 h-4 mr-2" />
              Tentar novamente
            </Button>

            <Button
              onClick={() => window.location.href = '/'}
              variant="outline"
              className="border-white/20 text-white hover:bg-white/10 px-6 py-3 rounded-xl transition-all duration-300"
            >
              <Home className="w-4 h-4 mr-2" />
              Voltar ao início
            </Button>
          </div>

          {error.digest && (
            <p className="text-slate-600 text-xs mt-6">
              ID do erro: {error.digest}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
