"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { MoreVertical, Edit2, Copy, Trash2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

interface Model {
  id: string;
  name: string;
  description?: string;
  created_at: string;
  updated_at: string;
}

interface ModelsResponse {
  models: Model[];
  total: number;
}

export default function MyModelsList() {
  const [deleteModelId, setDeleteModelId] = useState<string | null>(null);
  const [renameModelId, setRenameModelId] = useState<string | null>(null);
  const [newName, setNewName] = useState("");
  const queryClient = useQueryClient();

  // Query para buscar modelos
  const { data, isLoading, error } = useQuery<ModelsResponse>({
    queryKey: ["my-models"],
    queryFn: async () => {
      const response = await fetch("/api/my/models");
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || "Erro ao carregar modelos.");
      }
      return response.json();
    },
    retry: 2,
    refetchOnWindowFocus: false,
  });

  // Mutation para renomear modelo
  const renameMutation = useMutation({
    mutationFn: async ({ id, name }: { id: string; name: string }) => {
      const response = await fetch(`/api/my/models/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || "Erro ao renomear modelo.");
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my-models"] });
      toast.success("Modelo renomeado com sucesso!");
      setRenameModelId(null);
      setNewName("");
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  // Mutation para duplicar modelo
  const duplicateMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/my/models/${id}/duplicate`, {
        method: "POST",
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || "Erro ao duplicar modelo.");
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my-models"] });
      toast.success("Modelo duplicado com sucesso!");
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  // Mutation para excluir modelo
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/my/models/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || "Erro ao excluir modelo.");
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my-models"] });
      toast.success("Modelo excluído com sucesso!");
      setDeleteModelId(null);
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  const handleRename = (modelId: string, currentName: string) => {
    setRenameModelId(modelId);
    setNewName(currentName);
  };

  const handleDuplicate = (modelId: string) => {
    duplicateMutation.mutate(modelId);
  };

  const handleDelete = (modelId: string) => {
    setDeleteModelId(modelId);
  };

  const confirmRename = () => {
    if (renameModelId && newName.trim()) {
      renameMutation.mutate({ id: renameModelId, name: newName.trim() });
    }
  };

  const confirmDelete = () => {
    if (deleteModelId) {
      deleteMutation.mutate(deleteModelId);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 animate-spin text-cyan-500" />
          <p className="text-sm text-gray-500">Carregando modelos...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-4 text-center max-w-md">
          <div className="w-16 h-16 rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center">
            <span className="text-2xl">⚠️</span>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
              Erro ao carregar modelos
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {error instanceof Error ? error.message : "Erro desconhecido"}
            </p>
          </div>
          <Button
            onClick={() => queryClient.invalidateQueries({ queryKey: ["my-models"] })}
            className="mt-4"
          >
            Tentar novamente
          </Button>
        </div>
      </div>
    );
  }

  if (!data?.models || data.models.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-4 text-center max-w-md">
          <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
            <span className="text-2xl">📦</span>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
              Nenhum modelo encontrado
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Você ainda não criou nenhum modelo. Comece criando seu primeiro modelo!
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="models-container space-y-3">
        {data.models.map((model) => (
          <div
            key={model.id}
            className="model-item group relative flex items-center justify-between p-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-cyan-500 dark:hover:border-cyan-500 transition-all duration-200 hover:shadow-lg"
          >
            <div className="flex-1 min-w-0">
              <h4 className="text-base font-semibold text-gray-900 dark:text-gray-100 truncate">
                {model.name}
              </h4>
              {model.description && (
                <p className="text-sm text-gray-600 dark:text-gray-400 truncate mt-1">
                  {model.description}
                </p>
              )}
              <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">
                Criado em {new Date(model.created_at).toLocaleDateString("pt-BR")}
              </p>
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="more-options ml-4 opacity-0 group-hover:opacity-100 transition-opacity"
                  data-model-id={model.id}
                >
                  <MoreVertical className="w-5 h-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem
                  onClick={() => handleRename(model.id, model.name)}
                  className="cursor-pointer"
                >
                  <Edit2 className="w-4 h-4 mr-2" />
                  Renomear
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => handleDuplicate(model.id)}
                  className="cursor-pointer"
                  disabled={duplicateMutation.isPending}
                >
                  <Copy className="w-4 h-4 mr-2" />
                  Duplicar
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => handleDelete(model.id)}
                  className="cursor-pointer text-red-600 dark:text-red-400 focus:text-red-600 dark:focus:text-red-400"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Excluir
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        ))}
      </div>

      {/* Dialog de Renomear */}
      <AlertDialog open={!!renameModelId} onOpenChange={() => setRenameModelId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Renomear modelo</AlertDialogTitle>
            <AlertDialogDescription>
              Digite o novo nome para o modelo:
            </AlertDialogDescription>
          </AlertDialogHeader>
          <Input
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder="Nome do modelo"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                confirmRename();
              }
            }}
          />
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setRenameModelId(null)}>
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmRename}
              disabled={!newName.trim() || renameMutation.isPending}
            >
              {renameMutation.isPending ? "Renomeando..." : "Renomear"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Dialog de Confirmação de Exclusão */}
      <AlertDialog open={!!deleteModelId} onOpenChange={() => setDeleteModelId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir este modelo? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setDeleteModelId(null)}>
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              disabled={deleteMutation.isPending}
              className="bg-red-600 hover:bg-red-700"
            >
              {deleteMutation.isPending ? "Excluindo..." : "Excluir"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
