import React, { useState, useEffect } from 'react';
import loyaltyService from '../services/loyaltyService';

const LoyaltyPage = () => {
  const [points, setPoints] = useState(0);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const pointsData = await loyaltyService.getPoints();
        const transactionsData = await loyaltyService.getTransactions();
        setPoints(pointsData.loyaltyPoints);
        setTransactions(transactionsData);
      } catch (err) {
        setError(err.message || 'Erro ao carregar dados de fidelidade.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return <div className="text-center p-8">Carregando seus pontos...</div>;
  }

  if (error) {
    return <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded m-4"><b>Erro:</b> {error}</div>;
  }

  return (
    <div className="container mx-auto p-4 space-y-8">
      <div className="card text-center">
        <h2 className="text-xl font-semibold text-gray-600 mb-2">Seu Saldo de Pontos</h2>
        <p className="text-5xl font-bold text-blue-600">{points}</p>
        <p className="text-gray-500 mt-2">Continue frequentando nosso salão para ganhar mais!</p>
      </div>

      <div className="card">
        <h3 className="text-2xl font-semibold mb-4">Histórico de Transações</h3>
        <div className="space-y-4">
          {transactions.length > 0 ? (
            transactions.map(tx => (
              <div key={tx._id} className={`p-4 rounded-lg shadow-sm border-l-4 ${tx.type === 'earn' ? 'border-green-500' : 'border-red-500'}`}>
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-bold">{tx.description}</p>
                    <p className="text-sm text-gray-500">{formatDate(tx.createdAt)}</p>
                  </div>
                  <p className={`text-xl font-bold ${tx.type === 'earn' ? 'text-green-600' : 'text-red-600'}`}>
                    {tx.type === 'earn' ? '+' : ''}{tx.points}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <p>Você ainda não possui transações no programa de fidelidade.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default LoyaltyPage;
