import React, { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout.jsx';
import HomePage from './pages/HomePage.jsx';
import ServicesPage from './pages/ServicesPage.jsx';
import AppointmentsPage from './pages/AppointmentsPage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import RegisterPage from './pages/RegisterPage.jsx';
import CustomerDashboard from './pages/CustomerDashboard.jsx';
import AdminDashboard from './pages/AdminDashboard.jsx';
import EmployeeDashboard from './pages/EmployeeDashboard.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import authService from './services/authService';

/**
 * @function App
 * @description Componente principal da aplicação que define as rotas e inicializa o serviço de autenticação
 * @returns {JSX.Element} O componente React com as rotas da aplicação
 */
const App = () => {
  useEffect(() => {
    // Configura os interceptors do axios para autenticação
    authService.setupAxiosInterceptors();
  }, []);

  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="servicos" element={<ServicesPage />} />
        <Route path="agendamentos" element={<AppointmentsPage />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="cadastro" element={<RegisterPage />} />
        
        {/* Rotas protegidas */}
        <Route path="cliente" element={
          <ProtectedRoute allowedRoles={['client']}>
            <CustomerDashboard />
          </ProtectedRoute>
        } />
        <Route path="admin" element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminDashboard />
          </ProtectedRoute>
        } />
        <Route path="funcionario" element={
          <ProtectedRoute allowedRoles={['employee']}>
            <EmployeeDashboard />
          </ProtectedRoute>
        } />
      </Route>
    </Routes>
  );
};

export default App;