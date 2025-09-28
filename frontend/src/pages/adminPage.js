// Importa as funções de renderização para as sub-páginas administrativas de serviços e agendamentos
import { renderAdminServicesPage } from './adminServices';
import { renderAdminAppointmentsPage } from './adminAppointments';

/**
 * @function showAdminPage
 * @description Renderiza a página do painel administrativo, permitindo a navegação entre o gerenciamento de serviços e agendamentos.
 * @param {function} renderContent - Função para renderizar o conteúdo principal na div #content.
 * @param {object} userInfo - Objeto contendo as informações do usuário logado (admin).
 * @param {function} showServicesPage - Função para exibir a página de serviços (usada para atualizar a lista de serviços).
 */
const showAdminPage = (
  renderContent,
  userInfo,
  showServicesPage,
  renderContentFromMain,
) => {
  // Renderiza a estrutura HTML inicial do painel administrativo
  renderContent(`
    <h2 class="text-2xl font-semibold mb-4">Painel Administrativo</h2>
    <nav class="mb-6">
      <ul class="flex space-x-4">
        <li><button id="admin-nav-services" class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">Gerenciar Serviços</button></li>
        <li><button id="admin-nav-appointments" class="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400">Gerenciar Agendamentos</button></li>
      </ul>
    </nav>
    <div id="admin-content-area">
      <!-- O conteúdo para serviços ou agendamentos será carregado aqui -->
    </div>
  `);

  // Obtém referências aos elementos do DOM dentro da área administrativa
  const adminContentArea = document.getElementById('admin-content-area');
  const adminNavServices = document.getElementById('admin-nav-services');
  const adminNavAppointments = document.getElementById(
    'admin-nav-appointments',
  );

  // Adiciona listeners para os botões de navegação administrativa
  adminNavServices.addEventListener('click', () =>
    renderAdminServicesPage(
      adminContentArea,
      userInfo,
      showServicesPage,
      renderContentFromMain,
    ),
  );
  adminNavAppointments.addEventListener('click', () =>
    renderAdminAppointmentsPage(
      adminContentArea,
      userInfo,
      renderContentFromMain,
    ),
  );

  // Renderiza a página de gerenciamento de serviços como visualização padrão ao entrar no painel
  renderAdminServicesPage(
    adminContentArea,
    userInfo,
    showServicesPage,
    renderContentFromMain,
  ); // Visualização padrão
};

export { showAdminPage };
