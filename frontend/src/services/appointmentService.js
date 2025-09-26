
const getAvailableSlots = async (employeeId, date) => {
  try {
    const res = await fetch(`/api/appointments/available/${employeeId}/${date}`);
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
};
