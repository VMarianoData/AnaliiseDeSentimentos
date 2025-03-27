import OpenAI from "openai";

// Verifica se a API key está presente
const apiKey = process.env.OPENAI_API_KEY;

// Inicializa o cliente OpenAI apenas se a chave API estiver disponível
// O modelo mais recente do OpenAI é "gpt-4o" lançado em 13 de maio de 2024. 
// Não altere isso a menos que explicitamente solicitado pelo usuário
let openai: OpenAI | null = null;

if (apiKey) {
  openai = new OpenAI({ apiKey });
} else {
  console.warn("OPENAI_API_KEY não está definida no ambiente. O serviço OpenAI não estará disponível.");
}

/**
 * Analisa o sentimento do texto fornecido usando a API OpenAI
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
    // Verifica se o cliente OpenAI está disponível
    if (!openai) {
      throw new Error("OPENAI_API_KEY não está definida. Serviço OpenAI não disponível.");
    }
    
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content:
            `Você é um especialista em análise de sentimentos em textos em português do Brasil.
            
            Analise com atenção o sentimento predominante no texto e classifique-o como:
            - 'positive': quando expressa satisfação, alegria, entusiasmo ou aprovação
            - 'negative': quando expressa insatisfação, tristeza, raiva, frustração ou crítica
            - 'neutral': quando não expressa claramente uma emoção positiva ou negativa
            
            Forneça também um nível de confiança entre 0 (totalmente incerto) e 100 (totalmente confiante).
            
            Considere o contexto cultural brasileiro e gírias ou expressões tipicamente brasileiras.
            
            Responda APENAS com um objeto JSON no formato: { "sentiment": "positive/negative/neutral", "confidence": número }`
        },
        {
          role: "user",
          content: text,
        },
      ],
      response_format: { type: "json_object" },
      temperature: 0.3, // Menor temperatura para respostas mais consistentes
    });

    const content = response.choices[0].message.content;
    if (!content) {
      throw new Error("Resposta da API vazia");
    }

    const result = JSON.parse(content);

    // Normaliza o valor de confiança para 0-100
    const normalizedConfidence = Math.max(0, Math.min(100, Math.round(result.confidence)));

    return {
      sentiment: result.sentiment as "positive" | "negative" | "neutral",
      confidence: normalizedConfidence,
    };
  } catch (error) {
    console.error("Erro ao analisar sentimento com OpenAI:", error);
    throw new Error("Falha ao analisar o sentimento: " + (error as Error).message);
  }
}
