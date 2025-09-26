import './style.css';
import { renderAdminServicesPage } from './pages/adminServices';
import { renderAdminAppointmentsPage } from './pages/adminAppointments';

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

  // --- Page Rendering Functions ---
  const showHomePage = () => {
    renderContent(`
      <h2 class="text-2xl font-semibold mb-4">Bem-vindo ao Salão de Beleza!</h2>
      <p>Agende seus serviços de beleza favoritos de forma rápida e fácil.</p>
      <p>Explore nossos serviços e encontre o horário perfeito para você.</p>
    `);
  };

  const showServicesPage = async () => {
    renderContent(`
      <h2 class="text-2xl font-semibold mb-4">Nossos Serviços</h2>
      <div id="services-list" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <!-- Services will be loaded here -->
        <p>Carregando serviços...</p>
      </div>
    `);
    const servicesListDiv = document.getElementById('services-list');
    try {
      const res = await fetch('/api/services');
      const services = await res.json();

      if (res.ok) {
        if (services.length > 0) {
          servicesListDiv.innerHTML = services.map(service => `
            <div class="bg-white p-4 rounded-lg shadow-md">
              <h3 class="text-xl font-bold mb-2">${service.name}</h3>
              <p class="text-gray-700 mb-2">${service.description}</p>
              <p class="text-lg font-semibold text-blue-600">R$ ${service.price.toFixed(2)}</p>
              <p class="text-sm text-gray-500">Duração: ${service.duration} minutos</p>
              <button class="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Agendar</button>
            </div>
          `).join('');
        } else {
          servicesListDiv.innerHTML = '<p>Nenhum serviço disponível no momento.</p>';
        }
      } else {
        servicesListDiv.innerHTML = `<p>Erro ao carregar serviços: ${services.message || 'Erro desconhecido'}</p>`;
      }
    } catch (error) {
      console.error('Erro ao buscar serviços:', error);
      servicesListDiv.innerHTML = '<p>Erro ao buscar serviços. Tente novamente mais tarde.</p>';
    }
  };

  const showAppointmentsPage = async () => {
    renderContent(`
      <h2 class="text-2xl font-semibold mb-4">Agendar Horário</h2>
      <div id="appointment-form-container" class="max-w-md mx-auto bg-gray-100 p-6 rounded-lg shadow-md">
        <form id="appointment-form">
          <div class="mb-4">
            <label for="employee-select" class="block text-gray-700 text-sm font-bold mb-2">Profissional:</label>
            <select id="employee-select" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" required>
              <option value="">Selecione um profissional</option>
            </select>
          </div>
          <div class="mb-4">
            <label for="service-select" class="block text-gray-700 text-sm font-bold mb-2">Serviço:</label>
            <select id="service-select" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" required>
              <option value="">Selecione um serviço</option>
            </select>
          </div>
          <div class="mb-4">
            <label for="appointment-date" class="block text-gray-700 text-sm font-bold mb-2">Data:</label>
            <input type="date" id="appointment-date" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" required>
          </div>
          <div class="mb-4">
            <label for="time-slot-select" class="block text-gray-700 text-sm font-bold mb-2">Horário Disponível:</label>
            <select id="time-slot-select" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" required>
              <option value="">Selecione um horário</option>
            </select>
          </div>
          <button type="submit" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">Confirmar Agendamento</button>
        </form>
      </div>
      <h3 class="text-xl font-semibold mt-8 mb-4">Meus Agendamentos</h3>
      <div id="my-appointments-list" class="bg-white p-6 rounded-lg shadow-lg">
        <p>Carregando seus agendamentos...</p>
      </div>
    `);

    const employeeSelect = document.getElementById('employee-select');
    const serviceSelect = document.getElementById('service-select');
    const appointmentDateInput = document.getElementById('appointment-date');
    const timeSlotSelect = document.getElementById('time-slot-select');
    const appointmentForm = document.getElementById('appointment-form');
    const myAppointmentsListDiv = document.getElementById('my-appointments-list');

    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    if (!userInfo) {
      myAppointmentsListDiv.innerHTML = '<p>Por favor, faça login para ver e agendar horários.</p>';
      return;
    }

    // Fetch Employees (users with role 'employee')
    const fetchEmployees = async () => {
      try {
        const res = await fetch('/api/users?role=employee', {
          headers: {
            Authorization: `Bearer ${userInfo.token}`,
          },
        });
        const employees = await res.json();
        console.log('Dados de profissionais recebidos:', employees);
        if (res.ok) {
          employeeSelect.innerHTML = '<option value="">Selecione um profissional</option>';
          console.log('Populating employeeSelect:', employeeSelect);
          employees.forEach(emp => {
            const option = document.createElement('option');
            option.value = emp._id;
            option.textContent = emp.name;
            employeeSelect.appendChild(option);
            console.log('Added employee option:', option);
          });
        } else {
          console.error('Erro ao buscar profissionais:', employees.message);
        }
      } catch (error) {
        console.error('Erro ao buscar profissionais:', error);
      }
    };

    // Fetch Services
    const fetchServices = async () => {
      try {
        const res = await fetch('/api/services');
        const services = await res.json();
        if (res.ok) {
          serviceSelect.innerHTML = '<option value="">Selecione um serviço</option>';
          services.forEach(service => {
            const option = document.createElement('option');
            option.value = service._id;
            option.textContent = `${service.name} (R$ ${service.price.toFixed(2)})`;
            serviceSelect.appendChild(option);
          });
        } else {
          console.error('Erro ao buscar serviços:', services.message);
        }
      } catch (error) {
        console.error('Erro ao buscar serviços:', error);
      }
    };

    // Fetch Available Slots
    const fetchAvailableSlots = async () => {
      const employeeId = employeeSelect.value;
      const date = appointmentDateInput.value;
      if (!employeeId || !date) {
        timeSlotSelect.innerHTML = '<option value="">Selecione profissional e data</option>';
        return;
      }

      try {
        const res = await fetch(`/api/appointments/available/${employeeId}/${date}`);
        const slots = await res.json();
        if (res.ok) {
          timeSlotSelect.innerHTML = '<option value="">Selecione um horário</option>';
          if (slots.length > 0) {
            slots.forEach(slot => {
              const option = document.createElement('option');
              option.value = slot;
              option.textContent = slot;
              timeSlotSelect.appendChild(option);
            });
          } else {
            timeSlotSelect.innerHTML = '<option value="">Nenhum horário disponível</option>';
          }
        } else {
          console.error('Erro ao buscar horários:', slots.message);
        }
      } catch (error) {
        console.error('Erro ao buscar horários:', error);
      }
    };

    // Fetch User Appointments
    const fetchMyAppointments = async () => {
      try {
        const res = await fetch('/api/appointments', {
          headers: {
            Authorization: `Bearer ${userInfo.token}`,
          },
        });
        const appointments = await res.json();

        if (res.ok) {
          if (appointments.length > 0) {
            myAppointmentsListDiv.innerHTML = appointments.map(app => `
              <div class="bg-white p-4 rounded-lg shadow-md mb-2">
                <p><strong>Cliente:</strong> ${app.client.name}</p>
                <p><strong>Profissional:</strong> ${app.employee.name}</p>
                <p><strong>Serviço:</strong> ${app.service.name}</p>
                <p><strong>Data:</strong> ${new Date(app.date).toLocaleDateString()}</p>
                <p><strong>Horário:</strong> ${app.startTime} - ${app.endTime}</p>
                <p><strong>Status:</strong> 
                  <select class="status-select" data-id="${app._id}">
                    <option value="pending" ${app.status === 'pending' ? 'selected' : ''}>Pendente</option>
                    <option value="confirmed" ${app.status === 'confirmed' ? 'selected' : ''}>Confirmado</option>
                    <option value="completed" ${app.status === 'completed' ? 'selected' : ''}>Concluído</option>
                    <option value="cancelled" ${app.status === 'cancelled' ? 'selected' : ''}>Cancelado</option>
                  </select>
                </p>
                <button class="mt-4 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded delete-appointment-btn" data-id="${app._id}">Excluir</button>
              </div>
            `).join('');

            document.querySelectorAll('.status-select').forEach(select => {
              select.addEventListener('change', async (e) => {
                const appointmentId = e.target.dataset.id;
                const newStatus = e.target.value;
                if (confirm(`Tem certeza que deseja alterar o status para ${newStatus}?`)) {
                  try {
                    const updateRes = await fetch(`/api/appointments/${appointmentId}`, {
                      method: 'PUT',
                      headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${userInfo.token}`,
                      },
                      body: JSON.stringify({ status: newStatus }),
                    });
                    if (updateRes.ok) {
                      alert('Status do agendamento atualizado!');
                      fetchAllAppointments(); // Refresh list
                    } else {
                      const errorData = await updateRes.json();
                      alert(errorData.message || 'Erro ao atualizar status.');
                    }
                  } catch (error) {
                    console.error('Erro ao atualizar status:', error);
                    alert('Erro ao atualizar status.');
                  }
                }
              });
            });

            document.querySelectorAll('.delete-appointment-btn').forEach(button => {
              button.addEventListener('click', async (e) => {
                const appointmentId = e.target.dataset.id;
                if (confirm('Tem certeza que deseja excluir este agendamento?')) {
                  try {
                    const deleteRes = await fetch(`/api/appointments/${appointmentId}`, {
                      method: 'DELETE',
                      headers: {
                        Authorization: `Bearer ${userInfo.token}`,
                      },
                    });
                    if (deleteRes.ok) {
                      alert('Agendamento excluído com sucesso!');
                      fetchAllAppointments(); // Refresh list
                    } else {
                      const errorData = await deleteRes.json();
                      alert(errorData.message || 'Erro ao excluir agendamento.');
                    }
                  } catch (error) {
                    console.error('Erro ao excluir agendamento:', error);
                    alert('Erro ao excluir agendamento.');
                  }
                }
              });
            });

            } else {
              allAppointmentsListDiv.innerHTML = '<p>Nenhum agendamento encontrado.</p>';
            }
          } else {
            allAppointmentsListDiv.innerHTML = `<p>Erro ao carregar agendamentos: ${appointments.message || 'Erro desconhecido'}</p>`;
          }
        } catch (error) {
          console.error('Erro ao buscar agendamentos:', error);
          allAppointmentsListDiv.innerHTML = '<p>Erro ao buscar agendamentos. Tente novamente mais tarde.</p>';
        }
      };

      fetchAllAppointments();
    };

  const showLoginPage = () => {
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
    // TODO: Implement login logic
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
      loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        try {
          const res = await fetch('/api/users/login', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
          });

          const data = await res.json();

          if (res.ok) {
            localStorage.setItem('userInfo', JSON.stringify(data));
            alert('Login bem-sucedido!');
            // Redirect or update UI
            showHomePage(); // For now, just go to home page
            updateNav();
          } else {
            alert(data.message || 'Erro no login');
          }
        } catch (error) {
          console.error('Erro ao fazer login:', error);
          alert('Erro ao fazer login. Tente novamente.');
        }
      });
    }

    const registerLink = document.getElementById('register-link');
    if (registerLink) {
      registerLink.addEventListener('click', (e) => { e.preventDefault(); showRegisterPage(); });
    }
  };

  const showRegisterPage = () => {
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
          const res = await fetch('/api/users', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name, email, password, role }),
          });

          const data = await res.json();

          if (res.ok) {
            localStorage.setItem('userInfo', JSON.stringify(data));
            alert('Registro bem-sucedido!');
            showHomePage();
            updateNav();
          } else {
            alert(data.message || 'Erro no registro');
          }
        } catch (error) {
          console.error('Erro ao registrar:', error);
          alert('Erro ao registrar. Tente novamente.');
        }
      });
    }

    const loginLink = document.getElementById('login-link');
    if (loginLink) {
      loginLink.addEventListener('click', (e) => { e.preventDefault(); showLoginPage(); });
    }
  };

  const showAdminPage = () => {
    console.log('showAdminPage executed!');
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    if (!userInfo || userInfo.role !== 'admin') {
      renderContent(`
        <h2 class="text-2xl font-semibold mb-4">Acesso Negado</h2>
        <p>Você não tem permissão para acessar esta página.</p>
      `);
      return;
    }

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
    showHomePage();
  };

  // --- Event Listeners ---
  navHome.addEventListener('click', (e) => { e.preventDefault(); showHomePage(); });
  navServices.addEventListener('click', (e) => { e.preventDefault(); showServicesPage(); });
  navAppointments.addEventListener('click', (e) => { e.preventDefault(); showAppointmentsPage(); });
  navLogin.addEventListener('click', (e) => { e.preventDefault(); showLoginPage(); });
  navAdmin.addEventListener('click', (e) => { e.preventDefault(); showAdminPage(); });
  navLogout.addEventListener('click', (e) => { e.preventDefault(); handleLogout(); });

  // --- Initial Setup ---
  updateNav(); // Update nav state on load
  showHomePage();
});