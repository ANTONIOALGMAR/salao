import { registerUser } from '../services/userService';

const showRegisterPage = (renderContent, showHomePage, showLoginPage, updateNav) => {
  renderContent(`
    <h2 class="text-2xl font-semibold mb-4">Criar Conta</h2>
    <form id="register-form" class="max-w-sm mx-auto bg-gray-100 p-6 rounded-lg shadow-md">
      <div class="mb-4">
        <label for="name" class="block text-gray-700 text-sm font-bold mb-2">Nome:</label>
        <input type="text" id="name" name="name" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" required>
      </div>
      <div class="mb-4">
        <label for="email" class="block text-gray-700 text-sm font-bold mb-2">Email:</label>
        <input type="email" id="email" name="email" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" required>
      </div>
      <div class="mb-6">
        <label for="password" class="block text-gray-700 text-sm font-bold mb-2">Senha:</label>
        <input type="password" id="password" name="password" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline" required>
      </div>
      <div class="mb-6">
        <label for="confirmPassword" class="block text-gray-700 text-sm font-bold mb-2">Confirmar Senha:</label>
        <input type="password" id="confirmPassword" name="confirmPassword" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline" required>
      </div>
      <div class="mb-4">
        <label for="role" class="block text-gray-700 text-sm font-bold mb-2">Tipo de Usuário:</label>
        <select id="role" name="role" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
          <option value="client">Cliente</option>
          <option value="employee">Funcionário</option>
          <option value="admin">Administrador</option>
        </select>
      </div>
      <div class="flex items-center justify-between">
        <button type="submit" class="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">Registrar</button>
        <a href="#" id="login-link" class="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800">Já tem conta? Faça Login</a>
      </div>
    </form>
  `);
  const registerForm = document.getElementById('register-form');
  if (registerForm) {
    registerForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const name = document.getElementById('name').value;
      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;
      const confirmPassword = document.getElementById('confirmPassword').value;
      const role = document.getElementById('role').value;

      if (password !== confirmPassword) {
        alert('As senhas não coincidem!');
        return;
      }

      try {
        const data = await registerUser({ name, email, password, role });
        localStorage.setItem('userInfo', JSON.stringify(data));
        alert('Registro bem-sucedido!');
        showHomePage(renderContent);
        updateNav();
      } catch (error) {
        alert(error.message);
      }
    });
  }

  const loginLink = document.getElementById('login-link');
  if (loginLink) {
    loginLink.addEventListener('click', (e) => { e.preventDefault(); showLoginPage(renderContent, showHomePage, showRegisterPage, updateNav); });
  }
};

export { showRegisterPage };
