import React, { useState, useEffect } from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';

/**
 * @function Layout
 * @description Componente de layout principal que estrutura a página com cabeçalho, área de conteúdo e rodapé fixos.
 * @returns {JSX.Element} O componente React com o layout aplicado.
 */
const Layout = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Verificar se o usuário está logado
    const userInfo = localStorage.getItem('userInfo');
    if (userInfo) {
      setUser(JSON.parse(userInfo));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('userInfo');
    localStorage.removeItem('token');
    setUser(null);
    navigate('/');
  };

  return (
    <>
      {/* Cabeçalho fixo da página */}
      <header className="bg-gray-800 text-white p-4 shadow-md fixed top-0 left-0 w-full z-10">
        <nav className="container mx-auto flex justify-between items-center">
          <Link to="/" className="text-2xl font-bold">Salão de Beleza</Link>
          <ul className="flex space-x-4">
            <li><Link to="/" className="hover:text-gray-300">Home</Link></li>
            <li><Link to="/servicos" className="hover:text-gray-300">Serviços</Link></li>
            <li><Link to="/agendamentos" className="hover:text-gray-300">Agendar</Link></li>
            
            {!user ? (
              <>
                <li><Link to="/login" className="hover:text-gray-300">Login</Link></li>
                <li><Link to="/cadastro" className="hover:text-gray-300">Cadastro</Link></li>
              </>
            ) : (
              <>
                {user.role === 'client' && (
                  <li><Link to="/cliente" className="hover:text-gray-300">Meus Agendamentos</Link></li>
                )}
                {user.role === 'admin' && (
                  <li><Link to="/admin" className="hover:text-gray-300">Admin</Link></li>
                )}
                {user.role === 'employee' && (
                  <li><Link to="/funcionario" className="hover:text-gray-300">Meu Cronograma</Link></li>
                )}
                <li><button onClick={handleLogout} className="hover:text-gray-300">Sair</button></li>
              </>
            )}
          </ul>
        </nav>
      </header>
      
      {/* Área de conteúdo principal, com margens para compensar cabeçalho e rodapé fixos */}
      <main className="flex-grow container mx-auto p-4 mt-16 mb-16 overflow-y-auto">
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <Outlet />
        </div>
      </main>
      
      {/* Rodapé fixo da página com ícones de redes sociais e direitos autorais */}
      <footer className="bg-gray-800 text-white p-4 text-center fixed bottom-0 left-0 w-full z-10">
        <div className="flex justify-center space-x-4">
          <a href="#" className="text-gray-400 hover:text-white">
            <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-brand-facebook" width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M7 10v4h3v7h4v-7h3l1 -4h-4v-2a1 1 0 0 1 1 -1h3v-4h-3a5 5 0 0 0 -5 5v2h-3" /></svg>
          </a>
          <a href="#" className="text-gray-400 hover:text-white">
            <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-brand-whatsapp" width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M3 21l1.65 -3.8a9 9 0 1 1 3.4 2.9l-5.05 .9" /><path d="M9 10a.5 .5 0 0 0 1 0v-1a.5 .5 0 0 0 -1 0v1a5 5 0 0 0 5 5h1a.5 .5 0 0 0 0 -1h-1a4 4 0 0 1 -4 -4v-1a.5 .5 0 0 0 -1 0v1" /></svg>
          </a>
          <a href="#" className="text-gray-400 hover:text-white">
            <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-brand-instagram" width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><rect x="4" y="4" width="16" height="16" rx="4" /><circle cx="12" cy="12" r="3" /><line x1="16.5" y1="7.5" x2="16.5" y2="7.501" /></svg>
          </a>
          <a href="#" className="text-gray-400 hover:text-white">
            <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-phone" width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M5 4h4l2 5l-2.5 1.5a11 11 0 0 0 5 5l1.5 -2.5l5 2v4a2 2 0 0 1 -2 2a16 16 0 0 1 -15 -15a2 2 0 0 1 2 -2" /></svg>
          </a>
        </div>
        <p className="mt-4">&copy; 2025 Salão de Beleza. Todos os direitos reservados.</p>
      </footer>
    </>
  );
};

export default Layout;
