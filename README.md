# Sistema de Análise de Sentimentos em Português

Um sistema de análise de sentimentos para textos em português usando inteligência artificial, com interface visual intuitiva, armazenamento local e API para integração com outras aplicações.

## Funcionalidades Principais

- ✅ Análise de textos em português utilizando IA (Google Gemini ou OpenAI)
- ✅ Classificação de sentimentos em positivo, negativo ou neutro com índice de confiança
- ✅ Armazenamento local em arquivos JSON sem necessidade de banco de dados
- ✅ Dashboard com visualização estatística em gráficos interativos
- ✅ Filtros por tipo de sentimento e período (hoje, semana, mês, todos)
- ✅ Exportação de dados para CSV com um clique
- ✅ Interface responsiva moderna com Tailwind CSS e ShadCN
- ✅ API REST para integração com aplicações Spring Boot
- ✅ Funciona 100% offline (exceto para chamadas da API de IA)

## Requisitos Técnicos

- Node.js v16 ou superior (recomendado v18+)
- NPM ou Yarn
- VS Code (recomendado, mas não obrigatório)
- Chave da API Google Gemini (opcional, já incluída para desenvolvimento)
- Chave da API OpenAI (opcional, apenas se preferir usar OpenAI)

## Guia de Instalação e Uso no VS Code

### 1. Configuração Inicial

1. **Obtenha o código:**
   - Faça o download do código como ZIP, ou
   - Clone o repositório usando Git:
     ```bash
     git clone [URL_DO_REPOSITORIO]
     cd [NOME_DA_PASTA]
     ```

2. **Instale as dependências:**
   ```bash
   npm install
   ```

### 2. Configurações do Projeto

1. **Verifique o arquivo `package.json`:**
   
   Certifique-se que os scripts estão configurados corretamente:
   ```json
   "scripts": {
     "dev": "tsx server/index.ts",
     "build": "vite build && esbuild server/index.ts --platform=node --packages=external --bundle --format=esm --outdir=dist",
     "start": "NODE_ENV=production node dist/index.js",
     "check": "tsc",
     "export-csv": "tsx server/export.ts"
   }
   ```

2. **Configure o arquivo `vite.config.ts`:**
   
   Certifique-se que o arquivo contém a configuração adequada:
   ```typescript
   import { defineConfig } from "vite";
   import react from "@vitejs/plugin-react";
   import path, { dirname } from "path";
   import { fileURLToPath } from "url";

   const __filename = fileURLToPath(import.meta.url);
   const __dirname = dirname(__filename);

   export default defineConfig({
     plugins: [
       react(),
     ],
     resolve: {
       alias: {
         "@": path.resolve(__dirname, "client", "src"),
         "@shared": path.resolve(__dirname, "shared"),
         "@assets": path.resolve(__dirname, "attached_assets"),
       },
     },
     root: path.resolve(__dirname, "client"),
     build: {
       outDir: path.resolve(__dirname, "dist/public"),
       emptyOutDir: true,
     },
     server: {
       proxy: {
         "/api": {
           target: "http://localhost:5000",
           changeOrigin: true
         }
       }
     }
   });
   ```

### 3. Configuração das APIs de IA (Opcional)

1. **Crie um arquivo `.env` na raiz do projeto:**
   
   ```
   # Escolha o provedor de IA: 'gemini' (padrão) ou 'openai'
   AI_PROVIDER=gemini
   
   # Chave da API do Google Gemini (opcional, já existe uma padrão no código)
   GEMINI_API_KEY=sua_chave_api_aqui
   
   # Chave da API da OpenAI (opcional, apenas se quiser usar a OpenAI)
   OPENAI_API_KEY=sua_chave_openai_aqui
   ```

   **Observação**: Se não configurar nenhuma chave, o sistema usará o Google Gemini com uma chave de desenvolvimento que já está no código. Esta chave tem limites de uso e é apenas para testes.

### 4. Executando o Projeto

1. **Inicie o servidor de desenvolvimento:**
   ```bash
   npm run dev
   ```
   Este comando inicia tanto o servidor backend (Express) quanto o frontend (Vite).

2. **Acesse a aplicação:**
   Abra seu navegador e acesse `http://localhost:5000`

3. **Verificando se está funcionando:**
   - Na página inicial, você verá um formulário para inserir textos para análise
   - A navegação entre páginas está no cabeçalho do site
   - Na página de estatísticas, você verá os gráficos e tabelas com resultados
   - A seção de exportação está disponível na página de estatísticas

4. **Testando a análise de sentimentos:**
   - Digite um texto em português na caixa de texto da página inicial
   - Clique em "Analisar Sentimento"
   - Você verá o resultado da análise (positivo, negativo ou neutro)
   - Todos os textos analisados serão salvos automaticamente e estarão disponíveis na página de estatísticas

### 5. Configuração do VS Code (Recomendado)

1. **Extensões recomendadas para o VS Code:**
   
   Instale estas extensões para melhorar sua experiência de desenvolvimento:

   - **ESLint** (`dbaeumer.vscode-eslint`): Análise de código para JavaScript/TypeScript
   - **Prettier** (`esbenp.prettier-vscode`): Formatação consistente de código
   - **Tailwind CSS IntelliSense** (`bradlc.vscode-tailwindcss`): Autocompletar classes do Tailwind
   - **ES7+ React/Redux/GraphQL** (`dsznajder.es7-react-js-snippets`): Snippets para React
   - **Thunder Client** (`rangav.vscode-thunder-client`): Cliente REST para testar APIs
   - **DotENV** (`mikestead.dotenv`): Suporte para arquivos .env
   - **Auto Import** (`steoates.autoimport`): Importação automática de módulos

2. **Configuração do debugger:**

   Crie um arquivo `.vscode/launch.json` para depuração:
   
   ```json
   {
     "version": "0.2.0",
     "configurations": [
       {
         "type": "node",
         "request": "launch",
         "name": "Debug Backend",
         "skipFiles": ["<node_internals>/**"],
         "runtimeExecutable": "${workspaceFolder}/node_modules/.bin/tsx",
         "args": ["${workspaceFolder}/server/index.ts"],
         "console": "integratedTerminal"
       }
     ]
   }
   ```

3. **Configuração do workspace:**

   Crie um arquivo `.vscode/settings.json` com:
   
   ```json
   {
     "editor.formatOnSave": true,
     "editor.codeActionsOnSave": {
       "source.fixAll.eslint": true
     },
     "typescript.tsdk": "node_modules/typescript/lib",
     "emmet.includeLanguages": {
       "javascript": "javascriptreact"
     },
     "tailwindCSS.includeLanguages": {
       "typescript": "javascript",
       "typescriptreact": "javascript"
     }
   }
   ```

### 6. Solução de Problemas Comuns

1. **Erro "Port 5000 is already in use":**
   - Encerre o processo que está usando a porta 5000 ou
   - Modifique a porta no arquivo `server/index.ts` (procure por `app.listen(5000)` e altere o número)

2. **Módulos não encontrados:**
   - Execute `npm install` novamente para garantir que todas as dependências estejam instaladas
   - Verifique se o arquivo package.json está corretamente configurado
   - Use `npm list [nome-pacote]` para verificar se um pacote específico está instalado

3. **Erros com as APIs de IA:**
   - Verifique se o arquivo `.env` está configurado corretamente
   - Se estiver usando OpenAI, certifique-se de que sua chave API é válida
   - Se quiser voltar para o Gemini, defina `AI_PROVIDER=gemini` no arquivo `.env`
   - Use o console para verificar se há mensagens de erro específicas

4. **Os dados não estão sendo salvos corretamente:**
   - Verifique se a pasta `data` foi criada na raiz do projeto
   - Confirme as permissões de escrita para a pasta
   - Em caso de problemas, verifique o arquivo `server/storage.ts`
   - Execute a aplicação com permissões adequadas de acesso ao sistema de arquivos

5. **Erro ao acessar a página de estatísticas:**
   - Certifique-se de que existem análises salvas para serem exibidas
   - Verifique o console do navegador para identificar erros específicos
   - Reinicie o servidor com `npm run dev`
   - Limpe o cache do navegador

## Estrutura do Projeto

- `/client` - Frontend da aplicação (React + Tailwind CSS)
- `/server` - Backend da aplicação (Express)
  - `/services` - Serviços de integração com APIs externas
- `/shared` - Código compartilhado entre frontend e backend (esquemas/tipos)

## Dados

O sistema armazena todos os dados em uma pasta local (`/data`):
- Arquivos JSON de análises de sentimento (`/data/sentiment_data.json`)
- Arquivos CSV exportados (`/data/analises_sentimento_YYYY-MM-DD.csv`)

Esta estrutura organizada torna o sistema portátil e fácil de usar sem dependências externas.

## Provedores de IA Suportados

O sistema suporta dois provedores de IA para análise de sentimentos:

### 1. Google Gemini (Padrão)
- Configuração mínima necessária (já vem com uma chave de desenvolvimento)
- Bom suporte para textos em português
- Para usar sua própria chave, configure `GEMINI_API_KEY` no arquivo `.env`
- Acesse https://aistudio.google.com para obter uma chave própria

### 2. OpenAI
- Requer uma chave de API válida
- Suporte excelente para análise de textos em português
- Para usar, configure `OPENAI_API_KEY` no arquivo `.env` e defina `AI_PROVIDER=openai`
- Acesse https://platform.openai.com para obter uma chave

## Personalização

- Você pode ajustar os prompts de análise de sentimento nos arquivos:
  - `server/services/gemini.ts` - Configuração do Google Gemini
  - `server/services/openai.ts` - Configuração da OpenAI
- Para escolher o provedor de IA, configure `AI_PROVIDER` no arquivo `.env`
- Os componentes visuais podem ser personalizados em `client/src/components`
- Para modificar o tema, edite o arquivo `theme.json`

## Exportação de dados

O sistema permite exportar os dados das análises em dois formatos:

1. **Pela interface web**: Na página de estatísticas, utilize os botões de exportação para JSON ou CSV.

2. **Via linha de comando**: Use o script de exportação para CSV:
   ```
   npm run export-csv
   # ou
   npx tsx server/export.ts
   ```
   O arquivo será salvo na pasta `/data` com o nome `analises_sentimento_YYYY-MM-DD.csv`.

## Construção para Produção

Para gerar os arquivos otimizados para produção:

```
npm run build
```

Para iniciar o servidor em modo de produção:

```
npm run start
```

## Integração com Spring Boot

O sistema oferece uma API dedicada para integração com aplicações Java/Spring Boot. Esta integração permite que aplicações externas enviem textos para análise de sentimento e recebam os resultados processados.

### Endpoint de Integração

```
POST http://localhost:5000/api/spring-sentiment
```

### Formato da Requisição

```json
{
  "text": "Texto em português para análise de sentimento"
}
```

### Formato da Resposta

```json
{
  "id": 123,
  "text": "Texto original enviado",
  "sentiment": "positive",
  "confidenceScore": 95,
  "timestamp": "2025-03-27T15:45:36.404Z",
  "source": "local_api",
  "status": "success"
}
```

### Exemplos de Clientes de Integração

Na pasta `/examples` você encontrará implementações de clientes para integração:

1. **JavaScript/TypeScript**: `spring-client.js`
2. **Java**: `SpringSentimentClient.java`

Estes exemplos demonstram como enviar requisições para a API de análise de sentimentos a partir de diferentes plataformas.

### Configuração Adicional

Para alterar a URL da API Spring Boot (quando integrando no sentido inverso):
- Configure a variável de ambiente `SPRING_API_URL` (padrão: http://localhost:8080)

## Desenvolvimento no VS Code

### Fluxo de Desenvolvimento Recomendado

1. **Iniciar em modo de desenvolvimento:**
   ```bash
   npm run dev
   ```
   Este comando inicia o servidor Express e o servidor Vite juntos, com hot-reloading.

2. **Editar código no VS Code:**
   - Os arquivos do frontend estão em `/client/src/`
   - Os arquivos do backend estão em `/server/`
   - As alterações no frontend são aplicadas instantaneamente
   - As alterações no backend requerem reinício do servidor (automático em modo dev)

3. **Testar as APIs:**
   - Use a extensão Thunder Client no VS Code para testar os endpoints
   - Ou use `curl` no terminal integrado do VS Code

4. **Depurar o código:**
   - Coloque breakpoints no VS Code
   - Use o comando "Debug Backend" configurado anteriormente
   - Para o frontend, use as ferramentas de desenvolvedor do navegador

5. **Controle de versão:**
   - Use o Git integrado do VS Code para gerenciar seu código
   - Commit frequentemente para manter um histórico de alterações

### Scripts Disponíveis

- `npm run dev` - Inicia o servidor de desenvolvimento
- `npm run build` - Compila a aplicação para produção
- `npm run start` - Executa a aplicação compilada
- `npm run check` - Verifica tipos TypeScript
- `npm run export-csv` - Exporta dados para CSV

## Requisitos de Sistema

- **Sistema Operacional:** Windows, macOS ou Linux
- **Hardware:** Mínimo de 2GB de RAM e 1GB de espaço livre em disco
- **Navegadores compatíveis:** Chrome, Firefox, Safari, Edge (versões recentes)
- **Conexão com Internet:** Necessária apenas para uso dos serviços de IA

## Iniciando um Novo Projeto

Se quiser criar um projeto semelhante do zero em seu ambiente local:

1. **Estrutura básica:**
   ```bash
   mkdir meu-analisador-sentimentos
   cd meu-analisador-sentimentos
   npm init -y
   ```

2. **Instale as dependências principais:**
   ```bash
   npm install express react react-dom @tanstack/react-query wouter
   npm install -D typescript @types/node @types/react @types/express vite tsx
   ```

3. **Configure TypeScript:**
   ```bash
   npx tsc --init
   ```

4. **Crie a estrutura de pastas:**
   ```bash
   mkdir -p client/src/components client/src/pages server/services shared data
   ```

5. **Configuração do projeto:**
   - Configure o `package.json`, `tsconfig.json` e `vite.config.ts`
   - Crie os esquemas de dados iniciais em `shared/schema.ts`
   - Implemente a estrutura básica do backend em `server/index.ts`
   - Crie o componente principal em `client/src/App.tsx`

6. **Implementação gradual:**
   - Comece com funcionalidades básicas e adicione recursos gradualmente
   - Implemente primeiro o serviço de análise de sentimentos
   - Adicione a interface do usuário com formulário e visualização de resultados
   - Finalize com as estatísticas e recursos de exportação

## Conclusão

Este sistema de análise de sentimentos em português foi desenvolvido para ser completo, portátil e fácil de usar em qualquer ambiente. Ele permite analisar textos, armazenar os resultados localmente e visualizar estatísticas detalhadas sobre as análises.

O uso de armazenamento em JSON e a opção de selecionar entre diferentes provedores de IA (Google Gemini ou OpenAI) tornam a solução flexível e adaptável a diferentes necessidades. O código foi estruturado de forma modular, facilitando a manutenção e extensão.

Para qualquer dúvida ou problema ao utilizar o sistema, verifique a seção de solução de problemas ou consulte a documentação dos serviços utilizados.

**Importante:** As análises de sentimento são realizadas por modelos de IA que, embora avançados, podem não ser perfeitos em todos os casos. Os resultados devem ser interpretados como sugestões e não como verdades absolutas.