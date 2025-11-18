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

    // Logs antes da chamada
    console.log("Deepinfra key loaded:", !!process.env.DEEPINFRA_API_KEY);
    console.log("Model: meta-llama/Meta-Llama-3.1-70B-Instruct");
    console.log("Calling Deepinfra...");

    const prompt = `
Você é um sistema de análise jurídica. Abaixo estão os dados extraídos de um PDF:
Texto do PDF: ${text}
Material: ${material}
Tipo de Processo: ${process}
Ferramentas do usuário: ${tools}

Gere uma análise completa e organizada, com linguagem clara e objetiva.
    `;

    try {
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
            messages: [{ role: "user", content: prompt }],
            max_tokens: 1500,
            temperature: 0.2,
          }),
        }
      );

      const result = await response.json();

      if (result.error) {
        return NextResponse.json({ 
          success: false,
          error: result.error,
          details: result
        }, { status: 500 });
      }

      return NextResponse.json({
        success: true,
        output: result.choices?.[0]?.message?.content || "",
      });
    } catch (error: any) {
      console.error("Erro na chamada DeepInfra:", error);
      return NextResponse.json({
        success: false,
        error: error.message,
        details: error
      }, { status: 500 });
    }
  } catch (error: any) {
    return NextResponse.json(
      { 
        success: false,
        error: error.message || "Erro ao analisar PDF",
        details: error
      },
      { status: 500 }
    );
  }
}

// Rota GET para teste simples
export async function GET() {
  try {
    if (!process.env.DEEPINFRA_API_KEY) {
      return NextResponse.json(
        { 
          success: false,
          error: "DEEPINFRA_API_KEY não configurada." 
        },
        { status: 500 }
      );
    }

    console.log("Teste de conexão - Deepinfra key loaded:", !!process.env.DEEPINFRA_API_KEY);
    console.log("Teste de conexão - Model: meta-llama/Meta-Llama-3.1-70B-Instruct");
    console.log("Teste de conexão - Calling Deepinfra...");

    try {
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
            messages: [{ role: "user", content: "Teste de conexão com a DeepInfra" }],
            max_tokens: 100,
            temperature: 0.2,
          }),
        }
      );

      const result = await response.json();

      if (result.error) {
        return NextResponse.json({ 
          success: false,
          error: result.error,
          details: result
        }, { status: 500 });
      }

      return NextResponse.json({
        success: true,
        message: "Conexão com DeepInfra estabelecida com sucesso!",
        testResponse: result.choices?.[0]?.message?.content || "",
        model: "meta-llama/Meta-Llama-3.1-70B-Instruct"
      });
    } catch (error: any) {
      console.error("Erro no teste de conexão DeepInfra:", error);
      return NextResponse.json({
        success: false,
        error: error.message,
        details: error
      }, { status: 500 });
    }
  } catch (error: any) {
    return NextResponse.json(
      { 
        success: false,
        error: error.message || "Erro no teste de conexão",
        details: error
      },
      { status: 500 }
    );
  }
}
