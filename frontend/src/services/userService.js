/**
 * @function getEmployees
 * @description Busca a lista de funcionários (usuários com perfil 'employee') da API.
 * @param {string} token - Token de autenticação do usuário.
 * @returns {Promise<Array>} Uma promessa que resolve com uma lista de objetos de funcionários.
 * @throws {Error} Se a requisição falhar ou retornar um erro.
 */
const getEmployees = async (token) => {
  try {
    const res = await fetch('/api/users?role=employee', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const employees = await res.json();
    if (res.ok) {
      return employees;
    } else {
      throw new Error(employees.message || 'Erro ao buscar profissionais');
    }
  } catch (error) {
    console.error('Erro ao buscar profissionais:', error);
    throw error;
  }
};

/**
 * @function loginUser
 * @description Realiza o login de um usuário na API.
 * @param {object} credentials - Objeto contendo email e senha do usuário.
 * @returns {Promise<object>} Uma promessa que resolve com os dados do usuário logado (incluindo token).
 * @throws {Error} Se a requisição falhar ou retornar um erro.
 */
const loginUser = async (credentials) => {
  try {
    const res = await fetch('/api/users/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });

    const data = await res.json();

    if (res.ok) {
      return data;
    } else {
      throw new Error(data.message || 'Erro no login');
    }
  } catch (error) {
    console.error('Erro ao fazer login:', error);
    throw error;
  }
};

/**
 * @function registerUser
 * @description Registra um novo usuário na API.
 * @param {object} userData - Objeto contendo nome, email, senha e perfil do usuário.
 * @returns {Promise<object>} Uma promessa que resolve com os dados do usuário registrado (incluindo token).
 * @throws {Error} Se a requisição falhar ou retornar um erro.
 */
const registerUser = async (userData) => {
  try {
    const res = await fetch('/api/users', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    const data = await res.json();

    if (res.ok) {
      return data;
    } else {
      throw new Error(data.message || 'Erro no registro');
    }
  } catch (error) {
    console.error('Erro ao registrar:', error);
    throw error;
  }
};

export { getEmployees, loginUser, registerUser };
