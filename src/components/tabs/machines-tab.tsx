'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Settings, Plus, Trash2, Edit } from 'lucide-react'
import { supabase, Machine } from '@/lib/supabase'
import { toast } from 'sonner'

interface MachinesTabProps {
  userId: string
}

export default function MachinesTab({ userId }: MachinesTabProps) {
  const [machines, setMachines] = useState<Machine[]>([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingMachine, setEditingMachine] = useState<Machine | null>(null)

  const [formData, setFormData] = useState({
    name: '',
    type: 'vertical' as Machine['type'],
    manufacturer: '',
    model: '',
    max_rpm: '',
    max_power: '',
    work_area_x: '',
    work_area_y: '',
    work_area_z: '',
    notes: '',
  })

  useEffect(() => {
    loadMachines()
  }, [userId])

  const loadMachines = async () => {
    try {
      const { data, error } = await supabase
        .from('machines')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })

      if (error) throw error
      setMachines(data || [])
    } catch (error: any) {
      toast.error('Erro ao carregar máquinas')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const machineData = {
        user_id: userId,
        name: formData.name,
        type: formData.type,
        manufacturer: formData.manufacturer || null,
        model: formData.model || null,
        max_rpm: formData.max_rpm ? parseInt(formData.max_rpm) : null,
        max_power: formData.max_power ? parseFloat(formData.max_power) : null,
        work_area_x: formData.work_area_x ? parseFloat(formData.work_area_x) : null,
        work_area_y: formData.work_area_y ? parseFloat(formData.work_area_y) : null,
        work_area_z: formData.work_area_z ? parseFloat(formData.work_area_z) : null,
        notes: formData.notes || null,
      }

      if (editingMachine) {
        const { error } = await supabase
          .from('machines')
          .update(machineData)
          .eq('id', editingMachine.id)

        if (error) throw error
        toast.success('Máquina atualizada!')
      } else {
        const { error } = await supabase
          .from('machines')
          .insert(machineData)

        if (error) throw error
        toast.success('Máquina cadastrada!')
      }

      setDialogOpen(false)
      resetForm()
      loadMachines()
    } catch (error: any) {
      toast.error('Erro ao salvar máquina')
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Deseja realmente excluir esta máquina?')) return

    try {
      const { error } = await supabase
        .from('machines')
        .delete()
        .eq('id', id)

      if (error) throw error
      toast.success('Máquina excluída!')
      loadMachines()
    } catch (error: any) {
      toast.error('Erro ao excluir máquina')
    }
  }

  const handleEdit = (machine: Machine) => {
    setEditingMachine(machine)
    setFormData({
      name: machine.name,
      type: machine.type,
      manufacturer: machine.manufacturer || '',
      model: machine.model || '',
      max_rpm: machine.max_rpm?.toString() || '',
      max_power: machine.max_power?.toString() || '',
      work_area_x: machine.work_area_x?.toString() || '',
      work_area_y: machine.work_area_y?.toString() || '',
      work_area_z: machine.work_area_z?.toString() || '',
      notes: machine.notes || '',
    })
    setDialogOpen(true)
  }

  const resetForm = () => {
    setEditingMachine(null)
    setFormData({
      name: '',
      type: 'vertical',
      manufacturer: '',
      model: '',
      max_rpm: '',
      max_power: '',
      work_area_x: '',
      work_area_y: '',
      work_area_z: '',
      notes: '',
    })
  }

  const machineTypeLabels = {
    vertical: 'Fresadora Vertical',
    horizontal: 'Fresadora Horizontal',
    turning: 'Torno CNC',
    machining_center: 'Centro de Usinagem',
  }

  return (
    <div className="space-y-6">
      <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-white flex items-center gap-2">
                <Settings className="w-5 h-5 text-cyan-400" />
                Minhas Máquinas
              </CardTitle>
              <CardDescription className="text-slate-400">
                Gerencie suas máquinas CNC cadastradas
              </CardDescription>
            </div>
            <Dialog open={dialogOpen} onOpenChange={(open) => {
              setDialogOpen(open)
              if (!open) resetForm()
            }}>
              <DialogTrigger asChild>
                <Button className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700">
                  <Plus className="w-4 h-4 mr-2" />
                  Nova Máquina
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-slate-800 border-slate-700 text-white max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>
                    {editingMachine ? 'Editar Máquina' : 'Nova Máquina'}
                  </DialogTitle>
                  <DialogDescription className="text-slate-400">
                    Preencha os dados da máquina CNC
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Nome *</Label>
                      <Input
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="Ex: Fresadora 01"
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
                          <SelectItem value="vertical">Fresadora Vertical</SelectItem>
                          <SelectItem value="horizontal">Fresadora Horizontal</SelectItem>
                          <SelectItem value="turning">Torno CNC</SelectItem>
                          <SelectItem value="machining_center">Centro de Usinagem</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>Fabricante</Label>
                      <Input
                        value={formData.manufacturer}
                        onChange={(e) => setFormData({ ...formData, manufacturer: e.target.value })}
                        placeholder="Ex: Romi, Haas"
                        className="bg-slate-900 border-slate-700"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Modelo</Label>
                      <Input
                        value={formData.model}
                        onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                        placeholder="Ex: D600"
                        className="bg-slate-900 border-slate-700"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>RPM Máximo</Label>
                      <Input
                        type="number"
                        value={formData.max_rpm}
                        onChange={(e) => setFormData({ ...formData, max_rpm: e.target.value })}
                        placeholder="Ex: 8000"
                        className="bg-slate-900 border-slate-700"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Potência Máxima (kW)</Label>
                      <Input
                        type="number"
                        step="0.1"
                        value={formData.max_power}
                        onChange={(e) => setFormData({ ...formData, max_power: e.target.value })}
                        placeholder="Ex: 15"
                        className="bg-slate-900 border-slate-700"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Área de Trabalho X (mm)</Label>
                      <Input
                        type="number"
                        value={formData.work_area_x}
                        onChange={(e) => setFormData({ ...formData, work_area_x: e.target.value })}
                        placeholder="Ex: 600"
                        className="bg-slate-900 border-slate-700"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Área de Trabalho Y (mm)</Label>
                      <Input
                        type="number"
                        value={formData.work_area_y}
                        onChange={(e) => setFormData({ ...formData, work_area_y: e.target.value })}
                        placeholder="Ex: 400"
                        className="bg-slate-900 border-slate-700"
                      />
                    </div>

                    <div className="space-y-2 md:col-span-2">
                      <Label>Área de Trabalho Z (mm)</Label>
                      <Input
                        type="number"
                        value={formData.work_area_z}
                        onChange={(e) => setFormData({ ...formData, work_area_z: e.target.value })}
                        placeholder="Ex: 500"
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
                      {editingMachine ? 'Atualizar' : 'Cadastrar'}
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
          ) : machines.length === 0 ? (
            <p className="text-slate-400 text-center py-8">
              Nenhuma máquina cadastrada. Clique em "Nova Máquina" para começar.
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {machines.map((machine) => (
                <div
                  key={machine.id}
                  className="bg-slate-900/50 rounded-lg p-4 border border-slate-700 hover:border-slate-600 transition-colors"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-semibold text-white">{machine.name}</h3>
                      <p className="text-sm text-cyan-400">
                        {machineTypeLabels[machine.type]}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleEdit(machine)}
                        className="text-slate-400 hover:text-white"
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDelete(machine.id)}
                        className="text-slate-400 hover:text-red-400"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-1 text-sm text-slate-300">
                    {machine.manufacturer && (
                      <p>Fabricante: {machine.manufacturer}</p>
                    )}
                    {machine.model && <p>Modelo: {machine.model}</p>}
                    {machine.max_rpm && <p>RPM Máx: {machine.max_rpm}</p>}
                    {(machine.work_area_x || machine.work_area_y || machine.work_area_z) && (
                      <p>
                        Área: {machine.work_area_x || '-'} x {machine.work_area_y || '-'} x{' '}
                        {machine.work_area_z || '-'} mm
                      </p>
                    )}
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
