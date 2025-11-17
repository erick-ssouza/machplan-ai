'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Wrench, Plus, Trash2, Edit } from 'lucide-react'
import { supabase, Tool } from '@/lib/supabase'
import { toast } from 'sonner'

interface ToolsTabProps {
  userId: string
}

export default function ToolsTab({ userId }: ToolsTabProps) {
  const [tools, setTools] = useState<Tool[]>([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingTool, setEditingTool] = useState<Tool | null>(null)

  const [formData, setFormData] = useState({
    name: '',
    type: 'end_mill' as Tool['type'],
    material: '',
    diameter: '',
    length: '',
    flutes: '',
    coating: '',
    manufacturer: '',
    part_number: '',
    notes: '',
  })

  useEffect(() => {
    loadTools()
  }, [userId])

  const loadTools = async () => {
    try {
      const { data, error } = await supabase
        .from('tools')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })

      if (error) throw error
      setTools(data || [])
    } catch (error: any) {
      toast.error('Erro ao carregar ferramentas')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const toolData = {
        user_id: userId,
        name: formData.name,
        type: formData.type,
        material: formData.material || null,
        diameter: formData.diameter ? parseFloat(formData.diameter) : null,
        length: formData.length ? parseFloat(formData.length) : null,
        flutes: formData.flutes ? parseInt(formData.flutes) : null,
        coating: formData.coating || null,
        manufacturer: formData.manufacturer || null,
        part_number: formData.part_number || null,
        notes: formData.notes || null,
      }

      if (editingTool) {
        const { error } = await supabase
          .from('tools')
          .update(toolData)
          .eq('id', editingTool.id)

        if (error) throw error
        toast.success('Ferramenta atualizada!')
      } else {
        const { error } = await supabase
          .from('tools')
          .insert(toolData)

        if (error) throw error
        toast.success('Ferramenta cadastrada!')
      }

      setDialogOpen(false)
      resetForm()
      loadTools()
    } catch (error: any) {
      toast.error('Erro ao salvar ferramenta')
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Deseja realmente excluir esta ferramenta?')) return

    try {
      const { error } = await supabase
        .from('tools')
        .delete()
        .eq('id', id)

      if (error) throw error
      toast.success('Ferramenta excluída!')
      loadTools()
    } catch (error: any) {
      toast.error('Erro ao excluir ferramenta')
    }
  }

  const handleEdit = (tool: Tool) => {
    setEditingTool(tool)
    setFormData({
      name: tool.name,
      type: tool.type,
      material: tool.material || '',
      diameter: tool.diameter?.toString() || '',
      length: tool.length?.toString() || '',
      flutes: tool.flutes?.toString() || '',
      coating: tool.coating || '',
      manufacturer: tool.manufacturer || '',
      part_number: tool.part_number || '',
      notes: tool.notes || '',
    })
    setDialogOpen(true)
  }

  const resetForm = () => {
    setEditingTool(null)
    setFormData({
      name: '',
      type: 'end_mill',
      material: '',
      diameter: '',
      length: '',
      flutes: '',
      coating: '',
      manufacturer: '',
      part_number: '',
      notes: '',
    })
  }

  const toolTypeLabels = {
    drill: 'Broca',
    end_mill: 'Fresa de Topo',
    face_mill: 'Fresa de Face',
    insert: 'Pastilha',
    hss: 'HSS',
    carbide: 'Metal Duro',
  }

  return (
    <div className="space-y-6">
      <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-white flex items-center gap-2">
                <Wrench className="w-5 h-5 text-cyan-400" />
                Minhas Ferramentas
              </CardTitle>
              <CardDescription className="text-slate-400">
                Gerencie seu inventário de ferramentas de corte
              </CardDescription>
            </div>
            <Dialog open={dialogOpen} onOpenChange={(open) => {
              setDialogOpen(open)
              if (!open) resetForm()
            }}>
              <DialogTrigger asChild>
                <Button className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700">
                  <Plus className="w-4 h-4 mr-2" />
                  Nova Ferramenta
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-slate-800 border-slate-700 text-white max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>
                    {editingTool ? 'Editar Ferramenta' : 'Nova Ferramenta'}
                  </DialogTitle>
                  <DialogDescription className="text-slate-400">
                    Preencha os dados da ferramenta de corte
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Nome *</Label>
                      <Input
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="Ex: Fresa Ø10mm"
                        required
                        className="bg-slate-900 border-slate-700"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Tipo *</Label>
                      <Select value={formData.type} onValueChange={(v: any) => setFormData({ ...formData, type: v })}>
                        <SelectTrigger className="bg-slate-900 border-slate-700">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="drill">Broca</SelectItem>
                          <SelectItem value="end_mill">Fresa de Topo</SelectItem>
                          <SelectItem value="face_mill">Fresa de Face</SelectItem>
                          <SelectItem value="insert">Pastilha</SelectItem>
                          <SelectItem value="hss">HSS</SelectItem>
                          <SelectItem value="carbide">Metal Duro</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>Material</Label>
                      <Input
                        value={formData.material}
                        onChange={(e) => setFormData({ ...formData, material: e.target.value })}
                        placeholder="Ex: HSS, Metal Duro"
                        className="bg-slate-900 border-slate-700"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Diâmetro (mm)</Label>
                      <Input
                        type="number"
                        step="0.01"
                        value={formData.diameter}
                        onChange={(e) => setFormData({ ...formData, diameter: e.target.value })}
                        placeholder="Ex: 10"
                        className="bg-slate-900 border-slate-700"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Comprimento (mm)</Label>
                      <Input
                        type="number"
                        step="0.1"
                        value={formData.length}
                        onChange={(e) => setFormData({ ...formData, length: e.target.value })}
                        placeholder="Ex: 75"
                        className="bg-slate-900 border-slate-700"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Número de Arestas</Label>
                      <Input
                        type="number"
                        value={formData.flutes}
                        onChange={(e) => setFormData({ ...formData, flutes: e.target.value })}
                        placeholder="Ex: 4"
                        className="bg-slate-900 border-slate-700"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Revestimento</Label>
                      <Input
                        value={formData.coating}
                        onChange={(e) => setFormData({ ...formData, coating: e.target.value })}
                        placeholder="Ex: TiN, TiAlN"
                        className="bg-slate-900 border-slate-700"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Fabricante</Label>
                      <Input
                        value={formData.manufacturer}
                        onChange={(e) => setFormData({ ...formData, manufacturer: e.target.value })}
                        placeholder="Ex: Sandvik, Kennametal"
                        className="bg-slate-900 border-slate-700"
                      />
                    </div>

                    <div className="space-y-2 md:col-span-2">
                      <Label>Código/Part Number</Label>
                      <Input
                        value={formData.part_number}
                        onChange={(e) => setFormData({ ...formData, part_number: e.target.value })}
                        placeholder="Ex: R390-11 T3 08M-PM"
                        className="bg-slate-900 border-slate-700"
                      />
                    </div>

                    <div className="space-y-2 md:col-span-2">
                      <Label>Observações</Label>
                      <Textarea
                        value={formData.notes}
                        onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                        placeholder="Informações adicionais..."
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
                      {editingTool ? 'Atualizar' : 'Cadastrar'}
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
          ) : tools.length === 0 ? (
            <p className="text-slate-400 text-center py-8">
              Nenhuma ferramenta cadastrada. Clique em "Nova Ferramenta" para começar.
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {tools.map((tool) => (
                <div
                  key={tool.id}
                  className="bg-slate-900/50 rounded-lg p-4 border border-slate-700 hover:border-slate-600 transition-colors"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-semibold text-white">{tool.name}</h3>
                      <p className="text-sm text-cyan-400">
                        {toolTypeLabels[tool.type]}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleEdit(tool)}
                        className="text-slate-400 hover:text-white"
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDelete(tool.id)}
                        className="text-slate-400 hover:text-red-400"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-1 text-sm text-slate-300">
                    {tool.diameter && <p>Ø {tool.diameter}mm</p>}
                    {tool.material && <p>Material: {tool.material}</p>}
                    {tool.flutes && <p>Arestas: {tool.flutes}</p>}
                    {tool.coating && <p>Revestimento: {tool.coating}</p>}
                    {tool.manufacturer && <p>Fabricante: {tool.manufacturer}</p>}
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
