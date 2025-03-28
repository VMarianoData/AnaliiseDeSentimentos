/**
 * Exemplo de componente React para integração com a API de análise de sentimentos através do Spring
 * Este componente pode ser utilizado em projetos React para enviar textos para análise
 * e exibir os resultados.
 */
import { useState } from 'react';
import axios from 'axios';

// URL da API de análise de sentimentos
const API_URL = 'http://localhost:5000/api/spring-sentiment';

// Componente de exemplo
export function SentimentAnalyzerWithSpring() {
  const [text, setText] = useState('');
  const [result, setResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Função para analisar o sentimento de um texto
  const analyzeSentiment = async () => {
    // Validar se existe texto para analisar
    if (!text.trim()) {
      setError('Por favor, insira um texto para análise.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Enviar requisição para a API
      const response = await axios.post(API_URL, { text });
      
      // Processar resultado
      setResult(response.data);
    } catch (error) {
      setError(
        error.response?.data?.message || 
        'Erro ao comunicar com o serviço de análise de sentimentos.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Função para traduzir o sentimento para português
  const translateSentiment = (sentiment) => {
    const translations = {
      positive: 'Positivo',
      negative: 'Negativo',
      neutral: 'Neutro'
    };
    return translations[sentiment] || sentiment;
  };

  return (
    <div className="sentiment-analyzer-container">
      <h2>Análise de Sentimentos via Spring</h2>
      
      <div className="input-group">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Digite um texto em português para análise..."
          rows={5}
          disabled={isLoading}
        />
      </div>
      
      <div className="button-group">
        <button 
          onClick={analyzeSentiment}
          disabled={isLoading || !text.trim()}
        >
          {isLoading ? 'Analisando...' : 'Analisar Sentimento'}
        </button>
      </div>
      
      {error && (
        <div className="error-message">
          <p>{error}</p>
        </div>
      )}
      
      {result && (
        <div className="result-container">
          <h3>Resultado da Análise</h3>
          <div className="result-card">
            <p>
              <strong>Sentimento:</strong> {translateSentiment(result.sentiment)}
            </p>
            <p>
              <strong>Confiança:</strong> {result.confidenceScore}%
            </p>
            <p>
              <strong>ID da análise:</strong> {result.id}
            </p>
            <p>
              <strong>Data/hora:</strong> {new Date(result.timestamp).toLocaleString()}
            </p>
          </div>
        </div>
      )}
      
      <div className="info-box">
        <p>
          <small>
            Esta análise é realizada através da API de integração Spring do sistema.
            Os resultados são armazenados para análises estatísticas futuras.
          </small>
        </p>
      </div>
    </div>
  );
}

// Estilo para o componente (CSS)
const styles = `
.sentiment-analyzer-container {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
  font-family: 'Inter', sans-serif;
}

.input-group {
  margin-bottom: 15px;
}

textarea {
  width: 100%;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-family: inherit;
  font-size: 16px;
  resize: vertical;
}

.button-group {
  margin-bottom: 20px;
}

button {
  background-color: #3b82f6;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 10px 15px;
  font-size: 16px;
  cursor: pointer;
  font-weight: 500;
  transition: background-color 0.2s;
}

button:hover {
  background-color: #2563eb;
}

button:disabled {
  background-color: #93c5fd;
  cursor: not-allowed;
}

.error-message {
  color: #dc2626;
  padding: 10px;
  background-color: #fee2e2;
  border-radius: 4px;
  margin-bottom: 15px;
}

.result-container {
  margin-top: 20px;
}

.result-card {
  background-color: #f9fafb;
  border-radius: 6px;
  padding: 15px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.info-box {
  margin-top: 20px;
  font-size: 14px;
  color: #6b7280;
}
`;

// Você pode adicionar este estilo em um arquivo CSS ou
// usar uma abordagem de CSS-in-JS conforme necessário