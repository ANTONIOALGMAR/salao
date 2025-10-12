import React, { useState, useEffect } from 'react';
import axios from 'axios';
import authService from '../services/authService';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('services');
  const [services, setServices] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Estado para o formulário de serviço
  const [serviceForm, setServiceForm] = useState({
    name: '',
    description: '',
    price: '',
    duration: '',
    id: null
  });

  // Carregar dados quando o componente montar
  useEffect(() => {
    if (activeTab === 'services') {
      fetchServices();
    } else if (activeTab === 'appointments') {
      fetchAppointments();
    }
  }, [activeTab]);

  // Buscar serviços
  const fetchServices = async () => {
    setLoading(true);
    try {
      const response = await axios.get('/api/services');
      setServices(response.data);
      setError(null);
    } catch (err) {
      setError('Erro ao carregar serviços: ' + err.message);
      console.error('Erro ao carregar serviços:', err);
    } finally {
      setLoading(false);
    }
  };

  // Buscar agendamentos
  const fetchAppointments = async () => {
    setLoading(true);
    try {
      const response = await axios.get('/api/appointments');
      setAppointments(response.data);
      setError(null);
    } catch (err) {
      setError('Erro ao carregar agendamentos: ' + err.message);
      console.error('Erro ao carregar agendamentos:', err);
    } finally {
      setLoading(false);
    }
  };

  // Manipular mudanças no formulário de serviço
  const handleServiceFormChange = (e) => {
    const { name, value } = e.target;
    setServiceForm({
      ...serviceForm,
      [name]: value
    });
  };

  // Adicionar ou atualizar serviço
  const handleServiceSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const serviceData = {
        name: serviceForm.name,
        description: serviceForm.description,
        price: parseFloat(serviceForm.price),
        duration: parseInt(serviceForm.duration)
      };
      
      if (serviceForm.id) {
        // Atualizar serviço existente
        await axios.put(`/api/services/${serviceForm.id}`, serviceData);
      } else {
        // Adicionar novo serviço
        await axios.post('/api/services', serviceData);
      }
      
      // Resetar formulário e recarregar serviços
      setServiceForm({
        name: '',
        description: '',
        price: '',
        duration: '',
        id: null
      });
      
      fetchServices();
      setError(null);
    } catch (err) {
      setError('Erro ao salvar serviço: ' + err.message);
      console.error('Erro ao salvar serviço:', err);
    } finally {
      setLoading(false);
    }
  };

  // Editar serviço
  const handleEditService = (service) => {
    setServiceForm({
      name: service.name,
      description: service.description,
      price: service.price.toString(),
      duration: service.duration.toString(),
      id: service._id
    });
  };

  // Excluir serviço
  const handleDeleteService = async (id) => {
    if (window.confirm('Tem certeza que deseja excluir este serviço?')) {
      setLoading(true);
      try {
        await axios.delete(`/api/services/${id}`);
        fetchServices();
        setError(null);
      } catch (err) {
        setError('Erro ao excluir serviço: ' + err.message);
        console.error('Erro ao excluir serviço:', err);
      } finally {
        setLoading(false);
      }
    }
  };

  // Atualizar status do agendamento
  const handleUpdateAppointmentStatus = async (id, status) => {
    setLoading(true);
    try {
      await axios.put(`/api/appointments/${id}/status`, { status });
      fetchAppointments();
      setError(null);
    } catch (err) {
      setError('Erro ao atualizar status: ' + err.message);
      console.error('Erro ao atualizar status:', err);
    } finally {
      setLoading(false);
    }
  };

  // Excluir agendamento
  const handleDeleteAppointment = async (id) => {
    if (window.confirm('Tem certeza que deseja excluir este agendamento?')) {
      setLoading(true);
      try {
        await axios.delete(`/api/appointments/${id}`);
        fetchAppointments();
        setError(null);
      } catch (err) {
        setError('Erro ao excluir agendamento: ' + err.message);
        console.error('Erro ao excluir agendamento:', err);
      } finally {
        setLoading(false);
      }
    }
  };

  // Formatar data
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
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Dashboard do Administrador</h1>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      {/* Abas de navegação */}
      <div className="flex border-b mb-4">
        <button 
          className={`py-2 px-4 mr-2 ${activeTab === 'services' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          onClick={() => setActiveTab('services')}
        >
          Gerenciar Serviços
        </button>
        <button 
          className={`py-2 px-4 ${activeTab === 'appointments' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          onClick={() => setActiveTab('appointments')}
        >
          Gerenciar Agendamentos
        </button>
      </div>
      
      {/* Conteúdo da aba de serviços */}
      {activeTab === 'services' && (
        <div>
          <h2 className="text-2xl font-semibold mb-4">Serviços</h2>
          
          {/* Formulário para adicionar/editar serviço */}
          <div className="bg-gray-100 p-4 rounded mb-6">
            <h3 className="text-xl mb-2">{serviceForm.id ? 'Editar Serviço' : 'Adicionar Novo Serviço'}</h3>
            <form onSubmit={handleServiceSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block mb-1">Nome</label>
                  <input
                    type="text"
                    name="name"
                    value={serviceForm.name}
                    onChange={handleServiceFormChange}
                    className="w-full p-2 border rounded"
                    required
                  />
                </div>
                <div>
                  <label className="block mb-1">Descrição</label>
                  <input
                    type="text"
                    name="description"
                    value={serviceForm.description}
                    onChange={handleServiceFormChange}
                    className="w-full p-2 border rounded"
                    required
                  />
                </div>
                <div>
                  <label className="block mb-1">Preço (R$)</label>
                  <input
                    type="number"
                    name="price"
                    value={serviceForm.price}
                    onChange={handleServiceFormChange}
                    className="w-full p-2 border rounded"
                    step="0.01"
                    min="0"
                    required
                  />
                </div>
                <div>
                  <label className="block mb-1">Duração (minutos)</label>
                  <input
                    type="number"
                    name="duration"
                    value={serviceForm.duration}
                    onChange={handleServiceFormChange}
                    className="w-full p-2 border rounded"
                    min="1"
                    required
                  />
                </div>
              </div>
              <button 
                type="submit" 
                className="mt-4 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
                disabled={loading}
              >
                {loading ? 'Salvando...' : serviceForm.id ? 'Atualizar Serviço' : 'Adicionar Serviço'}
              </button>
              {serviceForm.id && (
                <button 
                  type="button" 
                  className="mt-4 ml-2 bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600"
                  onClick={() => setServiceForm({
                    name: '',
                    description: '',
                    price: '',
                    duration: '',
                    id: null
                  })}
                >
                  Cancelar Edição
                </button>
              )}
            </form>
          </div>
          
          {/* Lista de serviços */}
          {loading && <p>Carregando serviços...</p>}
          
          {!loading && services.length === 0 && (
            <p>Nenhum serviço cadastrado.</p>
          )}
          
          {!loading && services.length > 0 && (
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white">
                <thead>
                  <tr>
                    <th className="py-2 px-4 border-b">Nome</th>
                    <th className="py-2 px-4 border-b">Descrição</th>
                    <th className="py-2 px-4 border-b">Preço</th>
                    <th className="py-2 px-4 border-b">Duração</th>
                    <th className="py-2 px-4 border-b">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {services.map(service => (
                    <tr key={service._id}>
                      <td className="py-2 px-4 border-b">{service.name}</td>
                      <td className="py-2 px-4 border-b">{service.description}</td>
                      <td className="py-2 px-4 border-b">R$ {service.price.toFixed(2)}</td>
                      <td className="py-2 px-4 border-b">{service.duration} min</td>
                      <td className="py-2 px-4 border-b">
                        <button 
                          onClick={() => handleEditService(service)}
                          className="bg-yellow-500 text-white py-1 px-2 rounded mr-2 hover:bg-yellow-600"
                        >
                          Editar
                        </button>
                        <button 
                          onClick={() => handleDeleteService(service._id)}
                          className="bg-red-500 text-white py-1 px-2 rounded hover:bg-red-600"
                        >
                          Excluir
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
      
      {/* Conteúdo da aba de agendamentos */}
      {activeTab === 'appointments' && (
        <div>
          <h2 className="text-2xl font-semibold mb-4">Agendamentos</h2>
          
          {loading && <p>Carregando agendamentos...</p>}
          
          {!loading && appointments.length === 0 && (
            <p>Nenhum agendamento encontrado.</p>
          )}
          
          {!loading && appointments.length > 0 && (
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white">
                <thead>
                  <tr>
                    <th className="py-2 px-4 border-b">Cliente</th>
                    <th className="py-2 px-4 border-b">Serviço</th>
                    <th className="py-2 px-4 border-b">Data/Hora</th>
                    <th className="py-2 px-4 border-b">Status</th>
                    <th className="py-2 px-4 border-b">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {appointments.map(appointment => (
                    <tr key={appointment._id}>
                      <td className="py-2 px-4 border-b">
                        {appointment.user ? appointment.user.name : 'Cliente não encontrado'}
                      </td>
                      <td className="py-2 px-4 border-b">
                        {appointment.service ? appointment.service.name : 'Serviço não encontrado'}
                      </td>
                      <td className="py-2 px-4 border-b">
                        {formatDate(appointment.dateTime)}
                      </td>
                      <td className="py-2 px-4 border-b">
                        <span className={`px-2 py-1 rounded text-white ${
                          appointment.status === 'confirmado' ? 'bg-green-500' : 
                          appointment.status === 'pendente' ? 'bg-yellow-500' : 
                          appointment.status === 'cancelado' ? 'bg-red-500' : 
                          'bg-gray-500'
                        }`}>
                          {appointment.status}
                        </span>
                      </td>
                      <td className="py-2 px-4 border-b">
                        <div className="flex flex-col sm:flex-row gap-1">
                          <button 
                            onClick={() => handleUpdateAppointmentStatus(appointment._id, 'confirmado')}
                            className="bg-green-500 text-white py-1 px-2 rounded hover:bg-green-600"
                            disabled={appointment.status === 'confirmado'}
                          >
                            Confirmar
                          </button>
                          <button 
                            onClick={() => handleUpdateAppointmentStatus(appointment._id, 'cancelado')}
                            className="bg-red-500 text-white py-1 px-2 rounded hover:bg-red-600"
                            disabled={appointment.status === 'cancelado'}
                          >
                            Cancelar
                          </button>
                          <button 
                            onClick={() => handleDeleteAppointment(appointment._id)}
                            className="bg-gray-800 text-white py-1 px-2 rounded hover:bg-gray-900"
                          >
                            Excluir
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;