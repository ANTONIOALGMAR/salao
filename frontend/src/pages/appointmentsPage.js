import { getEmployees } from '../services/userService';
import { getServices } from '../services/serviceService';
import {
  getAvailableSlots,
  getUserAppointments,
  updateAppointmentStatus,
  deleteAppointment,
  createAppointment,
} from '../services/appointmentService';

const showAppointmentsPage = async (renderContent) => {
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

  const populateEmployees = async () => {
    try {
      const employees = await getEmployees(userInfo.token);
      employeeSelect.innerHTML = '<option value="">Selecione um profissional</option>';
      employees.forEach(emp => {
        const option = document.createElement('option');
        option.value = emp._id;
        option.textContent = emp.name;
        employeeSelect.appendChild(option);
      });
    } catch (error) {
      console.error('Erro ao buscar profissionais:', error);
    }
  };

  const populateServices = async () => {
    try {
      const services = await getServices();
      serviceSelect.innerHTML = '<option value="">Selecione um serviço</option>';
      services.forEach(service => {
        const option = document.createElement('option');
        option.value = service._id;
        option.textContent = `${service.name} (R$ ${service.price.toFixed(2)})`;
        serviceSelect.appendChild(option);
      });
    } catch (error) {
      console.error('Erro ao buscar serviços:', error);
    }
  };

  const populateAvailableSlots = async () => {
    const employeeId = employeeSelect.value;
    const date = appointmentDateInput.value;
    if (!employeeId || !date) {
      timeSlotSelect.innerHTML = '<option value="">Selecione profissional e data</option>';
      return;
    }

    try {
      const slots = await getAvailableSlots(employeeId, date);
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
    } catch (error) {
      console.error('Erro ao buscar horários:', error);
    }
  };

  const renderMyAppointments = async () => {
    try {
      const appointments = await getUserAppointments(userInfo.token);
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
                await updateAppointmentStatus(appointmentId, newStatus, userInfo.token);
                alert('Status do agendamento atualizado!');
                renderMyAppointments(); // Refresh list
              } catch (error) {
                alert(error.message);
              }
            }
          });
        });

        document.querySelectorAll('.delete-appointment-btn').forEach(button => {
          button.addEventListener('click', async (e) => {
            const appointmentId = e.target.dataset.id;
            if (confirm('Tem certeza que deseja excluir este agendamento?')) {
              try {
                await deleteAppointment(appointmentId, userInfo.token);
                alert('Agendamento excluído com sucesso!');
                renderMyAppointments(); // Refresh list
              } catch (error) {
                alert(error.message);
              }
            }
          });
        });

      } else {
        myAppointmentsListDiv.innerHTML = '<p>Nenhum agendamento encontrado.</p>';
      }
    } catch (error) {
      myAppointmentsListDiv.innerHTML = `<p>${error.message}</p>`;
    }
  };

  appointmentForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const appointmentData = {
      employee: employeeSelect.value,
      service: serviceSelect.value,
      date: appointmentDateInput.value,
      startTime: timeSlotSelect.value,
    };

    try {
      await createAppointment(appointmentData, userInfo.token);
      alert('Agendamento criado com sucesso!');
      renderMyAppointments();
    } catch (error) {
      alert(error.message);
    }
  });

  employeeSelect.addEventListener('change', populateAvailableSlots);
  appointmentDateInput.addEventListener('change', populateAvailableSlots);

  populateEmployees();
  populateServices();
  renderMyAppointments();
};

export { showAppointmentsPage };
