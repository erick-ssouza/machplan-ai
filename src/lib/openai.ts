import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY!,
})

export async function analyzeDrawing(imageUrl: string, material: string, processType: string, userTools: any[]) {
  const systemPrompt = `Você é um especialista em usinagem CNC com décadas de experiência. Analise o desenho técnico fornecido e identifique todos os recursos de usinagem presentes.

Identifique:
- Furos (diâmetro, profundidade, tolerâncias)
- Rasgos (dimensões, tolerâncias)
- Rebaixos (dimensões, profundidade)
- Cavidades (geometria, profundidade)
- Superfícies a facear (dimensões, acabamento)
- Tolerâncias dimensionais e geométricas
- Simbologia técnica (rugosidade, paralelismo, perpendicularidade, etc.)

Material da peça: ${material}
Processo solicitado: ${processType === 'milling' ? 'Fresamento' : processType === 'turning' ? 'Torneamento' : 'Processo completo'}

Ferramentas disponíveis do cliente:
${JSON.stringify(userTools, null, 2)}

Retorne um JSON estruturado com:
{
  "features": [
    {
      "type": "hole|slot|pocket|face|chamfer|thread",
      "dimensions": {},
      "tolerances": [],
      "location": {},
      "notes": ""
    }
  ],
  "machining_plan": {
    "operations": [
      {
        "sequence": 1,
        "operation": "facing|drilling|milling|turning|boring",
        "description": "",
        "tool_recommendation": {
          "type": "",
          "diameter": 0,
          "material": "",
          "available_tool_id": "" // ID da ferramenta do cliente, se disponível
        },
        "cutting_parameters": {
          "rpm": 0,
          "feed_rate": 0,
          "depth_of_cut": 0,
          "ap": 0,
          "ae": 0,
          "cutting_speed": 0
        },
        "estimated_time": ""
      }
    ],
    "total_estimated_time": "",
    "recommendations": [],
    "warnings": []
  }
}`

  const response = await openai.chat.completions.create({
    model: 'gpt-4o',
    messages: [
      {
        role: 'system',
        content: systemPrompt
      },
      {
        role: 'user',
        content: [
          {
            type: 'text',
            text: 'Analise este desenho técnico e gere o plano de usinagem completo.'
          },
          {
            type: 'image_url',
            image_url: {
              url: imageUrl
            }
          }
        ]
      }
    ],
    response_format: { type: 'json_object' },
    temperature: 0.3,
  })

  return JSON.parse(response.choices[0].message.content || '{}')
}

export async function analyzePDF(pdfText: string, material: string, processType: string, userTools: any[]) {
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

  return JSON.parse(response.choices[0].message.content || '{}')
}
