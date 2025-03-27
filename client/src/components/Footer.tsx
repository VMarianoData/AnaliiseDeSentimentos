export function Footer() {
  return (
    <footer className="bg-dark text-white py-6 px-6">
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <p>&copy; {new Date().getFullYear()} Sistema de Análise de Sentimentos</p>
          </div>
          <div className="flex space-x-4">
            <a href="#" className="text-gray-300 hover:text-white transition">Ajuda</a>
            <a href="#" className="text-gray-300 hover:text-white transition">Termos</a>
            <a href="#" className="text-gray-300 hover:text-white transition">Privacidade</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
