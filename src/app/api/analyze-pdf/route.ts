import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { text, material, process, tools } = body;

    if (!process.env.DEEPINFRA_API_KEY) {
      return NextResponse.json(
        { error: "DEEPINFRA_API_KEY não configurada." },
        { status: 500 }
      );
    }

    const prompt = `
Você é um sistema de análise jurídica. 
Texto do PDF: ${text}
Material: ${material}
Processo: ${process}
Ferramentas: ${tools}
Gere uma análise completa e organizada.
`;

    const response = await fetch("https://api.deepinfra.com/v1/openai/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + process.env.DEEPINFRA_API_KEY,
      },
      body: JSON.stringify({
        model: "meta-llama/Meta-Llama-3.1-70B-Instruct",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.2,
        max_tokens: 1500,
      }),
    });

    const result = await response.json();

    return NextResponse.json({
      success: true,
      output: result?.choices?.[0]?.message?.content || "",
      raw: result,
    });

  } catch (error: any) {
    return NextResponse.json(
      { error: error.message, details: error },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({ ok: true, message: "API ativa." });
}
