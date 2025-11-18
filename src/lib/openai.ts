// Cliente para chamadas à API de análise
// Todas as operações OpenAI são executadas server-side via API Routes

export async function analyzeDrawing(imageUrl: string, material: string, processType: string, userTools: any[]) {
  const response = await fetch('/api/analyze', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      imageUrl,
      material,
      processType,
      userTools,
    }),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || 'Erro ao analisar desenho')
  }

  return response.json()
}

export async function analyzePDF(pdfText: string, material: string, processType: string, userTools: any[]) {
  const response = await fetch('/api/analyze-pdf', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      pdfText,
      material,
      processType,
      userTools,
    }),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || 'Erro ao analisar PDF')
  }

  return response.json()
}
