export function Footer() {
  return (
    <footer className="bg-muted/40 border-t py-6">
      <div className="container-custom">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div>
            <p className="text-sm text-muted-foreground">
              &copy; {new Date().getFullYear()} SentiMentor - Análise de Sentimentos para Português
            </p>
          </div>
          <div className="flex space-x-6">
            <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Documentação da API
            </a>
            <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Integração Spring
            </a>
            <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Sobre o Projeto
            </a>
          </div>
        </div>
        <div className="mt-6 pt-6 border-t text-center text-xs text-muted-foreground/70">
          <p>
            Desenvolvido com tecnologias modernas | Suporte para Google Gemini e OpenAI
          </p>
        </div>
      </div>
    </footer>
  );
}
