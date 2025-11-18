import fs from 'fs';
import path from 'path';

export async function GET() {
  try {
    const logFilePath = path.join(process.cwd(), 'server.log');
    
    if (!fs.existsSync(logFilePath)) {
      return new Response(
        JSON.stringify({ log: "Nenhum log encontrado." }),
        {
          status: 200,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }
    
    const logContent = fs.readFileSync(logFilePath, 'utf8');
    
    return new Response(
      JSON.stringify({ log: logContent }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ log: "Erro ao ler o arquivo de log.", error: error.message }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}
