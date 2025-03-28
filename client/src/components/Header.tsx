import { Link, useLocation } from "wouter";

export function Header() {
  const [location] = useLocation();
  
  return (
    <header className="bg-background border-b py-4">
      <div className="container-custom flex flex-col sm:flex-row justify-between items-center gap-4">
        <Link href="/" className="flex items-center gap-2">
          <div className="bg-primary text-primary-foreground rounded-lg p-1.5">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 19a7 7 0 1 0 0-14h-4"></path>
              <path d="M5 5v14"></path>
            </svg>
          </div>
          <span className="font-heading font-bold text-xl">SentiMentor</span>
        </Link>
        
        <nav className="flex items-center">
          <ul className="flex space-x-1 sm:space-x-2">
            <li>
              <Link href="/" className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  location === "/" 
                    ? "bg-primary/10 text-primary" 
                    : "text-foreground/70 hover:text-foreground hover:bg-muted"
                }`}>
                <span className="flex items-center gap-1.5">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 16V9h14V2H5l14 14H5Z"></path>
                    <path d="M5 22v-6"></path>
                  </svg>
                  Análise
                </span>
              </Link>
            </li>
            <li>
              <Link href="/estatisticas" className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  location === "/estatisticas" 
                    ? "bg-primary/10 text-primary" 
                    : "text-foreground/70 hover:text-foreground hover:bg-muted"
                }`}>
                <span className="flex items-center gap-1.5">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M3 3v18h18"></path>
                    <path d="M18 17V9"></path>
                    <path d="M13 17V5"></path>
                    <path d="M8 17v-3"></path>
                  </svg>
                  Estatísticas
                </span>
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
