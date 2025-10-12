import React, { useState, useEffect } from 'react';
import axios from 'axios';
import authService from '../services/authService';

/**
 * @function CustomerDashboard
 * @description Componente do painel do cliente, exibindo seus agendamentos existentes.
 * @returns {JSX.Element} O componente React do painel do cliente.
 */
const CustomerDashboard = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Função para buscar os agendamentos do cliente
    const fetchAppointments = async () => {
      try {
        setLoading(true);
        const response = await axios.get('/api/appointments/my-appointments');
        setAppointments(response.data);
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || 'Erro ao buscar agendamentos');
        setLoading(false);
      }
    };

    fetchAppointments();
  }, []);

  // Função para atualizar o status de um agendamento
  const handleStatusChange = async (appointmentId, newStatus) => {
    try {
      await axios.put(`/api/appointments/${appointmentId}`, { status: newStatus });
      
      // Atualiza a lista de agendamentos após a mudança de status
      setAppointments(appointments.map(app => 
        app._id === appointmentId ? { ...app, status: newStatus } : app
      ));
    } catch (err) {
      setError(err.response?.data?.message || 'Erro ao atualizar status');
    }
  };

  // Função para cancelar um agendamento
  const handleCancelAppointment = async (appointmentId) => {
    if (window.confirm('Tem certeza que deseja cancelar este agendamento?')) {
      try {
        await axios.put(`/api/appointments/${appointmentId}`, { status: 'cancelled' });
        
        // Atualiza a lista de agendamentos após o cancelamento
        setAppointments(appointments.map(app => 
          app._id === appointmentId ? { ...app, status: 'cancelled' } : app
        ));
      } catch (err) {
        setError(err.response?.data?.message || 'Erro ao cancelar agendamento');
      }
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 mt-16">
      <h2 className="text-2xl font-semibold mb-4">Meus Agendamentos</h2>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      <div className="bg-white p-6 rounded-lg shadow-lg">
        {loading ? (
          <p className="text-center">Carregando seus agendamentos...</p>
        ) : appointments.length > 0 ? (
          <div className="space-y-4">
            {appointments.map((appointment) => (
              <div key={appointment._id} className="bg-gray-50 p-4 rounded-lg shadow-md">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  <p><strong>Profissional:</strong> {appointment.employee?.name || 'N/A'}</p>
                  <p><strong>Serviço:</strong> {appointment.service?.name || 'N/A'}</p>
                  <p><strong>Data:</strong> {new Date(appointment.date).toLocaleDateString()}</p>
                  <p><strong>Horário:</strong> {appointment.startTime} - {appointment.endTime}</p>
                </div>
                
                <div className="mt-3 flex items-center justify-between">
                  <div className="flex items-center">
                    <span className="mr-2"><strong>Status:</strong></span>
                    <select 
                      value={appointment.status}
                      onChange={(e) => handleStatusChange(appointment._id, e.target.value)}
                      className="border rounded px-2 py-1 text-sm"
                      disabled={appointment.status === 'completed' || appointment.status === 'cancelled'}
                    >
                      <option value="pending">Pendente</option>
                      <option value="confirmed">Confirmado</option>
                      <option value="completed">Concluído</option>
                      <option value="cancelled">Cancelado</option>
                    </select>
                  </div>
                  
                  {appointment.status !== 'cancelled' && appointment.status !== 'completed' && (
                    <button 
                      onClick={() => handleCancelAppointment(appointment._id)}
                      className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm"
                    >
                      Cancelar
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center">Você não tem nenhum agendamento.</p>
        )}
      </div>
    </div>
  );
};

export default CustomerDashboard;
