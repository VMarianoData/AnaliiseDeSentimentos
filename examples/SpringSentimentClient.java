/**
 * Exemplo de cliente Java para integração com a API de análise de sentimentos
 * Esta classe pode ser utilizada em projetos Spring Boot para enviar textos 
 * para análise e receber os resultados.
 */
import java.io.IOException;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.Duration;
import java.util.HashMap;
import java.util.Map;

public class SpringSentimentClient {
    
    private static final String API_URL = "http://localhost:5000/api/spring-sentiment";
    private static final HttpClient httpClient = HttpClient.newBuilder()
            .version(HttpClient.Version.HTTP_2)
            .connectTimeout(Duration.ofSeconds(10))
            .build();
    
    /**
     * Envia um texto para análise de sentimento
     * @param text texto a ser analisado
     * @return resultado da análise em formato JSON
     * @throws IOException em caso de falha na comunicação
     * @throws InterruptedException em caso de interrupção da requisição
     */
    public static String analyzeSentiment(String text) throws IOException, InterruptedException {
        // Cria o JSON de requisição
        String requestBody = String.format("{\"text\": \"%s\"}", text.replace("\"", "\\\""));
        
        // Configura a requisição
        HttpRequest request = HttpRequest.newBuilder()
                .POST(HttpRequest.BodyPublishers.ofString(requestBody))
                .uri(URI.create(API_URL))
                .header("Content-Type", "application/json")
                .build();
        
        // Envia a requisição e obtém a resposta
        HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());
        
        // Verifica se a requisição foi bem-sucedida
        if (response.statusCode() != 200) {
            throw new IOException("Falha na análise de sentimento: " + response.body());
        }
        
        return response.body();
    }
    
    /**
     * Método de demonstração
     */
    public static void main(String[] args) {
        String[] textos = {
            "Estou muito satisfeito com o serviço prestado.",
            "O produto não funcionou corretamente, estou muito insatisfeito.",
            "A entrega foi realizada dentro do prazo previsto."
        };
        
        System.out.println("Iniciando testes de integração com API de sentimentos...\n");
        
        for (String texto : textos) {
            try {
                System.out.printf("Analisando: \"%s\"%n", texto);
                String resultado = analyzeSentiment(texto);
                System.out.println("Resposta: " + resultado);
                System.out.println();
            } catch (Exception e) {
                System.err.println("Erro: " + e.getMessage());
            }
        }
    }
}