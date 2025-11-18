import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  try {
    const logFile = path.join(process.cwd(), 'server.log');
    
    // Verificar se o arquivo existe
    if (!fs.existsSync(logFile)) {
      return NextResponse.json({ 
        log: "Nenhum log encontrado." 
      });
    }
    
    // Ler o conteúdo do arquivo
    const content = fs.readFileSync(logFile, 'utf8');
    
    return NextResponse.json({ 
      log: content || "Arquivo de log vazio." 
    });
  } catch (error: any) {
    return NextResponse.json({ 
      error: error.message,
      log: "Erro ao ler arquivo de log." 
    }, { 
      status: 500 
    });
  }
}
