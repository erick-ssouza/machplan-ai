import fs from 'fs';
import path from 'path';

export default function handler(req, res) {
  try {
    const logFile = path.join(process.cwd(), 'server.log');
    if (!fs.existsSync(logFile)) {
      return res.status(200).json({ log: 'Nenhum log encontrado.' });
    }
    const content = fs.readFileSync(logFile, 'utf8');
    return res.status(200).json({ log: content });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
