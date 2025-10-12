import { getEmployeeAppointments } from '../services/appointmentService';
import { Layout } from '../components/Layout';

const employeeSchedulePage = (renderContent) => {
  const user = JSON.parse(localStorage.getItem('userInfo'));

  if (!user || user.role !== 'employee') {
    renderContent('<p>Acesso negado. Apenas funcionários podem ver esta página.</p>');
    return;
  }

  const employeeId = user._id;
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  const formattedDate = `${year}-${month}-${day}`;

  const fetchAppointments = async (date) => {
    try {
      const appointments = await getEmployeeAppointments(employeeId, date, date);
      displayAppointments(appointments);
    } catch (error) {
      console.error('Erro ao buscar agendamentos:', error);
      renderContent('<p>Erro ao carregar agendamentos.</p>');
    }
  };

  const displayAppointments = (appointments) => {
    let appointmentsHtml = '';
    if (appointments.length === 0) {
      appointmentsHtml = '<p>Nenhum agendamento para esta data.</p>';
    } else {
      appointmentsHtml = `
        <h3 class="text-xl font-semibold mb-4">Agendamentos do Dia</h3>
        <ul class="space-y-2">
          ${appointments
            .map(
              (app) => `
              <li class="bg-gray-100 p-3 rounded-lg shadow-sm">
                <p><strong>Cliente:</strong> ${app.client.name}</p>
                <p><strong>Serviço:</strong> ${app.service.name}</p>
                <p><strong>Hora:</strong> ${app.startTime} - ${app.endTime}</p>
                <p><strong>Status:</strong> ${app.status}</p>
              </li>
            `,
            )
            .join('')}
        </ul>
      `;
    }
    document.getElementById('appointments-list').innerHTML = appointmentsHtml;
  };

  renderContent(`
    <div class="container mx-auto p-4">
      <h2 class="text-3xl font-bold mb-6">Meu Cronograma</h2>
      <div class="mb-4">
        <label for="schedule-date" class="block text-gray-700 text-sm font-bold mb-2">Selecionar Data:</label>
        <input type="date" id="schedule-date" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" value="${formattedDate}">
      </div>
      <div id="appointments-list"></div>
    </div>
  `);

  document.getElementById('schedule-date').addEventListener('change', (event) => {
    fetchAppointments(event.target.value);
  });

  fetchAppointments(formattedDate);
};

export { employeeSchedulePage };
