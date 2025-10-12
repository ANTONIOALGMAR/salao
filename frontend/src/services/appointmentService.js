/**
 * @function getAvailableSlots
 * @description Busca horários disponíveis para agendamento de um profissional em uma data específica.
 * @param {string} employeeId - ID do profissional.
 * @param {string} date - Data para buscar horários (formato YYYY-MM-DD).
 * @returns {Promise<Array>} Uma promessa que resolve com uma lista de horários disponíveis.
 * @throws {Error} Se a requisição falhar ou retornar um erro.
 */
const getAvailableSlots = async (employeeId, date) => {
  try {
    const res = await fetch(
      `/api/appointments/available/${employeeId}/${date}`,
    );
    const slots = await res.json();
    if (res.ok) {
      return slots;
    } else {
      throw new Error(slots.message || 'Erro ao buscar horários');
    }
  } catch (error) {
    console.error('Erro ao buscar horários:', error);
    throw error;
  }
};

/**
 * @function getUserAppointments
 * @description Busca todos os agendamentos do usuário logado.
 * @param {string} token - Token de autenticação do usuário.
 * @returns {Promise<Array>} Uma promessa que resolve com uma lista de agendamentos do usuário.
 * @throws {Error} Se a requisição falhar ou retornar um erro.
 */
const getUserAppointments = async (token) => {
  try {
    const res = await fetch('/api/appointments', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const appointments = await res.json();
    if (res.ok) {
      return appointments;
    } else {
      throw new Error(appointments.message || 'Erro ao carregar agendamentos');
    }
  } catch (error) {
    console.error('Erro ao buscar agendamentos:', error);
    throw error;
  }
};

/**
 * @function updateAppointmentStatus
 * @description Atualiza o status de um agendamento específico.
 * @param {string} appointmentId - ID do agendamento a ser atualizado.
 * @param {string} status - Novo status do agendamento (ex: 'confirmed', 'cancelled').
 * @param {string} token - Token de autenticação do usuário.
 * @returns {Promise<void>} Uma promessa que resolve sem valor em caso de sucesso.
 * @throws {Error} Se a requisição falhar ou retornar um erro.
 */
const updateAppointmentStatus = async (appointmentId, status, token) => {
  try {
    const res = await fetch(`/api/appointments/${appointmentId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ status }),
    });
    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || 'Erro ao atualizar status.');
    }
  } catch (error) {
    console.error('Erro ao atualizar status:', error);
    throw error;
  }
};

/**
 * @function deleteAppointment
 * @description Exclui um agendamento específico.
 * @param {string} appointmentId - ID do agendamento a ser excluído.
 * @param {string} token - Token de autenticação do usuário.
 * @returns {Promise<void>} Uma promessa que resolve sem valor em caso de sucesso.
 * @throws {Error} Se a requisição falhar ou retornar um erro.
 */
const deleteAppointment = async (appointmentId, token) => {
  try {
    const res = await fetch(`/api/appointments/${appointmentId}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || 'Erro ao excluir agendamento.');
    }
  } catch (error) {
    console.error('Erro ao excluir agendamento:', error);
    throw error;
  }
};

/**
 * @function createAppointment
 * @description Cria um novo agendamento.
 * @param {object} appointmentData - Dados do agendamento a ser criado (employee, service, date, startTime).
 * @param {string} token - Token de autenticação do usuário.
 * @returns {Promise<object>} Uma promessa que resolve com os dados do agendamento criado.
 * @throws {Error} Se a requisição falhar ou retornar um erro.
 */
const createAppointment = async (appointmentData, token) => {
  try {
    const res = await fetch('/api/appointments', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(appointmentData),
    });
    const data = await res.json();
    if (res.ok) {
      return data;
    } else {
      throw new Error(data.message || 'Erro ao criar agendamento.');
    }
  } catch (error) {
    console.error('Erro ao criar agendamento:', error);
    throw error;
  }
};

export {
  getAvailableSlots,
  getUserAppointments,
  updateAppointmentStatus,
  deleteAppointment,
  createAppointment,
  getEmployeeAppointments,
};

/**
 * @function getEmployeeAppointments
 * @description Busca agendamentos para um profissional específico em um período.
 * @param {string} employeeId - ID do profissional.
 * @param {string} startDate - Data de início (formato YYYY-MM-DD).
 * @param {string} endDate - Data de fim (formato YYYY-MM-DD).
 * @returns {Promise<Array>} Uma promessa que resolve com uma lista de agendamentos do profissional.
 * @throws {Error} Se a requisição falhar ou retornar um erro.
 */
const getEmployeeAppointments = async (employeeId, startDate, endDate) => {
  try {
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    const token = userInfo ? userInfo.token : null;

    if (!token) {
      throw new Error('Usuário não autenticado.');
    }

    const res = await fetch(
      `/api/appointments/employee/${employeeId}?startDate=${startDate}&endDate=${endDate}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
    const appointments = await res.json();
    if (res.ok) {
      return appointments;
    } else {
      throw new Error(appointments.message || 'Erro ao carregar agendamentos do profissional.');
    }
  } catch (error) {
    console.error('Erro ao buscar agendamentos do profissional:', error);
    throw error;
  }
};
