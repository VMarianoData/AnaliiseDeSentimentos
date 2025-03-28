import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { analyzeSentiment } from "./services/ai";
import { z } from "zod";
import { SentimentType, analysisFormSchema } from "@shared/schema";

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

  const httpServer = createServer(app);
  return httpServer;
}
