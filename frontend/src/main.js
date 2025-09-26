import './styles/style.css';
import { renderAdminServicesPage } from './pages/adminServices';
import { renderAdminAppointmentsPage } from './pages/adminAppointments';
import { showHomePage } from './pages/homePage';
import { showServicesPage } from './pages/servicesPage';
import { showAppointmentsPage } from './pages/appointmentsPage';
import { showLoginPage } from './pages/loginPage';
import { showRegisterPage } from './pages/registerPage';
import { showAdminPage } from './pages/adminPage';

document.addEventListener('DOMContentLoaded', () => {
  const contentDiv = document.getElementById('content');
  const navHome = document.getElementById('nav-home');
  const navServices = document.getElementById('nav-services');
  const navAppointments = document.getElementById('nav-appointments');
  const navLogin = document.getElementById('nav-login');
  const navAdmin = document.getElementById('nav-admin');
  const navLogout = document.getElementById('nav-logout');

  const renderContent = (html) => {
    contentDiv.innerHTML = html;
  };

  // --- Navigation Update & Logout ---
  const updateNav = () => {
    const userInfo = localStorage.getItem('userInfo');
    if (userInfo) {
      navLogin.style.display = 'none';
      navLogout.style.display = 'block';
      // Show/hide admin link based on role
      const user = JSON.parse(userInfo);
      if (user.role === 'admin') {
        navAdmin.style.display = 'block';
      } else {
        navAdmin.style.display = 'none';
      }
    } else {
      navLogin.style.display = 'block';
      navLogout.style.display = 'none';
      navAdmin.style.display = 'none';
    }
  };

  const handleLogout = () => {
    console.log('Logout clicked');
    localStorage.removeItem('userInfo');
    alert('Logout bem-sucedido!');
    updateNav();
    showHomePage(renderContent);
  };

  // --- Event Listeners ---
  navHome.addEventListener('click', (e) => { e.preventDefault(); showHomePage(renderContent); });
  navServices.addEventListener('click', (e) => { e.preventDefault(); showServicesPage(renderContent); });
  navAppointments.addEventListener('click', (e) => { e.preventDefault(); showAppointmentsPage(renderContent); });
  navLogin.addEventListener('click', (e) => { e.preventDefault(); showLoginPage(renderContent, showHomePage, showRegisterPage, updateNav); });
  navAdmin.addEventListener('click', (e) => { e.preventDefault(); showAdminPage(renderContent, JSON.parse(localStorage.getItem('userInfo')), showServicesPage); });
  navLogout.addEventListener('click', (e) => { e.preventDefault(); handleLogout(); });

  // --- Initial Setup ---
  updateNav(); // Update nav state on load
  showHomePage(renderContent);
});