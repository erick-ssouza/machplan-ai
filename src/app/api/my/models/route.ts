import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();

    // Verificar autenticação
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: "Não autorizado. Faça login para continuar." },
        { status: 401 }
      );
    }

    // Buscar modelos do usuário
    const { data: models, error: modelsError } = await supabase
      .from("models")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (modelsError) {
      console.error("Erro ao buscar modelos:", modelsError);
      return NextResponse.json(
        { error: "Erro ao buscar modelos no banco de dados." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      models: models || [],
      total: models?.length || 0,
    });
  } catch (error) {
    console.error("Erro no endpoint /api/my/models:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor." },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();

    // Verificar autenticação
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: "Não autorizado. Faça login para continuar." },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { name, description } = body;

    if (!name || typeof name !== "string" || name.trim().length === 0) {
      return NextResponse.json(
        { error: "Nome do modelo é obrigatório." },
        { status: 400 }
      );
    }

    // Criar novo modelo
    const { data: newModel, error: createError } = await supabase
      .from("models")
      .insert({
        user_id: user.id,
        name: name.trim(),
        description: description?.trim() || null,
      })
      .select()
      .single();

    if (createError) {
      console.error("Erro ao criar modelo:", createError);
      return NextResponse.json(
        { error: "Erro ao criar modelo no banco de dados." },
        { status: 500 }
      );
    }

    return NextResponse.json(newModel, { status: 201 });
  } catch (error) {
    console.error("Erro no endpoint POST /api/my/models:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor." },
      { status: 500 }
    );
  }
}
