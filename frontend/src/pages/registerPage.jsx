import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

/**
 * @function RegisterPage
 * @description Componente da página de registro, permitindo ao usuário criar uma nova conta.
 * @returns {JSX.Element} O componente React da página de registro.
 */
const RegisterPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'client'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const navigate = useNavigate();

  // Manipular mudanças no formulário
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Manipular o envio do formulário
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validação de senha
    if (formData.password !== formData.confirmPassword) {
      setError('As senhas não coincidem!');
      return;
    }
    
    setLoading(true);
    setError(null);

    try {
      // Remover confirmPassword antes de enviar para a API
      const { confirmPassword, ...dataToSend } = formData;
      
      const response = await axios.post('/api/users', dataToSend);
      
      // Armazenar as informações do usuário no localStorage
      localStorage.setItem('userInfo', JSON.stringify(response.data));
      
      // Redirecionar com base no papel do usuário
      const { role } = response.data;
      if (role === 'admin') {
        navigate('/admin');
      } else if (role === 'employee') {
        navigate('/funcionario');
      } else if (role === 'client') {
        navigate('/cliente');
      } else {
        navigate('/');
      }
      
    } catch (err) {
      setError(
        err.response?.data?.message || 
        'Erro ao criar conta. Verifique seus dados e tente novamente.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold mb-6 text-center">Criar Conta</h2>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 max-w-md mx-auto">
          {error}
        </div>
      )}
      
      <form 
        onSubmit={handleSubmit} 
        className="max-w-md mx-auto bg-gray-100 p-6 rounded-lg shadow-md"
      >
        <div className="mb-4">
          <label htmlFor="name" className="block text-gray-700 text-sm font-bold mb-2">
            Nome:
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
          />
        </div>
        
        <div className="mb-4">
          <label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-2">
            Email:
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
          />
        </div>
        
        <div className="mb-4">
          <label htmlFor="password" className="block text-gray-700 text-sm font-bold mb-2">
            Senha:
          </label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
            required
          />
        </div>
        
        <div className="mb-4">
          <label htmlFor="confirmPassword" className="block text-gray-700 text-sm font-bold mb-2">
            Confirmar Senha:
          </label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
            required
          />
        </div>
        
        <div className="mb-6">
          <label htmlFor="role" className="block text-gray-700 text-sm font-bold mb-2">
            Tipo de Usuário:
          </label>
          <select
            id="role"
            name="role"
            value={formData.role}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          >
            <option value="client">Cliente</option>
            <option value="employee">Funcionário</option>
            <option value="admin">Administrador</option>
          </select>
        </div>
        
        <div className="flex items-center justify-between">
          <button
            type="submit"
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            disabled={loading}
          >
            {loading ? 'Registrando...' : 'Registrar'}
          </button>
          <Link
            to="/login"
            className="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800"
          >
            Já tem conta? Faça Login
          </Link>
        </div>
      </form>
    </div>
  );
};

export default RegisterPage;
