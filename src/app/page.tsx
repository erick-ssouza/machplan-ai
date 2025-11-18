"use client";

import { useState } from "react";
import { Upload, FileText, Loader2, CheckCircle, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [extractedText, setExtractedText] = useState("");
  const [material, setMaterial] = useState("Aço");
  const [process, setProcess] = useState("Fresamento");
  const [tools, setTools] = useState("Fresa de topo");
  const [analysis, setAnalysis] = useState("");
  const [loading, setLoading] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    if (selectedFile.type !== "application/pdf") {
      toast.error("Por favor, selecione um arquivo PDF");
      return;
    }

    setFile(selectedFile);
    toast.success("PDF carregado com sucesso!");

    // Extrair texto do PDF
    try {
      const formData = new FormData();
      formData.append("file", selectedFile);

      const response = await fetch("/api/extract-pdf", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      
      if (data.text) {
        setExtractedText(data.text);
        toast.success("Texto extraído com sucesso!");
      } else {
        toast.error("Erro ao extrair texto do PDF");
      }
    } catch (error) {
      console.error("Erro ao extrair PDF:", error);
      toast.error("Erro ao processar PDF");
    }
  };

  const handleAnalyze = async () => {
    if (!extractedText) {
      toast.error("Por favor, faça upload de um PDF primeiro");
      return;
    }

    setLoading(true);
    setAnalysis("");

    try {
      const response = await fetch("/api/analyze-pdf", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: extractedText,
          material,
          process,
          tools,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setAnalysis(data.output);
        toast.success("Análise concluída!");
      } else {
        toast.error(data.error || "Erro ao analisar PDF");
      }
    } catch (error) {
      console.error("Erro ao analisar:", error);
      toast.error("Erro ao processar análise");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12 pt-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-2xl mb-4 shadow-2xl shadow-cyan-500/50">
            <FileText className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-3 bg-clip-text text-transparent bg-gradient-to-r from-white to-cyan-200">
            Análise de PDF com IA
          </h1>
          <p className="text-slate-400 text-lg">
            Upload de PDF, extração de texto e análise jurídica com DeepInfra AI
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Coluna Esquerda - Upload e Configurações */}
          <div className="space-y-6">
            {/* Upload de PDF */}
            <Card className="bg-white/5 backdrop-blur-xl border-white/10 p-6">
              <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                <Upload className="w-5 h-5 text-cyan-400" />
                Upload de PDF
              </h2>

              <div className="border-2 border-dashed border-white/20 rounded-xl p-8 text-center hover:border-cyan-500/50 transition-all duration-300">
                <input
                  type="file"
                  accept="application/pdf"
                  onChange={handleFileChange}
                  className="hidden"
                  id="pdf-upload"
                />
                <label
                  htmlFor="pdf-upload"
                  className="cursor-pointer flex flex-col items-center gap-3"
                >
                  {file ? (
                    <>
                      <CheckCircle className="w-12 h-12 text-green-400" />
                      <div>
                        <p className="text-white font-semibold">{file.name}</p>
                        <p className="text-slate-400 text-sm mt-1">
                          {(file.size / 1024).toFixed(2)} KB
                        </p>
                      </div>
                    </>
                  ) : (
                    <>
                      <Upload className="w-12 h-12 text-slate-400" />
                      <div>
                        <p className="text-white font-semibold">
                          Clique para fazer upload
                        </p>
                        <p className="text-slate-400 text-sm mt-1">
                          Apenas arquivos PDF
                        </p>
                      </div>
                    </>
                  )}
                </label>
              </div>

              {extractedText && (
                <div className="mt-4 p-4 bg-white/5 rounded-lg border border-white/10">
                  <p className="text-sm text-slate-400 mb-2">Texto extraído:</p>
                  <p className="text-white text-sm line-clamp-3">
                    {extractedText.substring(0, 200)}...
                  </p>
                </div>
              )}
            </Card>

            {/* Configurações */}
            <Card className="bg-white/5 backdrop-blur-xl border-white/10 p-6">
              <h2 className="text-xl font-semibold text-white mb-4">
                Configurações da Análise
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="text-sm text-slate-400 mb-2 block">
                    Material
                  </label>
                  <input
                    type="text"
                    value={material}
                    onChange={(e) => setMaterial(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:border-cyan-500 focus:outline-none"
                    placeholder="Ex: Contrato, Petição, etc."
                  />
                </div>

                <div>
                  <label className="text-sm text-slate-400 mb-2 block">
                    Processo
                  </label>
                  <input
                    type="text"
                    value={process}
                    onChange={(e) => setProcess(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:border-cyan-500 focus:outline-none"
                    placeholder="Ex: Cível, Trabalhista, etc."
                  />
                </div>

                <div>
                  <label className="text-sm text-slate-400 mb-2 block">
                    Ferramentas
                  </label>
                  <input
                    type="text"
                    value={tools}
                    onChange={(e) => setTools(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:border-cyan-500 focus:outline-none"
                    placeholder="Ex: Análise completa, Resumo, etc."
                  />
                </div>
              </div>

              <Button
                onClick={handleAnalyze}
                disabled={!extractedText || loading}
                className="w-full mt-6 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-semibold py-3 rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Analisando...
                  </>
                ) : (
                  <>
                    <FileText className="w-5 h-5 mr-2" />
                    Analisar PDF
                  </>
                )}
              </Button>
            </Card>
          </div>

          {/* Coluna Direita - Resultado */}
          <Card className="bg-white/5 backdrop-blur-xl border-white/10 p-6">
            <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-cyan-400" />
              Resultado da Análise
            </h2>

            {loading ? (
              <div className="flex flex-col items-center justify-center h-96">
                <Loader2 className="w-12 h-12 animate-spin text-cyan-400 mb-4" />
                <p className="text-slate-400">Processando análise com IA...</p>
              </div>
            ) : analysis ? (
              <div className="bg-white/5 rounded-lg p-6 border border-white/10 h-96 overflow-y-auto">
                <pre className="text-white text-sm whitespace-pre-wrap font-mono">
                  {analysis}
                </pre>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-96 text-center">
                <FileText className="w-16 h-16 text-slate-600 mb-4" />
                <p className="text-slate-400 text-lg mb-2">
                  Nenhuma análise ainda
                </p>
                <p className="text-slate-500 text-sm">
                  Faça upload de um PDF e clique em "Analisar PDF"
                </p>
              </div>
            )}
          </Card>
        </div>

        {/* Link para página de teste */}
        <div className="mt-8 text-center">
          <a
            href="/test-api"
            className="text-cyan-400 hover:text-cyan-300 text-sm underline"
          >
            Ir para página de teste da API →
          </a>
        </div>
      </div>
    </div>
  );
}
