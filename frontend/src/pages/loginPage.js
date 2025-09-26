import { loginUser } from '../services/userService';

const showLoginPage = (renderContent, showHomePage, showRegisterPage, updateNav) => {
  renderContent(`
    <h2 class="text-2xl font-semibold mb-4">Login</h2>
    <form id="login-form" class="max-w-sm mx-auto bg-gray-100 p-6 rounded-lg shadow-md">
      <div class="mb-4">
        <label for="email" class="block text-gray-700 text-sm font-bold mb-2">Email:</label>
        <input type="email" id="email" name="email" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" required>
      </div>
      <div class="mb-6">
        <label for="password" class="block text-gray-700 text-sm font-bold mb-2">Senha:</label>
        <input type="password" id="password" name="password" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline" required>
      </div>
      <div class="flex items-center justify-between">
        <button type="submit" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">Entrar</button>
        <a href="#" id="register-link" class="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800">Criar Conta</a>
      </div>
    </form>
  `);

  const loginForm = document.getElementById('login-form');
  if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;

      try {
        const data = await loginUser({ email, password });
        localStorage.setItem('userInfo', JSON.stringify(data));
        alert('Login bem-sucedido!');
        showHomePage(renderContent);
        updateNav();
      } catch (error) {
        alert(error.message);
      }
    });
  }

  const registerLink = document.getElementById('register-link');
  if (registerLink) {
    registerLink.addEventListener('click', (e) => { e.preventDefault(); showRegisterPage(renderContent, showHomePage, showLoginPage, updateNav); });
  }
};

export { showLoginPage };
