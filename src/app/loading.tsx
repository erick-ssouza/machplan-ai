'use client'

import { Loader2, Cpu } from 'lucide-react'

export default function Loading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-3xl mb-6 shadow-2xl shadow-cyan-500/50 animate-pulse">
          <Cpu className="w-10 h-10 text-white" />
        </div>
        
        <div className="flex items-center justify-center gap-3 mb-4">
          <Loader2 className="w-8 h-8 animate-spin text-cyan-400" />
          <h2 className="text-2xl font-bold text-white">Carregando...</h2>
        </div>
        
        <p className="text-slate-400 text-sm animate-pulse">
          Aguarde enquanto preparamos tudo para você
        </p>
      </div>
    </div>
  )
}
