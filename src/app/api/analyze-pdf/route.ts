import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
})

export async function POST(request: NextRequest) {
  try {
    const { pdfText, material, processType, userTools } = await request.json()

    const systemPrompt = `Você é um especialista em usinagem CNC. Analise o texto extraído do desenho técnico PDF e identifique todos os recursos de usinagem.

Material da peça: ${material}
Processo solicitado: ${processType === 'milling' ? 'Fresamento' : processType === 'turning' ? 'Torneamento' : 'Processo completo'}

Ferramentas disponíveis:
${JSON.stringify(userTools, null, 2)}

Retorne um JSON estruturado com features e machining_plan conforme o formato padrão.`

    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: systemPrompt
        },
        {
          role: 'user',
          content: `Texto do PDF:\n\n${pdfText}`
        }
      ],
      response_format: { type: 'json_object' },
      temperature: 0.3,
    })

    const result = JSON.parse(response.choices[0].message.content || '{}')
    
    return NextResponse.json(result)
  } catch (error: any) {
    console.error('Erro na análise PDF:', error)
    return NextResponse.json(
      { error: error.message || 'Erro ao analisar PDF' },
      { status: 500 }
    )
  }
}
