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
