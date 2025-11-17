'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { FileText, Plus, Trash2, Edit } from 'lucide-react'
import { supabase, CuttingParameter } from '@/lib/supabase'
import { toast } from 'sonner'

interface SettingsTabProps {
  userId: string
}

export default function SettingsTab({ userId }: SettingsTabProps) {
  const [parameters, setParameters] = useState<CuttingParameter[]>([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingParam, setEditingParam] = useState<CuttingParameter | null>(null)

  const [formData, setFormData] = useState({
    material: '',
    tool_type: '',
    rpm: '',
    feed_rate: '',
    depth_of_cut: '',
    ap: '',
    ae: '',
    notes: '',
  })

  useEffect(() => {
    loadParameters()
  }, [userId])

  const loadParameters = async () => {
    try {
      const { data, error } = await supabase
        .from('cutting_parameters')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })

      if (error) throw error
      setParameters(data || [])
    } catch (error: any) {
      toast.error('Erro ao carregar parâmetros')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const paramData = {
        user_id: userId,
        material: formData.material,
        tool_type: formData.tool_type,
        rpm: formData.rpm ? parseInt(formData.rpm) : null,
        feed_rate: formData.feed_rate ? parseFloat(formData.feed_rate) : null,
        depth_of_cut: formData.depth_of_cut ? parseFloat(formData.depth_of_cut) : null,
        ap: formData.ap ? parseFloat(formData.ap) : null,
        ae: formData.ae ? parseFloat(formData.ae) : null,
        notes: formData.notes || null,
      }

      if (editingParam) {
        const { error } = await supabase
          .from('cutting_parameters')
          .update(paramData)
          .eq('id', editingParam.id)

        if (error) throw error
        toast.success('Parâmetro atualizado!')
      } else {
        const { error } = await supabase
          .from('cutting_parameters')
          .insert(paramData)

        if (error) throw error
        toast.success('Parâmetro cadastrado!')
      }

      setDialogOpen(false)
      resetForm()
      loadParameters()
    } catch (error: any) {
      toast.error('Erro ao salvar parâmetro')
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Deseja realmente excluir este parâmetro?')) return

    try {
      const { error } = await supabase
        .from('cutting_parameters')
        .delete()
        .eq('id', id)

      if (error) throw error
      toast.success('Parâmetro excluído!')
      loadParameters()
    } catch (error: any) {
      toast.error('Erro ao excluir parâmetro')
    }
  }

  const handleEdit = (param: CuttingParameter) => {
    setEditingParam(param)
    setFormData({
      material: param.material,
      tool_type: param.tool_type,
      rpm: param.rpm?.toString() || '',
      feed_rate: param.feed_rate?.toString() || '',
      depth_of_cut: param.depth_of_cut?.toString() || '',
      ap: param.ap?.toString() || '',
      ae: param.ae?.toString() || '',
      notes: param.notes || '',
    })
    setDialogOpen(true)
  }

  const resetForm = () => {
    setEditingParam(null)
    setFormData({
      material: '',
      tool_type: '',
      rpm: '',
      feed_rate: '',
      depth_of_cut: '',
      ap: '',
      ae: '',
      notes: '',
    })
  }

  return (
    <div className="space-y-6">
      <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-white flex items-center gap-2">
                <FileText className="w-5 h-5 text-cyan-400" />
                Parâmetros de Corte Preferidos
              </CardTitle>
              <CardDescription className="text-slate-400">
                Configure seus parâmetros padrão por material e ferramenta
              </CardDescription>
            </div>
            <Dialog open={dialogOpen} onOpenChange={(open) => {
              setDialogOpen(open)
              if (!open) resetForm()
            }}>
              <DialogTrigger asChild>
                <Button className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700">
                  <Plus className="w-4 h-4 mr-2" />
                  Novo Parâmetro
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-slate-800 border-slate-700 text-white max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>
                    {editingParam ? 'Editar Parâmetro' : 'Novo Parâmetro'}
                  </DialogTitle>
                  <DialogDescription className="text-slate-400">
                    Configure os parâmetros de corte preferidos
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Material *</Label>
                      <Input
                        value={formData.material}
                        onChange={(e) => setFormData({ ...formData, material: e.target.value })}
                        placeholder="Ex: Aço 1045"
                        required
                        className="bg-slate-900 border-slate-700"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Tipo de Ferramenta *</Label>
                      <Input
                        value={formData.tool_type}
                        onChange={(e) => setFormData({ ...formData, tool_type: e.target.value })}
                        placeholder="Ex: Fresa de Topo Ø10mm"
                        required
                        className="bg-slate-900 border-slate-700"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>RPM</Label>
                      <Input
                        type="number"
                        value={formData.rpm}
                        onChange={(e) => setFormData({ ...formData, rpm: e.target.value })}
                        placeholder="Ex: 3000"
                        className="bg-slate-900 border-slate-700"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Avanço (mm/min)</Label>
                      <Input
                        type="number"
                        step="0.01"
                        value={formData.feed_rate}
                        onChange={(e) => setFormData({ ...formData, feed_rate: e.target.value })}
                        placeholder="Ex: 300"
                        className="bg-slate-900 border-slate-700"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Profundidade de Corte (mm)</Label>
                      <Input
                        type="number"
                        step="0.01"
                        value={formData.depth_of_cut}
                        onChange={(e) => setFormData({ ...formData, depth_of_cut: e.target.value })}
                        placeholder="Ex: 2"
                        className="bg-slate-900 border-slate-700"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>ap - Profundidade Axial (mm)</Label>
                      <Input
                        type="number"
                        step="0.01"
                        value={formData.ap}
                        onChange={(e) => setFormData({ ...formData, ap: e.target.value })}
                        placeholder="Ex: 1.5"
                        className="bg-slate-900 border-slate-700"
                      />
                    </div>

                    <div className="space-y-2 md:col-span-2">
                      <Label>ae - Profundidade Radial (mm)</Label>
                      <Input
                        type="number"
                        step="0.01"
                        value={formData.ae}
                        onChange={(e) => setFormData({ ...formData, ae: e.target.value })}
                        placeholder="Ex: 0.5"
                        className="bg-slate-900 border-slate-700"
                      />
                    </div>

                    <div className="space-y-2 md:col-span-2">
                      <Label>Observações</Label>
                      <Textarea
                        value={formData.notes}
                        onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                        placeholder="Informações adicionais sobre estes parâmetros..."
                        className="bg-slate-900 border-slate-700"
                        rows={3}
                      />
                    </div>
                  </div>

                  <div className="flex gap-3 justify-end">
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={() => setDialogOpen(false)}
                    >
                      Cancelar
                    </Button>
                    <Button
                      type="submit"
                      className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700"
                    >
                      {editingParam ? 'Atualizar' : 'Cadastrar'}
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-slate-400 text-center py-8">Carregando...</p>
          ) : parameters.length === 0 ? (
            <p className="text-slate-400 text-center py-8">
              Nenhum parâmetro cadastrado. Clique em "Novo Parâmetro" para começar.
            </p>
          ) : (
            <div className="space-y-3">
              {parameters.map((param) => (
                <div
                  key={param.id}
                  className="bg-slate-900/50 rounded-lg p-4 border border-slate-700 hover:border-slate-600 transition-colors"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold text-white">{param.material}</h3>
                        <span className="text-slate-400">•</span>
                        <p className="text-cyan-400">{param.tool_type}</p>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 text-sm">
                        {param.rpm && (
                          <div>
                            <p className="text-slate-400">RPM</p>
                            <p className="text-white font-medium">{param.rpm}</p>
                          </div>
                        )}
                        {param.feed_rate && (
                          <div>
                            <p className="text-slate-400">Avanço</p>
                            <p className="text-white font-medium">{param.feed_rate} mm/min</p>
                          </div>
                        )}
                        {param.depth_of_cut && (
                          <div>
                            <p className="text-slate-400">Prof. Corte</p>
                            <p className="text-white font-medium">{param.depth_of_cut} mm</p>
                          </div>
                        )}
                        {param.ap && (
                          <div>
                            <p className="text-slate-400">ap</p>
                            <p className="text-white font-medium">{param.ap} mm</p>
                          </div>
                        )}
                        {param.ae && (
                          <div>
                            <p className="text-slate-400">ae</p>
                            <p className="text-white font-medium">{param.ae} mm</p>
                          </div>
                        )}
                      </div>

                      {param.notes && (
                        <p className="text-sm text-slate-400 mt-2">{param.notes}</p>
                      )}
                    </div>

                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleEdit(param)}
                        className="text-slate-400 hover:text-white"
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDelete(param.id)}
                        className="text-slate-400 hover:text-red-400"
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
    </div>
  )
}
