'use client'

import { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Upload, FileImage, FileText, Loader2, CheckCircle, AlertCircle } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { analyzeDrawing } from '@/lib/openai'
import { toast } from 'sonner'

interface AnalysisTabProps {
  userId: string
}

export default function AnalysisTab({ userId }: AnalysisTabProps) {
  const [file, setFile] = useState<File | null>(null)
  const [title, setTitle] = useState('')
  const [material, setMaterial] = useState('')
  const [processType, setProcessType] = useState<'milling' | 'turning' | 'complete'>('complete')
  const [analyzing, setAnalyzing] = useState(false)
  const [result, setResult] = useState<any>(null)

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      setFile(acceptedFiles[0])
      if (!title) {
        setTitle(acceptedFiles[0].name.replace(/\.[^/.]+$/, ''))
      }
    }
  }, [title])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.webp'],
      'application/pdf': ['.pdf'],
    },
    maxFiles: 1,
  })

  const handleAnalyze = async () => {
    if (!file || !title || !material) {
      toast.error('Preencha todos os campos obrigatórios')
      return
    }

    setAnalyzing(true)
    setResult(null)

    try {
      // Upload do arquivo para Supabase Storage
      const fileExt = file.name.split('.').pop()
      const fileName = `${userId}/${Date.now()}.${fileExt}`
      
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('drawings')
        .upload(fileName, file)

      if (uploadError) throw uploadError

      // Obter URL pública
      const { data: { publicUrl } } = supabase.storage
        .from('drawings')
        .getPublicUrl(fileName)

      // Buscar ferramentas do usuário
      const { data: tools } = await supabase
        .from('tools')
        .select('*')
        .eq('user_id', userId)

      // Analisar desenho com OpenAI
      const analysisResult = await analyzeDrawing(
        publicUrl,
        material,
        processType,
        tools || []
      )

      // Salvar análise no banco
      const { data: analysisData, error: analysisError } = await supabase
        .from('analyses')
        .insert({
          user_id: userId,
          title,
          drawing_url: publicUrl,
          drawing_type: file.type.includes('pdf') ? 'pdf' : 'image',
          material,
          process_type: processType,
          status: 'completed',
          features: analysisResult.features,
          machining_plan: analysisResult.machining_plan,
        })
        .select()
        .single()

      if (analysisError) throw analysisError

      setResult(analysisResult)
      toast.success('Análise concluída com sucesso!')

      // Agendar exclusão do arquivo após 24h
      setTimeout(async () => {
        await supabase.storage.from('drawings').remove([fileName])
      }, 24 * 60 * 60 * 1000)

    } catch (error: any) {
      console.error('Erro na análise:', error)
      toast.error('Erro ao analisar desenho: ' + error.message)
    } finally {
      setAnalyzing(false)
    }
  }

  return (
    <div className="space-y-6">
      <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Upload className="w-5 h-5 text-cyan-400" />
            Nova Análise de Desenho
          </CardTitle>
          <CardDescription className="text-slate-400">
            Faça upload de um desenho técnico (imagem ou PDF) para análise automática
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Upload Area */}
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${
              isDragActive
                ? 'border-cyan-400 bg-cyan-400/10'
                : 'border-slate-600 hover:border-slate-500 bg-slate-900/50'
            }`}
          >
            <input {...getInputProps()} />
            {file ? (
              <div className="space-y-2">
                {file.type.includes('pdf') ? (
                  <FileText className="w-12 h-12 mx-auto text-cyan-400" />
                ) : (
                  <FileImage className="w-12 h-12 mx-auto text-cyan-400" />
                )}
                <p className="text-white font-medium">{file.name}</p>
                <p className="text-sm text-slate-400">
                  {(file.size / 1024 / 1024).toFixed(2)} MB
                </p>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation()
                    setFile(null)
                  }}
                  className="text-slate-400 hover:text-white"
                >
                  Remover arquivo
                </Button>
              </div>
            ) : (
              <div className="space-y-2">
                <Upload className="w-12 h-12 mx-auto text-slate-500" />
                <p className="text-white">
                  {isDragActive
                    ? 'Solte o arquivo aqui'
                    : 'Arraste um arquivo ou clique para selecionar'}
                </p>
                <p className="text-sm text-slate-400">
                  Suporta imagens (PNG, JPG, WEBP) e PDF
                </p>
              </div>
            )}
          </div>

          {/* Form Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title" className="text-slate-300">
                Título da Análise *
              </Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Ex: Flange DN100"
                className="bg-slate-900/50 border-slate-700 text-white"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="material" className="text-slate-300">
                Material da Peça *
              </Label>
              <Input
                id="material"
                value={material}
                onChange={(e) => setMaterial(e.target.value)}
                placeholder="Ex: Aço 1045, Alumínio 6061"
                className="bg-slate-900/50 border-slate-700 text-white"
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="process" className="text-slate-300">
                Tipo de Processo
              </Label>
              <Select value={processType} onValueChange={(v: any) => setProcessType(v)}>
                <SelectTrigger className="bg-slate-900/50 border-slate-700 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="complete">Processo Completo</SelectItem>
                  <SelectItem value="milling">Apenas Fresamento</SelectItem>
                  <SelectItem value="turning">Apenas Torneamento</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button
            onClick={handleAnalyze}
            disabled={!file || !title || !material || analyzing}
            className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-medium"
            size="lg"
          >
            {analyzing ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Analisando desenho...
              </>
            ) : (
              <>
                <CheckCircle className="w-5 h-5 mr-2" />
                Analisar Desenho
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Results */}
      {result && (
        <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-400" />
              Resultado da Análise
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Features Identified */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-3">
                Recursos Identificados
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {result.features?.map((feature: any, idx: number) => (
                  <div
                    key={idx}
                    className="bg-slate-900/50 rounded-lg p-4 border border-slate-700"
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

            {/* Machining Plan */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-3">
                Plano de Usinagem
              </h3>
              <div className="space-y-3">
                {result.machining_plan?.operations?.map((op: any, idx: number) => (
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
                      <div className="flex-1 space-y-2">
                        <p className="font-medium text-white capitalize">
                          {op.operation}
                        </p>
                        <p className="text-sm text-slate-300">{op.description}</p>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-3">
                          <div className="bg-slate-800/50 rounded p-2">
                            <p className="text-xs text-slate-400">RPM</p>
                            <p className="text-sm font-medium text-white">
                              {op.cutting_parameters?.rpm}
                            </p>
                          </div>
                          <div className="bg-slate-800/50 rounded p-2">
                            <p className="text-xs text-slate-400">Avanço</p>
                            <p className="text-sm font-medium text-white">
                              {op.cutting_parameters?.feed_rate}
                            </p>
                          </div>
                          <div className="bg-slate-800/50 rounded p-2">
                            <p className="text-xs text-slate-400">ap</p>
                            <p className="text-sm font-medium text-white">
                              {op.cutting_parameters?.ap}
                            </p>
                          </div>
                          <div className="bg-slate-800/50 rounded p-2">
                            <p className="text-xs text-slate-400">ae</p>
                            <p className="text-sm font-medium text-white">
                              {op.cutting_parameters?.ae}
                            </p>
                          </div>
                        </div>

                        {op.tool_recommendation && (
                          <div className="bg-cyan-500/10 border border-cyan-500/30 rounded p-3 mt-2">
                            <p className="text-xs text-cyan-400 font-medium mb-1">
                              Ferramenta Recomendada
                            </p>
                            <p className="text-sm text-white">
                              {op.tool_recommendation.type} - Ø{op.tool_recommendation.diameter}mm
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {result.machining_plan?.recommendations && (
                <div className="mt-4 bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
                  <p className="text-sm font-medium text-blue-400 mb-2">
                    Recomendações
                  </p>
                  <ul className="text-sm text-slate-300 space-y-1">
                    {result.machining_plan.recommendations.map((rec: string, idx: number) => (
                      <li key={idx}>• {rec}</li>
                    ))}
                  </ul>
                </div>
              )}

              {result.machining_plan?.warnings && result.machining_plan.warnings.length > 0 && (
                <div className="mt-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
                  <p className="text-sm font-medium text-yellow-400 mb-2 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4" />
                    Avisos
                  </p>
                  <ul className="text-sm text-slate-300 space-y-1">
                    {result.machining_plan.warnings.map((warn: string, idx: number) => (
                      <li key={idx}>• {warn}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
