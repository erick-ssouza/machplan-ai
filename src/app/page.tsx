'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Auth } from '@supabase/auth-ui-react'
import { ThemeSupa } from '@supabase/auth-ui-shared'
import { User } from '@supabase/supabase-js'
import Dashboard from '@/components/dashboard'
import { Loader2, Cpu, Shield, Zap, FileText, Settings, TrendingUp } from 'lucide-react'

export default function Home() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Verificar sessão atual
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })

    // Escutar mudanças de autenticação
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-cyan-400 mx-auto mb-4" />
          <p className="text-slate-400 text-sm animate-pulse">Carregando MachPlan AI...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 relative overflow-hidden">
        {/* Background decorativo */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMzLjMxNCAwIDYgMi42ODYgNiA2cy0yLjY4NiA2LTYgNi02LTIuNjg2LTYtNiAyLjY4Ni02IDYtNnoiIHN0cm9rZT0iIzA2YjZkNCIgc3Ryb2tlLW9wYWNpdHk9Ii4xIi8+PC9nPjwvc3ZnPg==')] opacity-20"></div>
        
        <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
          <div className="w-full max-w-6xl">
            <div className="grid lg:grid-cols-2 gap-8 items-center">
              
              {/* Lado esquerdo - Informações */}
              <div className="text-center lg:text-left space-y-6 animate-fade-in">
                <div className="inline-flex items-center justify-center lg:justify-start w-20 h-20 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-3xl mb-4 shadow-2xl shadow-cyan-500/50 animate-float">
                  <Cpu className="w-12 h-12 text-white" />
                </div>
                
                <div>
                  <h1 className="text-5xl md:text-6xl font-bold text-white mb-3 bg-clip-text text-transparent bg-gradient-to-r from-white to-cyan-200">
                    MachPlan AI
                  </h1>
                  <p className="text-xl md:text-2xl text-cyan-400 font-semibold mb-2">
                    Planejamento Inteligente de Usinagem
                  </p>
                  <p className="text-slate-400 text-base md:text-lg">
                    Análise automática de desenhos técnicos com Inteligência Artificial
                  </p>
                </div>

                {/* Features */}
                <div className="grid sm:grid-cols-2 gap-4 pt-4">
                  <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10 hover:border-cyan-500/50 transition-all duration-300 hover:scale-105">
                    <Zap className="w-8 h-8 text-cyan-400 mb-2" />
                    <h3 className="text-white font-semibold mb-1">Análise Rápida</h3>
                    <p className="text-slate-400 text-sm">Identifica furos, rasgos, rebaixos e tolerâncias automaticamente</p>
                  </div>
                  
                  <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10 hover:border-cyan-500/50 transition-all duration-300 hover:scale-105">
                    <Settings className="w-8 h-8 text-blue-400 mb-2" />
                    <h3 className="text-white font-semibold mb-1">Parâmetros Precisos</h3>
                    <p className="text-slate-400 text-sm">RPM, avanço, profundidade e seleção de ferramentas</p>
                  </div>
                  
                  <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10 hover:border-cyan-500/50 transition-all duration-300 hover:scale-105">
                    <FileText className="w-8 h-8 text-purple-400 mb-2" />
                    <h3 className="text-white font-semibold mb-1">Relatórios Completos</h3>
                    <p className="text-slate-400 text-sm">Exportação e histórico de todas as análises</p>
                  </div>
                  
                  <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10 hover:border-cyan-500/50 transition-all duration-300 hover:scale-105">
                    <Shield className="w-8 h-8 text-green-400 mb-2" />
                    <h3 className="text-white font-semibold mb-1">100% Seguro</h3>
                    <p className="text-slate-400 text-sm">Criptografia e exclusão automática de desenhos</p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-3 justify-center lg:justify-start pt-2">
                  <div className="flex items-center gap-2 text-slate-300 text-sm">
                    <TrendingUp className="w-4 h-4 text-cyan-400" />
                    <span>Otimização de processos</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-300 text-sm">
                    <Cpu className="w-4 h-4 text-cyan-400" />
                    <span>Powered by OpenAI</span>
                  </div>
                </div>
              </div>

              {/* Lado direito - Login */}
              <div className="w-full max-w-md mx-auto lg:mx-0 animate-slide-in">
                <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/20 hover:border-cyan-500/30 transition-all duration-300">
                  <div className="text-center mb-6">
                    <h2 className="text-2xl font-bold text-white mb-2">Bem-vindo de volta</h2>
                    <p className="text-slate-400 text-sm">Entre para acessar sua conta</p>
                  </div>

                 <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 shadow-2xl border border-white/10 w-full max-w-md mx-auto">
    <h2 className="text-2xl font-semibold mb-4 text-center">Entrar</h2>

    <input
        type="email"
        placeholder="Email"
        className="w-full p-3 rounded mb-3 bg-white/20"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
    />

    <input
        type="password"
        placeholder="Senha"
        className="w-full p-3 rounded mb-3 bg-white/20"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
    />

    <button
        onClick={handleLogin}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white p-3 rounded font-medium"
    >
        Entrar
    </button>

    <button
        onClick={handleSignup}
        className="w-full bg-green-600 hover:bg-green-700 text-white p-3 rounded font-medium mt-3"
    >
        Criar conta
    </button>
</div>


                  <div className="mt-6 pt-6 border-t border-white/10">
                    <p className="text-center text-slate-400 text-xs flex items-center justify-center gap-2">
                      <Shield className="w-4 h-4 text-green-400" />
                      Seus dados são protegidos com criptografia de ponta a ponta
                    </p>
                  </div>
                </div>

                <div className="mt-4 text-center">
                  <p className="text-slate-500 text-xs">
                    Ao continuar, você concorda com nossos Termos de Uso e Política de Privacidade
                  </p>
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="absolute bottom-0 left-0 right-0 p-6 text-center">
          <p className="text-slate-600 text-sm">
            © 2024 MachPlan AI - Tecnologia de ponta para usinagem inteligente
          </p>
        </div>

        <style jsx global>{`
          @keyframes fade-in {
            from {
              opacity: 0;
              transform: translateY(20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          @keyframes slide-in {
            from {
              opacity: 0;
              transform: translateX(20px);
            }
            to {
              opacity: 1;
              transform: translateX(0);
            }
          }

          @keyframes float {
            0%, 100% {
              transform: translateY(0px);
            }
            50% {
              transform: translateY(-10px);
            }
          }

          .animate-fade-in {
            animation: fade-in 0.8s ease-out;
          }

          .animate-slide-in {
            animation: slide-in 0.8s ease-out;
          }

          .animate-float {
            animation: float 3s ease-in-out infinite;
          }
        `}</style>
      </div>
    )
  }

  return <Dashboard user={user} />
}
