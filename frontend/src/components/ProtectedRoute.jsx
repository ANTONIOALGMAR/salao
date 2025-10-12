import React from 'react';
import { Navigate } from 'react-router-dom';
import authService from '../services/authService';

/**
 * @function ProtectedRoute
 * @description Componente para proteger rotas que requerem autenticação e autorização
 * @param {Object} props - Propriedades do componente
 * @param {React.ReactNode} props.children - Componentes filhos a serem renderizados se autorizado
 * @param {string|string[]} props.allowedRoles - Papéis permitidos para acessar a rota
 * @returns {JSX.Element} Componente filho ou redirecionamento
 */
const ProtectedRoute = ({ children, allowedRoles }) => {
  // Verifica se o usuário está autenticado
  if (!authService.isAuthenticated()) {
    // Usuário não está logado, redirecionar para login
    return <Navigate to="/login" replace />;
  }
  
  // Verifica se o usuário tem o papel necessário
  if (!authService.hasRole(allowedRoles)) {
    // Usuário não tem permissão para acessar esta rota
    return <Navigate to="/" replace />;
  }
  
  // Usuário tem permissão, renderizar o componente filho
  return children;
};

export default ProtectedRoute;