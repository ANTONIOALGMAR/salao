export const renderAdminServicesPage = (adminContentArea, userInfo, showServicesPage) => {
  adminContentArea.innerHTML = `
    <div id="admin-services-container" class="bg-gray-100 p-6 rounded-lg shadow-md">
      <h3 class="text-xl font-semibold mb-4">Adicionar Novo Serviço</h3>
      <form id="add-service-form" class="mb-8">
        <div class="mb-4">
          <label for="service-name" class="block text-gray-700 text-sm font-bold mb-2">Nome:</label>
          <input type="text" id="service-name" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" required>
        </div>
        <div class="mb-4">
          <label for="service-description" class="block text-gray-700 text-sm font-bold mb-2">Descrição:</label>
          <textarea id="service-description" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"></textarea>
        </div>
        <div class="mb-4">
          <label for="service-price" class="block text-gray-700 text-sm font-bold mb-2">Preço:</label>
          <input type="number" id="service-price" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" step="0.01" required>
        </div>
        <div class="mb-4">
          <label for="service-duration" class="block text-gray-700 text-sm font-bold mb-2">Duração (minutos):</label>
          <input type="number" id="service-duration" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" required>
        </div>
        <button type="submit" class="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">Adicionar Serviço</button>
      </form>

      <div id="edit-service-form-container" class="hidden bg-white p-6 rounded-lg shadow-md mb-8">
        <h3 class="text-xl font-semibold mb-4">Editar Serviço</h3>
        <form id="edit-service-form">
          <input type="hidden" id="edit-service-id">
          <div class="mb-4">
            <label for="edit-service-name" class="block text-gray-700 text-sm font-bold mb-2">Nome:</label>
            <input type="text" id="edit-service-name" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" required>
          </div>
          <div class="mb-4">
            <label for="edit-service-description" class="block text-gray-700 text-sm font-bold mb-2">Descrição:</label>
            <textarea id="edit-service-description" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"></textarea>
          </div>
          <div class="mb-4">
            <label for="edit-service-price" class="block text-gray-700 text-sm font-bold mb-2">Preço:</label>
            <input type="number" id="edit-service-price" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" step="0.01" required>
          </div>
          <div class="mb-4">
            <label for="edit-service-duration" class="block text-gray-700 text-sm font-bold mb-2">Duração (minutos):</label>
            <input type="number" id="edit-service-duration" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" required>
          </div>
          <div class="flex items-center justify-between">
            <button type="submit" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">Salvar Alterações</button>
            <button type="button" id="cancel-edit-btn" class="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">Cancelar</button>
          </div>
        </form>
      </div>

      <h3 class="text-xl font-semibold mb-4">Serviços Existentes</h3>
      <div id="admin-services-list" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <p>Carregando serviços...</p>
      </div>
    </div>
  `;

  const addServiceForm = document.getElementById('add-service-form');
  const editServiceFormContainer = document.getElementById('edit-service-form-container');
  const editServiceForm = document.getElementById('edit-service-form');
  const cancelEditBtn = document.getElementById('cancel-edit-btn');
  const adminServicesListDiv = document.getElementById('admin-services-list');

  const fetchAdminServices = async () => {
    try {
      const res = await fetch('/api/services');
      const services = await res.json();

      if (res.ok) {
        if (services.length > 0) {
          adminServicesListDiv.innerHTML = services.map(service => `
            <div class="bg-white p-4 rounded-lg shadow-md">
              <h3 class="text-xl font-bold mb-2">${service.name}</h3>
              <p class="text-gray-700 mb-2">${service.description}</p>
              <p class="text-lg font-semibold text-blue-600">R$ ${service.price.toFixed(2)}</p>
              <p class="text-sm text-gray-500">Duração: ${service.duration} minutos</p>
              <button class="mt-4 bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded edit-service-btn" data-id="${service._id}" data-name="${service.name}" data-description="${service.description}" data-price="${service.price}" data-duration="${service.duration}">Editar</button>
              <button class="mt-4 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded delete-service-btn" data-id="${service._id}">Excluir</button>
            </div>
          `).join('');

          // Add event listeners for edit/delete buttons
          document.querySelectorAll('.edit-service-btn').forEach(button => {
            button.addEventListener('click', (e) => {
              const serviceId = e.target.dataset.id;
              const serviceName = e.target.dataset.name;
              const serviceDescription = e.target.dataset.description;
              const servicePrice = parseFloat(e.target.dataset.price);
              const serviceDuration = parseInt(e.target.dataset.duration);

              // Populate edit form
              document.getElementById('edit-service-id').value = serviceId;
              document.getElementById('edit-service-name').value = serviceName;
              document.getElementById('edit-service-description').value = serviceDescription;
              document.getElementById('edit-service-price').value = servicePrice;
              document.getElementById('edit-service-duration').value = serviceDuration;

              // Show edit form
              editServiceFormContainer.classList.remove('hidden');
            });
          });
          document.querySelectorAll('.delete-service-btn').forEach(button => {
            button.addEventListener('click', async (e) => {
              const serviceId = e.target.dataset.id;
              if (confirm('Tem certeza que deseja excluir este serviço?')) {
                try {
                  const deleteRes = await fetch(`/api/services/${serviceId}`, {
                    method: 'DELETE',
                    headers: {
                      Authorization: `Bearer ${userInfo.token}`,
                    },
                  });
                  if (deleteRes.ok) {
                    alert('Serviço excluído com sucesso!');
                    fetchAdminServices(); // Refresh list
                    showServicesPage(); // Refresh public services page
                  } else {
                    const errorData = await deleteRes.json();
                    alert(errorData.message || 'Erro ao excluir serviço.');
                  }
                } catch (error) {
                  console.error('Erro ao excluir serviço:', error);
                  alert('Erro ao excluir serviço.');
                }
              }
            });
          });

        } else {
          adminServicesListDiv.innerHTML = '<p>Nenhum serviço disponível para gerenciar.</p>';
        }
      } else {
        adminServicesListDiv.innerHTML = `<p>Erro ao carregar serviços: ${services.message || 'Erro desconhecido'}</p>`;
      }
    } catch (error) {
      console.error('Erro ao buscar serviços:', error);
      adminServicesListDiv.innerHTML = '<p>Erro ao buscar serviços. Tente novamente mais tarde.</p>';
    }
  };

  addServiceForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = document.getElementById('service-name').value;
    const description = document.getElementById('service-description').value;
    const price = parseFloat(document.getElementById('service-price').value);
    const duration = parseInt(document.getElementById('service-duration').value);

    if (!name || !price || !duration) {
      alert('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    try {
      const res = await fetch('/api/services', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userInfo.token}`,
        },
        body: JSON.stringify({ name, description, price, duration }),
      });

      const data = await res.json();

      if (res.ok) {
        alert('Serviço adicionado com sucesso!');
        addServiceForm.reset();
        fetchAdminServices(); // Refresh list
        showServicesPage(); // Refresh public services page
      } else {
        alert(data.message || 'Erro ao adicionar serviço.');
      }
    } catch (error) {
      console.error('Erro ao adicionar serviço:', error);
      alert('Erro ao adicionar serviço. Tente novamente.');
    }
  });

  cancelEditBtn.addEventListener('click', () => {
    editServiceFormContainer.classList.add('hidden');
    editServiceForm.reset();
  });

  editServiceForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const serviceId = document.getElementById('edit-service-id').value;
    const name = document.getElementById('edit-service-name').value;
    const description = document.getElementById('edit-service-description').value;
    const price = parseFloat(document.getElementById('edit-service-price').value);
    const duration = parseInt(document.getElementById('edit-service-duration').value);

    if (!name || !price || !duration) {
      alert('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    try {
      const res = await fetch(`/api/services/${serviceId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userInfo.token}`,
        },
        body: JSON.stringify({ name, description, price, duration }),
      });

      const data = await res.json();

      if (res.ok) {
        alert('Serviço atualizado com sucesso!');
        editServiceFormContainer.classList.add('hidden');
        editServiceForm.reset();
        fetchAdminServices(); // Refresh list
        showServicesPage(); // Refresh public services page
      } else {
        alert(data.message || 'Erro ao atualizar serviço.');
      }
    } catch (error) {
      console.error('Erro ao atualizar serviço:', error);
      alert('Erro ao atualizar serviço. Tente novamente.');
    }
  });

  fetchAdminServices();
};