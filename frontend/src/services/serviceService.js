/**
 * @function getServices
 * @description Busca todos os serviços disponíveis na API.
 * @returns {Promise<Array>} Uma promessa que resolve com uma lista de objetos de serviço.
 * @throws {Error} Se a requisição falhar ou retornar um erro.
 */
const getServices = async () => {
  try {
    const res = await fetch('/api/services');
    const services = await res.json();
    if (res.ok) {
      return services;
    } else {
      throw new Error(services.message || 'Erro ao carregar serviços');
    }
  } catch (error) {
    console.error('Erro ao buscar serviços:', error);
    throw error;
  }
};

export { getServices };
