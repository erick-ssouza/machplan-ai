'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { History, FileText, Download, Trash2, Eye } from 'lucide-react'
import { supabase, Analysis } from '@/lib/supabase'
import { toast } from 'sonner'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'

interface HistoryTabProps {
  userId: string
}

export default function HistoryTab({ userId }: HistoryTabProps) {
  const [analyses, setAnalyses] = useState<Analysis[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedAnalysis, setSelectedAnalysis] = useState<Analysis | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)

  useEffect(() => {
    loadAnalyses()
  }, [userId])

  const loadAnalyses = async () => {
    try {
      const { data, error } = await supabase
        .from('analyses')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })

      if (error) throw error
      setAnalyses(data || [])
    } catch (error: any) {
      toast.error('Erro ao carregar histórico')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Deseja realmente excluir esta análise?')) return

    try {
      const { error } = await supabase
        .from('analyses')
        .delete()
        .eq('id', id)

      if (error) throw error
      toast.success('Análise excluída!')
      loadAnalyses()
    } catch (error: any) {
      toast.error('Erro ao excluir análise')
    }
  }

  const handleView = (analysis: Analysis) => {
    setSelectedAnalysis(analysis)
    setDialogOpen(true)
  }

  const handleExport = (analysis: Analysis) => {
    const exportData = {
      title: analysis.title,
      material: analysis.material,
      process_type: analysis.process_type,
      created_at: analysis.created_at,
      features: analysis.features,
      machining_plan: analysis.machining_plan,
    }

    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: 'application/json',
    })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${analysis.title.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)

    toast.success('Relatório exportado!')
  }

  const statusLabels = {
    processing: 'Processando',
    completed: 'Concluído',
    failed: 'Falhou',
  }

  const statusColors = {
    processing: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    completed: 'bg-green-500/20 text-green-400 border-green-500/30',
    failed: 'bg-red-500/20 text-red-400 border-red-500/30',
  }

  const processTypeLabels = {
    milling: 'Fresamento',
    turning: 'Torneamento',
    complete: 'Completo',
  }

  return (
    <div className="space-y-6">
      <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <History className="w-5 h-5 text-cyan-400" />
            Histórico de Análises
          </CardTitle>
          <CardDescription className="text-slate-400">
            Visualize e gerencie suas análises anteriores
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-slate-400 text-center py-8">Carregando...</p>
          ) : analyses.length === 0 ? (
            <p className="text-slate-400 text-center py-8">
              Nenhuma análise realizada ainda. Vá para "Nova Análise" para começar.
            </p>
          ) : (
            <div className="space-y-3">
              {analyses.map((analysis) => (
                <div
                  key={analysis.id}
                  className="bg-slate-900/50 rounded-lg p-4 border border-slate-700 hover:border-slate-600 transition-colors"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-3 flex-wrap">
                        <h3 className="font-semibold text-white">{analysis.title}</h3>
                        <Badge
                          variant="outline"
                          className={statusColors[analysis.status]}
                        >
                          {statusLabels[analysis.status]}
                        </Badge>
                        {analysis.process_type && (
                          <Badge variant="outline" className="bg-cyan-500/20 text-cyan-400 border-cyan-500/30">
                            {processTypeLabels[analysis.process_type]}
                          </Badge>
                        )}
                      </div>

                      <div className="text-sm text-slate-300 space-y-1">
                        {analysis.material && (
                          <p>Material: {analysis.material}</p>
                        )}
                        <p className="text-slate-400">
                          {new Date(analysis.created_at).toLocaleString('pt-BR')}
                        </p>
                      </div>

                      {analysis.status === 'completed' && analysis.machining_plan && (
                        <div className="flex gap-2 text-xs text-slate-400">
                          <span>
                            {analysis.features?.length || 0} recursos identificados
                          </span>
                          <span>•</span>
                          <span>
                            {analysis.machining_plan?.operations?.length || 0} operações
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="flex gap-2">
                      {analysis.status === 'completed' && (
                        <>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleView(analysis)}
                            className="text-slate-400 hover:text-white"
                            title="Visualizar"
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleExport(analysis)}
                            className="text-slate-400 hover:text-white"
                            title="Exportar"
                          >
                            <Download className="w-4 h-4" />
                          </Button>
                        </>
                      )}
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDelete(analysis.id)}
                        className="text-slate-400 hover:text-red-400"
                        title="Excluir"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* View Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="bg-slate-800 border-slate-700 text-white max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{selectedAnalysis?.title}</DialogTitle>
          </DialogHeader>
          {selectedAnalysis && (
            <div className="space-y-6">
              {/* Info */}
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-slate-400">Material</p>
                  <p className="text-white font-medium">{selectedAnalysis.material}</p>
                </div>
                <div>
                  <p className="text-slate-400">Processo</p>
                  <p className="text-white font-medium">
                    {selectedAnalysis.process_type && processTypeLabels[selectedAnalysis.process_type]}
                  </p>
                </div>
              </div>

              {/* Features */}
              {selectedAnalysis.features && selectedAnalysis.features.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-white mb-3">
                    Recursos Identificados
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {selectedAnalysis.features.map((feature: any, idx: number) => (
                      <div
                        key={idx}
                        className="bg-slate-900/50 rounded-lg p-3 border border-slate-700"
                      >
                        <p className="font-medium text-cyan-400 capitalize">
                          {feature.type}
                        </p>
                        <p className="text-sm text-slate-300 mt-1">
                          {feature.description || feature.notes}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Machining Plan */}
              {selectedAnalysis.machining_plan?.operations && (
                <div>
                  <h3 className="text-lg font-semibold text-white mb-3">
                    Plano de Usinagem
                  </h3>
                  <div className="space-y-3">
                    {selectedAnalysis.machining_plan.operations.map((op: any, idx: number) => (
                      <div
                        key={idx}
                        className="bg-slate-900/50 rounded-lg p-4 border border-slate-700"
                      >
                        <div className="flex items-start gap-3">
                          <div className="w-8 h-8 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                            <span className="text-white font-bold text-sm">
                              {op.sequence}
                            </span>
                          </div>
                          <div className="flex-1">
                            <p className="font-medium text-white capitalize">
                              {op.operation}
                            </p>
                            <p className="text-sm text-slate-300 mt-1">{op.description}</p>
                            
                            {op.cutting_parameters && (
                              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-3">
                                <div className="bg-slate-800/50 rounded p-2">
                                  <p className="text-xs text-slate-400">RPM</p>
                                  <p className="text-sm font-medium text-white">
                                    {op.cutting_parameters.rpm}
                                  </p>
                                </div>
                                <div className="bg-slate-800/50 rounded p-2">
                                  <p className="text-xs text-slate-400">Avanço</p>
                                  <p className="text-sm font-medium text-white">
                                    {op.cutting_parameters.feed_rate}
                                  </p>
                                </div>
                                <div className="bg-slate-800/50 rounded p-2">
                                  <p className="text-xs text-slate-400">ap</p>
                                  <p className="text-sm font-medium text-white">
                                    {op.cutting_parameters.ap}
                                  </p>
                                </div>
                                <div className="bg-slate-800/50 rounded p-2">
                                  <p className="text-xs text-slate-400">ae</p>
                                  <p className="text-sm font-medium text-white">
                                    {op.cutting_parameters.ae}
                                  </p>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
