import { renderAdminServicesPage } from './adminServices';
import { renderAdminAppointmentsPage } from './adminAppointments';

const showAdminPage = (renderContent, userInfo, showServicesPage) => {
  renderContent(`
    <h2 class="text-2xl font-semibold mb-4">Painel Administrativo</h2>
    <nav class="mb-6">
      <ul class="flex space-x-4">
        <li><button id="admin-nav-services" class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">Gerenciar Serviços</button></li>
        <li><button id="admin-nav-appointments" class="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400">Gerenciar Agendamentos</button></li>
      </ul>
    </nav>
    <div id="admin-content-area">
      <!-- Content for services or appointments will be loaded here -->
    </div>
  `);

  const adminContentArea = document.getElementById('admin-content-area');
  const adminNavServices = document.getElementById('admin-nav-services');
  const adminNavAppointments = document.getElementById('admin-nav-appointments');

  adminNavServices.addEventListener('click', () => renderAdminServicesPage(adminContentArea, userInfo, showServicesPage));
  adminNavAppointments.addEventListener('click', () => renderAdminAppointmentsPage(adminContentArea, userInfo));

  renderAdminServicesPage(adminContentArea, userInfo, showServicesPage); // Default view
};

export { showAdminPage };
