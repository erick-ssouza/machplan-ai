"use client";
import { useState } from "react";

export default function TestAPI() {
  const [responseData, setResponseData] = useState<any>(null);

  async function testPost() {
    const res = await fetch("/api/analyze-pdf", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        text: "Texto de teste",
        material: "Contrato",
        process: "Cível",
        tools: "Nenhuma",
      }),
    });

    const json = await res.json();
    setResponseData(json);
  }

  return (
    <div style={{ padding: 20 }}>
      <h1>Teste do Backend</h1>
      <button
        onClick={testPost}
        style={{ padding: 10, background: "black", color: "white" }}
      >
        Enviar POST
      </button>

      <pre style={{ marginTop: 20 }}>
        {responseData ? JSON.stringify(responseData, null, 2) : "Sem resposta ainda"}
      </pre>
    </div>
  );
}
