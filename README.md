# Sistema de Análise de Sentimentos

Um sistema completo para análise de sentimentos em textos em português, com visualização de estatísticas e histórico de análises.

## Funcionalidades

- Análise de textos em português utilizando IA (Google Gemini ou OpenAI)
- Classificação de sentimentos em positivo, negativo ou neutro
- Histórico de análises realizadas com persistência em arquivos JSON
- Visualização estatística dos resultados em gráficos interativos
- Filtros por tipo de sentimento e período (hoje, semana, mês, todos)
- Exportação dos dados para CSV e JSON
- Interface responsiva para desktop e dispositivos móveis

## Requisitos

- Node.js v16 ou superior (recomendado v18+)
- NPM ou Yarn
- Uma chave de API do Google Gemini (opcional, pois já existe uma padrão no código)
- Chave da API OpenAI (opcional, necessária apenas se quiser usar a OpenAI em vez do Gemini)

## Guia Detalhado para Executar o Projeto no VS Code

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

### 5. Solução de Problemas Comuns

1. **Erro "Port 5000 is already in use":**
   - Encerre o processo que está usando a porta 5000 ou
   - Modifique a porta no arquivo `server/index.ts` (procure por `app.listen(5000)` e altere o número)

2. **Módulos não encontrados:**
   - Execute `npm install` novamente para garantir que todas as dependências estejam instaladas
   - Verifique se o arquivo package.json está corretamente configurado

3. **Erros com as APIs de IA:**
   - Verifique se o arquivo `.env` está configurado corretamente
   - Se estiver usando OpenAI, certifique-se de que sua chave API é válida
   - Se quiser voltar para o Gemini, defina `AI_PROVIDER=gemini` no arquivo `.env`

4. **Os dados não estão sendo salvos corretamente:**
   - Verifique se a pasta `data` foi criada na raiz do projeto
   - Confirme as permissões de escrita para a pasta
   - Em caso de problemas, verifique o arquivo `server/storage.ts`

5. **Erro ao acessar a página de estatísticas:**
   - Certifique-se de que existem análises salvas para serem exibidas
   - Verifique o console do navegador para identificar erros específicos
   - Reinicie o servidor com `npm run dev`

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

## Requisitos de Sistema

- **Sistema Operacional:** Windows, macOS ou Linux
- **Hardware:** Mínimo de 2GB de RAM e 1GB de espaço livre em disco
- **Navegadores compatíveis:** Chrome, Firefox, Safari, Edge (versões recentes)
- **Conexão com Internet:** Necessária apenas para uso dos serviços de IA

## Conclusão

Este sistema de análise de sentimentos foi desenvolvido para ser completo, portátil e fácil de usar. Ele permite analisar textos em português, armazenar os resultados localmente e visualizar estatísticas detalhadas sobre as análises.

O uso de armazenamento em JSON e a opção de selecionar entre diferentes provedores de IA tornam a solução flexível e adaptável a diferentes ambientes e necessidades.

Para qualquer dúvida ou problema ao utilizar o sistema, verifique a seção de solução de problemas ou consulte a documentação dos serviços utilizados.

**Importante:** As análises de sentimento são realizadas por modelos de IA que, embora avançados, podem não ser perfeitos em todos os casos. Os resultados devem ser interpretados como sugestões e não como verdades absolutas.