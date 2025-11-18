import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { imageUrl, material, processType, userTools } = await request.json()

    if (!process.env.DEEPINFRA_API_KEY) {
      return NextResponse.json(
        { error: "DEEPINFRA_API_KEY não configurada." },
        { status: 500 }
      )
    }

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

    const userMessage = `Analise este desenho técnico e gere o plano de usinagem completo.

Imagem: ${imageUrl}

${systemPrompt}`

    const response = await fetch(
      "https://api.deepinfra.com/v1/openai/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.DEEPINFRA_API_KEY}`,
        },
        body: JSON.stringify({
          model: "meta-llama/Meta-Llama-3.1-70B-Instruct",
          messages: [
            {
              role: "system",
              content: "Você é um especialista em usinagem CNC. Sempre retorne respostas em formato JSON válido."
            },
            {
              role: "user",
              content: userMessage
            }
          ],
          max_tokens: 3000,
          temperature: 0.3,
          response_format: { type: "json_object" }
        }),
      }
    )

    const result = await response.json()

    if (result.error) {
      return NextResponse.json({ error: result.error }, { status: 500 })
    }

    const content = result.choices?.[0]?.message?.content || '{}'
    const parsedResult = JSON.parse(content)
    
    return NextResponse.json(parsedResult)
  } catch (error: any) {
    console.error('Erro na análise:', error)
    return NextResponse.json(
      { error: error.message || 'Erro ao analisar desenho' },
      { status: 500 }
    )
  }
}
