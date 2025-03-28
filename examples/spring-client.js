/**
 * Exemplo de cliente JavaScript para integração com a API de análise de sentimentos
 * Este script pode ser utilizado em aplicações Spring Boot para enviar textos 
 * para análise e receber os resultados.
 */

// URL da API de análise de sentimentos
const API_URL = 'http://localhost:5000/api/spring-sentiment';

/**
 * Função para analisar o sentimento de um texto
 * @param {string} text - Texto a ser analisado
 * @returns {Promise<Object>} - Resultado da análise
 */
async function analyzeSentiment(text) {
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ text }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Falha na análise: ${errorData.message || 'Erro desconhecido'}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Erro ao analisar sentimento:', error);
    throw error;
  }
}

/**
 * Exemplo de uso
 */
async function exemploDeFuncionamento() {
  // Exemplos de textos em português para análise
  const textos = [
    "Estou muito feliz com o atendimento da loja!",
    "O produto quebrou no segundo dia de uso, péssima qualidade.",
    "O livro chegou no prazo estipulado."
  ];

  console.log("Iniciando testes de integração com API de sentimentos...");
  
  for (const texto of textos) {
    try {
      console.log(`\nAnalisando: "${texto}"`);
      const resultado = await analyzeSentiment(texto);
      console.log("Resultado:");
      console.log(`- Sentimento: ${resultado.sentiment}`);
      console.log(`- Confiança: ${resultado.confidenceScore}%`);
      console.log(`- ID no sistema: ${resultado.id}`);
    } catch (erro) {
      console.error(`Falha ao analisar: ${erro.message}`);
    }
  }
}

// Para usar em navegadores
if (typeof window !== 'undefined') {
  window.analyzeSentiment = analyzeSentiment;
}

// Para usar em Node.js
if (typeof module !== 'undefined') {
  module.exports = { analyzeSentiment };
}

// Executar exemplo se for chamado diretamente
if (typeof require !== 'undefined' && require.main === module) {
  exemploDeFuncionamento();
}