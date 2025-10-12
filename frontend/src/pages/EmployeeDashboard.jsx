import React, { useState, useEffect } from 'react';
import axios from 'axios';
import authService from '../services/authService';

/**
 * @function EmployeeDashboard
 * @description Componente para o dashboard do funcionário
 * @returns {JSX.Element} O componente React para o dashboard do funcionário
 */
const EmployeeDashboard = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEmployeeAppointments = async () => {
      try {
        setLoading(true);
        const userInfo = authService.getCurrentUser();
        if (!userInfo) {
          setError('Usuário não autenticado');
          setLoading(false);
          return;
        }

        const { data } = await axios.get(`/api/appointments/employee/${userInfo._id}`);
        setAppointments(data);
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || 'Erro ao carregar agendamentos');
        setLoading(false);
      }
    };

    fetchEmployeeAppointments();
  }, []);

  const updateAppointmentStatus = async (id, status) => {
    try {
      await axios.put(`/api/appointments/${id}/status`, { status });
      
      // Atualiza a lista de agendamentos
      setAppointments(appointments.map(appointment => 
        appointment._id === id ? { ...appointment, status } : appointment
      ));
    } catch (err) {
      setError(err.response?.data?.message || 'Erro ao atualizar status do agendamento');
    }
  };

  const formatDate = (dateString) => {
    const options = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString('pt-BR', options);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold mb-6">Dashboard do Funcionário</h2>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <div className="bg-white shadow-md rounded-lg p-6">
        <h3 className="text-xl font-semibold mb-4">Meus Agendamentos</h3>
        
        {loading ? (
          <div className="text-center py-4">
            <div className="spinner"></div>
            <p>Carregando agendamentos...</p>
          </div>
        ) : appointments.length === 0 ? (
          <p className="text-gray-500">Você não possui agendamentos.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white">
              <thead>
                <tr className="bg-gray-100 text-gray-600 uppercase text-sm leading-normal">
                  <th className="py-3 px-6 text-left">Cliente</th>
                  <th className="py-3 px-6 text-left">Serviço</th>
                  <th className="py-3 px-6 text-left">Data/Hora</th>
                  <th className="py-3 px-6 text-left">Status</th>
                  <th className="py-3 px-6 text-center">Ações</th>
                </tr>
              </thead>
              <tbody className="text-gray-600 text-sm">
                {appointments.map((appointment) => (
                  <tr key={appointment._id} className="border-b border-gray-200 hover:bg-gray-50">
                    <td className="py-3 px-6 text-left">
                      {appointment.client?.name || 'Cliente não disponível'}
                    </td>
                    <td className="py-3 px-6 text-left">
                      {appointment.service?.name || 'Serviço não disponível'}
                    </td>
                    <td className="py-3 px-6 text-left">
                      {formatDate(appointment.dateTime)}
                    </td>
                    <td className="py-3 px-6 text-left">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        appointment.status === 'confirmed' ? 'bg-green-200 text-green-800' :
                        appointment.status === 'pending' ? 'bg-yellow-200 text-yellow-800' :
                        'bg-red-200 text-red-800'
                      }`}>
                        {appointment.status === 'confirmed' ? 'Confirmado' :
                         appointment.status === 'pending' ? 'Pendente' : 'Cancelado'}
                      </span>
                    </td>
                    <td className="py-3 px-6 text-center">
                      <div className="flex item-center justify-center space-x-2">
                        {appointment.status === 'pending' && (
                          <>
                            <button
                              onClick={() => updateAppointmentStatus(appointment._id, 'confirmed')}
                              className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-xs"
                            >
                              Confirmar
                            </button>
                            <button
                              onClick={() => updateAppointmentStatus(appointment._id, 'cancelled')}
                              className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-xs"
                            >
                              Cancelar
                            </button>
                          </>
                        )}
                        {appointment.status === 'confirmed' && (
                          <button
                            onClick={() => updateAppointmentStatus(appointment._id, 'completed')}
                            className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-xs"
                          >
                            Concluído
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmployeeDashboard;