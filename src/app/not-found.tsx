'use client'

import { FileQuestion, Home, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/20 text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full mb-6 shadow-2xl shadow-purple-500/50">
            <FileQuestion className="w-10 h-10 text-white" />
          </div>

          <h1 className="text-6xl font-bold text-white mb-3">
            404
          </h1>
          
          <h2 className="text-2xl font-bold text-white mb-3">
            Página não encontrada
          </h2>
          
          <p className="text-slate-400 mb-8">
            A página que você está procurando não existe ou foi movida.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/" className="w-full sm:w-auto">
              <Button
                className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-semibold px-6 py-3 rounded-xl transition-all duration-300 hover:scale-105 shadow-lg shadow-cyan-500/30"
              >
                <Home className="w-4 h-4 mr-2" />
                Voltar ao início
              </Button>
            </Link>

            <Button
              onClick={() => window.history.back()}
              variant="outline"
              className="border-white/20 text-white hover:bg-white/10 px-6 py-3 rounded-xl transition-all duration-300"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
