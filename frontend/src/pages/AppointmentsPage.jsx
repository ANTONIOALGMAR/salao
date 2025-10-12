import React, { useState, useEffect, useCallback } from 'react';
import { getEmployees } from '../services/userService';
import { getServices } from '../services/serviceService';
import {
  getAvailableSlots,
  getUserAppointments,
  createAppointment,
  deleteAppointment,
  updateAppointmentStatus,
} from '../services/appointmentService';
import authService from '../services/authService';

const AppointmentsPage = () => {
  // Estados para os dados da API
  const [employees, setEmployees] = useState([]);
  const [services, setServices] = useState([]);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [myAppointments, setMyAppointments] = useState([]);

  // Estados para o formulário
  const [selectedEmployee, setSelectedEmployee] = useState('');
  const [selectedService, setSelectedService] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedSlot, setSelectedSlot] = useState('');

  // Estados de UI (carregamento e erros)
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formError, setFormError] = useState('');

  // --- DATA FETCHING HOOKS ---

  // Hook para buscar os dados iniciais (serviços, funcionários, agendamentos)
  const fetchInitialData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const [employeesData, servicesData, appointmentsData] = await Promise.all([
        getEmployees(),
        getServices(),
        getUserAppointments(),
      ]);
      setEmployees(employeesData);
      setServices(servicesData);
      setMyAppointments(appointmentsData);
    } catch (err) {
      setError(err.message || 'Erro ao carregar os dados da página.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchInitialData();
  }, [fetchInitialData]);

  // Hook para buscar horários disponíveis quando o profissional ou a data mudam
  useEffect(() => {
    if (selectedEmployee && selectedDate) {
      const fetchSlots = async () => {
        try {
          setFormError('');
          const slots = await getAvailableSlots(selectedEmployee, selectedDate);
          setAvailableSlots(slots);
        } catch (err) {
          setFormError(err.message || 'Erro ao buscar horários disponíveis.');
          setAvailableSlots([]);
        }
      };
      fetchSlots();
    }
  }, [selectedEmployee, selectedDate]);

  // --- EVENT HANDLERS ---

  const handleCreateAppointment = async (e) => {
    e.preventDefault();
    if (!selectedEmployee || !selectedService || !selectedDate || !selectedSlot) {
      setFormError('Por favor, preencha todos os campos do formulário.');
      return;
    }

    try {
      setFormError('');
      const currentUser = authService.getCurrentUser();
      if (!currentUser) {
        setFormError('Você precisa estar logado para agendar.');
        return;
      }

      const appointmentData = {
        client: currentUser._id,
        employee: selectedEmployee,
        service: selectedService,
        date: selectedDate,
        startTime: selectedSlot,
      };

      await createAppointment(appointmentData);
      alert('Agendamento criado com sucesso!');
      // Resetar formulário e recarregar agendamentos
      setSelectedEmployee('');
      setSelectedService('');
      setSelectedDate('');
      setSelectedSlot('');
      setAvailableSlots([]);
      fetchInitialData(); // Recarrega tudo
    } catch (err) {
      setFormError(err.message || 'Não foi possível criar o agendamento.');
    }
  };

  const handleDelete = async (appointmentId) => {
    if (window.confirm('Tem certeza que deseja excluir este agendamento?')) {
      try {
        await deleteAppointment(appointmentId);
        alert('Agendamento excluído com sucesso.');
        fetchInitialData(); // Recarrega
      } catch (err) {
        setError(err.message || 'Erro ao excluir agendamento.');
      }
    }
  };

  const handleStatusUpdate = async (appointmentId, newStatus) => {
    try {
      await updateAppointmentStatus(appointmentId, newStatus);
      alert('Status atualizado com sucesso.');
      fetchInitialData(); // Recarrega
    } catch (err) {
      setError(err.message || 'Erro ao atualizar status.');
    }
  };

  // --- RENDER ---

  if (loading) {
    return <div className="text-center p-8">Carregando...</div>;
  }

  if (error) {
    return <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded m-4"><b>Erro:</b> {error}</div>;
  }

  return (
    <div className="container mx-auto p-4 space-y-8">
      {/* Seção do Formulário de Agendamento */}
      <div className="card">
        <h2 className="text-2xl font-semibold mb-4">Agendar Horário</h2>
        <form onSubmit={handleCreateAppointment} className="space-y-4">
          {formError && <p className="text-red-500 text-sm">{formError}</p>}
          
          <div className="form-group">
            <label htmlFor="employee-select" className="form-label">Profissional:</label>
            <select id="employee-select" value={selectedEmployee} onChange={(e) => setSelectedEmployee(e.target.value)} className="form-input" required>
              <option value="">Selecione um profissional</option>
              {employees.map((emp) => (
                <option key={emp._id} value={emp._id}>{emp.name}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="service-select" className="form-label">Serviço:</label>
            <select id="service-select" value={selectedService} onChange={(e) => setSelectedService(e.target.value)} className="form-input" required>
              <option value="">Selecione um serviço</option>
              {services.map((srv) => (
                <option key={srv._id} value={srv._id}>{srv.name} (R$ {srv.price.toFixed(2)})</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="appointment-date" className="form-label">Data:</label>
            <input type="date" id="appointment-date" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} className="form-input" required />
          </div>

          <div className="form-group">
            <label htmlFor="time-slot-select" className="form-label">Horário Disponível:</label>
            <select id="time-slot-select" value={selectedSlot} onChange={(e) => setSelectedSlot(e.target.value)} className="form-input" required disabled={!selectedEmployee || !selectedDate}>
              <option value="">Selecione um horário</option>
              {availableSlots.length > 0 ? (
                availableSlots.map((slot) => (
                  <option key={slot} value={slot}>{slot}</option>
                ))
              ) : (
                <option disabled>Nenhum horário disponível</option>
              )}
            </select>
          </div>

          <button type="submit" className="btn btn-primary w-full">Confirmar Agendamento</button>
        </form>
      </div>

      {/* Seção de Meus Agendamentos */}
      <div className="card">
        <h3 className="text-2xl font-semibold mb-4">Meus Agendamentos</h3>
        <div className="space-y-4">
          {myAppointments.length > 0 ? (
            myAppointments.map(app => (
              <div key={app._id} className="bg-gray-50 p-4 rounded-lg shadow-sm border">
                <p><strong>Serviço:</strong> {app.service?.name || 'N/A'}</p>
                <p><strong>Profissional:</strong> {app.employee?.name || 'N/A'}</p>
                <p><strong>Data:</strong> {new Date(app.date).toLocaleDateString('pt-BR', { timeZone: 'UTC' })}</p>
                <p><strong>Horário:</strong> {app.startTime}</p>
                <div className="flex items-center gap-2 mt-2">
                  <strong>Status:</strong>
                  <select 
                    value={app.status}
                    onChange={(e) => handleStatusUpdate(app._id, e.target.value)}
                    className="form-input w-auto"
                  >
                    <option value="pending">Pendente</option>
                    <option value="confirmed">Confirmado</option>
                    <option value="completed">Concluído</option>
                    <option value="cancelled">Cancelado</option>
                  </select>
                </div>
                <button 
                  onClick={() => handleDelete(app._id)} 
                  className="btn btn-danger mt-4 text-sm"
                >
                  Excluir
                </button>
              </div>
            ))
          ) : (
            <p>Você não tem nenhum agendamento.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AppointmentsPage;
