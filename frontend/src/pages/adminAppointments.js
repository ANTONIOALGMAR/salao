export const renderAdminAppointmentsPage = (adminContentArea, userInfo) => {
  adminContentArea.innerHTML = `
    <div id="admin-appointments-container" class="bg-gray-100 p-6 rounded-lg shadow-md">
      <h3 class="text-xl font-semibold mb-4">Todos os Agendamentos</h3>
      <div id="all-appointments-list">
        <p>Carregando agendamentos...</p>
      </div>
    </div>
  `;

  const allAppointmentsListDiv = document.getElementById(
    'all-appointments-list',
  );

  const fetchAllAppointments = async () => {
    console.log('Fetching all appointments with token:', userInfo.token);
    try {
      const res = await fetch('/api/appointments', {
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
        },
      });
      const appointments = await res.json();
      console.log('All appointments received:', appointments);

      if (res.ok) {
        if (appointments.length > 0) {
          allAppointmentsListDiv.innerHTML = appointments
            .map(
              (app) => `
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
          `,
            )
            .join('');

          document.querySelectorAll('.status-select').forEach((select) => {
            select.addEventListener('change', async (e) => {
              const appointmentId = e.target.dataset.id;
              const newStatus = e.target.value;
              if (
                confirm(
                  `Tem certeza que deseja alterar o status para ${newStatus}?`,
                )
              ) {
                try {
                  const updateRes = await fetch(
                    `/api/appointments/${appointmentId}`,
                    {
                      method: 'PUT',
                      headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${userInfo.token}`,
                      },
                      body: JSON.stringify({ status: newStatus }),
                    },
                  );
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

          document
            .querySelectorAll('.delete-appointment-btn')
            .forEach((button) => {
              button.addEventListener('click', async (e) => {
                const appointmentId = e.target.dataset.id;
                if (
                  confirm('Tem certeza que deseja excluir este agendamento?')
                ) {
                  try {
                    const deleteRes = await fetch(
                      `/api/appointments/${appointmentId}`,
                      {
                        method: 'DELETE',
                        headers: {
                          Authorization: `Bearer ${userInfo.token}`,
                        },
                      },
                    );
                    if (deleteRes.ok) {
                      alert('Agendamento excluído com sucesso!');
                      fetchAllAppointments(); // Refresh list
                    } else {
                      const errorData = await deleteRes.json();
                      alert(
                        errorData.message || 'Erro ao excluir agendamento.',
                      );
                    }
                  } catch (error) {
                    console.error('Erro ao excluir agendamento:', error);
                    alert('Erro ao excluir agendamento.');
                  }
                }
              });
            });
        } else {
          allAppointmentsListDiv.innerHTML =
            '<p>Nenhum agendamento encontrado.</p>';
        }
      } else {
        allAppointmentsListDiv.innerHTML = `<p>Erro ao carregar agendamentos: ${appointments.message || 'Erro desconhecido'}</p>`;
      }
    } catch (error) {
      console.error('Erro ao buscar agendamentos:', error);
      allAppointmentsListDiv.innerHTML =
        '<p>Erro ao buscar agendamentos. Tente novamente mais tarde.</p>';
    }
  };

  fetchAllAppointments();
};
