import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    // Buscar modelo original
    const { data: originalModel, error: fetchError } = await supabase
      .from("models")
      .select("*")
      .eq("id", params.id)
      .eq("user_id", user.id)
      .single();

    if (fetchError || !originalModel) {
      return NextResponse.json(
        { error: "Modelo não encontrado ou você não tem permissão." },
        { status: 404 }
      );
    }

    // Criar cópia do modelo
    const { data: duplicatedModel, error: duplicateError } = await supabase
      .from("models")
      .insert({
        user_id: user.id,
        name: `${originalModel.name} (cópia)`,
        description: originalModel.description,
      })
      .select()
      .single();

    if (duplicateError) {
      console.error("Erro ao duplicar modelo:", duplicateError);
      return NextResponse.json(
        { error: "Erro ao duplicar modelo no banco de dados." },
        { status: 500 }
      );
    }

    return NextResponse.json(duplicatedModel, { status: 201 });
  } catch (error) {
    console.error("Erro no endpoint POST /api/my/models/[id]/duplicate:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor." },
      { status: 500 }
    );
  }
}
