import express, { type Express } from "express";
import { analyzeSentiment } from "./services/ai";
import { storage } from "./storage";
import { log } from "./vite";

// Criar um roteador dedicado ao Spring
const springRouter = express.Router();

/**
 * Endpoint para receber textos do frontend Spring, analisá-los usando nossos serviços,
 * e retornar os resultados
 */
springRouter.post("/spring-sentiment", async (req, res) => {
  try {
    const { text } = req.body;
    
    // Validar se o texto foi fornecido
    if (!text || typeof text !== 'string' || text.trim().length < 3) {
      return res.status(400).json({ 
        message: "Texto inválido ou muito curto", 
        error: "O texto deve ter pelo menos 3 caracteres",
        status: "error"
      });
    }
    
    log(`Recebendo solicitação do Spring para analisar: "${text.substring(0, 50)}${text.length > 50 ? '...' : ''}"`, "spring");
    
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
    
    // Notificar clientes web sobre a nova análise via WebSocket
    if ((global as any).notifyNewAnalysis) {
      log("Notificando clientes web sobre nova análise via Spring", "spring");
      (global as any).notifyNewAnalysis();
    }
    
    // Retornar o resultado em um formato que o Spring possa processar facilmente
    return res.status(200).json({
      id: savedAnalysis.id,
      text: savedAnalysis.text,
      sentiment: savedAnalysis.sentiment,
      confidenceScore: savedAnalysis.confidence,
      timestamp: savedAnalysis.createdAt,
      source: "local_api",
      status: "success"
    });
    
  } catch (error) {
    console.error("Erro ao processar solicitação do Spring:", error);
    return res.status(500).json({ 
      message: "Erro ao processar a análise de sentimento", 
      error: (error as Error).message,
      status: "error"
    });
  }
});

/**
 * Função para registrar as rotas de integração com Spring no app principal
 * Isso deve ser chamado antes da configuração do Vite para evitar conflitos
 */
export function registerSpringRoutes(app: Express) {
  app.use('/api', springRouter);
  log("Rotas de integração com Spring registradas", "spring");
}