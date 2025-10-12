import axios from 'axios';

/**
 * Obtém o saldo de pontos de fidelidade do usuário logado.
 * @returns {Promise<Object>} - Uma promessa que resolve com o saldo de pontos.
 */
const getPoints = async () => {
  try {
    const response = await axios.get('/api/loyalty/points');
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || 'Erro ao buscar saldo de pontos.';
  }
};

/**
 * Obtém o histórico de transações de fidelidade do usuário logado.
 * @returns {Promise<Array>} - Uma promessa que resolve com a lista de transações.
 */
const getTransactions = async () => {
  try {
    const response = await axios.get('/api/loyalty/transactions');
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || 'Erro ao buscar histórico de transações.';
  }
};

const loyaltyService = {
  getPoints,
  getTransactions,
};

export default loyaltyService;
