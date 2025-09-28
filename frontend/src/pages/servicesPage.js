// Importa a função para buscar serviços da API
import { getServices } from '../services/serviceService';

/**
 * @function showServicesPage
 * @description Renderiza a página de serviços, buscando e exibindo a lista de serviços disponíveis.
 * @param {function} renderContent - Função para renderizar o conteúdo principal na div #content.
 */
const showServicesPage = async (renderContent) => {
  renderContent(`
    <h2 class="text-2xl font-semibold mb-4">Nossos Serviços</h2>
    <div id="services-list" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <!-- Os serviços serão carregados aqui -->
      <p>Carregando serviços...</p>
    </div>
  `);

  // Obtém a div onde a lista de serviços será exibida
  const servicesListDiv = document.getElementById('services-list');

  try {
    // Busca os serviços da API
    const services = await getServices();

    // Verifica se há serviços para exibir
    if (services.length > 0) {
      // Mapeia os serviços para o formato HTML e insere na div
      servicesListDiv.innerHTML = services
        .map(
          (service) => `
        <div class="bg-white p-4 rounded-lg shadow-md">
          <h3 class="text-xl font-bold mb-2">${service.name}</h3>
          <p class="text-gray-700 mb-2">${service.description}</p>
          <p class="text-lg font-semibold text-blue-600">R$ ${service.price.toFixed(2)}</p>
          <p class="text-sm text-gray-500">Duração: ${service.duration} minutos</p>
          <button class="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Agendar</button>
        </div>
      `,
        )
        .join('');
    } else {
      // Mensagem exibida se não houver serviços
      servicesListDiv.innerHTML =
        '<p>Nenhum serviço disponível no momento.</p>';
    }
  } catch (error) {
    // Exibe mensagem de erro caso a busca falhe
    servicesListDiv.innerHTML = `<p>${error.message}</p>`;
  }
};

export { showServicesPage };
