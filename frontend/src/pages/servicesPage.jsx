import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

/**
 * @function ServicesPage
 * @description Componente da página de serviços, buscando e exibindo a lista de serviços disponíveis.
 * @returns {JSX.Element} O componente React da página de serviços.
 */
const ServicesPage = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Função para buscar os serviços da API
    const fetchServices = async () => {
      try {
        const response = await axios.get('/api/services');
        setServices(response.data);
        setLoading(false);
      } catch (err) {
        setError('Erro ao carregar serviços. Por favor, tente novamente mais tarde.');
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  return (
    <div>
      <h2 className="text-3xl font-bold mb-6">Nossos Serviços</h2>
      
      {loading ? (
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : error ? (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.length > 0 ? (
            services.map((service) => (
              <div key={service._id} className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                <h3 className="text-xl font-bold mb-2">{service.name}</h3>
                <p className="text-gray-700 mb-4">{service.description}</p>
                <div className="flex justify-between items-center mb-4">
                  <p className="text-lg font-semibold text-blue-600">R$ {service.price.toFixed(2)}</p>
                  <p className="text-sm text-gray-500">Duração: {service.duration} minutos</p>
                </div>
                <Link 
                  to={`/agendamentos?service=${service._id}`} 
                  className="block w-full text-center bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                >
                  Agendar
                </Link>
              </div>
            ))
          ) : (
            <p className="col-span-3 text-center text-gray-500">Nenhum serviço disponível no momento.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default ServicesPage;
