import { NextRequest, NextResponse } from "next/server";
import pdf from "pdf-parse";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json(
        { error: "Nenhum arquivo enviado." },
        { status: 400 }
      );
    }

    // Converter File para Buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Extrair texto do PDF
    const data = await pdf(buffer);

    return NextResponse.json({
      success: true,
      text: data.text,
      pages: data.numpages,
    });
  } catch (error: any) {
    console.error("Erro ao extrair PDF:", error);
    return NextResponse.json(
      { error: "Erro ao processar PDF", details: error.message },
      { status: 500 }
    );
  }
}
