import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function PATCH(
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

    const body = await request.json();
    const { name, description } = body;

    if (!name || typeof name !== "string" || name.trim().length === 0) {
      return NextResponse.json(
        { error: "Nome do modelo é obrigatório." },
        { status: 400 }
      );
    }

    // Verificar se o modelo pertence ao usuário
    const { data: existingModel, error: checkError } = await supabase
      .from("models")
      .select("id")
      .eq("id", params.id)
      .eq("user_id", user.id)
      .single();

    if (checkError || !existingModel) {
      return NextResponse.json(
        { error: "Modelo não encontrado ou você não tem permissão." },
        { status: 404 }
      );
    }

    // Atualizar modelo
    const { data: updatedModel, error: updateError } = await supabase
      .from("models")
      .update({
        name: name.trim(),
        description: description?.trim() || null,
        updated_at: new Date().toISOString(),
      })
      .eq("id", params.id)
      .eq("user_id", user.id)
      .select()
      .single();

    if (updateError) {
      console.error("Erro ao atualizar modelo:", updateError);
      return NextResponse.json(
        { error: "Erro ao atualizar modelo no banco de dados." },
        { status: 500 }
      );
    }

    return NextResponse.json(updatedModel);
  } catch (error) {
    console.error("Erro no endpoint PATCH /api/my/models/[id]:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor." },
      { status: 500 }
    );
  }
}

export async function DELETE(
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

    // Verificar se o modelo pertence ao usuário
    const { data: existingModel, error: checkError } = await supabase
      .from("models")
      .select("id")
      .eq("id", params.id)
      .eq("user_id", user.id)
      .single();

    if (checkError || !existingModel) {
      return NextResponse.json(
        { error: "Modelo não encontrado ou você não tem permissão." },
        { status: 404 }
      );
    }

    // Excluir modelo
    const { error: deleteError } = await supabase
      .from("models")
      .delete()
      .eq("id", params.id)
      .eq("user_id", user.id);

    if (deleteError) {
      console.error("Erro ao excluir modelo:", deleteError);
      return NextResponse.json(
        { error: "Erro ao excluir modelo no banco de dados." },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, message: "Modelo excluído com sucesso." });
  } catch (error) {
    console.error("Erro no endpoint DELETE /api/my/models/[id]:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor." },
      { status: 500 }
    );
  }
}
