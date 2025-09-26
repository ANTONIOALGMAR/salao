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
