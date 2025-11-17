'use client'

import { useState } from 'react'
import { User } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Upload, Settings, History, Wrench, Cpu, LogOut, FileText } from 'lucide-react'
import AnalysisTab from './tabs/analysis-tab'
import MachinesTab from './tabs/machines-tab'
import ToolsTab from './tabs/tools-tab'
import HistoryTab from './tabs/history-tab'
import SettingsTab from './tabs/settings-tab'

interface DashboardProps {
  user: User
}

export default function Dashboard({ user }: DashboardProps) {
  const [activeTab, setActiveTab] = useState('analysis')

  const handleSignOut = async () => {
    await supabase.auth.signOut()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <header className="bg-slate-900/50 backdrop-blur-lg border-b border-slate-700/50 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                <Cpu className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">MachPlan AI</h1>
                <p className="text-xs text-slate-400">Planejamento Inteligente</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <p className="text-sm text-slate-300">{user.email}</p>
                <p className="text-xs text-slate-500">Usuário ativo</p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleSignOut}
                className="text-slate-300 hover:text-white hover:bg-slate-800"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Sair
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="bg-slate-800/50 border border-slate-700/50 p-1 backdrop-blur-sm">
            <TabsTrigger value="analysis" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-cyan-500 data-[state=active]:to-blue-600 data-[state=active]:text-white">
              <Upload className="w-4 h-4 mr-2" />
              Nova Análise
            </TabsTrigger>
            <TabsTrigger value="history" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-cyan-500 data-[state=active]:to-blue-600 data-[state=active]:text-white">
              <History className="w-4 h-4 mr-2" />
              Histórico
            </TabsTrigger>
            <TabsTrigger value="machines" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-cyan-500 data-[state=active]:to-blue-600 data-[state=active]:text-white">
              <Settings className="w-4 h-4 mr-2" />
              Máquinas
            </TabsTrigger>
            <TabsTrigger value="tools" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-cyan-500 data-[state=active]:to-blue-600 data-[state=active]:text-white">
              <Wrench className="w-4 h-4 mr-2" />
              Ferramentas
            </TabsTrigger>
            <TabsTrigger value="settings" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-cyan-500 data-[state=active]:to-blue-600 data-[state=active]:text-white">
              <FileText className="w-4 h-4 mr-2" />
              Parâmetros
            </TabsTrigger>
          </TabsList>

          <TabsContent value="analysis" className="space-y-4">
            <AnalysisTab userId={user.id} />
          </TabsContent>

          <TabsContent value="history" className="space-y-4">
            <HistoryTab userId={user.id} />
          </TabsContent>

          <TabsContent value="machines" className="space-y-4">
            <MachinesTab userId={user.id} />
          </TabsContent>

          <TabsContent value="tools" className="space-y-4">
            <ToolsTab userId={user.id} />
          </TabsContent>

          <TabsContent value="settings" className="space-y-4">
            <SettingsTab userId={user.id} />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
