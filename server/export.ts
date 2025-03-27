import { storage } from "./storage";
import fs from "fs";
import path from "path";

/**
 * Script para exportar análises de sentimento para um arquivo CSV
 * 
 * Pode ser executado com:
 * npx tsx server/export.ts
 */
async function exportToCsv() {
  try {
    console.log("Exportando análises de sentimento para CSV...");
    
    // Obter todas as análises
    const analyses = await storage.getSentimentAnalyses();
    
    if (analyses.length === 0) {
      console.log("Nenhuma análise encontrada para exportar.");
      return;
    }
    
    // Criar cabeçalho CSV
    const header = ["ID", "Texto", "Sentimento", "Confiança (%)", "Data"];
    
    // Formatar cada linha de dados
    const rows = analyses.map(analysis => [
      analysis.id,
      `"${analysis.text.replace(/"/g, '""')}"`, // Escapar aspas duplas
      analysis.sentiment,
      analysis.confidence,
      new Date(analysis.createdAt).toLocaleString()
    ]);
    
    // Combinar cabeçalho e linhas
    const csvContent = [
      header.join(","),
      ...rows.map(row => row.join(","))
    ].join("\n");
    
    // Garantir que a pasta data existe
    const dataDir = path.join(process.cwd(), 'data');
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
    
    // Definir nome do arquivo com data atual
    const fileName = `analises_sentimento_${new Date().toISOString().slice(0, 10)}.csv`;
    const filePath = path.join(dataDir, fileName);
    
    // Escrever no arquivo
    fs.writeFileSync(filePath, csvContent, "utf8");
    
    console.log(`Exportação concluída com sucesso! Arquivo salvo em: ${filePath}`);
    console.log(`Total de ${analyses.length} análises exportadas.`);
    
  } catch (error) {
    console.error("Erro ao exportar análises:", error);
  }
}

// Executar a função principal se o script for chamado diretamente
if (require.main === module) {
  exportToCsv();
}

export { exportToCsv };