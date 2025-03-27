import { Link, useLocation } from "wouter";

export function Header() {
  const [location] = useLocation();
  
  return (
    <header className="bg-primary text-white py-4 px-6 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-2xl font-bold">Sistema de Análise de Sentimentos</h1>
        <nav>
          <ul className="flex space-x-6">
            <li>
              <Link href="/">
                <a className={`hover:underline font-medium text-sm sm:text-base flex items-center ${location === "/" ? "underline" : ""}`}>
                  <span className="material-icons mr-1 text-base">text_fields</span>
                  Análise
                </a>
              </Link>
            </li>
            <li>
              <Link href="/estatisticas">
                <a className={`hover:underline font-medium text-sm sm:text-base flex items-center ${location === "/estatisticas" ? "underline" : ""}`}>
                  <span className="material-icons mr-1 text-base">bar_chart</span>
                  Estatísticas
                </a>
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
