// Importa a função de serviço para realizar o registro de novos usuários
import { registerUser } from '../services/userService';

/**
 * @function showRegisterPage
 * @description Renderiza a página de registro, permitindo ao usuário criar uma nova conta.
 * @param {function} renderContent - Função para renderizar o conteúdo principal na div #content.
 * @param {function} showHomePage - Função para exibir a página inicial após o registro bem-sucedido.
 * @param {function} showLoginPage - Função para exibir a página de login.
 * @param {function} updateNav - Função para atualizar a navegação após o registro.
 */
const showRegisterPage = (
  renderContent,
  showHomePage,
  showLoginPage,
  updateNav,
) => {
  // Renderiza a estrutura HTML do formulário de registro
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

  // Obtém o formulário de registro
  const registerForm = document.getElementById('register-form');
  if (registerForm) {
    // Adiciona um listener para o evento de submit do formulário
    registerForm.addEventListener('submit', async (e) => {
      e.preventDefault(); // Previne o comportamento padrão de submit do formulário
      const name = document.getElementById('name').value;
      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;
      const confirmPassword = document.getElementById('confirmPassword').value;
      const role = document.getElementById('role').value;

      // Validação simples de senha
      if (password !== confirmPassword) {
        alert('As senhas não coincidem!');
        return;
      }

      try {
        // Tenta realizar o registro via API
        const data = await registerUser({ name, email, password, role });
        localStorage.setItem('userInfo', JSON.stringify(data)); // Armazena as informações do usuário
        alert('Registro bem-sucedido!');
        showHomePage(renderContent); // Redireciona para a página inicial
        updateNav(); // Atualiza a navegação
      } catch (error) {
        alert(error.message); // Exibe mensagem de erro em caso de falha no registro
      }
    });
  }

  // Obtém o link para a página de login
  const loginLink = document.getElementById('login-link');
  if (loginLink) {
    // Adiciona um listener para o clique no link de login
    loginLink.addEventListener('click', (e) => {
      e.preventDefault();
      showLoginPage(renderContent, showHomePage, showRegisterPage, updateNav);
    });
  }
};

export { showRegisterPage };
