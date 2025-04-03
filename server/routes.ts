import type { Express } from "express";
import { createServer, type Server } from "http";
import { WebSocketServer, WebSocket } from "ws";
import { storage } from "./storage";
import { analyzeSentiment } from "./services/ai";
import { z } from "zod";
import { SentimentType, analysisFormSchema } from "@shared/schema";
import PDFDocument from "pdfkit";

export async function registerRoutes(app: Express): Promise<Server> {
  // API para análise de sentimento
  app.post("/api/analyze", async (req, res) => {
    try {
      // Validação com zod
      const validation = analysisFormSchema.safeParse(req.body);
      
      if (!validation.success) {
        return res.status(400).json({ 
          message: "Texto inválido", 
          errors: validation.error.errors 
        });
      }
      
      const { text } = validation.data;
      
      // Analisar o sentimento usando o serviço de IA (Gemini/OpenAI)
      const analysis = await analyzeSentiment(text);
      
      // Mapear o resultado para o formato de armazenamento
      const sentimentResult = {
        text,
        sentiment: analysis.sentiment,
        confidence: analysis.confidence
      };
      
      // Salvar no armazenamento e obter o resultado completo
      const savedAnalysis = await storage.saveSentimentAnalysis(sentimentResult);
      
      // Notificar todos os clientes conectados sobre a nova análise
      if ((global as any).notifyNewAnalysis) {
        (global as any).notifyNewAnalysis();
      }
      
      // Retornar o resultado
      return res.status(201).json({
        id: savedAnalysis.id,
        text: savedAnalysis.text,
        sentiment: savedAnalysis.sentiment,
        confidence: savedAnalysis.confidence,
        createdAt: savedAnalysis.createdAt
      });
      
    } catch (error) {
      console.error("Erro na análise de sentimento:", error);
      return res.status(500).json({ 
        message: "Erro ao processar a análise de sentimento", 
        error: (error as Error).message 
      });
    }
  });



  // API para receber textos de aplicações Spring Boot foi movida para spring-integration.ts

  // API para obter todas as análises com filtros
  app.get("/api/analyses", async (req, res) => {
    try {
      // Parâmetros de filtro
      const showPositive = req.query.positive !== "false";
      const showNegative = req.query.negative !== "false";
      const showNeutral = req.query.neutral !== "false";
      const period = (req.query.period as string) || "all";
      
      // Validar período
      const validPeriods = ["all", "today", "week", "month"];
      if (!validPeriods.includes(period)) {
        return res.status(400).json({ message: "Período inválido" });
      }
      
      // Obter análises filtradas
      const analyses = await storage.getFilteredSentimentAnalyses(
        { positive: showPositive, negative: showNegative, neutral: showNeutral },
        period as "all" | "today" | "week" | "month"
      );
      
      return res.json(analyses);
    } catch (error) {
      console.error("Erro ao buscar análises:", error);
      return res.status(500).json({ 
        message: "Erro ao buscar análises", 
        error: (error as Error).message 
      });
    }
  });

  // API para obter estatísticas
  app.get("/api/stats", async (req, res) => {
    try {
      const stats = await storage.getSentimentStats();
      return res.json(stats);
    } catch (error) {
      console.error("Erro ao buscar estatísticas:", error);
      return res.status(500).json({ 
        message: "Erro ao buscar estatísticas", 
        error: (error as Error).message 
      });
    }
  });
  
  // API para exportar análises em CSV
  app.get("/api/export/csv", async (req, res) => {
    try {
      // Obter todas as análises
      const analyses = await storage.getSentimentAnalyses();
      
      if (analyses.length === 0) {
        return res.status(404).json({ message: "Nenhuma análise encontrada para exportar" });
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
      
      // Definir nome do arquivo com data atual
      const fileName = `analises_sentimento_${new Date().toISOString().slice(0, 10)}.csv`;
      
      // Configurar cabeçalhos para download
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', `attachment; filename=${fileName}`);
      
      return res.send(csvContent);
    } catch (error) {
      console.error("Erro ao exportar análises:", error);
      return res.status(500).json({ 
        message: "Erro ao exportar análises", 
        error: (error as Error).message 
      });
    }
  });

  // API para obter uma análise específica
  app.get("/api/analyses/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      
      if (isNaN(id)) {
        return res.status(400).json({ message: "ID inválido" });
      }
      
      const analysis = await storage.getSentimentAnalysisById(id);
      
      if (!analysis) {
        return res.status(404).json({ message: "Análise não encontrada" });
      }
      
      return res.json(analysis);
    } catch (error) {
      console.error("Erro ao buscar análise:", error);
      return res.status(500).json({ 
        message: "Erro ao buscar análise", 
        error: (error as Error).message 
      });
    }
  });

  // API para exportar análises em PDF
  app.get("/api/export/pdf", async (req, res) => {
    try {
      // Obter todas as análises
      const analyses = await storage.getSentimentAnalyses();
      
      if (analyses.length === 0) {
        return res.status(404).json({ message: "Nenhuma análise encontrada para exportar" });
      }
      
      // Criar um documento PDF
      const doc = new PDFDocument({
        margin: 50,
        size: 'A4',
      });
      
      // Configurar cabeçalhos para download
      const fileName = `analises_sentimento_${new Date().toISOString().slice(0, 10)}.pdf`;
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename=${fileName}`);
      
      // Pipe o PDF para a resposta HTTP
      doc.pipe(res);
      
      // Configurações de estilo
      const titleFont = 'Helvetica-Bold';
      const regularFont = 'Helvetica';
      const tableTop = 150;
      const lineHeight = 30; // Aumentado para dar mais espaço entre linhas
      const textX = 40;
      const cellPadding = 8; // Aumentado para dar mais espaço ao redor do texto
      const pageWidth = doc.page.width - 80; // Reduzido margem para mais espaço
      const columns = {
        id: { 
          x: textX, 
          width: pageWidth * 0.08, 
          title: 'ID',
          align: 'left'
        },
        text: { 
          x: textX + pageWidth * 0.08, 
          width: pageWidth * 0.47, 
          title: 'Texto',
          align: 'left'
        },
        sentiment: { 
          x: textX + pageWidth * 0.55, 
          width: pageWidth * 0.15, 
          title: 'Sentimento',
          align: 'center'
        },
        confidence: { 
          x: textX + pageWidth * 0.7, 
          width: pageWidth * 0.12, 
          title: 'Confiança',
          align: 'center'
        },
        date: { 
          x: textX + pageWidth * 0.82, 
          width: pageWidth * 0.18, 
          title: 'Data',
          align: 'right'
        },
      };

      // Adicionar cabeçalho
      doc.font(titleFont)
         .fontSize(24)
         .fillColor('#1f8a58')
         .text('EcoBit - Análise de Sentimentos', { align: 'center' });

      // Adicionar subtítulo
      doc.moveDown()
         .fontSize(14)
         .fillColor('#666')
         .text('Relatório de Análises', { align: 'center' });
         
      // Adicionar informações do relatório
      const dataAtual = new Date().toLocaleDateString('pt-BR');
      const horaAtual = new Date().toLocaleTimeString('pt-BR');
      
      doc.moveDown(0.5)
         .font(regularFont)
         .fontSize(10)
         .fillColor('#666666')
         .text(`Data: ${dataAtual}`, textX, doc.y, { align: 'left', continued: true })
         .text(`Hora: ${horaAtual}`, { align: 'right' })
         .text(`Total de registros: ${analyses.length}`, textX, doc.y + 15, { align: 'left' })
         .moveDown(1.5);

      // Espaçamento adicional antes da tabela
      doc.moveDown();
      
      // Adicionar linha de estatísticas
      doc.moveDown(2)
         .fontSize(12)
         .fillColor('#333');
      
      // Calcular estatísticas
      const positiveCount = analyses.filter(a => a.sentiment === 'positive').length;
      const negativeCount = analyses.filter(a => a.sentiment === 'negative').length;
      const neutralCount = analyses.filter(a => a.sentiment === 'neutral').length;
      
      doc.text(`Total de análises: ${analyses.length} | Positivas: ${positiveCount} | Negativas: ${negativeCount} | Neutras: ${neutralCount}`, { align: 'center' });

      // Desenhar cabeçalho da tabela
      doc.moveDown(2)
         .font(titleFont)
         .fontSize(12)
         .fillColor('#ffffff');
      
      // Desenhar retângulo de fundo para o cabeçalho da tabela
      doc.rect(textX - cellPadding, 
               tableTop - cellPadding, 
               pageWidth + (cellPadding * 2), 
               lineHeight + (cellPadding * 2))
         .fill('#2E7D32'); // Verde mais escuro para melhor contraste
      
      // Desenhar textos do cabeçalho
      doc.fillColor('#ffffff')
         .fontSize(12);
      Object.values(columns).forEach(column => {
        doc.text(
          column.title, 
          column.x, 
          tableTop + 8, // Posicionamento melhorado
          { width: column.width, align: column.align as any }
        );
      });
      
      // Desenhar linhas da tabela
      doc.font(regularFont).fillColor('#000000');
      
      let y = tableTop + lineHeight + cellPadding;
      
      // Desenhar cada linha com dados
      analyses.forEach((analysis, i) => {
        // Verificar se é necessário adicionar uma nova página
        if (y > doc.page.height - 100) {
          doc.addPage();
          // Resetar a posição Y para o topo da nova página
          y = 100;
          
          // Desenhar cabeçalho da tabela na nova página
          doc.font(titleFont)
             .fontSize(12)
             .fillColor('#ffffff');
          
          doc.rect(textX - cellPadding, 
                  y - cellPadding, 
                  pageWidth + (cellPadding * 2), 
                  lineHeight + (cellPadding * 2))
             .fill('#2E7D32'); // Verde mais escuro para melhor contraste
          
          // Desenhar textos do cabeçalho
          doc.fillColor('#ffffff')
             .fontSize(12);
          Object.values(columns).forEach(column => {
            doc.text(
              column.title, 
              column.x, 
              y + 8, // Posicionamento melhorado
              { width: column.width, align: column.align as any }
            );
          });
          
          doc.font(regularFont).fillColor('#000000');
          y += lineHeight + cellPadding;
        }
        
        // Cor de fundo alternada para as linhas (claro/escuro)
        const rowColor = i % 2 === 0 ? '#f5f5f5' : '#ffffff';
        doc.rect(textX - cellPadding, 
                y - cellPadding, 
                pageWidth + (cellPadding * 2), 
                lineHeight + (cellPadding * 2))
           .fill(rowColor);
        
        // Definir o texto de cada coluna
        // ID
        doc.fillColor('#000000')
           .font(regularFont)
           .fontSize(11)
           .text(
             analysis.id.toString(), 
             columns.id.x, 
             y + 8, 
             { width: columns.id.width, align: columns.id.align as any }
           );
        
        // Texto (truncado para caber na célula)
        const truncatedText = analysis.text.length > 80 
          ? analysis.text.substring(0, 80) + '...' 
          : analysis.text;
          
        // Garantir que o texto seja exibido em preto
        doc.fillColor('#000000')
           .font(regularFont)
           .fontSize(11)
           .text(
             truncatedText, 
             columns.text.x, 
             y + 8, 
             { width: columns.text.width, align: columns.text.align as any }
           );
        
        // Sentimento (com cores)
        let sentimentText = '';
        let sentimentColor = '#000000';
        
        switch (analysis.sentiment) {
          case 'positive':
            sentimentText = 'Positivo';
            sentimentColor = '#389e6d';
            break;
          case 'negative':
            sentimentText = 'Negativo';
            sentimentColor = '#e53935';
            break;
          case 'neutral':
            sentimentText = 'Neutro';
            sentimentColor = '#757575';
            break;
        }
        
        doc.fillColor(sentimentColor)
           .fontSize(11)
           .text(
             sentimentText, 
             columns.sentiment.x, 
             y + 8, 
             { width: columns.sentiment.width, align: columns.sentiment.align as any }
           )
           .fillColor('#000000');
        
        // Confiança
        doc.fillColor('#000000')
           .fontSize(11)
           .text(
             `${Math.round(analysis.confidence * 100)}%`, 
             columns.confidence.x, 
             y + 8, 
             { width: columns.confidence.width, align: columns.confidence.align as any }
           );
        
        // Data
        const date = new Date(analysis.createdAt).toLocaleDateString('pt-BR');
        doc.fillColor('#000000')
           .fontSize(11)
           .text(
             date, 
             columns.date.x, 
             y + 8, 
             { width: columns.date.width, align: columns.date.align as any }
           );
        
        // Incrementar a posição Y para a próxima linha
        y += lineHeight + (cellPadding * 2);
      });
      
      // Garantir que haja pelo menos 70 pontos de espaço antes do rodapé
      // Se a posição atual Y estiver muito próxima do final da página, adiciona uma nova página
      if (y > doc.page.height - 100) {
        doc.addPage();
        y = 100;
      } else {
        // Se não for necessário uma nova página, adiciona espaço entre a última linha da tabela e o rodapé
        y += 50;
      }
      
      // Adicionar uma linha separadora
      doc.strokeColor('#cccccc')
         .lineWidth(0.5)
         .moveTo(textX, doc.page.height - 70)
         .lineTo(textX + pageWidth, doc.page.height - 70)
         .stroke();
      
      // Adicionar rodapé
      doc.fontSize(9)
         .fillColor('#666')
         .text(
          `EcoBit - Análise de Sentimentos | Relatório gerado em ${new Date().toLocaleString('pt-BR')}`,
          textX,
          doc.page.height - 50,
          { width: pageWidth, align: 'center' }
         );

      // Finalizar o documento
      doc.end();
      
    } catch (error) {
      console.error("Erro ao exportar PDF:", error);
      return res.status(500).json({ 
        message: "Erro ao exportar PDF", 
        error: (error as Error).message 
      });
    }
  });

  const httpServer = createServer(app);
  
  // Configurar WebSocket Server para atualizações em tempo real
  const wss = new WebSocketServer({ server: httpServer, path: '/ws' });
  
  // Armazenar conexões ativas
  const clients = new Set<WebSocket>();
  
  wss.on('connection', (ws) => {
    console.log('Nova conexão WebSocket estabelecida');
    
    // Adicionar nova conexão ao conjunto
    clients.add(ws);
    
    // Remover conexão quando fechada
    ws.on('close', () => {
      console.log('Conexão WebSocket fechada');
      clients.delete(ws);
    });
    
    // Enviar mensagem inicial
    ws.send(JSON.stringify({ type: 'connected', message: 'Conectado ao servidor WebSocket' }));
  });
  
  // Função para notificar todos os clientes sobre novas análises
  const notifyNewAnalysis = () => {
    clients.forEach(client => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify({ 
          type: 'newAnalysis', 
          message: 'Nova análise de sentimento registrada' 
        }));
      }
    });
  };
  
  // Adicionar função ao objeto global para acesso de outros arquivos
  (global as any).notifyNewAnalysis = notifyNewAnalysis;
  
  return httpServer;
}
