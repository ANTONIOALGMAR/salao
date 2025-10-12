import axios from 'axios';

/**
 * Serviço de autenticação para gerenciar login, registro e estado do usuário
 */
const authService = {
  /**
   * Realiza o login do usuário
   * @param {Object} credentials - Credenciais do usuário (email e senha)
   * @returns {Promise<Object>} - Dados do usuário autenticado
   */
  login: async (credentials) => {
    try {
      const response = await axios.post('/api/users/login', credentials);
      const userData = response.data;
      
      // Armazena os dados do usuário no localStorage
      localStorage.setItem('userInfo', JSON.stringify(userData));
      
      return userData;
    } catch (error) {
      throw error.response?.data?.message || 'Erro ao fazer login';
    }
  },
  
  /**
   * Registra um novo usuário
   * @param {Object} userData - Dados do usuário (nome, email, senha, etc.)
   * @returns {Promise<Object>} - Dados do usuário registrado
   */
  register: async (userData) => {
    try {
      const response = await axios.post('/api/users', userData);
      const newUserData = response.data;
      
      // Armazena os dados do usuário no localStorage
      localStorage.setItem('userInfo', JSON.stringify(newUserData));
      
      return newUserData;
    } catch (error) {
      throw error.response?.data?.message || 'Erro ao registrar usuário';
    }
  },
  
  /**
   * Realiza o logout do usuário
   */
  logout: () => {
    localStorage.removeItem('userInfo');
  },
  
  /**
   * Verifica se o usuário está autenticado
   * @returns {boolean} - True se o usuário estiver autenticado
   */
  isAuthenticated: () => {
    const userInfo = localStorage.getItem('userInfo');
    return !!userInfo;
  },
  
  /**
   * Obtém os dados do usuário atual
   * @returns {Object|null} - Dados do usuário ou null se não estiver autenticado
   */
  getCurrentUser: () => {
    const userInfo = localStorage.getItem('userInfo');
    return userInfo ? JSON.parse(userInfo) : null;
  },
  
  /**
   * Verifica se o usuário tem um papel específico
   * @param {string|Array} roles - Papel ou array de papéis a verificar
   * @returns {boolean} - True se o usuário tiver o papel especificado
   */
  hasRole: (roles) => {
    const user = authService.getCurrentUser();
    if (!user) return false;
    
    if (Array.isArray(roles)) {
      return roles.includes(user.role);
    }
    
    return user.role === roles;
  },
  
  /**
   * Configura o token de autenticação para requisições axios
   */
  setupAxiosInterceptors: () => {
    axios.interceptors.request.use(
      (config) => {
        const user = authService.getCurrentUser();
        if (user && user.token) {
          config.headers.Authorization = `Bearer ${user.token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );
    
    axios.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response && error.response.status === 401) {
          // Token expirado ou inválido
          authService.logout();
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    );
  }
};

export default authService;