import { GoogleGenerativeAI } from "@google/generative-ai";

// Usar a chave do ambiente ou a chave fixa (para uso fora do Replit)
// NOTA: Esta chave é apenas para desenvolvimento e tem limites de uso
// Para produção, use sua própria chave API através da variável de ambiente GEMINI_API_KEY
const apiKey = process.env.GEMINI_API_KEY || "AIzaSyCsSHMOHa3ETvKeJDKP_0-WFVd2HpKmgvw";

// Inicializa o cliente Google Generative AI
const genAI = new GoogleGenerativeAI(apiKey);

/**
 * Analisa o sentimento do texto fornecido usando a API Google Gemini
 * Otimizado para textos em português
 * 
 * @param text Texto a ser analisado
 * @returns Objeto com tipo de sentimento e confiança
 */
export async function analyzeSentiment(text: string): Promise<{
  sentiment: "positive" | "negative" | "neutral",
  confidence: number
}> {
  try {
    // Obter o modelo Gemini
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

    // Preparar o prompt para análise de sentimento
    const prompt = `
      Você é um especialista em análise de sentimentos em textos em português do Brasil.
      
      Analise com atenção o sentimento predominante no texto a seguir e classifique-o como:
      - 'positive': quando expressa satisfação, alegria, entusiasmo ou aprovação
      - 'negative': quando expressa insatisfação, tristeza, raiva, frustração ou crítica
      - 'neutral': quando não expressa claramente uma emoção positiva ou negativa
      
      Forneça também um nível de confiança entre 0 (totalmente incerto) e 100 (totalmente confiante).
      
      Considere o contexto cultural brasileiro e gírias ou expressões tipicamente brasileiras.
      
      Responda SOMENTE com um JSON no seguinte formato: { "sentiment": "positive/negative/neutral", "confidence": número }
      
      Texto para análise: "${text}"
    `;

    // Gerar resposta
    const result = await model.generateContent(prompt);
    const response = result.response;
    const textResponse = response.text();
    
    // Extrair o JSON da resposta
    // Encontrar o JSON na resposta
    const jsonMatch = textResponse.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error("Formato de resposta inválido");
    }
    
    const jsonString = jsonMatch[0];
    const parsedResult = JSON.parse(jsonString);

    // Normaliza o valor de confiança para 0-100
    const normalizedConfidence = Math.max(0, Math.min(100, Math.round(parsedResult.confidence)));

    return {
      sentiment: parsedResult.sentiment as "positive" | "negative" | "neutral",
      confidence: normalizedConfidence,
    };
  } catch (error) {
    console.error("Erro ao analisar sentimento com Gemini:", error);
    throw new Error("Falha ao analisar o sentimento: " + (error as Error).message);
  }
}