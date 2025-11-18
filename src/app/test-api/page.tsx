'use client';

import { useState } from 'react';

export default function TestApiPage() {
  const [response, setResponse] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const testPostRequest = async () => {
    setLoading(true);
    setError(null);
    setResponse(null);

    try {
      const res = await fetch('/api/analyze-pdf', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: 'teste',
          material: 'qualquer',
          process: 'teste',
          tools: 'nenhuma',
        }),
      });

      const data = await res.json();
      setResponse(data);
    } catch (err: any) {
      setError(err.message || 'Erro desconhecido');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-8">
          🧪 Teste da API DeepInfra
        </h1>

        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 mb-6">
          <h2 className="text-2xl font-semibold text-white mb-4">
            POST /api/analyze-pdf
          </h2>
          <p className="text-gray-300 mb-4">
            Envia uma requisição POST com o seguinte body:
          </p>
          <pre className="bg-black/30 text-green-400 p-4 rounded-lg mb-4 overflow-x-auto">
            {JSON.stringify(
              {
                text: 'teste',
                material: 'qualquer',
                process: 'teste',
                tools: 'nenhuma',
              },
              null,
              2
            )}
          </pre>

          <button
            onClick={testPostRequest}
            disabled={loading}
            className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? '⏳ Enviando...' : '🚀 Enviar POST Request'}
          </button>
        </div>

        {error && (
          <div className="bg-red-500/20 border border-red-500 rounded-2xl p-6 mb-6">
            <h3 className="text-xl font-semibold text-red-300 mb-2">
              ❌ Erro
            </h3>
            <p className="text-red-200">{error}</p>
          </div>
        )}

        {response && (
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
            <h3 className="text-2xl font-semibold text-white mb-4">
              📦 Resposta Completa (JSON)
            </h3>
            <pre className="bg-black/30 text-green-400 p-4 rounded-lg overflow-x-auto max-h-96 overflow-y-auto">
              {JSON.stringify(response, null, 2)}
            </pre>

            {response.success === false && (
              <div className="mt-4 p-4 bg-red-500/20 border border-red-500 rounded-lg">
                <h4 className="text-lg font-semibold text-red-300 mb-2">
                  🔍 Detalhes do Erro
                </h4>
                <p className="text-red-200">
                  <strong>Error:</strong> {response.error}
                </p>
                {response.details && (
                  <pre className="mt-2 text-red-200 text-sm">
                    {JSON.stringify(response.details, null, 2)}
                  </pre>
                )}
              </div>
            )}

            {response.success === true && (
              <div className="mt-4 p-4 bg-green-500/20 border border-green-500 rounded-lg">
                <h4 className="text-lg font-semibold text-green-300 mb-2">
                  ✅ Sucesso
                </h4>
                <p className="text-green-200">
                  A requisição foi processada com sucesso!
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
