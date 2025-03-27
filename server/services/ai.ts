import { analyzeSentiment as geminiAnalyze } from './gemini';
import { analyzeSentiment as openaiAnalyze } from './openai';

// Tipo para o resultado da análise de sentimento
export type SentimentAnalysisResult = {
  sentiment: "positive" | "negative" | "neutral",
  confidence: number
};

// Provedor de IA a ser usado
type AIProvider = 'gemini' | 'openai';

// Obtem o provedor de IA configurado
function getAIProvider(): AIProvider {
  const provider = process.env.AI_PROVIDER?.toLowerCase() as AIProvider;
  return provider === 'openai' ? 'openai' : 'gemini'; // Gemini é o padrão
}

/**
 * Analisa o sentimento do texto fornecido usando o provedor de IA configurado
 * Otimizado para textos em português
 * 
 * @param text Texto a ser analisado
 * @returns Objeto com tipo de sentimento e confiança
 */
export async function analyzeSentiment(text: string): Promise<SentimentAnalysisResult> {
  const provider = getAIProvider();
  
  try {
    console.log(`Analisando sentimento usando provedor: ${provider}`);
    
    if (provider === 'openai') {
      return await openaiAnalyze(text);
    } else {
      return await geminiAnalyze(text);
    }
  } catch (error) {
    console.error(`Erro ao analisar sentimento com ${provider}:`, error);
    
    // Se o provedor principal falhar, tenta o alternativo
    try {
      const alternativeProvider = provider === 'openai' ? 'gemini' : 'openai';
      console.log(`Tentando provedor alternativo: ${alternativeProvider}`);
      
      if (alternativeProvider === 'openai') {
        return await openaiAnalyze(text);
      } else {
        return await geminiAnalyze(text);
      }
    } catch (fallbackError) {
      console.error("Ambos os provedores falharam. Erro do provedor alternativo:", fallbackError);
      throw new Error(`Falha ao analisar o sentimento: ${(error as Error).message}`);
    }
  }
}