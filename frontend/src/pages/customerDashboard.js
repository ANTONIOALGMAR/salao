// Importa a função de serviço para buscar agendamentos do usuário
import { getUserAppointments } from '../services/appointmentService';

/**
 * @function showCustomerDashboard
 * @description Renderiza o painel do cliente, exibindo seus agendamentos existentes.
 * @param {function} renderContent - Função para renderizar o conteúdo principal na div #content.
 */
const showCustomerDashboard = async (renderContent) => {
  // Tenta obter as informações do usuário logado
  const userInfo = JSON.parse(localStorage.getItem('userInfo'));
  // Se o usuário não estiver logado, exibe uma mensagem e encerra a função
  if (!userInfo) {
    renderContent('<p>Por favor, faça login para ver seus agendamentos.</p>');
    return;
  }

  // Renderiza a estrutura HTML inicial do painel de agendamentos do cliente
  renderContent(`
    <h2 class="text-2xl font-semibold mb-4">Meus Agendamentos</h2>
    <div id="customer-appointments-list" class="bg-white p-6 rounded-lg shadow-lg">
      <p>Carregando seus agendamentos...</p>
    </div>
  `);

  // Obtém a div onde a lista de agendamentos será exibida
  const appointmentsListDiv = document.getElementById(
    'customer-appointments-list',
  );

  try {
    // Busca os agendamentos do usuário logado via API
    const appointments = await getUserAppointments(userInfo.token);
    // Verifica se há agendamentos para exibir
    if (appointments.length > 0) {
      // Mapeia os agendamentos para o formato HTML e insere na div
      appointmentsListDiv.innerHTML = appointments
        .map(
          (app) => `
        <div class="bg-white p-4 rounded-lg shadow-md mb-2">
          <p><strong>Profissional:</strong> ${app.employee.name}</p>
          <p><strong>Serviço:</strong> ${app.service.name}</p>
          <p><strong>Data:</strong> ${new Date(app.date).toLocaleDateString()}</p>
          <p><strong>Horário:</strong> ${app.startTime} - ${app.endTime}</p>
          <p><strong>Status:</strong> ${app.status}</p>
        </div>
      `,
        )
        .join('');
    } else {
      // Mensagem exibida se o usuário não tiver agendamentos
      appointmentsListDiv.innerHTML = '<p>Você não tem nenhum agendamento.</p>';
    }
  } catch (error) {
    // Exibe mensagem de erro caso a busca falhe
    appointmentsListDiv.innerHTML = `<p>${error.message}</p>`;
  }
};

export { showCustomerDashboard };
