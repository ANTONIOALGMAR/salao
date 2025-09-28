import './styles/style.css';
import { showHomePage } from './pages/homePage';
import { showServicesPage } from './pages/servicesPage';
import { showAppointmentsPage } from './pages/appointmentsPage';
import { showLoginPage } from './pages/loginPage';
import { showRegisterPage } from './pages/registerPage';
import { showAdminPage } from './pages/adminPage';
import { showCustomerDashboard } from './pages/customerDashboard';
import { Layout } from './components/Layout';

document.addEventListener('DOMContentLoaded', () => {
  const appDiv = document.getElementById('app');

  let navHome,
    navServices,
    navBookAppointment,
    navCustomerDashboard,
    navLogin,
    navAdmin,
    navLogout;

  const updateNav = () => {
    navHome = document.getElementById('nav-home');
    navServices = document.getElementById('nav-services');
    navBookAppointment = document.getElementById('nav-book-appointment');
    navCustomerDashboard = document.getElementById('nav-customer-dashboard');
    navLogin = document.getElementById('nav-login');
    navAdmin = document.getElementById('nav-admin');
    navLogout = document.getElementById('nav-logout');

    const userInfo = localStorage.getItem('userInfo');
    if (userInfo) {
      const user = JSON.parse(userInfo);
      navLogin.style.display = 'none';
      navLogout.style.display = 'block';

      if (user.role === 'admin') {
        navAdmin.style.display = 'block';
        navBookAppointment.style.display = 'none';
        navCustomerDashboard.style.display = 'none';
      } else {
        // client
        navAdmin.style.display = 'none';
        navBookAppointment.style.display = 'block';
        navCustomerDashboard.style.display = 'block';
      }
    } else {
      // guest
      navLogin.style.display = 'block';
      navLogout.style.display = 'none';
      navAdmin.style.display = 'none';
      navBookAppointment.style.display = 'none';
      navCustomerDashboard.style.display = 'none';
    }
  };

  const renderContent = (html) => {
    appDiv.innerHTML = Layout(html); // Renderiza o Layout com o conteúdo fornecido
    updateNav(); // Atualiza a navegação após a renderização do Layout

    /**
     * @function handleLogout
     * @description Lida com a ação de logout do usuário.
     */
    const handleLogout = () => {
      console.log('Logout clicked');
      localStorage.removeItem('userInfo'); // Remove as informações do usuário do armazenamento local
      alert('Logout bem-sucedido!');
      updateNav(); // Atualiza a navegação
      showHomePage(renderContent); // Redireciona para a página inicial
    };

    // --- Configuração dos Listeners de Eventos para a Navegação ---
    // Estes listeners são reatribuídos a cada renderização de conteúdo para garantir que funcionem com os novos elementos do DOM
    navHome.addEventListener('click', (e) => {
      e.preventDefault();
      showHomePage(renderContent);
    });
    navServices.addEventListener('click', (e) => {
      e.preventDefault();
      showServicesPage(renderContent);
    });
    navBookAppointment.addEventListener('click', (e) => {
      e.preventDefault();
      showAppointmentsPage(renderContent);
    });
    navCustomerDashboard.addEventListener('click', (e) => {
      e.preventDefault();
      showCustomerDashboard(renderContent);
    });
    navLogin.addEventListener('click', (e) => {
      e.preventDefault();
      showLoginPage(renderContent, showHomePage, showRegisterPage, updateNav);
    });
    navAdmin.addEventListener('click', (e) => {
      e.preventDefault();
      showAdminPage(
        renderContent,
        JSON.parse(localStorage.getItem('userInfo')),
        showServicesPage,
        renderContent,
      );
    });
    navLogout.addEventListener('click', (e) => {
      e.preventDefault();
      handleLogout();
    });
  };

  // Initial render
  showHomePage(renderContent);
});
