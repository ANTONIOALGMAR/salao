import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

/**
 * @function LoginPage
 * @description Componente da página de login, permitindo ao usuário autenticar-se na aplicação.
 * @returns {JSX.Element} O componente React da página de login.
 */
const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
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
    setLoading(true);
    setError(null);

    try {
      const response = await axios.post('/api/users/login', formData);
      
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
        'Erro ao fazer login. Verifique suas credenciais e tente novamente.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold mb-6 text-center">Login</h2>
      
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
        
        <div className="mb-6">
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
        
        <div className="flex items-center justify-between">
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            disabled={loading}
          >
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
          <Link
            to="/cadastro"
            className="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800"
          >
            Criar Conta
          </Link>
        </div>
      </form>
    </div>
  );
};

export default LoginPage;
